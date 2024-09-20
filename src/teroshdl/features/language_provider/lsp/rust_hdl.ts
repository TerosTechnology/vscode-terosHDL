/* ------------------------------------------------------------------------------------------
 * MIT License
 * Copyright (c) 2020 Henrik Bohlin
 * Full license text can be found in /LICENSE or at https://opensource.org/licenses/MIT.
 * ------------------------------------------------------------------------------------------ */
'use strict';
import * as fs from 'fs-extra';
import * as path from 'path';
import semver = require('semver');
import vscode = require('vscode');
import { ExtensionContext } from 'vscode';
import util = require('util');
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as utils from '../../utils/utils';

const exec = util.promisify(require('child_process').exec);

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    RevealOutputChannelOn,
    State
} from 'vscode-languageclient/node';
import { e_linter_general_linter_vhdl } from 'colibri/config/config_declaration';


const isWindows = process.platform === 'win32';
const languageServerName = isWindows
    ? 'vhdl_ls-x86_64-pc-windows-msvc'
    : 'vhdl_ls-x86_64-unknown-linux-musl';
const languageServerBinaryName = 'vhdl_ls';
let languageServer: string;

export class Rusthdl_lsp {

    private client: LanguageClient | undefined = undefined;
    private context: ExtensionContext;
    private languageServerDisposable;
    private manager: Multi_project_manager;
    public stop_client: boolean = false;
    private errorCounter = 0;

    constructor(context: ExtensionContext, manager: Multi_project_manager) {
        this.context = context;
        this.manager = manager;

        this.context.subscriptions.push(
            vscode.commands.registerCommand('teroshdl.vhdlls.restart', async () => {
                if (this.client != undefined && this.client.isRunning() && this.client.state === State.Running) {
                    try {
                        await this.client.restart();
                    }
                    catch (error) {
                        this.errorCounter++;
                        this.client.dispose();
                        this.client = undefined;
                        console.log(error);
                        if (this.errorCounter < 5) {
                            await this.run_rusthdl();
                        }
                    }
                }
            })
        );
    }

    async run_rusthdl() : Promise<boolean> {
        const languageServerDir = this.context.asAbsolutePath(
            path.join('server', 'vhdl_ls')
        );
        const current_language_server_version = this.embeddedVersion(languageServerDir);

        languageServer = path.join(
            'server',
            'vhdl_ls',
            current_language_server_version,
            languageServerName,
            'bin',
            languageServerBinaryName + (isWindows ? '.exe' : '')
        );
        // Get language server configuration and command to start server
        let serverOptions: ServerOptions;
        serverOptions = this.getServerOptionsEmbedded(this.context);

        // Options to control the language client
        let clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'file', language: 'vhdl' }],
            revealOutputChannelOn: RevealOutputChannelOn.Never,
        };

        // Create the language client
        this.client = new LanguageClient(
            'vhdlls',
            'VHDL LS',
            serverOptions,
            clientOptions
        );

        let server_path = this.context.asAbsolutePath(languageServer);
        let is_alive = await this.check_rust_hdl(server_path);
        if (is_alive === false) {
            return false;
        }

        // Start the client. This will also launch the server
        this.languageServerDisposable = await this.client.start();
        this.context.subscriptions.push(this.languageServerDisposable);
        
        return true;
    }

    async check_rust_hdl(rust_hdl_bin_path: string) {
        let command = rust_hdl_bin_path + ' --version';
        // eslint-disable-next-line no-console
        console.log(`[colibri][info] Linting with command: ${command}`);
        const exec = require('child_process').exec;
        return new Promise((resolve) => {
            exec(command, (err, stdout, stderr) => {
                if (stderr !== '') {
                    console.log(`[rusthdl][error] ${stderr}`);
                }
                if (stderr === '') {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }

    deactivate(): Thenable<void> | undefined {
        console.log("TerosHDL deactivate!");
        if (!this.client) {
            return undefined;
        }
        let promises = [this.client.stop()];
        return Promise.all(promises).then(() => undefined);
    }

    embeddedVersion(languageServerDir: string): string {
        try {
            return fs
                .readdirSync(languageServerDir)
                .reduce((version: string, dir: string) => {
                    if (semver.gt(dir, version)) {
                        return dir;
                    } else {
                        return version;
                    }
                }, '0.0.0');
        } catch {
            return '0.0.0';
        }
    }

    getServerOptionsEmbedded(context: ExtensionContext) {
        const config = utils.getConfig(this.manager);
        const linter_name = config.linter.general.linter_vhdl;
        let args: string[] = [];
        if (linter_name !== e_linter_general_linter_vhdl.none) {
            args = ['--no-lint'];
        }
        args.push("--silent");

        let serverCommand = context.asAbsolutePath(languageServer);
        let serverOptions: ServerOptions = {
            run: {
                command: serverCommand,
                args: args
            },
            debug: {
                command: serverCommand,
                args: args
            },
        };
        return serverOptions;
    }
}