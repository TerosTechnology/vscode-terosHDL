// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of TerosHDL.
//
// TerosHDL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// TerosHDL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import * as vscode from 'vscode';
const path_lib = require('path');
const os = require('os');
const shell = require('shelljs');
const fs = require('fs');
const tmp = require('tmp');
const child_process = require("child_process");
const tool_base = require('./tool_base');
import * as Output_channel_lib from '../../utils/output_channel';
const ERROR_CODE = Output_channel_lib.ERROR_CODE;

export interface TestItem {
    attributes: string | undefined;
    test_type: string | undefined,
    location: {
        file_name: string;
        length: number;
        offset: number;
        parent_makefile: string;
    } | undefined;
    name: string;
}

export class Cocotb extends tool_base.Tool_base {
    private cocotb_test_list;
    private childp;
    private edam_project_manager;

    constructor(context: vscode.ExtensionContext,
        output_channel: Output_channel_lib.Output_channel, edam_project_manager) {
        super(context, output_channel);
        this.edam_project_manager = edam_project_manager;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Get test list
    ////////////////////////////////////////////////////////////////////////////
    async get_test_list(){
        let single_test: TestItem = {
            attributes: undefined,
            test_type: undefined,
            name: 'Cocotb tests not found.',
            location: undefined
        };

        try {
            let makefile_path = this.get_toplevel_path_selected_prj();

            let test_list = await this.get_cocotb_test_list(makefile_path);

            if (test_list.length === 0) {
                test_list = [single_test];
            }

            return test_list;
        }
        catch (e) {
            return [single_test];
        }
    }

    async get_cocotb_test_list(makefile_path: string): Promise<TestItem[]> {
        try {
            shell.exec("make", (code, output) => {
                if (code === 127) {
                    this.output_channel.show_message(ERROR_CODE.COCOTB_INSTALLATION, '');
                }
            });
        } catch (error) {
            this.output_channel.show_message(ERROR_CODE.COCOTB_DEPS, '');
        }

        let found_makefiles = [makefile_path];
        let cocotb_makefiles: { makefile: string, modules: [string] }[] = [];

        const cocotb_makefile_must_contain = "include $(shell cocotb-config --makefiles)/Makefile.sim";

        for (let item of found_makefiles) {
            let data = fs.readFileSync(path_lib.resolve(item));
            if (data.includes(cocotb_makefile_must_contain)) {
                var new_data = data.toString().replace(cocotb_makefile_must_contain, '');
                const tmpobj = tmp.fileSync();

                fs.writeFileSync(tmpobj.name, `${new_data}\nprint-%  : ; @echo $* = $($*)\n`);

                let modules = child_process.execSync(`make -f ${tmpobj.name} print-MODULE`).toString();
                modules = modules.replace(/(\r\n|\n|\r)/, '');
                let modules_arr = modules.split(' ');
                modules_arr = modules_arr.filter(item => item !== "MODULE");
                modules_arr = modules_arr.filter(item => item !== "=");
                cocotb_makefiles.push({ makefile: item, modules: modules_arr });
            }
        }

        let test_array: TestItem[] = [];

        for (let makefile of cocotb_makefiles) {
            for (let module of makefile.modules) {
                const test_name = module;
                const module_path = path_lib.dirname(makefile.makefile);
                const filename = path_lib.join(module_path, test_name);

                let python_cocotb_data;
                try {
                    python_cocotb_data = fs.readFileSync(`${filename}.py`);
                } catch {
                    this.output_channel.show_message(ERROR_CODE.COCOTB_TEST_NOT_FOUND, '');
                    continue;
                }

                let input = python_cocotb_data.toString();
                let regex = /(^[^#\r\n]* *@cocotb\.test[ \t]*\([ \t\w=.()"'\[\],]*\)[ \t]*(\r\n|\n|\r))([^#\r\n]*[ \t]*(async)?def[ \t]+([\w_]+)[ \t]*\([ \t\w_]+\)[ \t]*:[ \t]*$)/gm;

                let cocotb_test_matches: RegExpExecArray | null;
                let cocotb_tests: { name: string, offset: number, length: number }[] = [];
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

                for (let cocotb_test of cocotb_tests) {
                    const test_item: TestItem = {
                        attributes: "",
                        test_type: "cocotb",
                        location: {
                            file_name: `${filename}.py`,
                            length: cocotb_test.length,
                            offset: cocotb_test.offset,
                            parent_makefile: path_lib.resolve(makefile.makefile)
                        },
                        name: `${test_name}.${cocotb_test.name}`
                    };

                    test_array.push(test_item);
                }
            }
        }

        this.cocotb_test_list = test_array;

        return (test_array);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Run simulation
    ////////////////////////////////////////////////////////////////////////////
    async run(tests_names: string[] = [], gui) {
        let makefiles_to_run = new Map<string, string[]>();

        let push_makefile_if_not_exist = (test_item: TestItem) => {
            let makefile = test_item.location?.parent_makefile;
            if (!makefile) { return; }

            let makefile_to_run = makefiles_to_run.get(makefile);
            makefiles_to_run.set(
                makefile,
                makefile_to_run ? [...makefile_to_run, test_item.name] : [test_item.name]
            );
        };

        if (tests_names.length === 0) {
            for (let test_item of this.cocotb_test_list) {
                push_makefile_if_not_exist(test_item);
            }
        }
        else {
            for (let test_item of this.cocotb_test_list) {
                if (tests_names.includes(test_item.name)) {
                    push_makefile_if_not_exist(test_item);
                }
            }
        }

        let results: any[] = [];
        for (let [makefile, tests] of makefiles_to_run) {
            let dir_of_makefile = path_lib.dirname(makefile);
            let name_of_makefile = path_lib.basename(makefile);
            let result: any | [] = await this.run_makefile(dir_of_makefile, name_of_makefile, tests);
            if (Array.isArray(result)) {
                if (result.length > 0) {
                    results = results.concat(result);
                }
            }
        }

        return results;
    }

    async run_makefile(dir, filename, tests) {
        try {
            shell.exec("cocotb-config -v", (code, output) => {
                if (code === 127) {
                    this.output_channel.show_message(ERROR_CODE.COCOTB_INSTALLATION, '');
                }
            });
        } catch (error) {
            this.output_channel.show_message(ERROR_CODE.COCOTB_DEPS, '');
        }

        let element = this;

        element.output_channel.append(`Run makefile '${filename}' from directory '${dir}'\r\n`);
        element.output_channel.show();

        return new Promise(resolve => {
            shell.cd(dir);

            let cmd_tests = '';
            if (tests.length > 0) {
                cmd_tests = 'TESTCASE=';
                for (let i = 0; i < tests.length - 1; i++) {
                    const element = tests[i].split('.');
                    let testname = element[element.length - 1];
                    cmd_tests += testname + ',';
                }
                let test_split = tests[tests.length - 1].split('.');
                let testname = test_split[test_split.length - 1];
                cmd_tests += testname;
            }

            this.childp = shell.exec(`make -f ${filename} ${cmd_tests}`,
                { async: true, encoding: "UTF-8" }, async function (code, stdout, stderr) {
                    if (code === 0) {
                        let results = await element.get_result(dir, tests);
                        resolve(results);
                    }
                    else {
                        let results = element.get_all_test_fail(tests);
                        resolve(results);
                    }
                });

            this.childp.stdout.on('data', function (data) {
                element.output_channel.append(data);
            });
            this.childp.stderr.on('data', function (data) {
                element.output_channel.append(data);
            });
        });
    }

    async get_result(folder, tests) {
        const result_file = path_lib.join(folder, 'results.xml');
        const xml2js = require('xml2js');
        const parser = new xml2js.Parser({ attrkey: "atrr" });
        let xml_string = fs.readFileSync(result_file, "utf8");

        return new Promise(resolve => {
            try {
                parser.parseString(xml_string, function (error, result) {
                    let testsuites = result.testsuites.testsuite;
                    let testcase = testsuites[0].testcase;
                    let results: {}[] = [];
                    for (let i = 0; i < testcase.length; i++) {
                        const test = testcase[i];
                        let test_name = `${test.atrr.classname}.${test.atrr.name}`;
                        let pass = true;
                        if (test.failure !== undefined) {
                            pass = false;
                        }
                        let test_info = {
                            name: test_name,
                            pass: pass
                        };
                        results.push(test_info);
                    }
                    resolve(results);
                });
            } catch (e) {
                let results = this.get_all_test_fail(tests);
                resolve(results);
            }
        });
    };

    get_all_test_fail(tests) {
        let results: {}[] = [];
        for (let i = 0; i < tests.length; i++) {
            const test_name = tests[i];
            let test_info = {
                name: test_name,
                pass: false
            };
            results.push(test_info);
        }
        return results;
    }
}