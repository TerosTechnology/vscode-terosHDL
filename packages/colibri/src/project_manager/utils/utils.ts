// Copyright 2022
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

import { t_project_definition } from "../project_definition";
import { convert_to_yaml } from "./json2yaml";
import * as file_utils from "../../utils/file_utils";
import * as hdl_utils from "../../utils/hdl_utils";
import * as general from "../../common/general";

export function get_edam_json(prj: t_project_definition, top_level_list: undefined | string[], 
    refrence_path? : string) {

    const tool_name = prj.config_manager.get_tool_name();
    const tool_options = prj.config_manager.get_tool_options();
    const tmp_edam_0 = `{ "${tool_name}" : ${JSON.stringify(tool_options)} }`;
    const tmp_edam_1 = JSON.parse(tmp_edam_0);

    if (top_level_list === undefined) {
        top_level_list = prj.toplevel_path_manager.get(refrence_path);
    }

    let top_level = "";
    if (top_level_list.length > 0) {
        top_level = top_level_list[0];
    }

    const edam_json = {
        files: prj.file_manager.get(refrence_path),
        hooks: prj.hook_manager.get(),
        watchers: prj.watcher_manager.get(refrence_path),
        name: prj.name,
        // parameters: prj.parameter_manager.get(),
        tool_options: tmp_edam_1,
        toplevel: top_level
    };

    return edam_json;
}

export function get_edam_yaml(prj: t_project_definition, top_level_list: undefined | string[], 
    reference_path?: string) {
    const edam_json = get_edam_json(prj, top_level_list, reference_path);
    const edam_yaml = convert_to_yaml(edam_json);
    return edam_yaml;
}

export function get_file_type(filepath: string) {
    const extension = file_utils.get_file_extension(filepath);
    let file_type = '';
    const hdl_lang = hdl_utils.get_lang_from_extension(extension);

    if (hdl_lang === general.HDL_LANG.VHDL) {
        file_type = 'vhdlSource-2008';
    } else if (hdl_lang === general.HDL_LANG.VERILOG) {
        file_type = 'verilogSource-2005';
    } else if (hdl_lang === general.HDL_LANG.SYSTEMVERILOG) {
        file_type = 'systemVerilogSource';
    } else if (extension === '.c') {
        file_type = 'cSource';
    } else if (extension === '.cpp') {
        file_type = 'cppSource';
    } else if (extension === '.vbl') {
        file_type = 'veribleLintRules';
    } else if (extension === '.tcl') {
        file_type = 'tclSource';
    } else if (extension === '.py') {
        file_type = 'python';
    } else if (extension === '.xdc') {
        file_type = 'xdc';
    } else if (extension === '.sdc') {
        file_type = 'SDC';
    } else if (extension === '.pin') {
        file_type = 'pin';
    } else if (extension === '.xci') {
        file_type = 'xci';
    } else if (extension === '.sby') {
        file_type = 'sbyConfigTemplate';
    } else if (extension === '.pro') {
        file_type = 'osvvmProject';
    } else {
        file_type = extension.substring(1).toLocaleUpperCase();
    }
    return file_type;
}