/* ------------------------------------------------------------------------------------------
 * MIT License
 * Copyright (c) 2020 Henrik Bohlin
 * Full license text can be found in /LICENSE or at https://opensource.org/licenses/MIT.
 * ------------------------------------------------------------------------------------------ */
'use strict';
import * as fs from 'fs-extra';
import * as path from 'path';
import vscode = require('vscode');
import { ExtensionContext } from 'vscode';
import util = require('util');
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as os from 'os';

const exec = util.promisify(require('child_process').exec);

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    RevealOutputChannelOn,
    State
} from 'vscode-languageclient/node';

const isWindows = process.platform === 'win32';
const languageServerBinaryName = 'verible-verilog-ls';
let languageServer: string;

export class Verilbe_lsp {
    private client: LanguageClient | undefined = undefined;
    private context: ExtensionContext;
    private languageServerDisposable;
    private manager: Multi_project_manager;
    public stop_client: boolean = false;
    private errorCounter = 0;

    constructor(context: ExtensionContext, manager: Multi_project_manager, private fileListPath: string) {
        this.context = context;
        this.manager = manager;

        this.context.subscriptions.push(
            vscode.commands.registerCommand('teroshdl.verible.restart', async () => {
                // if (this.client != undefined && this.client.isRunning() && this.client.state === State.Running) {
                //     try {
                //         this.client.stop().finally(async () => {
                //             await this.run();
                //         });
                //     } catch (error) {
                //         this.errorCounter++;
                //         this.client.dispose();
                //         this.client = undefined;
                //         console.log(error);
                //         if (this.errorCounter < 5) {
                //             await this.run();
                //         }
                //     }
                // }
            })
        );
    }

    async run(): Promise<boolean> {
        const languageServerDir = this.context.asAbsolutePath(path.join('server', 'verible'));
        const current_language_server_version = this.embeddedVersion(languageServerDir);

        const bundledPath = path.join(
            'server',
            'verible',
            current_language_server_version,
            languageServerBinaryName + (isWindows ? '.exe' : '')
        );
        // Store the resolved absolute path so getServerOptionsEmbedded can use it directly
        languageServer = this.context.asAbsolutePath(bundledPath);

        let is_alive = await this.check_run(languageServer);
        if (is_alive === false) {
            // Bundled binary failed (e.g. wrong platform); try system-installed verible
            const systemPaths = [
                '/opt/homebrew/bin/verible-verilog-ls',
                '/usr/local/bin/verible-verilog-ls',
                'verible-verilog-ls',
            ];
            for (const sysPath of systemPaths) {
                is_alive = await this.check_run(sysPath);
                if (is_alive) {
                    languageServer = sysPath;
                    break;
                }
            }
        }
        if (is_alive === false) {
            return false;
        }

        // Get language server configuration and command to start server
        let serverOptions: ServerOptions;
        serverOptions = this.getServerOptionsEmbedded(this.context);

        // Options to control the language client
        let clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'file', language: 'verilog' }, { scheme: 'file', language: 'systemverilog' }],
            revealOutputChannelOn: RevealOutputChannelOn.Never,
        };

        // Create the language client
        this.client = new LanguageClient('verible-verilog-ls', 'Verible', serverOptions, clientOptions);

        // Start the client. This will also launch the server
        this.languageServerDisposable = await this.client.start();
        this.context.subscriptions.push(this.languageServerDisposable);

        return true;
    }

    async check_run(binPath: string) {
        let command = binPath + ' --version';
        // eslint-disable-next-line no-console
        console.log(`[colibri][info] Linting with command: ${command}`);
        const exec = require('child_process').exec;
        return new Promise((resolve) => {
            exec(command, (err, stdout: string, stderr) => {
                if (stderr !== '') {
                    console.log(`[verible][error] ${stderr}`);
                }
                if (err !== null || !stdout.toLowerCase().includes('version')) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async deactivate() {
        if (!this.client) {
            return undefined;
        }
        await this.client.stop(1000);
    }

    embeddedVersion(languageServerDir: string): string {
        try {
            const dirs = fs.readdirSync(languageServerDir);
            // Return the first directory found, or default to '0.0.0' if none
            return dirs.length > 0 ? dirs[0] : '0.0.0';
        } catch {
            return '0.0.0';
        }
    }

    getServerOptionsEmbedded(_context: ExtensionContext) {
        const args = ["--file_list_path", this.fileListPath, '--ruleset=none'];

        let serverOptions: ServerOptions = {
            run: {
                command: languageServer,
                args: args
            },
            debug: {
                command: languageServer,
                args: args
            }
        };
        return serverOptions;
    }
}
