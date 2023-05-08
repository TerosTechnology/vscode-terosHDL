// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of teroshdl
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
// along with teroshdl. If not, see <https://www.gnu.org/licenses/>.

import * as path_lib from "path";
import * as vscode from "vscode";
import * as teroshdl2 from 'teroshdl2';
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import * as utils from "./utils";

const BASE_PATH_ICON = path_lib.join(__filename, "..", "..", "..", "..", "resources", "icon");

export function get_icon(name: string) {
    const icon_path = {
        dark: path_lib.join(BASE_PATH_ICON, "dark", `${name}.svg`),
        light: path_lib.join(BASE_PATH_ICON, "light", `${name}.svg`)
    };
    return icon_path;
}

export async function get_picker_value(choices: string[], placeholder: string): Promise<string> {
    const picker_value = await vscode.window.showQuickPick(choices, {
        placeHolder: placeholder,
    });
    if (picker_value === undefined) {
        return '';
    }
    return picker_value;
}

export async function get_from_open_dialog(can_select_folders: boolean, can_select_files: boolean,
    select_multiple: boolean, open_label: string, filters: any): Promise<string[]> {
    const source_path_list = await vscode.window.showOpenDialog(
        {
            canSelectFolders: can_select_folders,
            canSelectFiles: can_select_files,
            canSelectMany: select_multiple,
            openLabel: open_label,
            filters: filters
        }
    );
    const fs_path_list: string[] = [];
    if (source_path_list !== undefined) {
        source_path_list.forEach(source_path => {
            fs_path_list.push(source_path.fsPath);
        });
    }
    return fs_path_list;
}

export async function get_from_input_box(prompt: string, place_holder: string) {
    const value = await vscode.window.showInputBox({
        prompt: prompt,
        placeHolder: place_holder,
    });
    return value;
}

export async function add_sources_from_open_dialog(project_manager: Multi_project_manager, prj_name: string, logical_name: string) {
    const source_path_list = await get_from_open_dialog(false, true, true,
        "Select source file", { 'All files (*.*)': ['*'] });
    source_path_list.forEach(source_path => {
        const f: teroshdl2.project_manager.common.t_file_reduced = {
            name: source_path,
            is_include_file: false,
            include_path: "",
            logical_name: logical_name,
            is_manual: true
        };
        project_manager.add_file(prj_name, f);
    });
}

export async function add_sources_from_vunit(project_manager: Multi_project_manager, prj_name: string, is_manual: boolean) {
    const path_list = await utils.get_from_open_dialog(false, true, true,
        "Select VUnit run.py files", { 'Python files (*.py)': ['py'] });
    path_list.forEach(async path => {
        await project_manager.add_file_from_vunit(prj_name, project_manager.get_config_global_config(), path, is_manual);
    });
}

export async function add_sources_from_vivado(project_manager: Multi_project_manager, prj_name: string, is_manual: boolean) {
    const path_list = await utils.get_from_open_dialog(false, true, true,
        "Select Vivado project", { 'Vivado project (*.xpr)': ['xpr'] });
    path_list.forEach(async path => {
        await project_manager.add_file_from_vivado(prj_name, project_manager.get_config_global_config(), path, is_manual);
    });
}