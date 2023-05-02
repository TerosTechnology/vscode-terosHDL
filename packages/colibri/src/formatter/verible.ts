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
import { Process } from "../process/process";
import * as common from "./common";
import * as logger from "../logger/logger";

export class Verible extends Base_formatter {
    private binary = 'verible-verilog-format';

    constructor() {
        super();
    }

    async format_from_code(code: string, opt: common.e_formatter_verible_full): Promise<common.f_result> {
        const temp_file = await utils.create_temp_file(code);
        const formatted_code = await this.format(temp_file, opt);
        file_utils.remove_file(temp_file);
        return formatted_code;
    }

    private async get_path(f_path: string): Promise<string> {
        const path_checker = [f_path, path_lib.join(f_path, this.binary),
            path_lib.join(f_path, this.binary + '.exe'),
            this.binary, this.binary + '.exe'];

        const P = new Process();
        for (const path_inst of path_checker) {
            const cmd = `${path_inst} --version`;
            const exec_result = await P.exec_wait(cmd);
            if (exec_result.successful === true) {
                return path_inst;
            }
        }
        return '';
    }

    public async format(file: string, opt: common.e_formatter_verible_full) {
        const path_bin = await this.get_path(opt.path);
        const command = `${path_bin} ${opt.format_args} ${file}`;

        const P = new Process();
        const exec_result = await P.exec_wait(command);
        let code_formatted = fs.readFileSync(file, "utf8");
        if (exec_result.successful === true){
            code_formatted = exec_result.stdout;
        }

        const msg = `Formatting with command: ${command} `;
        logger.Logger.log(msg, logger.T_SEVERITY.INFO);

        const result: common.f_result = {
            code_formatted: code_formatted,
            command: command,
            successful: exec_result.successful,
            message: exec_result.stderr,
        };
        return result;
    }
}
