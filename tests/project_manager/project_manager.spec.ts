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
import * as os from "os";

import { e_file_origin, e_source_type, e_watcher_type, t_file } from '../../src/colibri/project_manager/common';
import { Project_manager, DEFAULT_LIBRARY } from '../../src/colibri/project_manager/project_manager';
import { LANGUAGE, VERILOG_LANG_VERSION, VHDL_LANG_VERSION } from "../../src/colibri/common/general";
import { get_default_config } from '../../src/colibri/config/config_declaration';
import { GlobalConfigManager } from "../../src/colibri/config/config_manager";
import { ProjectEmitter, e_event } from "../../src/colibri/project_manager/projectEmitter";
import { e_tools_general_select_tool } from '../../src/colibri/config/config_declaration';
import { e_taskState, e_taskType } from '../../src/colibri/project_manager/tool/common';
import { runTaskNextpnr } from '../../src/colibri/project_manager/tool/nextpnr/taskRunners';
import { LoggerBase } from '../../src/colibri/logger/logger';
import { ChildProcess } from 'child_process';
import * as file_utils from '../../src/colibri/utils/file_utils';
import { Watcher_manager } from '../../src/colibri/project_manager/list_manager/watcher';
import * as vunit_loader from '../../src/colibri/project_manager/prj_loaders/vunit_loader';
import * as vivado_loader from '../../src/colibri/project_manager/prj_loaders/vivado_loader';
import { Multi_project_manager } from '../../src/colibri/project_manager/multi_project_manager';
import { Logger } from '../../src/colibri/logger/logger';
import { SandpiperProjectManager } from '../../src/colibri/project_manager/tool/sandpiper/sandpiperProjectManager';
import { get_edam_json } from '../../src/colibri/project_manager/utils/utils';

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
        (runTaskNextpnr as jest.Mock).mockImplementation((_task, _definition, _logger, callback) => {
            callback(result);
            return process;
        });
        const callback = jest.fn();

        const returnedProcess = project_manager.runTask(taskType, logger, callback);

        expect(runTaskNextpnr).toHaveBeenCalledWith(taskType, expect.any(Object), logger, expect.any(Function));
        expect(returnedProcess).toBe(process);
        expect(callback).toHaveBeenCalledWith(result);
        expect(project_manager.getTaskState(taskType)).toBe(expectedState);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('restores watcher libraries and visual order after sequential reload', async () => {
        GlobalConfigManager.newInstance("");
        const firstPath = '/project/first.vhd';
        const secondPath = '/project/second.vhd';
        const calls: string[] = [];
        const source = (name: string): t_file => ({
                name,
                is_include_file: false,
                include_path: '',
                logical_name: 'work',
                is_manual: false,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2008,
                source_type: e_source_type.NONE,
            });
        jest.spyOn(file_utils, 'check_if_path_exist').mockReturnValue(true);
        jest.spyOn(vunit_loader, 'get_files_from_vunit').mockImplementation(async () => {
            calls.push('vunit-start');
            await Promise.resolve();
            calls.push('vunit-end');
            return { successful: true, msg: '', file_list: [source(firstPath)] };
        });
        jest.spyOn(vivado_loader, 'get_files_from_vivado').mockImplementation(async () => {
            calls.push('vivado-start');
            calls.push('vivado-end');
            return { successful: true, msg: '', file_list: [source(secondPath)] };
        });
        const saved = {
            ...project_manager.get_edam_json(),
            watchers: [
                { path: '/project/vunit.py', watcher_type: e_watcher_type.VUNIT },
                { path: '/project/vivado.xpr', watcher_type: e_watcher_type.VIVADO },
            ],
            teroshdl_state: {
                library_overrides: [{ name: firstPath, original_library: 'work', target_library: 'custom' }],
                visual_order: [JSON.stringify([secondPath, 'work']), JSON.stringify([firstPath, 'custom'])],
            },
        };

        const restored = await Project_manager.fromJson(saved, '/project/config.json', new ProjectEmitter(), '');

        expect(calls).toEqual(['vunit-start', 'vunit-end', 'vivado-start', 'vivado-end']);
        expect(restored.get_file().map(file => [file.name, file.logical_name])).toEqual([
            [secondPath, 'work'],
            [firstPath, 'custom'],
        ]);
    });

    test('loading a project without watchers preserves its automatic files', async () => {
        GlobalConfigManager.newInstance("");
        const file: t_file = {
            name: '/project/source.vhd',
            is_include_file: false,
            include_path: '',
            logical_name: 'work',
            is_manual: false,
            file_type: LANGUAGE.VHDL,
            file_version: VHDL_LANG_VERSION.v2008,
            source_type: e_source_type.NONE,
        };
        await project_manager.add_file(file);

        const restored = await Project_manager.fromJson(
            project_manager.get_edam_json(), '/project/config.json', new ProjectEmitter(), ''
        );

        expect(restored.get_file()).toEqual([file]);
    });

    test('serializes watcher refreshes and continues after a failure', async () => {
        let release: () => void;
        const gate = new Promise<void>(resolve => { release = resolve; });
        const calls: string[] = [];
        const watcherManager = new Watcher_manager(async path => {
            calls.push(`${path}-start`);
            if (path === 'first') {
                await gate;
                calls.push('first-end');
                throw new Error('reload failed');
            }
            calls.push('second-end');
        }, undefined);

        const first = watcherManager.refresh('first');
        const second = watcherManager.refresh('second');
        await Promise.resolve();
        expect(calls).toEqual(['first-start']);
        release();
        await expect(first).rejects.toThrow('reload failed');
        await second;
        expect(calls).toEqual(['first-start', 'first-end', 'second-start', 'second-end']);
    });

    test('reopens CSV watchers and removes only sources unique to deleted watchers', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-watcher-'));
        const firstWatcher = paht_lib.join(directory, 'first.csv');
        const secondWatcher = paht_lib.join(directory, 'second.csv');
        const firstSource = paht_lib.join(directory, 'first.vhd');
        const sharedSource = paht_lib.join(directory, 'shared.vhd');
        const manualSource = paht_lib.join(directory, 'manual.vhd');
        const configPath = paht_lib.join(directory, 'projects.json');
        const restoredProjects: Project_manager[] = [];

        try {
            for (const source of [firstSource, sharedSource, manualSource]) {
                fs.writeFileSync(source, '');
            }
            fs.writeFileSync(firstWatcher, 'work,first.vhd\nwork,shared.vhd\n');
            fs.writeFileSync(secondWatcher, 'work,shared.vhd\n');
            project_manager.add_logical('empty_library');
            await project_manager.add_file({
                name: manualSource,
                is_include_file: false,
                include_path: '',
                logical_name: 'work',
                is_manual: true,
                file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2008,
                source_type: e_source_type.NONE,
            });
            project_manager.add_file_to_watcher({ path: firstWatcher, watcher_type: e_watcher_type.CSV }, false);
            project_manager.add_file_to_watcher({ path: secondWatcher, watcher_type: e_watcher_type.CSV }, false);
            await project_manager.refresh_watchers();
            expect((await project_manager.move_file(firstSource, 'work', 'custom')).successful).toBe(true);
            expect((await project_manager.reorder_file(sharedSource, 'work', 0)).successful).toBe(true);
            const expected = project_manager.get_file().map(file => [file.name, file.logical_name]);

            const emitter = new ProjectEmitter();
            const manager = new Multi_project_manager(emitter, configPath);
            manager.add_project(project_manager);
            manager.save();
            const reopened = new Multi_project_manager(emitter, configPath);
            await reopened.load(emitter, directory);
            const restored = reopened.get_project_by_name(DEFAULT_NAME);
            restoredProjects.push(restored);
            expect(restored.get_file().map(file => [file.name, file.logical_name])).toEqual(expected);
            expect(restored.get_file().find(file => file.name === sharedSource)).toEqual(expect.objectContaining({
                origins: [e_file_origin.WATCHER],
                watcher_paths: [firstWatcher, secondWatcher],
            }));
            const externalEdam = get_edam_json(restored.get_project_definition(), undefined);
            expect(externalEdam.files.every(file => !('origins' in file) && !('watcher_paths' in file))).toBe(true);

            expect(restored.delete_file_in_watcher(firstWatcher).successful).toBe(true);
            await restored.refresh_watchers();
            expect(restored.get_file().map(file => file.name)).toEqual(['', sharedSource, manualSource]);
            expect(restored.delete_file_in_watcher(secondWatcher).successful).toBe(true);
            await restored.refresh_watchers();
            expect(restored.get_file().map(file => file.name)).toEqual(['', manualSource]);
            expect([firstSource, sharedSource, manualSource].every(source => fs.existsSync(source))).toBe(true);
        } finally {
            await project_manager['watchers']['watcher_manager'].close();
            for (const project of restoredProjects) {
                await project['watchers']['watcher_manager'].close();
            }
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });

    test('retains existing sources when a watcher is missing or fails to load', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-watcher-failure-'));
        const csvPath = paht_lib.join(directory, 'files.csv');
        const source = paht_lib.join(directory, 'source.vhd');
        let restored: Project_manager | undefined;
        try {
            fs.writeFileSync(csvPath, 'work,source.vhd\n');
            project_manager.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project_manager.refresh_watchers();
            expect(project_manager.get_file().map(file => file.name)).toEqual([source]);
            const saved = project_manager.get_edam_json();
            fs.renameSync(csvPath, `${csvPath}.missing`);
            await expect(project_manager.refresh_watchers()).rejects.toThrow('Watcher file does not exist');
            expect(project_manager.get_file().map(file => file.name)).toEqual([source]);
            const errorLog = jest.spyOn(Logger.logger, 'error').mockImplementation(() => {});
            restored = await Project_manager.fromJson(saved, paht_lib.join(directory, 'projects.json'),
                new ProjectEmitter(), directory);
            expect(restored.get_file().map(file => file.name)).toEqual([source]);
            expect(errorLog).toHaveBeenCalledWith(expect.stringContaining('Watcher file does not exist'));
            fs.renameSync(`${csvPath}.missing`, csvPath);
            await project_manager.refresh_watchers();
            expect(project_manager.get_file().map(file => file.name)).toEqual([source]);
        } finally {
            await project_manager['watchers']['watcher_manager'].close();
            if (restored !== undefined) {
                await restored['watchers']['watcher_manager'].close();
            }
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });

    test('keeps previous sources if a later watcher import fails', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-watcher-error-'));
        const csvPath = paht_lib.join(directory, 'files.csv');
        const vunitPath = paht_lib.join(directory, 'run.py');
        try {
            fs.writeFileSync(csvPath, 'work,original.vhd\n');
            fs.writeFileSync(vunitPath, '');
            project_manager.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project_manager.refresh_watchers();
            const previous = project_manager.get_file().map(file => file.name);
            fs.writeFileSync(csvPath, 'work,changed.vhd\n');
            project_manager.add_file_to_watcher({ path: vunitPath, watcher_type: e_watcher_type.VUNIT }, false);
            jest.spyOn(vunit_loader, 'get_files_from_vunit').mockResolvedValue({
                successful: false,
                msg: 'import failed',
                file_list: [],
            });

            await expect(project_manager.refresh_watchers()).rejects.toThrow('import failed');
            expect(project_manager.get_file().map(file => file.name)).toEqual(previous);
        } finally {
            await project_manager['watchers']['watcher_manager'].close();
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });

    test('rejects conflicting watcher metadata without applying any part of the refresh', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-watcher-conflict-'));
        const csvPath = paht_lib.join(directory, 'files.csv');
        const vunitPath = paht_lib.join(directory, 'run.py');
        const sharedSource = paht_lib.join(directory, 'shared.vhd');
        try {
            fs.writeFileSync(csvPath, 'work,original.vhd\n');
            fs.writeFileSync(vunitPath, '');
            project_manager.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project_manager.refresh_watchers();
            const previous = JSON.parse(JSON.stringify(project_manager.get_file()));
            fs.writeFileSync(csvPath, 'work,shared.vhd\n');
            project_manager.add_file_to_watcher({ path: vunitPath, watcher_type: e_watcher_type.VUNIT }, false);
            jest.spyOn(vunit_loader, 'get_files_from_vunit').mockResolvedValue({
                successful: true,
                msg: '',
                file_list: [{
                    name: sharedSource, logical_name: 'work', is_manual: false,
                    is_include_file: false, include_path: '', file_type: LANGUAGE.VHDL,
                    file_version: file_utils.get_default_version_for_filepath(sharedSource),
                    source_type: e_source_type.SIMULATION,
                }],
            });

            await expect(project_manager.refresh_watchers()).rejects.toThrow('Conflicting file metadata');
            expect(JSON.parse(JSON.stringify(project_manager.get_file()))).toEqual(previous);
        } finally {
            await project_manager['watchers']['watcher_manager'].close();
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });

    test('keeps sources when a watched CSV contains an invalid row', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-watcher-invalid-'));
        const csvPath = paht_lib.join(directory, 'files.csv');
        try {
            fs.writeFileSync(csvPath, 'work,original.vhd\n');
            project_manager.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project_manager.refresh_watchers();
            const previous = JSON.parse(JSON.stringify(project_manager.get_file()));
            fs.writeFileSync(csvPath, 'work,changed.vhd\nwork,bad,extra\n');

            await expect(project_manager.refresh_watchers()).rejects.toThrow('line 2');
            expect(JSON.parse(JSON.stringify(project_manager.get_file()))).toEqual(previous);
        } finally {
            await project_manager['watchers']['watcher_manager'].close();
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });

    test('retains a manually added watcher source and unrelated automatic sources', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-watcher-manual-'));
        const csvPath = paht_lib.join(directory, 'files.csv');
        try {
            fs.writeFileSync(csvPath, 'work,source.vhd\n');
            const unrelated: t_file = {
                name: paht_lib.join(directory, 'legacy.vhd'), logical_name: 'work', is_manual: false,
                is_include_file: false, include_path: '', file_type: LANGUAGE.VHDL,
                file_version: VHDL_LANG_VERSION.v2008, source_type: e_source_type.NONE,
            };
            await project_manager.add_file(unrelated);
            project_manager.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project_manager.refresh_watchers();
            const watched = project_manager.get_file().find(file => file.name !== unrelated.name);
            expect(watched).toBeDefined();
            if (watched === undefined) {
                throw new Error('Expected watcher source');
            }
            expect((await project_manager.add_file_from_array([{
                ...watched, is_manual: true, origins: undefined, watcher_paths: undefined,
            }])).successful)
                .toBe(true);
            project_manager.delete_file_in_watcher(csvPath);
            await project_manager.refresh_watchers();
            expect(project_manager.get_file().map(file => [file.name, file.is_manual])).toEqual([
                [unrelated.name, false],
                [watched.name, true],
            ]);
        } finally {
            await project_manager['watchers']['watcher_manager'].close();
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });

    test('preserves unknown legacy provenance when reopening and deleting its watcher', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-watcher-legacy-'));
        const csvPath = paht_lib.join(directory, 'files.csv');
        let restored: Project_manager | undefined;
        try {
            fs.writeFileSync(csvPath, 'work,source.vhd\n');
            project_manager.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project_manager.refresh_watchers();
            const legacy = JSON.parse(JSON.stringify(project_manager.get_edam_json()));
            delete legacy.teroshdl_state.file_origins;
            restored = await Project_manager.fromJson(legacy, paht_lib.join(directory, 'project.json'),
                new ProjectEmitter(), directory);
            restored.delete_file_in_watcher(csvPath);
            await restored.refresh_watchers();
            expect(restored.get_file()).toHaveLength(1);
            expect(restored.get_file()[0].origins).toEqual([e_file_origin.UNKNOWN]);
        } finally {
            await project_manager['watchers']['watcher_manager'].close();
            if (restored !== undefined) {
                await restored['watchers']['watcher_manager'].close();
            }
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });

    test('reconciles persisted watcher contributions when no watchers remain', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-watcher-reconcile-'));
        const csvPath = paht_lib.join(directory, 'files.csv');
        let restored: Project_manager | undefined;
        try {
            fs.writeFileSync(csvPath, 'work,source.vhd\n');
            project_manager.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project_manager.refresh_watchers();
            project_manager.delete_file_in_watcher(csvPath);
            const saved = project_manager.get_edam_json();
            restored = await Project_manager.fromJson(saved, paht_lib.join(directory, 'project.json'),
                new ProjectEmitter(), directory);
            expect(restored.get_file()).toHaveLength(0);
        } finally {
            await project_manager['watchers']['watcher_manager'].close();
            if (restored !== undefined) {
                await restored['watchers']['watcher_manager'].close();
            }
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });

    test('restores Sandpiper watcher provenance before refreshing', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-sandpiper-watcher-'));
        const csvPath = paht_lib.join(directory, 'files.csv');
        const project = new SandpiperProjectManager('sandpiper', new ProjectEmitter(), directory);
        let restored: SandpiperProjectManager | undefined;
        try {
            fs.writeFileSync(csvPath, 'work,source.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();
            restored = await SandpiperProjectManager.fromJson(project.get_edam_json(),
                paht_lib.join(directory, 'project.json'), new ProjectEmitter());
            expect(restored.get_file()[0].watcher_paths).toEqual([csvPath]);
            restored.delete_file_in_watcher(csvPath);
            await restored.refresh_watchers();
            expect(restored.get_file()).toHaveLength(0);
        } finally {
            await project['watchers']['watcher_manager'].close();
            if (restored !== undefined) {
                await restored['watchers']['watcher_manager'].close();
            }
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });

    test('reloads sources when a watched CSV changes on disk', async () => {
        GlobalConfigManager.newInstance("");
        const directory = fs.mkdtempSync(paht_lib.join(os.tmpdir(), 'teros-watcher-event-'));
        const csvPath = paht_lib.join(directory, 'files.csv');
        const emitter = new ProjectEmitter();
        const watchedProject = new Project_manager('watched', '', emitter, undefined);
        try {
            fs.writeFileSync(csvPath, 'work,first.vhd\n');
            watchedProject.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await new Promise<void>(resolve => watchedProject['watchers']['watcher_manager'].once('ready', resolve));
            await watchedProject.refresh_watchers();
            emitter.enable();
            const reloaded = new Promise<void>((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error('Watcher change event timed out')), 10000);
                emitter.addProjectListener(async (_name, event) => {
                    if (event === e_event.ADD_SOURCE) {
                        clearTimeout(timer);
                        resolve();
                    }
                });
            });
            fs.writeFileSync(csvPath, 'work,second.vhd\n');
            await reloaded;
            expect(watchedProject.get_file().map(file => file.name)).toEqual([
                paht_lib.join(directory, 'second.vhd'),
            ]);
        } finally {
            await watchedProject['watchers']['watcher_manager'].close();
            fs.rmSync(directory, { recursive: true, force: true });
        }
    }, 15000);

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