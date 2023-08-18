// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import { Local_process } from "./local_process";
import { Remote_process } from "./remote_process";
import { p_result, p_options, p_remote_configuration } from "./common";

export class Process {
    private p: Local_process | Remote_process | undefined;
    private DEFAULT_OPT: p_options = {
        cwd: ""
    };

    constructor(_remote_config?: p_remote_configuration) {
        this.p = new Local_process();
    }

    /**
     * Exec the command and wait for the result
     * @param command Command to execute
     * @param opt Options: cwd -> cmd working directory
     * @returns Result of the execution
    **/
    async exec_wait(command: string, opt?: p_options): Promise<p_result> {
        const opt_ins = (typeof opt === 'undefined') ? this.DEFAULT_OPT : opt;
        return <p_result>await this.p?.exec_wait(command, opt_ins);
    }

    /**
     * Exec the command
     * @param command Command to execute
     * @param opt Options: cwd -> cmd working directory
     * @param callback Callback function
     * @returns Result of the execution
    **/
    exec(command: string, opt: p_options | undefined, callback: (result: p_result) => void) {
        const opt_ins = (typeof opt === 'undefined') ? this.DEFAULT_OPT : opt;
        const exec_i = this.p?.exec(command, opt_ins, (result: p_result) => {
            callback(result);
        });
        return exec_i;
    }
}