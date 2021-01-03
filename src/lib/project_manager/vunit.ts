import * as vscode from 'vscode';
const path_lib = require('path');
const os = require('os');
const shell = require('shelljs');
const fs = require('fs');

export class Vunit {
  private output_channel;
  private exp: string = '';
  private more: string = '';
  private folder_sep: string = '';

  constructor() {
    this.output_channel = vscode.window.createOutputChannel('TerosHDL');

    this.exp = "export ";
    this.more = ";";
    this.folder_sep = "/";

    if (os.platform === "win32") {
      this.exp = "SET ";
      this.more = "&&";
      this.folder_sep = "\\";
    }
  }

  async run_simulation(runpy_path, tests: string[] = [], gui = false) {
    let simulator = 'ghdl';
    let simulator_install_path = '';
    let runpy_dirname = path_lib.dirname(runpy_path);
    let runpy_filename = path_lib.basename(runpy_path);
    let command = this.get_command(runpy_dirname, runpy_filename, simulator, simulator_install_path, gui, false, tests);
    let result = await this.run_command(command, runpy_dirname);
    return result;
  }

  get_command(runpy_dirname, runpy_filename, simulator, simulator_install_path, gui, list = false, tests: string[] = []) {
    let tests_cmd = ' ';
    for (let i = 0; i < tests.length; i++) {
      const element = tests[i];
      tests_cmd += `${element} `;
    }

    let list_cmd = '';
    if (list === true) {
      list_cmd = '--export-json teroshdl_export.json';
    }

    let gui_cmd = '';
    if (gui === true) {
      gui_cmd = '--gui';
    }
    let simulator_config = this.get_simulator_config(simulator, simulator_install_path);
    let go_to_dir = `cd ${runpy_dirname}${this.more}`;
    let vunit_default_options = `--no-color -x teroshdl_out.xml --exit-0 --verbose ${gui_cmd} ${list_cmd}`;
    let command = `${simulator_config}${go_to_dir}python3 ${runpy_filename} ${tests_cmd} ${vunit_default_options}`;

    return command;
  }

  get_simulator_config(simulator_name, simulator_install_path) {
    simulator_name = simulator_name.toLowerCase();

    let ghdl_path = `${this.exp} VUNIT_GHDL_PATH=${simulator_install_path}${this.more}${this.exp} VUNIT_SIMULATOR=${simulator_name}${this.more}`;
    let modelsim_path = `${this.exp} VUNIT_MODELSIM_PATH=${simulator_install_path}${this.more}${this.exp} VUNIT_SIMULATOR=${simulator_name}${this.more}`;
    let xsim_Path = `${this.exp} VUNIT_XSIM_PATH=${simulator_install_path}${this.more}${this.exp} VUNIT_SIMULATOR=${simulator_name}${this.more}`;

    if (simulator_name === 'ghdl') {
      return ghdl_path;
    }
    else if (simulator_name === 'modelsim') {
      return modelsim_path;
    }
    else if (simulator_name === 'xsim') {
      return xsim_Path;
    }
    else {
      '';
    }
  }

  async run_command(command, runpy_dirname) {
    let element = this;

    return new Promise(resolve => {
      let childp = shell.exec(command, { async: true }, async function (code, stdout, stderr) {
        if (code === 0) {
          let results = await element.get_result(runpy_dirname);
          resolve(results);
        }
      });

      childp.stdout.on('data', function (data) {
        element.output_channel.append(data);
        element.output_channel.show();
      });
      childp.stderr.on('data', function (data) {
        element.output_channel.append(data);
        element.output_channel.show();
      });
    });
  }

  async get_result(folder) {
    const result_file = `${folder}${this.folder_sep}teroshdl_out.xml`;
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser({ attrkey: "atrr" });

    // this example reads the file synchronously
    // you can read it asynchronously also
    let xml_string = fs.readFileSync(result_file, "utf8");

    return new Promise(resolve => {
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
    });
  }

  async get_test_list(runpy_path) {
    let runpy_dirname = path_lib.dirname(runpy_path);
    let runpy_filename = path_lib.basename(runpy_path);
    let json_path = `${runpy_dirname}${this.folder_sep}teroshdl_export.json`;
    let simulator = 'ghdl';
    let simulator_install_path = '';
    let gui = false;
    let list = true;

    let command = this.get_command(runpy_dirname, runpy_filename, simulator, simulator_install_path, gui, list);

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