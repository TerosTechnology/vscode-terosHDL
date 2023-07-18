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

import { Process } from "./process";
import { get_os } from "./utils";
import { normalize_path } from "../utils/common_utils";

import * as common from "./common";
import { join } from "path";
import { get_directory } from "../utils/file_utils";

/** Python3 configuration options */
export type python_options = {
    path: string;
}

/** Result of a Python3 execution */
export type python_result = {
    python_path: string;
    stdout: string;
    stderr: string;
    successful: boolean;
}
/**
 * Get the Python3 path
 * @param  {python_options} opt Python3 configuration options
 * @returns Promise
 */
export async function get_python_path(opt: python_options): Promise<python_result> {
    let binary: string[] = [];
    const os_system = get_os();
    if (os_system === common.OS.WINDOWS) {
        binary = [opt.path, normalize_path(opt.path),
        join(opt.path, 'python.exe'), join(opt.path, 'python3.exe'), 'python3', 'python', 'python.exe', 'python3.exe'];
    }
    else {
        binary = [opt.path, normalize_path(opt.path),
            join(opt.path, 'python'), join(opt.path, 'python3'), 'python3', 'python'];
    }
    const result = await find_python3_in_list(binary);
    return result;
}

/**
 * Search the Python3 path from a list of candidates
 * @param  {string[]} binary List of Python path candidates
 * @returns Promise -> Python3 path result
 */
export async function find_python3_in_list(binary: string[]): Promise<python_result> {
    const p_result: python_result = {
        python_path: "",
        stdout: "",
        stderr: "",
        successful: false
    };
    for (const bin of binary) {
        const opt: python_options = { path: bin };
        const result = await check_python3_path(opt);
        if (result.successful === true) {
            p_result.python_path = await get_complete_python_path(bin);
            p_result.successful = true;
            break;
        }
    }
    return p_result;
}

/**
 * Check if a Python3 path is correct
 * @param  {python_options} opt Python3 options
 * @returns Promise
 */
export async function check_python3_path(opt: python_options): Promise<common.p_result> {
    const cmd = `${opt.path} -c "import sys; check_version = sys.version_info > \
        (3,0); exit(0) if check_version == True else exit(-1)"`;
    const p = new Process();
    const result = await p.exec_wait(cmd);
    return result;
}

/**
 * Get the complete Python3 path from a Python executable
 * @param  {string} python_path Python executable path
 */
async function get_complete_python_path(python_path: string) {
    const cmd = `${python_path} -c "import sys; print(sys.executable)"`;
    const p = new Process();
    const result = await p.exec_wait(cmd);
    return result.stdout;
}

/**
 * Check if a list of Python3 package are installed
 * @param  {string} python_path Python3 path
 * @param  {string[]} package_name_list List of packages
 * @returns Promise -> true if they are installed, false if not
 */
export async function check_python_package_list(python_path: string, package_name_list: string[]): Promise<boolean> {
    for (const package_name of package_name_list) {
        const result = await check_python_package(python_path, package_name);
        if (result === false) {
            return result;
        }
    }
    return true;
}

/**
 * Check if a Python3 package is installed
 * @param  {string} python_path Python3 path
 * @param  {string} package_name Package name
 * @returns Promise -> true if they are installed, false if not
 */
export async function check_python_package(python_path: string, package_name: string): Promise<boolean> {
    const cmd = `${python_path} -c "import ${package_name}; exit(0)"`;
    const p = new Process();
    const result = await p.exec_wait(cmd);
    return result.successful;
}

/**
 * Execute a Python3 script from a path
 * @param  {string} python_path Python executable path
 * @param  {string} python_script_path Python script to execute
 * @param  {string} args Arguments for the script
 */
export async function exec_python_script(python_path: string, python_script_path: string, args: string,
    pre_script = "") {
    const opt: python_options = {
        path: python_path
    };

    python_script_path = normalize_path(python_script_path);

    const python_script_dir = get_directory(python_script_path);
    const python_result = await get_python_path(opt);
    const cmd = `${pre_script} ${python_result.python_path} ${python_script_path} ${args}`;
    const p = new Process();
    const result = await p.exec_wait(cmd, { "cwd": python_script_dir });
    return result;
}

/**
 * Execute a Python3 script from a path async
 * @param  {string} python_path Python executable path
 * @param  {string} python_script_path Python script to execute
 * @param  {string} args Arguments for the script
 */
export function exec_python_script_async(python_path: string, python_script_path: string, args: string,
    pre_script: string, working_directory: string,
    callback: (result: common.p_result) => void, callback_stream: (stream_c: any) => void) {

    const opt: python_options = {
        path: python_path
    };

    let opt_exec: any = undefined;
    if (working_directory !== "") {
        opt_exec = { cwd: working_directory };
    }

    python_script_path = normalize_path(python_script_path);

    get_python_path(opt).then(function (result: python_result) {
        const cmd = `${pre_script} ${result.python_path} ${python_script_path} ${args}`;
        const p = new Process();
        const exec_i = p.exec(cmd, opt_exec, (result: common.p_result) => {
            callback(result);
        });
        callback_stream(exec_i);
    });
}