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
import { e_file_origin, e_source_type, t_file } from '../../src/colibri/project_manager/common';
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

    test('preserves the original library across automatic file moves and watcher reloads', () => {
        const file = createFile('file.vhd', 'work');
        file_manager.add(file);

        expect(file_manager.move_file(file.name, 'work', 'custom_lib').successful).toBe(true);
        file_manager.clear_automatic_files();
        file_manager.add(file);
        expect(file_manager.get()[0].logical_name).toBe('custom_lib');

        expect(file_manager.move_file(file.name, 'custom_lib', 'another_lib').successful).toBe(true);
        file_manager.clear_automatic_files();
        file_manager.add(file);
        expect(file_manager.get()[0].logical_name).toBe('another_lib');
        expect(Array.from(file_manager['library_overrides'].values())).toEqual([{
            name: file.name,
            original_library: 'work',
            target_library: 'another_lib',
        }]);

        expect(file_manager.move_file(file.name, 'another_lib', 'work').successful).toBe(true);
        expect(file_manager['library_overrides'].size).toBe(0);
        file_manager.clear_automatic_files();
        file_manager.add(file);
        expect(file_manager.get()[0].logical_name).toBe('work');
    });

    test('preserves bulk moves on reload without applying overrides to manual files', () => {
        const automatic = createFile('automatic.vhd', 'work');
        const manual = { ...createFile('manual.vhd', 'work'), is_manual: true };
        file_manager.add(automatic);
        file_manager.add(manual);

        const result = file_manager.move_files([
            { name: automatic.name, logical_name: 'work' },
            { name: manual.name, logical_name: 'work' },
        ], 'custom_lib');
        expect(result.successful).toBe(true);

        file_manager.clear_automatic_files();
        file_manager.add(automatic);
        expect(file_manager.get().map(file => [file.name, file.logical_name])).toEqual([
            ['manual.vhd', 'custom_lib'],
            ['automatic.vhd', 'custom_lib'],
        ]);

        const manualCopy = { ...automatic, is_manual: true };
        expect(file_manager.add(manualCopy).successful).toBe(true);
        expect(file_manager.get().find(file => file.name === automatic.name && file.is_manual)?.logical_name)
            .toBe('work');
    });

    test('tracks consecutive bulk moves back to the original library', () => {
        const file = createFile('file.vhd', 'work');
        file_manager.add(file);

        for (const [from, to] of [
            ['work', 'custom_lib'],
            ['custom_lib', 'another_lib'],
            ['another_lib', 'work'],
        ]) {
            expect(file_manager.move_files([{ name: file.name, logical_name: from }], to).successful).toBe(true);
            file_manager.clear_automatic_files();
            file_manager.add(file);
            expect(file_manager.get()[0].logical_name).toBe(to);
        }

        expect(file_manager['library_overrides'].size).toBe(0);
    });

    test('rejects bulk moves that would create duplicate destination files', () => {
        const file = createFile('shared.vhd', 'work');
        file_manager.add(file);
        file_manager.add({ ...file, logical_name: 'other' });

        const result = file_manager.move_files([
            { name: file.name, logical_name: 'work' },
            { name: file.name, logical_name: 'other' },
        ], 'target');

        expect(result.successful).toBe(false);
        expect(file_manager.get().map(item => item.logical_name)).toEqual(['work', 'other']);
        expect(file_manager['library_overrides'].size).toBe(0);
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

    test('combines normalized watcher contributions and removes only the requested watcher', () => {
        const file = createFile('/sources/shared.py');
        expect(file_manager.add_contribution({
            ...file, origins: [e_file_origin.WATCHER], watcher_paths: ['/watchers/a/../one.csv'],
        }).successful).toBe(true);
        expect(file_manager.add_contribution({
            ...file, origins: [e_file_origin.WATCHER], watcher_paths: ['/watchers/one.csv', '/watchers/two.csv'],
        }).successful).toBe(true);
        expect(file_manager.get()).toHaveLength(1);
        expect(file_manager.get()[0]).toEqual(expect.objectContaining({
            origins: [e_file_origin.WATCHER],
            watcher_paths: ['/watchers/one.csv', '/watchers/two.csv'],
        }));

        expect(file_manager.remove_watcher_contribution('/watchers/one.csv').successful).toBe(true);
        expect(file_manager.get()[0].watcher_paths).toEqual(['/watchers/two.csv']);
        expect(file_manager.remove_watcher_contribution('/watchers/./two.csv').successful).toBe(true);
        expect(file_manager.get()).toHaveLength(0);
    });

    for (const first of ['watcher', 'quartus']) {
        test(`preserves a shared file when removing the ${first} contribution first`, () => {
            const file = createFile('/sources/shared.py');
            file_manager.add_contribution({ ...file, origins: [e_file_origin.QUARTUS] });
            file_manager.add_contribution({
                ...file, origins: [e_file_origin.WATCHER], watcher_paths: ['/watchers/one.csv'],
            });

            if (first === 'watcher') {
                file_manager.remove_watcher_contribution('/watchers/one.csv');
                expect(file_manager.get()[0].origins).toEqual([e_file_origin.QUARTUS]);
                file_manager.remove_origin_contribution(file.name, file.logical_name, e_file_origin.QUARTUS);
            } else {
                file_manager.remove_origin_contribution(file.name, file.logical_name, e_file_origin.QUARTUS);
                expect(file_manager.get()[0].origins).toEqual([e_file_origin.WATCHER]);
                file_manager.remove_watcher_contribution('/watchers/one.csv');
            }
            expect(file_manager.get()).toHaveLength(0);
        });
    }

    for (const manualFirst of [true, false]) {
        test(`keeps a shared manual file regardless of insertion order: ${manualFirst}`, () => {
            const file = createFile('/sources/shared.py');
            const manual = { ...file, is_manual: true };
            const automatic = { ...file, origins: [e_file_origin.QUARTUS] };
            const contributions = manualFirst ? [manual, automatic] : [automatic, manual];
            contributions.forEach(item => expect(file_manager.add_contribution(item).successful).toBe(true));

            file_manager.remove_origin_contribution(file.name, file.logical_name, e_file_origin.QUARTUS);
            expect(file_manager.get()).toHaveLength(1);
            expect(file_manager.get()[0].is_manual).toBe(true);
        });
    }

    test('retains the unknown origin of a legacy automatic file after removing a new contribution', () => {
        const file = createFile('/sources/legacy.py');
        file_manager.add(file);
        expect(file_manager.add_contribution({
            ...file, origins: [e_file_origin.WATCHER], watcher_paths: ['/watchers/one.csv'],
        }).successful).toBe(true);
        file_manager.remove_watcher_contribution('/watchers/one.csv');
        expect(file_manager.get()).toHaveLength(1);
        expect(file_manager.get()[0].origins).toEqual([e_file_origin.UNKNOWN]);
    });

    test('rejects conflicting metadata without registering the new contribution', () => {
        const file = createFile('/sources/shared.py');
        file_manager.add_contribution({ ...file, origins: [e_file_origin.QUARTUS] });
        const result = file_manager.add_contribution({
            ...file, source_type: e_source_type.SIMULATION,
            origins: [e_file_origin.WATCHER], watcher_paths: ['/watchers/one.csv'],
        });
        expect(result.successful).toBe(false);
        expect(result.msg).toContain('metadata');
        expect(file_manager.get()[0]).toEqual(expect.objectContaining({
            source_type: e_source_type.NONE, origins: [e_file_origin.QUARTUS], watcher_paths: [],
        }));
    });

    test('rejects inconsistent watcher provenance without changing files', () => {
        const file = createFile('/sources/shared.py');
        for (const contribution of [
            { ...file, origins: [e_file_origin.WATCHER] },
            { ...file, origins: [e_file_origin.QUARTUS], watcher_paths: ['/watchers/one.csv'] },
            { ...file, origins: [e_file_origin.WATCHER], watcher_paths: ['relative.csv'] },
            file,
        ]) {
            expect(file_manager.add_contribution(contribution).successful).toBe(false);
        }
        expect(file_manager.remove_watcher_contribution('relative.csv').successful).toBe(false);
        expect(file_manager.get()).toHaveLength(0);
    });

    test('keeps separate libraries and applies an automatic library override to a contribution', () => {
        const file = createFile('/sources/shared.py', 'work');
        file_manager.add_contribution({ ...file, origins: [e_file_origin.QUARTUS] });
        file_manager.add_contribution({ ...file, logical_name: 'other', origins: [e_file_origin.OTHER] });
        file_manager.move_file(file.name, 'work', 'custom');
        expect(file_manager.add_contribution({
            ...file, origins: [e_file_origin.WATCHER], watcher_paths: ['/watchers/one.csv'],
        }).successful).toBe(true);
        expect(file_manager.get().map(item => [item.logical_name, item.origins])).toEqual([
            ['custom', [e_file_origin.QUARTUS, e_file_origin.WATCHER]],
            ['other', [e_file_origin.OTHER]],
        ]);
        file_manager.remove_origin_contribution(file.name, 'other', e_file_origin.OTHER);
        expect(file_manager.get()).toHaveLength(1);
    });

    test('preserves compile and visual order when only provenance changes', async () => {
        const first = createFile('/sources/first.py');
        const second = createFile('/sources/second.py');
        file_manager.add_contribution({ ...first, origins: [e_file_origin.QUARTUS] });
        file_manager.add_contribution({ ...second, origins: [e_file_origin.QUARTUS] });
        await calculateCompileOrder([second, first]);

        file_manager.add_contribution({
            ...first, origins: [e_file_origin.WATCHER], watcher_paths: ['/watchers/one.csv'],
        });
        file_manager.remove_origin_contribution(first.name, first.logical_name, e_file_origin.QUARTUS);
        expect(file_manager.get().map(file => file.name)).toEqual([first.name, second.name]);
        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([second.name, first.name]);

        file_manager.remove_watcher_contribution('/watchers/one.csv');
        expect(file_manager.get().map(file => file.name)).toEqual([second.name]);
        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([second.name]);
    });

    test('replacing watcher contributions preserves other origins and unchanged compile order', async () => {
        const first = createFile('/sources/first.py');
        const second = createFile('/sources/second.py');
        file_manager.add_contribution({ ...first, origins: [e_file_origin.QUARTUS] });
        expect(file_manager.replace_watcher_contributions([
            { file: first, watcher_path: '/watchers/one.csv' },
            { file: second, watcher_path: '/watchers/one.csv' },
        ]).successful).toBe(true);
        await calculateCompileOrder([second, first]);

        expect(file_manager.replace_watcher_contributions([
            { file: first, watcher_path: '/watchers/two.csv' },
            { file: second, watcher_path: '/watchers/two.csv' },
        ]).successful).toBe(true);
        expect(file_manager.get().map(file => file.name)).toEqual([first.name, second.name]);
        expect(file_manager.get_compile_order().map(file => file.name)).toEqual([second.name, first.name]);
        expect(file_manager.get()[0].origins).toEqual([e_file_origin.QUARTUS, e_file_origin.WATCHER]);

        file_manager.replace_watcher_contributions([]);
        expect(file_manager.get()).toHaveLength(1);
        expect(file_manager.get()[0].origins).toEqual([e_file_origin.QUARTUS]);
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

    test('moving an automatic file persists its library after clearing automatic files', () => {
        const file = createFile('file1.py', 'library1');

        file_manager.add(file);

        const result = file_manager.move_file(
            'file1.py',
            'library1',
            'library2'
        );

        expect(result.successful).toBe(true);

        file_manager.clear_automatic_files();
        file_manager.add(file);

        expect(file_manager.get()).toHaveLength(1);
        expect(file_manager.get()[0]).toEqual(
            expect.objectContaining({
                name: 'file1.py',
                logical_name: 'library2',
                is_manual: false
            })
        );
    });

    test('moving an automatic file multiple times persists its last library', () => {
        const file = createFile('file1.py', 'library1');

        file_manager.add(file);

        const first_result = file_manager.move_file(
            'file1.py',
            'library1',
            'library2'
        );

        const second_result = file_manager.move_file(
            'file1.py',
            'library2',
            'library3'
        );

        expect(first_result.successful).toBe(true);
        expect(second_result.successful).toBe(true);

        file_manager.clear_automatic_files();
        file_manager.add(file);

        expect(file_manager.get()).toHaveLength(1);
        expect(file_manager.get()[0].logical_name).toBe('library3');
    });

    test('moving an automatic file back to its original library clears its override', () => {
        const file = createFile('file1.py', 'library1');

        file_manager.add(file);

        file_manager.move_file('file1.py', 'library1', 'library2');

        const result = file_manager.move_file(
            'file1.py',
            'library2',
            'library1'
        );

        expect(result.successful).toBe(true);
        file_manager.clear_automatic_files();
        file_manager.add(file);

        expect(file_manager.get()).toHaveLength(1);
        expect(file_manager.get()[0].logical_name).toBe('library1');
    });
});