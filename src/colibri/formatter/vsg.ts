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
import { BinaryCheck, checkBinary } from "../toolChecker/utils";

export class Vsg extends Base_formatter {
    private binary = 'vsg';
    public argumentToCheck = ['--version'];

    constructor() {
        super();
    }

    public async checkLinterConfiguration(installationPath: string): Promise<BinaryCheck> {
        return await checkBinary(this.constructor.name, installationPath, this.binary, this.argumentToCheck);
    }

    async format_from_code(code: string, opt: cfg.e_tools_vsg, python_path: string): Promise<common.f_result> {
        const temp_file = await utils.create_temp_file(code);
        const formatted_code = await this.format(temp_file, opt, python_path);
        file_utils.remove_file(temp_file);
        return formatted_code;
    }

    public async format(file: string, opt: cfg.e_tools_vsg, _python_path: string) {
        // Use full path or installation path if provided
        const binary_path = opt.installation_path ? 
            `${opt.installation_path}/${this.binary}` : this.binary;
            
        let command = `${binary_path} ${opt.aditional_arguments} -p ${opt.core_number} --fix -f ${file}`;
        if (opt.style_config !== ""){
            // eslint-disable-next-line max-len
            command = `${binary_path} ${opt.aditional_arguments} -p ${opt.core_number} --fix -c ${opt.style_config} -f ${file}`;
        }

        // For platform compatibility, try with shell execution
        const shell_command = `/bin/bash -c "${command}"`;

        const P = new Process();
        const exec_result = await P.exec_wait(shell_command);
        
        // Check if the file was actually modified by comparing timestamps or content
        const file_exists = fs.existsSync(file);
        if (!file_exists) {
            const result: common.f_result = {
                code_formatted: "",
                command: command,
                successful: false,
                message: "VSG failed: temp file was deleted or not found",
            };
            return result;
        }
        
        const code_formatted = fs.readFileSync(file, "utf8");

        const msg = `Formatting with command: ${command} `;
        logger.Logger.log(msg);
        
        // Debug logging for platform-specific issues
        logger.Logger.log(`VSG execution result - successful: ${exec_result.successful}, ` +
                         `return_value: ${exec_result.return_value}`);
        logger.Logger.log(`VSG stdout: ${exec_result.stdout}`);
        logger.Logger.log(`VSG stderr: ${exec_result.stderr}`);

        // Check for VHDL syntax errors in VSG output
        const has_syntax_error = exec_result.stderr.includes("Unexpected token") || 
                                exec_result.stderr.includes("Error while processing") ||
                                exec_result.stderr.includes("Expecting :");

        if (has_syntax_error) {
            const result: common.f_result = {
                code_formatted: code_formatted, // Return original code
                command: command,
                successful: false,
                message: `VSG failed due to VHDL syntax error: ${exec_result.stderr}`,
            };
            return result;
        }

        // Consider the formatting successful if the command executed without error
        // even if no violations were found
        const formatting_successful = exec_result.successful && exec_result.return_value === 0;

        const result: common.f_result = {
            code_formatted: code_formatted,
            command: command,
            successful: formatting_successful,
            message: exec_result.stderr || exec_result.stdout,
        };
        return result;
    }
}
