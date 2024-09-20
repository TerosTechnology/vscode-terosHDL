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
import * as vscode from 'vscode';
import * as path_lib from 'path';
import { read_file_sync } from '../../../colibri/utils/file_utils';
import { closeDatabase, execQuery, openDatabase } from 'colibri/project_manager/utils/utils';

export function getLogView(context: vscode.ExtensionContext): LogView {
    const view = new LogView(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(
        'teroshdl-report-logs', view, { webviewOptions: { retainContextWhenHidden: true } })
    );
    return view;
}

export class LogView implements vscode.WebviewViewProvider {
    private webview: vscode.Webview | undefined;
    private webviewView: vscode.WebviewView | undefined;
    private context: vscode.ExtensionContext;
    private dbPath: string = "";
    private logLevelList: string[] | undefined = undefined;
    private onlyFileLogs: boolean | undefined = false;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    resolveWebviewView(webviewView: vscode.WebviewView, context, token) {
        this.webview = webviewView.webview;
        this.webviewView = webviewView;

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
        const template_path = path_lib.join(this.context.extensionPath, 'resources', 'webviews', 'reporters',
            'logs', 'index.html');
        let template_str = read_file_sync(template_path);

        if (!this.webview) {
            return template_str;
        }

        // Custom JS
        const js_timing = this.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources',
            'webviews', 'reporters', 'logs', 'wb', 'webviewLogs.js'));
        template_str = template_str.replace(/{{webviewUri}}/g, js_timing.toString());

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

    const db = await openDatabase(bbddPath);
    const messageList: any[] = [];
    try {

        let extraQuery0 = "";
        let extraQuery1 = `
    WHERE
        NOT EXISTS (
            SELECT 1 FROM hierarchy WHERE child_id = m.sequence_id
        )\n`;
        if (logLevelList) {
            let extraQuery = "";
            for (let i = 0; i < logLevelList.length; i++) {
                extraQuery += "'" + logLevelList[i] + "'";
                if (i < logLevelList.length - 1) {
                    extraQuery += ",";
                }
            }
            extraQuery += ")";

            extraQuery0 = " AND LOWER(c.type) IN ( " + extraQuery;
            extraQuery1 += "        AND LOWER(m.type) IN ( " + extraQuery;
        }

        if (onlyFileLogs) {
            extraQuery1 += "        AND m.file != ''";
        }

        const query = `
        SELECT 
        m.sequence_id, 
        m.time, 
        m.source, 
        m.type, 
        m.file, 
        m.line, 
        COALESCE(GROUP_CONCAT(c.text, ' '), m.text) AS aggregated_text
    FROM 
        messages m
    LEFT JOIN 
        hierarchy h ON m.sequence_id = h.parent_id
    LEFT JOIN 
        messages c ON h.child_id = c.sequence_id ${extraQuery0}
${extraQuery1}
    GROUP BY 
        m.sequence_id, 
        m.time, 
        m.source, 
        m.type, 
        m.file, 
        m.line
    HAVING 
        aggregated_text != '*******************************************************************'
        OR aggregated_text IS NULL;
`;

        const rows = await execQuery(db, query);

        if (rows) {
            for (const row of <any[]>rows) {
                const time = row.time;
                const level = row.type;
                const description = row.aggregated_text;
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
        await closeDatabase(db);
    } catch (error) {
    }
    await webview.postMessage({ command: "update", logList: messageList });
}