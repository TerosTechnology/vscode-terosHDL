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
const tool_base = require('./tool_base');

export class Vunit extends tool_base.Tool_base{
  private childp;

  constructor(context) {
    super(context);
  }

  async run_simulation(selected_tool_configuration, all_tool_configuration, runpy_path,
    tests: string[] = [], gui = false) {
    this.output_channel.clear();
    let options_vunit = selected_tool_configuration['vunit'];
    if (options_vunit === undefined) {
      let results = this.get_all_test_fail(tests);
      this.output_channel.append('[Error] Select VUnit as you tool.');
      this.output_channel.show();
      return results;
    }

    let simulator = options_vunit.simulator;
    let simulator_install_path = '';
    let extra_options = ` ${options_vunit.options} `;
    for (let i = 0; i < all_tool_configuration.length; i++) {
      const tool = all_tool_configuration[i];
      let tool_name = '';
      for (var attributename in tool) {
        tool_name = attributename;
      }

      if (tool_name === simulator) {
        simulator_install_path = tool[tool_name].installation_path;
        break;
      }
    }

    let runpy_dirname = path_lib.dirname(runpy_path);
    let runpy_filename = path_lib.basename(runpy_path);
    let command = await this.get_command(runpy_dirname,
      runpy_filename, simulator, simulator_install_path, extra_options, gui, false, tests);

    if (command === undefined) {
      return [];
    }

    let result = await this.run_command(command, runpy_dirname, tests);
    return result;
  }

  async get_command(runpy_dirname, runpy_filename, simulator,
    simulator_install_path, extra_options, gui, list = false, tests: string[] = [], show_error_message=true) {

    let python3_path_exec = await this.get_python3_path(show_error_message);
    if (python3_path_exec === undefined) {
      return undefined;
    }

    let tests_cmd = ' ';
    for (let i = 0; i < tests.length; i++) {
      if (i === 0) {
        tests_cmd += '"';
      }
      const element = tests[i];
      if (i === tests.length - 1) {
        tests_cmd += `${element}"`;
      }
    }

    let list_cmd = '';
    if (list === true) {
      list_cmd = '--export-json teroshdl_export.json';
    }

    let gui_cmd = '';
    if (gui === true) {
      extra_options = '';
      gui_cmd = '--gui';
    }

    let simulator_config = this.get_simulator_config(simulator, simulator_install_path);
    let go_to_dir = `cd ${this.switch} ${runpy_dirname}${this.more}`;
    let vunit_default_options = `--no-color -x teroshdl_out.xml --exit-0 ${gui_cmd} ${list_cmd}`;
    let command = `${simulator_config}${go_to_dir}${python3_path_exec} ${runpy_filename} ${tests_cmd} ${vunit_default_options}${extra_options}`;

    return command;
  }

  get_simulator_config(simulator_name, simulator_install_path) {
    let simulator_name_up = simulator_name.toUpperCase();
    let simulator_name_low = simulator_name.toLowerCase();

    let simulator_cmd = `${this.exp} VUNIT_${simulator_name_up}_PATH=${simulator_install_path}${this.more}${this.exp} VUNIT_SIMULATOR=${simulator_name_low}${this.more}`;

    return simulator_cmd;
  }

  async run_command(command, runpy_dirname, tests) {
    let element = this;

    element.output_channel.append(command);
    element.output_channel.show();

    return new Promise(resolve => {
      this.childp = shell.exec(command, { async: true }, async function (code, stdout, stderr) {
        if (code === 0) {
          let results = await element.get_result(runpy_dirname, tests);
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

  async get_test_list(runpy_path, show_error_message=true) {
    let runpy_dirname = path_lib.dirname(runpy_path);
    let runpy_filename = path_lib.basename(runpy_path);
    let json_path = `${runpy_dirname}${this.folder_sep}teroshdl_export.json`;
    let simulator = 'ghdl';
    let simulator_install_path = '';
    let extra_options = '';
    let gui = false;
    let list = true;

    let command = await this.get_command(runpy_dirname, runpy_filename, simulator, simulator_install_path, 
          extra_options, gui, list, [], show_error_message);
    if (command === undefined) {
      return [];
    }

    return new Promise(resolve => {

      shell.exec(command, { async: true }, function (code, stdout, stderr) {
        if (code === 0 && fs.existsSync(json_path)) {
          let obj = JSON.parse(fs.readFileSync(json_path, 'utf8'));
          resolve(obj.tests);
        }
        else {
          resolve([]);
        }
      });
    });
  }
}
