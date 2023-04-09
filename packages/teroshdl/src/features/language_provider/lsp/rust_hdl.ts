/* eslint-disable @typescript-eslint/class-name-casing */
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
import * as teroshdl2 from 'teroshdl2';
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';

const exec = util.promisify(require('child_process').exec);

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';


const isWindows = process.platform === 'win32';
const languageServerName = isWindows
    ? 'vhdl_ls-x86_64-pc-windows-msvc'
    : 'vhdl_ls-x86_64-unknown-linux-musl';
const languageServerBinaryName = 'vhdl_ls';
let languageServer: string;

export class Rusthdl_lsp {

    private client!: LanguageClient;
    private context: ExtensionContext;
    private languageServerDisposable;
    private manager: Multi_project_manager;
    public stop_client: boolean = false;

    constructor(context: ExtensionContext, manager: Multi_project_manager) {
        this.context = context;
        this.manager = manager;
    }

    async run_rusthdl() {
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
            this.context.subscriptions.push(
                vscode.commands.registerCommand('teroshdl.vhdlls.restart', async () => {
                })
            );
            return false;
        }

        // Start the client. This will also launch the server
        this.languageServerDisposable = this.client.start();

        // Register command to restart language server
        this.context.subscriptions.push(this.languageServerDisposable);
        this.context.subscriptions.push(
            vscode.commands.registerCommand('teroshdl.vhdlls.restart', async () => {
                if (this.stop_client === false) {
                    await this.client.stop();
                    this.languageServerDisposable.dispose();
                    this.languageServerDisposable = this.client.start();
                    this.context.subscriptions.push(this.languageServerDisposable);
                }
            })
        );

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
        const linter_name = this.manager.get_config_manager().get_config().linter.general.linter_vhdl;
        let args: string[] = [];
        if (linter_name !== teroshdl2.config.config_declaration.e_linter_general_linter_vhdl.none) {
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