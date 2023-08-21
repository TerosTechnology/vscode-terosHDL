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

import { get_os } from "../process/utils";
import { Process } from "../process/process";
import { OS, p_options } from "../process/common";

import { get_hdl_language } from "../utils/common_utils";
import { HDL_LANG } from "../common/general";

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
        const file_lang = get_hdl_language(file);
        let binary = "";
        let extra_cmd = "--sv";
        if (file_lang === HDL_LANG.VHDL) {
            binary = "xvhdl";
            extra_cmd = ""; 
        }
        else if (file_lang === HDL_LANG.SYSTEMVERILOG) {
            binary = "xvlog";
        }
        else {
            binary = "xvlog";
        }
        this.binary = binary;
        this.extra_cmd += " " + extra_cmd;
    }

    async delete_previus_lint(working_dir: string) {
        const opt: p_options = {
            cwd: working_dir,
        };

        const os = get_os();
        const p = new Process();

        const path_0 = path_lib.join(working_dir, "xvhdl.pb");
        const path_1 = path_lib.join(working_dir, "xvhdl.log");

        const path_2 = path_lib.join(working_dir, "xvlog.pb");
        const path_3 = path_lib.join(working_dir, "xvlog.log");

        const path_4 = path_lib.join(working_dir, "xsim.dir");

        if (os === OS.WINDOWS) {
            // eslint-disable-next-line max-len
            const command = `del ${path_0} && del ${path_1} && del ${path_2} && del ${path_3} && del -Recurse ${path_4} && Remove-Item -Recurse -Path ${path_4} && rmdir /s /q ${path_4}`;
            await p.exec_wait(command, opt);
        }
        else {
            const command = `rm ${path_0}; rm ${path_1}; rm ${path_2}; rm ${path_3}; rm -R ${path_4}`;
            await p.exec_wait(command, opt);
        }
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
