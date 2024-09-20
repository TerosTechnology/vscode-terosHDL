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

import { OS, e_sentence } from "./common";
import * as os_lib from "os";
import * as path_lib from 'path';
import { makeid } from '../utils/common_utils';
import * as file_utils from '../utils/file_utils';
import * as fs from 'fs';
import * as temp from 'temp';

/**
 * Get the current operative system name
 * @returns Operative system
**/
export function get_os(): OS {
    const os_i = process.platform;
    if (os_i === "linux") {
        return OS.LINUX;
    }
    else if (os_i === "win32") {
        return OS.WINDOWS;
    }
    else {
        return OS.MAC;
    }
}

/**
 * Get sentence for the current OS
 * @param sentence_type Sentence type
 * @returns The string sentence
*/
export function get_sentence_os(sentence_type: e_sentence): string {
    const os = get_os();
    if (os === OS.WINDOWS) {
        return get_sentence_windows(sentence_type);
    }
    else {
        return get_sentence_unix(sentence_type);
    }
}

/**
 * Get sentence for unix
 * @param sentence_type Sentence type
 * @returns The string sentence
*/
function get_sentence_unix(sentence_type: e_sentence): string {
    if (sentence_type === e_sentence.MORE) {
        return ";";
    }
    else if (sentence_type === e_sentence.EXPORT) {
        return "export";
    }
    else if (sentence_type === e_sentence.SWITCH) {
        return "";
    }
    else {
        return "/";
    }
}

/**
 * Get sentence for windows
 * @param sentence_type Sentence type
 * @returns The string sentence
*/
function get_sentence_windows(sentence_type: e_sentence): string {
    if (sentence_type === e_sentence.MORE) {
        return "&&";
    }
    else if (sentence_type === e_sentence.EXPORT) {
        return "set";
    }
    else if (sentence_type === e_sentence.SWITCH) {
        return "/D";
    }
    else  {
        return "\\";
    }
}

/**
 * Create a temporary file and write the content
 * @param  content File content to write
 * @returns Temporal file path
**/
export function create_temp_file(content: string): string {
    const temp_file = temp.openSync();
    if (temp_file === undefined) {
        throw "Unable to create temporary file";
    }
    fs.writeSync(temp_file.fd, content);
    fs.closeSync(temp_file.fd);
    return temp_file.path;
}

export function getTempFolder(): string {
    return os_lib.tmpdir();
}

/**
 * Get the home directory path
 * @returns Home directory path
**/
export function get_home_directory(): string {
    const user_hom_dir = os_lib.homedir();
    return user_hom_dir;
}

/**
 * Get a random folder path in home directory
 * @returns Random folder path in home dir
**/
export function get_random_folder_in_home_directory(): string {
    const user_hom_dir = get_home_directory();
    const random_id = makeid(5);
    const random_folder = path_lib.join(user_hom_dir, `.teroshdl_${random_id}_`);
    return random_folder;
}

export function createTempFileInHome(content: string): string {
    const user_hom_dir = get_home_directory();
    const random_id = makeid(5);
    const filePath = path_lib.join(user_hom_dir, `.teroshdl_${random_id}`);
    file_utils.save_file_sync(filePath, content);
    return filePath;
}