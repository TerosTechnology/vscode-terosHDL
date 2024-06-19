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
import { e_formatter_general_formatter_verilog, e_formatter_general_formatter_vhdl } from 'teroshdl2/out/config/config_declaration';
import { globalLogger } from '../logger';

let formatter_vhdl: Formatter | undefined = undefined;
let formatter_verilog: Formatter | undefined = undefined;

class Formatter {

    private manager: t_Multi_project_manager;
    private lang: teroshdl2.common.general.LANGUAGE;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(lang: teroshdl2.common.general.LANGUAGE, manager: t_Multi_project_manager) {
        this.manager = manager;
        this.lang = lang;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Configuration
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private get_formatter_name() {
        const config = utils.getConfig(this.manager);
        if (this.lang === teroshdl2.common.general.LANGUAGE.VHDL) {
            return config.formatter.general.formatter_vhdl;
        }
        else {
            return config.formatter.general.formatter_verilog;
        }
    }

    private get_formatter_config() {
        const configCurrent = utils.getConfig(this.manager);
        if (this.lang === teroshdl2.common.general.LANGUAGE.VHDL) {
            const formatter_name = configCurrent.formatter.general.formatter_vhdl;
            if (formatter_name === e_formatter_general_formatter_vhdl.standalone) {
                return configCurrent.formatter.standalone;
            }
            else if (formatter_name === e_formatter_general_formatter_vhdl.vsg) {
                return configCurrent.formatter.svg;
            }
            else {
                return configCurrent.formatter.standalone;
            }
            }
        else {
            const formatter_name = configCurrent.formatter.general.formatter_verilog;
            if (formatter_name === e_formatter_general_formatter_verilog.istyle) {
                return configCurrent.formatter.istyle;
            }
            else if (formatter_name === e_formatter_general_formatter_verilog.s3sv) {
                return configCurrent.formatter.s3sv;
            }
            else if (formatter_name === e_formatter_general_formatter_verilog.verible) {
                const config = {
                    format_args : configCurrent.formatter.verible.format_args,
                    path: configCurrent.tools.verible.installation_path
                };
                return config;
            }
            else {
                return configCurrent.formatter.istyle;
            }
        }
    }

    public async format(code) {
        const formatter_name = this.get_formatter_name();
        const formater_config = this.get_formatter_config();
        const formatter = new teroshdl2.formatter.formatter.Formatter();
        const result = await formatter.format_from_code(formatter_name, code, formater_config);
        if (result.successful === false){
            globalLogger.info("Error format code.");
            globalLogger.debug(result.command);
        }
        else{
            globalLogger.info("The code has been formatted successfully.");
        }
        return result;
    }
}

export class Formatter_manager {
    private manager: t_Multi_project_manager;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager) {
        this.manager = manager;

        formatter_vhdl = new Formatter(teroshdl2.common.general.LANGUAGE.VHDL, manager);
        formatter_verilog = new Formatter(teroshdl2.common.general.LANGUAGE.VERILOG, manager);

        const disposable = vscode.languages.registerDocumentFormattingEditProvider(
            [{ scheme: "file", language: "vhdl" }, { scheme: "file", language: "verilog" },
            { scheme: "file", language: "systemverilog" }],
            { provideDocumentFormattingEdits }
        );
        context.subscriptions.push(disposable);
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'teroshdl.format',
                async () => {
                    vscode.commands.executeCommand("editor.action.format");
                }
            )
        );
    }
}

async function provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
    token: vscode.CancellationToken): Promise<vscode.TextEdit[]> {

    const edits: vscode.TextEdit[] = [];
    if (formatter_verilog === undefined || formatter_vhdl === undefined){
        return edits;
    }

    //Get document code
    let code_document: string = document.getText();
    let selection_document = getDocumentRange(document);

    //Get selected text
    let editor = vscode.window.activeTextEditor;
    let selection_selected_text;
    let code_selected_text: string = '';
    if (editor !== undefined) {
        selection_selected_text = editor.selection;
        code_selected_text = editor.document.getText(editor.selection);
    }

    //Code to format
    let format_mode_selection: boolean = false;
    let code_to_format: string = '';
    let selection_to_format;
    if (code_selected_text !== '') {
        let init: number = utils.line_index_to_character_index(selection_selected_text._start._line,
            selection_selected_text._start._character, code_document);
        let end: number = utils.line_index_to_character_index(selection_selected_text._end._line,
            selection_selected_text._end._character, code_document);
        let selection_add: string = "#$$#colibri#$$#" + code_selected_text + "%%!!teros!!%%";
        code_to_format = utils.replace_range(code_document, init, end, selection_add);
        format_mode_selection = true;

        code_to_format = code_selected_text;
        selection_to_format = selection_selected_text;
    }
    else {
        code_to_format = code_document;
        selection_to_format = selection_document;
    }

    let code_format: string;
    let sucessful = false;
    if (document.languageId === "vhdl") {
        const result = await formatter_vhdl.format(code_to_format);
        code_format = result.code_formatted;
        sucessful = result.successful;
    }
    else {
        const result = await formatter_verilog.format(code_to_format);
        code_format = result.code_formatted;
        sucessful = result.successful;
    }
    //Error
    if (sucessful === false) {
        return edits;
    }
    else {
        const replacement = vscode.TextEdit.replace(
            selection_to_format,
            code_format
        );
        edits.push(replacement);
        return edits;
    }
}

export const getDocumentRange = (document: vscode.TextDocument): vscode.Range => {
    const lastLineId = document.lineCount - 1;
    return new vscode.Range(
        0,
        0,
        lastLineId,
        document.lineAt(lastLineId).text.length
    );
};