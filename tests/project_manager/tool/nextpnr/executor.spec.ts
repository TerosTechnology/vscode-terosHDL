import { ChildProcess } from 'child_process';
import * as path from 'path';
import * as file_utils from '../../../../src/colibri/utils/file_utils';
import { OS } from '../../../../src/colibri/process/common';
import * as process_utils from '../../../../src/colibri/process/utils';
import { Process } from '../../../../src/colibri/process/process';
import { LoggerBase } from '../../../../src/colibri/logger/logger';
import { get_default_config, e_tools_nextpnr_target_family } from '../../../../src/colibri/config/config_declaration';
import { executeCommand, getBinary, quoteArgs } from '../../../../src/colibri/project_manager/tool/nextpnr/executor';

describe('nextpnr Executor', () => {
    const baseConfig = () => get_default_config().tools.nextpnr;

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getBinary', () => {
        it.each([
            [e_tools_nextpnr_target_family.ice40, 'nextpnr-ice40'],
            [e_tools_nextpnr_target_family.ecp5, 'nextpnr-ecp5'],
            [e_tools_nextpnr_target_family.generic, 'nextpnr-generic'],
        ])('uses the PATH executable for %s when no installation directory is set', (family, binary) => {
            const exists = jest.spyOn(file_utils, 'check_if_path_exist');
            expect(getBinary({ target_family: family })).toBe(binary);
            expect(exists).not.toHaveBeenCalled();
        });

        it('resolves the architecture binary inside installation_path', () => {
            const installationPath = path.join('/tools directory', 'nextpnr');
            const binaryPath = path.join(installationPath, 'nextpnr-ecp5');
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.LINUX);
            jest.spyOn(file_utils, 'check_if_path_exist').mockImplementation(candidate => candidate === binaryPath);

            expect(getBinary({
                installation_path: installationPath,
                target_family: e_tools_nextpnr_target_family.ecp5
            })).toBe(binaryPath);
        });

        it('uses the .exe binary on Windows when it exists', () => {
            const installationPath = path.join('/tools directory', 'nextpnr');
            const exePath = path.join(installationPath, 'nextpnr-ice40.exe');
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.WINDOWS);
            jest.spyOn(file_utils, 'check_if_path_exist').mockImplementation(candidate => candidate === exePath);

            expect(getBinary({
                installation_path: installationPath,
                target_family: e_tools_nextpnr_target_family.ice40
            })).toBe(exePath);
        });

        it('falls back to PATH if the configured directory has no executable', () => {
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.LINUX);
            jest.spyOn(file_utils, 'check_if_path_exist').mockReturnValue(false);

            expect(getBinary({
                installation_path: '/missing/tools',
                target_family: e_tools_nextpnr_target_family.generic
            })).toBe('nextpnr-generic');
        });

        it('rejects an unsupported target family instead of choosing generic', () => {
            expect(() => getBinary({ target_family: 'unknown' as e_tools_nextpnr_target_family }))
                .toThrow('Unsupported nextpnr target family');
        });
    });

    describe('quoteArgs', () => {
        it('quotes all POSIX arguments and preserves spaces and apostrophes', () => {
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.LINUX);
            expect(quoteArgs(['--json', 'path with spaces/design.json', "it's.asc"]))
                .toEqual(["'--json'", "'path with spaces/design.json'", "'it'\\''s.asc'"]);
        });

        it('escapes embedded quotes using Windows command-line rules', () => {
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.WINDOWS);
            expect(quoteArgs(['path with spaces/board "A".json']))
                .toEqual(['"path with spaces/board \\\"A\\\".json"']);
        });
    });

    describe('executeCommand', () => {
        it('uses Process.exec with cwd, safely quoted paths, and returns its ChildProcess', () => {
            const childProcess = { pid: 12345 } as ChildProcess;
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.LINUX);
            const exec = jest.spyOn(Process.prototype, 'exec').mockReturnValue(childProcess);
            const callback = jest.fn();
            const cwd = '/project directory';
            const args = ['--json', '/project directory/input design.json'];

            const result = executeCommand({
                ...baseConfig(),
                installation_path: '',
                target_family: e_tools_nextpnr_target_family.ice40
            }, args, cwd, callback);

            expect(result).toBe(childProcess);
            expect(exec).toHaveBeenCalledWith(
                "'nextpnr-ice40' '--json' '/project directory/input design.json'",
                { cwd },
                callback
            );
        });

        it('logs the fully resolved command before launching the process', () => {
            const childProcess = { pid: 12345 } as ChildProcess;
            const logger = { appendLine: jest.fn() } as unknown as LoggerBase;
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.LINUX);
            jest.spyOn(Process.prototype, 'exec').mockReturnValue(childProcess);

            executeCommand({
                ...baseConfig(),
                installation_path: '',
                target_family: e_tools_nextpnr_target_family.ecp5
            }, ['--json', 'design.json', '--textcfg', 'design.config'], '/project', jest.fn(), logger);

            expect(logger.appendLine).toHaveBeenCalledWith(
                "[nextpnr] Executing command: 'nextpnr-ecp5' '--json' 'design.json' '--textcfg' 'design.config'"
            );
        });

        it('quotes an executable path containing spaces', () => {
            const childProcess = { pid: 12345 } as ChildProcess;
            const installationPath = '/tools for fpga/nextpnr';
            const binaryPath = path.join(installationPath, 'nextpnr-ecp5');
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.LINUX);
            jest.spyOn(file_utils, 'check_if_path_exist').mockImplementation(candidate => candidate === binaryPath);
            const exec = jest.spyOn(Process.prototype, 'exec').mockReturnValue(childProcess);

            executeCommand({
                ...baseConfig(),
                installation_path: installationPath,
                target_family: e_tools_nextpnr_target_family.ecp5
            }, ['--textcfg', 'output.config'], '/project', jest.fn());

            expect(exec).toHaveBeenCalledWith(
                "'/tools for fpga/nextpnr/nextpnr-ecp5' '--textcfg' 'output.config'",
                { cwd: '/project' },
                expect.any(Function)
            );
        });

        it('propagates a failed p_result to the callback without marking it successful', () => {
            const childProcess = { pid: 12345 } as ChildProcess;
            const failedResult = {
                command: 'nextpnr-ice40 --json input.json',
                stdout: '',
                stderr: 'invalid device',
                return_value: -1,
                successful: false,
            };
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.LINUX);
            jest.spyOn(Process.prototype, 'exec').mockImplementation((_command, _options, processCallback) => {
                processCallback(failedResult);
                return childProcess;
            });
            const callback = jest.fn();

            executeCommand({
                ...baseConfig(),
                installation_path: '',
                target_family: e_tools_nextpnr_target_family.ice40
            }, ['--json', 'input.json'], '/project', callback);

            expect(callback).toHaveBeenCalledWith(failedResult);
            expect(callback.mock.calls[0][0].successful).toBe(false);
        });

        it('does not swallow synchronous Process.exec errors', () => {
            jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.LINUX);
            jest.spyOn(Process.prototype, 'exec').mockImplementation(() => {
                throw new Error('process launch failed');
            });

            expect(() => executeCommand({
                ...baseConfig(),
                installation_path: '',
                target_family: e_tools_nextpnr_target_family.ice40
            }, ['--json', 'input.json'], '/project', jest.fn()))
                .toThrow('process launch failed');
        });
    });
});