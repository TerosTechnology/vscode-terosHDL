import * as path from 'path';
import { ChildProcess } from 'child_process';
import * as file_utils from '../../../utils/file_utils';
import { Process } from '../../../process/process';
import { p_result } from '../../../process/common';
import { OS } from '../../../process/common';
import { get_os } from '../../../process/utils';
import { e_tools_nextpnr, e_tools_nextpnr_target_family } from '../../../config/config_declaration';
import { LoggerBase } from '../../../logger/logger';

export type e_nextpnr_target_family = e_tools_nextpnr_target_family;
export type t_nextpnr_executor_config = Partial<Pick<e_tools_nextpnr, 'installation_path' | 'target_family'>>;

export function quoteArgs(args: string[]): string[] {
    return args.map(quoteArgument);
}

export function getBinary(config: t_nextpnr_executor_config): string {
    const family = config.target_family;
    const binaryByFamily: Record<e_tools_nextpnr_target_family, string> = {
        [e_tools_nextpnr_target_family.ice40]: 'nextpnr-ice40',
        [e_tools_nextpnr_target_family.ecp5]: 'nextpnr-ecp5',
        [e_tools_nextpnr_target_family.generic]: 'nextpnr-generic',
    };
    const binaryName = binaryByFamily[family];
    if (!binaryName) {
        throw new Error(`Unsupported nextpnr target family: ${family}`);
    }

    if (config.installation_path?.trim()) {
        const binaryNames = get_os() === OS.WINDOWS ? [`${binaryName}.exe`, binaryName] : [binaryName];
        for (const name of binaryNames) {
            const fullPath = path.join(config.installation_path, name);
            if (file_utils.check_if_path_exist(fullPath)) {
                return fullPath;
            }
        }
    }
    return binaryName;
}

export function executeCommand(
    config: t_nextpnr_executor_config,
    args: string[],
    cwd: string,
    callback: (result: p_result) => void,
    toolLogger?: LoggerBase
): ChildProcess {
    const binary = getBinary(config);
    const command = quoteArgs([binary, ...args]).join(' ');
    toolLogger?.appendLine(`[nextpnr] Executing command: ${command}`);
    const process = new Process();
    return process.exec(command, { cwd }, callback);
}

function quoteArgument(argument: string): string {
    if (get_os() === OS.WINDOWS) {
        return quoteWindowsArgument(argument);
    }

    // POSIX single-quote escaping preserves spaces and prevents shell expansion.
    return `'${argument.replace(/'/g, `'\\''`)}'`;
}

function quoteWindowsArgument(argument: string): string {
    // Escape according to Windows command-line quoting rules, including trailing backslashes.
    let quoted = '"';
    let backslashes = 0;
    for (const character of argument) {
        if (character === '\\') {
            backslashes += 1;
        } else if (character === '"') {
            quoted += `${'\\'.repeat(backslashes * 2 + 1)}"`;
            backslashes = 0;
        } else {
            quoted += `${'\\'.repeat(backslashes)}${character}`;
            backslashes = 0;
        }
    }
    return `${quoted}${'\\'.repeat(backslashes * 2)}"`;
}

