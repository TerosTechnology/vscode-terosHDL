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

import { GlobalConfigManager } from "../../src/colibri/config/config_manager";
import { p_result } from "../../src/colibri/process/common";
import { Process } from "../../src/colibri/process/process";
import { ProjectEmitter } from "../../src/colibri/project_manager/projectEmitter";
import { QuartusProjectManager } from "../../src/colibri/project_manager/tool/quartus/quartusProjectManager";
import * as quartusUtils from "../../src/colibri/project_manager/tool/quartus/utils";
import * as quartusDB from "../../src/colibri/project_manager/tool/quartus/quartusDB";
import { e_file_origin, e_source_type, e_watcher_type, t_file } from "../../src/colibri/project_manager/common";
import { e_tools_quartus_optimization_mode } from "../../src/colibri/config/config_declaration";
import { LANGUAGE } from "../../src/colibri/common/general";
import { get_default_version_for_filepath } from "../../src/colibri/utils/file_utils";
import { Logger } from "../../src/colibri/logger/logger";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";


const DEFAULT_NAME = "def_name";
const CATEGORY_A = "category_a";
const CATEGORY_B = "category_b";
const CATEGORY_C = "category_c";
const FAMILY_A = "test_family_a";
const FAMILY_B = "test_family_b";
const FAMILY_C = "test_family_c";
const COMPONENT_A = "component_a";
const COMPONENT_B = "component_b";
const DISPLAY_NAME = "display_";

describe('quartusProjectManager', () => {
    let project_manager: QuartusProjectManager;

    beforeEach(() => {
        // Config setup
        try {
            GlobalConfigManager.getInstance();
        } catch (error) {
            GlobalConfigManager.newInstance("");
        }
        // Create project
        project_manager = new QuartusProjectManager(DEFAULT_NAME, "", "", new ProjectEmitter());
        // Mock project info
        const config = project_manager.get_config();
        config.tools.quartus.family = FAMILY_A;
        project_manager.set_config(config);
    });

    describe('Quartus source provenance', () => {
        let directory: string;
        let projectPath: string;
        let project: QuartusProjectManager;
        let quartusFiles: t_file[];
        let getInfo: jest.SpyInstance;
        let addFiles: jest.SpyInstance;
        let removeFiles: jest.SpyInstance;
        const restoredProjects: QuartusProjectManager[] = [];

        const source = (name: string, logical_name = 'work'): t_file => {
            const filename = path.join(directory, name);
            return {
                name: filename, logical_name, is_manual: false,
                is_include_file: false, include_path: '', file_type: LANGUAGE.VHDL,
                file_version: get_default_version_for_filepath(filename), source_type: e_source_type.NONE,
            };
        };

        beforeEach(async () => {
            GlobalConfigManager.newInstance("");
            directory = fs.mkdtempSync(path.join(os.tmpdir(), 'teros-quartus-origins-'));
            projectPath = path.join(directory, 'project.qsf');
            fs.writeFileSync(projectPath, '');
            fs.writeFileSync(path.join(directory, 'shared.vhd'), '');
            quartusFiles = [source('shared.vhd')];
            getInfo = jest.spyOn(quartusUtils, 'getProjectInfo').mockImplementation(async () => ({
                name: 'project', currentRevision: 'project', topEntity: '', revisionList: ['project'],
                family: '', part: '', optimization_mode: e_tools_quartus_optimization_mode.BALANCED,
                allow_register_retiming: false, eda_test_bench_file_list: [], eda_test_bench_top_module: '',
                file_list: quartusFiles.map(file => ({ ...file })),
            }));
            addFiles = jest.spyOn(quartusUtils, 'addFilesToProject').mockImplementation(async (_config, _path, files) => {
                quartusFiles.push(...files.map(file => ({ ...file, is_manual: false })));
            });

            removeFiles = jest.spyOn(quartusUtils, 'removeFilesFromProject')
                .mockImplementation(async (_config, _path, files) => {
                    quartusFiles = quartusFiles.filter(existing => !files.some(file =>
                        existing.name === file.name && existing.logical_name === file.logical_name
                    ));
                });
            jest.spyOn(quartusDB, 'setStatus').mockResolvedValue();
            project = await QuartusProjectManager.fromExistingQuartusProject(
                GlobalConfigManager.getInstance().get_config(), projectPath, new ProjectEmitter());
        });

        afterEach(async () => {
            for (const instance of [project, ...restoredProjects]) {
                await instance['watchers']['watcher_manager'].close();
                await instance['quartusStatusWatcher']?.close();
            }
            restoredProjects.length = 0;
            jest.restoreAllMocks();
            fs.rmSync(directory, { recursive: true, force: true });
        });

        test('sync removes only Quartus contributions and keeps watcher and manual sources', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,shared.vhd\nwork,watcher.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();
            const manual = { ...source('manual.vhd'), is_manual: true };
            expect((await project.add_file(manual)).successful).toBe(true);

            quartusFiles = [];
            await project.syncWithDisk();
            expect(project.get_file().map(file => file.name)).toEqual([
                source('shared.vhd').name, source('watcher.vhd').name, manual.name,
            ]);
            expect(project.get_file()[0].origins).toEqual([e_file_origin.WATCHER]);
            expect(project.get_file()[2].is_manual).toBe(true);
            expect(project.get_file()[2].origins).toEqual([]);
        });

        test('removes the original Quartus assignment after a visual move, preserving other origins', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,shared.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();
            expect((await project.add_file({ ...source('shared.vhd'), is_manual: true })).successful).toBe(true);
            expect(addFiles).not.toHaveBeenCalled();
            expect((await project.move_file(source('shared.vhd').name, 'work', 'custom')).successful).toBe(true);
            await project.syncWithDisk();
            expect(project.get_file()[0].logical_name).toBe('custom');

            expect((await project.delete_file(source('shared.vhd').name, 'custom')).successful).toBe(true);
            expect(removeFiles).toHaveBeenCalledWith(
                expect.anything(), projectPath,
                [expect.objectContaining({ name: source('shared.vhd').name, logical_name: 'work' })],
                expect.anything()
            );
            expect(project.get_file()[0]).toEqual(expect.objectContaining({
                logical_name: 'custom', is_manual: true, origins: [e_file_origin.WATCHER], watcher_paths: [csvPath],
            }));
            project.delete_file_in_watcher(csvPath);
            await project.refresh_watchers();
            expect(project.get_file()).toHaveLength(1);
            expect(project.get_file()[0].is_manual).toBe(true);
            expect((await project.delete_file(source('shared.vhd').name, 'custom')).successful).toBe(true);
            expect(project.get_file()).toHaveLength(0);
            expect(removeFiles).toHaveBeenCalledTimes(1);
            expect(fs.existsSync(source('shared.vhd').name)).toBe(true);
        });

        test('removing the remaining manual contribution preserves a watcher contribution', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,shared.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();
            await project.add_file({ ...source('shared.vhd'), is_manual: true });

            expect((await project.delete_file(source('shared.vhd').name, 'work')).successful).toBe(true);
            expect((await project.delete_file(source('shared.vhd').name, 'work')).successful).toBe(true);
            expect(project.get_file()[0]).toEqual(expect.objectContaining({
                is_manual: false, origins: [e_file_origin.WATCHER], watcher_paths: [csvPath],
            }));
            expect(removeFiles).toHaveBeenCalledTimes(1);
        });

        test('validates conflicts before modifying Quartus and retains sources on Quartus failures', async () => {
            const conflict = { ...source('shared.vhd'), is_manual: true, source_type: e_source_type.SIMULATION };
            const before = JSON.parse(JSON.stringify(project.get_file()));
            const result = await project.add_file(conflict);
            expect(result.successful).toBe(false);
            expect(result.msg).toContain('Conflicting file metadata');
            expect(addFiles).not.toHaveBeenCalled();
            addFiles.mockRejectedValueOnce(new Error('Quartus write failed'));
            await expect(project.add_file({ ...source('new.vhd'), is_manual: true })).rejects.toThrow('Quartus write failed');
            getInfo.mockRejectedValueOnce(new Error('Quartus read failed'));
            await expect(project.syncWithDisk()).rejects.toThrow('Quartus read failed');
            expect(JSON.parse(JSON.stringify(project.get_file()))).toEqual(before);
        });

        test('does not send duplicate source assignments to Quartus', async () => {
            const file = { ...source('new.vhd'), is_manual: true };
            expect((await project.add_file_from_array([file, file])).successful).toBe(true);
            expect(addFiles).toHaveBeenCalledWith(
                expect.anything(), projectPath, [file], expect.anything()
            );
            expect(project.get_file().filter(item => item.name === file.name)).toHaveLength(1);
        });

        test('restores Quartus, watcher provenance, visual order and overrides without writing to Quartus', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,shared.vhd\nwork,watcher.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();
            await project.move_file(source('shared.vhd').name, 'work', 'custom');
            const saved = JSON.parse(JSON.stringify(project.get_edam_json()));
            saved.configuration.general.general.pypath = '/saved/python';
            const setConfig = jest.spyOn(quartusUtils, 'setConfigToProject');
            const restored = await QuartusProjectManager.fromJson(saved, path.join(directory, 'projects.json'),
                new ProjectEmitter());
            restoredProjects.push(restored);

            expect(addFiles).not.toHaveBeenCalled();
            expect(setConfig).not.toHaveBeenCalled();
            expect(restored.get_config().general.general.pypath).toBe('/saved/python');
            expect(restored.get_file().map(file => [file.name, file.logical_name])).toEqual([
                [source('shared.vhd').name, 'custom'], [source('watcher.vhd').name, 'work'],
            ]);
            expect(restored.get_file()[0].origins).toEqual(expect.arrayContaining([
                e_file_origin.QUARTUS, e_file_origin.WATCHER,
            ]));
            await restored.syncWithDisk();
            expect(restored.get_file().map(file => file.logical_name)).toEqual(['custom', 'work']);
            restored.delete_file_in_watcher(csvPath);
            await restored.refresh_watchers();
            expect(restored.get_file().map(file => [file.name, file.logical_name])).toEqual([
                [source('shared.vhd').name, 'custom'],
            ]);
        });

        test('reports a source with no Quartus contribution instead of deleting a watcher source', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,watcher.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();
            const result = await project.delete_file(source('watcher.vhd').name, 'work');
            expect(result.successful).toBe(false);
            expect(result.msg).toContain('No Quartus or manual contribution');
            expect(project.get_file().some(file => file.name === source('watcher.vhd').name)).toBe(true);
            expect(removeFiles).not.toHaveBeenCalled();
        });

        test('deleting a library removes only its Quartus contributions', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,shared.vhd\nwork,watcher.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();

            expect((await project.delete_file_by_logical_name('work')).successful).toBe(true);
            expect(removeFiles).toHaveBeenCalledTimes(1);
            expect(project.get_file().map(file => file.name)).toEqual([
                source('shared.vhd').name, source('watcher.vhd').name,
            ]);
            expect(project.get_file()[0].origins).toEqual([e_file_origin.WATCHER]);
        });

        test('deleting a library removes its empty marker when no sources remain', async () => {
            project.add_logical('work');
            expect((await project.delete_file_by_logical_name('work')).successful).toBe(true);
            expect(project.get_file()).toHaveLength(0);
        });

        test('does not apply Quartus synchronization when shared metadata conflicts', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,shared.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();
            const before = JSON.parse(JSON.stringify(project.get_file()));
            quartusFiles = [{ ...source('shared.vhd'), source_type: e_source_type.SIMULATION }];

            await expect(project.syncWithDisk()).rejects.toThrow('Conflicting file metadata');
            expect(JSON.parse(JSON.stringify(project.get_file()))).toEqual(before);
        });

        test('opens the saved project without losing sources when Quartus metadata conflicts', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,shared.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();
            const saved = JSON.parse(JSON.stringify(project.get_edam_json()));
            quartusFiles = [{ ...source('shared.vhd'), source_type: e_source_type.SIMULATION }];
            const errorLog = jest.spyOn(Logger.logger, 'error').mockImplementation(() => {});

            const restored = await QuartusProjectManager.fromJson(saved, path.join(directory, 'projects.json'),
                new ProjectEmitter());
            restoredProjects.push(restored);
            expect(restored.get_file()[0].source_type).toBe(e_source_type.NONE);
            expect(restored.get_file()[0].origins).toEqual(expect.arrayContaining([
                e_file_origin.QUARTUS, e_file_origin.WATCHER,
            ]));
            expect(errorLog).toHaveBeenCalledWith(expect.stringContaining('Conflicting file metadata'));
        });

        test('updates Quartus testbench assignments only for Quartus sources', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,watcher.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            await project.refresh_watchers();
            const setTestbench = jest.spyOn(quartusUtils, 'setTestbenchFileList').mockResolvedValue();

            await project.modifyFileSourceType(source('watcher.vhd').name, 'work', e_source_type.SIMULATION);
            expect(setTestbench).not.toHaveBeenCalled();
            await project.move_file(source('shared.vhd').name, 'work', 'custom');
            await project.modifyFileSourceType(source('shared.vhd').name, 'custom', e_source_type.SIMULATION);
            expect(setTestbench).toHaveBeenCalledWith(
                expect.anything(), projectPath,
                [expect.objectContaining({ name: source('shared.vhd').name, logical_name: 'work' })], expect.anything()
            );
            setTestbench.mockRejectedValueOnce(new Error('Quartus write failed'));
            await expect(project.modifyFileSourceType(source('shared.vhd').name, 'custom', e_source_type.NONE))
                .rejects.toThrow('Quartus write failed');
            expect(project.get_file().find(file => file.name === source('shared.vhd').name)?.source_type)
                .toBe(e_source_type.SIMULATION);
        });

        test('serializes watcher refreshes with an in-flight Quartus sync', async () => {
            const csvPath = path.join(directory, 'files.csv');
            fs.writeFileSync(csvPath, 'work,shared.vhd\n');
            project.add_file_to_watcher({ path: csvPath, watcher_type: e_watcher_type.CSV }, false);
            const info = await quartusUtils.getProjectInfo(project.get_config(), projectPath, new ProjectEmitter());
            let release: () => void = () => {};
            let signalStarted: () => void = () => {};
            const started = new Promise<void>(resolve => { signalStarted = resolve; });
            const gate = new Promise<void>(resolve => { release = resolve; });
            getInfo.mockImplementationOnce(async () => {
                signalStarted();
                await gate;
                return info;
            });

            const sync = project.syncWithDisk();
            await started;
            const refresh = project.refresh_watchers();
            expect(project.get_file()[0].origins).toEqual([e_file_origin.QUARTUS]);
            release();
            await Promise.all([sync, refresh]);
            expect(project.get_file()[0].origins).toEqual([e_file_origin.QUARTUS, e_file_origin.WATCHER]);
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('rejects malformed Quartus file listings instead of returning an empty source list', async () => {
        const process = jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async command => {
            const outputPath = command.match(/ -t "[^"]+" "([^"]+)"/)?.[1];
            if (outputPath === undefined) {
                throw new Error('Quartus output path not found');
            }
            fs.writeFileSync(outputPath, 'project,revision,,,,BALANCED,OFF,\nrevision\n\nwork,bad,extra\n');
            return { command, stdout: '', stderr: '', return_value: 0, successful: true };
        });
        try {
            await expect(quartusUtils.getProjectInfo(
                GlobalConfigManager.getInstance().get_config(), '/project/project.qsf', new ProjectEmitter()
            )).rejects.toThrow('Error processing CSV');
        } finally {
            process.mockRestore();
        }
    });

    it("should handle an empty catalog without raising an exception", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(0);
    });

    it("should handle an empty file without raising an exception", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: "",
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(0);
    });

    describe('should add a component', () => {

        it("with one category", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A} /// ${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);
            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);
            expect(ip_list[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        });

        it("with two categories", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);
            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(1);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A]);

        });

        it("with no supported family", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(0);

        });

        it("with another supported family", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(0);

        });

        it("with invalid supported family format", async () => {
            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}//${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(0);

        });


        it("without name nor display", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name=""
                                displayName=""
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);
            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);
            expect(ip_list[0].children[0].name).toBe("");
            expect(ip_list[0].children[0].display_name).toBe("");
            expect(ip_list[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        });

        it("without category", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name=""
                                displayName=""
                                categories=""
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);
            expect(ip_list[0].name).toBe("");
            expect(ip_list[0].display_name).toBe("");
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);
            expect(ip_list[0].children[0].name).toBe("");
            expect(ip_list[0].children[0].display_name).toBe("");
            expect(ip_list[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        });

    });

    it("should ignore a component with hide from quartus", async () => {

        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="true" />
                        </component>
                    </catalog>
                `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(0);


    });

    it("should ignore a component without hide from quartus param", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                        </component>
                    </catalog>
                `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(0);

    });

    describe("should add multiple components", () => {

        it("in same category", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                        <component
                                name="${COMPONENT_B}"
                                displayName="${DISPLAY_NAME}${COMPONENT_B}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);

            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(2);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

            expect(ip_list[0].children[0].children[1].name).toBe(COMPONENT_B);
            expect(ip_list[0].children[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
            expect(ip_list[0].children[0].children[1].is_group).toBe(false);
            expect(ip_list[0].children[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);
        });


        it("in a category with the same name but different level", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                        <component
                                name="${COMPONENT_B}"
                                displayName="${DISPLAY_NAME}${COMPONENT_B}"
                                categories="${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(2);

            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(1);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

            expect(ip_list[1].children[0].name).toBe(COMPONENT_B);
            expect(ip_list[1].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
            expect(ip_list[1].children[0].is_group).toBe(false);
            expect(ip_list[1].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);
        });


        it("in a different category", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                        <component
                                name="${COMPONENT_B}"
                                displayName="${DISPLAY_NAME}${COMPONENT_B}"
                                categories="${CATEGORY_C}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(2);

            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(1);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(1);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

            expect(ip_list[1].name).toBe(CATEGORY_C);
            expect(ip_list[1].display_name).toBe(CATEGORY_C);
            expect(ip_list[1].is_group).toBe(true);
            expect(ip_list[1].children.length).toBe(1);

            expect(ip_list[1].children[0].name).toBe(COMPONENT_B);
            expect(ip_list[1].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
            expect(ip_list[1].children[0].is_group).toBe(false);
            expect(ip_list[1].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);
        });


        it("in a category with different level", async () => {

            jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
                command: "",
                stdout: `
                    <catalog>
                        <component
                                name="${COMPONENT_A}"
                                displayName="${DISPLAY_NAME}${COMPONENT_A}"
                                categories="${CATEGORY_A}/${CATEGORY_B}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                        <component
                                name="${COMPONENT_B}"
                                displayName="${DISPLAY_NAME}${COMPONENT_B}"
                                categories="${CATEGORY_A}"
                                factory="">
                            <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                            <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                        </component>
                    </catalog>
                `,
                stderr: "",
                return_value: 0,
                successful: true,
            });

            const ip_list = await project_manager.getIpCatalog();

            expect(ip_list.length).toBe(1);

            expect(ip_list[0].name).toBe(CATEGORY_A);
            expect(ip_list[0].display_name).toBe(CATEGORY_A);
            expect(ip_list[0].is_group).toBe(true);
            expect(ip_list[0].children.length).toBe(2);

            expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
            expect(ip_list[0].children[0].is_group).toBe(true);
            expect(ip_list[0].children[0].children.length).toBe(1);

            expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
            expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
            expect(ip_list[0].children[0].children[0].is_group).toBe(false);
            expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

            expect(ip_list[0].children[1].name).toBe(COMPONENT_B);
            expect(ip_list[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
            expect(ip_list[0].children[1].is_group).toBe(false);
            expect(ip_list[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);
        });

    });

    it("should add a plugin", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <plugin
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A} /// ${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(1);
        expect(ip_list[0].name).toBe(CATEGORY_A);
        expect(ip_list[0].display_name).toBe(CATEGORY_A);
        expect(ip_list[0].is_group).toBe(true);
        expect(ip_list[0].children.length).toBe(1);
        expect(ip_list[0].children[0].name).toBe(COMPONENT_A);
        expect(ip_list[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
        expect(ip_list[0].children[0].is_group).toBe(false);
        expect(ip_list[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

    });

    it("should add multiple plugins", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <plugin
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                    <plugin
                            name="${COMPONENT_B}"
                            displayName="${DISPLAY_NAME}${COMPONENT_B}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(1);

        expect(ip_list[0].name).toBe(CATEGORY_A);
        expect(ip_list[0].display_name).toBe(CATEGORY_A);
        expect(ip_list[0].is_group).toBe(true);
        expect(ip_list[0].children.length).toBe(1);

        expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].is_group).toBe(true);
        expect(ip_list[0].children[0].children.length).toBe(2);

        expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
        expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
        expect(ip_list[0].children[0].children[0].is_group).toBe(false);
        expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        expect(ip_list[0].children[0].children[1].name).toBe(COMPONENT_B);
        expect(ip_list[0].children[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
        expect(ip_list[0].children[0].children[1].is_group).toBe(false);
        expect(ip_list[0].children[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);


    });

    it("should add components and plugins in the same catalog and category", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <plugin
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                    <component
                            name="${COMPONENT_B}"
                            displayName="${DISPLAY_NAME}${COMPONENT_B}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </component>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(1);

        expect(ip_list[0].name).toBe(CATEGORY_A);
        expect(ip_list[0].display_name).toBe(CATEGORY_A);
        expect(ip_list[0].is_group).toBe(true);
        expect(ip_list[0].children.length).toBe(1);

        expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].is_group).toBe(true);
        expect(ip_list[0].children[0].children.length).toBe(2);

        expect(ip_list[0].children[0].children[1].name).toBe(COMPONENT_A);
        expect(ip_list[0].children[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
        expect(ip_list[0].children[0].children[1].is_group).toBe(false);
        expect(ip_list[0].children[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_B);
        expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
        expect(ip_list[0].children[0].children[0].is_group).toBe(false);
        expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);

    });


    it("should handle multiple catalogs", async () => {
        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <plugin
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </plugin>
                </catalog>
                <catalog>
                    <component
                            name="${COMPONENT_B}"
                            displayName="${DISPLAY_NAME}${COMPONENT_B}"
                            categories="${CATEGORY_A}/${CATEGORY_B}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A}///${FAMILY_C}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </component>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list = await project_manager.getIpCatalog();

        expect(ip_list.length).toBe(1);

        expect(ip_list[0].name).toBe(CATEGORY_A);
        expect(ip_list[0].display_name).toBe(CATEGORY_A);
        expect(ip_list[0].is_group).toBe(true);
        expect(ip_list[0].children.length).toBe(1);

        expect(ip_list[0].children[0].name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].display_name).toBe(CATEGORY_B);
        expect(ip_list[0].children[0].is_group).toBe(true);
        expect(ip_list[0].children[0].children.length).toBe(2);

        expect(ip_list[0].children[0].children[0].name).toBe(COMPONENT_A);
        expect(ip_list[0].children[0].children[0].display_name).toBe(DISPLAY_NAME + COMPONENT_A);
        expect(ip_list[0].children[0].children[0].is_group).toBe(false);
        expect(ip_list[0].children[0].children[0].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_B]);

        expect(ip_list[0].children[0].children[1].name).toBe(COMPONENT_B);
        expect(ip_list[0].children[0].children[1].display_name).toBe(DISPLAY_NAME + COMPONENT_B);
        expect(ip_list[0].children[0].children[1].is_group).toBe(false);
        expect(ip_list[0].children[0].children[1].supportedDeviceFamily).toEqual([FAMILY_A, FAMILY_C]);

    });


    it("not should clean up the ip catalog list when it's empty and there was a previous one", async () => {

        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
                <catalog>
                    <component
                            name="${COMPONENT_A}"
                            displayName="${DISPLAY_NAME}${COMPONENT_A}"
                            categories="${CATEGORY_A}"
                            factory="">
                        <tag2 key="SUPPORTED_DEVICE_FAMILIES" value="${FAMILY_A} /// ${FAMILY_B}" />
                        <tag2 key="COMPONENT_HIDE_FROM_QUARTUS" value="false" />
                    </component>
                </catalog>
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list_0 = await project_manager.getIpCatalog();

        expect(ip_list_0.length).toBe(1);

        jest.spyOn(Process.prototype, 'exec_wait').mockImplementation(async (..._args) => <p_result>{
            command: "",
            stdout: `
            `,
            stderr: "",
            return_value: 0,
            successful: true,
        });

        const ip_list_1 = await project_manager.getIpCatalog();

        expect(ip_list_1.length).toBe(1);


    });


});

