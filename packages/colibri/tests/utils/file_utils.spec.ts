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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>

import * as file_utils from '../../src/utils/file_utils';
import * as path_lib from 'path';

describe('File Utils', () => {
    it('get_full_path', () => {
        const to_resolve = path_lib.join(__dirname, '..', 'utils', 'file_utils.spec.ts');
        expect(file_utils.get_full_path(to_resolve)).toBe(path_lib.resolve(__filename));
    });

    it('get_relative_path', () => {
        expect(file_utils.get_relative_path(__filename, __filename)).toBe('file_utils.spec.ts');
    });

    it('get_filename', () => {
        expect(file_utils.get_filename('/home/file.txt')).toBe('file.txt');
        expect(file_utils.get_filename('/home/file.txt', false)).toBe('file');
    });

    it('get_file_extension', () => {
        expect(file_utils.get_file_extension('/hom/file.txt')).toBe('.txt');
    });

    it('check_file_extension', () => {
        expect(file_utils.check_file_extension('/home/file.txt', '.txt', false)).toBe(true);
        expect(file_utils.check_file_extension('/home/file.txt', '.vhHl', false)).toBe(false);

        expect(file_utils.check_file_extension('/home/file.txt', '.vhHl', true)).toBe(false);
    });

    it('read_file_sync', () => {
        expect(file_utils.read_file_sync(path_lib.join(__dirname, 'helpers', 'sample.txt'))).toBe('test');
    });

    it('check_if_path_exist', () => {
        expect(file_utils.check_if_path_exist(__filename)).toBe(true);
        expect(file_utils.check_if_path_exist(__dirname)).toBe(true);
        expect(file_utils.check_if_path_exist("/hi/my/test")).toBe(false);
    });

    it('check_if_file', () => {
        expect(file_utils.check_if_file(__filename)).toBe(true);
        expect(file_utils.check_if_file(__dirname)).toBe(false);
        expect(file_utils.check_if_file("/hi/my/test")).toBe(false);
    });

    it('is_absolute', () => {
        expect(file_utils.is_absolute(__filename)).toBe(true);
        expect(file_utils.is_absolute(path_lib.join("..", "test"))).toBe(false);
    });

    it('get_directory', () => {
        expect(file_utils.get_directory(__filename)).toBe(__dirname);
    });

    it('get_absolute_path', () => {
        expect(file_utils.get_absolute_path(__dirname, __filename)).toBe(__filename);
        expect(file_utils.get_absolute_path(__dirname, "file_utils.spec.ts")).toBe(__filename);
    });

    it('create_folder, save_file_sync, remove_file, remove_directory', () => {
        ////////////////////////////////////////////////////////////////////////
        // Create folder
        ////////////////////////////////////////////////////////////////////////
        const folder_path = path_lib.join(__dirname, 'test_folder');
        file_utils.create_directory(folder_path);

        // Check if folder exist
        expect(file_utils.check_if_path_exist(folder_path)).toBe(true);

        ////////////////////////////////////////////////////////////////////////
        // Save file
        ////////////////////////////////////////////////////////////////////////
        const file_path = path_lib.join(folder_path, 'test.txt');
        file_utils.save_file_sync(file_path, 'testfile');
        file_utils.save_file_sync(file_path, '2', true);

        // Check if file exist
        expect(file_utils.check_if_path_exist(file_path)).toBe(true);

        // Check file content
        expect(file_utils.read_file_sync(file_path)).toBe('testfile2');

        ////////////////////////////////////////////////////////////////////////
        // Delete file
        ////////////////////////////////////////////////////////////////////////
        file_utils.remove_file(file_path);

        // Check if file exist
        expect(file_utils.check_if_path_exist(file_path)).toBe(false);

        ////////////////////////////////////////////////////////////////////////
        // Delete directory
        ////////////////////////////////////////////////////////////////////////
        file_utils.remove_directory(folder_path);

        // Check if folder exist
        expect(file_utils.check_if_path_exist(folder_path)).toBe(false);
    });

    it('read_directory', () => {
        const folder_path = path_lib.join(__dirname, 'helpers');

        const files = file_utils.read_directory(folder_path, false);
        expect(files.length).toBe(3);
        expect(files[1]).toBe(path_lib.join(__dirname, 'helpers', 'other_sample.txt'));
        expect(files[2]).toBe(path_lib.join(__dirname, 'helpers', 'sample.txt'));
    });

    it('find_files_by_extensions_dir_and_subdir', () => {
        const folder_path = path_lib.join(__dirname, 'helpers');

        const files = file_utils.find_files_by_extensions_dir_and_subdir(folder_path, ['.txt']);
        expect(files.length).toBe(3);
        expect(files[0]).toBe(path_lib.join(__dirname, 'helpers', 'other_sample.txt'));
        expect(files[1]).toBe(path_lib.join(__dirname, 'helpers', 'sample.txt'));
        expect(files[2]).toBe(path_lib.join(__dirname, 'helpers', 'subdir', 'sample3.txt'));

    });

    it('normalize_path', () => {
        const path_0 = "/this/is/a path with spaces";
        expect(file_utils.normalize_path(path_0)).toBe('"/this/is/a path with spaces"');

        const path_1 = "/this/is/space";
        expect(file_utils.normalize_path(path_1)).toBe(path_1);
    });

});