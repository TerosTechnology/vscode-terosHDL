import { assert } from 'console';
import * as vscode from 'vscode';
import { resourceLimits } from 'worker_threads';

const path_lib = require('path');
const os = require('os');
const shell = require('shelljs');
const fs = require('fs');
const colibri = require('jsteros');
const glob = require( 'glob' );
const tmp = require('tmp');
const child_process = require("child_process");


export interface TestItem {
  attributes: string | undefined;
  location: {
    file_name: string;
    length: number;
    offset: number;
    parent_makefile: string;
  } | undefined;
  name: string;
}

export class Cocotb {
  private output_channel;
  private exp: string = '';
  private more: string = '';
  private folder_sep: string = '';
  private childp;
  private context;

  constructor(context) {
    this.context = context;
    this.output_channel = vscode.window.createOutputChannel('TerosHDL');

    this.exp = "export ";
    this.more = ";";
    this.folder_sep = "/";

    if (os.platform() === "win32") {
      this.exp = "SET ";
      this.more = "&&";
      this.folder_sep = "\\";
    }
  }

  async get_python3_path(python3_path) {
    let python_path = '';
    if (python3_path === '') {
      python_path = await colibri.Nopy.get_python_exec();
    }
    else {
      python_path = python3_path;
    }

    if (python_path === undefined || python_path === '') {
      this.output_channel.append('[Error] Install and configure Python3 in the extension configuration.');
      this.output_channel.show();
      return undefined;
    }
    return python_path;
  }

  async run_simulation(tests_names: string[] = [], cocotb_test_list: TestItem[] = []) {
    let makefiles_to_run = new Map<string, string[]>();

    let push_makefile_if_not_exist = (test_item: TestItem) => {
      let makefile = test_item.location?.parent_makefile;
      if (!makefile) return;

      let makefile_to_run = makefiles_to_run.get(makefile);
      makefiles_to_run.set(
        makefile, 
        makefile_to_run ? [...makefile_to_run, test_item.name] : [test_item.name]
      );
    };

    if (tests_names.length == 0) {
      for (let test_item of cocotb_test_list) {
        push_makefile_if_not_exist(test_item);
      }
    }
    else {
      for (let test_item of cocotb_test_list) {
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

  async get_command(python3_path, runpy_dirname, runpy_filename, simulator,
    simulator_install_path, extra_options, gui, list = false, tests: string[] = []) {

    let python3_path_exec = await this.get_python3_path(python3_path);
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
    let go_to_dir = `cd ${runpy_dirname}${this.more}`;
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

  async run_makefile(dir, filename, tests) {
    let element = this;

    element.output_channel.append(`Run makefile '${filename}' from directory '${dir}'\r\n`);
    element.output_channel.show();

    return new Promise(resolve => {
      //@chcp 65001 >nul & cmd /d/s/c 
      shell.cd(dir);
      this.childp = shell.exec(`make -f ${filename}`, { async: true, encoding: "UTF-8" }, async function (code, stdout, stderr) {
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
        element.output_channel.show();
      });
      this.childp.stderr.on('data', function (data) {
        element.output_channel.append(data);
        element.output_channel.show();
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

  async get_test_list(python3_path, runpy_path) {
    let wksp_folder;
    if(vscode.workspace.workspaceFolders !== undefined) {
      wksp_folder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    } else {
      return([]);
    }

    let found_makefiles = glob.sync('/**/Makefile', {root: wksp_folder});
    let cocotb_makefiles: {makefile: string, modules: [string]}[] = [];

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
        cocotb_makefiles.push({makefile: item, modules: modules_arr});
      }
    }

    let test_array: TestItem[] = [];

    for (let makefile of cocotb_makefiles) {
      for (let module of makefile.modules) {
        const test_name = module;
        const module_path = path_lib.dirname(makefile.makefile);
        const filename = path_lib.join(module_path, test_name);

        let python_cocotb_data = fs.readFileSync(`${filename}.py`);

        let input = python_cocotb_data.toString();
        let regex = /(^[^#\r\n]* *@cocotb\.test\(\)(\r\n|\n|\r))([^#\r\n]* *(async )?def ([\w_]+)\([\w_]+\):$)/gm;
        
        let cocotb_test_matches: RegExpExecArray | null;
        let cocotb_tests: {name: string, offset: number, length: number}[] = [];
        while (cocotb_test_matches = regex.exec(input))
        {
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

    return(test_array);
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