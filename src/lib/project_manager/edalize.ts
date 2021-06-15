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

  constructor(context) {
    super(context);
    this.waveform_path = `${__dirname}${this.folder_sep}waveform`;
  }

  async run_simulation(edam, testname, gui) {
    let normalized_edam = this.normalize_edam(edam);
    this.output_channel.clear();
    let simulator_name = this.get_simulator_from_edam(normalized_edam);
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
      pass : result
    };

    if (simulator_gui_support === true){
      this.open_waveform_gtkwave();
    }

    return [reslet_j];
  }

  open_waveform_gtkwave(){
    let shell = require('shelljs');
    let command = `gtkwave ${this.complete_waveform_path}`;
    shell.exec(command, {async:true});
  }

  normalize_edam(edam){
    const non_normalized_options = ['installation_path', 'waveform', 'timescale', 'part'];
    let edam_normalized = JSON.parse(JSON.stringify(edam));
    let config_tool = edam_normalized.tool_options;
    for (let tool in config_tool) {
      let pp = config_tool[tool];
      for (let option in pp) {
        let option_vaue = edam_normalized.tool_options[tool][option];
        edam_normalized.tool_options[tool][option] = this.normalize_option(tool,option, option_vaue);
      }
      return edam_normalized;
    } 
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

  normalize_option(tool, option, value){
    const norm_options = {
      ghdl : ['analyze_options', 'run_options'],
      icarus : ['iverilog_options'],
      icestorm : ['arachne_pnr_options', 'nextpnr_options', 'yosys_synth_options'],
      ise : [],
      isim : ['fuse_options', 'isim_options'],
      modelsim : ['vlog_options', 'vsim_options'],
      quartus : ['board_device_index', 'quartus_options', 'dse_options'],
      rivierapro : ['vlog_options', 'vsim_options'],
      spyglass : ['goals', 'rule_parameters', 'spyglass_parameters'],
      trellis : ['nextpnr_options', 'yosys_synth_options'],
      vcs : ['vcs_options', 'run_options'],
      verilator : ['libs', 'verilator_options'],
      vivado : [],
      vunit : ['vunit_options', 'add_libraries'],
      xcelium : ['xmvlog_options', 'xmvhdl_options', 'xmsim_options', 'xrun_options'],
      xsim : ['xelab_options', 'xsim_options']
    };

    let options_value = value;
    if (norm_options[tool].includes(option)){
      options_value = value.split(',');
    }
    return options_value;
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
    let installation_path = edam.tool_options[simulator_name].installation_path;
    let cmd = '';
    if (installation_path !== ''){
      if (simulator_name === 'modelsim'){
        cmd = `${this.exp} MODEL_TECH=${installation_path} ${this.more}`;
      }
    }
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

    element.output_channel.append(command);
    element.output_channel.show();

    return new Promise(resolve => {
      this.childp = shell.exec(command, { async: true }, async function (code, stdout, stderr) {
        if (code === 0) {
          resolve(true);
        }
        else {
          resolve(false);
        }
        element.output_channel.append('---> The test has finished!');
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

  async stop_test() {
    let path_bin = `${path_lib.sep}resources${path_lib.sep}bin${path_lib.sep}kill_vunit${path_lib.sep}kill.sh`;

    if (this.childp === undefined) {
      return;
    }
    try {
      var os = require('os');
      if (os.platform === "win32") {
        var cmd = "TASKKILL /F /T /PID  " + (this.childp.pid);
      }
      else {
        var path_kill = this.context.asAbsolutePath(path_bin);
        var cmd = "bash " + path_kill + " " + (this.childp.pid);
      }
      shell.exec(cmd, { async: true }, function (error, stdout, stderr) {
      });
    }
    catch (e) { }
  }

}