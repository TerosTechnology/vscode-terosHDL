// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of TerosHDL
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.
import { Database } from 'sqlite3';
import * as vscode from 'vscode';
import * as path_lib from 'path';
import * as teroshdl2 from 'teroshdl2';

export class LogView implements vscode.WebviewViewProvider {
    private webview: vscode.Webview | undefined;
    private webviewView: vscode.WebviewView | undefined;
    private context: vscode.ExtensionContext;
    private dbPath: string = "";
    private logLevelList: string[] | undefined = undefined;
    private onlyFileLogs: boolean | undefined = true;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    resolveWebviewView(webviewView: vscode.WebviewView, context, token) {
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'open':
                        openFileAtLine(message.file, message.line, 0);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );

        webviewView.webview.options = {
            enableScripts: true
        };
        webviewView.webview.html = this.getHtmlForWebview();
        this.webview = webviewView.webview;
        this.webviewView = webviewView;

        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'updateLogLevel':
                        this.updateLogLevel(message.logLevelList, message.onlyFileLogs);
                        return;
                }
            },
            undefined,
            this.context.subscriptions
        );
        if (this.dbPath !== "") {
            setLogs(this.dbPath, this.webview, this.logLevelList, this.onlyFileLogs);
        }
    }

    getHtmlForWebview() {
        const template_path = path_lib.join(this.context.extensionPath, 'resources', 'webviews', 'logs', 'index.html');
        const template_str = teroshdl2.utils.file.read_file_sync(template_path);
        return template_str;
    }

    updateLogLevel(logLevelList: string[] | undefined, onlyFileLogs: boolean | undefined) {
        this.logLevelList = logLevelList;
        this.onlyFileLogs = onlyFileLogs;
        this.sendLogs(this.dbPath);
    }

    sendLogs(filePath: string) {
        this.dbPath = filePath;
        if (this.webviewView) {
            setLogs(filePath, this.webview, this.logLevelList, this.onlyFileLogs);
            this.webviewView.show();
        }
    }
}
/**
 * Open a file at a specific line
 * @param filePath Path to the file
 * @param lineNumber Line number
 * @param columnNumber Column number
 */
function openFileAtLine(filePath: string, lineNumber: number, columnNumber: number): void {
    const uri = vscode.Uri.file(filePath);
    const position = new vscode.Position(lineNumber - 1, columnNumber);
    const range = new vscode.Range(position, position);

    vscode.window.showTextDocument(uri, {
        selection: range
    });
}

/**
 * Set the status of the tasks
 * @param bbddPath Path to the database
*/
export async function setLogs(bbddPath: string, webview: any,
    logLevelList: string[] | undefined, onlyFileLogs: boolean | undefined): Promise<void> {

    const db = <Database>await teroshdl2.project_manager.utils.openDatabase(bbddPath);
    const messageList: any[] = [];
    try {

        let extraQuery = "";
        if (logLevelList) {
            extraQuery = " WHERE LOWER(type) IN (";
            for (let i = 0; i < logLevelList.length; i++) {
                extraQuery += "'" + logLevelList[i] + "'";
                if (i < logLevelList.length - 1) {
                    extraQuery += ",";
                }
            }
            extraQuery += ")";
        }

        if (onlyFileLogs) {
            if (extraQuery === "") {
                extraQuery = " WHERE file != ''";
            }
            else {
                extraQuery += " AND file != ''";
            }
        }

        const rows = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM messages ${extraQuery}`, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else { resolve(rows); }
            });
        });


        if (rows) {
            for (const row of <any[]>rows) {
                const time = row.time;
                const level = row.type;
                const description = row.text;
                const file = row.file;
                const line = row.line;

                const message = {
                    time: time,
                    level: level,
                    description: description,
                    file: file,
                    line: line,
                };
                messageList.push(message);
            }
        }
        else {
        }
        await teroshdl2.project_manager.utils.closeDatabase(db);
    } catch (error) {
    }
    await webview.postMessage({ command: "update", logList: messageList });
}