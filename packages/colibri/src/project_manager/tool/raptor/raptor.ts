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

import { t_project_definition } from "../../project_definition";
import { Generic_tool_handler } from "../generic_handler";
import { t_test_declaration, t_test_result, e_clean_step} from "../common";
import { e_tools_general_select_tool } from "../../../config/config_declaration";
import * as path_lib from "path";
import * as process_utils from "../../../process/utils";
import * as file_utils from "../../../utils/file_utils";
import { p_result } from "../../../process/common";
import { Process } from "../../../process/process";
import * as prj_creator from "./prj_creator";
import * as out_getter from "./artifacts";
import { e_tools_raptor } from "../../../config/config_declaration";

// import { get_edam_json } from "../../utils/utils";

export class Raptor extends Generic_tool_handler {

    constructor() {
        const supported_tools = [e_tools_general_select_tool.raptor];
        super(supported_tools);
    }

    public get_test_list(prj: t_project_definition): t_test_declaration[] {
        const toplevel_path_list = prj.toplevel_path_manager.get();
        const test_list: t_test_declaration[] = [];
        toplevel_path_list.forEach(toplevel_path => {
            const test_inst: t_test_declaration = {
                name: file_utils.get_filename(toplevel_path, true),
                test_type: "",
                filename: toplevel_path,
                location: undefined,
                suite_name: ""
            };
            test_list.push(test_inst);
        });
        return test_list;
    }

    public run(prj: t_project_definition, _test_list: t_test_declaration[],
        working_directory: string, callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void) {

        const top_level_list = prj.toplevel_path_manager.get();

        if (top_level_list.length === 0) {
            return undefined;
        }

        // Save EDAM project in JSON file
        // const edam_json = get_edam_json(prj, top_level_list);

        // Get config
        const config = prj.config_manager.get_config();
        
        let installation_path = config.tools.raptor.installation_path;
        if (installation_path === ""){
            installation_path = "raptor";
        }
        else{
            installation_path = path_lib.join(installation_path, "raptor");
        }

        const execution_mode = config.tools.general.execution_mode;
        const developer_mode = config.general.general.developer_mode;
        const waveform_viewer = config.tools.general.waveform_viewer;

        // Save configuration
        const config_edalize = {
            tool_name: config.tools.general.select_tool,
            installation_path: installation_path,
            execution_mode: execution_mode,
            developer_mode: developer_mode,
            working_directory: working_directory,
            waveform_viewer: waveform_viewer
        };
        const config_edalize_json = JSON.stringify(config_edalize, null, 4);
        process_utils.create_temp_file(config_edalize_json);

        // Project script
        const tcl_content = prj_creator.get_tcl_script(prj, false, undefined);
        
        const exec_i = this.run_command(config.tools.raptor, tcl_content, working_directory, false,
            (result: p_result) => {

                const base_path = path_lib.join(working_directory, prj.name);
                const result_list = out_getter.get_results(prj.name, config, base_path, working_directory, result);

                callback(result_list);
            }, callback_stream);
        return exec_i;
    }

    public clean(prj: t_project_definition, working_directory: string, clean_mode: e_clean_step,
        callback_stream: (stream_c: any) => void) {

        const top_level_list = prj.toplevel_path_manager.get();

        if (top_level_list.length === 0) {
            return undefined;
        }

        // Get config
        const config = prj.config_manager.get_config();
        
        let installation_path = config.tools.raptor.installation_path;
        if (installation_path === ""){
            installation_path = "raptor";
        }
        else{
            installation_path = path_lib.join(installation_path, "raptor");
        }

        // Project script
        const tcl_content = prj_creator.get_tcl_script(prj, true, clean_mode);
        
        const exec_i = this.run_command(config.tools.raptor, tcl_content, working_directory, true,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            (_result: p_result) => {}, callback_stream);
        return exec_i;
    }

    run_command(config: e_tools_raptor, prj_script_content: string, working_directory: string, clean_mode: boolean,
        callback: (result: p_result) => void, callback_stream: (stream_c: any) => void) {

        // Create working directory
        if (file_utils.check_if_path_exist(working_directory)) {
            // extra_build = '';
        } else {
            //Create working directory
            file_utils.create_directory(working_directory, true);
        }

        // Create prj tcl script
        let tcl_path = path_lib.join(working_directory, "prj.tcl");
        if (clean_mode){
            tcl_path = path_lib.join(working_directory, "clean_prj.tcl");
        }
        file_utils.save_file_sync(tcl_path, prj_script_content);

        // Create cmd
        const installation_cmd = this.get_installation_path_cmd(config);
        const cmd = `${installation_cmd} --script ${tcl_path} --batch`;

        const opt_exec = { cwd: working_directory };
        const p = new Process();

        const exec_i = p.exec(cmd, opt_exec, (result: p_result) => {
            callback(result);
        });
        callback_stream(exec_i);
    }

    get_installation_path_cmd(config: e_tools_raptor): string{
        if (config.installation_path === ""){
            return "raptor";
        }
        else{
            return path_lib.join(config.installation_path, 'raptor');
        }
    }
}