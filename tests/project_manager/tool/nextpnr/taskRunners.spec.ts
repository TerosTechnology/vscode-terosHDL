import { ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { e_taskType } from '../../../../src/colibri/project_manager/tool/common';
import { t_project_definition } from '../../../../src/colibri/project_manager/project_definition';
import { p_result } from '../../../../src/colibri/process/common';
import { LoggerBase } from '../../../../src/colibri/logger/logger';
import * as nextpnrTasks from '../../../../src/colibri/project_manager/tool/nextpnr/tasks';
import { runTaskNextpnr } from '../../../../src/colibri/project_manager/tool/nextpnr/taskRunners';

jest.mock('../../../../src/colibri/project_manager/tool/nextpnr/tasks', () => ({
    runNextpnrPnR: jest.fn()
}));

describe('nextpnr task runner', () => {
    let tempDirectory: string;
    let projectDefinition: t_project_definition;
    const callback = jest.fn<void, [p_result]>();
    const childProcess = { pid: 2468 } as ChildProcess;
    const toolLogger = { appendLine: jest.fn() } as unknown as LoggerBase;

    beforeEach(() => {
        tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'teroshdl-nextpnr-runner-'));
        projectDefinition = {
            project_disk_path: tempDirectory,
            config: { tools: { nextpnr: {}, yosys: {} } }
        } as t_project_definition;
        jest.clearAllMocks();
    });

    afterEach(() => {
        fs.rmSync(tempDirectory, { recursive: true, force: true });
    });

    it('dispatches NEXTPNR_PNR and returns the process from the task', () => {
        jest.mocked(nextpnrTasks.runNextpnrPnR).mockReturnValue(childProcess);

        const result = runTaskNextpnr(e_taskType.NEXTPNR_PNR, projectDefinition, callback, toolLogger);

        expect(nextpnrTasks.runNextpnrPnR).toHaveBeenCalledWith(projectDefinition, callback, toolLogger);
        expect(result).toBe(childProcess);
    });

    it('reports unsupported task types asynchronously without returning a fake process', (done) => {
        const result = runTaskNextpnr(e_taskType.GHDL_ANALYZE, projectDefinition, (processResult) => {
            expect(processResult).toEqual({
                command: '',
                stdout: '',
                stderr: `Unsupported nextpnr task type: ${e_taskType.GHDL_ANALYZE}`,
                return_value: 1,
                successful: false
            });
            done();
        }, toolLogger);

        expect(result).toBeUndefined();
        expect(toolLogger.appendLine).toHaveBeenCalledWith(
            `[nextpnr] Error: Unsupported nextpnr task type: ${e_taskType.GHDL_ANALYZE}`
        );
        expect(nextpnrTasks.runNextpnrPnR).not.toHaveBeenCalled();
    });
});