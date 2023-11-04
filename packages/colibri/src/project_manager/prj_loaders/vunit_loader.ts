// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import { e_config } from "../../config/config_declaration";
import { Config_manager } from "../../config/config_manager";
import { python } from "../../process/export_t";
import { t_file } from "../common";
import { Vunit } from "../tool/vunit/vunit";
import * as process_utils from "../../process/utils";
import * as file_utils from "../../utils/file_utils";
import { t_loader_file_list_result } from "../tool/common";

export async function get_files_from_vunit(config: e_config, vunit_path: string, is_manual: boolean
): Promise<t_loader_file_list_result> {

    const n_config_manager = new Config_manager();
    n_config_manager.set_config(config);

    const vunit = new Vunit();
    const simulator_name = config.tools.vunit.simulator_name;
    const simulator_install_path = vunit.get_simulator_installation_path(config);

    const simulator_conf = vunit.get_simulator_config(simulator_name, simulator_install_path);

    const py_path = n_config_manager.get_config().general.general.pypath;
    const json_path = process_utils.create_temp_file("");
    const args = `--export-json ${json_path}`;
    const result = await python.exec_python_script(py_path, vunit_path, args, simulator_conf);

    if (result.successful === true) {
        try {
            const json_str = file_utils.read_file_sync(json_path);
            const file_list = JSON.parse(json_str).files;
            const file_defined_list: t_file[] = [];
            file_list.forEach((file: any) => {
                const file_declaration: t_file = {
                    name: file.file_name,
                    is_include_file: false,
                    include_path: "",
                    logical_name: file.library_name,
                    is_manual: is_manual,
                    file_type: file_utils.get_language_from_filepath(file.file_name),
                    file_version: file_utils.get_default_version_for_filepath(file.file_name)
                };
                file_defined_list.push(file_declaration);
            });
            const result: t_loader_file_list_result = {
                file_list: file_defined_list,
                successful: true,
                msg: ""
            };
            return result;
        }
        // eslint-disable-next-line no-empty
        catch (e) { }
    }
    const result_error: t_loader_file_list_result = {
        file_list: [],
        successful: false,
        msg: "Error processing run.py"
    };
    return result_error;
}