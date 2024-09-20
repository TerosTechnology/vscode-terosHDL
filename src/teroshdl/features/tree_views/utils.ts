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

import * as path_lib from "path";
import * as vscode from "vscode";
import * as utils from "./utils";
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import { check_if_path_exist, find_files_by_extensions_dir_and_subdir, get_default_version_for_filepath, get_language_from_filepath } from "colibri/utils/file_utils";
import { Project_manager } from "colibri/project_manager/project_manager";
import { e_source_type, t_file } from "colibri/project_manager/common";
import { LANGUAGE } from "colibri/common/general";
import { ProjectEmitter } from "colibri/project_manager/projectEmitter";
import { getFamilyAndParts } from "colibri/project_manager/tool/quartus/utils";
import { GlobalConfigManager } from "colibri/config/config_manager";

const BASE_PATH_ICON = path_lib.join(__dirname, "..", "..", "..", "..", "resources", "icon");

export function get_icon(name: string) {
    let extension = "svg";
    const pathToCheck = path_lib.join(BASE_PATH_ICON, "dark", `${name}.svg`);
    if (!check_if_path_exist(pathToCheck)) {
        extension = "png";
    }

    const icon_path = {
        dark: path_lib.join(BASE_PATH_ICON, "dark", `${name}.${extension}`),
        light: path_lib.join(BASE_PATH_ICON, "light", `${name}.${extension}`)
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

export async function get_save_dialog(title: string, save_lavel: string, filters: any): Promise<string> {
    const file_path = await vscode.window.showSaveDialog(
        {
            title: title,
            saveLabel: save_lavel,
            filters: filters,
        }
    );
    let file_path_out = "";
    if (file_path !== undefined) {
        file_path_out = file_path.fsPath;
    }
    return file_path_out;
}

export async function get_from_open_dialog(title: string, can_select_folders: boolean, can_select_files: boolean,
    select_multiple: boolean, open_label: string, filters: any): Promise<string[]> {
    const source_path_list = await vscode.window.showOpenDialog(
        {
            title: title,
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

export async function add_sources_from_open_dialog(prj: Project_manager, logical_name: string) {
    const source_path_list = await get_from_open_dialog("Add sources", false, true, true,
        "Select source file", { 'All files (*.*)': ['*'] });

    const fileDefinitionList: t_file[] = [];
    for (const source_path of source_path_list) {
        const f: t_file = {
            name: source_path,
            is_include_file: false,
            include_path: "",
            logical_name: logical_name,
            is_manual: true,
            file_type: get_language_from_filepath(source_path),
            file_version: get_default_version_for_filepath(source_path),
            source_type: e_source_type.NONE,
        };
        fileDefinitionList.push(f);
    }
    await prj.add_file_from_array(fileDefinitionList);
}

export async function add_sources_from_directory_and_subdirectories(prj: Project_manager, allow_subdirectories: boolean) {

    const directory_list = await get_from_open_dialog("Select directory", true, false, true,
        "Select", []);
    for (const directory_inst of directory_list) {


        let hdl_extension_list: string[] = [];
        hdl_extension_list = hdl_extension_list.concat(LANGUAGE.SYSTEMVERILOG);
        hdl_extension_list = hdl_extension_list.concat(LANGUAGE.VERILOG);
        hdl_extension_list = hdl_extension_list.concat(LANGUAGE.VHDL);

        let file_list: string[] = [];
        if (allow_subdirectories) {
            file_list = find_files_by_extensions_dir_and_subdir(directory_inst, hdl_extension_list);
        }
        else {
            file_list = find_files_by_extensions_dir_and_subdir(directory_inst, []);
        }

        const fileTerosDefList: t_file[] = [];
        for (const file_inst of file_list) {
            const f: t_file = {
                name: file_inst,
                is_include_file: false,
                include_path: "",
                logical_name: "",
                is_manual: true,
                file_type: get_language_from_filepath(file_inst),
                file_version: get_default_version_for_filepath(file_inst),
                source_type: e_source_type.NONE,
            };
            fileTerosDefList.push(f);
        };
        await prj.add_file_from_array(fileTerosDefList);
    };
}

export async function add_sources_from_vunit(prj: Project_manager, is_manual: boolean) {
    const path_list = await utils.get_from_open_dialog("Select run.py", false, true, true,
        "Select VUnit run.py files", { 'Python files (*.py)': ['py'] });
    path_list.forEach(async path => {
        await prj.add_file_from_vunit(path, is_manual);
    });
}

export async function add_sources_from_vivado(prj: Project_manager, is_manual: boolean) {
    const path_list = await utils.get_from_open_dialog("Select Vivado project", false, true, true,
        "Select Vivado project", { 'Vivado project (*.xpr)': ['xpr'] });
    path_list.forEach(async path => {
        await prj.add_file_from_vivado(path, is_manual);
    });
}

export async function getFamilyDeviceFromQuartusProject(_multiProject: Multi_project_manager, 
    projectEmitter: ProjectEmitter)
    : Promise<{ family: string, device: string } | undefined> {

    const familyDevice = {
        family: "",
        device: ""
    };

    // Device family
    const family_list = await 
        getFamilyAndParts(GlobalConfigManager.getInstance().get_config(), projectEmitter);
    const family_list_string = family_list.map(x => x.family);
    let picker_family = await vscode.window.showQuickPick(family_list_string, {
        placeHolder: "Device family",
    });
    if (picker_family === undefined) {
        return undefined;
    }
    // Device part
    const part_list = family_list.filter(x => x.family === picker_family)[0].part_list;

    const picker_part = await vscode.window.showQuickPick(part_list, {
        placeHolder: "Device",
    });
    if (picker_part === undefined) {
        return undefined;
    }

    familyDevice.family = picker_family;
    familyDevice.device = picker_part;
    return familyDevice;
}