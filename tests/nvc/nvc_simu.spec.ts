import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { get_default_config } from '../../src/colibri/config/config_declaration';
import { t_project_definition } from '../../src/colibri/project_manager/project_definition';
import { e_taskType } from '../../src/colibri/project_manager/tool/common';
import { runTasknvc } from '../../src/colibri/project_manager/tool/nvc/taskRunners';

// Mock NVC task implementations to keep this test stable and independent from external binaries.
jest.mock('../../src/colibri/project_manager/tool/nvc/tasks', () => ({
    runnvcAnalyze: jest.fn(),
    runnvcElaborate: jest.fn(),
    runnvcSimulate: jest.fn(),
    runnvcAll: jest.fn(),
    runnvcSynthesize: jest.fn(),
    runnvcCheckSyntax: jest.fn(),
    runnvcMakefile: jest.fn(),
}));

import * as tasks from '../../src/colibri/project_manager/tool/nvc/tasks';

describe('NVC Simulator Task Runner', () => {
    let tempDir: string;
    let mockProjectDefinition: t_project_definition;
    let mockCallback: jest.Mock;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teroshdl-nvc-integration-test-'));

        const defaultConfig = get_default_config();
        mockProjectDefinition = {
            project_disk_path: tempDir,
            config: {
                tools: {
                    nvc: defaultConfig.tools.nvc,
                },
            },
            toplevel_path_manager: {
                get: jest.fn().mockReturnValue([]),
            },
            file_manager: {
                get: jest.fn().mockReturnValue([]),
            },
        } as any;

        mockCallback = jest.fn();
    });

    afterEach(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        jest.clearAllMocks();
    });

    it('routes NVC_RUN_ALL to simulator flow', () => {
        const mockProcess = {} as any;
        (tasks.runnvcAll as jest.Mock).mockReturnValue(mockProcess);

        const result = runTasknvc(e_taskType.NVC_RUN_ALL, mockProjectDefinition, mockCallback);

        expect(tasks.runnvcAll).toHaveBeenCalledWith(mockProjectDefinition, mockCallback);
        expect(result).toBe(mockProcess);
    });

    it('creates project directory when missing', () => {
        fs.rmSync(tempDir, { recursive: true, force: true });
        expect(fs.existsSync(tempDir)).toBe(false);

        (tasks.runnvcAll as jest.Mock).mockReturnValue({} as any);
        runTasknvc(e_taskType.NVC_RUN_ALL, mockProjectDefinition, mockCallback);

        expect(fs.existsSync(tempDir)).toBe(true);
    });

    it('returns an error result for unsupported task', (done) => {
        const unsupportedTask = 'UNSUPPORTED_NVC_TASK' as any;

        const result = runTasknvc(unsupportedTask, mockProjectDefinition, (taskResult) => {
            expect(taskResult.successful).toBe(false);
            expect(taskResult.return_value).toBe(1);
            expect(taskResult.stderr).toContain('Unsupported nvc task type');
            done();
        });

        expect(result).toEqual({});
    });
});