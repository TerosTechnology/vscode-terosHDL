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

import * as paht_lib from 'path';
// import * as fs from 'fs';
import { Project_manager } from "../../../src/project_manager/project_manager";
import { t_test_result } from "../../../src/project_manager/tool/common";
import * as common from "../../../src/project_manager/common";
import { equal } from "assert";

import * as cfg from "../../../src/config/config_declaration";

const C_BASE_DIR = paht_lib.join(__dirname, 'helpers');

describe(`Check Edalize`, function () {
    it.skip(`Check GHDL`, async function () {
        // Init
        const C_TOOL_BASE_DIR = paht_lib.join(C_BASE_DIR, 'ghdl');

        // Config
        const config = cfg.get_default_config();
        config.tools.general.select_tool = cfg.e_tools_general_select_tool.ghdl;

        // Files
        const file_0: common.t_file_reduced = {
            name: paht_lib.join(C_TOOL_BASE_DIR, 'half_adder_tb.vhd'),
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        const file_1: common.t_file_reduced = {
            name: paht_lib.join(C_TOOL_BASE_DIR, 'half_adder.vhd'),
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        const prj = new Project_manager("ghdl-prj");
        prj.add_file(file_0);
        prj.add_file(file_1);

        // Set top level path
        prj.add_toplevel_path(file_0.name);

        // Get tests
        const test_list = await prj.get_test_list();
        equal(test_list.length, 1);
        equal(test_list[0].filename, file_0.name);
        equal(test_list[0].name, 'half_adder_process_tb');

        // Run
        prj.set_config(config);
        prj.run(undefined, test_list, (result: t_test_result[]) => {
            equal(result[0].successful, true);
        }, printer_stream);

        function printer_stream(exec_i: any) {
            exec_i.stdout.on('data', function (_data: any) {
                // console.log(data);
            });
        }
    });
});

describe(`Check VUnit`, function () {

    it.skip(`Check one tests in runpy`, async function () {
        // Init
        const C_TOOL_BASE_DIR = paht_lib.join(C_BASE_DIR, 'vunit');

        // Config
        const config = cfg.get_default_config();
        config.tools.general.select_tool = cfg.e_tools_general_select_tool.vunit;
        config.tools.vunit.simulator_name = cfg.e_tools_vunit_simulator_name.ghdl;
        config.tools.vunit.runpy_mode = cfg.e_tools_vunit_runpy_mode.standalone;

        // Files
        const file_0: common.t_file_reduced = {
            name: paht_lib.join(C_TOOL_BASE_DIR, 'run_0.py'),
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        const prj = new Project_manager("vunit-prj");
        prj.add_file(file_0);

        // Set top level path
        prj.add_toplevel_path(file_0.name);

        // Tool options
        prj.set_config(config);

        // Get tests
        const test_list = await prj.get_test_list();
        equal(test_list.length, 1);
        equal(test_list[0].name, "lib.tb_counting_errors.Test that fails multiple times but doesn't stop");

        // Run
        prj.run(undefined, test_list, (result: t_test_result[]) => {
            equal(result[0].successful, false);
        }, printer_stream);

        function printer_stream(exec_i: any) {
            exec_i.stdout.on('data', function (_data: any) {
                // console.log(data);
            });
        }
    });

    it.skip(`Check multiple tests in runpy`, async function () {
        // Init
        const C_TOOL_BASE_DIR = paht_lib.join(C_BASE_DIR, 'vunit');

        // Config
        const config = cfg.get_default_config();
        config.tools.general.select_tool = cfg.e_tools_general_select_tool.vunit;
        config.tools.vunit.simulator_name = cfg.e_tools_vunit_simulator_name.ghdl;
        config.tools.vunit.runpy_mode = cfg.e_tools_vunit_runpy_mode.standalone;

        // Files
        const file_0: common.t_file_reduced = {
            name: paht_lib.join(C_TOOL_BASE_DIR, 'run_1.py'),
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        const prj = new Project_manager("vunit-prj");
        prj.add_file(file_0);

        // Set top level path
        prj.add_toplevel_path(file_0.name);

        // Tool options
        prj.set_config(config);

        // Get tests
        const test_list = await prj.get_test_list();
        equal(test_list.length, 2);
        equal(test_list[0].name, "lib.tb_with_test_cases.Test to_string for integer");
        equal(test_list[1].name, "lib.tb_with_test_cases.Test to_string for boolean");

        // Run
        prj.run(undefined, test_list, (result: t_test_result[]) => {
            equal(result[0].successful, true);
            equal(result[1].successful, true);
        }, printer_stream);

        function printer_stream(exec_i: any) {
            exec_i.stdout.on('data', function (_data: any) {
                // console.log(data);
            });
        }
    });

    it.skip(`Check runpy creation`, async function () {
        // Init
        const C_TOOL_BASE_DIR = paht_lib.join(C_BASE_DIR, 'vunit');

        // Config
        const config = cfg.get_default_config();
        config.tools.general.select_tool = cfg.e_tools_general_select_tool.vunit;
        config.tools.vunit.simulator_name = cfg.e_tools_vunit_simulator_name.ghdl;
        config.tools.vunit.runpy_mode = cfg.e_tools_vunit_runpy_mode.creation;

        // Files
        const file_0: common.t_file_reduced = {
            name: paht_lib.join(C_TOOL_BASE_DIR, 'tb_counting_errors.vhd'),
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        const file_1: common.t_file_reduced = {
            name: paht_lib.join(C_TOOL_BASE_DIR, 'tb_with_test_cases.vhd'),
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        const file_2: common.t_file_reduced = {
            name: paht_lib.join(C_TOOL_BASE_DIR, 'test_control.vhd'),
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        const prj = new Project_manager("vunit-prj");
        prj.add_file(file_0);
        prj.add_file(file_1);
        prj.add_file(file_2);

        // Tool options
        prj.set_config(config);

        // Get tests
        const test_list = await prj.get_test_list();
        equal(test_list.length, 3);
        equal(test_list[0].name, "lib.tb_counting_errors.Test that fails multiple times but doesn't stop");
        equal(test_list[1].name, "lib.tb_with_test_cases.Test to_string for integer");
        equal(test_list[2].name, "lib.tb_with_test_cases.Test to_string for boolean");

        // Run
        prj.run(undefined, test_list, (result: t_test_result[]) => {
            equal(result[0].successful, false);
            equal(result[1].successful, true);
            equal(result[2].successful, true);
        }, printer_stream);

        function printer_stream(exec_i: any) {
            exec_i.stdout.on('data', function (_data: any) {
                // console.log(data);
            });
        }

    });
});

describe(`Check cocotb`, function () {
    it.skip(`Check multiple tests`, async function () {
        // Init
        const C_TOOL_BASE_DIR = paht_lib.join(C_BASE_DIR, 'cocotb');

        // Config
        const config = cfg.get_default_config();
        config.tools.general.select_tool = cfg.e_tools_general_select_tool.cocotb;
        config.tools.cocotb.simulator_name = cfg.e_tools_cocotb_simulator_name.ghdl;

        // Files
        const file_0: common.t_file_reduced = {
            name: paht_lib.join(C_TOOL_BASE_DIR, 'Makefile'),
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        const prj = new Project_manager("cocotb-prj");
        prj.add_file(file_0);

        // Set top level path
        prj.add_toplevel_path(file_0.name);

        // Tool options
        prj.set_config(config);

        // Get tests
        const test_list = await prj.get_test_list();
        equal(test_list.length, 2);
        equal(test_list[0].name, "adder_basic_test");
        equal(test_list[1].name, "adder_randomised_test");

        // Run
        prj.run(undefined, test_list, (result: t_test_result[]) => {
            equal(result[0].successful, false);
            equal(result[1].successful, true);
        }, printer_stream);

        function printer_stream(exec_i: any) {
            exec_i.stdout.on('data', function (_data: any) {
                // console.log(data);
            });
        }

    });

    it.skip(`Check one test`, async function () {
        // Init
        const C_TOOL_BASE_DIR = paht_lib.join(C_BASE_DIR, 'cocotb');

        // Config
        const config = cfg.get_default_config();
        config.tools.general.select_tool = cfg.e_tools_general_select_tool.cocotb;
        config.tools.cocotb.simulator_name = cfg.e_tools_cocotb_simulator_name.ghdl;

        // Files
        const file_0: common.t_file_reduced = {
            name: paht_lib.join(C_TOOL_BASE_DIR, 'Makefile'),
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        const prj = new Project_manager("cocotb-prj");
        prj.add_file(file_0);

        // Set top level path
        prj.add_toplevel_path(file_0.name);

        // Tool options
        prj.set_config(config);

        // Get tests
        const test_list = await prj.get_test_list();
        equal(test_list.length, 2);
        equal(test_list[0].name, "adder_basic_test");
        equal(test_list[1].name, "adder_randomised_test");

        const selected_test = [test_list[0]];

        // Run
        prj.run(undefined, selected_test, (result: t_test_result[]) => {
            equal(result[0].successful, false);
        }, printer_stream);

        function printer_stream(exec_i: any) {
            exec_i.stdout.on('data', function (_data: any) {
                // console.log(data);
            });
        }

    });
});

describe(`Check OSVVM`, function () {
    it.skip(`Run test`, async function () {

        // Config
        const config = cfg.get_default_config();
        config.tools.general.select_tool = cfg.e_tools_general_select_tool.osvvm;
        config.tools.osvvm.installation_path = "/home/carlos/repo/osvvm/OsvvmLibraries/";
        config.tools.osvvm.simulator_name = cfg.e_tools_osvvm_simulator_name.ghdl;
        config.tools.osvvm.tclsh_binary = "tclsh8.6";

        // Files
        const file_0: common.t_file_reduced = {
            name: "/home/carlos/repo/osvvm/OsvvmLibraries/UART/RunDemoTests.pro",
            is_include_file: false,
            include_path: '',
            is_manual: true,
            logical_name: ''
        };

        // Create project
        const prj = new Project_manager("osvvm-prj");
        prj.add_file(file_0);

        // Set top level path
        prj.add_toplevel_path(file_0.name);

        // Tool options
        prj.set_config(config);

        // Get testlist
        const test_list = await prj.get_test_list();

        // Run
        prj.run(undefined, test_list, (result: t_test_result[]) => {
            equal(result[0].successful, false);
        }, printer_stream);

        function printer_stream(exec_i: any) {
            exec_i.stdout.on('data', function (_data: any) {
                // console.log(data);
            });
        }
    });
});