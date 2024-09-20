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

import { t_project_definition } from "../../project_definition";
import { Generic_tool_handler } from "../generic_handler";
import {
    e_artifact_type, e_element_type, t_test_declaration, t_test_result, t_test_artifact, e_clean_step
} from "../common";
import { e_tools_general_select_tool, e_tools_osvvm_simulator_name } from "../../../config/config_declaration";
import * as path_lib from "path";
import * as process_utils from "../../../process/utils";
import * as file_utils from "../../../utils/file_utils";
import * as yaml from "js-yaml";
import { p_result } from "../../../process/common";
import { Process } from "../../../process/process";
import { get_edam_json } from "../../utils/utils";

type t_yaml_result = {
    testsuite_name: string;
    test_name: string;
    generics: string;
    filename: string;
    time: number;
    successful: boolean;
    test_path: string;
    run_summary: string;
    run_html_log: string;
    run_text_log: string;
    test_html_summary: string;
}

export class Osvvm extends Generic_tool_handler {

    constructor() {
        const supported_tools = [e_tools_general_select_tool.osvvm];
        super(supported_tools);
    }

    public clean(_prj: t_project_definition, _working_directory: string, _clean_mode: e_clean_step,
        _callback_stream: (_stream_c: any) => void): void {
        throw new Error("Method not implemented.");
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
        const edam_json = get_edam_json(prj, top_level_list);

        // Get config
        const config = prj.config;

        const simulator_name = config.tools.osvvm.simulator_name;
        const osvvm_installation_path = config.tools.osvvm.installation_path;
        const tclsh_binary_path = config.tools.osvvm.tclsh_binary;
        const execution_mode = config.tools.general.execution_mode;
        const developer_mode = config.general.general.developer_mode;
        const waveform_viewer = config.tools.general.waveform_viewer;

        // Save configuration
        const config_edalize = {
            tool_name: config.tools.general.select_tool,
            installation_path: osvvm_installation_path,
            execution_mode: execution_mode,
            developer_mode: developer_mode,
            working_directory: working_directory,
            waveform_viewer: waveform_viewer
        };
        const config_edalize_json = JSON.stringify(config_edalize, null, 4);
        process_utils.create_temp_file(config_edalize_json);

        const toplevel = top_level_list[0];

        // Run OSVVM
        const exec_i = this.run_command(simulator_name, osvvm_installation_path, toplevel, tclsh_binary_path,
            working_directory, (result: p_result, project_name: string) => {

                const final_result: t_test_result[] = [];
                const path_f = path_lib.join(working_directory, 'config_summary.txt');
                const result_yaml = this.get_test_result(working_directory, project_name, toplevel);
                result_yaml.forEach(result_inst => {

                    const artifact_0: t_test_artifact = {
                        name: `Run summary`,
                        path: result_inst.run_summary,
                        command: "",
                        content: "",
                        artifact_type: e_artifact_type.SUMMARY,
                        element_type: e_element_type.HTML_FILE
                    };

                    const artifact_1: t_test_artifact = {
                        name: `Run HTML log`,
                        path: result_inst.run_html_log,
                        command: "",
                        content: "",
                        artifact_type: e_artifact_type.CONSOLE_LOG,
                        element_type: e_element_type.HTML_FILE
                    };

                    const artifact_2: t_test_artifact = {
                        name: `Run text log`,
                        path: result_inst.run_text_log,
                        command: "",
                        content: "",
                        artifact_type: e_artifact_type.CONSOLE_LOG,
                        element_type: e_element_type.TEXT_FILE
                    };

                    const artifact_3: t_test_artifact = {
                        name: `Test summary`,
                        path: result_inst.test_html_summary,
                        command: "",
                        content: "",
                        artifact_type: e_artifact_type.SUMMARY,
                        element_type: e_element_type.HTML_FILE
                    };

                    const test_result: t_test_result = {
                        suite_name: result_inst.testsuite_name,
                        name: result_inst.test_name,
                        edam: edam_json,
                        config_summary_path: path_f,
                        config: config,
                        artifact: [artifact_0, artifact_1, artifact_2, artifact_3],
                        build_path: working_directory,
                        successful: result_inst.successful,
                        stdout: result.stdout,
                        stderr: result.stderr,
                        time: result_inst.time,
                        test_path: result_inst.test_path
                    };
                    final_result.push(test_result);
                });

                // Save config summary
                this.save_config_summary(path_f, final_result);

                callback(final_result);
            }, callback_stream);
        return exec_i;
    }

    run_command(simulator_name: e_tools_osvvm_simulator_name, osvvm_installation_path: string,
        toplevel: string, tclsh_binary_path: string, working_directory: string,
        callback: (result: p_result, project_name: string) => void, callback_stream: (stream_c: any) => void) {

        // Create working directory
        const extra_build_library = path_lib.join(osvvm_installation_path, 'OsvvmLibraries.pro');
        const extra_build = `build ${extra_build_library}`;
        if (file_utils.check_if_path_exist(working_directory)) {
            // extra_build = '';
        } else {
            //Create working directory
            file_utils.create_directory(working_directory, true);
        }

        // Create cmd
        const scripts_base_dir = path_lib.join(osvvm_installation_path, 'Scripts');
        let config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartUp.tcl');

        if (simulator_name === e_tools_osvvm_simulator_name.activehdl) {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartUp.tcl');
        }
        else if (simulator_name === e_tools_osvvm_simulator_name.ghdl) {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartUp.tcl');
        }
        else if (simulator_name === e_tools_osvvm_simulator_name.nvc) {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartNVC.tcl');
        }
        else if (simulator_name === e_tools_osvvm_simulator_name.rivierapro) {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartUp.tcl');
        }
        else if (simulator_name === e_tools_osvvm_simulator_name.questa) {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartUp.tcl');
        }
        else if (simulator_name === e_tools_osvvm_simulator_name.modelsim) {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartUp.tcl');
        }
        else if (simulator_name === e_tools_osvvm_simulator_name.vcs) {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartVCS.tcl');
        }
        else if (simulator_name === e_tools_osvvm_simulator_name.xsim) {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartXSIM.tcl');
        }
        else if (simulator_name === e_tools_osvvm_simulator_name.xcelium) {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartXcelium.tcl');
        }

        let tclsh_binary_path_i = tclsh_binary_path;
        if (tclsh_binary_path === "") {
            tclsh_binary_path_i = "tclsh";
        }

        const pro_top_file = `
source ${config_simulator_tcl}
${extra_build}
build ${toplevel}\n
exit
`;

        const pro_top_path = path_lib.join(working_directory, 'teroshdl_project_osvvm.pro');
        file_utils.save_file_sync(pro_top_path, pro_top_file);

        let cmd = `${tclsh_binary_path_i} ${pro_top_path}`;
        if (simulator_name === e_tools_osvvm_simulator_name.modelsim ||
            simulator_name === e_tools_osvvm_simulator_name.questa) {
            cmd = `vsim -c -do ${pro_top_path}`;
        }

        const project_name_extname = path_lib.extname(toplevel);
        const parent_dir = path_lib.dirname(toplevel).split(path_lib.sep).pop();
        const project_name = parent_dir + '_' + path_lib.basename(toplevel, project_name_extname);

        const opt_exec = { cwd: working_directory };
        const p = new Process();

        const exec_i = p.exec(cmd, opt_exec, (result: p_result) => {
            callback(result, project_name);
        });
        callback_stream(exec_i);
    }

    get_test_result(working_folder: string, project_name: string, toplevel: string): t_yaml_result[] {
        const result_path = path_lib.join(working_folder, `${project_name}.yml`);
        const result: t_yaml_result[] = [];

        if (file_utils.check_if_path_exist(result_path) === false) {
            return result;
        }

        try {
            const result_yaml = <any>yaml.load(file_utils.read_file_sync(result_path));
            result_yaml['TestSuites'].forEach((testsuite: any) => {
                const testsuite_name = testsuite['Name'];
                testsuite['TestCases'].forEach((test: any) => {
                    const test_name = `${testsuite_name}.${test['TestCaseName']}`;
                    const test_filename = test['TestCaseName'];
                    const test_generics = test['TestCaseGenerics'];
                    const time = test['ElapsedTime'];

                    // Run summary
                    const run_summary = path_lib.join(working_folder, `${project_name}.html`);
                    // Run HTML log
                    const run_html_log = path_lib.join(working_folder, 'logs',
                        `${result_yaml["BuildInfo"]["Simulator Version"]}`, `${project_name}_log.html`);
                    // Run text log
                    const run_text_log = path_lib.join(working_folder, 'logs',
                        `${result_yaml["BuildInfo"]["Simulator Version"]}`, `${project_name}.log`);
                    // Test HTML summary
                    const test_html_summary = path_lib.join(working_folder, 'reports', testsuite_name,
                        `${test_filename}.html`);

                    let successful = false;
                    if (test['Status'] !== undefined && test['Status'] === 'PASSED') {
                        successful = true;
                    }

                    let test_path = path_lib.join(file_utils.get_directory(toplevel),
                        `${test['TestCaseFileName']}.vhdl`);
                    if (file_utils.check_if_path_exist(test_path) === false) {
                        test_path = path_lib.join(file_utils.get_directory(toplevel),
                            `${test['TestCaseFileName']}.vhd`);
                    }

                    result.push({
                        testsuite_name: testsuite_name,
                        test_name: test_name,
                        generics: test_generics,
                        filename: test_filename,
                        time: parseFloat(time),
                        successful: successful,
                        test_path: test_path,
                        run_summary: run_summary,
                        run_html_log: run_html_log,
                        run_text_log: run_text_log,
                        test_html_summary: test_html_summary
                    });
                });
            });
            return result;
            // eslint-disable-next-line no-empty
        } catch (e) { }
        return result;
    }

    get_simulator_installation_path(prj: t_project_definition): string {
        const config = prj.config;
        const simulator_name = prj.config.tools.osvvm.simulator_name;

        let installation_path = "";
        try {
            installation_path = (<any>config.tools)[simulator_name].installation_path;
        } catch (error) { /* empty */ }
        return installation_path;
    }
}