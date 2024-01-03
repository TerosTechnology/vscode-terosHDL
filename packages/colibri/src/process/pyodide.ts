// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import * as path_lib from 'path';
import { read_file_sync, get_file_extension } from '../utils/file_utils';
import { loadPyodide } from 'pyodide';

export type python_result = {
    code: string;
    stdout: string;
    stderr: string;
    return_value: any;
    successful: boolean;
}

const python_packages_folder = path_lib.join(__dirname, 'python_packages');

export const PACKAGE_MAP = {
    'vunit': path_lib.join(python_packages_folder, 'vunit_hdl-5.0.0.dev0-py3-none-any.whl')
};


export class Pyodide {
    private pyodide: any = null;

    /**
     * Write file list
     * @param file_list List of files to write
     * @returns List of filenames map
    **/
    async write_file_list(file_list: string[]): Promise<string[]> {
        const result_filename: string[] = [];
        const py_loader = await this.load();
        file_list.forEach(async (file_path, i) => {
            const file_content = read_file_sync(file_path);
            const file_extension = get_file_extension(file_path);

            const filename = `a${i}${file_extension}`;
            await py_loader.FS.writeFile("/" + filename, file_content, { encoding: "utf8" });
            result_filename.push(filename);
        });
        return result_filename;
    }

    /**
     * Load pyodide
    **/
    async load() {
        if (this.pyodide === null) {
            console.log("Loading pyodide");
            console.log(loadPyodide);
            this.pyodide = await loadPyodide();
            console.log("Pyodide loaded");
        }
        return this.pyodide;
    }

    /**
     * Exec python code
     * @param  code python code
     * @param  package_list python pacakges
     * @param  var_args variables to pass to python
     * @returns Result of the python code
    **/
    async exec_python_code(code: string, package_list: string[], var_args: any = {}): Promise<python_result> {
        const py_loader = await this.load();
        const result: python_result = {
            code: code,
            stdout: "",
            stderr: "",
            return_value: 0,
            successful: true
        };

        try {
            // Load package list
            for (const package_name of package_list) {
                await py_loader.loadPackage(package_name);
            }

            const globals_in = py_loader.toPy(var_args);
            const return_value = await py_loader.runPythonAsync(code, { globals: globals_in });
            result.return_value = return_value;

            return result;
        }
        catch (error: any) {
            console.log(error);
            result.stderr = error.message;
            result.successful = false;
            result.return_value = -1;
            return result;
        }
    }
}