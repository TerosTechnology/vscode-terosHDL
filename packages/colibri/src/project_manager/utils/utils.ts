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

export function get_edam_json(prj: t_project_definition, top_level_list: undefined | string[]) {
    const tool_name = prj.config_manager.get_tool_name();
    const tool_options = prj.config_manager.get_tool_options();
    const tmp_edam_0 = `{ "${tool_name}" : ${JSON.stringify(tool_options)} }`;
    const tmp_edam_1 = JSON.parse(tmp_edam_0);

    if (top_level_list === undefined) {
        top_level_list = prj.toplevel_path_manager.get();
    }

    let top_level = "";
    if (top_level_list.length > 0) {
        top_level = top_level_list[0];
    }

    const edam_json = {
        files: prj.file_manager.get(),
        hooks: prj.hook_manager.get(),
        watchers: prj.watcher_manager.get(),
        name: prj.name,
        // parameters: prj.parameter_manager.get(),
        tool_options: tmp_edam_1,
        toplevel: top_level
    };

    return edam_json;
}

export function get_edam_yaml(prj: t_project_definition, top_level_list: undefined | string[]) {
    const edam_json = get_edam_json(prj, top_level_list);
    const edam_yaml = convert_to_yaml(edam_json);
    return edam_yaml;
}

