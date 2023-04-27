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
import { Project_manager } from "../../../src/project_manager/project_manager";
import { assert } from 'chai';
import * as common from "../../../src/project_manager/common";
import * as cfg from "../../../src/config/config_declaration";

// Utils
const file_0: common.t_file_reduced = {
    name: '/my/file/0',
    is_include_file: false,
    include_path: '',
    logical_name: 'work',
    is_manual: true,
};
const file_1: common.t_file_reduced = {
    name: '/my/file/1',
    is_include_file: false,
    include_path: '',
    logical_name: 'work',
    is_manual: true,
};
const file_2: common.t_file_reduced = {
    name: '/my/file/2',
    is_include_file: false,
    include_path: '',
    logical_name: '',
    is_manual: true,
};
const file_3: common.t_file_reduced = {
    name: '/my/file/3',
    is_include_file: false,
    include_path: '',
    logical_name: 'work',
    is_manual: true,
};
const PRJ_NAME_0 = "my-prj-0";

// Create project manager
const prj = new Project_manager(PRJ_NAME_0);

describe(`Check project manager`, function () {

    it(`Get name after creation`, async function () {
        // Get project name
        const prj_name = prj.get_name();
        assert.equal(prj_name, PRJ_NAME_0, "Error in project name.");
    });

    it(`Rename project`, async function () {
        // Rename project
        const PRJ_NAME_1 = "my-prj-1";
        prj.rename(PRJ_NAME_1);
        // Check project name
        const prj_name = prj.get_name();
        assert.equal(prj_name, PRJ_NAME_1, "Error in project name.");
    });

    it(`Add 2 individual files`, async function () {
        // Add file 0
        prj.add_file(file_0);

        // Add file 1
        prj.add_file(file_1);

        // Check files
        const file_list = prj.get_project_definition().file_manager.get();
        assert.equal(file_list.length, 2, "Error number of files.");
        assert.equal(file_list[0].name, file_0.name, "Error name file 0.");
        assert.equal(file_list[1].name, file_1.name, "Error name file 1.");
    });

    it(`Delete file`, async function () {
        // Delete file 0
        prj.delete_file(file_0.name, file_0.logical_name);

        // Check files
        const file_list = prj.get_project_definition().file_manager.get();
        assert.equal(file_list.length, 1, "Error number of files.");
        assert.equal(file_list[0].name, file_1.name, "Error name file 0.");
    });

    it(`File in project`, async function () {
        // File 1 in project
        const check_0 = prj.check_if_file_in_project(file_1.name, file_1.logical_name);
        assert.equal(check_0, true, "Error file 1 in project.");

        // File random 0 not in project
        const check_1 = prj.check_if_file_in_project('asd', file_1.logical_name);
        assert.equal(check_1, false, "Error file random name in project.");

        // File random 1 not in project
        const check_2 = prj.check_if_file_in_project(file_1.name, 'efg');
        assert.equal(check_2, false, "Error file random logical name in project.");
    });

    it(`Set and get config`, async function () {
        const myconfig = cfg.get_default_config();
        myconfig.documentation.general.symbol_vhdl = 'asdf';

        // Set config
        prj.set_config(myconfig);
        // Get config
        const prj_config = prj.get_config();
        //Check config
        assert.equal(prj_config, myconfig, "Error in config.");
    });

    it(`Add files from CSV`, async function () {
        const CSV_PATH = paht_lib.join(__dirname, 'helpers', 'files.csv');
        // Add files
        prj.add_file_from_csv(CSV_PATH, true);
        // Get files
        const file_list = prj.get_project_definition().file_manager.get();
        // Check file 2
        assert.equal(file_list[1].name, file_2.name, "Error name file 2.");
        assert.equal(file_list[1].logical_name, file_2.logical_name, "Error logical name file 2.");
        // Check file 3
        assert.equal(file_list[2].name, file_3.name, "Error name file 3.");
        assert.equal(file_list[2].logical_name, file_3.logical_name, "Error logical name file 3.");
    });
});