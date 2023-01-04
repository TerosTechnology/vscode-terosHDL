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
import Octokit = require('@octokit/rest');
import util = require('util');
import AbortController from 'abort-controller';
import fetch from 'node-fetch';

const exec = util.promisify(require('child_process').exec);

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';

const rustHdl = {
    owner: 'VHDL-LS',
    repo: 'rust_hdl',
};

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
    private config_reader: config_reader_lib.Config_reader;
    public stop_client: boolean = false;

    constructor(context: ExtensionContext, config_reader: config_reader_lib.Config_reader) {
        this.context = context;
        this.config_reader = config_reader;
    }

    async run_rusthdl() {
        const languageServerDir = this.context.asAbsolutePath(
            path.join('server', 'vhdl_ls')
        );
        let current_language_server_version = this.embeddedVersion(languageServerDir);
        
        await this.getLatestLanguageServer(60000, this.context, current_language_server_version);
        current_language_server_version = this.embeddedVersion(languageServerDir);

        // Use embedded version
        if (current_language_server_version === '0.0.0') {

        }

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

    async getLatestLanguageServer(
        timeoutMs: number,
        ctx: ExtensionContext,
        current_language_server_version: string
    ) {
        // Get current and latest version
        const octokit = new Octokit({ userAgent: 'rust_hdl_vscode' });
        let latestRelease;
        try{
            latestRelease = await octokit.repos.getLatestRelease({
                owner: rustHdl.owner,
                repo: rustHdl.repo,
            });
            if (latestRelease.status !== 200) {
                return;
                throw new Error('Status 200 return when getting latest release');
            }
        }
        catch{
            return;
            throw new Error('Status 200 return when getting latest release');
        }

        let latest = <string>semver.valid(semver.coerce(latestRelease.data.name));
        // output.appendLine(`Current vhdl_ls version: ${current}`);
        // output.appendLine(`Latest vhdl_ls version: ${latest}`);

        // Download new version if available
        if (semver.prerelease(latest)) {
            // output.appendLine('Latest version is pre-release, skipping');
        } else if (semver.lte(latest, current_language_server_version)) {
            // output.appendLine('Language server is up-to-date');
        } else {
            const languageServerAssetName = languageServerName + '.zip';
            let browser_download_url = latestRelease.data.assets.filter(
                (asset) => asset.name == languageServerAssetName
            )[0].browser_download_url;
            if (browser_download_url.length == 0) {
                return;
                throw new Error(
                    `No asset with name ${languageServerAssetName} in release.`
                );
            }

            // output.appendLine('Fetching ' + browser_download_url);
            const abortController = new AbortController();
            const timeout = setTimeout(() => {
                abortController.abort();
            }, timeoutMs);
            let download = await fetch(browser_download_url, {
                signal: abortController.signal,
            }).catch((err) => {
                // output.appendLine(err);
                throw new Error(
                    `Language server download timed out after ${timeoutMs.toFixed(
                        2
                    )} seconds.`
                );
            });
            if (download.status != 200) {
                throw new Error('Download returned status != 200');
            }
            const languageServerAsset = ctx.asAbsolutePath(
                path.join('server', 'install', latest, languageServerAssetName)
            );
            // output.appendLine(`Writing ${languageServerAsset}`);
            if (!fs.existsSync(path.dirname(languageServerAsset))) {
                fs.mkdirSync(path.dirname(languageServerAsset), {
                    recursive: true,
                });
            }

            await new Promise<void>((resolve, reject) => {
                const dest = fs.createWriteStream(languageServerAsset, {
                    autoClose: true,
                });
                download.body.pipe(dest);
                dest.on('finish', () => {
                    // output.appendLine('Server download complete');
                    resolve();
                });
                dest.on('error', (err: any) => {
                    // output.appendLine('Server download error');
                    reject(err);
                });
            });

            await new Promise<void>((resolve, reject) => {
                const targetDir = ctx.asAbsolutePath(
                    path.join('server', 'vhdl_ls', latest)
                );
                // output.appendLine(
                //     `Extracting ${languageServerAsset} to ${targetDir}`
                // );
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
                        // output.appendLine('Error when extracting server');
                        // output.appendLine(err);
                        try {
                            const languageServerDir_old = this.context.asAbsolutePath(
                                path.join('server', 'vhdl_ls', current_language_server_version)
                            );
                            fs.removeSync(languageServerDir_old);
                            fs.removeSync(targetDir);
                        } catch { }
                        reject(err);
                    } else {
                        // output.appendLine('Server extracted');
                        const languageServerDir_old = this.context.asAbsolutePath(
                            path.join('server', 'vhdl_ls', current_language_server_version)
                        );
                        fs.removeSync(languageServerDir_old);
                        resolve();
                    }
                });
            });
        }
        return Promise.resolve();
    }

}