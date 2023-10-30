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

export class Config_manager {

    protected context: vscode.ExtensionContext;
    private manager: t_Multi_project_manager;
    private panel: vscode.WebviewPanel | undefined = undefined;
    private web_content: string;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager) {
        
        this.context = context;
        this.manager = manager;
        this.web_content = teroshdl2.config.WEB_CONFIG;

        const activation_command = 'teroshdl.configuration';
        vscode.commands.registerCommand(activation_command, () => this.create_webview());


        vscode.commands.registerCommand("teroshdl.view.project.export_configuration", () => this.export_config());
        vscode.commands.registerCommand("teroshdl.view.project.load_configuration", () => this.load_config_from_file());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Webview creator
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async create_webview() {
        if (this.panel === undefined) {
            this.panel = vscode.window.createWebviewPanel(
                'catCoding',
                'TerosHDL configuration',
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
                message => {
                    switch (message.command) {
                        case 'set_config':
                            this.set_config(message.config);
                            this.send_change_config_command();
                            return;
                        case 'set_config_and_close':
                            this.set_config_and_close(message.config);
                            this.send_change_config_command();
                            return;
                        case 'close':
                            this.close_panel();
                            return;
                        case 'export':
                            this.export_config();
                            return;
                        case 'load':
                            this.load_config_from_file();
                            return;
                    }
                },
                undefined,
                this.context.subscriptions
            );
            this.panel.webview.html = this.get_webview_content(this.panel.webview);
            await this.update_web_config();
        }
        else {
        }
    }

    get_webview_content(webview: vscode.Webview){
        const template_str = this.web_content;

        const css_0 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'project_manager', 'bootstrap.min.css'));
        const css_1 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'project_manager', 'sidebars.css'));
        const js_0 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'project_manager', 'bootstrap.bundle.min.js'));

        const html = nunjucks.renderString(template_str, {"css_0": css_0, "css_1": css_1, "js_0": js_0,
            "cspSource": webview.cspSource});
        return html;
    }


    send_change_config_command(){
        vscode.commands.executeCommand("teroshdl.config.change_config");
    }

    export_config(){
        vscode.window.showSaveDialog({title: "Export TerosHDL configuration"}).then(fileInfos => {
            if (fileInfos?.path !== undefined) {
                const path_norm = utils.normalize_path(fileInfos?.path);
                const config = this.manager.get_config_global_config();
                const config_string = JSON.stringify(config, null, 4);
                teroshdl2.utils.file.save_file_sync(path_norm, config_string);
            }
        });
    }

    async load_config_from_file(){
        vscode.window.showOpenDialog({title: "Load TerosHDL configuration", canSelectMany: false }).then((value) => {
            if (value === undefined) {
                return;
            }
            const path_norm = utils.normalize_path(value[0].fsPath);
            const file_content = teroshdl2.utils.file.read_file_sync(path_norm);
            const config = JSON.parse(file_content);
            this.set_config(config);
            this.update_web_config();
        });
    }

    async update_web_config(){
        await this.panel?.webview.postMessage({
            command: "set_config",
            config: this.manager.get_config_global_config()
        });
    }

    set_config(config: any){
        this.manager.set_global_config_from_json(config);
    }

    set_config_and_close(config: any){
        this.manager.set_global_config_from_json(config);
        this.close_panel();
    }

    close_panel() {
        this.panel?.dispose();
    }


}






