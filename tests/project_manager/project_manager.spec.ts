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
import * as fs from "fs";

import { e_source_type, t_file } from '../../src/colibri/project_manager/common';
import { Project_manager, DEFAULT_LIBRARY } from '../../src/colibri/project_manager/project_manager';
import { LANGUAGE, VERILOG_LANG_VERSION, VHDL_LANG_VERSION } from "../../src/colibri/common/general";
import { get_default_config } from '../../src/colibri/config/config_declaration';
import { GlobalConfigManager } from "../../src/colibri/config/config_manager";
import { ProjectEmitter } from "../../src/colibri/project_manager/projectEmitter";

const DEFAULT_NAME = "def_name";

describe('project_manager', () => {
    let project_manager: Project_manager;

    beforeEach(() => {
        const emitter = new ProjectEmitter();
        project_manager = new Project_manager(DEFAULT_NAME, "", emitter, undefined);
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

    describe('save_toml (vhdl_ls configuration)', () => {
        const toml_path = '/tmp/test_vhdl_ls.toml';

        const add_vhdl_file = async (name: string, logical_name: string) => {
            const file: t_file = {
                name: name,
                is_include_file: false,
                include_path: "",
                logical_name: logical_name,
                is_manual: false,
                file_type: LANGUAGE.VHDL,
                file_version: undefined,
                source_type: e_source_type.NONE,
            };
            await project_manager.add_file_from_array([file], false);
        };

        afterEach(() => {
            if (fs.existsSync(toml_path)) {
                fs.unlinkSync(toml_path);
            }
        });

        test('writes the standard and the project libraries', () => {
            project_manager.save_toml(toml_path, "2008", false, "");

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toContain('standard = "2008"');
            expect(toml).toContain('[libraries]');
            expect(toml).not.toContain('UNISIM');
            expect(toml).not.toContain('vunit_lib');
        });

        test('writes a libraries table entry as a third-party library', () => {
            const unisim_path = '/opt/Xilinx/Vivado/2024.2/data/vhdl/src/unisims/unisim_retarget_VCOMP.vhd';
            project_manager.save_toml(toml_path, "2008", false, "",
                [{ name: "UNISIM", path: unisim_path }]);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toMatch(/^UNISIM\.files = \[/m);
            expect(toml).toContain(`'${unisim_path}'`);
            expect(toml).toContain('UNISIM.is_third_party = true');
        });

        test('writes the VUnit libraries and the libraries table together', () => {
            const vunit_path = '/home/user/vunit/vhdl/**/*.vhd';
            const unisim_path = '/opt/Xilinx/unisim/**/*.vhd';
            project_manager.save_toml(toml_path, "2008", true, vunit_path,
                [{ name: "UNISIM", path: unisim_path }]);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toMatch(/^vunit_lib\.files = \[/m);
            expect(toml).toContain(`'/home/user/vunit/vhdl/*.vhd'`);
            expect(toml).toContain(`'/home/user/vunit/vhdl/run/src/*.vhd'`);
            expect(toml).toContain('vunit_lib.is_third_party = true');
            expect(toml).toMatch(/^osvvm\.files = \[/m);
            expect(toml).toContain(`'/home/user/vunit/vhdl/osvvm/*.vhd'`);
            expect(toml).toContain('osvvm.is_third_party = true');
            expect(toml).toMatch(/^UNISIM\.files = \[/m);
            expect(toml).toContain(`'${unisim_path}'`);
            expect(toml).toContain('UNISIM.is_third_party = true');
        });

        test('adds the VUnit libraries from a plain VUnit path', () => {
            project_manager.save_toml(toml_path, "2008", false, '/home/user/vunit/vhdl');

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toMatch(/^vunit_lib\.files = \[/m);
            expect(toml).toContain(`'/home/user/vunit/vhdl/*.vhd'`);
            expect(toml).toContain(`'/home/user/vunit/vhdl/vunit/**/*.vhd'`);
            expect(toml).toContain(`'/home/user/vunit/vhdl/com/src/*.vhd'`);
            expect(toml).toContain(`'/home/user/vunit/vhdl/logging/src/*.vhd'`);
            expect(toml).not.toContain('vunit_lib.is_third_party');
            expect(toml).toMatch(/^osvvm\.files = \[/m);
            expect(toml).toContain(`'/home/user/vunit/vhdl/osvvm/*.vhd'`);
            expect(toml).not.toContain('osvvm.is_third_party');
        });

        test('marks the VUnit libraries as third-party only when ignoreVunit is set', () => {
            const vunit_path = '/home/user/vunit/vhdl/**/*.vhd';
            project_manager.save_toml(toml_path, "2008", false, vunit_path);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toMatch(/^vunit_lib\.files = \[/m);
            expect(toml).toMatch(/^osvvm\.files = \[/m);
            expect(toml).not.toContain('is_third_party');
        });

        test('ignorePaths excludes the VUnit library and table entries', () => {
            const vunit_path = '/home/user/vunit/vhdl/**/*.vhd';
            const unisim_path = '/opt/Xilinx/unisim/**/*.vhd';
            const other_path = '/opt/other/**/*.vhd';
            project_manager.save_toml(toml_path, "2008", true, vunit_path,
                [{ name: "UNISIM", path: unisim_path }, { name: "OTHER", path: other_path }],
                [vunit_path, other_path]);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).not.toContain('vunit_lib');
            expect(toml).toMatch(/^UNISIM\.files = \[/m);
            expect(toml).not.toContain('OTHER');
        });

        test('skips table entries with an empty name or path', () => {
            project_manager.save_toml(toml_path, "2008", false, "",
                [{ name: "", path: "/opt/x/**/*.vhd" }, { name: "UNISIM", path: "" }]);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).not.toContain('UNISIM');
            expect(toml).not.toContain('/opt/x');
        });

        test('does not write project libraries with names reserved by vhdl_ls', async () => {
            await add_vhdl_file('/home/user/src/tb_work.vhd', 'work');
            await add_vhdl_file('/home/user/src/tb_std.vhd', 'std');
            await add_vhdl_file('/home/user/src/tb_ieee.vhd', 'ieee');
            await add_vhdl_file('/home/user/src/tb_felix.vhd', 'felix');
            project_manager.save_toml(toml_path, "2008", false, "",
                [{ name: "UNISIM", path: "/opt/Xilinx/unisim/**/*.vhd" }]);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toMatch(/^felix\.files = \[/m);
            expect(toml).toMatch(/^UNISIM\.files = \[/m);
            expect(toml).not.toMatch(/^work\.files/m);
            expect(toml).not.toMatch(/^std\.files/m);
            expect(toml).not.toMatch(/^ieee\.files/m);
        });

        test('merges a project library with a configured library of the same name', async () => {
            await add_vhdl_file('/home/user/vunit/vhdl/vunit_pkg.vhd', 'vunit_lib');
            const vunit_path = '/home/user/vunit/vhdl/**/*.vhd';
            project_manager.save_toml(toml_path, "2008", false, vunit_path);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            // Exactly one vunit_lib entry, containing both the project file and
            // the configured VUnit paths (duplicate keys are rejected by vhdl_ls)
            expect(toml.match(/^vunit_lib\.files/gm)).toHaveLength(1);
            expect(toml).toContain("'/home/user/vunit/vhdl/vunit_pkg.vhd'");
            expect(toml).toContain(`'/home/user/vunit/vhdl/run/src/*.vhd'`);
            expect(toml).not.toContain('vunit_lib.is_third_party');
        });

        test('a project VUnit library stays third-party when merged with the configured VUnit path', async () => {
            await add_vhdl_file('/home/user/vunit/vhdl/vunit_pkg.vhd', 'vunit_lib');
            const vunit_path = '/home/user/vunit/vhdl/**/*.vhd';
            project_manager.save_toml(toml_path, "2008", true, vunit_path);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml.match(/^vunit_lib\.files/gm)).toHaveLength(1);
            expect(toml).toContain("'/home/user/vunit/vhdl/vunit_pkg.vhd'");
            expect(toml).toContain(`'/home/user/vunit/vhdl/run/src/*.vhd'`);
            expect(toml).toContain('vunit_lib.is_third_party = true');
        });

        test('marks the VUnit project libraries as third-party when ignoreVunit is set', async () => {
            await add_vhdl_file('/home/user/vunit/vhdl/vunit_pkg.vhd', 'vunit_lib');
            await add_vhdl_file('/home/user/vunit/vhdl/com/test/tb_com_codec.vhd', 'tb_com_lib');
            await add_vhdl_file('/home/user/vunit/vhdl/osvvm/OsvvmContext.vhd', 'osvvm');
            await add_vhdl_file('/home/user/src/tb_felix.vhd', 'felix');
            project_manager.save_toml(toml_path, "2008", true, "");

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toContain('vunit_lib.is_third_party = true');
            expect(toml).toContain('tb_com_lib.is_third_party = true');
            expect(toml).toContain('osvvm.is_third_party = true');
            expect(toml).toMatch(/^felix\.files = \[/m);
            expect(toml).not.toContain('felix.is_third_party');
        });

        test('does not mark the VUnit project libraries as third-party when ignoreVunit is not set', async () => {
            await add_vhdl_file('/home/user/vunit/vhdl/vunit_pkg.vhd', 'vunit_lib');
            await add_vhdl_file('/home/user/vunit/vhdl/osvvm/OsvvmContext.vhd', 'osvvm');
            project_manager.save_toml(toml_path, "2008", false, "");

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toMatch(/^vunit_lib\.files = \[/m);
            expect(toml).toMatch(/^osvvm\.files = \[/m);
            expect(toml).not.toContain('is_third_party');
        });

        test('marks the library of a project file matching the third-party paths as third-party', async () => {
            await add_vhdl_file('/home/user/simulation/UVVM/uvvm_util/src/uvvm_util_pkg.vhd', 'uvvm_util');
            await add_vhdl_file('/home/user/src/tb_felix.vhd', 'felix');
            project_manager.save_toml(toml_path, "2008", false, "",
                [], [], ['/home/user/simulation/UVVM/**/*.vhd']);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toContain('uvvm_util.is_third_party = true');
            expect(toml).toMatch(/^felix\.files = \[/m);
            expect(toml).not.toContain('felix.is_third_party');
        });

        test('marks a library third-party for an exact third-party file path', async () => {
            await add_vhdl_file('/home/user/src/ip_cores/sim/netlist.vhd', 'netlists');
            await add_vhdl_file('/home/user/src/tb_felix.vhd', 'felix');
            project_manager.save_toml(toml_path, "2008", false, "",
                [], [], ['/home/user/src/ip_cores/sim/netlist.vhd']);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toContain('netlists.is_third_party = true');
            expect(toml).not.toContain('felix.is_third_party');
        });

        test('does not mark a library third-party when no third-party path matches', async () => {
            await add_vhdl_file('/home/user/src/tb_felix.vhd', 'felix');
            project_manager.save_toml(toml_path, "2008", false, "",
                [], [], ['/home/user/other/**/*.vhd']);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toMatch(/^felix\.files = \[/m);
            expect(toml).not.toContain('is_third_party');
        });

        test('a library is dropped when its only file is ignored, even if it matches the third-party paths', async () => {
            await add_vhdl_file('/home/user/src/ip_cores/sim/netlist.vhd', 'netlists');
            await add_vhdl_file('/home/user/src/tb_felix.vhd', 'felix');
            project_manager.save_toml(toml_path, "2008", false, "",
                [], ['/home/user/src/ip_cores/**'], ['/home/user/src/ip_cores/sim/netlist.vhd']);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).not.toMatch(/^netlists\.files/m);
            expect(toml).toMatch(/^felix\.files = \[/m);
            expect(toml).not.toContain('is_third_party');
        });

        test('ignorePaths filters matching project files', async () => {
            await add_vhdl_file('/home/user/src/tb_felix.vhd', 'felix');
            await add_vhdl_file('/home/user/src/ip_cores/sim/netlist.vhd', 'felix');
            project_manager.save_toml(toml_path, "2008", false, "",
                [], ['/home/user/src/ip_cores/sim/*.vhd']);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).toMatch(/^felix\.files = \[/m);
            expect(toml).toContain("'/home/user/src/tb_felix.vhd'");
            expect(toml).not.toContain('netlist.vhd');
        });

        test('a library is dropped when all its files are ignored', async () => {
            await add_vhdl_file('/home/user/src/ip_cores/sim/netlist.vhd', 'netlists');
            await add_vhdl_file('/home/user/src/tb_felix.vhd', 'felix');
            project_manager.save_toml(toml_path, "2008", false, "",
                [], ['/home/user/src/ip_cores/**']);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).not.toMatch(/^netlists\.files/m);
            expect(toml).not.toContain('netlist.vhd');
            expect(toml).toMatch(/^felix\.files = \[/m);
        });

        test('ignorePaths matches configured library paths by glob pattern', () => {
            const vunit_path = '/home/user/vunit/vhdl/**/*.vhd';
            project_manager.save_toml(toml_path, "2008", false, vunit_path,
                [{ name: "UNISIM", path: "/opt/Xilinx/unisim/**/*.vhd" }],
                ['/home/user/vunit/**']);

            const toml = fs.readFileSync(toml_path, 'utf-8');
            expect(toml).not.toContain('vunit_lib');
            expect(toml).toMatch(/^UNISIM\.files = \[/m);
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