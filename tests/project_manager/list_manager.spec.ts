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

import { LANGUAGE } from '../../src/colibri/common/general';
import { e_source_type, t_file } from '../../src/colibri/project_manager/common';
import {File_manager} from '../../src/colibri/project_manager/list_manager/file';

import { Dependency_graph } from '../../src/colibri/project_manager/dependency/dependency';
import * as csv_loader from '../../src/colibri/project_manager/prj_loaders/csv_loader';

describe('list_manager: file', () => {
    let file_manager: File_manager;

    beforeEach(() => {
        file_manager = new File_manager();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const createFile = (name: string, logical_name = 'library'): t_file => ({
        name,
        is_include_file: false,
        include_path: '',
        logical_name,
        is_manual: false,
        file_type: LANGUAGE.PYTHON,
        file_version: undefined,
        source_type: e_source_type.NONE,
    });

    const calculateCompileOrder = async (fileOrder: t_file[]) => {
        jest.spyOn(Dependency_graph.prototype, 'get_compile_order').mockResolvedValue({
            file_order: fileOrder,
            successful: true,
            msg: '',
        });

        await file_manager.order('', '');
    };

    test('adding a file', () => {
        const file_0 : t_file = {
            name: 'example0.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
            source_type: e_source_type.NONE,
        };

        const file_1 : t_file= {
            name: 'example1.py',
            is_include_file: true,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
            source_type: e_source_type.NONE,
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
            source_type: e_source_type.NONE,
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
            source_type: e_source_type.NONE,
        };
        const expected_file : t_file = {
            name: '../example.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'example_logical',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
            source_type: e_source_type.NONE,
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
            source_type: e_source_type.NONE,
        };
        const file_1 = {
            name: '/path/example1.py',
            is_include_file: false,
            include_path: 'asf',
            logical_name: 'example_logical',
            is_manual: true,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
            source_type: e_source_type.NONE,
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
            source_type: e_source_type.NONE,
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
            source_type: e_source_type.NONE,
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
            source_type: e_source_type.NONE,
        };
        const file2 = {
            name: 'file2.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical2',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
            source_type: e_source_type.NONE,
        };
        const file3 = {
            name: 'file3.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical2',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
            source_type: e_source_type.NONE,
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
            source_type: e_source_type.NONE,
        };
        const file2 = {
            name: 'file2.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical2',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
            source_type: e_source_type.NONE,
        };
        const file3 = {
            name: 'file3.py',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical2',
            is_manual: false,
            file_type: LANGUAGE.PYTHON,
            file_version: undefined,
            source_type: e_source_type.NONE,
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

    test('compile order does not change visual order', async () => {
        const file1 = createFile('file1.py');
        const file2 = createFile('file2.py');
        const file3 = createFile('file3.py');

        file_manager.add(file1);
        file_manager.add(file2);
        file_manager.add(file3);

        await calculateCompileOrder([file3, file2, file1]);

        expect(file_manager.get().map(file => file.name)).toEqual([
            'file1.py',
            'file2.py',
            'file3.py',
        ]);

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file3.py',
            'file2.py',
            'file1.py',
        ]);
    });

    test('adding a file invalidates compile order', async () => {
        const file1 = createFile('file1.py');
        const file2 = createFile('file2.py');

        file_manager.add(file1);
        await calculateCompileOrder([file1]);

        file_manager.add(file2);

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file1.py',
            'file2.py',
        ]);
    });

    test('moving a file invalidates compile order', async () => {
        const file1 = createFile('file1.py', 'library1');
        const file2 = createFile('file2.py', 'library1');

        file_manager.add(file1);
        file_manager.add(file2);

        await calculateCompileOrder([file2, file1]);

        file_manager.move_file('file1.py', 'library1', 'library2');

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file1.py',
            'file2.py',
        ]);
    });

    test('reordering files invalidates compile order', async () => {
        const file1 = createFile('file1.py');
        const file2 = createFile('file2.py');

        file_manager.add(file1);
        file_manager.add(file2);

        await calculateCompileOrder([file2, file1]);

        file_manager.reorder_file('file1.py', 'library', 1);

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file2.py',
            'file1.py',
        ]);
    });

    test('deleting a file invalidates compile order', async () => {
        const file1 = createFile('file1.py');
        const file2 = createFile('file2.py');

        file_manager.add(file1);
        file_manager.add(file2);

        await calculateCompileOrder([file2, file1]);

        file_manager.delete('file1.py', 'library');

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file2.py',
        ]);
    });

    test('moving multiple files invalidates compile order', async () => {
        const file1 = createFile('file1.py', 'library1');
        const file2 = createFile('file2.py', 'library1');

        file_manager.add(file1);
        file_manager.add(file2);

        await calculateCompileOrder([file2, file1]);

        file_manager.move_files([
            { name: 'file1.py', logical_name: 'library1' }
        ], 'library2');

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file1.py',
            'file2.py',
        ]);
    });

    test('reordering multiple files invalidates compile order', async () => {
        const file1 = createFile('file1.py');
        const file2 = createFile('file2.py');
        const file3 = createFile('file3.py');

        file_manager.add(file1);
        file_manager.add(file2);
        file_manager.add(file3);

        await calculateCompileOrder([file3, file2, file1]);

        file_manager.reorder_files(['file1.py', 'file2.py'], 'library', 1);

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file3.py',
            'file1.py',
            'file2.py',
        ]);
    });

    test('clear invalidates compile order', async () => {
        const file1 = createFile('file1.py');
        const file2 = createFile('file2.py');

        file_manager.add(file1);
        file_manager.add(file2);

        await calculateCompileOrder([file2, file1]);

        file_manager.clear();

        expect(file_manager.get_compile_order()).toHaveLength(0);
    });

    test('clear_automatic_files invalidates compile order', async () => {
        const file1 = createFile('file1.py');
        const file2 = {
            ...createFile('file2.py'),
            is_manual: true,
        };

        file_manager.add(file1);
        file_manager.add(file2);

        await calculateCompileOrder([file2, file1]);

        file_manager.clear_automatic_files();

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file2.py',
        ]);
    });

    test('configureSource invalidates compile order', async () => {
        const file1 = createFile('file1.py');
        const file2 = createFile('file2.py');

        file_manager.add(file1);
        file_manager.add(file2);

        await calculateCompileOrder([file2, file1]);

        file_manager.configureSource(
            'file1.py',
            'library',
            LANGUAGE.PYTHON,
            undefined,
            e_source_type.NONE
        );

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file1.py',
            'file2.py',
        ]);
    });

    test('manual compilation order is applied before dependency calculation', async () => {
        const file1 = createFile('file1.py');
        const file2 = createFile('file2.py');

        file_manager.add(file1);
        file_manager.add(file2);

        jest.spyOn(csv_loader, 'get_files_from_csv').mockReturnValue({
            successful: true,
            file_list: [file2, file1],
        } as ReturnType<typeof csv_loader.get_files_from_csv>);

        const dependencySpy = jest.spyOn(
            Dependency_graph.prototype,
            'get_compile_order'
        ).mockResolvedValue({
            file_order: [file1, file2],
            successful: true,
            msg: '',
        });

        await file_manager.order('', 'compile_order.csv');

        expect(dependencySpy).toHaveBeenCalledWith([file2, file1], '');
        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'file1.py',
            'file2.py',
        ]);
    });

    test('files missing from manual order are appended', async () => {
        const file1 = createFile('file1.py');
        const file2 = createFile('file2.py');
        const file3 = createFile('file3.py');

        file_manager.add(file1);
        file_manager.add(file2);
        file_manager.add(file3);

        jest.spyOn(csv_loader, 'get_files_from_csv').mockReturnValue({
            successful: true,
            file_list: [file3, file1],
        } as ReturnType<typeof csv_loader.get_files_from_csv>);

        const dependencySpy = jest.spyOn(
            Dependency_graph.prototype,
            'get_compile_order'
        ).mockResolvedValue({
            file_order: [file3, file1, file2],
            successful: true,
            msg: '',
        });

        await file_manager.order('', 'compile_order.csv');

        expect(dependencySpy).toHaveBeenCalledWith(
            [file3, file1, file2],
            ''
        );
    });

    test('dependency calculation failure uses library fallback order', async () => {
        const libraryFile = createFile('library_file.py', 'library');
        const nonLibraryFile = createFile('non_library_file.py', '');

        file_manager.add(nonLibraryFile);
        file_manager.add(libraryFile);

        jest.spyOn(
            Dependency_graph.prototype,
            'get_compile_order'
        ).mockResolvedValue({
            file_order: [],
            successful: false,
            msg: 'Dependency calculation failed',
        });

        await file_manager.order('', '');

        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([
            'library_file.py',
            'non_library_file.py',
        ]);
    });

    test('reorder_files preserves files from other libraries', () => {
        const file1 = createFile('file1.py', 'library1');
        const file2 = createFile('file2.py', 'library1');
        const file3 = createFile('file3.py', 'library2');

        file_manager.add(file1);
        file_manager.add(file2);
        file_manager.add(file3);
        file_manager.add_logical('library3');

        const result = file_manager.reorder_files(
            ['file1.py'],
            'library1',
            1
        );

        expect(result.successful).toBe(true);
        expect(file_manager.get().map(file => file.name)).toEqual([
            'file2.py',
            'file1.py',
            'file3.py',
            '',
        ]);
    });

    test('configureSource fails for a non-existing file', () => {
        const result = file_manager.configureSource(
            'missing.py',
            'library',
            LANGUAGE.PYTHON,
            undefined,
            e_source_type.NONE
        );

        expect(result.successful).toBe(false);
        expect(result.msg).toBe("Toplevel path doesn't exist");
    });

    test('reorder_files fails when a file belongs to another library', () => {
        const file1 = createFile('file1.py', 'library1');
        const file2 = createFile('file2.py', 'library2');

        file_manager.add(file1);
        file_manager.add(file2);

        const result = file_manager.reorder_files(
            ['file2.py'],
            'library1',
            0
        );

        expect(result.successful).toBe(false);
        expect(result.msg).toBe(
            "File doesn't exist in the specified library: file2.py"
        );
    });

    test('reorder_files fails with a negative position', () => {
        const file1 = createFile('file1.py', 'library1');

        file_manager.add(file1);

        const result = file_manager.reorder_files(
            ['file1.py'],
            'library1',
            -1
        );

        expect(result.successful).toBe(false);
        expect(result.msg).toBe('Invalid file position');
    });

    test('reorder_files fails with an out-of-range position', () => {
        const file1 = createFile('file1.py', 'library1');
        const file2 = createFile('file2.py', 'library1');

        file_manager.add(file1);
        file_manager.add(file2);

        const result = file_manager.reorder_files(
            ['file1.py'],
            'library1',
            2
        );

        expect(result.successful).toBe(false);
        expect(result.msg).toBe('Invalid file position');
    });
});