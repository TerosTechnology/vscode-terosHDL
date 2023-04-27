import { p_result, p_options } from "./common";

export class Local_process {

    async exec_wait(command: string, opt: p_options) {
        const exec = require("child_process").exec;
        return new Promise((resolve) => {
            exec(command, opt, (error: number, stdout: string, stderr: string) => {
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

    exec(command: string, opt: p_options, callback: (result: p_result) => void) {
        const exec_c = require("child_process").exec;
        const exec_i = exec_c(command, opt, (error: number, stdout: string, stderr: string) => {
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