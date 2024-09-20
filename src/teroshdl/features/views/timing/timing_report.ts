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
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import { PathDetailsView } from './path_details';
import { createDecoratorList, deleteDecorators, openFileAtLine } from './utils';
import { e_timing_mode, t_timing_path } from 'colibri/project_manager/common';
import { read_file_sync } from 'colibri/utils/file_utils';

export function getTimingReportView(context: vscode.ExtensionContext, projectManager: Multi_project_manager,
    pathDetailsView: PathDetailsView): TimingReportView {

    const view = new TimingReportView(context, projectManager, pathDetailsView);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(
        'teroshdl-view-timing', view, { webviewOptions: { retainContextWhenHidden: true } })
    );
    return view
}

export class TimingReportView implements vscode.WebviewViewProvider {
    private webview: vscode.Webview | undefined;
    private webviewView: vscode.WebviewView | undefined;
    private context: vscode.ExtensionContext;
    private projectManager: Multi_project_manager;
    private timmingReport: t_timing_path[] = [];
    private pathDetailsView: PathDetailsView;
    private pathSelectionList: number[] = [];
    private decoratorList: vscode.TextEditorDecorationType[] = [];

    constructor(context: vscode.ExtensionContext, projectManager: Multi_project_manager,
        pathDetailsView: PathDetailsView) {

        this.pathDetailsView = pathDetailsView;
        this.context = context;
        this.projectManager = projectManager;


        context.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor((e) => this.createDecoratorList()),
        );
    }

    private createDecoratorList() {
        const visibleEditors = vscode.window.visibleTextEditors;
        deleteDecorators(this.decoratorList);
        visibleEditors.forEach(editor => {
            createDecoratorList(editor, this.timmingReport, this.decoratorList, this.pathSelectionList);
        });
    }

    resolveWebviewView(webviewView: vscode.WebviewView, context, token) {
        this.webview = webviewView.webview;
        this.webviewView = webviewView;

        webviewView.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'open':
                        await openFileAtLine(message.file, message.line, 0);
                        return;
                    case 'showPathDetails':
                        await this.showPathDetails(message.pathName);
                        return;
                    case 'generate':
                        await this.generateTimingReport(message.numPaths, message.timingMode);
                        return;
                    case 'updateDecorators':
                        this.pathSelectionList = message.selectionList;
                        await this.createDecoratorList();
                        return;
                }
            },
            undefined,
            context.subscriptions
        );

        webviewView.onDidDispose(
            () => {
                deleteDecorators(this.decoratorList);
                this.pathSelectionList = [];
            },
            null,
            context.subscriptions
        );

        webviewView.webview.options = {
            enableScripts: true
        };
        webviewView.webview.html = this.getHtmlForWebview();
    }

    private getHtmlForWebview() {
        const template_path = path_lib.join(this.context.extensionPath, 'resources', 'webviews', 'reporters',
            'timing', 'timing_report.html');
        let template_str = read_file_sync(template_path);

        if (!this.webview) {
            return template_str;
        }

        // Custom JS
        const js_timing = this.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources',
            'webviews', 'reporters', 'timing', 'wb', 'webviewTimingReport.js'));
        template_str = template_str.replace(/{{webviewUri}}/g, js_timing.toString());

        return template_str;
    }

    private async sendTimingReport() {
        if (this.webviewView !== undefined) {
            await this.webviewView.webview.postMessage({ command: "update", timingReport: this.timmingReport });
        }
    }

    private async generateTimingReport(numOfPaths: number, mode: string) {
        const timingMode = mode === 'Early Timing Report' ? e_timing_mode.EARLY : 
            e_timing_mode.FINAL;

        const selectProject = await this.projectManager.get_selected_project();
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            cancellable: false,
            title: 'Generating Timming Report'
        }, async (progress) => {
            this.timmingReport = await selectProject.getTimingReport(numOfPaths, timingMode);
            this.sendTimingReport();
            this.createDecoratorList();
        });
    }

    public async showPathDetails(pathName: string) {
        for (const pathNode of this.timmingReport) {
            if (pathNode.name === pathName) {
                await this.pathDetailsView.showPathDetails(pathNode.slack ,pathNode.nodeList, pathName);
                break;
            }
        }
    }
}