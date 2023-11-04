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

import { e_config } from "../../../config/config_declaration";
import { p_result } from "../../../process/common";
import { t_loader_file_list_result, t_loader_prj_info_result, t_loader_boards_result, t_loader_action_result }
    from "../common";
import * as process_utils from "../../../process/utils";
import * as process from "../../../process/process";
import * as file_utils from "../../../utils/file_utils";
import * as path_lib from "path";
import { get_files_from_csv } from "../../prj_loaders/csv_loader";
import { t_file } from "../../common";
import { LANGUAGE } from "../../../common/general";
import * as nunjucks from 'nunjucks';

export const LANGUAGE_MAP: Record<LANGUAGE, string> = {
    [LANGUAGE.VHDL]: "VHDL_FILE",
    [LANGUAGE.VERILOG]: "VERILOG_FILE",
    [LANGUAGE.SYSTEMVERILOG]: "SYSTEMVERILOG_FILE",
    [LANGUAGE.CPP]: "",
    [LANGUAGE.C]: "",
    [LANGUAGE.PYTHON]: "",
    [LANGUAGE.VERIBLELINTRULES]: "",
    [LANGUAGE.TCL]: "",
    [LANGUAGE.XDC]: "",
    [LANGUAGE.SDC]: "",
    [LANGUAGE.PIN]: "",
    [LANGUAGE.XCI]: "",
    [LANGUAGE.SBY]: "",
    [LANGUAGE.PRO]: "",
    [LANGUAGE.NONE]: "",
    [LANGUAGE.QIP]: "",
    [LANGUAGE.UCF]: ""
};

async function execute_quartus_tcl(config: e_config, tcl_file: string, args: string, cwd: string):
    Promise<{ result: p_result, csv_content: string }> {

    // Get Vivado binary path
    let quartus_bin = config.tools.quartus.installation_path;
    if (quartus_bin === "") {
        quartus_bin = "quartus_sh";
    }
    else {
        quartus_bin = path_lib.join(quartus_bin, "quartus_sh");
    }

    // Create temp file for out.csv
    const csv_file = process_utils.create_temp_file("");

    const cmd = `${quartus_bin} -t ${tcl_file} ${csv_file} ${args}`;
    const cmd_result = await (new process.Process(undefined)).exec_wait(cmd, { cwd: cwd });

    const csv_content = await file_utils.read_file_sync(csv_file);

    file_utils.remove_file(csv_file);

    return { result: cmd_result, csv_content: csv_content };
}

export async function get_project_info_from_quartus(config: e_config, prj_path: string)
    : Promise<t_loader_prj_info_result> {

    const args = prj_path;
    const tcl_file = path_lib.join(__dirname, 'bin', 'project_info.tcl');

    const cmd_result = await execute_quartus_tcl(config, tcl_file, args, "");

    const result: t_loader_prj_info_result = {
        prj_name: "",
        prj_revision: "",
        prj_top_entity: "",
        successful: cmd_result.result.successful,
        msg: cmd_result.result.stderr + cmd_result.result.stdout
    };

    if (!cmd_result.result.successful) {
        return result;
    }

    try {
        const data = cmd_result.csv_content.split(',');

        if (data.length === 3) {
            result.prj_name = data[0].trim();
            result.prj_revision = data[1].trim();
            result.prj_top_entity = data[2].trim();
        } else {
            return result;
        }
    } catch (error) { /* empty */ }

    result.successful = false;
    return result;
}

export async function get_family_and_parts_list(config: e_config): Promise<t_loader_boards_result> {

    ////////////////////////////////////////////////////////////////////////////
    // Get family list
    ////////////////////////////////////////////////////////////////////////////
    const tcl_file = path_lib.join(__dirname, 'bin', 'get_boards.tcl');
    const args = "";

    const cmd_result = await execute_quartus_tcl(config, tcl_file, args, "");

    const result: t_loader_boards_result = {
        board_list: [],
        successful: cmd_result.result.successful,
        msg: cmd_result.result.stderr + cmd_result.result.stdout
    };

    if (!cmd_result.result.successful) {
        return result;
    }

    try {
        const board_list_str = cmd_result.csv_content.split(/\r\n|\n|\r/);
        for (const board_str of board_list_str) {
            const board_list = board_str.split(',');

            const family = board_list[0].trim();
            const part = board_list.slice(1).map((s: string) => s.trim());

            if (family === "") {
                continue;
            }
            result.board_list.push({
                family: family,
                part_list: part
            });
        }
    } catch (error) { /* empty */ }

    result.successful = false;
    return result;
}

export async function get_files_from_quartus(config: e_config, prj_path: string, is_manual: boolean):
    Promise<t_loader_file_list_result> {

    const tcl_file = path_lib.join(__dirname, 'bin', 'get_files.tcl');
    const args = prj_path;

    const cmd_result = await execute_quartus_tcl(config, tcl_file, args, "");

    const result: t_loader_file_list_result = {
        file_list: [],
        successful: cmd_result.result.successful,
        msg: cmd_result.result.stderr + cmd_result.result.stdout
    };

    if (!cmd_result.result.successful) {
        return result;
    }

    // Create temp file csv
    const csv_file = process_utils.create_temp_file("");
    file_utils.save_file_sync(csv_file, cmd_result.csv_content);

    const result_csv = get_files_from_csv(csv_file, is_manual);
    result.file_list = result_csv.file_list;

    // Delete temp file
    file_utils.remove_file(csv_file);

    return result;
}

export async function execute_cmd_list_in_quartus_project(config: e_config, prj_path: string, cmd_list: string[])
    : Promise<t_loader_action_result> {

    const template_content = file_utils.read_file_sync(path_lib.join(__dirname, 'bin', 'cmd_exec.tcl'));
    const template_render = nunjucks.renderString(template_content, { "cmd_list": cmd_list });

    // Create temp file
    const tcl_file = process_utils.create_temp_file(template_render);
    const args = prj_path;

    const cmd_result = await execute_quartus_tcl(config, tcl_file, args, "");

    const result: t_loader_action_result = {
        successful: cmd_result.result.successful,
        msg: cmd_result.result.stderr + cmd_result.result.stdout
    };

    // Delete temp file
    file_utils.remove_file(tcl_file);

    return result;
}

export async function add_files_to_quartus_prj(config: e_config, prj_path: string, file_list: t_file[])
    : Promise<t_loader_action_result> {

    const cmd_list: string[] = [];
    for (const file of file_list) {
        let cmd = `set_global_assignment -name ${LANGUAGE_MAP[file.file_type]} ${file.name}`;
        if (file.logical_name !== "") {
            cmd += ` -library ${file.logical_name}`;
        }
        cmd_list.push(cmd);
    }

    const result = await execute_cmd_list_in_quartus_project(config, prj_path, cmd_list);
    return result;
}

export async function remove_files_to_quartus_prj(config: e_config, prj_path: string, file_list: t_file[])
    : Promise<t_loader_action_result> {

    const cmd_list: string[] = [];
    for (const file of file_list) {
        let cmd = `set_global_assignment -remove -name ${LANGUAGE_MAP[file.file_type]} ${file.name}`;
        if (file.logical_name !== "") {
            cmd += ` -library ${file.logical_name}`;
        }
        cmd_list.push(cmd);
    }

    const result = await execute_cmd_list_in_quartus_project(config, prj_path, cmd_list);
    return result;
}

export async function create_quartus_project(config: e_config, project_directory: string, name: string,
    family: string, part: string): Promise<t_loader_action_result> {

    const tcl_file = path_lib.join(__dirname, 'bin', 'create_project.tcl');
    const args = `"${name}" "${family}" "${part}"`;

    const cmd_result = await execute_quartus_tcl(config, tcl_file, args, project_directory);

    const result: t_loader_action_result = {
        successful: cmd_result.result.successful,
        msg: cmd_result.result.stderr + cmd_result.result.stdout
    };
    return result;
}

export async function clean_project(config: e_config, prj_path: string)
    : Promise<t_loader_action_result> {

    const cmd = "project_clean";
    const result = await execute_cmd_list_in_quartus_project(config, prj_path, [cmd]);
    return result;
}