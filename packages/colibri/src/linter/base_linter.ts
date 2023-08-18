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

import { create_temp_file } from "../process/utils";
import { Process } from "../process/process";
import { p_options } from "../process/common";
import * as common from "./common";
import { check_if_path_exist, normalize_path, get_directory } from "../utils/file_utils";
import * as path_lib from "path";
import * as logger from "../logger/logger";
import { t_file } from "../project_manager/common";

export abstract class Base_linter {
    abstract binary: string;
    abstract extra_cmd: string;

    parse_output(_result: string, _file: string): common.l_error[] {
        const errors: common.l_error[] = [];
        return errors;
    }

    async lint_from_file(file: string, options: common.l_options) {
        const errors = await this.lint(file, options);
        return errors;
    }

    async lint_from_code(code: string, options: common.l_options) {
        const temp_file = await create_temp_file(code);
        const errors = await this.lint(temp_file, options);
        return errors;
    }

    get_command(file: string, options: common.l_options) {
        let complete_path = '';
        if (options.path === '') {
            complete_path = this.binary;
        }
        else {
            // Unix path
            const unix_path = path_lib.join(options.path, this.binary);
            // Windows path
            const windows_path = path_lib.join(options.path, this.binary + ".exe");

            if (check_if_path_exist(windows_path)) {
                complete_path = windows_path;
            }
            else {
                complete_path = unix_path;
            }
        }
        const norm_bin = normalize_path(complete_path);
        const command = `${norm_bin} ${this.extra_cmd} ${options.argument} "${file}"`;
        return command;
    }

    async exec_linter(file: string, options: common.l_options) {
        const file_dir = get_directory(file);
        await this.delete_previus_lint(file_dir);

        const command = this.get_command(file, options);
        
        const msg = `Linting with command: ${command} `;
        logger.Logger.log(msg, logger.T_SEVERITY.INFO);
        
        const P = new Process();
        const opt: p_options = {
            cwd: file_dir,
        };
        const result = await P.exec_wait(command, opt);

        await this.delete_previus_lint(file_dir);
        return result;
    }

    abstract lint(file: string, options: common.l_options): Promise<common.l_error[]>;

    abstract delete_previus_lint(working_dir: string): void;

    public async lint_from_project(file_path: string, _prj_file_list: t_file[],
        options: common.l_options): Promise<common.l_error[]> {
        return await this.lint_from_file(file_path, options);
    }
}

