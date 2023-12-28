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
import { createNodeDecoratorList, deleteDecorators, openFileAtLine } from './utils';

export function getPathDetailsView(context: vscode.ExtensionContext, projectManager: t_Multi_project_manager): PathDetailsView {
    const view = new PathDetailsView(context, projectManager);
    return view;
}

export class PathDetailsView {
    private webview: vscode.Webview | undefined;
    private context: vscode.ExtensionContext;
    private projectManager: t_Multi_project_manager;
    private pathDetails: teroshdl2.project_manager.common.t_timing_node[] = [];
    protected panel: vscode.WebviewPanel | undefined;
    private pathSelectionList: number[] = [];
    private decoratorList: vscode.TextEditorDecorationType[] = [];
    private slack: number = 0;

    constructor(context: vscode.ExtensionContext, projectManager: t_Multi_project_manager) {
        this.context = context;
        this.projectManager = projectManager;

        context.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor((e) => this.createDecoratorList()),
        );
    }

    async showPathDetails(slack: number, pathDetails: teroshdl2.project_manager.common.t_timing_node[], 
        pathName: string) {

        this.pathDetails = pathDetails;
        this.slack = slack;

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
                async message => {
                    switch (message.command) {
                        case 'open':
                            await openFileAtLine(message.file, message.line, 0);
                            return;
                        case 'updateDecorators':
                            this.pathSelectionList = message.selectionList;
                            this.createDecoratorList();
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
                    deleteDecorators(this.decoratorList);
                    this.pathSelectionList = [];
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

    private createDecoratorList() {
        const visibleEditors = vscode.window.visibleTextEditors;
        deleteDecorators(this.decoratorList);
        visibleEditors.forEach(editor => {
            createNodeDecoratorList(editor, this.pathDetails, this.slack, this.decoratorList, this.pathSelectionList);
        });
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