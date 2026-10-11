import { ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { e_taskType } from '../../../../src/colibri/project_manager/tool/common';
import { t_project_definition } from '../../../../src/colibri/project_manager/project_definition';
import { p_result } from '../../../../src/colibri/process/common';
import * as nextpnrTasks from '../../../../src/colibri/project_manager/tool/nextpnr/tasks';
import { runTaskNextpnr } from '../../../../src/colibri/project_manager/tool/nextpnr/taskRunners';

jest.mock('../../../../src/colibri/project_manager/tool/nextpnr/tasks', () => ({
    runNextpnrPnR: jest.fn(),
    runNextpnrGui: jest.fn()
}));

describe('nextpnr task runner', () => {
    let tempDirectory: string;
    let projectDefinition: t_project_definition;
    const callback = jest.fn<void, [p_result]>();
    const childProcess = { pid: 2468 } as ChildProcess;

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

        const result = runTaskNextpnr(e_taskType.NEXTPNR_PNR, projectDefinition, callback);

        expect(nextpnrTasks.runNextpnrPnR).toHaveBeenCalledWith(projectDefinition, callback);
        expect(result).toBe(childProcess);
    });

    it('dispatches NEXTPNR_GUI and returns the process from the task', () => {
        jest.mocked(nextpnrTasks.runNextpnrGui).mockReturnValue(childProcess);

        const result = runTaskNextpnr(e_taskType.NEXTPNR_GUI, projectDefinition, callback);

        expect(nextpnrTasks.runNextpnrGui).toHaveBeenCalledWith(projectDefinition, callback);
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
        });

        expect(result).toBeUndefined();
        expect(nextpnrTasks.runNextpnrPnR).not.toHaveBeenCalled();
        expect(nextpnrTasks.runNextpnrGui).not.toHaveBeenCalled();
    });
});