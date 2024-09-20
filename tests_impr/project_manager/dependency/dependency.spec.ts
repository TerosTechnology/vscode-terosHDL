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

import { Project_manager } from "../../../src/project_manager/project_manager";
import { t_file_reduced } from "../../../src/project_manager/common";
import { read_file_sync } from "../../../src/utils/file_utils";
import { equal } from "assert";

import * as paht_lib from 'path';
import * as fs from 'fs';

const C_EXPECTED_BASE_PATH = paht_lib.join(__dirname, 'expected');
const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, 'out');
fs.mkdirSync(C_OUTPUT_BASE_PATH, { recursive: true });

describe(`Check dependency graph`, function () {
    it.skip(`Check mixed Verilog, VHDL and VHDL with libraries`, async function () {
        const prj = new Project_manager("sample-prj");
        const file_list = get_test_files();
        file_list.forEach(file_inst => {
            prj.add_file(file_inst);
        });

        const result = await prj.get_dependency_graph("");

        equal(result.successful, true, result.msg);

        const output_path = paht_lib.join(C_OUTPUT_BASE_PATH, 'dependency_graph.svg');
        fs.writeFileSync(output_path, result.result);

        const input_path = paht_lib.join(C_EXPECTED_BASE_PATH, 'dependency_graph.svg');
        const expected = read_file_sync(input_path);

        equal(result.result, expected);
    });
});

describe(`Check compile order`, function () {
    it.skip(`Check mixed Verilog, VHDL and VHDL with libraries`, async function () {
        const prj = new Project_manager("sample-prj");
        const file_list = get_test_files();
        file_list.forEach(file_inst => {
            prj.add_file(file_inst);
        });

        const result = await prj.get_compile_order("");
        equal(result.successful, true, result.msg);

        const str_result = JSON.stringify(result.result);
        const output_path = paht_lib.join(C_OUTPUT_BASE_PATH, 'compile_order.txt');
        fs.writeFileSync(output_path, str_result);

        const input_path = paht_lib.join(C_EXPECTED_BASE_PATH, 'compile_order.txt');
        const expected = read_file_sync(input_path);

        equal(str_result, expected);
    });
});

describe(`Check dependency tree`, function () {
    it.skip(`Check mixed Verilog, VHDL and VHDL with libraries`, async function () {
        const prj = new Project_manager("sample-prj");
        const file_list = get_test_files();
        file_list.forEach(file_inst => {
            prj.add_file(file_inst);
        });

        const result = await prj.get_dependency_tree("");

        equal(result.successful, true, result.msg);

        const str_result = JSON.stringify(result.result);
        const output_path = paht_lib.join(C_OUTPUT_BASE_PATH, 'dependency_tree.txt');
        fs.writeFileSync(output_path, str_result);

        const input_path = paht_lib.join(C_EXPECTED_BASE_PATH, 'dependency_tree.txt');
        const expected = read_file_sync(input_path);

        equal(str_result, expected);
    });
});

function get_test_files() {
    const C_HELPER_PATH = paht_lib.join(__dirname, 'helpers');
    const file_list: t_file_reduced[] = [];

    let f_path = paht_lib.join(C_HELPER_PATH, 'cordic_arctg_mag_engine.vhd');
    let f_hdl: t_file_reduced = {
        name: f_path,
        is_include_file: false,
        include_path: "",
        logical_name: "",
        is_manual: true,
    };
    file_list.push(f_hdl);

    f_path = paht_lib.join(C_HELPER_PATH, 'cordic_engines_pkg.vhd');
    f_hdl = {
        name: f_path,
        is_include_file: false,
        include_path: "",
        logical_name: "",
        is_manual: true,
    };
    file_list.push(f_hdl);

    f_path = paht_lib.join(C_HELPER_PATH, 'cordic_sincos_engine.vhd');
    f_hdl = {
        name: f_path,
        is_include_file: false,
        include_path: "",
        logical_name: "random_lib",
        is_manual: true,
    };
    file_list.push(f_hdl);

    f_path = paht_lib.join(C_HELPER_PATH, 'cordic_top_pkg.vhd');
    f_hdl = {
        name: f_path,
        is_include_file: false,
        include_path: "",
        logical_name: "",
        is_manual: true,
    };
    file_list.push(f_hdl);

    f_path = paht_lib.join(C_HELPER_PATH, 'cordic_top.vhd');
    f_hdl = {
        name: f_path,
        is_include_file: false,
        include_path: "",
        logical_name: "",
        is_manual: true,
    };
    file_list.push(f_hdl);

    f_path = paht_lib.join(C_HELPER_PATH, 'serv_alu.v');
    f_hdl = {
        name: f_path,
        is_include_file: false,
        include_path: "",
        logical_name: "",
        is_manual: true,
    };
    file_list.push(f_hdl);

    f_path = paht_lib.join(C_HELPER_PATH, 'serv_rf_top.v');
    f_hdl = {
        name: f_path,
        is_include_file: false,
        include_path: "",
        logical_name: "",
        is_manual: true,
    };
    file_list.push(f_hdl);

    f_path = paht_lib.join(C_HELPER_PATH, 'serv_top.v');
    f_hdl = {
        name: f_path,
        is_include_file: false,
        include_path: "",
        logical_name: "",
        is_manual: true,
    };
    file_list.push(f_hdl);

    return file_list;
}

