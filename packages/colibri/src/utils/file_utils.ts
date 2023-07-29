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
import * as fs from 'fs';
import * as path_lib from 'path';

/**
 * Get full path
 * @param  {string} path
 * @returns {string} Full path
 */
export function get_full_path(path: string): string {
    return path_lib.resolve(path);
}

export function get_relative_path(path: string, reference_path: string): string {
    const reference_dir = get_directory(reference_path);
    return path_lib.relative(reference_dir, path);
}

/**
 * Get full path
 * @param  {string} path
 * @returns {string} Filename
 */
export function get_filename(path: string, with_extension = true): string {
    if (with_extension === true) {
        return path_lib.basename(path);
    }
    else {
        return path_lib.basename(path, path_lib.extname(path));
    }
}

/**
 * Get the extension of a file
 * @param  {string} file_path
 * @returns {string} Extension. E.g: .csv
 */
export function get_file_extension(file_path: string): string {
    return path_lib.extname(file_path);
}

/**
 * Check if a file has the extension
 * @param  {string} file_path File path
 * @param  {string} file_extension_expected Extension of the file
 * @param  {string} case_sensitive Case sensitive comparation
 * @returns {boolean} True if extension, false if not
 */
export function check_file_extension(file_path: string, file_extension_expected: string,
    case_sensitive: boolean): boolean {

    let file_extension = get_file_extension(file_path);
    if (case_sensitive === false) {
        file_extension = file_extension.toLocaleLowerCase();
        file_extension_expected = file_extension_expected.toLocaleLowerCase();
    }

    if (file_extension === file_extension_expected) {
        return true;
    }
    return false;
}

/**
 * Read sync a file from the path
 * @param  {string} file_path File path
 * @returns {string} Content of file
 */
export function read_file_sync(file_path: string): string {
    const content = fs.readFileSync(file_path, 'utf8');
    return content;
}

/**
 * Write sync content to file
 * @param  {string} file_path File path
 * @param  {string} content Content
 * @param  {boolean} append Append to file
 */
export function save_file_sync(file_path: string, content: string, append = false) {
    if (append === true) {
        fs.writeFileSync(file_path, content, { encoding: 'utf8', flag: "a+" });
    }
    else {
        fs.writeFileSync(file_path, content, { encoding: 'utf8' });
    }
}

/**
 * @param  {string} file_path
 * @returns {boolean} True if exist, false if not
 */
export function check_if_path_exist(file_path: string): boolean {
    return fs.existsSync(file_path);
}

/**
 * @param  {string} file_path
 * @returns {boolean} True if file, false if directory
 */
export function check_if_file(file_path: string): boolean {
    try {
        return !fs.lstatSync(file_path).isDirectory();
    }
    catch (err) {
        return false;
    }
}

/**
 * Check if a file path is absolute
 * @param  {string} path Path
 * @returns {boolean} True if absolute path
 */
export function is_absolute(path: string): boolean {
    return path_lib.isAbsolute(path);
}

/**
 * Get the absolute path from the current directory
 * @param  {string} current_directory Current directory
 * @param  {string} path Relative/absolute path
 * @returns {string} Absolute path from current directory
 */
export function get_absolute_path(current_directory: string, path: string): string {
    // Path is absolute
    if (path_lib.isAbsolute(path)) {
        return path;
    }
    return path_lib.join(current_directory, path);
}

/**
 * Get directory from path
 * @param  {string} path Path
 * @returns {string} Direcotry of path
 */
export function get_directory(path: string): string {
    return path_lib.dirname(path);
}

/**
 * Create a folder
 * @param  {string} path Directory path
 */
export function create_directory(folder_path: string, recursive = true) {
    fs.mkdirSync(folder_path, { recursive: recursive });
}

/**
 * Remove folder
 * @param  {string} path Folder path
 */
export function remove_directory(_folder_path: string) {
    // fs.rmdirSync(_folder_path, { recursive: true });
    // const del_lib = require('del');
    // del_lib.deleteSync(folder_path);
}

/**
 * Remove file
 * @param  {string} path File path
 */
export function remove_file(file_path: string) {
    try {
        fs.unlinkSync(file_path);
    }
    // eslint-disable-next-line no-empty
    catch (err) { }
}


/**
 * Get all files in a directory
 * @param  {string} dirname Directory path
 */
export function read_directory(dirname: string): string[] {
    let result: string[] = [];
    if (check_if_path_exist(dirname)) {
        result = fs.readdirSync(dirname);
    }
    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        result[index] = path_lib.join(dirname, element);
    }
    return result;
}


export function find_files_by_extensions(directoryPath: string, validExtensions: string[]): string[] {
    const results: string[] = [];

    function traverseDirectory(dir: string): void {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path_lib.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                traverseDirectory(filePath); // Recursivamente explorar subdirectorios
            } else {
                const fileExtension = path_lib.extname(file).toLowerCase();
                if (validExtensions.includes(fileExtension)) {
                    results.push(filePath);
                }
            }
        }
    }

    traverseDirectory(directoryPath);
    return results;
}

export function getFilesInDirectory(directoryPath: string): string[] {
    const files: string[] = [];

    const fileNames = fs.readdirSync(directoryPath);
    for (const fileName of fileNames) {
        const filePath = path_lib.join(directoryPath, fileName);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            files.push(filePath);
        }
    }

    return files;
}

/**
 * Normalize path with spaces, get full path
 * @param path Path to normalize
 * @returns path normalized
 */
export function normalize_path(path: string) : string {
    const regex = /[\s\t]/;

    if (regex.test(path)){
        return `"${path}"`;
    }
    return path;
}