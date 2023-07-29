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
 * @param path
 * @returns Full path
**/
export function get_full_path(path: string): string {
    return path_lib.resolve(path);
}

/**
 * Get relative path from other **file**
 * @param path Path to get the relative
 * @param reference_path Reference path
 * @returns Relative path
**/
export function get_relative_path(path: string, reference_path: string): string {
    const reference_dir = get_directory(reference_path);
    return path_lib.relative(reference_dir, path);
}

/**
 * Get filename from path
 * @param path Path
 * @param with_extension Include extension
 * @returns Filename
**/
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
 * @param file_path File path
 * @returns Extension. E.g: .csv
**/
export function get_file_extension(file_path: string): string {
    return path_lib.extname(file_path);
}

/**
 * Check if a file has the extension
 * @param file_path File path
 * @param file_extension_expected Extension of the file
 * @param case_sensitive Case sensitive comparation
 * @returns True if extension, false if not
**/
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
 * @param  file_path File path
 * @returns Content of file
**/
export function read_file_sync(file_path: string): string {
    const content = fs.readFileSync(file_path, 'utf8');
    return content;
}

/**
 * Write sync content to file
 * @param file_path File path
 * @param content Content
 * @param append Append to file
**/
export function save_file_sync(file_path: string, content: string, append = false) {
    if (append === true) {
        fs.writeFileSync(file_path, content, { encoding: 'utf8', flag: "a+" });
    }
    else {
        fs.writeFileSync(file_path, content, { encoding: 'utf8' });
    }
}

/**
 * Check if a path exist
 * @param file_path
 * @returns True if exist, false if not
**/
export function check_if_path_exist(file_path: string): boolean {
    return fs.existsSync(file_path);
}

/**
 * Check if a path is a file
 * @param file_path
 * @returns True if file, false if directory or not exist
**/
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
 * @param  path Path
 * @returns True if absolute path
**/
export function is_absolute(path: string): boolean {
    return path_lib.isAbsolute(path);
}

/**
 * Get the absolute path from the current directory
 * @param current_directory Current directory
 * @param path Relative/absolute path
 * @returns Absolute path from current directory
**/
export function get_absolute_path(current_directory: string, path: string): string {
    // Path is absolute
    if (path_lib.isAbsolute(path)) {
        return path;
    }
    return path_lib.join(current_directory, path);
}

/**
 * Get directory from path
 * @param path Path
 * @returns Direcotry of path
**/
export function get_directory(path: string): string {
    return path_lib.dirname(path);
}

/**
 * Create a folder
 * @param path Directory path
 * @param recursive Create recursive
**/
export function create_directory(folder_path: string, recursive = true) {
    fs.mkdirSync(folder_path, { recursive: recursive });
}

/**
 * Folder to remove
 * @param path Folder path
*/
export function remove_directory(folder_path: string) {
    fs.rmdirSync(folder_path, { recursive: true });
}

/**
 * File to remove
 * @param path File path
*/
export function remove_file(file_path: string) {
    try {
        fs.unlinkSync(file_path);
    }
    // eslint-disable-next-line no-empty
    catch (err) { }
}


/**
 * Get all files or files and directories in a directory
 * @param dirname Directory path
 * @param include_dir Include directories
*/
export function read_directory(dirname: string, include_dir: boolean): string[] {
    let result: string[] = [];
    if (check_if_path_exist(dirname)) {
        result = fs.readdirSync(dirname);
    }
    const complete_result : string[] = [];
    for (let index = 0; index < result.length; index++) {
        const element = path_lib.join(dirname, result[index]);
        if (check_if_file(element) || include_dir === true) {
            complete_result.push(element);
        }
    }
    return complete_result;
}

/**
 * Find all files in a directory with a given extension
 * @param dirname Directory path
 * @param extension Extension of the file if empty all the extensions
**/
export function find_files_by_extensions_dir_and_subdir(directory_path: string, valid_extensions: string[]): string[] {
    const results: string[] = [];

    function traverseDirectory(dir: string): void {
        const files = read_directory(dir, true);

        for (const file of files) {
            if (!check_if_file(file)) {
                traverseDirectory(file); // Recursive explore directory
            } else {
                const file_extension = get_file_extension(file);
                if (valid_extensions.includes(file_extension) || valid_extensions.length === 0) {
                    results.push(file);
                }
            }
        }
    }

    traverseDirectory(directory_path);
    return results;
}

/**
 * Normalize path with spaces
 * @param path Path to normalize
 * @returns path normalized
**/
export function normalize_path(path: string) : string {
    const regex = /[\s\t]/;

    if (regex.test(path)){
        return `"${path}"`;
    }
    return path;
}