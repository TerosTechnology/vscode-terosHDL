import { p_result } from 'colibri/process/common';
import { ChildProcess } from 'child_process';
import { e_tools_nvc } from 'colibri/config/config_declaration';
import { Process } from 'colibri/process/process';
import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as file_utils from 'colibri/utils/file_utils';

/**
 * Get NVC binary path from project configuration
 * Uses installation_path if configured, otherwise falls back to system path
 * @param config NVC configuration from project
 * @returns NVC binary path
 */
export function getBinary(config: e_tools_nvc): string {
    if (config.installation_path && config.installation_path.trim() !== '') {
        const nvcPath = path.join(config.installation_path, 'nvc');
        const nvcExePath = path.join(config.installation_path, 'nvc.exe');
        if (file_utils.check_if_path_exist(nvcExePath)) {
            return nvcExePath;
        }
        if (file_utils.check_if_path_exist(nvcPath)) {
            return nvcPath;
        }
    }
    // Fall back to system path
    return 'nvc';
}

/**
 * Resolve the absolute path of the nvc binary, following symlinks.
 * Returns null if nvc is not found or resolution fails.
 */
function resolveNvcBinaryPath(config: e_tools_nvc): string | null {
    try {
        const binary = getBinary(config);
        if (binary !== 'nvc') {
            return fs.realpathSync(binary);
        }
        // Resolve 'nvc' from PATH
        const result = child_process.spawnSync('which', ['nvc'], { encoding: 'utf8' });
        if (result.status === 0 && result.stdout.trim()) {
            return fs.realpathSync(result.stdout.trim());
        }
    } catch {
        // ignore
    }
    return null;
}

/**
 * Returns the -L arguments needed to locate NVC's own standard libraries
 * (std, ieee, nvc) when the installation prefix is non-standard.
 *
 * NVC looks for libraries in <prefix>/lib/nvc relative to its binary
 * (<prefix>/bin/nvc).  When that directory exists and is not already in
 * NVC's built-in search path the caller must supply -L explicitly.
 */
export function getNvcLibraryArgs(config: e_tools_nvc): string[] {
    const resolvedBinary = resolveNvcBinaryPath(config);
    if (!resolvedBinary) {
        return [];
    }

    // <prefix>/bin/nvc  →  <prefix>/lib/nvc
    const binDir = path.dirname(resolvedBinary);
    const prefix = path.dirname(binDir);
    const libDir = path.join(prefix, 'lib', 'nvc');

    if (fs.existsSync(libDir)) {
        return ['-L', libDir];
    }
    return [];
}

/**
 * Helper function to properly quote arguments that contain spaces
 * @param args Command arguments array
 * @returns Array of quoted arguments
 */
export function quoteArgs(args: string[]): string[] {
    return args.map((arg) => {
        if (arg.includes(' ')) {
            return `"${arg}"`;
        }
        return arg;
    });
}

/**
 * Helper function to execute a NVC command using Process class
 * @param config NVC configuration
 * @param args Command arguments array
 * @param cwd Working directory
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function executenvcCommand(
    config: e_tools_nvc,
    args: string[],
    cwd: string,
    callback: (result: p_result) => void
): ChildProcess {
    const libArgs = getNvcLibraryArgs(config);
    const quotedArgs = quoteArgs([...libArgs, ...args]);
    const nvcExecutable = getBinary(config);
    const command = `${nvcExecutable} ${quotedArgs.join(' ')}`;
    const process = new Process();
    const options = {
        cwd: cwd
    };

    return process.exec(command, options, callback);
}

/**
 * Helper function to execute a command using Process class (fallback for complex commands)
 * @param command Command to execute
 * @param cwd Working directory
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function executeCommand(command: string, cwd: string, callback: (result: p_result) => void): ChildProcess {
    const process = new Process();
    const options = {
        cwd: cwd
    };

    return process.exec(command, options, callback);

}

/**
 * Build a chained command string from multiple nvc commands
 * @param config nvc configuration
 * @param commandSpecs Array of command specifications
 * @returns Complete command string
 */
export function buildChainedCommand(
    config: e_tools_nvc,
    commandSpecs: Array<{ command: string; args: string[] }>
): string {
    const nvcExecutable = getBinary(config);
    const libArgs = getNvcLibraryArgs(config);

    const commands = commandSpecs.map((spec) => {
        const commandParts = spec.command.trim() === '' ? spec.args : [spec.command, ...spec.args];
        const quotedArgs = quoteArgs([...libArgs, ...commandParts]);
        return `${nvcExecutable} ${quotedArgs.join(' ')}`;
    });

    return commands.join(' && ');
}