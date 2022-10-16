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


const fs = require('fs');
const path_lib = require('path');
import * as vscode from 'vscode';
import * as teroshdl2 from 'teroshdl2';
import * as config_reader_lib from "./config_reader";

export function check_if_active_editor() :boolean{
    if (!vscode.window.activeTextEditor) {
        return false;
    }
    return true;
}

export function get_active_editor_lang() : undefined|teroshdl2.common.general.HDL_LANG {
    const active_editor = check_if_active_editor();
    if (active_editor === false){
        return undefined;
    }
    const document = vscode.window.activeTextEditor?.document;
    const language_id: string = <string>document?.languageId;

    if (language_id === 'systemverilog') {
        return teroshdl2.common.general.HDL_LANG.VERILOG;
    }
    else if(language_id === "verilog") {
        return teroshdl2.common.general.HDL_LANG.SYSTEMVERILOG;
    }
    else if (language_id === "vhdl") {
        return teroshdl2.common.general.HDL_LANG.VHDL;
    }
    return undefined;
}

export function get_active_editor_lang_and_code()  {
    const result = {
        sucessful: false,
        lang: teroshdl2.common.general.HDL_LANG.VHDL,
        code: ''
    };
    const lang = get_active_editor_lang();
    if (lang === undefined){
        return result;
    }

    const document = vscode.window.activeTextEditor?.document;
    const code: string = <string>document?.getText();
    result.code = code;
    result.lang = lang;
    result.sucessful = true;
    return result;
}

export function get_files_from_dir_recursive (dir: any, filelist: any[] = []) {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path_lib.join(dir, file);
        try {
            filelist = get_files_from_dir_recursive(dirFile, filelist);
        }
        catch (err) {
            if (err.code === 'ENOTDIR' || err.code === 'EBUSY') {
                filelist = [...filelist, dirFile];
            }
            else 
            {
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