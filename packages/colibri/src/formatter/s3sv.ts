// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com ]
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

const fs = require("fs");
const path_lib = require("path");
import { Base_formatter } from "./base_formatter";
import * as file_utils from "../utils/file_utils";
import * as utils from "../process/utils";
import * as python from "../process/python";
import * as common from "./common";
import * as cfg from "../config/config_declaration";

export class S3sv extends Base_formatter {
    constructor() {
        super();
    }

    public async format_from_code(code: string, opt: cfg.e_formatter_s3sv,
        python_path: string): Promise<common.f_result> {
        const temp_file = await utils.create_temp_file(code);
        const formatted_code = await this.format(temp_file, opt, python_path);
        file_utils.remove_file(temp_file);
        return formatted_code;
    }

    public async format(file: string, opt: cfg.e_formatter_s3sv, python_path: string) {
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
}