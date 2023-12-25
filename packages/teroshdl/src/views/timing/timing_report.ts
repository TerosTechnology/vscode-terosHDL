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
import { PathDetailsView } from './path_details';
import { get_icon } from '../../features/tree_views/utils';

export function getTimingReportView(context: vscode.ExtensionContext, projectManager: t_Multi_project_manager,
    pathDetailsView: PathDetailsView): TimingReportView {

    const view = new TimingReportView(context, projectManager, pathDetailsView);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(
        'teroshdl-view-timing', view, { webviewOptions: { retainContextWhenHidden: true } })
    );
    // vscode.commands.registerCommand("teroshdl.view.tasks.show_timing_report", async () =>
    //     await view.openTimingReport());
    return view
}

export class TimingReportView implements vscode.WebviewViewProvider {
    private webview: vscode.Webview | undefined;
    private webviewView: vscode.WebviewView | undefined;
    private context: vscode.ExtensionContext;
    private projectManager: t_Multi_project_manager;
    private timmingReport: teroshdl2.project_manager.common.t_timing_path[] = [];
    private pathDetailsView: PathDetailsView;

    constructor(context: vscode.ExtensionContext, projectManager: t_Multi_project_manager,
        pathDetailsView: PathDetailsView) {

        this.pathDetailsView = pathDetailsView;
        this.context = context;
        this.projectManager = projectManager;


        context.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor((e) => this.createDecoratorList(e)),
        );
    }

    private setDecoration(line: number, slack: number, setBackground: boolean, onlySlack: boolean) {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }

        const message = new vscode.MarkdownString(
            `Incremental delay: **${slack}**`,
            true,
        );

        const range = new vscode.Range(line, 0, line, activeEditor.document.lineAt(line).text.length);
        const decorationOptions = {
            range: range,
            hoverMessage: message
        };

        let icon = get_icon("clock").dark;
        const currentTheme = vscode.window.activeColorTheme;
        if (currentTheme.kind === vscode.ColorThemeKind.Dark) {
            icon = get_icon("clock").dark;
        } else if (currentTheme.kind === vscode.ColorThemeKind.Light) {
            icon = get_icon("clock").light;
        } else {
            icon = get_icon("clock").dark;
        }

        let decoratorOptions = {
            backgroundColor: '',
            isWholeLine: true,
            gutterIconPath: icon,
            gutterIconSize: 'contain',
            after: {}
        };

        if (setBackground) {
            decoratorOptions.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        }

        if (onlySlack) {
            decoratorOptions.after = {
                contentText: `Slack: ${slack}`,
                margin: '0 0 0 3em',
                color: 'rgba(255, 0, 0, 0.8)',
                fontWeight: 'bold',
            }
        };
        const decorationType = vscode.window.createTextEditorDecorationType(decoratorOptions);
        activeEditor.setDecorations(decorationType, [decorationOptions]);
    }

    private createDecoratorList(document: vscode.TextEditor | undefined) {
        try {
            if (document === undefined) {
                document = vscode.window.activeTextEditor;
            }
            if (document === undefined) {
                return;
            }
            const filePath = document.document.fileName;

            const lineRegistry: number[] = [];
            for (const timingPath of this.timmingReport) {
                const lineRegistryInPath: number[] = [];
                // Fail path
                if (timingPath.slack < 0) {
                    for (const timingNode of timingPath.nodeList) {
                        if (timingNode.path === filePath) {
                            // if (!lineRegistryInPath.includes(timingNode.line)) {
                            //     this.setDecoration(timingNode.line - 1, timingPath.slack,
                            //         !lineRegistry.includes(timingNode.line), true);
                            //     lineRegistryInPath.push(timingNode.line);
                            // }

                            this.setDecoration(timingNode.line - 1, timingNode.incremental_delay,
                                !lineRegistry.includes(timingNode.line), false);
                            lineRegistry.push(timingNode.line);
                        }
                    }
                }
            }
        }
        catch (error) {
        }
    }

    resolveWebviewView(webviewView: vscode.WebviewView, context, token) {
        this.webview = webviewView.webview;
        this.webviewView = webviewView;

        webviewView.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'open':
                        openFileAtLine(message.file, message.line, 0);
                        return;
                    case 'showPathDetails':
                        await this.showPathDetails(message.pathName);
                        return;
                    case 'generate':
                        await this.generateTimingReport(message.numPaths);
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
    }

    private getHtmlForWebview() {
        const template_path = path_lib.join(this.context.extensionPath, 'resources', 'webviews', 'reporters',
            'timing', 'timing_report.html');
        let template_str = teroshdl2.utils.file.read_file_sync(template_path);

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

    private async generateTimingReport(numOfPaths: number) {
        const selectProject = await this.projectManager.get_selected_project();
        // let timmingReport: teroshdl2.project_manager.common.t_timing_path[] = [];
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            cancellable: false,
            title: 'Generating Timming Report'
        }, async (progress) => {
            this.timmingReport = await selectProject.getTimingReport(numOfPaths);
            this.sendTimingReport();
            this.createDecoratorList(undefined);
        });
    }

    public async showPathDetails(pathName: string) {
        for (const pathNode of this.timmingReport) {
            if (pathNode.name === pathName) {
                await this.pathDetailsView.showPathDetails(pathNode.nodeList, pathName);
                break;
            }
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