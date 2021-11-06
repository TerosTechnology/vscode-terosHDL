// Copyright 2020-2021 Teros Technology
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
import { resourceLimits } from 'worker_threads';
const path_lib = require('path');
const os = require('os');
const shell = require('shelljs');
const fs = require('fs');
const tool_base = require('./tool_base');
import * as Output_channel_lib from '../../utils/output_channel';
const ERROR_CODE = Output_channel_lib.ERROR_CODE;




export class Osvvm extends tool_base.Tool_base {
    private childp;
    private edam_project_manager;
    private config_file;
    private config_reader;
    private build_folder;

    constructor(context: vscode.ExtensionContext,
        output_channel: Output_channel_lib.Output_channel, edam_project_manager, config_file, config_reader) {
        super(context, output_channel);
        this.rerun_testlist = true;

        this.edam_project_manager = edam_project_manager;
        this.config_file = config_file;
        this.config_reader = config_reader;

        const homedir = require('os').homedir();
        this.build_folder = path_lib.join(homedir, '.teroshdl', 'osvvm_build');
    }

    clear(){
        //Remove build path
        const fs = require('fs');
        fs.rmdirSync(this.build_folder, { recursive: true });
    }

    ////////////////////////////////////////////////////////////////////////////
    // Get test list
    ////////////////////////////////////////////////////////////////////////////
    async get_test_list() {
        let tests: any[] = [];
        try {
            let test_list = await this.get_result();
            for (let i = 0; i < test_list.length; i++) {
                const test = test_list[i];
                let single_test = {
                    test_type: "osvvm",
                    name: test['name'],
                    location: undefined,
                };
                tests.push(single_test);
            }
        }
        catch (e) {
            tests = [];
        }

        return tests;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Run simulation
    ////////////////////////////////////////////////////////////////////////////
    async run(testnames, gui){
        let selected_tool_configuration = this.config_file.get_config_of_selected_tool();
        let all_tool_configuration = this.config_file.get_all_config_tool();

        let selected_project = this.edam_project_manager.selected_project;
        let prj = this.edam_project_manager.get_project(selected_project);

        let pro_file = prj.toplevel_path;

        let build_directory = this.build_folder;
        let extra_build = 'build /home/carlos/repo/OsvvmLibraries/OsvvmLibraries.pro';
        if (fs.existsSync(build_directory)) {
            extra_build = '';
        } else {
            //Create build directory
            fs.mkdirSync(build_directory, { recursive: true });
        }

        let osvvm_config = this.config_reader.get_config_fields('osvvm');
        let osvvm_simulator_name = osvvm_config['simulator'];
        let osvvm_installation_path = osvvm_config['installation_path'];
        let scripts_base_dir = path_lib.join(osvvm_installation_path, 'Scripts');

        let config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartUp.tcl');
        if (osvvm_simulator_name === 'ghdl') {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartUp.tcl');
        }
        else if (osvvm_simulator_name === 'modelsim') {
            config_simulator_tcl = path_lib.join(scripts_base_dir, 'StartUp.tcl');
        }

        let pro_top_file = `
source ${config_simulator_tcl}
${extra_build}
build ${pro_file}\n
exit
`;

        let pro_top_path = path_lib.join(this.build_folder, 'teroshdl_project_osvvm.pro');
        fs.writeFileSync(pro_top_path, pro_top_file);

        let command = `tclsh ${pro_top_path}`;
        if (osvvm_simulator_name === 'modelsim') {
            command = `vsim -c -do ${pro_top_path}`;  
        }
        let result = await this.run_command(command, '');
        return result;
    }

    async run_command(command, tests) {
        let element = this;

        element.output_channel.append(command);
        element.output_channel.show();

        shell.cd(this.build_folder);
        return new Promise(resolve => {
            this.childp = shell.exec(command, { async: true }, async function (code, stdout, stderr) {
                if (code === 0) {
                    let results = await element.get_result();
                    resolve(results);
                }
                else {
                    let results = element.get_all_test_fail(tests);
                    resolve(results);
                }
            });

            this.childp.stdout.on('data', function (data) {
                element.output_channel.append(data);
                element.output_channel.show();
            });
            this.childp.stderr.on('data', function (data) {
                element.output_channel.append(data);
                element.output_channel.show();
            });
        });
    }

    async get_result() {
        let result_path = path_lib.join(this.build_folder, 'sim_osvvm_project.yml');
        const yaml = require('js-yaml');
        let results: any[] = [];
        if (fs.existsSync(result_path) === false) {
            return results;
        }
        try {
            const result_yaml = yaml.load(fs.readFileSync(result_path, 'utf8'));
            const test_suites = result_yaml['TestSuites'];
            for (let i = 0; i < test_suites.length; i++) {
                const test_suite_inst = test_suites[i]['TestCases'];
                for (let j = 0; j < test_suite_inst.length; j++) {
                    const test = test_suite_inst[j];

                    let pass = false;
                    if (test['Status'].toLowerCase() === 'passed' ){
                        pass = true;
                    }
                    let test_name = test['Name'];

                    let test_info = {
                        name: test_name,
                        pass: pass
                    };

                    results.push(test_info);
                }
                
            }

        } catch (e) {}
        return results;
    }

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
