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

import { LANGUAGE } from '../../src/common/general';
import { t_file } from '../../src/project_manager/common';
import {File_manager} from '../../src/project_manager/list_manager/file';

describe('list_manager: file', () => {
    let file_manager: File_manager;

    beforeEach(() => {
        file_manager = new File_manager();
    });

    test('adding a file', () => {
        const file_0 : t_file = {
            name: 'example0.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };

        const file_1 : t_file= {
            name: 'example1.py',
            is_include_file: true,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };

        const result_0 = file_manager.add(file_0);
        expect(result_0.successful).toBe(true);
        
        const result_1 = file_manager.add(file_1);
        expect(result_1.successful).toBe(true);
        
        expect(file_manager.get()[0]).toEqual(expect.objectContaining(file_0));
        expect(file_manager.get()[1]).toEqual(expect.objectContaining(file_1));
    });

    test('deleting a file', () => {
        const file = {
            name: 'example.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };

        file_manager.add(file);
        const result = file_manager.delete(file.name, file.logical_name);
        expect(result.successful).toBe(true);
        expect(file_manager.get()).toHaveLength(0);
    });

    test('get with reference path', () => {
        const ref_path = "/path/to/pepe.txt";
        const file = {
            name: '/path/example.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };
        const expected_file : t_file = {
            name: '../example.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };

        file_manager.add(file);
        const result = file_manager.get(ref_path);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(expect.objectContaining(expected_file));
    });

    test('clear_automatic_files', () => {
        const file_0 = {
            name: '/path/example0.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };
        const file_1 = {
            name: '/path/example1.py',
            is_include_file: false,
            include_path: 'asf',
            logical_name: 'example_logical',
            is_manual: true,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };

        file_manager.add(file_0);
        file_manager.add(file_1);

        let result = file_manager.get();
        expect(result).toHaveLength(2);

        file_manager.clear_automatic_files();

        result = file_manager.get();
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(expect.objectContaining(file_1));
    });

    test('adding a duplicated file', () => {
        const file = {
            name: 'example.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };

        file_manager.add(file);
        const duplicatedResult = file_manager.add(file);
        expect(duplicatedResult.successful).toBe(false);
    });

    test('clear', () => {
        const file = {
            name: 'example.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };

        file_manager.add(file);
        file_manager.clear();
        expect(file_manager.get()).toHaveLength(0);
    });

    test('deleting a non-existing file', () => {
        const result = file_manager.delete('nonexistent.py', 'nonexistent_logical');
        expect(result.successful).toBe(false);
    });

    test('deleting files by logical name', () => {
        const file1 = {
            name: 'file1.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical1',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };
        const file2 = {
            name: 'file2.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical2',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };
        const file3 = {
            name: 'file3.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical2',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };
        
        file_manager.add(file1);
        file_manager.add(file2);
        file_manager.add(file3);

        file_manager.delete_by_logical_name("logical2");
        expect(file_manager.get()).toHaveLength(1);
    });

    test('adding logical', () => {        
        file_manager.add_logical("logical1");
        expect(file_manager.get()).toHaveLength(1);
        expect(file_manager.get()[0].logical_name).toEqual("logical1");
        expect(file_manager.get()[0].name).toEqual("");
    });

    test('getting files by logical name', () => {
        const file1 = {
            name: 'file1.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical1',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };
        const file2 = {
            name: 'file2.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical2',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };
        const file3 = {
            name: 'file3.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical2',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
        };
        
        file_manager.add(file1);
        file_manager.add(file2);
        file_manager.add(file3);

        const logicalFiles = file_manager.get_by_logical_name();
        expect(logicalFiles).toHaveLength(2);
        expect(logicalFiles[0].name).toEqual("logical1");
        expect(logicalFiles[0].file_list.length).toEqual(1);

        expect(logicalFiles[1].name).toEqual("logical2");
        expect(logicalFiles[1].file_list.length).toEqual(2);
    });



});