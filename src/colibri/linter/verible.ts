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

import { Base_linter } from "./base_linter";
import * as common from "./common";

export class Verible extends Base_linter {
    binary = "verible-verilog-lint";
    extra_cmd = "";
    
    constructor() {
        super();
    }

    async delete_previus_lint() {
        return true;
    }

    async lint(file: string, options: common.l_options): Promise<common.l_error[]> {
        const result = await this.exec_linter(file, options);
        const output = result.stdout + '\n' + result.stderr;
        return this.parse_output(output, file);
    }

    parse_output(output: string, file: string): common.l_error[] {
        try {
            file = file.replace('\\ ', ' ');
            const errors_str_lines = output.split(/\r?\n/g);
            const errors: common.l_error[] = [];
            errors_str_lines.forEach((line) => {
                if (line.startsWith(file)) {
                    line = line.replace(file, '');
                    const terms = line.split(':');
                    const line_num = parseInt(terms[1].trim());
                    const column_num = parseInt(terms[2].trim());
                    if (terms.length === 3) {
                        const error: common.l_error = {
                            severity: common.LINTER_ERROR_SEVERITY.WARNING,
                            description: terms[3].trim(),
                            code: '',
                            location: {
                                file: file,
                                position: [line_num - 1, column_num - 1]
                            }
                        };
                        errors.push(error);
                    } else if (terms.length > 3) {
                        let message = "";
                        for (let x = 3; x < terms.length - 1; ++x) {
                            message += terms[x].trim() + ":";
                        }
                        message += terms[terms.length - 1].trim();
                        const error: common.l_error = {
                            severity: common.LINTER_ERROR_SEVERITY.WARNING,
                            description: message,
                            code: '',
                            location: {
                                file: file,
                                position: [line_num - 1, column_num - 1]
                            }
                        };
                        errors.push(error);
                    }
                }
            });
            return errors;
        } catch (error) {
            return [];
        }
    }
}