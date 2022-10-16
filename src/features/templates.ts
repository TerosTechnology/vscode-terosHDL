// Copyright 2020-2021 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
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
import * as Output_channel_lib from '../utils/output_channel';
import * as utils from '../utils/utils';
import * as teroshdl2 from 'teroshdl2';
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';

const ERROR_CODE = Output_channel_lib.ERROR_CODE;

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class Template_manager {
    private manager: Multi_project_manager;
    private output_channel: Output_channel_lib.Output_channel;

    constructor(context, output_channel: Output_channel_lib.Output_channel, manager: Multi_project_manager) {
        this.output_channel = output_channel;
        this.manager = manager;
        vscode.commands.registerCommand("teroshdl.generate_template", () => this.get_template());
    }

    async get_template() {
        // Get active editor file language. Return if no active editor
        const document = utils.get_active_editor_lang_and_code();
        if (document.sucessful === false) {
            return;
        }
        const lang = document.lang;
        const code = document.code;

        // Show template selector
        const template_names = teroshdl2.template.common.get_template_definition(lang);
        const description_list = template_names.description_list;
        const id_list = template_names.id_list;
        const lang_template_list = template_names.lang_list;
        let select_id = '';
        let lang_template = teroshdl2.common.general.LANG.VHDL;
        let picker_value = await vscode.window.showQuickPick(template_names.description_list,
            { placeHolder: 'Select the template type.' });
        for (let i = 0; i < description_list.length; i++) {
            if (picker_value === description_list[i]) {
                select_id = id_list[i];
                lang_template = lang_template_list[i];
                break;
            }
        }

        // If not template selected return
        if (select_id === '') { return; };

        const template_manager = new teroshdl2.template.manager.Template_manager(lang);

        const options = this.get_config();
        const template = await template_manager.generate(code, select_id, options);

        //Error
        if (template === undefined) {
            this.output_channel.show_message(ERROR_CODE.TEMPLATE_NOT_VALID_FILE, '');
        }
        else {
            this.output_channel.show_message(ERROR_CODE.COPIED_TO_CLIPBOARD, '');
            vscode.env.clipboard.writeText(template);
        }
    }

    private get_indent(general_indent:string, lang: teroshdl2.common.general.LANG): string{
        const indent = general_indent;
        let tab_size = undefined;
        let insert_spaces = undefined;
        try {
            let python_tabsize = vscode.workspace.getConfiguration('[python]')['editor.tabSize'];
            let python_insert_spaces = vscode.workspace.getConfiguration('[python]')['editor.insertSpaces'];

            let vhdl_tabsize = vscode.workspace.getConfiguration('[vhdl]')['editor.tabSize'];
            let vhdl_insert_spaces = vscode.workspace.getConfiguration('[vhdl]')['editor.insertSpaces'];

            let verilog_tabsize = vscode.workspace.getConfiguration('[verilog]')['editor.tabSize'];
            let verilog_insert_spaces = vscode.workspace.getConfiguration('[verilog]')['editor.insertSpaces'];

            let cpp_tabsize = vscode.workspace.getConfiguration('[C_Cpp]')['editor.tabSize'];
            let cpp_insert_spaces = vscode.workspace.getConfiguration('[C_Cpp]')['editor.insertSpaces'];

            if (lang === teroshdl2.common.general.LANG.PYTHON) {
                tab_size = python_tabsize;
                insert_spaces = python_insert_spaces;
            }
            else if (lang === teroshdl2.common.general.LANG.VERILOG) {
                tab_size = verilog_tabsize;
                insert_spaces = verilog_insert_spaces;
            }
            else if (lang === teroshdl2.common.general.LANG.VHDL) {
                tab_size = vhdl_tabsize;
                insert_spaces = vhdl_insert_spaces;
            }
            else if (lang === teroshdl2.common.general.LANG.CPP) {
                tab_size = cpp_tabsize;
                insert_spaces = cpp_insert_spaces;
            }
            else {
                return general_indent;
            }
        }
        catch (e) {
            return general_indent;
        }

        if (tab_size === undefined || insert_spaces === undefined){
            return general_indent;
        }

        const c_tab_size = <number>tab_size;
        const c_insert_spaces = <boolean>insert_spaces;

        let indent_char = '';
        if (insert_spaces === true) {
            indent_char = ' ';
            indent_char = indent_char.repeat(c_tab_size);
        }
        else {
            indent_char = '\t';
            indent_char = indent_char.repeat(c_tab_size);
        }
        return indent_char;
    }

    private get_config(): teroshdl2.config.auxiliar_config.t_template_options {
        const config = this.manager.get_config_manager().get_template_config();
        return config;
    }
}