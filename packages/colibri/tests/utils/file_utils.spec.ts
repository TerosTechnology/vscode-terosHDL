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

});

    // it('get_relative_path', () => {
    //     expect(file_utils.get_relative_path('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt', '/home/carlos')).toBe('colibri2/packages/colibri/tests/utils/file.txt');
    // });

    // it('get_filename', () => {
    //     expect(file_utils.get_filename('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt')).toBe('file.txt');
    //     expect(file_utils.get_filename('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt', false)).toBe('file');
    // });

    // it('get_file_extension', () => {
    //     expect(file_utils.get_file_extension('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt')).toBe('.txt');
    // });

    // it('get_directory', () => {
    //     expect(file_utils.get_directory('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt')).toBe('/home/carlos/colibri2/packages/colibri/tests/utils');
    // });

    // it('get_file_size', () => {
    //     expect(file_utils.get_file_size('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt')).toBe(0);
    // });

    // it('is_file', () => {
    //     expect(file_utils.is_file('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt')).toBe(true);
    // });

    // it('is_directory', () => {
    //     expect(file_utils.is_directory('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt')).toBe(false);
    // });

    // it('is_file_or_directory', () => {
    //     expect(file_utils.is_file_or_directory('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt')).toBe(true);
    // });

    // it('get_file_last_modified_date', () => {
    //     expect(file_utils.get_file_last_modified_date('/home/carlos/colibri2/packages/colibri/tests/utils/file.txt')).toBe('2021-10-16 17:35:11');
    // });

    // it('get_file_last_accessed_date', () => {
    //     expect(file_utils.get_file_last_accessed_date('/home/carlos

