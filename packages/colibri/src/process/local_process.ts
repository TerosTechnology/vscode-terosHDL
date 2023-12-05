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

import { p_result, p_options } from "./common";
import { ChildProcess, ExecException, exec } from "child_process";

export class Local_process {

    async exec_wait(command: string, opt: p_options) {
        return new Promise((resolve) => {
            const options = {
                cwd: opt.cwd,
                maxBuffer: 1024 * 1024 * 1024
            };
            exec(command, options, (error: ExecException | null, stdout: string, stderr: string) => {
                let error_code = 0;
                let successful = true;
                if (error !== undefined && error !== null) {
                    error_code = -1;
                    successful = false;
                }

                const result: p_result = {
                    command: command,
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                    return_value: error_code,
                    successful: successful
                };

                resolve(result);
            });
        });
    }

    exec(command: string, opt: p_options, callback: (result: p_result) => void) : ChildProcess{
        const exec_i = exec(command, opt, (error: ExecException | null, stdout: string, stderr: string) => {
            let error_code = 0;
            let successful = true;
            if (error !== undefined && error !== null) {
                error_code = -1;
                successful = false;
            }

            const result: p_result = {
                command: command,
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                return_value: error_code,
                successful: successful
            };
            callback(result);
        });
        return exec_i;
    }
}