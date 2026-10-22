import { ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
    e_tools_nextpnr_target_family,
    e_tools_yosys_synthesis_target,
    get_default_config
} from '../../../../src/colibri/config/config_declaration';
import { LoggerBase } from '../../../../src/colibri/logger/logger';
import { p_result } from '../../../../src/colibri/process/common';
import { t_project_definition } from '../../../../src/colibri/project_manager/project_definition';
import * as commandBuilder from '../../../../src/colibri/project_manager/tool/nextpnr/commandBuilder';
import * as executor from '../../../../src/colibri/project_manager/tool/nextpnr/executor';
import * as nextpnrUtils from '../../../../src/colibri/project_manager/tool/nextpnr/utils';
import {
    runNextpnrGui,
    runNextpnrPnR,
    runNextpnrReport
} from '../../../../src/colibri/project_manager/tool/nextpnr/tasks';

describe('nextpnr tasks', () => {
    let tempDirectory: string;
    let project: t_project_definition;
    let callback: jest.Mock;
    let childProcess: ChildProcess;

    beforeEach(() => {
        tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'teroshdl-nextpnr-tasks-'));
        const config = get_default_config();
        config.tools.nextpnr.target_family = e_tools_nextpnr_target_family.ice40;
        config.tools.yosys.synthesis_target = e_tools_yosys_synthesis_target.ice40;
        config.tools.yosys.ice40_output_json = 'synthesis/netlist.json';
        fs.mkdirSync(path.join(tempDirectory, 'synthesis'));
        fs.writeFileSync(path.join(tempDirectory, 'synthesis/netlist.json'), '{"modules":{}}');

        project = {
            project_disk_path: tempDirectory,
            config
        } as t_project_definition;
        callback = jest.fn();
        childProcess = { pid: 4242 } as ChildProcess;

        jest.spyOn(commandBuilder, 'buildNextpnrArgs').mockReturnValue(['--json', 'input.json', '--asc', 'out.asc']);
        jest.spyOn(executor, 'executeCommand').mockReturnValue(childProcess);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        fs.rmSync(tempDirectory, { recursive: true, force: true });
    });

    it('resolves configured Yosys JSON relative to project, builds P&R args and executes', () => {
        const logger = { appendLine: jest.fn() } as unknown as LoggerBase;
        const result = runNextpnrPnR(project, callback, logger);
        const jsonPath = path.join(tempDirectory, 'synthesis/netlist.json');
        const outputPath = path.join(tempDirectory, 'nextpnr_out.asc');

        expect(nextpnrUtils.validateJsonFile(jsonPath)).toEqual({ valid: true });
        expect(commandBuilder.buildNextpnrArgs).toHaveBeenCalledWith(
            project.config.tools.nextpnr,
            jsonPath,
            outputPath,
            { reportFile: 'nextpnr_report.json' }
        );
        expect(executor.executeCommand).toHaveBeenCalledWith(
            project.config.tools.nextpnr,
            ['--json', 'input.json', '--asc', 'out.asc'],
            tempDirectory,
            callback,
            logger
        );
        expect(result).toBe(childProcess);
    });

    it('reports a missing Yosys JSON output with an instruction to run synthesis', (done) => {
        project.config.tools.yosys.ice40_output_json = 'missing.json';
        const logger = { appendLine: jest.fn() } as unknown as LoggerBase;

        const result = runNextpnrPnR(project, (processResult: p_result) => {
            expect(processResult.successful).toBe(false);
            expect(processResult.return_value).toBe(1);
            expect(processResult.command).toBe('nextpnr P&R');
            expect(processResult.stderr).toContain('run Yosys synthesis before nextpnr');
            expect(logger.appendLine).toHaveBeenCalledWith(`[nextpnr] Error: ${processResult.stderr}`);
            expect(executor.executeCommand).not.toHaveBeenCalled();
            done();
        }, logger);

        expect(result).toEqual({});
    });

    it('reports an unset Yosys JSON output path without inventing one', (done) => {
        project.config.tools.yosys.ice40_output_json = '';

        runNextpnrPnR(project, (processResult: p_result) => {
            expect(processResult.successful).toBe(false);
            expect(processResult.return_value).toBe(1);
            expect(processResult.command).toBe('nextpnr P&R');
            expect(processResult.stderr).toContain('ice40_output_json');
            expect(processResult.stderr).toContain('run Yosys synthesis before nextpnr');
            expect(executor.executeCommand).not.toHaveBeenCalled();
            done();
        });
    });

    it('reports a mismatch between Yosys synthesis target and nextpnr family', (done) => {
        project.config.tools.nextpnr.target_family = e_tools_nextpnr_target_family.ecp5;

        runNextpnrPnR(project, (processResult: p_result) => {
            expect(processResult.successful).toBe(false);
            expect(processResult.return_value).toBe(1);
            expect(processResult.command).toBe('nextpnr P&R');
            expect(processResult.stderr).toContain('does not match');
            expect(executor.executeCommand).not.toHaveBeenCalled();
            done();
        });
    });

    it('rejects malformed Yosys JSON before starting nextpnr', (done) => {
        const jsonPath = path.join(tempDirectory, 'synthesis/netlist.json');
        fs.writeFileSync(jsonPath, '{invalid json}');

        runNextpnrPnR(project, (processResult: p_result) => {
            expect(processResult.successful).toBe(false);
            expect(processResult.return_value).toBe(1);
            expect(processResult.command).toBe('nextpnr P&R');
            expect(processResult.stderr).toContain('invalid JSON');
            expect(processResult.stderr).toContain('run Yosys synthesis before nextpnr');
            expect(executor.executeCommand).not.toHaveBeenCalled();
            done();
        });
    });

    it('requests GUI mode and the report when the GUI task is run', () => {
        const logger = { appendLine: jest.fn() } as unknown as LoggerBase;
        const result = runNextpnrGui(project, logger, callback);
        const outputPath = path.join(tempDirectory, 'nextpnr_out.asc');

        expect(commandBuilder.buildNextpnrArgs).toHaveBeenCalledWith(
            project.config.tools.nextpnr,
            path.join(tempDirectory, 'synthesis/netlist.json'),
            outputPath,
            { gui: true, reportFile: 'nextpnr_report.json' }
        );
        expect(result).toBe(childProcess);
    });

    it('reports a clear message when the nextpnr binary has no Qt GUI support', () => {
        const logger = { appendLine: jest.fn() } as unknown as LoggerBase;
        const processResult: p_result = {
            command: 'nextpnr-ice40',
            stdout: '',
            stderr: 'GUI support not enabled in this build',
            return_value: 1,
            successful: false
        };
        jest.mocked(executor.executeCommand).mockImplementation(
            (_config, _args, _cwd, executeCallback) => {
                executeCallback(processResult);
                return childProcess;
            }
        );

        runNextpnrGui(project, logger, callback);

        expect(callback).toHaveBeenCalledWith({
            ...processResult,
            stderr: 'This nextpnr binary has no GUI (Qt) support.'
        });
        expect(logger.appendLine).toHaveBeenCalledWith(
            '[nextpnr] Error: This nextpnr binary has no GUI (Qt) support.'
        );
    });

    describe('runNextpnrReport', () => {
        it('returns the generated report JSON for the frontend', (done) => {
            const report = JSON.stringify({ utilization: {}, fmax: {} });
            fs.writeFileSync(path.join(tempDirectory, 'nextpnr_report.json'), report);

            const result = runNextpnrReport(project, (processResult: p_result) => {
                expect(processResult).toMatchObject({
                    command: 'nextpnr report',
                    stdout: report,
                    stderr: '',
                    return_value: 0,
                    successful: true
                });
                done();
            });

            expect(result).toEqual({});
        });

        it('reports a missing generated report clearly', (done) => {
            runNextpnrReport(project, (processResult: p_result) => {
                expect(processResult.successful).toBe(false);
                expect(processResult.return_value).toBe(1);
                expect(processResult.stderr).toContain('Run Place & Route');
                done();
            });
        });

        it('rejects report JSON without the expected sections', (done) => {
            fs.writeFileSync(path.join(tempDirectory, 'nextpnr_report.json'), '{"unexpected":true}');

            runNextpnrReport(project, (processResult: p_result) => {
                expect(processResult.successful).toBe(false);
                expect(processResult.stderr).toContain('missing utilization or fmax');
                done();
            });
        });
    });
});