import { ChildProcess } from 'child_process';
import * as path from 'path';
import { Process } from 'colibri/process/process';
import { p_result } from 'colibri/process/common';
import * as file_utils from 'colibri/utils/file_utils';
import { quoteArgs, t_openfpgaloader_config } from './utils';

export function getBinary(config: t_openfpgaloader_config): string {
    const installationPath = config.installation_path?.trim() ?? '';
    if (installationPath !== '') {
        const fullPath = path.join(installationPath, 'openFPGALoader');
        if (file_utils.check_if_path_exist(fullPath)) {
            return fullPath;
        }
        const exePath = `${fullPath}.exe`;
        if (file_utils.check_if_path_exist(exePath)) {
            return exePath;
        }
    }
    return 'openFPGALoader';
}

export function executeCommand(
    config: t_openfpgaloader_config,
    args: string[],
    cwd: string,
    callback: (result: p_result) => void
): ChildProcess {
    const proc = new Process();
    const binary = getBinary(config);
    const command = `${quoteArgs([binary])} ${quoteArgs(args)}`.trim();
    return proc.exec(command, { cwd }, callback);
}

export async function executeCommandWait(
    config: t_openfpgaloader_config,
    args: string[],
    cwd: string,
    timeoutSeconds?: number
): Promise<p_result> {
    const proc = new Process();
    const binary = getBinary(config);
    const command = `${quoteArgs([binary])} ${quoteArgs(args)}`.trim();
    return proc.exec_wait(command, { cwd, timeout: timeoutSeconds });
}
