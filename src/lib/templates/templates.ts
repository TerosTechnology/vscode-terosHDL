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

export async function get_template() {
    const jsteros = require('jsteros');

    const LANGUAGES = {
        "source.verilog": jsteros.General.LANGUAGES.VERILOG,
        "source.vhdl": jsteros.General.LANGUAGES.VHDL
    };

    if (!vscode.window.activeTextEditor) {
        return; // no editor
    }
    let document = vscode.window.activeTextEditor.document;
    let language_id: string = document.languageId;

    const TYPES_VHDL_INFO: string[] = ["cocotb", "VUnit testbench", "VHDL testbench", "Copy as component", "Copy as signal", "Copy as instance", "Copy as instance VHDL >=93", "Copy as verilog instance"];
    const TYPES_VHDL: string[] = ["cocotb", "tb", "tb", "component", "component", "component", "component", "mix_component"];
    const SUBTYPES_VHDL: string[] = ["cocotb", "vunit", "normal", "component", "signals", "instance", "instance_vhdl_2008", "mix_instance"];

    const TYPES_VERILOG_INFO: string[] = ["cocotb", "Verilator", "VUnit testbench", "Verilog testbench", "Copy as signal", "Copy as instance", "Copy as VHDL component", "Copy as VHDL instance"];
    const TYPES_VERILOG: string[] = ["cocotb", "verilator", "tb", "tb", "component", "component", "mix_component", "mix_component"];
    const SUBTYPES_VERILOG: string[] = ["cocotb", "verilator", "vunit", "normal", "signals", "instance", "mix_component", "mix_instance"];

    let type: string = "";
    let subtype: string = "";
    if (language_id === 'systemverilog') {
        language_id = 'verilog';
    }
    if (language_id === "vhdl") {
        let picker_value = await vscode.window.showQuickPick(TYPES_VHDL_INFO,
            { placeHolder: 'Select the template type.' });
        for (let i = 0; i < TYPES_VHDL_INFO.length; i++) {
            if (picker_value === TYPES_VHDL_INFO[i]) {
                type = TYPES_VHDL[i];
                subtype = SUBTYPES_VHDL[i];
                break;
            }
        }
    }
    else if (language_id === "verilog") {
        let picker_value = await vscode.window.showQuickPick(TYPES_VERILOG_INFO,
            { placeHolder: 'Select the template type.' });
        for (let i = 0; i < TYPES_VERILOG_INFO.length; i++) {
            if (picker_value === TYPES_VERILOG_INFO[i]) {
                type = TYPES_VERILOG[i];
                subtype = SUBTYPES_VERILOG[i];
                break;
            }
        }
    }
    else {
        return;
    }

    if (type === '' || subtype === '') { return; };

    let header_file_path = vscode.workspace.getConfiguration('teroshdl.documenter').get('header_file_path');

    //Get tabsize
    let general_tabsize = <number>vscode.workspace.getConfiguration('editor').get('tabSize');
    let general_insert_spaces = <boolean>vscode.workspace.getConfiguration('editor').get('insertSpaces');

    let tabsize = general_tabsize;
    let insert_spaces = general_insert_spaces;
    try {
        let python_tabsize = vscode.workspace.getConfiguration('[python]')['editor.tabSize'];
        let python_insert_spaces = vscode.workspace.getConfiguration('[python]')['editor.insertSpaces'];

        let vhdl_tabsize = vscode.workspace.getConfiguration('[vhdl]')['editor.tabSize'];
        let vhdl_insert_spaces = vscode.workspace.getConfiguration('[vhdl]')['editor.insertSpaces'];

        let verilog_tabsize = vscode.workspace.getConfiguration('[verilog]')['editor.tabSize'];
        let verilog_insert_spaces = vscode.workspace.getConfiguration('[verilog]')['editor.insertSpaces'];

        let cpp_tabsize = vscode.workspace.getConfiguration('[C_Cpp]')['editor.tabSize'];
        let cpp_insert_spaces = vscode.workspace.getConfiguration('[C_Cpp]')['editor.insertSpaces'];


        if (type === 'cocotb') {
            tabsize = python_tabsize;
            insert_spaces = python_insert_spaces;
        }
        else if (type === 'verilator') {
            tabsize = cpp_tabsize;
            insert_spaces = vhdl_insert_spaces;
        }
        else if (language_id === 'vhdl') {
            tabsize = vhdl_tabsize;
            insert_spaces = verilog_insert_spaces;
        }
        else if (language_id === 'verilog') {
            tabsize = verilog_tabsize;
            insert_spaces = cpp_insert_spaces;
        }
        else {
            tabsize = general_tabsize;
            insert_spaces = general_insert_spaces;
        }
    }
    catch (e) {
        console.log(e);
        tabsize = general_tabsize;
        insert_spaces = general_insert_spaces;
    }

    if (tabsize === undefined) {
        tabsize = 2;
    }
    if (insert_spaces === undefined) {
        insert_spaces = true;
    }
    tabsize = <number>tabsize;
    insert_spaces = <boolean>insert_spaces;

    let indent_char = '';
    if (insert_spaces === true) {
        indent_char = ' ';
        indent_char = indent_char.repeat(tabsize);
    }
    else {
        indent_char = '\t';
        indent_char = indent_char.repeat(tabsize);
    }

    let options = {
        "type": subtype,
        "indent_char": indent_char,
        "header_file_path": header_file_path
    };
    let code: string = document.getText();

    let templates_cl = new jsteros.Templates.Templates_factory();
    let template = await templates_cl.get_template(type, language_id);
    let template_str: string = await template.generate(code, options);

    //Error
    if (template_str === undefined) {
        vscode.window.showErrorMessage('Select a valid file.!');
        console.log("Error parser template.");
    }
    else {
        vscode.window.showInformationMessage('Template copied to clipboard!\n');
        vscode.env.clipboard.writeText(template_str);
    }
}
