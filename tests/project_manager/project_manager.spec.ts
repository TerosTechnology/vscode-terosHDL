// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
//
// This file is part of TerosHDL
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import * as paht_lib from "path";

import { e_source_type, t_file } from '../../src/colibri/project_manager/common';
import { Project_manager, DEFAULT_LIBRARY } from '../../src/colibri/project_manager/project_manager';
import { LANGUAGE, VERILOG_LANG_VERSION, VHDL_LANG_VERSION } from "../../src/colibri/common/general";
import { get_default_config } from '../../src/colibri/config/config_declaration';
import { GlobalConfigManager } from "../../src/colibri/config/config_manager";
import { ProjectEmitter } from "../../src/colibri/project_manager/projectEmitter";
import { e_tools_general_select_tool } from '../../src/colibri/config/config_declaration';
import { e_taskState, e_taskType } from '../../src/colibri/project_manager/tool/common';
import { runTaskNextpnr } from '../../src/colibri/project_manager/tool/nextpnr/taskRunners';
import { LoggerBase } from '../../src/colibri/logger/logger';
import { ChildProcess } from 'child_process';

jest.mock('../../src/colibri/project_manager/tool/nextpnr/taskRunners', () => ({
    runTaskNextpnr: jest.fn()
}));

const DEFAULT_NAME = "def_name";

describe('project_manager', () => {
    let project_manager: Project_manager;

    beforeEach(() => {
        jest.clearAllMocks();
        const emitter = new ProjectEmitter();
        project_manager = new Project_manager(DEFAULT_NAME, "", emitter, undefined);
    });

    test('dispatches nextpnr P&R and records its result', () => {
        const taskType = e_taskType.NEXTPNR_PNR;
        const successful = true;
        const expectedState = e_taskState.FINISHED;
        GlobalConfigManager.newInstance("");
        const config = get_default_config();
        config.tools.general.select_tool = e_tools_general_select_tool.nextpnr;
        project_manager.set_config(config);
        project_manager.updateTaskManager();

        const result = {
            command: 'nextpnr',
            stdout: successful ? 'done' : '',
            stderr: successful ? '' : 'failed',
            return_value: successful ? 0 : 1,
            successful
        };
        const process = {} as ChildProcess;
        const logger = { appendLine: jest.fn() } as unknown as LoggerBase;
        (runTaskNextpnr as jest.Mock).mockImplementation((_task, _definition, callback, _logger) => {
            callback(result);
            return process;
        });
        const callback = jest.fn();

        const returnedProcess = project_manager.runTask(taskType, logger, callback);

        expect(runTaskNextpnr).toHaveBeenCalledWith(taskType, expect.any(Object), expect.any(Function), logger);
        expect(returnedProcess).toBe(process);
        expect(callback).toHaveBeenCalledWith(result);
        expect(project_manager.getTaskState(taskType)).toBe(expectedState);
    });

    test('rename', () => {
        const new_name = "sancho_panza";

        expect(project_manager.get_name()).toBe(DEFAULT_NAME);
        project_manager.rename(new_name);
        expect(project_manager.get_name()).toBe(new_name);
    });

    test('add_toplevel_path', () => {
        project_manager.add_toplevel_path("path1");
        expect(project_manager.get_toplevel_path()).toStrictEqual(["path1"]);

        project_manager.add_toplevel_path("path2");
        expect(project_manager.get_toplevel_path()).toStrictEqual(["path2"]);
    });

    test('delete_toplevel_path', () => {
        project_manager.add_toplevel_path("path1");
        project_manager.delete_toplevel_path("path1");
        expect(project_manager.get_toplevel_path()).toStrictEqual([]);
    });

    test('add_file', () => {
        const file_0: t_file = {
            name: 'file_0',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_0',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        const file_1: t_file = {
            name: 'file_1',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        project_manager.add_file(file_0);
        expect(project_manager.get_file()[0].name).toStrictEqual(file_0.name);

        project_manager.add_file(file_1);
        expect(project_manager.get_file()[1].name).toStrictEqual(file_1.name);
    });

    test('delete_file', async () => {
        const file_0: t_file = {
            name: 'file_0',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_0',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        const file_1: t_file = {
            name: 'file_1',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        const file_2: t_file = {
            name: 'file_2',
            is_include_file: false,
            include_path: '',
            logical_name: '',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        project_manager.add_file(file_0);
        project_manager.add_file(file_1);
        project_manager.add_file(file_2);

        const result_0 = await project_manager.delete_file("file_0", "logical_0");
        expect(project_manager.get_file()[0].name).toStrictEqual(file_1.name);
        expect(result_0.successful).toBe(true);

        const result_1 = await project_manager.delete_file("file_1", "logical_5");
        expect(result_1.successful).toBe(false);

        const result_2 = await project_manager.delete_file("file_1", "logical_1");
        expect(project_manager.get_file()[0].name).toStrictEqual(file_2.name);
        expect(result_2.successful).toBe(true);

        const result_3 = await project_manager.delete_file("file_2");
        expect(project_manager.get_file()).toStrictEqual([]);
        expect(result_3.successful).toBe(true);
    });

    test('delete_file_by_logical_name', async () => {
        const file_0: t_file = {
            name: 'file_0',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        const file_1: t_file = {
            name: 'file_1',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        const file_2: t_file = {
            name: 'file_2',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_2',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        project_manager.add_file(file_0);
        project_manager.add_file(file_1);
        project_manager.add_file(file_2);

        const result_0 = await project_manager.delete_file_by_logical_name("logical_1");
        expect(project_manager.get_file()[0].name).toStrictEqual(file_2.name);
        expect(result_0.successful).toBe(true);

        const result_1 = await project_manager.delete_file_by_logical_name("logical_1");
        expect(result_1.successful).toBe(false);
    });

    test('add_logical', () => {
        const logical_0 = "logical_0";
        const logical_1 = "logical_1";

        project_manager.add_logical(logical_0);
        expect(project_manager.get_file()[0].logical_name).toStrictEqual(logical_0);

        project_manager.add_logical(logical_1);
        expect(project_manager.get_file()[1].logical_name).toStrictEqual(logical_1);
    });


    test('check_if_file_in_project', () => {
        const file_0: t_file = {
            name: 'file_0',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        const file_1: t_file = {
            name: 'file_1',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        project_manager.add_file(file_0);
        project_manager.add_file(file_1);

        expect(project_manager.check_if_file_in_project("file_0", "logical_1")).toBe(true);
        expect(project_manager.check_if_file_in_project("file_1", "logical_1")).toBe(true);
        expect(project_manager.check_if_file_in_project("file_2", "logical_1")).toBe(false);
        expect(project_manager.check_if_file_in_project("file_0", "logical_2")).toBe(false);
    });

    test('check_if_path_in_project', () => {
        const file_0: t_file = {
            name: 'file_0',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        const file_1: t_file = {
            name: 'file_1',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        project_manager.add_file(file_0);
        project_manager.add_file(file_1);

        expect(project_manager.check_if_path_in_project("file_0")).toBe(true);
    });

    test('get_project_definition', () => {
        const file_0: t_file = {
            name: 'file_0',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        const file_1: t_file = {
            name: 'file_1',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        project_manager.add_file(file_0);
        project_manager.add_file(file_1);

        GlobalConfigManager.newInstance("");
        const project_definition = project_manager.get_project_definition();
        expect(project_definition.name).toBe(DEFAULT_NAME);
        expect(project_definition.file_manager.get()[0].name).toBe(file_0.name);
        expect(project_definition.file_manager.get()[1].name).toBe(file_1.name);
    });

    test('delete_phantom_toplevel', () => {
        const file_0: t_file = {
            name: 'file_0',
            is_include_file: false,
            include_path: '',
            logical_name: 'logical_1',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };

        project_manager.add_file(file_0);
        project_manager.add_toplevel_path(file_0.name);

        expect(project_manager.get_toplevel_path()[0]).toBe(file_0.name);

        project_manager.delete_file(file_0.name, file_0.logical_name);
        project_manager.delete_phantom_toplevel();

        expect(project_manager.get_toplevel_path()).toStrictEqual([]);
    });

    test('add_file_from_csv', () => {
        const csv_path = paht_lib.join(__dirname, "helpers", "prj.csv");
        const is_manual = false;

        const result = project_manager.add_file_from_csv(csv_path, is_manual);
        expect(result.successful).toBe(true);

        expect(project_manager.get_file()[0].name).toBe("/my/file_0.vhd");
        expect(project_manager.get_file()[0].logical_name).toBe("");
        expect(project_manager.get_file()[0].is_manual).not.toBeTruthy();

        expect(project_manager.get_file()[1].name).toBe("/my/file_1.vhd");
        expect(project_manager.get_file()[1].logical_name).toBe("sample_lib");

        expect(project_manager.get_file()[2].name).toBe("/my/file_2.vhd");
        expect(project_manager.get_file()[1].logical_name).toBe("sample_lib");
    });

    test('set_config, get_config', () => {
        GlobalConfigManager.newInstance("");

        const new_config = get_default_config();
        new_config.tools.ghdl.installation_path = "ghdl_path";

        project_manager.set_config(new_config);
        expect(project_manager.get_config()).toStrictEqual(new_config);
    });


    describe('get_toml', () => {
        const toml_header = "[libraries]";

        function remove_spaces(text: string): string {
            return text.replace(/\s/g, '');
        }

        it("should successfully handled a project without sources", () => {
            const expected = toml_header + `${DEFAULT_LIBRARY}.files=[]`;
            expect(remove_spaces(project_manager.get_toml())).toBe(expected);
        });

        it("should successfully handled a project without vhdl sources", async () => {
            await project_manager.add_file(<t_file>{
                name: "file",
                is_include_file: false,
                include_path: "",
                logical_name: "a",
                is_manual: true,
                file_type: LANGUAGE.VERILOG,
                file_version: VERILOG_LANG_VERSION.v2000,
            });
            const expected = toml_header + `${DEFAULT_LIBRARY}.files=[]`;
            expect(remove_spaces(project_manager.get_toml())).toBe(expected);
        });

        it("should handled a project with empty lib name", async () => {
            await project_manager.add_file(<t_file>{
                name: "file",
                is_include_file: false,
                include_path: "",
                logical_name: "",
                is_manual: true,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2000,
            });

            expect(remove_spaces(project_manager.get_toml())).toEqual(remove_spaces(`${toml_header}
            ${DEFAULT_LIBRARY}.files = [
              'file',
            ]
            `));
        });

        it("should handled a project with multiple files in same library", async () => {
            await project_manager.add_file(<t_file>{
                name: "file1",
                is_include_file: false,
                include_path: "",
                logical_name: "lib1",
                is_manual: true,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2000,
            });
            await project_manager.add_file(<t_file>{
                name: "file2",
                is_include_file: false,
                include_path: "",
                logical_name: "lib1",
                is_manual: true,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2000,
            });

            expect(remove_spaces(project_manager.get_toml())).toEqual(remove_spaces(`${toml_header}
            lib1.files = [
              'file1',
              'file2',
            ]
            `));
        });

        it("should merge files with same name in same library", async () => {
            await project_manager.add_file(<t_file>{
                name: "file",
                is_include_file: false,
                include_path: "",
                logical_name: "lib1",
                is_manual: true,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2000,
            });
            await project_manager.add_file(<t_file>{
                name: "file",
                is_include_file: false,
                include_path: "",
                logical_name: "lib1",
                is_manual: true,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2000,
            });
            await project_manager.add_file(<t_file>{
                name: "file",
                is_include_file: false,
                include_path: "",
                logical_name: "",
                is_manual: true,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2000,
            });

            expect(remove_spaces(project_manager.get_toml())).toEqual(remove_spaces(`${toml_header}
            lib1.files = [
              'file',
            ]
            ${DEFAULT_LIBRARY}.files = [
                'file',
            ]
            `));
        });


    });

    // Additional comprehensive tests for project_manager
    
    describe('Project Configuration Tests', () => {
        test('get_diff_config should return project-specific config', () => {
            GlobalConfigManager.newInstance("");
            
            const new_config = get_default_config();
            new_config.tools.ghdl.installation_path = "custom_ghdl_path";
            
            project_manager.set_config(new_config);
            
            const diff_config = project_manager.get_diff_config();
            expect(diff_config.tools.ghdl.installation_path).toBe("custom_ghdl_path");
        });

        test('projectDiskPath setter and getter', () => {
            const test_path = "/test/project/path";
            project_manager.projectDiskPath = test_path;
            expect(project_manager.projectDiskPath).toBe(test_path);
        });

        test('getProjectType should return GENERIC by default', () => {
            expect(project_manager.getProjectType()).toBe("genericProject");
        });
    });

    describe('File Management Extended Tests', () => {
        test('clearFiles should remove all files', () => {
            const file_0: t_file = {
                name: 'file_0',
                is_include_file: false,
                include_path: '',
                logical_name: 'logical_0',
                is_manual: false,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2008,
                source_type: e_source_type.NONE,
            };

            project_manager.add_file(file_0);
            expect(project_manager.get_file().length).toBe(1);

            project_manager.clearFiles();
            expect(project_manager.get_file().length).toBe(0);
        });

        test('add_logical should add a logical library', () => {
            const logical_name = "test_library";
            const result = project_manager.add_logical(logical_name);
            expect(result.successful).toBe(true);
        });

        test('delete_file_by_logical_name should remove files by logical name', async () => {
            const file_0: t_file = {
                name: 'file_0',
                is_include_file: false,
                include_path: '',
                logical_name: 'test_logical',
                is_manual: false,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2008,
                source_type: e_source_type.NONE,
            };

            const file_1: t_file = {
                name: 'file_1',
                is_include_file: false,
                include_path: '',
                logical_name: 'other_logical',
                is_manual: false,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2008,
                source_type: e_source_type.NONE,
            };

            project_manager.add_file(file_0);
            project_manager.add_file(file_1);
            expect(project_manager.get_file().length).toBe(2);

            await project_manager.delete_file_by_logical_name('test_logical');
            expect(project_manager.get_file().length).toBe(1);
            expect(project_manager.get_file()[0].name).toBe('file_1');
        });
    });

    describe('Project Definition and Utilities', () => {
        test('get_edam_json should return valid EDAM JSON structure', () => {
            GlobalConfigManager.newInstance("");
            
            const file_0: t_file = {
                name: 'test_file.vhd',
                is_include_file: false,
                include_path: '',
                logical_name: 'work',
                is_manual: true,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2008,
                source_type: e_source_type.NONE,
            };

            project_manager.add_file(file_0);
            project_manager.add_toplevel_path('test_file.vhd');

            const edam_json = project_manager.get_edam_json();
            
            expect(edam_json.name).toBe(DEFAULT_NAME);
            expect(edam_json.files).toBeDefined();
            expect(edam_json.files.length).toBe(1);
            expect(edam_json.files[0].name).toBe('test_file.vhd');
            expect(edam_json.toplevel).toBe('test_file.vhd');
        });

        test('get_edam_yaml should return valid YAML string', () => {
            GlobalConfigManager.newInstance("");
            
            const yaml_content = project_manager.get_edam_yaml();
            expect(typeof yaml_content).toBe('string');
            expect(yaml_content).toContain('name:');
            expect(yaml_content).toContain(DEFAULT_NAME);
        });

        test('getRunTitle should return appropriate title based on tool', () => {
            GlobalConfigManager.newInstance("");
            
            const title = project_manager.getRunTitle();
            expect(typeof title).toBe('string');
            expect(title.length).toBeGreaterThan(0);
        });
    });

    describe('Task and State Management', () => {
        test('taskStateManager setter and getter', () => {
            const mockTaskStateManager = {
                getTaskState: jest.fn(),
                getTaskList: jest.fn().mockReturnValue([]),
                getCurrentTask: jest.fn(),
                setCurrentTask: jest.fn(),
            };

            project_manager.taskStateManager = mockTaskStateManager as any;
            expect(project_manager.taskStateManager).toBe(mockTaskStateManager);
        });

        test('getTaskStatus should return task information', () => {
            const taskStatus = project_manager.getTaskStatus();
            expect(taskStatus).toHaveProperty('taskList');
            expect(taskStatus).toHaveProperty('currentTask');
            expect(Array.isArray(taskStatus.taskList)).toBe(true);
        });

        test('get_test_list should return empty array by default', async () => {
            const testList = await project_manager.get_test_list();
            expect(Array.isArray(testList)).toBe(true);
        });

        test('getIpCatalog should return empty array by default', async () => {
            const ipCatalog = await project_manager.getIpCatalog();
            expect(Array.isArray(ipCatalog)).toBe(true);
            expect(ipCatalog.length).toBe(0);
        });
    });

    describe('Advanced File Operations', () => {
        test('get_toml with complex project structure', async () => {
            const files: t_file[] = [
                {
                    name: 'file1.vhd',
                    is_include_file: false,
                    include_path: '',
                    logical_name: 'lib1',
                    is_manual: true,
                    file_type: LANGUAGE.VHDL,
                    file_version: VHDL_LANG_VERSION.v2008,
                    source_type: e_source_type.NONE,
                },
                {
                    name: 'file2.vhd',
                    is_include_file: false,
                    include_path: '',
                    logical_name: 'lib2',
                    is_manual: true,
                    file_type: LANGUAGE.VHDL,
                    file_version: VHDL_LANG_VERSION.v2008,
                    source_type: e_source_type.NONE,
                },
                {
                    name: 'file3.v',
                    is_include_file: false,
                    include_path: '',
                    logical_name: 'lib1',
                    is_manual: true,
                    file_type: LANGUAGE.VERILOG,
                    file_version: VERILOG_LANG_VERSION.v2005,
                    source_type: e_source_type.NONE,
                }
            ];

            for (const file of files) {
                await project_manager.add_file(file);
            }

            const toml_content = project_manager.get_toml();
            expect(toml_content).toContain('[libraries]');
            expect(toml_content).toContain('lib1.files');
            expect(toml_content).toContain('lib2.files');
        });

        test('save_edam_yaml should not throw errors', () => {
            GlobalConfigManager.newInstance("");
            const tempPath = '/tmp/test_edam.yaml';
            
            expect(() => {
                project_manager.save_edam_yaml(tempPath);
            }).not.toThrow();
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('delete_file with non-existent file should handle gracefully', async () => {
            const result = await project_manager.delete_file('non_existent_file.vhd', 'work');
            expect(result.successful).toBe(false);
        });

        test('delete_toplevel_path with non-existent path should handle gracefully', () => {
            const result = project_manager.delete_toplevel_path('non_existent_path');
            expect(result.successful).toBe(false);
        });

        test('check_if_file_in_project with empty project', () => {
            const result = project_manager.check_if_file_in_project('any_file', 'any_logical');
            expect(result).toBe(false);
        });

        test('check_if_path_in_project with empty project', () => {
            const result = project_manager.check_if_path_in_project('any_path');
            expect(result).toBe(false);
        });
    });

    describe('Timing and Terminal Commands', () => {
        test('getTimingReport should return empty array by default', async () => {
            const timingReport = await project_manager.getTimingReport(10, 'setup' as any);
            expect(Array.isArray(timingReport)).toBe(true);
            expect(timingReport.length).toBe(0);
        });

        test('getTerminalCommand should return undefined by default', () => {
            const terminalCommand = project_manager.getTerminalCommand('bash');
            expect(terminalCommand).toBeUndefined();
        });

        test('getArtifact should return empty object by default', async () => {
            const artifact = await project_manager.getArtifact('SYNTHESIS' as any, 'REPORT' as any);
            expect(typeof artifact).toBe('object');
        });
    });

});