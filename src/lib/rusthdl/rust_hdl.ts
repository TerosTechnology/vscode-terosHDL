/* ------------------------------------------------------------------------------------------
 * MIT License
 * Copyright (c) 2020 Henrik Bohlin
 * Full license text can be found in /LICENSE or at https://opensource.org/licenses/MIT.
 * ------------------------------------------------------------------------------------------ */
'use strict';
import extract = require('extract-zip');
import * as fs from 'fs-extra';
import fetch from 'node-fetch';
import Octokit = require('@octokit/rest');
import * as path from 'path';
import semver = require('semver');
import vscode = require('vscode');
import { ExtensionContext, window } from 'vscode';
import util = require('util');
import * as lockfile from 'proper-lockfile';
import AbortController from 'abort-controller';
const exec = util.promisify(require('child_process').exec);
const output = vscode.window.createOutputChannel('VHDL LS Client');
const traceOutputChannel = vscode.window.createOutputChannel('VHDL LS Trace');

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient';

let client: LanguageClient;

enum LanguageServerBinary {
    embedded,
    user,
    systemPath,
    docker,
}

const isWindows = process.platform === 'win32';
const languageServerName = isWindows
    ? 'vhdl_ls-x86_64-pc-windows-msvc'
    : 'vhdl_ls-x86_64-unknown-linux-gnu';
const languageServerBinaryName = 'vhdl_ls';
let languageServer: string;


export async function run_rusthdl(ctx: ExtensionContext) {
    const languageServerDir = ctx.asAbsolutePath(
        path.join('server', 'vhdl_ls')
    );
    output.appendLine(
        'Checking for language server executable in ' + languageServerDir
    );
    let languageServerVersion = embeddedVersion(languageServerDir);
    if (languageServerVersion === '0.0.0') {
        output.appendLine('No language server installed');
        window.showInformationMessage('Downloading language server...');
        await getLatestLanguageServer(60000, ctx);
        languageServerVersion = embeddedVersion(languageServerDir);
    } else {
        output.appendLine('Found version ' + languageServerVersion);
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

    let workspace = vscode.workspace;
    let languageServerBinary = workspace
        .getConfiguration()
        .get('vhdlls.languageServer');
    let lsBinary = languageServerBinary as keyof typeof LanguageServerBinary;
    let serverOptions: ServerOptions;
    serverOptions = getServerOptionsEmbedded(ctx);
    output.appendLine('Using embedded language server');

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'vhdl' }],
        initializationOptions: vscode.workspace.getConfiguration('vhdlls'),
        traceOutputChannel,
    };

    // clientOptions.synchronize = {
    //     fileEvents: workspace.createFileSystemWatcher('/home/carlos/.vhdl_ls.toml'),
    // };

    // Create the language client
    client = new LanguageClient(
        'vhdlls',
        'VHDL LS',
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    let languageServerDisposable = client.start();

    // Register command to restart language server
    ctx.subscriptions.push(languageServerDisposable);
    ctx.subscriptions.push(
        vscode.commands.registerCommand('vhdlls.restart', async () => {
            const MSG = 'Restarting VHDL LS';
            output.appendLine(MSG);
            window.showInformationMessage(MSG);
            await client.stop();
            languageServerDisposable.dispose();
            languageServerDisposable = client.start();
            ctx.subscriptions.push(languageServerDisposable);
        })
    );

    output.appendLine('Checking for updates...');
    lockfile
        .lock(ctx.asAbsolutePath('server'), {
            lockfilePath: ctx.asAbsolutePath(path.join('server', '.lock')),
        })
        .then((release: () => void) => {
            getLatestLanguageServer(60000, ctx)
                .catch((err) => {
                    output.appendLine(err);
                })
                .finally(() => {
                    output.appendLine('Language server update finished.');
                    return release();
                });
        });

    output.appendLine('Language server started');
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

function embeddedVersion(languageServerDir: string): string {
    try {
        return fs
            .readdirSync(languageServerDir)
            .reduce((version: string, dir: string) => {
                if (semver.gt(dir, version)) {
                    fs.remove(path.join(languageServerDir, version)).catch(
                        (err: any) => {
                            output.appendLine(err);
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

function getServerOptionsEmbedded(context: ExtensionContext) {
    let serverCommand = context.asAbsolutePath(languageServer);
    let serverOptions: ServerOptions = {
        run: {
            command: serverCommand,
        },
        debug: {
            command: serverCommand,
        },
    };
    return serverOptions;
}

const rustHdl = {
    owner: 'TerosTechnology',
    repo: 'rust_hdl',
};

async function getLatestLanguageServer(
    timeoutMs: number,
    ctx: ExtensionContext
) {
    // Get current and latest version
    const octokit = new Octokit({ userAgent: 'rust_hdl_vscode' });
    let latestRelease = await octokit.repos.getLatestRelease({
        owner: rustHdl.owner,
        repo: rustHdl.repo,
    });
    if (latestRelease.status !== 200) {
        throw new Error('Status 200 return when getting latest release');
    }
    let current: string;
    if (languageServer) {
        let { stdout, stderr } = await exec(
            `"${ctx.asAbsolutePath(languageServer)}" --version`
        );
        current = <string>semver.valid(semver.coerce(stdout.split(' ', 2)[1]));
    } else {
        current = '0.0.0';
    }

    let latest = <string>semver.valid(semver.coerce(latestRelease.data.name));
    output.appendLine(`Current vhdl_ls version: ${current}`);
    output.appendLine(`Latest vhdl_ls version: ${latest}`);

    // Download new version if available
    if (semver.prerelease(latest)) {
        output.appendLine('Latest version is pre-release, skipping');
    } else if (semver.lte(latest, current)) {
        output.appendLine('Language server is up-to-date');
    } else {
        const languageServerAssetName = languageServerName + '.zip';
        let browser_download_url = latestRelease.data.assets.filter(
            (asset) => asset.name === languageServerAssetName
        )[0].browser_download_url;
        if (browser_download_url.length === 0) {
            throw new Error(
                `No asset with name ${languageServerAssetName} in release.`
            );
        }

        output.appendLine('Fetching ' + browser_download_url);
        const abortController = new AbortController();
        const timeout = setTimeout(() => {
            abortController.abort();
        }, timeoutMs);
        let download = await fetch(browser_download_url, {
            signal: abortController.signal,
        }).catch((err) => {
            output.appendLine(err);
            throw new Error(
                `Language server download timed out after ${timeoutMs.toFixed(
                    2
                )} seconds.`
            );
        });
        if (download.status !== 200) {
            throw new Error('Download returned status != 200');
        }
        const languageServerAsset = ctx.asAbsolutePath(
            path.join('server', 'install', latest, languageServerAssetName)
        );
        output.appendLine(`Writing ${languageServerAsset}`);
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
                output.appendLine('Server download complete');
                resolve();
            });
            dest.on('error', (err: any) => {
                output.appendLine('Server download error');
                reject(err);
            });
        });

        await new Promise<void>((resolve, reject) => {
            const targetDir = ctx.asAbsolutePath(
                path.join('server', 'vhdl_ls', latest)
            );
            output.appendLine(
                `Extracting ${languageServerAsset} to ${targetDir}`
            );
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            extract(languageServerAsset, { dir: targetDir }, (err) => {
                try {
                    fs.removeSync(
                        ctx.asAbsolutePath(path.join('server', 'install'))
                    );
                } catch {}
                if (err) {
                    output.appendLine('Error when extracting server');
                    output.appendLine(err);
                    try {
                        fs.removeSync(targetDir);
                    } catch {}
                    reject(err);
                } else {
                    output.appendLine('Server extracted');
                    resolve();
                }
            });
        });
    }
    return Promise.resolve();
}