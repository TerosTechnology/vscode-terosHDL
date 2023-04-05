// Copyright 2020 Teros Technology
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


import * as fs from 'fs';
import * as path_lib from 'path';
import * as vscode from 'vscode';
import * as teroshdl2 from 'teroshdl2';

export const VERILOG_SELECTOR: vscode.DocumentSelector = [
    { scheme: 'file', language: teroshdl2.common.general.HDL_LANG.VERILOG },
    { scheme: 'file', language: teroshdl2.common.general.HDL_LANG.SYSTEMVERILOG }
];
export const VHDL_SELECTOR: vscode.DocumentSelector = { scheme: 'file', language: teroshdl2.common.general.HDL_LANG.VHDL };
export const TCL_SELECTOR: vscode.DocumentSelector = { scheme: 'file', language: 'tcl' };

export function get_webview_content(resource_path: string) {
    const dir_path = path_lib.dirname(resource_path);
    let html = fs.readFileSync(resource_path, 'utf-8');

    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return $1 + vscode.Uri.file(path_lib.resolve(dir_path, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
}

/** VSCode text document */
export type t_vscode_document = {
    filename: string;
    is_hdl: boolean;
    lang: teroshdl2.common.general.HDL_LANG;
    code: string;
};

export function get_vscode_document(document: vscode.TextDocument): t_vscode_document {
    const document_inst: t_vscode_document = {
        filename: document.fileName,
        is_hdl: check_if_document_is_hdl(document),
        lang: get_document_lang(document),
        code: document.getText()
    };
    return document_inst;
}

export function get_vscode_active_document(): t_vscode_document | undefined {
    const active_editor = get_active_editor();
    if (active_editor === undefined) {
        return undefined;
    }

    const document = active_editor.document;

    const document_inst: t_vscode_document = {
        filename: document.fileName,
        is_hdl: check_if_document_is_hdl(document),
        lang: get_document_lang(document),
        code: document.getText()
    };
    return document_inst;
}


export function check_if_active_editor(): boolean {
    const active_editor = get_active_editor();
    if (active_editor === undefined) {
        return false;
    }
    return true;
}

export function get_active_editor(): undefined | vscode.TextEditor {
    if (!vscode.window.activeTextEditor) {
        return undefined;
    }
    return vscode.window.activeTextEditor;
}

export function check_if_active_editor_hdl(): boolean {
    const active_editor = get_active_editor();
    if (active_editor === undefined) {
        return false;
    }
    return check_if_document_is_hdl(active_editor.document);
}


export function check_if_document_is_hdl(document: vscode.TextDocument): boolean {
    const lang = get_document_lang(document);
    if (lang === teroshdl2.common.general.HDL_LANG.NONE) {
        return false;
    }
    return true;
}

export function get_document_lang(document: vscode.TextDocument): teroshdl2.common.general.HDL_LANG {
    const language_id: string = document.languageId;
    if (language_id === 'systemverilog') {
        return teroshdl2.common.general.HDL_LANG.VERILOG;
    }
    else if (language_id === "verilog") {
        return teroshdl2.common.general.HDL_LANG.SYSTEMVERILOG;
    }
    else if (language_id === "vhdl") {
        return teroshdl2.common.general.HDL_LANG.VHDL;
    }
    else {
        return teroshdl2.common.general.HDL_LANG.NONE;
    }
}

export function normalize_path(path: string) {
    if (path[0] === '/' && require('os').platform() === 'win32') {
        return path.substring(1);
    }
    else {
        return path;
    }
}












// export function get_active_editor_lang() : teroshdl2.common.general.HDL_LANG {
//     const active_editor = check_if_active_editor();
//     if (active_editor === false){
//         return undefined;
//     }
//     const document = vscode.window.activeTextEditor?.document;
//     const language_id: string = <string>document?.languageId;

//     if (language_id === 'systemverilog') {
//         return teroshdl2.common.general.HDL_LANG.VERILOG;
//     }
//     else if(language_id === "verilog") {
//         return teroshdl2.common.general.HDL_LANG.SYSTEMVERILOG;
//     }
//     else if (language_id === "vhdl") {
//         return teroshdl2.common.general.HDL_LANG.VHDL;
//     }
//     else{
//         return teroshdl2.common.general.HDL_LANG.NONE;
//     }
// }

// export function get_active_editor_lang_and_code()  {
//     const result = {
//         sucessful: false,
//         lang: teroshdl2.common.general.HDL_LANG.NONE,
//         code: '',
//         filename: ''
//     };
//     const lang = get_active_editor_lang();
//     if (lang === teroshdl2.common.general.HDL_LANG.NONE){
//         return result;
//     }

//     const document = vscode.window.activeTextEditor?.document;
//     const code: string = <string>document?.getText();
//     result.code = code;
//     result.lang = lang;
//     result.filename = <string>document?.fileName;
//     result.sucessful = true;
//     return result;
// }

export function get_files_from_dir_recursive(dir: any, filelist: any[] = []) {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path_lib.join(dir, file);
        try {
            filelist = get_files_from_dir_recursive(dirFile, filelist);
        }
        catch (err: any) {
            if (err.code === 'ENOTDIR' || err.code === 'EBUSY') {
                filelist = [...filelist, dirFile];
            }
            else {
                throw err;
            }
        }
    });
    return filelist;
}

export function line_index_to_character_index(line_number: number, character_number: number, txt: string): number {
    let txt_split = txt.split('\n');
    let character_index: number = 0;
    for (let i = 0; i < line_number; ++i) {
        character_index += txt_split[i].length + 1;
    }
    character_index += character_number;
    return character_index;
}


export function replace_range(s: string, start: number, end: number, substitute: string): string {
    let sub_string_0: string = s.substring(0, start);
    let sub_string_1: string = s.substring(end, s.length);
    return s.substring(0, start) + substitute + s.substring(end);
}