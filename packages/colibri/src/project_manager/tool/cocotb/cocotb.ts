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
import { e_clean_step, t_test_declaration, t_test_result } from "../common";
import { t_exec_config } from "../../../config/auxiliar_config";
import { e_tools_general_execution_mode, e_tools_general_select_tool } from "../../../config/config_declaration";
import { get_edam_json } from "../../utils/utils";
import * as path_lib from "path";
import * as process_utils from "../../../process/utils";
import * as file_utils from "../../../utils/file_utils";
import { p_result } from "../../../process/common";
import { Process } from "../../../process/process";
import { e_sentence } from "../../../process/common";
import * as fxp from "fast-xml-parser";

export class Cocotb extends Generic_tool_handler {
    
    public clean(_prj: t_project_definition, _working_directory: string, _clean_mode: e_clean_step, 
        _callback_stream: (_stream_c: any) => void): void {
        throw new Error("Method not implemented.");
    }

    constructor() {
        const supported_tools = [e_tools_general_select_tool.cocotb];
        super(supported_tools);
    }

    public async get_test_list(prj: t_project_definition):
        Promise<t_test_declaration[]> {

        const found_makefiles = prj.toplevel_path_manager.get();
        const cocotb_makefiles: { makefile: string, modules: string[] }[] = [];

        const cocotb_makefile_must_contain = "include $(shell cocotb-config --makefiles)/Makefile.sim";
        let tmp_path = "";

        for (const item of found_makefiles) {
            const data = file_utils.read_file_sync(path_lib.resolve(item));
            if (data.includes(cocotb_makefile_must_contain)) {
                const new_data = data.replace(cocotb_makefile_must_contain, '');
                tmp_path = process_utils.create_temp_file(`${new_data}\nprint-%  : ; @echo $* = $($*)\n`);

                const cmd = `make -f ${tmp_path} print-MODULE`;

                const p = new Process();
                let modules = await (await p.exec_wait(cmd)).stdout;

                modules = modules.replace(/(\r\n|\n|\r)/, '');
                let modules_arr = modules.split(' ');
                modules_arr = modules_arr.filter(item => item !== "MODULE");
                modules_arr = modules_arr.filter(item => item !== "=");
                cocotb_makefiles.push({ makefile: item, modules: modules_arr });
            }
        }

        const test_array: t_test_declaration[] = [];

        for (const makefile of cocotb_makefiles) {
            for (const module of makefile.modules) {
                const test_name = module;
                const module_path = file_utils.get_directory(makefile.makefile);
                const filename = path_lib.join(module_path, test_name);

                let python_cocotb_data;
                try {
                    python_cocotb_data = file_utils.read_file_sync(`${filename}.py`);
                } catch {
                    continue;
                }

                const input = python_cocotb_data;
                // eslint-disable-next-line max-len, no-useless-escape
                const regex = /(^[^#\r\n]* *@cocotb\.test[ \t]*\([ \t\w=.()"'\[\],]*\)[ \t]*(\r\n|\n|\r))([^#\r\n]*[ \t]*(async)?def[ \t]+([\w_]+)[ \t]*\([ \t\w_]+\)[ \t]*:[ \t]*$)/gm;

                let cocotb_test_matches: RegExpExecArray | null;
                const cocotb_tests: { name: string, offset: number, length: number }[] = [];
                // eslint-disable-next-line no-cond-assign
                while (cocotb_test_matches = regex.exec(input)) {
                    const match_group_name = 5;
                    const match_group_function_line = 3;
                    const match_group_decorator = 1;

                    cocotb_tests.push(
                        {
                            name: cocotb_test_matches[match_group_name],
                            // line: lineNumber,
                            offset: cocotb_test_matches.index + cocotb_test_matches[match_group_decorator].length,
                            length: cocotb_test_matches[match_group_function_line].length
                        }
                    );
                }

                for (const cocotb_test of cocotb_tests) {
                    const test_item: t_test_declaration = {
                        suite_name: "",
                        name: cocotb_test.name,
                        test_type: "",
                        filename: path_lib.resolve(makefile.makefile),
                        location: {
                            filename: `${filename}.py`,
                            length: cocotb_test.length,
                            offset: cocotb_test.offset
                        },
                    };
                    test_array.push(test_item);
                }
            }
        }
        file_utils.remove_file(tmp_path);
        return (test_array);
    }


    public run(prj: t_project_definition, test_list: t_test_declaration[],
        working_directory: string, callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void) {

        const execution_config = prj.config_manager.get_exec_config();
        const config = prj.config_manager.get_config();

        // Get toplevel entity from toplevel path
        const toplevel_path = prj.toplevel_path_manager.get()[0];

        const edam_json = get_edam_json(prj, undefined);

        // Output file
        const output_path = process_utils.create_temp_file("");

        // Run cocotb
        const exec_i = this.run_command(output_path, execution_config, prj, test_list,
            toplevel_path, (_result: p_result) => {

                const path_f = path_lib.join(working_directory, 'config_summary.txt');

                const result_xml = this.get_result_from_xml(output_path, test_list);
                const final_result: t_test_result[] = [];

                result_xml.forEach(tst => {
                    const test_result: t_test_result = {
                        suite_name: "",
                        name: tst.name,
                        edam: edam_json,
                        config_summary_path: path_f,
                        config: config,
                        artifact: [],
                        build_path: working_directory,
                        successful: tst.successful,
                        stdout: tst.stdout,
                        stderr: '',
                        time: tst.time,
                        test_path: "",
                    };
                    final_result.push(test_result);
                });

                file_utils.remove_file(output_path);

                // Save config summary
                this.save_config_summary(path_f, final_result);

                callback(final_result);
            }, callback_stream);
        return exec_i;
    }

    private get_result_from_xml(xml_path: string, test_list: t_test_declaration[]) {
        const xml_string = file_utils.read_file_sync(xml_path);
        const fxp_options = { ignoreAttributes: false, attributeNamePrefix: "@_", allowBooleanAttributes: true };
        const parser = new fxp.XMLParser(fxp_options);

        try {
            const result = parser.parse(xml_string);
            const testsuites = result.testsuites.testsuite;
            let testcase = testsuites.testcase;
            if (Array.isArray(testcase) === false) {
                testcase = [testcase];
            }
            const results: any[] = [];
            for (let i = 0; i < testcase.length; i++) {
                const test = testcase[i];
                const test_name = `${test['@_classname']}.${test['@_name']}`;
                const test_stdout = "";
                let successful = true;
                if (test.failure !== undefined) {
                    successful = false;
                }
                const test_info = {
                    name: test_name,
                    successful: successful,
                    stdout: test_stdout,
                    time: parseFloat(test['@_time'])
                };
                results.push(test_info);
            }
            return results;
        } catch (e) {
            return this.get_all_test_fail(test_list);
        }
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

    private run_command(output_path: string, execution_config: t_exec_config,
        prj: t_project_definition, test_list: t_test_declaration[],
        toplevel_path: string,
        callback: (result: p_result) => void, callback_stream: (stream_c: any) => void) {

        let cmd_tests = '';
        if (test_list.length > 0) {
            cmd_tests = 'TESTCASE=';
            for (let i = 0; i < test_list.length - 1; i++) {
                const element = test_list[i].name.split('.');
                const testname = element[element.length - 1];
                cmd_tests += testname + ',';
            }
            const test_split = test_list[test_list.length - 1].name.split('.');
            const testname = test_split[test_split.length - 1];
            cmd_tests += testname;
        }

        const simulator_cmd = this.get_simulator(prj);
        const gui = this.get_gui(execution_config);
        const out_cmd = this.get_out(output_path);
        const default_cmd = this.get_default_cmd(prj);

        const cmd = `${default_cmd}${out_cmd}${simulator_cmd}${gui} make -f ${toplevel_path} ${cmd_tests}`;

        const toplevel_dir = file_utils.get_directory(toplevel_path);
        const opt_exec = { cwd: toplevel_dir };
        const p = new Process();
        const exec_i = p.exec(cmd, opt_exec, (result: p_result) => {
            callback(result);
        });
        callback_stream(exec_i);
    }

    private get_out(output_path: string): string {
        const export_s = process_utils.get_sentence_os(e_sentence.EXPORT);
        const more_s = process_utils.get_sentence_os(e_sentence.MORE);

        const cmd = `${export_s} COCOTB_RESULTS_FILE=${output_path}${more_s} `;
        return cmd;
    }

    private get_gui(execution_config: t_exec_config): string {
        if (execution_config.execution_mode !== e_tools_general_execution_mode.gui) {
            return "";
        }
        const export_s = process_utils.get_sentence_os(e_sentence.EXPORT);
        const more_s = process_utils.get_sentence_os(e_sentence.MORE);

        const cmd = `${export_s} GUI=1${more_s} `;
        return cmd;
    }

    private get_default_cmd(prj: t_project_definition): string {
        const export_s = process_utils.get_sentence_os(e_sentence.EXPORT);
        const more_s = process_utils.get_sentence_os(e_sentence.MORE);

        const tool_option = prj.config_manager.get_config().tools.cocotb;

        // eslint-disable-next-line max-len
        const compile_args = tool_option.compile_args === '' ? '' : `${export_s} COMPILE_ARGS=${tool_option.compile_args}${more_s} `;
        // eslint-disable-next-line max-len
        const plusargs = tool_option.plusargs === '' ? '' : `${export_s} PLUSARGS=${tool_option.plusargs}${more_s} `;
        // eslint-disable-next-line max-len
        const run_args = tool_option.run_args === '' ? '' : `${export_s} RUN_ARGS=${tool_option.run_args}${more_s} `;
        // eslint-disable-next-line max-len
        const no_color = `${export_s} NO_COLOR=1${more_s} `;

        // eslint-disable-next-line max-len
        const cmd = `${no_color}${compile_args}${plusargs}${run_args}`;
        return cmd;
    }

    private get_simulator(prj: t_project_definition): string {
        const tool_option = prj.config_manager.get_config().tools.cocotb;
        const simulator_name = tool_option.simulator_name;
        const export_s = process_utils.get_sentence_os(e_sentence.EXPORT);
        const more_s = process_utils.get_sentence_os(e_sentence.MORE);

        const simulator_cmd = `${export_s} SIM=${simulator_name}${more_s} `;
        return simulator_cmd;
    }
}