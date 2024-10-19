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

import { Process } from "./process";
import { get_os } from "./utils";

import * as common from "./common";
import { join } from "path";
import { get_directory, normalize_path } from "../utils/file_utils";

/** Python3 configuration options */
export type python_options = {
    path: string;
}

/** Result of a Python3 execution */
export type python_result = {
    python_path: string;
    python_complete_path: string;
    stdout: string;
    stderr: string;
    successful: boolean;
    checkMessageList: string[];
}
/**
 * Get the Python3 path
 * @param  opt Python3 configuration options
 * @returns Result
**/
export async function get_python_path(opt: python_options): Promise<python_result> {
    const configPythonPath = opt.path;
    let binary: string[] = [];
    const os_system = get_os();
    if (os_system === common.OS.WINDOWS && configPythonPath !== "") {
        binary = [
            opt.path, join(opt.path, 'python.exe'), join(opt.path, 'python3.exe'), 'python', 'python3', 'python.exe', 'python3.exe'
        ];
    }
    else if (os_system === common.OS.WINDOWS) {
        binary = [
            'python', 'python3', 'python.exe', 'python3.exe'
        ];
    }
    else if (configPythonPath !== "") {
        binary = [
            opt.path, join(opt.path, 'python'), join(opt.path, 'python3'), 'python', 'python3'
        ];
    }
    else {
        binary = [
            'python', 'python3'
        ];
    }

    // Try with normalized path
    const binary_norm = [];
    for (let i = 0; i < binary.length; i++) {
        binary_norm[i] = normalize_path(binary[i]);
    }
    let result = await find_python3_in_list(binary_norm);
    if (result.successful){
        result.python_path = normalize_path(result.python_path);
        // return result;
    }
    
    // Try non normalized path
    result = await find_python3_in_list(binary);
    return result;
}

/**
 * Search the Python3 path from a list of candidates
 * @param  binary List of Python path candidates
 * @returns Python3 path result
**/
export async function find_python3_in_list(binary: string[]): Promise<python_result> {
    const messageList = [];
    const p_result: python_result = {
        python_path: "python",
        python_complete_path: "python",
        stdout: "",
        stderr: "",
        successful: false,
        checkMessageList: messageList,
    };
    for (const bin of binary) {
        const opt: python_options = { path: bin };
        const result = await check_python3_path(opt);
        const errorMessage = `❌ Python was not found in the path "${opt.path}". Tried to find it using the command: "${result.command}"`;
        const okMessage = `✅ Python was found in the path "${opt.path}". Tried to find it using the command: "${result.command}"`;
        if (result.successful === true) {
            messageList.push(okMessage);
            p_result.python_complete_path = await get_complete_python_path(bin);
            p_result.python_path = bin;
            p_result.successful = true;
            break;
        }
        else {
            messageList.push(errorMessage);
        }
    }
    return p_result;
}

/**
 * Check if a Python3 path is correct
 * @param  opt Python3 options
 * @returns True if correct
**/
export async function check_python3_path(opt: python_options): Promise<common.p_result> {
    const cmd = `${opt.path} -c "import sys; check_version = sys.version_info > \
        (3,0); exit(0) if check_version == True else exit(-1)"`;
    const p = new Process();
    const result = await p.exec_wait(cmd);
    return result;
}

/**
 * Get the complete Python3 path from a Python executable
 * @param python_path Python executable path
**/
async function get_complete_python_path(python_path: string) {
    const cmd = `${python_path} -c "import sys; print(sys.executable)"`;
    const p = new Process();
    const result = await p.exec_wait(cmd);
    return result.stdout;
}

/**
 * Check if a list of Python3 package are installed
 * @param python_path Python3 path
 * @param package_name_list List of packages
 * @returns true if they are installed, false if not
**/
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
 * @param  python_path Python3 path
 * @param  package_name Package name
 * @returns true if they are installed, false if not
**/
export async function check_python_package(python_path: string, package_name: string): Promise<boolean> {
    const cmd = `${python_path} -c "import ${package_name}; exit(0)"`;
    const p = new Process();
    const result = await p.exec_wait(cmd);
    return result.successful;
}

/**
 * Execute a Python3 script from a path. The working directory is the python script directory
 * @param python_path Python executable path
 * @param python_script_path Python script to execute
 * @param args Arguments for the script
 * @param pre_script Script to execute before the python script
 * @returns Result
**/
export async function exec_python_script(python_path: string, python_script_path: string, args: string,
    pre_script = "") : Promise<common.p_result>{
    const opt: python_options = {
        path: python_path
    };

    const python_script_dir = get_directory(python_script_path);
    const python_result = await get_python_path(opt);
    const cmd = `${pre_script} ${python_result.python_path} ${normalize_python_script(python_script_path)} ${args}`;
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

    get_python_path(opt).then(function (result: python_result) {
        const cmd = `${pre_script} ${result.python_path} ${normalize_python_script(python_script_path)} ${args}`;
        const p = new Process();
        const exec_i = p.exec(cmd, opt_exec, (result: common.p_result) => {
            callback(result);
        });
        callback_stream(exec_i);
    });
}

/**
 * Normalize Python script path
 * @param python_script_path Python script path
 * @returns Normalized path
**/
export function normalize_python_script(python_script_path: string): string {
    python_script_path = `"${python_script_path}"`;
    return python_script_path;
}