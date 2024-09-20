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

import * as os from 'os';
import * as file_utils from './file_utils';

/**
 * Create a random string of a given length
 * @param length Length of the string
 * @returns Random string
**/
export function makeid(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const characters_length = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters_length));
    }
    return result;
}

/**
 * Get the home directory of the user
 * @returns Home directory
**/
export function get_home_directory(): string {
    const home_directory = os.homedir();
    return home_directory;
}

/**
 * Normalize breakline in windows by removing carriage return
 * @param  {string} txt Text
 */
export function normalize_breakline_windows(txt: string): string {
    if (process.platform === 'win32') {
        return txt.replace(/\r\n/g, '\n');
    }
    else {
        return txt;
    }
}

/**
 * Delete and create the directory
 * @param  {string} path_dir Path directory
 */
export function setup_folder(path_dir: string) {
    file_utils.remove_directory(path_dir);
    file_utils.create_directory(path_dir);
}

// /**
//  * Get the HDL language from a file path. If the file extension is not supported, return HDL_LANG.NONE
//  * @param path File path
//  * @returns HDL language
// **/
// export function get_hdl_language(path: string): HDL_LANG {
//     const ext_name = get_file_extension(path).toLocaleLowerCase();
//     if (HDL_EXTENSIONS.SYSTEMVERILOG.includes(ext_name)) {
//         return HDL_LANG.SYSTEMVERILOG;
//     }
//     else if (HDL_EXTENSIONS.VHDL.includes(ext_name)) {
//         return HDL_LANG.VHDL;
//     }
//     else if (HDL_EXTENSIONS.VERILOG.includes(ext_name)) {
//         return HDL_LANG.VERILOG;
//     }
//     else {
//         return HDL_LANG.NONE;
//     }
// }