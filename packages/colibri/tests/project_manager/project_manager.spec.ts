// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
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

import { t_file_reduced } from '../../src/project_manager/common';
import {Project_manager} from '../../src/project_manager/project_manager';

const DEFAULT_NAME = "def_name";

describe('project_manager', () => {
    let project_manager: Project_manager;

    beforeEach(() => {
        project_manager = new Project_manager(DEFAULT_NAME, undefined);
    });

    test('rename', () => {
        const new_name = "sancho_panza";

        expect(project_manager.get_name()).toBe(DEFAULT_NAME);
        project_manager.rename(new_name);
        expect(project_manager.get_name()).toBe(new_name);
    });

    test('add_toplevel_path', () => {
        project_manager.add_toplevel_path("path1");
        expect(project_manager.get_toplevel_path()).toStrictEqual(["path1"]);

        project_manager.add_toplevel_path("path2");
        expect(project_manager.get_toplevel_path()).toStrictEqual(["path2"]);
    });

    test('delete_toplevel_path', () => {
        project_manager.add_toplevel_path("path1");
        project_manager.delete_toplevel_path("path1");
        expect(project_manager.get_toplevel_path()).toStrictEqual([]);
    });

    // test('add_file_watcher', () => {

    // });

    // test('delete_file_watcher', () => {

    // });

    test('add_file', () => {
        const file_0 : t_file_reduced = {
            name: 'file_0',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_0',
            is_manual: false
        };

        const file_1 : t_file_reduced = {
            name: 'file_1',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false
        };

        project_manager.add_file(file_0);
        expect(project_manager.get_file()).toStrictEqual([file_0]);

        project_manager.add_file(file_1);
        expect(project_manager.get_file()).toStrictEqual([file_0, file_1]);
    });

    test('remove_file', () => {
        const file_0 : t_file_reduced = {
            name: 'file_0',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_0',
            is_manual: false
        };

        const file_1 : t_file_reduced = {
            name: 'file_1',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false
        };

        project_manager.add_file(file_0);
        project_manager.add_file(file_1);

        const result_0 = project_manager.delete_file("file_0", "logical_0");
        expect(project_manager.get_file()).toStrictEqual([file_1, file_1]);
        expect(result_0.successful).toBe(true);
    
        const result_1 = project_manager.delete_file("file_1", "logical_5");
        expect(result_1.successful).toBe(true);

        const result_2 = project_manager.delete_file("file_1", "logical_1");
        expect(project_manager.get_file()).toStrictEqual([]);
        expect(result_2.successful).toBe(true);
    });


    // test('delete_file_by_logical_name', () => {

    // });

    // test('add_logical', () => {

    // });

    // test('delete_phantom_toplevel', () => {

    // });


});