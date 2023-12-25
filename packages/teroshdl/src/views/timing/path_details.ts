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
import * as teroshdl2 from 'teroshdl2';
import { t_Multi_project_manager } from '../../type_declaration';

export function getPathDetailsView(context: vscode.ExtensionContext, projectManager: t_Multi_project_manager): PathDetailsView {
    const view = new PathDetailsView(context, projectManager);
    return view
}

export class PathDetailsView {
    private webview: vscode.Webview | undefined;
    private context: vscode.ExtensionContext;
    private projectManager: t_Multi_project_manager;
    private timmingReport: teroshdl2.project_manager.common.t_timing_path[] = [];
    protected panel: vscode.WebviewPanel | undefined;

    constructor(context: vscode.ExtensionContext, projectManager: t_Multi_project_manager) {
        this.context = context;
        this.projectManager = projectManager;
    }

    async showPathDetails(pathDetails: teroshdl2.project_manager.common.t_timing_node[], pathName: string) {
        if (this.panel === undefined) {
            this.panel = vscode.window.createWebviewPanel(
                'catCoding',
                '',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            this.panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'open':
                            openFileAtLine(message.file, message.line, 0);
                            return;
                    }
                },
                undefined,
                this.context.subscriptions
            );

            this.panel.webview.options = {
                enableScripts: true
            };
            this.webview = this.panel.webview;
            this.panel.webview.html = this.getHtmlForWebview();
            this.panel.onDidDispose(
                () => {
                    this.panel = undefined;
                },
                null,
                this.context.subscriptions
            );
        }
        else {
            this.panel.reveal();
        }
        this.panel.title = `Details: ${pathName.replace("Path ", 'Path #')}`;
        await this.sendPathDetails(pathDetails);
    }

    private getHtmlForWebview() {
        const template_path = path_lib.join(this.context.extensionPath, 'resources', 'webviews', 'reporters',
            'timing', 'timing_details.html');
        let template_str = teroshdl2.utils.file.read_file_sync(template_path);

        if (!this.webview) {
            return template_str;
        }

        // Custom JS
        const js_timing = this.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources',
            'webviews', 'reporters', 'timing', 'wb', 'webviewTimingDetails.js'));
        template_str = template_str.replace(/{{webviewUri}}/g, js_timing.toString());

        return template_str;
    }

    private async sendPathDetails(pathDetails: teroshdl2.project_manager.common.t_timing_node[]) {
        if (this.webview !== undefined) {
            await this.webview.postMessage({ command: "update", pathDetails: pathDetails });
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