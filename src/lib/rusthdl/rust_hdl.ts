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
import * as lockfile from 'proper-lockfile';
const output = vscode.window.createOutputChannel('VHDL LS Client');
const traceOutputChannel = vscode.window.createOutputChannel('VHDL LS Trace');

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient';

let client: LanguageClient;

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
    let serverOptions: ServerOptions;
    serverOptions = getServerOptionsEmbedded(ctx);
    output.appendLine('Using embedded language server');

    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'vhdl' }],
        initializationOptions: vscode.workspace.getConfiguration('vhdlls'),
        traceOutputChannel,
    };

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

async function getLatestLanguageServer(
    timeoutMs: number,
    ctx: ExtensionContext
) {
    let latest : string = 'v0.1.8';

    const languageServerAssetName = languageServerName + '.zip';
    const languageServerAsset = ctx.asAbsolutePath(
        path.join('resources', 'rusthdl', 'install', latest, languageServerAssetName)
    );
    output.appendLine(`Writing ${languageServerAsset}`);
    if (!fs.existsSync(path.dirname(languageServerAsset))) {
        fs.mkdirSync(path.dirname(languageServerAsset), {
            recursive: true,
        });
    }

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
    return Promise.resolve();
}