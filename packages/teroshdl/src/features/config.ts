// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
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
import * as teroshdl2 from 'teroshdl2';
import { t_Multi_project_manager } from '../type_declaration';
import * as utils from '../utils/utils';
import * as nunjucks from 'nunjucks';
import { Project } from './tree_views/project/element';

/**
 * Retrieves a project by its name from the multi-project manager.
 * @param name The name of the project to retrieve.
 * @param multiProject The multi-project manager instance.
 * @returns The project with the specified name, or undefined if not found.
 */
function getProjectByName(name: string | undefined, multiProject: t_Multi_project_manager) {
    try {
        if (name === undefined) {
            return multiProject.get_selected_project();
        }
        return multiProject.get_project_by_name(name);
    }
    catch (error) {
        return undefined;
    }
}

export class Config_manager {

    protected context: vscode.ExtensionContext;
    private multiProjectManager: t_Multi_project_manager;
    private panel: vscode.WebviewPanel | undefined = undefined;
    private web_content: string;
    private currentConfig: teroshdl2.config.config_declaration.e_config;
    private currentConfigIsGlobal: boolean = true;
    private currentProjectName: string | undefined = undefined;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, multiProjectManager: t_Multi_project_manager) {

        this.context = context;
        this.multiProjectManager = multiProjectManager;
        this.web_content = teroshdl2.config.WEB_CONFIG;
        this.currentConfig = teroshdl2.config.configManager.GlobalConfigManager.getInstance().get_config();

        const activation_command = 'teroshdl.configuration';
        vscode.commands.registerCommand(activation_command + ".global", async () => await this.createWebviewGlobal());
        vscode.commands.registerCommand(activation_command + ".project",
            async (project, tabToOpen) => await this.createWebviewProject(project, tabToOpen));


        vscode.commands.registerCommand("teroshdl.view.project.export_configuration", () => this.exportConfig());
        vscode.commands.registerCommand("teroshdl.view.project.load_configuration", () => this.loadConfigFromFile());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Webview creator
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Gets the title for the webview.
     * If the current configuration is global, the title will be "Global Settings".
     * If the current configuration is project-specific, the title will be "Project Settings".
     * @returns The title for the webview.
     */
    private getTitle(): string {
        if (this.currentConfigIsGlobal) {
            return "Global Settings";
        }
        else {
            return "Project Settings";
        }
    }

    /**
     * Creates a webview for the TerosHDL global configuration.
     * Retrieves the current configuration and sets the webview title.
     */
    private async createWebviewGlobal(): Promise<void> {
        this.currentConfigIsGlobal = true;
        this.currentProjectName = undefined;
        this.currentConfig = teroshdl2.config.configManager.GlobalConfigManager.getInstance().get_config();
        const windowTitle = "TerosHDL Global Settings";
        await this.createWebview(windowTitle, "");
    }

    /**
     * Create a webview for the project configuration
     */
    private async createWebviewProject(project: Project, tabToOpen: string): Promise<void> {
        let projectName : string | undefined = undefined;
        try {
            projectName = project.get_project_name();
        }
        catch (error) {}

        const projectToConfig = getProjectByName(projectName, this.multiProjectManager);
        if (projectToConfig === undefined) {
            return;
        }

        this.currentConfigIsGlobal = false;
        this.currentProjectName = projectToConfig.get_name();
        this.currentConfig = projectToConfig.get_config();
        const windowTitle = `Project Settings - ${this.currentProjectName}`;
        await this.createWebview(windowTitle, tabToOpen);
    }

    /**
     * Create a webview
     */
    private async createWebview(windowTitle: string, tabToOpen: string): Promise<void> {
        if (this.panel === undefined) {
            this.panel = vscode.window.createWebviewPanel(
                'catCoding',
                windowTitle,
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );
            this.panel.onDidDispose(
                () => {
                    this.panel = undefined;
                },
                null,
                this.context.subscriptions
            );
            // Handle messages from the webview
            this.panel.webview.onDidReceiveMessage(
                async message => {
                    switch (message.command) {
                        case 'set_config':
                            await this.setConfig(message.config);
                            this.sendChangeConfigCommand();
                            this.showSavedMessage();
                            return;
                        case 'set_config_and_close':
                            await this.setConfigAndClose(message.config);
                            this.sendChangeConfigCommand();
                            this.showSavedMessage();
                            return;
                        case 'close':
                            this.closePanel();
                            return;
                        case 'export':
                            this.exportConfig();
                            return;
                        case 'load':
                            this.loadConfigFromFile();
                            return;
                    }
                },
                undefined,
                this.context.subscriptions
            );
            this.panel.webview.html = this.getWebviewContent(this.panel.webview);
        }
        this.panel.title = windowTitle;
        await this.updateWebConfig(tabToOpen);
    }

    /**
     * Retrieves the content for the webview.
     * 
     * @param webview - The vscode.Webview object.
     * @returns The HTML content for the webview.
     */
    private getWebviewContent(webview: vscode.Webview): string {
        const template_str = this.web_content;

        const css_0 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources',
            'project_manager', 'bootstrap.min.css'));
        const css_1 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources',
            'project_manager', 'sidebars.css'));
        const js_0 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources',
            'project_manager', 'bootstrap.bundle.min.js'));

        const html = nunjucks.renderString(template_str, {
            "css_0": css_0, "css_1": css_1, "js_0": js_0,
            "cspSource": webview.cspSource
        });
        return html;
    }

    /**
     * Sends a command alerting change the configuration.
     */
    private sendChangeConfigCommand(): void {
        vscode.commands.executeCommand("teroshdl.config.change_config");
    }

    /**
     * Exports the TerosHDL configuration.
     */
    private exportConfig() {
        vscode.window.showSaveDialog({
            title: "Export TerosHDL Settings",
            saveLabel: "Save Settings",
            filters: {
                "JSON": ["json"]
            }
        }).then(fileInfos => {
            if (fileInfos?.path !== undefined) {
                const path_norm = utils.normalize_path(fileInfos?.path);
                const config_string = this.currentConfig.toString();
                teroshdl2.utils.file.save_file_sync(path_norm, config_string);
                vscode.window.showInformationMessage(`Settings exported ${this.getMessageAlert()}`);
            }
        });
    }

    private async loadConfigFromFile(): Promise<void> {
        vscode.window.showOpenDialog({ title: "Load TerosHDL Settings", canSelectMany: false }).then((value) => {
            if (value === undefined) {
                return;
            }
            const path_norm = utils.normalize_path(value[0].fsPath);
            const file_content = teroshdl2.utils.file.read_file_sync(path_norm);
            const config = JSON.parse(file_content);
            this.setConfig(config);
            this.updateWebConfig("");
            vscode.window.showInformationMessage(`Settings loaded ${this.getMessageAlert()}`);
        });
    }

    /**
     * Updates the web config by sending a message to the webview with the current Settings.
     * @returns A promise that resolves when the update is complete.
     */
    private async updateWebConfig(tabToOpen: string): Promise<void> {
        await this.panel?.webview.postMessage({
            command: "set_config",
            config: this.currentConfig,
            diff_config: this.getMark(),
            title: this.getTitle(),
            projectName: this.currentProjectName,
            tool: tabToOpen,
        });
    }

    /**
     * Sets the configuration for the current project or global configuration.
     * If the current configuration is global, it sets the configuration in the global configuration manager.
     * If the current configuration is project-specific, it sets the configuration in the corresponding project.
     * @param config The configuration object to be set.
     */
    private async setConfig(config: any): Promise<void> {
        if (this.currentConfigIsGlobal || this.currentProjectName === undefined) {
            teroshdl2.config.configManager.GlobalConfigManager.getInstance().set_config(config);
            teroshdl2.config.configManager.GlobalConfigManager.getInstance().save();
            this.currentConfig = teroshdl2.config.configManager.GlobalConfigManager.getInstance().get_config();
        }
        else {
            const project = getProjectByName(this.currentProjectName, this.multiProjectManager);
            if (project !== undefined) {
                project.set_config(config);
                this.multiProjectManager.save();
                this.currentConfig = project.get_config();
            }
        }
        await this.updateWebConfig("");
    }

    /**
     * Sets the configuration and closes the webview panel.
     * @param config The configuration to set.
     */
    private async setConfigAndClose(config: any) {
        await this.setConfig(config);
        this.closePanel();
    }

    /**
     * Closes the webview panel.
     */
    private closePanel() {
        this.panel?.dispose();
    }


    /**
     * Gets the message alert based on the current configuration.
     * If the current configuration is global, the message will be "for TerosHDL Global configuration."
     * If the current configuration is project-specific, the message will be "for project {currentProjectName}."
     * @returns The message alert.
     */
    private getMessageAlert(): string {
        if (this.currentConfigIsGlobal) {
            return "- TerosHDL Global Settings.";
        }
        else {
            return `- ${this.currentProjectName}.`;
        }
    }

    private getMark(): any {
        if (this.currentConfigIsGlobal || this.currentProjectName === undefined) {
            return undefined;
        }
        const project = getProjectByName(this.currentProjectName, this.multiProjectManager);
        if (project !== undefined) {
            const config = project.get_diff_config();
            return config;
        }
        return undefined;
    }

    /**
     * Shows a message alerting that the configuration has been saved.
     */
    private showSavedMessage() {
        vscode.window.showInformationMessage(`Settings saved ${this.getMessageAlert()}`);
    }
}






