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
import { t_loader_action_result } from "./common";
import * as path_lib from "path";
import * as process_utils from "../../process/utils";
import * as process from "../../process/process";
import { get_files_from_csv } from "./csv_loader";
import * as file_utils from "../../utils/file_utils";

export async function get_files_from_vivado(config: e_config, vivado_path: string, is_manual: boolean)
    : Promise<t_loader_action_result> {

    // Get Vivado binary path
    let vivado_bin = config.tools.vivado.installation_path;
    if (vivado_bin === "") {
        vivado_bin = "vivado";
    }
    else {
        vivado_bin = path_lib.join(vivado_bin, "vivado");
    }

    // Create temp file for out.csv
    const csv_file = process_utils.create_temp_file("");
    const tcl_file = path_lib.join(__dirname, 'prj_loaders', 'vivado.tcl');

    const cmd = `${vivado_bin} -mode batch -source ${tcl_file} -tclargs ${vivado_path} ${csv_file}`;
    const cmd_result = await (new process.Process(undefined)).exec_wait(cmd);

    const result: t_loader_action_result = {
        file_list: [],
        successful: cmd_result.successful,
        msg: cmd_result.stderr + cmd_result.stdout
    };

    if (!cmd_result.successful) {
        return result;
    }

    const result_csv = get_files_from_csv(csv_file, is_manual);
    result.file_list = result_csv.file_list;

    // Delete temp file
    file_utils.remove_file(csv_file);

    return result;
}