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

import { assert } from 'chai';
import { LANGUAGE } from '../../src/common/general';
import { t_file } from '../../src/project_manager/common';
import { Project_manager } from '../../src/project_manager/project_manager';
import { Multi_project_manager } from '../../src/project_manager/multi_project_manager';


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
const multi_prj = new Multi_project_manager("", "", undefined);

function add_files(multi_manager: Multi_project_manager, prj: any) {
    prj.files.forEach(function (file: any) {
        const file_inst: t_file = {
            name: file,
            is_include_file: false,
            include_path: "",
            logical_name: "",
            is_manual: true,
            file_type: LANGUAGE.NONE,
            file_version: undefined,
        };
        multi_manager.get_project_by_name(prj.name).add_file(file_inst);
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

    it(`Add 3 projects`, async function () {
        // Create projects
        multi_prj.initialize_project(prj_0.name);
        multi_prj.initialize_project(prj_1.name);
        multi_prj.initialize_project(prj_2.name);
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
        const prj0_obj = multi_prj.get_project_by_name(prj_0.name);
        multi_prj.rename_project(prj0_obj, new_name);

        // Check
        prj_0.name = new_name;
        check_project(multi_prj, prj_0);
    });

    it(`Delete one`, async function () {
        // Delete project
        const prj0_obj = multi_prj.get_project_by_name(prj_0.name);
        multi_prj.delete_project(prj0_obj);

        // Check number of projects
        assert.equal(multi_prj.get_projects().length, 2);

        // Check projects
        check_project(multi_prj, prj_1);
        check_project(multi_prj, prj_2);
    });

    it(`Select project`, async function () {
        // Select project
        const prj1_obj = multi_prj.get_project_by_name(prj_1.name);
        multi_prj.set_selected_project(prj1_obj);
        assert.equal(multi_prj.get_selected_project(), prj1_obj);

        // Select project doesn't exist
        assert.Throw(() =>
            multi_prj.set_selected_project(new Project_manager(prj_0.name, undefined))
            , "Project new-name is not in the project list.");
    });
});
