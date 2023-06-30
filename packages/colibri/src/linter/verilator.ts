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

import { get_language } from "../common/utils";
import { HDL_LANG } from "../common/general";
import { Base_linter } from "./base_linter";
import * as common from "./common";

export class Verilator extends Base_linter {
    binary = "verilator";
    extra_cmd = "--lint-only -Wall -bbox-sys --bbox-unsup -DGLBL";

    sv_options = "-sv";

    constructor() {
        super();
    }

    delete_previus_lint() {
        return true;
    }

    async lint(file: string, options: common.l_options): Promise<common.l_error[]> {
        const file_lang = get_language(file);
        if (file_lang === HDL_LANG.SYSTEMVERILOG) {
            options.argument += ` ${this.sv_options} `;
        }
        const result = await this.exec_linter(file, options);
        return this.parse_output(result.stderr, file);
    }

    split_terms(line: string) {
        const terms = line.split(':');
        for (let i = 0; i < terms.length; i++) {
            if (terms[i] === ' ') {
                terms.splice(i, 1);
                i--;
            }
            else {
                terms[i] = terms[i].trim();
            }
        }
        return terms;
    }

    get_severity(severity_string: string): common.LINTER_ERROR_SEVERITY {
        let severity = common.LINTER_ERROR_SEVERITY.INFO;
        if (severity_string.startsWith('Error')) {
            severity = common.LINTER_ERROR_SEVERITY.ERROR;
        }
        else if (severity_string.startsWith('Warning')) {
            severity = common.LINTER_ERROR_SEVERITY.WARNING;
        }
        return severity;
    }

    parse_output(output: string, file: string): common.l_error[] {
        const file_split_space = file.split('\\ ')[0];
        const errors_str_lines = output.split(/\r?\n/g);
        const errors: common.l_error[] = [];
        // Parse output lines
        errors_str_lines.forEach((line) => {
            if (line.startsWith('%')) {
                // remove the %
                line = line.slice(1);

                // was it for a submodule
                if (line.search(file_split_space) > 0) {
                    // remove the filename
                    line = line.replace(file_split_space, '');
                    line = line.replace(/\s+/g, ' ').trim();

                    const terms = this.split_terms(line);
                    const severity = this.get_severity(terms[0]);
                    const message = terms.slice(2).join(' ');
                    const lineNum = parseInt(terms[1].trim()) - 1;

                    if (!isNaN(lineNum)) {
                        const error: common.l_error = {
                            severity: severity,
                            code: '',
                            description: message,
                            location: {
                                file: file.replace(/\\ /g, ' '),
                                position: [lineNum, 0]
                            }
                        };
                        errors.push(error);
                    }
                }
            }
        });
        return errors;
    }
}