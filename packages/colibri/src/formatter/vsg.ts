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

const fs = require("fs");
import { Base_formatter } from "./base_formatter";
import * as file_utils from "../utils/file_utils";
import * as utils from "../process/utils";
import { Process } from "../process/process";
import * as common from "./common";
import * as logger from "../logger/logger";
import * as cfg from "../config/config_declaration";

export class Vsg extends Base_formatter {
    private binary = 'vsg';

    constructor() {
        super();
    }

    async format_from_code(code: string, opt: cfg.e_formatter_svg): Promise<common.f_result> {
        const temp_file = await utils.create_temp_file(code);
        const formatted_code = await this.format(temp_file, opt);
        file_utils.remove_file(temp_file);
        return formatted_code;
    }

    public async format(file: string, opt: cfg.e_formatter_svg) {
        let command = `${this.binary} ${opt.aditional_arguments} -p ${opt.core_number} --fix -f ${file}`;
        if (opt.configuration !== ""){
            // eslint-disable-next-line max-len
            command = `${this.binary} ${opt.aditional_arguments} -p ${opt.core_number} --fix -c ${opt.configuration} -f ${file}`;
        }

        const P = new Process();
        const exec_result = await P.exec_wait(command);
        const code_formatted = fs.readFileSync(file, "utf8");

        const msg = `Formatting with command: ${command} `;
        logger.Logger.log(msg, logger.T_SEVERITY.INFO);

        const result: common.f_result = {
            code_formatted: code_formatted,
            command: command,
            successful: true,
            message: exec_result.stderr,
        };
        return result;
    }
}
