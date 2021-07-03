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

export interface TestItem {
  test_type: string | undefined,
  location: {
    file_name: string;
    length: number;
    offset: number;
  } | undefined;
  name: string;
}

export class Edalize extends tool_base.Tool_base{
  private waveform_path;
  private complete_waveform_path = '';
  private childp;

  constructor(context) {
    super(context);
    this.waveform_path = `${__dirname}${this.folder_sep}waveform`;
  }

  async run_simulation(edam, testname, gui) {
    let normalized_edam = this.normalize_edam(edam);
    this.output_channel.clear();
    let simulator_name = this.get_simulator_from_edam(normalized_edam);
    let project_name = edam.name;
    let top_level = edam.toplevel;
    let simulator_gui_support = this.check_gui_support(simulator_name, gui);
    if (simulator_gui_support === true){
      normalized_edam = this.configure_waveform_gui(simulator_name, normalized_edam);
    }
    const edam_path = `${__dirname}${this.folder_sep}edam.json`;
    let edam_json = JSON.stringify(normalized_edam);
    fs.writeFileSync(edam_path, edam_json);

    let command = await this.get_command(edam_path, simulator_name, normalized_edam);
    if (command === undefined) {
      return [];
    }

    let result = await this.run_command(command);
    let reslet_j = {
      name : testname,
      pass : result,
      builds: this.set_builds(simulator_name, project_name, top_level)
    };

    if (simulator_gui_support === true){
      this.open_waveform_gtkwave();
    }

    return [reslet_j];
  }

  set_builds(simulator_name, project_name, top_level){
    let builds : {}[]= [];
    switch (simulator_name) {
      case 'vivado':
        builds = this.vivado_builds( project_name, top_level);
        break;
      case 'quartus':
        builds = this.quartus_builds( project_name, top_level);
        break;
    }
    const homedir = require('os').homedir();
    let build_folder = path_lib.join(homedir, '.teroshdl', 'build');
    builds.unshift({name: 'Open build directory',location: build_folder});
    return builds;
  }
  
  vivado_builds( project_name, top_level){
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

  quartus_builds( project_name, top_level){
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

  open_waveform_gtkwave(){
    let shell = require('shelljs');
    let command = `gtkwave ${this.complete_waveform_path}`;
    shell.exec(command, {async:true});
  }

  normalize_edam(edam){
    let edam_normalized = JSON.parse(JSON.stringify(edam));
    let clean_files : any[]= [];
    let sources = edam_normalized.files;
    for (let i = 0; i < sources.length; i++) {
      const element = sources[i];
      if (element.name !== ""){
        element.name = element.name.replace(/ /g, '\\ ');
        clean_files.push(element);
      }
    }
    edam_normalized.files = clean_files;
    return edam_normalized;
  }

  check_gui_support(simulator_name, gui){
    if (gui === false){
      return false;
    }
    const simulator_name_gui = ['ghdl'];
    let check = true;
    if (simulator_name_gui.includes(simulator_name) !== true){
      vscode.window.showInformationMessage(`GUI option not supported for ${simulator_name}. Check [TerosHDL documentation](https://terostechnology.github.io/terosHDLdoc/features/project_manager.html)`);
      check = false;
    }
    return check;
  }

  get_simulator_from_edam(edam){
    let config_tool = edam.tool_options;
    for (let property in config_tool) {
      return property;
    }
  }

  async get_command(edam_path, simulator, edam) {
    let python3_edalize_script = `${path_lib.sep}resources${path_lib.sep}project_manager${path_lib.sep}run_edalize.py`;
    python3_edalize_script = this.context.asAbsolutePath(python3_edalize_script);
    let python3_path_exec = await this.get_python3_path();
    if (python3_path_exec === undefined) {
      return undefined;
    }
    let simulator_config = this.get_simulator_config(simulator, edam);
    let command = `${simulator_config} ${python3_path_exec} ${python3_edalize_script} ${edam_path} ${simulator}\n`;

    return command;
  }

  get_simulator_config(simulator_name, edam){
    let cmd = '';
    // let installation_path = edam.tool_options[simulator_name].installation_path;
    // let cmd = '';
    // if (installation_path !== ''){
    //   if (simulator_name === 'modelsim'){
    //     cmd = `${this.exp} MODEL_TECH=${installation_path} ${this.more}`;
    //   }
    // }
    return cmd;
  }

  configure_waveform_gui(simulator_name, edam){
    let edam_gui = JSON.parse(JSON.stringify(edam));
    if (simulator_name === 'ghdl'){
      let waveform_type = edam_gui.tool_options[simulator_name].waveform; 
      if (waveform_type === 'vcd'){
        let complete_waveform_path = `${this.waveform_path}.vcd`;
        edam_gui.tool_options[simulator_name].run_options.push(`--vcd=${complete_waveform_path}`);
        this.complete_waveform_path = complete_waveform_path;
      }
      else{
        let complete_waveform_path = `${this.waveform_path}.ghw`;
        edam_gui.tool_options[simulator_name].run_options.push(`--wave=${complete_waveform_path}`);
        this.complete_waveform_path = complete_waveform_path;
      }
    }
    else if (simulator_name === 'xsim'){
      edam_gui.tool_options[simulator_name].xsim_options.push(`--gui`);
    }

    return edam_gui;
  }

  async run_command(command) {
    let element = this;

    element.output_channel.clear();
    element.output_channel.append(command);
    element.output_channel.show();

    return new Promise(resolve => {
      element.childp = shell.exec(command, { async: true }, async function (code, stdout, stderr) {
        if (code === 0) {
          resolve(true);
        }
        else {
          resolve(false);
        }
        element.output_channel.append('---> The test has finished!\n');
        element.output_channel.append('************************************************************************************************\n');
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