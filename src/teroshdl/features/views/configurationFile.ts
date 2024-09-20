// Copyright 2024
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
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as path_lib from 'path';
import { Source_tree_element } from '../tree_views/source/element';
import { getLanguageEnumValue, getLanguageVersion, LANGUAGE } from 'colibri/common/general';
import { e_source_type, getSourceTypeEnumValue } from 'colibri/project_manager/common';
import { read_file_sync } from 'colibri/utils/file_utils';

export class ConfigurationFileWebview {
    protected context: vscode.ExtensionContext;
    protected manager: Multi_project_manager;
    private webviewPanel: vscode.WebviewPanel | undefined;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager) {

        const command = "teroshdl.view.source.properties";

        this.context = context;
        this.manager = manager;

        context.subscriptions.push(
            vscode.commands.registerCommand(
                command,
                async (filetoConfigure: Source_tree_element) => {
                    await this.createWebview(filetoConfigure);
                }
            ),
        );
    }

    async createWebview(filetoConfigure: Source_tree_element) {
        this.webviewPanel = vscode.window.createWebviewPanel(
            'catCoding',
            'Source Configuration',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        this.webviewPanel.onDidDispose(
            () => {
                this.webviewPanel = undefined;
            },
            null,
            this.context.subscriptions
        );
        this.webviewPanel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'saveConfig':
                        this.saveConfig(message.projectName, message.fileName, message.logicalName, message.fileType,
                            message.fileVersion, message.sourceType);
                        return;
                }
            },
            undefined,
            this.context.subscriptions
        );
        this.webviewPanel.webview.html = this.getHtmlForWebview();


        const currentProject = this.manager.get_selected_project();
        const fileListInProject = currentProject.get_project_definition().file_manager.get();

        const expectedName = filetoConfigure.get_name();
        const expectedLogicalName = filetoConfigure.get_logical_name();

        for (const file of fileListInProject) {
            if (file.name === expectedName && file.logical_name === expectedLogicalName) {
                const fileTypeList: string[] = Object.values(LANGUAGE);
                const sourceTypeList: string[] = Object.values(e_source_type);
                await this.webviewPanel.webview.postMessage(
                    {
                        command: "setFileTypeList",
                        fileTypeList: fileTypeList,
                        sourceTypeList: sourceTypeList,
                        projectName: currentProject.get_name(),
                        name: file.name,
                        logical_name: file.logical_name,
                        currentFileType: file.file_type,
                        currentFileVersion: file.file_version,
                        currentSourceType: file.source_type
                    });

                break;
            }
        }
    }

    getHtmlForWebview(): string {
        const template_path = path_lib.join(this.context.extensionPath, 'resources', 'webviews', 'fileConfiguration', 'fileConfiguration.html');
        let template_str = read_file_sync(template_path);

        if (!this.webviewPanel) {
            return template_str;
        }

        const script = this.webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources',
            'webviews', 'fileConfiguration', 'wb', 'webviewFileConfiguration.js'));
        template_str = template_str.replace(/{{webviewUri}}/g, script.toString());

        return template_str;
    }

    saveConfig(projectName: string, fileName: string, logicalName: string, fileType: string, fileVersion: string, sourceType: string) {
        try {
            const project = this.manager.get_project_by_name(projectName);
            const fileTypeEnum = getLanguageEnumValue(fileType);
            const fileVersionEnum = getLanguageVersion(fileTypeEnum, fileVersion);
            const sourceTypeEnum = getSourceTypeEnumValue(sourceType)

            const result = project.get_project_definition().file_manager.configureSource(fileName,
                logicalName, fileTypeEnum, fileVersionEnum, sourceTypeEnum);

            if (result.successful) {
                this.manager.save();
                vscode.window.showInformationMessage("Configuration saved successfully");
            }
        }
        catch (error) {
            return;
        }
    }
}