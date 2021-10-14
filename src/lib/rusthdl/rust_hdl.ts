/* eslint-disable @typescript-eslint/class-name-casing */
/* ------------------------------------------------------------------------------------------
 * MIT License
 * Copyright (c) 2020 Henrik Bohlin
 * Full license text can be found in /LICENSE or at https://opensource.org/licenses/MIT.
 * ------------------------------------------------------------------------------------------ */
'use strict';
import extract = require('extract-zip');
import * as fs from 'fs-extra';
import * as path from 'path';
import semver = require('semver');
import vscode = require('vscode');
import { ExtensionContext, window } from 'vscode';
import * as config_reader_lib from "../utils/config_reader";

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';


const isWindows = process.platform === 'win32';
const languageServerName = isWindows
    ? 'vhdl_ls-x86_64-pc-windows-msvc'
    : 'vhdl_ls-x86_64-unknown-linux-gnu';
const languageServerBinaryName = 'vhdl_ls';
let languageServer: string;

export class Rusthdl_lsp {

    private client!: LanguageClient;
    private context: ExtensionContext;
    private languageServerDisposable;
    private config_reader: config_reader_lib.Config_reader;

    constructor(context: ExtensionContext, config_reader: config_reader_lib.Config_reader) {
        this.context = context;
        this.config_reader = config_reader;
    }

    async run_rusthdl() {
        const languageServerDir = this.context.asAbsolutePath(
            path.join('server', 'vhdl_ls')
        );
        let languageServerVersion = this.embeddedVersion(languageServerDir);
        if (languageServerVersion === '0.0.0') {
            await this.getLatestLanguageServer(60000, this.context);
            languageServerVersion = this.embeddedVersion(languageServerDir);
        }
        languageServer = path.join(
            'server',
            'vhdl_ls',
            languageServerVersion,
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
                const MSG = 'Restarting VHDL LS';
                // output.appendLine(MSG);
                await this.client.stop();
                this.languageServerDisposable.dispose();
                this.languageServerDisposable = this.client.start();
                this.context.subscriptions.push(this.languageServerDisposable);
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

    // deactivate(): Thenable<void> | undefined {
    //     if (!this.client) {
    //         return undefined;
    //     }
    //     return this.client.stop();
    // }

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
                        fs.remove(path.join(languageServerDir, version)).catch(
                            (err: any) => {
                            }
                        );
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
        let linter_name = this.config_reader.get_linter_name('vhdl', 'error');
        let args: string[] = [];
        if (linter_name === 'none') {
            args = ['enable_linter'];
        }

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

    async getLatestLanguageServer(
        timeoutMs: number,
        ctx: ExtensionContext
    ) {
        let latest: string = 'v0.1.8';

        const languageServerAssetName = languageServerName + '.zip';
        const languageServerAsset = ctx.asAbsolutePath(
            path.join('resources', 'rusthdl', 'install', latest, languageServerAssetName)
        );
        if (!fs.existsSync(path.dirname(languageServerAsset))) {
            fs.mkdirSync(path.dirname(languageServerAsset), {
                recursive: true,
            });
        }

        await new Promise<void>((resolve, reject) => {
            const targetDir = ctx.asAbsolutePath(
                path.join('server', 'vhdl_ls', latest)
            );
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            extract(languageServerAsset, { dir: targetDir }, (err) => {
                try {
                    fs.removeSync(
                        ctx.asAbsolutePath(path.join('server', 'install'))
                    );
                } catch { }
                if (err) {
                    try {
                        fs.removeSync(targetDir);
                    } catch { }
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        return Promise.resolve();
    }
}