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

import { Multi_project_manager } from "../../../src/project_manager/multi_project_manager";
import { assert } from 'chai';
import * as common from "../../../src/project_manager/common";

const MULTI_PRJ_NAME = "my-multi-prj";


const prj_0 = {
    'name': 'prj-0',
    'files': [
        'file0', 'file1'
    ]
};

const prj_1 = {
    'name': 'prj-1',
    'files': [
        'file2'
    ]
};

const prj_2 = {
    'name': 'prj-2',
    'files': [
        'file3', 'file4', 'file5'
    ]
};

// Create project manager
const multi_prj = new Multi_project_manager(MULTI_PRJ_NAME, "", undefined, undefined);

function add_files(multi_manager: Multi_project_manager, prj: any) {
    prj.files.forEach(function (file: any) {
        const file_inst: common.t_file_reduced = {
            name: file,
            is_include_file: false,
            include_path: "",
            logical_name: "",
            is_manual: true,
        };
        multi_manager.add_file(prj.name, file_inst);
    });
}

function check_project(multi_manager: Multi_project_manager, expected_project: any) {
    const prj = multi_manager.get_project_by_name(expected_project.name);
    if (prj === undefined) {
        assert.equal(true, false, "Prj doesn't exist.");
    }
    assert.equal(prj?.get_name(), expected_project.name, 'Fail in prj name.');
    const prj_files = prj?.get_project_definition().file_manager.get();
    assert.equal(prj_files?.length, expected_project.files.length, 'Fail in number of files');
}

describe(`Check multi project manager`, function () {

    it(`Get name after creation`, async function () {
        // Get project name
        const prj_name = multi_prj.get_name();
        assert.equal(prj_name, MULTI_PRJ_NAME, "Error in project name.");
    });

    it(`Add 3 projects`, async function () {
        // Create projects
        multi_prj.create_project(prj_0.name);
        multi_prj.create_project(prj_1.name);
        multi_prj.create_project(prj_2.name);
        // Add files
        add_files(multi_prj, prj_0);
        add_files(multi_prj, prj_1);
        add_files(multi_prj, prj_2);
        // Check
        check_project(multi_prj, prj_0);
        check_project(multi_prj, prj_1);
        check_project(multi_prj, prj_2);
    });

    it(`Rename project`, async function () {
        const new_name = 'new-name';

        // Rename project
        multi_prj.rename_project(prj_0.name, new_name);

        // Check
        prj_0.name = new_name;
        check_project(multi_prj, prj_0);
    });

    it(`Delete one`, async function () {
        // Delete project
        multi_prj.delete_project(prj_0.name);

        // Check number of projects
        assert.equal(multi_prj.get_projects().length, 2);

        // Check projects
        check_project(multi_prj, prj_1);
        check_project(multi_prj, prj_2);
    });

    it(`Select project`, async function () {
        // Select project
        let result = multi_prj.select_project_current(prj_1.name);
        assert.equal(result.successful, true);
        assert.equal(multi_prj.get_select_project().successful, true);
        // Select project doesn't exist
        result = multi_prj.select_project_current(prj_0.name);
        assert.equal(result.successful, false);
        assert.equal(multi_prj.get_select_project().successful, true);
    });


});