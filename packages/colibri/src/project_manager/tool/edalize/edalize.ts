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
import { e_artifact_type, e_clean_step, e_element_type, t_test_artifact, 
    t_test_declaration, t_test_result } from "../common";
import { e_config, e_tools_general_execution_mode, 
    e_tools_general_select_tool, e_tools_ghdl_waveform
    } from "../../../config/config_declaration";
import { get_edam_json } from "../../utils/utils";
import * as path_lib from "path";
import * as python from "../../../process/python";
import { get_toplevel_from_path } from "../../../utils/hdl_utils";
import * as process_utils from "../../../process/utils";
import * as file_utils from "../../../utils/file_utils";
import { p_result } from "../../../process/common";

export class Edalize extends Generic_tool_handler {

    public clean(_prj: t_project_definition, _working_directory: string, _clean_mode: e_clean_step, 
        _callback_stream: (_stream_c: any) => void): void {
        throw new Error("Method not implemented.");
    }

    constructor() {
        const supported_tools = [e_tools_general_select_tool.ghdl];
        super(supported_tools);
    }

    public async get_test_list(prj: t_project_definition):
        Promise<t_test_declaration[]> {

        const toplevel_path_list = prj.toplevel_path_manager.get();
        const test_list: t_test_declaration[] = [];
        toplevel_path_list.forEach(toplevel_path => {
            const entity_name = get_toplevel_from_path(toplevel_path);
            if (entity_name !== '') {
                const test_inst: t_test_declaration = {
                    suite_name: "",
                    name: entity_name,
                    test_type: "",
                    filename: toplevel_path,
                    location: undefined,
                };
                test_list.push(test_inst);
            }
        });
        return test_list;
    }

    public run(prj: t_project_definition, test_list: t_test_declaration[],
        working_directory: string, callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void) {

        // Get toplevel entity from toplevel path
        const top_level_list: string[] = [];
        test_list.forEach(test => {
            top_level_list.push(test.name);
        });
        const config = prj.config_manager.get_config();

        // Save EDAM project in JSON file
        let edam_json = get_edam_json(prj, top_level_list);
        // Set waveform
        edam_json = this.set_waveform(config, edam_json);

        const edam_json_str = JSON.stringify(edam_json, null, 4);
        const edam_path = process_utils.create_temp_file(edam_json_str);

        const tool_name = config.tools.general.select_tool;
        const installation_path = (<any>config.tools)[tool_name].installation_path;
        const execution_mode = config.tools.general.execution_mode;
        const developer_mode = config.general.general.developer_mode;
        const waveform_viewer = config.tools.general.waveform_viewer;
        const python_path = config.general.general.pypath;
        const make_path = config.general.general.makepath;

        // Save configuration
        const config_edalize = {
            tool_name: tool_name,
            installation_path: installation_path,
            make_installation_path: make_path,
            execution_mode: execution_mode,
            developer_mode: developer_mode,
            working_directory: working_directory,
            waveform_viewer: waveform_viewer
        };
        const config_edalize_json = JSON.stringify(config_edalize, null, 4);
        const config_edalize_path = process_utils.create_temp_file(config_edalize_json);

        // Run Edalize
        const exec_i = this.run_command(edam_path, config_edalize_path, python_path,
            (result: p_result) => {
                file_utils.remove_file(edam_path);

                const path_f = path_lib.join(working_directory, 'config_summary.txt');

                let suite_name = "";
                const artifact_list: t_test_artifact[] = [];
                if (this.is_waveform(config)){
                    // Simulation Artifact
                    const artifact_inst: t_test_artifact = {
                        name: "Waveform",
                        path: this.get_waveform_path(config),
                        content: "",
                        command: "",
                        artifact_type: e_artifact_type.WAVEFORM,
                        element_type: e_element_type.FST
                    };
                    artifact_list.push(artifact_inst);
                    suite_name = "Simulation";
                }
                const artifact_build: t_test_artifact = {
                    name: "Build folder",
                    path: path_lib.join(working_directory),
                    content: "",
                    command: "",
                    artifact_type: e_artifact_type.BUILD,
                    element_type: e_element_type.FOLDER
                };
                artifact_list.push(artifact_build);

                const test_result: t_test_result = {
                    suite_name: suite_name,
                    name: top_level_list[0],
                    edam: edam_json,
                    config_summary_path: path_f,
                    config: config,
                    artifact: artifact_list,
                    build_path: working_directory,
                    successful: result.successful,
                    stdout: result.stdout,
                    stderr: result.stderr,
                    time: 0,
                    test_path: "",
                };

                const final_result = [test_result];

                // Save config summary
                this.save_config_summary(path_f, final_result);

                callback(final_result);
            }, callback_stream);
        return exec_i;
    }

    set_waveform(config: e_config, edam_json: any) : any{
        const waveform_path = this.get_waveform_path(config);
        if (config.tools.general.execution_mode === e_tools_general_execution_mode.gui){
            if (config.tools.general.select_tool === e_tools_general_select_tool.ghdl){
                let cmd = "--wave";
                if (config.tools.ghdl.waveform === e_tools_ghdl_waveform.vcd){
                    cmd = "--vcd";
                }
                edam_json["tool_options"]["ghdl"]["config"]["run_options"].push(`${cmd}=${waveform_path}`);
                edam_json["tool_options"]["ghdl"]["config"]["run_options"] = 
                edam_json["tool_options"]["ghdl"]["config"]["run_options"].
                    filter((element: string) => element !== "");
            }
        }
        return edam_json;
    }

    get_waveform_path(config: e_config): string{
        if (config.tools.general.select_tool === e_tools_general_select_tool.ghdl){
            const extension = config.tools.ghdl.waveform;
            const waveform_path = path_lib.join(this.working_directory, `wave.${extension}`);
            return waveform_path;
        }
        return path_lib.join(this.working_directory, 'wave.vcd');
    }

    run_command(edam_path: string, config_edalize_path: string, python_path: string,
        callback: (result: p_result) => void, callback_stream: (stream_c: any) => void) {

        const python_script = path_lib.join(__dirname, 'run_edalize.py');
        const args = `"${edam_path}" "${config_edalize_path}"`;

        const exec_i = python.exec_python_script_async(python_path,
            python_script, args, "", "", (result: p_result) => {
                callback(result);
            }, callback_stream);
        return exec_i;
    }

    is_waveform(config: e_config){
        if (config.tools.general.execution_mode === e_tools_general_execution_mode.gui){
            if (config.tools.general.select_tool === e_tools_general_select_tool.ghdl){
                return true;
            }
        }
        return false;
    }
}