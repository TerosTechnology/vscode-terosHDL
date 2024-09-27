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

import * as path_lib from "path";
import { Base_formatter } from "./base_formatter";
import { read_file_sync } from "../utils/file_utils";
import * as common from "./common";
import * as cfg from "../config/config_declaration";
import * as logger from "../logger/logger";
import {Pyodide} from "../process/pyodide";
import * as python from "../process/python";
import * as fs from 'fs';
import { create_temp_file, } from "../process/utils";
import { remove_file } from "../utils/file_utils";

export class S3sv extends Base_formatter {
    constructor() {
        super();
    }

    public async format_from_code(code: string, opt: cfg.e_formatter_s3sv, python_path: string): Promise<common.f_result> {
        const tempFile = create_temp_file(code);
        const result =  await this.format_from_file_with_python(tempFile, opt, python_path);
        remove_file(tempFile);
        return result;
    }

    public async format_from_file_with_python(file: string, opt: cfg.e_formatter_s3sv, python_path: string) {
        const python_script = path_lib.join(__dirname, 'bin', 's3sv', 'verilog_beautifier.py');
        //Argument construction from members parameters
        let args = " ";

        args += `-s ${opt.indentation_size} `;
        if (opt.use_tabs) {
            args += "--use-tabs ";
        }
        if (!opt.one_bind_per_line) {
            args += "--no-oneBindPerLine ";
        }

        if (opt.one_declaration_per_line) {
            args += "--oneDeclPerLine ";
        }
        args += `-i ${file}`;

        const command = `${python_path} ${python_script} ${args}`;
        const msg = `Formatting with command: ${command} `;
        logger.Logger.log(msg);

        const result_p = await python.exec_python_script(python_path, python_script, args);

        const result_f: common.f_result = {
            code_formatted: "",
            command: result_p.command,
            successful: result_p.successful,
            message: ""
        };

        if (result_p.successful === true) {
            const code_formatted = fs.readFileSync(file, 'utf8');
            result_f.code_formatted = code_formatted;
        }
        return result_f;
    }

    public async format_from_code_with_pyodide(code: string, opt: cfg.e_formatter_s3sv): Promise<common.f_result> {

        const python_file = path_lib.join(__dirname, 'bin', 's3sv', 's3sv.py');
        const python_code = read_file_sync(python_file);

        const args = {
            codein: code,
            indentation_size: opt.indentation_size,
            use_tabs: opt.use_tabs,
            one_bind_per_line: opt.one_bind_per_line,
            one_declaration_per_line: opt.one_declaration_per_line
        };

        const pyodide = new Pyodide();
        const result = await pyodide.exec_python_code(python_code, [], args);

        const formatter_result = {
            code_formatted: code,
            command: "",
            successful: result.successful,
            message: result.stderr + result.stdout
        };

        if (result.successful) {
            formatter_result.code_formatted = result.return_value;
        }

        return formatter_result;
    }

    public async format(file: string, opt: cfg.e_formatter_s3sv, python_path: string) {
        const msg = `Formatting with command s3sv `;
        logger.Logger.log(msg);

        const code = read_file_sync(file);
        const result_f = await this.format_from_code(code, opt, python_path);

        return result_f;
    }
}