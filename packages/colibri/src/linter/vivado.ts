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

import {rm_sync} from "../utils/file_utils";

import { get_language_from_filepath } from "../utils/file_utils";
import { LANGUAGE } from "../common/general";

import { Base_linter } from "./base_linter";
import * as common from "./common";
import * as path_lib from "path";

export class Vivado extends Base_linter {
    binary = "";
    extra_cmd = "-nolog";

    constructor() {
        super();
    }

    public set_binary(file: string) {
        const file_lang = get_language_from_filepath(file);
        let binary = "";
        let extra_cmd = "--sv";
        if (file_lang === LANGUAGE.VHDL) {
            binary = "xvhdl";
            extra_cmd = ""; 
        }
        else if (file_lang === LANGUAGE.SYSTEMVERILOG) {
            binary = "xvlog";
        }
        else {
            binary = "xvlog";
        }
        this.binary = binary;
        this.extra_cmd += " " + extra_cmd;
    }

    async delete_previus_lint(working_dir: string) {
        const file_list_to_delte = ["xvhdl.pb", "xvhdl.log", "xvlog.pb", "xvlog.log", "xsim.dir"];
        file_list_to_delte.forEach(element => {
            const full_path = path_lib.join(working_dir, element);
            rm_sync(full_path, true);
        });
    }

    async lint(file: string, options: common.l_options): Promise<common.l_error[]> {
        this.set_binary(file);
        const result = await this.exec_linter(file, options);
        file = file.replace(/\\ /g, ' ');
        const errors_str = result.stdout;
        const errors = this.parse_output(errors_str, file);

        return errors;
    }

    parse_output(output: string, file: string) {
        const errors_str_lines = output.split(/\r?\n/g);
        const errors: common.l_error[] = [];
        errors_str_lines.forEach((line) => {
            const tokens = line.split(/:?\s*(?:\[|\])\s*/).filter(Boolean);
            if (tokens.length < 4
                || tokens[0] !== "ERROR"
                || !tokens[1].startsWith("VRFC")) {
                return;
            }

            // Get filename and line number
            const [, lineno_str] = tokens[3].split(/:(\d+)/);
            const lineno = parseInt(lineno_str) - 1;

            const error: common.l_error = {
                severity: common.LINTER_ERROR_SEVERITY.ERROR,
                description: tokens[2],
                code: tokens[1],
                location: {
                    file: file,
                    position: [lineno, 0]
                }
            };

            errors.push(error);
        });

        return errors;
    }
}
