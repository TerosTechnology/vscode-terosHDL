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

export class S3sv extends Base_formatter {
    constructor() {
        super();
    }

    public async format_from_code(code: string, opt: cfg.e_formatter_s3sv): Promise<common.f_result> {
        return await this.format_from_code_with_pyodide(code, opt);
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

    public async format(file: string, opt: cfg.e_formatter_s3sv) {
        const msg = `Formatting with command s3sv `;
        logger.Logger.log(msg, logger.T_SEVERITY.INFO);

        const code = read_file_sync(file);
        const result_f = await this.format_from_code(code, opt);

        return result_f;
    }
}