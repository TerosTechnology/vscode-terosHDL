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

import * as file_utils from './file_utils';
import glob = require('tiny-glob');

class Hdl_file {
    filename = "";
    library = "";
    constructor(filename: string, library = "") {
        this.filename = filename;
        this.library = library;
    }
}
/**
 * @returns {string} Current command line directory
 */
export function get_current_directory(): string {
    return process.cwd();
}

/**
 * Get a list of files from an input path
 * @param  {string} input Input CSV path or glob path
 * @param  {string} current_dir Current command directory
 * @returns {Hdl_file[]} List of HDL files
 */
export async function get_files_from_input(input: string, current_dir: string): Promise<Hdl_file[]> {
    // Check if CSV or string
    const absolute_path = file_utils.get_absolute_path(current_dir, input);
    const is_file = file_utils.check_if_path_exist(absolute_path);
    if (is_file && file_utils.check_file_extension(absolute_path, '.csv', false)) {
        return get_files_from_csv(absolute_path);
    }
    else {
        return await get_files_from_glob(input);
    }
}

/**
 * Get a list of files from an input path
 * @param  {string} input Input CSV path
 * @returns {Hdl_file[]} List of HDL files
 */
function get_files_from_csv(input_path: string): Hdl_file[] {
    const file_content = file_utils.read_file_sync(input_path);
    const file_content_lines = file_content.split(/\r?\n/);
    const hdl_list: Hdl_file[] = [];
    file_content_lines.forEach(line_inst => {
        const line_split = line_inst.split(',');

        let filename = '';
        let library = '';

        // Filename
        if (line_split.length === 1) {
            filename = line_split[0].trim();
        }
        // Library and filename
        else if (line_split.length === 2) {
            library = line_split[0].trim();
            filename = line_split[1].trim();
        }
        const input_path_dir = file_utils.get_directory(input_path);
        const file_path = file_utils.get_absolute_path(input_path_dir, filename);
        hdl_list.push(new Hdl_file(file_path, library));
    });
    return hdl_list;
}

/**
 * Get a list of files from an input
 * @param  {string} input Comma separated list of files
 * @returns {Hdl_file[]} List of HDL files
 */
export function get_files_from_string(input: string): Hdl_file[] {
    const input_list = input.split(',');
    const hdl_list: Hdl_file[] = [];
    input_list.forEach(input_inst => {
        hdl_list.push(new Hdl_file(input_inst.trim()));
    });
    return hdl_list;
}

/**
 * Get a list of files from a glob string
 * @param  {string} input Glob pattern
 * @returns {Hdl_file[]} List of HDL files
 */
async function get_files_from_glob(glob_pattern: string, only_files = false): Promise<Hdl_file[]> {
    const input_list = await glob(glob_pattern, { absolute: true, filesOnly: only_files });
    const hdl_list: Hdl_file[] = [];
    input_list.forEach(input_inst => {
        hdl_list.push(new Hdl_file(input_inst.trim()));
    });
    return hdl_list;
}