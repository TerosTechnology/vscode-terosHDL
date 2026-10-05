import * as path from 'path';
import { ChildProcess } from 'child_process';
import * as file_utils from '../../../utils/file_utils';
import { Process } from '../../../process/process';
import { p_result } from '../../../process/common';

export type e_nextpnr_target_family = 'ice40' | 'ecp5' | 'generic';

export type t_nextpnr_executor_config = {
    installation_path?: string;
    target_family?: e_nextpnr_target_family;
};

export function quoteArgs(args: string[]): string[] {
    return args.map((arg) => {
        if (arg.includes(' ')) {
            return `"${arg}"`;
        }
        return arg;
    });
}

export function getBinary(config: t_nextpnr_executor_config): string {
    const suffix = config.target_family === 'ice40' ? 'ice40' :
                   config.target_family === 'ecp5' ? 'ecp5' : 'generic';
    const binaryName = `nextpnr-${suffix}`;
    if (config.installation_path?.trim()) {
        const fullPath = path.join(config.installation_path, binaryName);
        if (file_utils.check_if_path_exist(fullPath)) {
            return fullPath;
        }
        const exePath = fullPath + '.exe';
        if (file_utils.check_if_path_exist(exePath)) {
            return exePath;
        }
    }
    return binaryName;
}

export function executeCommand(
    config: t_nextpnr_executor_config,
    args: string[],
    cwd: string,
    callback: (result: p_result) => void
): ChildProcess {
    const process = new Process();
    const binary = getBinary(config);
    const command = [binary, ...quoteArgs(args)].join(' ');
    return process.exec(command, { cwd }, callback);
}

