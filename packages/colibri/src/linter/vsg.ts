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
import * as logger from "../logger/logger";
import { create_temp_file } from "../process/utils";
import { read_file_sync, remove_file } from "../utils/file_utils";
import { Process } from "../process/process";

export class Vsg extends Base_linter {
    binary = "vsg";
    extra_cmd = "";

    constructor() {
        super();
    }

    async delete_previus_lint() {
        return true;
    }

    async lint(file: string, options: common.l_options): Promise<common.l_error[]> {
        const temp_file_json = await create_temp_file("");
        const output_json = await this.vsg_exec(file, temp_file_json, options);
        let errors: common.l_error[] = [];
        if (output_json !== "") {
            errors = await this.parse_junit(file, output_json);
            remove_file(temp_file_json);
        }
        return errors;
    }

    private async parse_junit(file_path: string, junit_content: string) {
        try {
            const json = await JSON.parse(junit_content);
            const errors: common.l_error[] = [];
            if (json.files !== undefined && json.files[0] !== undefined && json.files[0].violations !== undefined) {
                const errors_json = json.files[0].violations;
                for (let i = 0; i < errors_json.length; ++i) {
                    const error: common.l_error = {
                        severity: common.LINTER_ERROR_SEVERITY.WARNING,
                        description: "[" + errors_json[i].rule + "] " + errors_json[i].solution,
                        code: errors_json[i].rule,
                        location: {
                            file: file_path,
                            position: [errors_json[i].linenumber - 1, 0]
                        }
                    };
                    errors.push(error);
                }
                return errors;
            } else {
                return errors;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            return [];
        }
    }

    private async vsg_exec(file_path: string, junit_file: string, options: common.l_options): Promise<string> {

        const code_file_normalized = file_path.replace(' ', '\\ ');
        const json_file_file_normalized = junit_file.replace(' ', '\\ ');

        let command = `vsg -f ${code_file_normalized} --all_phases --js ${json_file_file_normalized}`;
        if (options.argument !== ""){
            // eslint-disable-next-line max-len
            command = `vsg -f ${code_file_normalized} --all_phases -c ${options.argument} --js ${json_file_file_normalized}`;
        }

        const msg = `Linting with command: ${command} `;
        logger.Logger.log(msg, logger.T_SEVERITY.INFO);

        const P = new Process();
        await P.exec_wait(command);
        try {
            return read_file_sync(json_file_file_normalized);
        } catch (error) {
            return "";
        }
    }
}