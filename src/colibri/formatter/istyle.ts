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
const path_lib = require("path");
import { Base_formatter } from "./base_formatter";
import * as utils from "../process/utils";
import * as file_utils from "../utils/file_utils";
import { OS } from "../process/common";
import { Process } from "../process/process";
import * as common from "./common";
import * as cfg from "../config/config_declaration";
import * as logger from "../logger/logger";

export class Istyle extends Base_formatter {
    private binary_linux = 'istyle-linux';
    private binary_windows = 'istyle-win32.exe';
    private binary_mac = 'istyle-darwin';

    constructor() {
        super();
    }

    public async format_from_code(code: string, opt: cfg.e_formatter_istyle, python_path: string): Promise<common.f_result> {
        const temp_file = await utils.create_temp_file(code);
        const formatted_code = await this.format(temp_file, opt, python_path);
        file_utils.remove_file(temp_file);
        return formatted_code;
    }

    private get_binary(): string {
        const os = utils.get_os();
        if (os === OS.MAC) {
            return this.binary_mac;
        }
        else if (os === OS.LINUX) {
            return this.binary_linux;
        }
        else {
            return this.binary_windows;
        }
    }

    public async format(file: string, opt: cfg.e_formatter_istyle, _python_path: string) {
        const binary_name = this.get_binary();
        const path_bin = path_lib.join(__dirname, 'bin', 'svistyle', binary_name);
        const path_bin_norm = file_utils.normalize_path(path_bin);

        let command = "";
        if (opt.style === cfg.e_formatter_istyle_style.indent_only) {
            command = `${path_bin_norm} --style=ansi -s${opt.indentation_size} `;
        }
        else {
            command = `${path_bin_norm} --style=${opt.style} -s${opt.indentation_size} `;
        }
        command += `"${file}"`;

        const msg = `Formatting with command: ${command} `;
        logger.Logger.log(msg);

        const P = new Process();
        const exec_result = await P.exec_wait(command);
        const code_formatted = fs.readFileSync(file, "utf8");

        const result: common.f_result = {
            code_formatted: code_formatted,
            command: command,
            successful: exec_result.successful,
            message: exec_result.stderr,
        };

        return result;
    }
}
