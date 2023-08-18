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

export class Ghdl extends Base_linter {
    binary = "ghdl";
    extra_cmd = "-s -fno-color-diagnostics";

    constructor() {
        super();
    }

    delete_previus_lint() {
        return true;
    }

    async lint(file: string, options: common.l_options): Promise<common.l_error[]> {
        const result = await this.exec_linter(file, options);
        return this.parse_output(result.stderr, file);
    }

    parse_output(output: string, file: string): common.l_error[] {
        try {
            const errors: common.l_error[] = [];
            file = file.replace(/\\ /g, ' ');
            const errors_str = output;

            // eslint-disable-next-line max-len
            const regex = /^(?<filename>.*):(?=\d)(?<line_number>\d+):(?<column_number>\d+):((?<is_warning>warning:)\s*|\s*)(?<error_message>.*)/gm;
            let m;
            while ((m = regex.exec(errors_str)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                const line = parseInt(<string>m.groups?.line_number.trim());
                const column = parseInt(<string>m.groups?.column_number.trim());
                let severity = common.LINTER_ERROR_SEVERITY.ERROR;
                if (m.groups?.is_warning !== undefined) {
                    severity = common.LINTER_ERROR_SEVERITY.WARNING;
                }

                const error: common.l_error = {
                    severity: severity,
                    description: <string>m.groups?.error_message.trim(),
                    code: '',
                    location: {
                        file: file,
                        position: [line - 1, column - 1]
                    }
                };

                errors.push(error);
            }
            return errors;
        } catch (error) {
            return [];
        }
    }
}