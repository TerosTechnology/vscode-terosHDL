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
const os = require('os');
const shell = require('shelljs');
const fs = require('fs');

export interface TestItem {
  test_type: string | undefined,
  location: {
    file_name: string;
    length: number;
    offset: number;
  } | undefined;
  name: string;
}

export class Edalize {
  private output_channel;
  private exp: string = '';
  private more: string = '';
  private switch: string = '';
  private folder_sep: string = '';
  private childp;
  private context;
  private waveform_path;
  private complete_waveform_path = '';

  constructor(context) {
    this.context = context;
    this.output_channel = vscode.window.createOutputChannel('TerosHDL');

    this.exp = "export ";
    this.more = ";";
    this.switch = '';
    this.folder_sep = "/";

    if (os.platform() === "win32") {
      this.exp = "SET ";
      this.more = "&&";
      this.switch = '/D';
      this.folder_sep = "\\";
    }
    this.waveform_path = `${__dirname}${this.folder_sep}waveform`;
  }

  async get_python3_path(python3_path) {
    let python_path = vscode.workspace.getConfiguration('teroshdl.global').get("python3-path");
    const jsteros = require('jsteros');
    python_path = await jsteros.Nopy.get_python_exec();

    if (python_path === undefined || python_path === '') {
      this.output_channel.append('[Error] Install and configure Python3 in the extension configuration.');
      this.output_channel.show();
      return undefined;
    }
    return python_path;
  }

  async run_simulation(python3_path, edam, testname, gui) {
    let normalized_edam = this.normalize_edam(edam);
    this.output_channel.clear();
    let simulator_name = this.get_simulator_from_edam(normalized_edam);
    if (gui === true){
      normalized_edam = this.configure_waveform_gui(simulator_name, normalized_edam);
    }
    const edam_path = `${__dirname}${this.folder_sep}edam.json`;
    let edam_json = JSON.stringify(normalized_edam);
    fs.writeFileSync(edam_path, edam_json);

    let command = await this.get_command(python3_path, edam_path, simulator_name, normalized_edam);
    if (command === undefined) {
      return [];
    }

    let result = await this.run_command(command);
    let reslet_j = {
      name : testname,
      pass : result
    };

    if (gui === true && simulator_name === 'ghdl'){
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

  async get_command(python3_path, edam_path, simulator, edam) {
    let python3_edalize_script = `${path_lib.sep}resources${path_lib.sep}project_manager${path_lib.sep}run_edalize.py`;
    python3_edalize_script = this.context.asAbsolutePath(python3_edalize_script);
    let python3_path_exec = await this.get_python3_path(python3_path);
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
        edam_gui.tool_options[simulator_name].run_options.push([`--vcd=${complete_waveform_path}`]);
        this.complete_waveform_path = complete_waveform_path;
      }
      else{
        let complete_waveform_path = `${this.waveform_path}.ghw`;
        edam_gui.tool_options[simulator_name].run_options.push([`--wave=${complete_waveform_path}`]);
        this.complete_waveform_path = complete_waveform_path;
      }
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

  async get_result(folder, tests) {
    const result_file = `${folder}${this.folder_sep}teroshdl_out.xml`;
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser({ attrkey: "atrr" });

    // this example reads the file synchronously
    // you can read it asynchronously also
    let xml_string = fs.readFileSync(result_file, "utf8");

    return new Promise(resolve => {
      try {
        parser.parseString(xml_string, function (error, result) {
          let testsuites = result.testsuite;
          let testcase = testsuites.testcase;
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