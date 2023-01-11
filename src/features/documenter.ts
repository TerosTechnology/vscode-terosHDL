/* eslint-disable @typescript-eslint/class-name-casing */
// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of vscode-terosHDL.
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
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

import * as vscode from 'vscode';
import * as path_lib from 'path';
import * as Output_channel_lib from '../utils/output_channel';
import * as utils from '../utils/utils';
import * as teroshdl2 from 'teroshdl2';
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import { Base_webview } from './base_webview';

const ERROR_CODE = Output_channel_lib.ERROR_CODE;

export class Documenter_manager extends Base_webview {

    private documenter: teroshdl2.documenter.documenter.Documenter | undefined;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, output_channel: Output_channel_lib.Output_channel,
        manager: Multi_project_manager) {

        const activation_command = 'teroshdl.documentation.module';
        const id = "documenter";

        const resource_path = path_lib.join(context.extensionPath, 'resources', 'documenter', 'index.html');
        super(context, output_channel, manager, resource_path, activation_command, id);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Webview creator
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async create_webview() {
        // Get active editor file language. Return if no active editor
        const document = utils.get_vscode_active_document();
        if (document === undefined) {
            return;
        }

        if (this.panel === undefined) {
            this.panel = vscode.window.createWebviewPanel(
                'catCoding',
                'Module documentation',
                vscode.ViewColumn.Two,
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
            this.panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'export':
                            this.export_as(message.text);
                            return;
                    }
                },
                undefined,
                this.context.subscriptions
            );
        }
        await this.update(document);
    }

    async update(vscode_document: utils.t_vscode_document) {
        this.last_document = vscode_document;
        const documenter = await this.get_documenter();
        const config = this.get_config();
        const html_document = await documenter.get_document(vscode_document.code, vscode_document.lang,
            config, false, vscode_document.filename, '', true,
            teroshdl2.documenter.common.doc_output_type.HTML);

        if (this.panel !== undefined) {
            this.panel.webview.html = this.html_base + html_document.document;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async get_documenter(): Promise<teroshdl2.documenter.documenter.Documenter> {
        if (this.documenter === undefined) {
            this.documenter = new teroshdl2.documenter.documenter.Documenter();
            return this.documenter;
        }
        return this.documenter;
    }

    private get_config(): teroshdl2.config.auxiliar_config.t_documenter_options {
        const config = this.manager.get_config_manager().get_documenter_config();
        return config;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Log
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    print_documenter_log(configuration, file_input, file_output, type) {
        this.output_channel.print_documenter_configurtion(configuration, file_input, file_output, type);
    }

    private show_export_message(path_exp: string) {
        this.output_channel.show_message(ERROR_CODE.DOCUMENTER_SAVE, path_exp);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Export
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async export_as(type: string) {
        if (this.last_document === undefined) {
            return;
        }
        const code = this.last_document.code;
        const lang = this.last_document.lang;
        const file_path = this.last_document.filename;
        const documenter = await this.get_documenter();

        // /one/two/five.h --> five.h
        const basename = path_lib.basename(file_path);
        // five.h --> .h
        const ext_name = path_lib.extname(basename);
        // /one/two/five.h --> five
        const filename = path_lib.basename(file_path, ext_name);
        // /one/two/five
        const full_path = path_lib.join(path_lib.dirname(file_path), filename);

        let default_path = full_path;
        let filter: any;
        let output_type = teroshdl2.documenter.common.doc_output_type.HTML;

        if (type === "markdown") {
            filter = { 'markdown': ['md'] };
            default_path += '.md';
            output_type = teroshdl2.documenter.common.doc_output_type.MARKDOWN;
        }
        else if (type === "image") {
            filter = { 'SVG': ['svg'] };
            default_path += '.svg';
            output_type = teroshdl2.documenter.common.doc_output_type.SVG;
        }
        else {
            filter = { 'HTML': ['html'] };
            default_path += '.html';
            output_type = teroshdl2.documenter.common.doc_output_type.HTML;
        }

        const config = this.get_config();

        let uri = vscode.Uri.file(default_path);
        vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
            if (fileInfos?.path !== undefined) {
                let path_norm = utils.normalize_path(fileInfos?.path);
                this.show_export_message(path_norm);

                documenter.save_document(code, lang, config, file_path, path_norm, output_type);
            }
        });
    }
}






