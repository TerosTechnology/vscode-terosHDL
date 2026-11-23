// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of TerosHDL
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
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import * as path_lib from 'path';
import { Dependency_graph} from '../../src/colibri/project_manager/dependency/dependency';
import { e_source_type, t_file } from '../../src/colibri/project_manager/common';
import { LANGUAGE, VHDL_LANG_VERSION } from '../../src/colibri/common/general';

const HELPER_FOLDER = path_lib.join(__dirname, 'helpers');

const dependency_graph = new Dependency_graph();

describe('dependencies', () => {
    it('compile order', async () => {
        const file_list : t_file[] = [
            {
                name: path_lib.join(HELPER_FOLDER, "half_adder_tb.vhd"),
                is_include_file: false,
                include_path: "",
                logical_name: "",
                is_manual: false,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2008,
                source_type: e_source_type.NONE,
            },
            {
                name: path_lib.join(HELPER_FOLDER, "half_adder.vhd"),
                is_include_file: false,
                include_path: "",
                logical_name: "mylib",
                is_manual: false,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2008,
                source_type: e_source_type.NONE,
            }
        ];
        const compile_order = await dependency_graph.get_compile_order_pyodide(file_list);

        expect(compile_order.file_order[0]).toStrictEqual(file_list[1]);
        expect(compile_order.file_order[1]).toStrictEqual(file_list[0]);

        expect(compile_order.successful).toBe(true);
    }, 100000);

    // Fix with: https://github.com/pyodide/pyodide/issues/4261

    // it('dependency tree', async () => {
    //     const file_list : t_file[] = [
    //         {
    //             name: path_lib.join(HELPER_FOLDER, "half_adder_tb.vhd"),
    //             file_type: "vhdlSource-2008",
    //             is_include_file: false,
    //             include_path: "",
    //             logical_name: "",
    //             is_manual: false,
    //         },
    //         {
    //             name: path_lib.join(HELPER_FOLDER, "half_adder.vhd"),
    //             file_type: "vhdlSource-2008",
    //             is_include_file: false,
    //             include_path: "",
    //             logical_name: "mylib",
    //             is_manual: false,
    //         }
    //     ];

        
    //     const compile_order = await dependency_graph.get_dependency_tree_pyodide(file_list);
    //     expect(compile_order.successful).toBe(true);

    // }, 100000);

    // it('dependency graph', async () => {
    //     const file_list : t_file[] = [
    //         {
    //             name: path_lib.join(HELPER_FOLDER, "half_adder_tb.vhd"),
    //             file_type: "vhdlSource-2008",
    //             is_include_file: false,
    //             include_path: "",
    //             logical_name: "",
    //             is_manual: false,
    //         },
    //         {
    //             name: path_lib.join(HELPER_FOLDER, "half_adder.vhd"),
    //             file_type: "vhdlSource-2008",
    //             is_include_file: false,
    //             include_path: "",
    //             logical_name: "mylib",
    //             is_manual: false,
    //         }
    //     ];

    //     const compile_order = await dependency_graph.get_dependency_graph_svg(file_list, "");

    //     expect(compile_order.successful).toBe(true);
    // }, 100000);

});

