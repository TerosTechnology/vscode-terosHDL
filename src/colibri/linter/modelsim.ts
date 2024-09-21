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

import { get_language_from_filepath } from "../utils/file_utils";
import { LANGUAGE } from "../common/general";
import { Base_linter } from "./base_linter";
import * as common from "./common";
import { get_random_folder_in_home_directory } from "../process/utils";
import { remove_directory } from "../utils/file_utils";

export class Modelsim extends Base_linter {
    binary = "";
    extra_cmd = "";

    constructor() {
        super();
    }

    async delete_previus_lint() {
        return true;
    }

    set_binary(file: string): string {
        const work_directory = get_random_folder_in_home_directory();
        const file_lang = get_language_from_filepath(file);
        let extra_cmd = "";
        let binary = "";
        if (file_lang === LANGUAGE.VHDL) {
            binary = "vcom";
            extra_cmd = `-quiet -nologo -2008 -work ${work_directory}`;
        }
        else if (file_lang === LANGUAGE.SYSTEMVERILOG) {
            binary = "vlog";
            extra_cmd = `-quiet -nologo -sv -work ${work_directory}`;
        }
        else {
            binary = "vlog";
            extra_cmd = `-quiet -nologo -work ${work_directory}`;
        }
        this.binary = binary;
        this.extra_cmd = extra_cmd;
        return work_directory;
    }

    parse_output(output: string, file: string) {
        const errors_str_lines = output.split(/\r?\n/g);
        const errors: common.l_error[] = [];

        // Parse output lines
        errors_str_lines.forEach((line) => {
            if (line.startsWith('**')) {
                // eslint-disable-next-line max-len
                const regex_exp = /(Error|Warning).+?(?: *?(?:.+?(?:\\|\/))+.+?\((\d+?)\):|)(?: *?near "(.+?)":|)(?: *?\((.+?)\)|) +?(.+)/gm;
                // From https://github.com/dave2pi/SublimeLinter-contrib-vlog/blob/master/linter.py
                const m = regex_exp.exec(line);
                try {
                    //Severity
                    let sev = common.LINTER_ERROR_SEVERITY.WARNING;
                    if (m !== null && m[1].toLocaleLowerCase() === "error") {
                        sev = common.LINTER_ERROR_SEVERITY.ERROR;
                    }
                    else if (m !== null && m[1].toLocaleLowerCase() === "warning") {
                        sev = common.LINTER_ERROR_SEVERITY.WARNING;
                    }
                    else {
                        sev = common.LINTER_ERROR_SEVERITY.INFO;
                    }

                    if (sev !== common.LINTER_ERROR_SEVERITY.INFO) {
                        if (m !== null) {
                            const message = m[5];
                            let code = m[4];
                            const line = parseInt(m[2]) - 1;

                            if (code === undefined) {
                                code = '';
                            }

                            const error: common.l_error = {
                                severity: sev,
                                description: message,
                                code: code,
                                location: {
                                    file: file,
                                    position: [line, 0]
                                }
                            };
                            errors.push(error);
                        }

                    }
                }
                // eslint-disable-next-line no-empty
                catch (e) { }
            }
        });
        return errors;
    }

    async lint(file: string, options: common.l_options): Promise<common.l_error[]> {
        const work_directory = this.set_binary(file);
        const result = await this.exec_linter(file, options);

        file = file.replace(/\\ /g, ' ');
        const errors_str = result.stdout;
        const errors = this.parse_output(errors_str, file);
        // Remove work directory
        remove_directory(work_directory);
        return errors;
    }
}