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

import * as fs from 'fs';
import * as path_lib from 'path';
import * as vscode from 'vscode';
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import { LANGUAGE } from 'colibri/common/general';
import { e_config } from 'colibri/config/config_declaration';
import { GlobalConfigManager } from 'colibri/config/config_manager';

export const VERILOG_SELECTOR: vscode.DocumentSelector = [
    { scheme: 'file', language: "verilog" },
    { scheme: 'file', language: "systemverilog" }
];
export const VHDL_SELECTOR: vscode.DocumentSelector = { scheme: 'file', language: "vhdl" };
export const TCL_SELECTOR: vscode.DocumentSelector = { scheme: 'file', language: 'tcl' };

export enum t_message_level {
    INFO,
    WARNING,
    ERROR
}

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
    lang: LANGUAGE;
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
    if (lang === LANGUAGE.NONE) {
        return false;
    }
    return true;
}

export function get_document_lang(document: vscode.TextDocument): LANGUAGE {
    const language_id: string = document.languageId;
    if (language_id === 'systemverilog') {
        return LANGUAGE.VERILOG;
    }
    else if (language_id === "verilog") {
        return LANGUAGE.SYSTEMVERILOG;
    }
    else if (language_id === "vhdl") {
        return LANGUAGE.VHDL;
    }
    else {
        return LANGUAGE.NONE;
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

export function showMessage(message: string, level: t_message_level) {
    if (level === t_message_level.INFO) {
        vscode.window.showInformationMessage(message);
    }
    else if (level === t_message_level.WARNING) {
        vscode.window.showWarningMessage(message);
    }
    else if (level === t_message_level.ERROR) {
        vscode.window.showErrorMessage(message);
    }
}

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

export function open_file(args: vscode.Uri) {
    vscode.workspace.openTextDocument(args).then(doc => {
        vscode.window.showTextDocument(doc);
    });
}

export function getConfig(multiProjectManager: Multi_project_manager)
    : e_config {
    try {
        const selectedProject = multiProjectManager.get_selected_project();
        return selectedProject.get_config();
    }
    catch (err) {
        return GlobalConfigManager.getInstance().get_config();
    }
}