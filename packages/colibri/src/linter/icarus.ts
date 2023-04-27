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

import { Base_linter } from "./base_linter";
import * as common from "./common";

export class Icarus extends Base_linter {
    binary_linux = "iverilog -Wall";
    binary_mac = "iverilog -Wall";
    binary_windows = "iverilog.exe -Wall";

    constructor() {
        super();
    }

    delete_previus_lint() {
        return true;
    }

    async lint(file: string, options: common.l_options): Promise<common.l_error[]> {
        const result = await this.exec_linter(file, options);
        return this.parse_output(result.stderr, file)
    }

    parse_output(output: string, file: string): common.l_error[] {
        try {
            file = file.replace('\\ ', ' ');
            const errors_str = output;
            const errors_str_lines = errors_str.split(/\r?\n/g);
            const errors: common.l_error[] = [];
            errors_str_lines.forEach((line) => {
                if (line.startsWith(file)) {
                    line = line.replace(file, '');
                    const terms = line.split(':');
                    const lineNum = parseInt(terms[1].trim()) - 1;
                    if (terms.length === 3) {
                        const error: common.l_error = {
                            severity: common.LINTER_ERROR_SEVERITY.ERROR,
                            code: '',
                            description: terms[2].trim(),
                            location: {
                                file: file,
                                position: [lineNum, 0]
                            }
                        };

                        errors.push(error);
                    }
                    else if (terms.length >= 4) {
                        let sev;
                        if (terms[2].trim() === 'error') {
                            sev = common.LINTER_ERROR_SEVERITY.ERROR;
                        }
                        else if (terms[2].trim() === 'warning') {
                            sev = common.LINTER_ERROR_SEVERITY.WARNING;
                        }
                        else {
                            sev = common.LINTER_ERROR_SEVERITY.INFO;
                        }

                        const error: common.l_error = {
                            severity: sev,
                            description: terms[3].trim(),
                            code: '',
                            location: {
                                file: file,
                                position: [lineNum, 0]
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