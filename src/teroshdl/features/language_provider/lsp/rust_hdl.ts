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
import { debugLogger } from '../../../logger';
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
const languageServerName = isWindows ? 'vhdl_ls-x86_64-pc-windows-msvc' : 'vhdl_ls-x86_64-unknown-linux-musl';
const languageServerBinaryName = 'vhdl_ls';
let languageServer: string;

export class Rusthdl_lsp {
    private client: LanguageClient | undefined = undefined;
    private context: ExtensionContext;
    private languageServerDisposable;
    private serverCommandPath: string | undefined;
    private manager: Multi_project_manager;
    public stop_client: boolean = false;
    private errorCounter = 0;

    constructor(context: ExtensionContext, manager: Multi_project_manager, private fileListPath: string) {
        this.context = context;
        this.manager = manager;

        this.context.subscriptions.push(
            vscode.commands.registerCommand('teroshdl.vhdlls.restart', async () => {
                if (this.client !== undefined && this.client.isRunning() && this.client.state === State.Running) {
                    try {
                        await this.client.restart();
                    } catch (error) {
                        this.errorCounter++;
                        this.client.dispose();
                        this.client = undefined;
                        debugLogger.error(String(error));
                        if (this.errorCounter < 5) {
                            await this.run_rusthdl();
                        }
                    }
                }
            })
        );

        // Ensure we attempt to kill any leftover servers when the extension host exits
        process.on('exit', async () => {
            try {
                await this.killServerProcesses();
            } catch (e) { /* ignore */ }
        });
        process.on('SIGINT', async () => {
            try {
                await this.killServerProcesses();
            } catch (e) { /* ignore */ }
            process.exit();
        });
        process.on('SIGHUP', async () => {
            try {
                await this.killServerProcesses();
            } catch (e) { /* ignore */ }
            process.exit();
        });
    }

    async run_rusthdl(): Promise<boolean> {
        const languageServerDir = this.context.asAbsolutePath(path.join('server', 'vhdl_ls'));
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
            revealOutputChannelOn: RevealOutputChannelOn.Never
        };

        // Create the language client
        this.client = new LanguageClient('vhdlls', 'VHDL LS', serverOptions, clientOptions);

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
        debugLogger.info(`[colibri][info] Linting with command: ${command}`);
        const exec = require('child_process').exec;
        return new Promise((resolve) => {
            exec(command, (err, stdout, stderr) => {
                if (stderr !== '') {
                    debugLogger.error(`[rusthdl][error] ${stderr}`);
                }
                if (stderr === '') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    async deactivate() {
        const logFile = require('os').homedir() + '/vhdl_ls_deactivate.log';
        const log = (msg: string) => {
            try {
                require('fs').appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`);
            } catch (e) { /* ignore */ }
        };
        
        log('=== DEACTIVATE CALLED ===');
        if (!this.client) {
            log('No client to deactivate');
            return undefined;
        }
        try {
            log(`Client state before stop: ${this.client.state}`);
            log('Calling client.stop(5000)...');
            // Increase timeout to 5 seconds to ensure proper shutdown in SSH scenarios
            await this.client.stop(5000);
            log('Client stopped successfully');
            
            // Explicitly dispose of the language server disposable
            if (this.languageServerDisposable) {
                log('Disposing languageServerDisposable...');
                this.languageServerDisposable.dispose();
                log('Disposable cleaned up');
            }
            debugLogger.info('[vhdl_ls] Language server stopped successfully');
        } catch (error) {
            log(`ERROR during stop: ${error}`);
            debugLogger.error(`[vhdl_ls] Error stopping language server: ${String(error)}`);
            // Force dispose even if stop fails
            if (this.languageServerDisposable) {
                this.languageServerDisposable.dispose();
                log('Disposable force-disposed after error');
            }
        } finally {
            this.client = undefined;
            this.languageServerDisposable = undefined;
            log('=== DEACTIVATE COMPLETE ===');
            // Try to kill any lingering server processes that match our server binary
            try {
                await this.killServerProcesses();
            } catch (e) { /* ignore */ }
        }
    }

    embeddedVersion(languageServerDir: string): string {
        try {
            return fs.readdirSync(languageServerDir).reduce((version: string, dir: string) => {
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
        args.push('--silent');

        let serverCommand = context.asAbsolutePath(languageServer);
        // remember server path for cleanup
        this.serverCommandPath = serverCommand;
        let serverOptions: ServerOptions = {
            run: {
                command: serverCommand,
                args: args,
                options: {
                    env: {
                        VHDL_LS_CONFIG: this.fileListPath
                    },
                    // Ensure process is killed when parent terminates (important for SSH scenarios)
                    detached: true,
                    shell: false
                }
            },
            debug: {
                command: serverCommand,
                args: args,
                options: {
                    env: {
                        VHDL_LS_CONFIG: this.fileListPath
                    },
                    // Ensure process is killed when parent terminates (important for SSH scenarios)
                    detached: true,
                    shell: false
                }
            }
        };
        
        // We rely on explicit cleanup (killServerProcesses) called on deactivate/exit

        return serverOptions;
    }

    private async killServerProcesses(): Promise<void> {
        if (!this.serverCommandPath) {
            return;
        }
        const serverPath = this.serverCommandPath;

        try {
            const cfg = vscode.workspace.getConfiguration('teroshdl.cleanup');
            const enabled = cfg.get<boolean>('killServerProcesses.enabled', false);
            if (!enabled) {
                return;
            }

            // Safety: only perform process kill when running over an SSH remote session
            const remoteName = (vscode.env.remoteName ?? '').toString();
            const isSSH = remoteName.startsWith('ssh-remote');
            if (!isSSH) {
                debugLogger.info('[vhdl_ls] Not an SSH remote session — skipping killServerProcesses');
                return;
            }

            const grace = cfg.get<number>('killServerProcesses.gracePeriodMs', 500);

            // Platform guard: pgrep is Unix-specific
            if (process.platform === 'win32') {
                return;
            }

            const execFile = require('child_process').execFile;
            // Use pgrep -f to find matching processes, then kill them gracefully, then force kill
            return new Promise((resolve) => {
                execFile('pgrep', ['-f', serverPath], (err: any, stdout: string) => {
                    if (err || !stdout) {
                        return resolve();
                    }
                    const pids = stdout
                        .split(/\s+/)
                        .map((s: string) => s.trim())
                        .filter(Boolean)
                        .filter((x: string) => /^\d+$/.test(x));
                    if (pids.length === 0) {
                        return resolve();
                    }

                    // First try SIGTERM
                    pids.forEach((pid: string) => {
                        const n = parseInt(pid, 10);
                        if (Number.isNaN(n)) {
                            return;
                        }
                        try {
                            process.kill(n, 'SIGTERM');
                        } catch (e) { /* ignore */ }
                    });
                    // After configurable delay, force kill remaining
                    setTimeout(() => {
                        pids.forEach((pid: string) => {
                            const n = parseInt(pid, 10);
                            if (Number.isNaN(n)) {
                                return;
                            }
                            try {
                                process.kill(n, 'SIGKILL');
                            } catch (e) { /* ignore */ }
                        });
                        resolve();
                    }, Math.max(0, grace));
                });
            });
        } catch (e) {
            return;
        }
    }
}
