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
const path_lib = require('path');
const shell = require('shelljs');
const fs = require('fs');
const tool_base = require('./tool_base');
import * as vcdrom from "../vcdrom";

import * as Output_channel_lib from '../../utils/output_channel';
const ERROR_CODE = Output_channel_lib.ERROR_CODE;

const TOOL_NAME_GUI = ['ghdl', 'vivado', 'trellis', 'apicula', 'icestorm', 'nextpnr', 'modelsim', 'xsim',
    'isum', 'spyglass', 'xcelium', 'trellis'];

export interface TestItem {
    test_type: string | undefined,
    location: {
        file_name: string;
        length: number;
        offset: number;
    } | undefined;
    name: string;
}

export class Edalize extends tool_base.Tool_base {
    private waveform_path;
    private complete_waveform_path = '';
    private childp;
    private edam_project_manager;

    constructor(context: vscode.ExtensionContext, output_channel: Output_channel_lib.Output_channel, 
                config_reader, config_file, edam_project_manager) {
        super(context, output_channel);
        this.edam_project_manager = edam_project_manager;
        const homedir = require('os').homedir();
        this.waveform_path = path_lib.join(homedir, '.teroshdl', 'build', 'waveform');
        // this.waveform_path = `${__dirname}${this.folder_sep}waveform`;
        this.config_file = config_file;
        this.config_reader = config_reader;
    }


    clear(){
        //Remove build path
        const fs = require('fs');
        const homedir = require('os').homedir();
        let build_folder = path_lib.join(homedir, '.teroshdl', 'build');
        fs.rmdirSync(build_folder, { recursive: true });
    }

    ////////////////////////////////////////////////////////////////////////////
    // Get test list
    ////////////////////////////////////////////////////////////////////////////
    async get_test_list() {
        let testname = await this.get_toplevel_selected_prj(false);
        if (testname === '') {
            return [];
        }
        let toplevel_path = this.get_toplevel_path_selected_prj();
        let single_test: TestItem = {
            test_type: 'edalize',
            name: testname,
            location: {
                file_name: toplevel_path,
                length: 0,
                offset: 0
            }
        };
        return [single_test];
    }

    ////////////////////////////////////////////////////////////////////////////
    // Run simulation
    ////////////////////////////////////////////////////////////////////////////
    async run(testnames, gui){
        let selected_project = this.get_selected_prj();
        let edam = selected_project.export_edam_file();

        let tool_configuration = this.config_file.get_config_of_selected_tool();
        edam.tool_options = tool_configuration;
        edam.toplevel = testnames;

        let result = await this.run_edalize(edam, testnames, gui);

        return result;
    }

    async run_edalize(edam, testname, gui) {

        let check = await this.check_requisites();
        if (check === false) {
            return [];
        }

        let normalized_edam = this.normalize_edam(edam);
        let simulator_name = this.get_simulator_from_edam(normalized_edam);
        let installation_path = this.get_installation_path_from_edam(normalized_edam);
        let project_name = edam.name;
        let top_level = edam.toplevel;
        let simulator_gui_support = this.check_gui_support(simulator_name, gui);
        this.show_tool_information(project_name, top_level, simulator_gui_support, simulator_name, installation_path);
        this.configure_waveform_path(normalized_edam, simulator_name);
        if (simulator_gui_support === true) {
            normalized_edam = this.configure_waveform_gui(simulator_name, normalized_edam);
        }
        const tmpdir = require('os').tmpdir();
        const edam_path = path_lib.join(tmpdir, 'edam.json');
        let edam_json = JSON.stringify(normalized_edam);
        fs.writeFileSync(edam_path, edam_json);
        let waveform_viewer = this.config_reader.get_waveform_viewer();

        let command = await this.get_command(edam_path, simulator_name, installation_path, normalized_edam, gui, waveform_viewer);
        if (command === undefined) {
            return [];
        }

        let result = await this.run_command(command);
        let reslet_j = {
            name: testname,
            pass: result,
            builds: this.set_builds(simulator_name, project_name, top_level)
        };

        if (simulator_gui_support === true && (simulator_name === 'ghdl' || (simulator_name === 'modelsim') && waveform_viewer !== 'tool')) {
            this.open_waveform_gtkwave(waveform_viewer);
        }

        return [reslet_j];
    }

    set_builds(simulator_name, project_name, top_level) {
        let builds: {}[] = [];
        switch (simulator_name) {
            case 'vivado':
                builds = this.vivado_builds(project_name, top_level);
                break;
            case 'quartus':
                builds = this.quartus_builds(project_name, top_level);
                break;
        }
        const homedir = require('os').homedir();
        let build_folder = path_lib.join(homedir, '.teroshdl', 'build');
        builds.unshift({ name: 'Open build directory', location: build_folder });
        return builds;
    }

    vivado_builds(project_name, top_level) {
        const homedir = require('os').homedir();
        let runs_folder = `${project_name}.runs`;
        let synt_file = `${top_level}_utilization_synth.rpt`;
        let imp_file = `${top_level}_utilization_placed.rpt`;
        let time_file = `${top_level}_timing_summary_routed.rpt`;
        let synt_path = path_lib.join(homedir, '.teroshdl', 'build', runs_folder, 'synth_1', synt_file);
        let imp_path = path_lib.join(homedir, '.teroshdl', 'build', runs_folder, 'impl_1', imp_file);
        let time_path = path_lib.join(homedir, '.teroshdl', 'build', runs_folder, 'impl_1', time_file);

        let builds = [
            {
                name: 'Synthesis utilization design information',
                location: synt_path
            },
            {
                name: 'Implementation utilization design information',
                location: imp_path
            },
            {
                name: 'Timming report',
                location: time_path
            }
        ];
        return builds;
    }

    quartus_builds(project_name, top_level) {
        const homedir = require('os').homedir();
        let synt_file = `${project_name}.map.summary`;
        let imp_file = `${project_name}.fit.summary`;
        let time_file = `${project_name}.sta.summary`;
        let synt_path = path_lib.join(homedir, '.teroshdl', 'build', synt_file);
        let imp_path = path_lib.join(homedir, '.teroshdl', 'build', imp_file);
        let time_path = path_lib.join(homedir, '.teroshdl', 'build', time_file);

        let builds = [
            {
                name: 'Synthesis design information',
                location: synt_path
            },
            {
                name: 'Place & route design information',
                location: imp_path
            },
            {
                name: 'Timming report',
                location: time_path
            }
        ];
        return builds;
    }

    open_waveform_gtkwave(waveform_viewer) {
        if (waveform_viewer === 'gtkwave') {
            let shell = require('shelljs');
            let command = `gtkwave ${this.complete_waveform_path}`;
            shell.exec(command, { async: true });
        }
        else if (waveform_viewer === "impulse") {
            let uri = vscode.Uri.file(this.complete_waveform_path);
            vscode.commands.executeCommand("vscode.openWith", uri, "de.toem.impulse.editor.records");
        }
        else {
            let vcdrom_inst = new vcdrom.default(this.context);
            vcdrom_inst.update_waveform(this.complete_waveform_path);
        }
    }

    normalize_edam(edam) {
        let edam_normalized = JSON.parse(JSON.stringify(edam));
        let clean_files: any[] = [];
        let sources = edam_normalized.files;
        for (let i = 0; i < sources.length; i++) {
            const element = sources[i];
            if (element.name !== "") {
                element.name = element.name.replace(/ /g, '\\ ');
                clean_files.push(element);
            }
        }
        edam_normalized.files = clean_files;
        return edam_normalized;
    }

    check_gui_support(simulator_name, gui) {
        if (gui === false) {
            return false;
        }

        let check = true;
        if (TOOL_NAME_GUI.includes(simulator_name) !== true) {
            this.output_channel.show_message(ERROR_CODE.EDALIZE_GUI_ERROR, '');
            check = false;
        }
        return check;
    }

    get_simulator_from_edam(edam) {
        let config_tool = edam.tool_options;
        for (let property in config_tool) {
            return property;
        }
    }

    get_installation_path_from_edam(edam) {
        let config_tool = edam.tool_options;
        for (let property in config_tool) {
            let installation_path = config_tool[property].installation_path;
            return installation_path;
        }
    }

    async get_command(edam_path, simulator, installation_path, edam, gui, waveform_viewer) {
        let gui_str = '';
        if (gui === true) {
            gui_str = 'gui';
        }

        let developer_mode = this.config_reader.get_developer_mode();
        if (developer_mode === true) {
            developer_mode = 'true';
        }
        else {
            developer_mode = 'false';
        }

        let python3_edalize_script = `${path_lib.sep}resources${path_lib.sep}project_manager${path_lib.sep}run_edalize.py`;
        python3_edalize_script = this.context.asAbsolutePath(python3_edalize_script);
        let python3_path_exec = await this.get_python3_path();
        if (python3_path_exec === undefined) {
            return undefined;
        }
        let command = `${python3_path_exec} "${python3_edalize_script}" "${edam_path}" "${simulator}" "${installation_path}" "${gui_str}" "${developer_mode}" "${waveform_viewer}"`;

        return command;
    }

    configure_waveform_path(edam, simulator_name) {
        let edam_gui = JSON.parse(JSON.stringify(edam));

        let waveform_type = edam_gui.tool_options[simulator_name].waveform;
        let complete_waveform_path = '';
        if (waveform_type === 'vcd' || simulator_name === 'modelsim') {
            complete_waveform_path = `${this.waveform_path}.vcd`;
        }
        else {
            complete_waveform_path = `${this.waveform_path}.ghw`;
        }
        this.complete_waveform_path = complete_waveform_path;
    }

    configure_waveform_gui(simulator_name, edam) {
        let edam_gui = JSON.parse(JSON.stringify(edam));
        if (simulator_name === 'ghdl') {
            let waveform_type = edam_gui.tool_options[simulator_name].waveform;
            if (waveform_type === 'vcd') {
                edam_gui.tool_options[simulator_name].run_options.push(`--vcd=${this.complete_waveform_path}`);
            }
            else {
                edam_gui.tool_options[simulator_name].run_options.push(`--wave=${this.complete_waveform_path}`);
            }
        }
        else if (simulator_name === 'xsim') {
            edam_gui.tool_options[simulator_name].xsim_options.push(`--gui`);
        }

        return edam_gui;
    }

    show_tool_information(project_name, top_level, simulator_gui, simulator_name, installation_path) {
        this.output_channel.print_tool_information(project_name, top_level, simulator_gui, simulator_name, installation_path);
    }

    async check_requisites() {
        let checker = await this.config_reader.check_configuration(false);
        if (checker.edalize === false || checker.make === false) {
            this.output_channel.print_check_configuration(checker, true);
            return false;
        }
        return true;
    }

    async run_command(command) {
        let element = this;

        element.output_channel.print_message(command.trim());
        element.output_channel.show();

        return new Promise(resolve => {
            element.childp = shell.exec(command, { async: true }, async function (code, stdout, stderr) {
                if (code === 0) {
                    element.output_channel.append('---> The test has finished successfully!\n');
                    resolve(true);
                }
                else {
                    element.output_channel.append('---> The test has finished with errors!\n');
                    resolve(false);
                }
                element.output_channel.append('****************************************************************************************************************************************\n');
            });

            element.childp.stdout.on('data', function (data) {
                element.output_channel.append(data);
            });
            element.childp.stderr.on('data', function (data) {
                element.output_channel.append(data);
            });
        });
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