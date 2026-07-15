import * as path from 'path';

import { get_default_config } from '../../src/colibri/config/config_declaration';
import { LANGUAGE } from '../../src/colibri/common/general';
import { t_project_definition } from '../../src/colibri/project_manager/project_definition';
import { e_taskType } from '../../src/colibri/project_manager/tool/common';
import { getTopLevel, getVhdlFiles, groupFilesByLibrary } from '../../src/colibri/project_manager/tool/nvc/utils';
import { getBinary, quoteArgs, buildChainedCommand } from '../../src/colibri/project_manager/tool/nvc/executor';
import { runTasknvc } from '../../src/colibri/project_manager/tool/nvc/taskRunners';

////////////////////////////////////////////////////////////////////////////////
// Mocks
////////////////////////////////////////////////////////////////////////////////

jest.mock('../../src/colibri/utils/file_utils', () => ({
    check_if_path_exist: jest.fn(),
    create_directory: jest.fn(),
}));

jest.mock('../../src/colibri/utils/hdl_utils', () => ({
    get_toplevel_from_path: jest.fn(),
}));

jest.mock('../../src/colibri/project_manager/tool/nvc/tasks', () => ({
    runnvcAnalyze: jest.fn(),
    runnvcElaborate: jest.fn(),
    runnvcSimulate: jest.fn(),
    runnvcAll: jest.fn(),
    runnvcSynthesize: jest.fn(),
    runnvcCheckSyntax: jest.fn(),
    runnvcMakefile: jest.fn(),
}));

import * as file_utils from '../../src/colibri/utils/file_utils';
import * as hdl_utils from '../../src/colibri/utils/hdl_utils';
import * as tasks from '../../src/colibri/project_manager/tool/nvc/tasks';

////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////

function makeConfig(overrides: Partial<ReturnType<typeof get_default_config>['tools']['nvc']> = {}) {
    return { ...get_default_config().tools.nvc, ...overrides };
}

function makeProject(overrides: Partial<t_project_definition> = {}): t_project_definition {
    return {
        project_disk_path: '/project',
        config: { tools: { nvc: makeConfig() } },
        toplevel_path_manager: { get: jest.fn().mockReturnValue([]) },
        file_manager: { get: jest.fn().mockReturnValue([]) },
        ...overrides,
    } as any;
}

////////////////////////////////////////////////////////////////////////////////
// utils.ts – getTopLevel
////////////////////////////////////////////////////////////////////////////////

describe('getTopLevel', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns null when there are no toplevel files', () => {
        const project = makeProject();
        expect(getTopLevel(project)).toBeNull();
    });

    it('returns null when get_toplevel_from_path returns an empty string', () => {
        (hdl_utils.get_toplevel_from_path as jest.Mock).mockReturnValue('');
        const project = makeProject({
            toplevel_path_manager: { get: jest.fn().mockReturnValue(['/project/tb.vhd']) } as any,
        });
        expect(getTopLevel(project)).toBeNull();
    });

    it('returns the entity name when get_toplevel_from_path has a value', () => {
        (hdl_utils.get_toplevel_from_path as jest.Mock).mockReturnValue('tb_top');
        const project = makeProject({
            toplevel_path_manager: { get: jest.fn().mockReturnValue(['/project/tb.vhd']) } as any,
        });
        expect(getTopLevel(project)).toBe('tb_top');
    });

    it('uses only the first file in the list of toplevels', () => {
        (hdl_utils.get_toplevel_from_path as jest.Mock).mockReturnValue('first_entity');
        const project = makeProject({
            toplevel_path_manager: {
                get: jest.fn().mockReturnValue(['/project/first.vhd', '/project/second.vhd']),
            } as any,
        });
        getTopLevel(project);
        expect(hdl_utils.get_toplevel_from_path).toHaveBeenCalledTimes(1);
        expect(hdl_utils.get_toplevel_from_path).toHaveBeenCalledWith('/project/first.vhd');
    });
});

////////////////////////////////////////////////////////////////////////////////
// utils.ts – getVhdlFiles
////////////////////////////////////////////////////////////////////////////////

describe('getVhdlFiles', () => {
    it('returns only VHDL files', () => {
        const files = [
            { name: 'a.vhd', file_type: LANGUAGE.VHDL },
            { name: 'b.v', file_type: LANGUAGE.VERILOG },
            { name: 'c.vhd', file_type: LANGUAGE.VHDL },
        ];
        const project = makeProject({
            file_manager: { get: jest.fn().mockReturnValue(files) } as any,
        });
        const result = getVhdlFiles(project);
        expect(result).toHaveLength(2);
        expect(result.map(f => f.name)).toEqual(['a.vhd', 'c.vhd']);
    });

    it('returns an empty array when there are no VHDL files', () => {
        const files = [{ name: 'top.v', file_type: LANGUAGE.VERILOG }];
        const project = makeProject({
            file_manager: { get: jest.fn().mockReturnValue(files) } as any,
        });
        expect(getVhdlFiles(project)).toHaveLength(0);
    });

    it('returns an empty array when the project has no files', () => {
        const project = makeProject();
        expect(getVhdlFiles(project)).toHaveLength(0);
    });
});

////////////////////////////////////////////////////////////////////////////////
// utils.ts – groupFilesByLibrary
////////////////////////////////////////////////////////////////////////////////

describe('groupFilesByLibrary', () => {
    it('groups files by their logical_name', () => {
        const files = [
            { name: '/project/a.vhd', file_type: LANGUAGE.VHDL, logical_name: 'lib_a' },
            { name: '/project/b.vhd', file_type: LANGUAGE.VHDL, logical_name: 'lib_b' },
            { name: '/project/c.vhd', file_type: LANGUAGE.VHDL, logical_name: 'lib_a' },
        ];
        const project = makeProject({
            file_manager: { get: jest.fn().mockReturnValue(files) } as any,
        });
        const groups = groupFilesByLibrary(project, makeConfig());
        expect(groups.get('lib_a')).toHaveLength(2);
        expect(groups.get('lib_b')).toHaveLength(1);
    });

    it('uses work_library when the file does not have a logical_name', () => {
        const files = [
            { name: '/project/a.vhd', file_type: LANGUAGE.VHDL },
        ];
        const project = makeProject({
            file_manager: { get: jest.fn().mockReturnValue(files) } as any,
        });
        const config = makeConfig({ work_library: 'mywork' });
        const groups = groupFilesByLibrary(project, config);
        expect(groups.has('mywork')).toBe(true);
    });

    it('uses "work" as the default library when there is no logical_name or work_library', () => {
        const files = [
            { name: '/project/a.vhd', file_type: LANGUAGE.VHDL },
        ];
        const project = makeProject({
            file_manager: { get: jest.fn().mockReturnValue(files) } as any,
        });
        const config = makeConfig({ work_library: '' });
        const groups = groupFilesByLibrary(project, config);
        expect(groups.has('work')).toBe(true);
    });

    it('uses relative path when the file is inside the project directory', () => {
        const files = [
            { name: '/project/src/a.vhd', file_type: LANGUAGE.VHDL, logical_name: 'work' },
        ];
        const project = makeProject({
            project_disk_path: '/project',
            file_manager: { get: jest.fn().mockReturnValue(files) } as any,
        });
        const groups = groupFilesByLibrary(project, makeConfig());
        expect(groups.get('work')).toContain(path.join('src', 'a.vhd'));
    });

    it('uses absolute path when the file is outside the project directory', () => {
        const files = [
            { name: '/external/lib/a.vhd', file_type: LANGUAGE.VHDL, logical_name: 'work' },
        ];
        const project = makeProject({
            project_disk_path: '/project',
            file_manager: { get: jest.fn().mockReturnValue(files) } as any,
        });
        const groups = groupFilesByLibrary(project, makeConfig());
        expect(groups.get('work')).toContain('/external/lib/a.vhd');
    });

    it('returns an empty map when there are no VHDL files', () => {
        const files = [{ name: 'top.v', file_type: LANGUAGE.VERILOG }];
        const project = makeProject({
            file_manager: { get: jest.fn().mockReturnValue(files) } as any,
        });
        expect(groupFilesByLibrary(project, makeConfig()).size).toBe(0);
    });
});

////////////////////////////////////////////////////////////////////////////////
// executor.ts – quoteArgs
////////////////////////////////////////////////////////////////////////////////

describe('quoteArgs', () => {
    it('does not modify arguments without spaces', () => {
        expect(quoteArgs(['--std=2008', '-a', 'file.vhd'])).toEqual(['--std=2008', '-a', 'file.vhd']);
    });

    it('encloses arguments containing spaces in quotes', () => {
        expect(quoteArgs(['/path with spaces/file.vhd'])).toEqual(['"/path with spaces/file.vhd"']);
    });

    it('returns an empty array when the input is empty', () => {
        expect(quoteArgs([])).toEqual([]);
    });

    it('only quotes arguments that have spaces, not those that do not', () => {
        const result = quoteArgs(['--std=2008', '/path with space/a.vhd', '-a']);
        expect(result[0]).toBe('--std=2008');
        expect(result[1]).toBe('"/path with space/a.vhd"');
        expect(result[2]).toBe('-a');
    });
});

////////////////////////////////////////////////////////////////////////////////
// executor.ts – getBinary
////////////////////////////////////////////////////////////////////////////////

describe('getBinary', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns “nvc” when installation_path is empty', () => {
        const config = makeConfig({ installation_path: '' });
        expect(getBinary(config)).toBe('nvc');
    });

    it('returns "nvc" when installation_path is only spaces', () => {
        const config = makeConfig({ installation_path: '   ' });
        expect(getBinary(config)).toBe('nvc');
    });

    it('returns the path to nvc.exe when it exists in installation_path', () => {
        (file_utils.check_if_path_exist as jest.Mock).mockImplementation((p: string) =>
            p.endsWith('nvc.exe')
        );
        const config = makeConfig({ installation_path: '/opt/nvc/bin' });
        const result = getBinary(config);
        expect(result).toBe(path.join('/opt/nvc/bin', 'nvc.exe'));
    });

    it('returns the path to nvc (without .exe) when nvc.exe does not exist but nvc does', () => {
        (file_utils.check_if_path_exist as jest.Mock).mockImplementation((p: string) =>
            p.endsWith('nvc') && !p.endsWith('nvc.exe')
        );
        const config = makeConfig({ installation_path: '/opt/nvc/bin' });
        const result = getBinary(config);
        expect(result).toBe(path.join('/opt/nvc/bin', 'nvc'));
    });

    it('returns "nvc" as a fallback when installation_path does not exist on disk', () => {
        (file_utils.check_if_path_exist as jest.Mock).mockReturnValue(false);
        const config = makeConfig({ installation_path: '/non/existent/path' });
        expect(getBinary(config)).toBe('nvc');
    });
});

////////////////////////////////////////////////////////////////////////////////
// executor.ts – buildChainedCommand
////////////////////////////////////////////////////////////////////////////////

describe('buildChainedCommand', () => {
    beforeEach(() => {
        // Without installation_path → uses "nvc" from the system
        (file_utils.check_if_path_exist as jest.Mock).mockReturnValue(false);
    });

    it('builds a simple command with arguments', () => {
        const config = makeConfig({ installation_path: '' });
        const result = buildChainedCommand(config, [
            { command: '', args: ['--std=2008', '-a', 'file.vhd'] },
        ]);
        expect(result).toBe('nvc --std=2008 -a file.vhd');
    });

    it('builds multiple commands chained with &&', () => {
        const config = makeConfig({ installation_path: '' });
        const result = buildChainedCommand(config, [
            { command: '', args: ['--work=lib_a', '-a', 'a.vhd'] },
            { command: '', args: ['--work=lib_b', '-a', 'b.vhd'] },
        ]);
        expect(result).toBe('nvc --work=lib_a -a a.vhd && nvc --work=lib_b -a b.vhd');
    });

    it('includes the command as the first element when command is not empty', () => {
        const config = makeConfig({ installation_path: '' });
        const result = buildChainedCommand(config, [
            { command: '-e', args: ['tb_top'] },
        ]);
        expect(result).toBe('nvc -e tb_top');
    });

    it('uses the custom executable when installation_path is valid', () => {
        (file_utils.check_if_path_exist as jest.Mock).mockImplementation((p: string) =>
            p.endsWith('nvc') && !p.endsWith('nvc.exe')
        );
        const config = makeConfig({ installation_path: '/opt/nvc/bin' });
        const nvcPath = path.join('/opt/nvc/bin', 'nvc');
        const result = buildChainedCommand(config, [
            { command: '', args: ['-a', 'file.vhd'] },
        ]);
        expect(result).toBe(`${nvcPath} -a file.vhd`);
    });

    it('quotes arguments with spaces in the chained command', () => {
        const config = makeConfig({ installation_path: '' });
        const result = buildChainedCommand(config, [
            { command: '', args: ['-a', '/path with space/file.vhd'] },
        ]);
        expect(result).toBe('nvc -a "/path with space/file.vhd"');
    });

    it('returns an empty string when there are no commands', () => {
        const config = makeConfig({ installation_path: '' });
        expect(buildChainedCommand(config, [])).toBe('');
    });
});

////////////////////////////////////////////////////////////////////////////////
// taskRunners.ts - runTasknvc
////////////////////////////////////////////////////////////////////////////////

describe('runTasknvc – run task', () => {
    let mockCallback: jest.Mock;
    const mockProcess = {} as any;

    beforeEach(() => {
        (file_utils.check_if_path_exist as jest.Mock).mockReturnValue(true);
        mockCallback = jest.fn();
        jest.clearAllMocks();
        (file_utils.check_if_path_exist as jest.Mock).mockReturnValue(true);
    });

    const project = makeProject();

    it('routes NVC_ANALYZE to runnvcAnalyze', () => {
        (tasks.runnvcAnalyze as jest.Mock).mockReturnValue(mockProcess);
        const result = runTasknvc(e_taskType.NVC_ANALYZE, project, mockCallback);
        expect(tasks.runnvcAnalyze).toHaveBeenCalledWith(project, mockCallback);
        expect(result).toBe(mockProcess);
    });

    it('routes NVC_ELABORATE to runnvcElaborate', () => {
        (tasks.runnvcElaborate as jest.Mock).mockReturnValue(mockProcess);
        const result = runTasknvc(e_taskType.NVC_ELABORATE, project, mockCallback);
        expect(tasks.runnvcElaborate).toHaveBeenCalledWith(project, mockCallback);
        expect(result).toBe(mockProcess);
    });

    it('routes NVC_SIMULATE to runnvcSimulate', () => {
        (tasks.runnvcSimulate as jest.Mock).mockReturnValue(mockProcess);
        const result = runTasknvc(e_taskType.NVC_SIMULATE, project, mockCallback);
        expect(tasks.runnvcSimulate).toHaveBeenCalledWith(project, mockCallback);
        expect(result).toBe(mockProcess);
    });

    it('routes NVC_SYNTHESIZE to runnvcSynthesize', () => {
        (tasks.runnvcSynthesize as jest.Mock).mockReturnValue(mockProcess);
        const result = runTasknvc(e_taskType.NVC_SYNTHESIZE, project, mockCallback);
        expect(tasks.runnvcSynthesize).toHaveBeenCalledWith(project, mockCallback);
        expect(result).toBe(mockProcess);
    });

    it('routes NVC_CHECK_SYNTAX to runnvcCheckSyntax', () => {
        (tasks.runnvcCheckSyntax as jest.Mock).mockReturnValue(mockProcess);
        const result = runTasknvc(e_taskType.NVC_CHECK_SYNTAX, project, mockCallback);
        expect(tasks.runnvcCheckSyntax).toHaveBeenCalledWith(project, mockCallback);
        expect(result).toBe(mockProcess);
    });

    it('routes NVC_MAKEFILE to runnvcMakefile', () => {
        (tasks.runnvcMakefile as jest.Mock).mockReturnValue(mockProcess);
        const result = runTasknvc(e_taskType.NVC_MAKEFILE, project, mockCallback);
        expect(tasks.runnvcMakefile).toHaveBeenCalledWith(project, mockCallback);
        expect(result).toBe(mockProcess);
    });
});
