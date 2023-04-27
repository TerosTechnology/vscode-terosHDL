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
import {
    t_test_declaration, t_test_result, t_location, e_artifact_type, e_element_type,
    t_test_artifact
} from "../common";
import { get_edam_json } from "../../utils/utils";
import * as path_lib from "path";
import * as python from "../../../process/python";
import * as process_utils from "../../../process/utils";
import { OS, e_sentence } from "../../../process/common";
import * as file_utils from "../../../utils/file_utils";
import { p_result } from "../../../process/common";
import * as t_config from "../../../config/config_declaration";
import * as fxp from "fast-xml-parser";
import * as paht_lib from 'path';
import * as nunjucks from 'nunjucks';
import { e_tools_general_select_tool } from "../../../config/config_declaration";

export class Vunit extends Generic_tool_handler {

    constructor() {
        const supported_tools = [e_tools_general_select_tool.vunit];
        super(supported_tools);
    }

    private create_runpy(prj: t_project_definition): string {
        const template_path = paht_lib.join(__dirname, 'run.nj');
        const vunit_config = prj.config_manager.get_config().tools.vunit;

        const template = nunjucks.render(template_path, {
            file_list: prj.file_manager.get(),
            config: vunit_config
        });

        return process_utils.create_temp_file(template);
    }

    public async get_test_list(prj: t_project_definition): Promise<t_test_declaration[]> {

        let toplevel_path_list = prj.toplevel_path_manager.get();
        const config = prj.config_manager.get_config();
        // Create runpy
        if (config.tools.vunit.runpy_mode === t_config.e_tools_vunit_runpy_mode.creation) {
            toplevel_path_list = [this.create_runpy(prj)];
        }
        let test_list: t_test_declaration[] = [];

        for (let i = 0; i < toplevel_path_list.length; i++) {
            const result = await this.get_runpy_test_list(config, toplevel_path_list[i]);
            test_list = test_list.concat(result);
        }

        // Remove runpy
        if (config.tools.vunit.runpy_mode === t_config.e_tools_vunit_runpy_mode.creation) {
            file_utils.remove_file(toplevel_path_list[0]);
        }

        return test_list;
    }

    private async get_runpy_test_list(config: t_config.e_config, runpy_path: string): Promise<t_test_declaration[]> {

        const json_path = process_utils.create_temp_file("");
        const args = `--export-json ${json_path}`;

        const test_list: t_test_declaration[] = [];
        const result = await python.exec_python_script(config.general.general.pypath, runpy_path, args);

        if (result.successful === true) {
            try {
                const json_str = file_utils.read_file_sync(json_path);
                const json_summary = JSON.parse(json_str);

                const vunit_test_list = json_summary["tests"];

                vunit_test_list.forEach((element: any) => {
                    const location: t_location = {
                        filename: runpy_path,
                        length: parseInt(element['location']['length']),
                        offset: parseInt(element['location']['offset'])
                    };
                    const t: t_test_declaration = {
                        suite_name: "",
                        name: element['name'],
                        test_type: "",
                        filename: runpy_path,
                        location: location,
                    };
                    test_list.push(t);
                });
                // eslint-disable-next-line no-empty
            } catch (error) { }
        }
        file_utils.remove_file(json_path);
        return test_list;
    }

    public run(prj: t_project_definition, test_list: t_test_declaration[],
        working_directory: string, callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void) {

        // Save EDAM project in JSON file
        const edam_json = get_edam_json(prj, undefined);

        // Output file
        const output_path = process_utils.create_temp_file("");

        // Run VUnit
        const exec_i = this.run_command(test_list, prj, output_path,
            (_result: p_result) => {

                const path_f = path_lib.join(working_directory, 'config_summary.txt');

                const python_script_dir = file_utils.get_directory(prj.toplevel_path_manager.get()[0]);

                const result_xml = this.get_result_from_xml(python_script_dir, output_path, test_list);
                const final_result: t_test_result[] = [];

                result_xml.forEach(tst => {

                    const log_artifact: t_test_artifact[] = [];
                    if (tst.log !== "") {
                        log_artifact.push({
                            name: `Output log`,
                            path: tst.log,
                            command: "",
                            artifact_type: e_artifact_type.CONSOLE_LOG,
                            element_type: e_element_type.TEXT_FILE
                        });
                    }

                    const test_result: t_test_result = {
                        suite_name: "",
                        name: tst.name,
                        edam: edam_json,
                        config_summary_path: path_f,
                        config: prj.config_manager.get_config(),
                        artifact: log_artifact,
                        build_path: working_directory,
                        successful: tst.successful,
                        stdout: tst.stdout,
                        stderr: '',
                        time: tst.time,
                        test_path: "",
                    };
                    final_result.push(test_result);
                });

                // file_utils.remove_file(output_path);

                // Save config summary
                this.save_config_summary(path_f, final_result);

                callback(final_result);
            }, callback_stream);
        return exec_i;
    }

    get_simulator_installation_path(prj: t_project_definition): string {
        const config = prj.config_manager.get_config();
        const simulator_name = prj.config_manager.get_config().tools.vunit.simulator_name;

        let installation_path = "";
        try {
            installation_path = (<any>config.tools)[simulator_name].installation_path;
        } catch (error) { /* empty */ }
        return installation_path;
    }

    run_command(test_list: t_test_declaration[], prj: t_project_definition,
        output_path: string, callback: (result: p_result) => void, callback_stream: (stream_c: any) => void) {

        // Config
        const config = prj.config_manager.get_config();
        const python_path = config.general.general.pypath;

        // GUI execution
        let gui_arg = "";
        if (config.tools.general.execution_mode === t_config.e_tools_general_execution_mode.gui) {
            gui_arg = "--gui";
        }

        // Test list
        const test_list_arg = this.get_test_list_argument(test_list);

        // Default options
        const args = `--no-color -x ${output_path} --exit-0 ${gui_arg} ${test_list_arg}`;

        // Simulator config
        const simulator_name = config.tools.vunit.simulator_name;
        const simulator_install_path = this.get_simulator_installation_path(prj);
        const simulator_config = this.get_simulator_config(simulator_name, simulator_install_path);

        let python_script = prj.toplevel_path_manager.get()[0];
        // Create runpy
        if (config.tools.vunit.runpy_mode === t_config.e_tools_vunit_runpy_mode.creation) {
            python_script = this.create_runpy(prj);
        }

        const python_script_directory = file_utils.get_directory(python_script);

        const exec_i = python.exec_python_script_async(python_path,
            python_script, args, simulator_config, python_script_directory, (result: p_result) => {
                // Remove runpy
                if (config.tools.vunit.runpy_mode === t_config.e_tools_vunit_runpy_mode.creation) {
                    file_utils.remove_file(python_script);
                }
                callback(result);
            }, callback_stream);
        return exec_i;
    }

    get_test_list_argument(test_list: t_test_declaration[]) {
        let arg = "";
        test_list.forEach(element => {
            arg += ` "${element.name}" `;
        });
        return arg;
    }

    get_simulator_config(simulator_name: string, simulator_install_path: string) {
        const simulator_name_low = simulator_name.toLowerCase().trim();
        let simulator_path_cmd = '';

        const export_s = process_utils.get_sentence_os(e_sentence.EXPORT);
        const more_s = process_utils.get_sentence_os(e_sentence.MORE);

        //Add simulator install path to system path
        if (process_utils.get_os() === OS.WINDOWS && simulator_install_path !== '') {
            simulator_path_cmd = `${export_s} PATH="%PATH%;${simulator_install_path}" ${more_s} `;
        }
        else if (simulator_install_path !== '') {
            simulator_path_cmd = `${export_s} PATH="$PATH:${simulator_install_path}" ${more_s} `;
        }

        const simulator_cmd = `${export_s} VUNIT_SIMULATOR=${simulator_name_low}${more_s} ${simulator_path_cmd} `;
        return simulator_cmd;
    }

    private get_result_from_xml(runpy_dir: string, xml_path: string, test_list: t_test_declaration[]) {
        const xml_string = file_utils.read_file_sync(xml_path);
        const fxp_options = { ignoreAttributes: false, attributeNamePrefix: "@_", allowBooleanAttributes: true };
        const parser = new fxp.XMLParser(fxp_options);

        try {
            const result = parser.parse(xml_string);
            const testsuites = result.testsuite;
            let testcase = testsuites.testcase;
            if (Array.isArray(testcase) === false) {
                testcase = [testcase];
            }
            const results: any[] = [];
            for (let i = 0; i < testcase.length; i++) {
                const test = testcase[i];
                const test_name = `${test['@_classname']}.${test['@_name']}`;
                const test_stdout = test['system-out'];
                let successful = true;
                if (test.failure !== undefined) {
                    successful = false;
                }
                const test_info = {
                    name: test_name,
                    successful: successful,
                    stdout: test_stdout,
                    time: parseFloat(test['@_time']),
                    log: this.get_test_log(test_name, path_lib.join(runpy_dir, 'vunit_out')),
                };
                results.push(test_info);
            }
            return results;
        } catch (e) {
            return this.get_all_test_fail(test_list);
        }
    }

    private get_test_log(testname_with_suite: string, output_folder: string) {
        let log_path = "";
        try {
            const csv_path = path_lib.join(output_folder, 'test_output', 'test_name_to_path_mapping.txt');
            const csv_content = file_utils.read_file_sync(csv_path);
            const csv_split_line = csv_content.split(/\r?\n/);
            csv_split_line.forEach(line => {
                const line_split_comma = line.split(/ (.*)/s);

                if (line_split_comma.length >= 2 && line_split_comma[1].trim() === testname_with_suite) {
                    log_path = path_lib.join(output_folder, 'test_output', line_split_comma[0].trim(), 'output.txt');
                }
            });
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
        return log_path;
    }


    private get_all_test_fail(test_list: t_test_declaration[]) {
        const results: any[] = [];
        for (let i = 0; i < test_list.length; i++) {
            const test_name = test_list[i].name;
            const test_info = {
                name: test_name,
                successful: false,
                stdout: '',
                time: 0.0
            };
            results.push(test_info);
        }
        return results;
    }

}