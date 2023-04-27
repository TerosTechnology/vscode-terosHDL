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

import { OS, e_sentence } from "./common";
import * as os_lib from "os";
import * as path_lib from 'path';
import { makeid } from '../utils/common_utils';
import * as fs from 'fs';

/**
 * Get the current operative system name
 * @returns OS
 */
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
 * @param  {e_sentence} sentence_type Sentence type
 * @returns string -> Sentence
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

function get_sentence_unix(sentence_type: e_sentence): string {
    if (sentence_type === e_sentence.MORE) {
        return ";"
    }
    else if (sentence_type === e_sentence.EXPORT) {
        return "export";
    }
    else if (sentence_type === e_sentence.SWITCH) {
        return "";
    }
    else if (sentence_type === e_sentence.FOLDER_SEP) {
        return "/";
    }
    return "";
}

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
    else if (sentence_type === e_sentence.FOLDER_SEP) {
        return "\\";
    }
    return "";
}

/**
 * Create a temporary file and write the content
 * @param  {string} content File content to write
 * @returns string -> Temporal file path
 */
export function create_temp_file(content: string): string {
    const temp = require('temp');
    const fs = require('fs');

    const temp_file = temp.openSync();
    if (temp_file === undefined) {
        throw "Unable to create temporary file";
    }
    fs.writeSync(temp_file.fd, content);
    fs.closeSync(temp_file.fd);
    return temp_file.path;
}

/**
 * Get the home directory path
 * @returns string -> Home directory path
 */
export function get_home_directory(): string {
    const user_hom_dir = os_lib.homedir();
    return user_hom_dir;
}

/**
 * Get a random folder path in home directory
 * @returns string -> Random folder path
 */
export function get_random_folder_in_home_directory(): string {
    const user_hom_dir = get_home_directory();
    const random_id = makeid(5);
    const random_folder = path_lib.join(user_hom_dir, `.teroshdl_${random_id}_`)
    return random_folder;
}

/**
 * Delete directory and subdirectories
 * @param  {string} directory Directory path
 * @returns boolean -> true if successful, false if not
 */
export function rm_directory(directory: string): boolean {
    try {
        fs.rmdirSync(directory, { recursive: true });
        return true;
    } catch (err) {
        return false;
    }
}