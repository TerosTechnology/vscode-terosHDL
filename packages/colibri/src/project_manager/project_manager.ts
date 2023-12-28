/* eslint-disable max-len */
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

import {
    t_file, t_action_result, t_watcher,
    e_watcher_type,
    e_project_type,
    t_timing_path,
    e_source_type,
    e_timing_mode
} from "./common";
import * as  manager_watcher from "./list_manager/watcher";
import * as  manager_file from "./list_manager/file";
import * as  manager_hook from "./list_manager/hook";
import * as  manager_parameter from "./list_manager/parameter";
import * as  manager_toplevel_path from "./list_manager/toplevel_path";
import * as  manager_dependency from "./dependency/dependency";
import { Tool_manager } from "./tool/tools_manager";
import {
    t_test_declaration, t_test_result, e_clean_step, e_taskType, t_test_artifact,
    e_reportType,
    e_taskState,
    t_ipCatalogRep
} from "./tool/common";
import { t_project_definition } from "./project_definition";
import * as file_utils from "../utils/file_utils";
import * as hdl_utils from "../utils/hdl_utils";
import { ConfigManager, GlobalConfigManager } from "../config/config_manager";
import { e_config, e_tools_general_select_tool, get_config_from_json, get_default_config } from "../config/config_declaration";
import * as utils from "./utils/utils";
import * as python from "../process/python";
import { l_error } from "../linter/common";
import { Linter } from "../linter/linter";
import { t_linter_name, l_options } from "../linter/common";
import { get_files_from_csv } from "./prj_loaders/csv_loader";
import { get_files_from_vivado } from "./prj_loaders/vivado_loader";
import { get_files_from_vunit } from "./prj_loaders/vunit_loader";
import { t_taskRep } from "./tool/common";
import { ChildProcess } from "child_process";
import { p_result } from "../process/common";
import { TaskStateManager } from "./tool/taskState";
import { ProjectEmitter, e_event } from "./projectEmitter";
import { LANGUAGE } from "../common/general";
import { basename } from "path";

export class Project_manager extends ConfigManager {
    /**  Name of the project */
    private name: string;
    /** Path of the project */
    public _projectDiskPath = "";
    /** Contains all the HDL source files, constraint files, vendor IP description files, 
     * memory initialization files etc. for the project. */
    private files = new manager_file.File_manager();
    /** File watcher. */
    private watchers: manager_watcher.Watcher_manager;
    /** A dictionary of extra commands to execute at various stages of the project build/run. */
    private hooks = new manager_hook.Hook_manager();
    /** Specifies build- and run-time parameters, such as plusargs, VHDL generics, Verilog defines etc. */
    private parameters = new manager_parameter.Parameter_manager();
    /** Toplevel path(s) for the project. */
    private toplevel_path = new manager_toplevel_path.Toplevel_path_manager();
    private tools_manager = new Tool_manager(undefined);
    protected emitterProject: ProjectEmitter;
    /** Linter */
    private linter = new Linter();
    private _taskStateManager: TaskStateManager = new TaskStateManager([]);

    constructor(name: string, emitterProject: ProjectEmitter) {
        super(get_undefined_config());
        this.name = name;
        this.emitterProject = emitterProject;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const selfm = this;
        this.watchers = new manager_watcher.Watcher_manager((function () {
            selfm.files.clear_automatic_files();
            selfm.watchers.get().forEach(async (watcher: any) => {
                if (file_utils.check_if_path_exist(watcher.path)) {
                    if (selfm.emitterProject !== undefined) {
                        selfm.emitterProject.emitEvent(selfm.name, e_event.WATCHER_LOADING);
                    }
                    if (watcher.watcher_type === e_watcher_type.CSV) {
                        selfm.add_file_from_csv(watcher.path, false);
                    }
                    else if (watcher.watcher_type === e_watcher_type.VUNIT) {
                        await selfm.add_file_from_vunit(watcher.path, false);
                    }
                    else if (watcher.watcher_type === e_watcher_type.VIVADO) {
                        await selfm.add_file_from_vivado(watcher.path, false);
                    }
                    if (selfm.emitterProject !== undefined) {
                        selfm.emitterProject.emitEvent(selfm.name, e_event.ADD_SOURCE);
                        selfm.emitterProject.emitEvent(selfm.name, e_event.WATCHER_FINISHED);
                    }
                }
            });
        }), emitterProject);
    }

    set taskStateManager(taskStateManager: TaskStateManager) {
        this._taskStateManager = taskStateManager;
    }

    get taskStateManager(): TaskStateManager {
        return this._taskStateManager;
    }

    set projectDiskPath(projectDiskPath: string) {
        this._projectDiskPath = projectDiskPath;
    }

    get projectDiskPath(): string {
        return this._projectDiskPath;
    }

    /**
     * Get project type
     * @returns Project type
     */
    public getProjectType(): e_project_type {
        return e_project_type.GENERIC;
    }

    public get_name() {
        return this.name;
    }

    public rename(name: string) {
        this.name = name;
        this.emitterProject.emitEvent(this.name, e_event.RENAME_PROJECT);
    }

    get_watcher_type(path: string): e_watcher_type {
        let watcher_type = e_watcher_type.CSV;
        this.watchers.get().forEach(watcher => {
            if (watcher.path === path) {
                watcher_type = watcher.watcher_type;
            }
        });
        return watcher_type;
    }

    protected async notifyChanged(): Promise<void> {
        this.emitterProject.emitEvent(this.name, e_event.GLOBAL_REFRESH);
    }

    protected async notifyProjectChanged(): Promise<void> {
        this.emitterProject.emitEvent(this.name, e_event.PROJECT_CHANGED);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public async syncWithDisk(): Promise<void> {
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////
    public getRunTitle(): string {
        const currentTool = this.get_config().tools.general.select_tool;
        const notTestbencheTool = [
            e_tools_general_select_tool.icestorm,
            e_tools_general_select_tool.ise,
            e_tools_general_select_tool.openfpga,
            e_tools_general_select_tool.quartus,
            e_tools_general_select_tool.vivado,
            e_tools_general_select_tool.raptor,
        ];

        if (notTestbencheTool.includes(currentTool)) {
            return "DESIGN UNITS";
        }
        return "TESTBENCHES";
    }

    ////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////
    static async fromJson(jsonContent: any, reference_path: string, emitterProject: ProjectEmitter): Promise<Project_manager> {
        const prj = new Project_manager(jsonContent.name, emitterProject);
        // Files
        jsonContent.files.forEach((file: any) => {
            const name = file_utils.get_absolute_path(file_utils.get_directory(reference_path), file.name);

            const is_include_file = file?.["is_include_file"] ?? false;
            const include_path = file?.["include_path"] ?? "";
            const logical_name = file?.["logical_name"] ?? "";
            const is_manual = file?.["is_manual"] ?? true;
            const file_type = file_utils.get_language_from_filepath(name);
            const file_version = file_utils.check_default_version_for_filepath(name, file.file_version);
            const source_type = file?.["is_manual"] ?? e_source_type.NONE;

            prj.add_file({
                name: name, is_include_file: is_include_file,
                include_path: include_path, logical_name: logical_name,
                is_manual: is_manual, file_type: file_type,
                file_version: file_version,
                source_type: source_type,
            });
        });
        // Toplevel

        if (jsonContent.toplevel !== undefined) {
            const toplevel_path = file_utils.get_absolute_path(file_utils.get_directory(reference_path),
                jsonContent.toplevel);
            if (file_utils.check_if_path_exist(toplevel_path)) {
                prj.add_toplevel_path(toplevel_path);
            }
        }

        // Watchers
        const watcher_list = jsonContent?.["watchers"] ?? [];
        watcher_list.forEach((watcher: any) => {
            prj.add_file_to_watcher(watcher);
        });

        if (jsonContent?.["configuration"] !== undefined) {
            await prj.set_config(get_config_from_json(jsonContent?.["configuration"]));
        }

        return prj;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Linter
    ////////////////////////////////////////////////////////////////////////////
    public async lint_from_file(file_path: string, linter_name: t_linter_name,
        options: l_options): Promise<l_error[]> {

        if (this.check_if_path_in_project(file_path) === false) {
            return await this.linter.lint_from_file(linter_name, file_path, options);
        }
        return await this.linter.lint_from_project(file_path, this.files.get(), linter_name, options);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Toplevel
    ////////////////////////////////////////////////////////////////////////////
    /**
     * Add top level path to project from entity. Delete de previous one.
     * @param toplevel_path_inst Top level entity to add.
     * @returns Operation result
    **/
    public async add_toplevel_path_from_entity(entity_name: string): Promise<t_action_result> {
        const file_list = this.files.get();
        for (const file of file_list) {
            const entity_name_of_file = hdl_utils.get_toplevel_from_path(file.name);
            if (entity_name_of_file === entity_name) {
                this.toplevel_path.clear();
                const result = this.add_toplevel_path(file.name);
                this.emitterProject.emitEvent(this.name, e_event.SELECT_TOPLEVEL);
                return result;
            }
        }
        this.emitterProject.emitEvent(this.name, e_event.SELECT_TOPLEVEL);
        return {
            result: undefined,
            successful: false,
            msg: "Entity not found."
        };
    }

    /**
     * Add testbench path to project. Delete de previous one.
     * @param toplevel_path_inst Top level path to add.
     * @returns Operation result
    **/
    public async setTestbench(filePath: string): Promise<t_action_result> {
        this.toplevel_path.clear();
        const result = this.toplevel_path.add(filePath);
        this.emitterProject.emitEvent(this.name, e_event.SELECT_TOPLEVEL_TESTBENCH);
        return result;
    }

    /**
     * Add top level path to project. Delete de previous one.
     * @param toplevel_path_inst Top level path to add.
     * @returns Operation result
    **/
    public async add_toplevel_path(toplevel_path_inst: string, emitEvent = true): Promise<t_action_result> {
        // Save old top level path
        const oldTopLevelList = this.toplevel_path.get();
        let oldTopLevel = "";
        if (oldTopLevelList.length > 0) {
            oldTopLevel = oldTopLevelList[0];
        }

        this.toplevel_path.clear();
        const result = this.toplevel_path.add(toplevel_path_inst);
        if (oldTopLevel !== toplevel_path_inst && emitEvent) {
            this.emitterProject.emitEvent(this.name, e_event.SELECT_TOPLEVEL);
        }
        return result;
    }

    /**
     * Delete top level path to project.
     * @param toplevel_path_inst Top level path to delete.
     * @returns Operation result
    **/
    delete_toplevel_path(toplevel_path_inst: string): t_action_result {
        const result = this.toplevel_path.delete(toplevel_path_inst);
        this.emitterProject.emitEvent(this.name, e_event.SELECT_TOPLEVEL);
        return result;
    }

    /**
     * Get top level path.
     * @returns Top level path.
    **/
    get_toplevel_path(): string[] {
        return this.toplevel_path.get();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Watcher
    ////////////////////////////////////////////////////////////////////////////
    add_file_to_watcher(watcher: t_watcher): t_action_result {
        const result = this.watchers.add(watcher);
        this.emitterProject.emitEvent(this.name, e_event.ADD_WATCHER);
        return result;
    }

    delete_file_in_watcher(watcher_path: string): t_action_result {
        const result = this.watchers.delete(watcher_path);
        this.emitterProject.emitEvent(this.name, e_event.REMOVE_WATCHER);
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////
    // File
    ////////////////////////////////////////////////////////////////////////////
    public async modifyFileSourceType(filePath: string, logicalName: string,
        newSourceType: e_source_type): Promise<boolean> {
        for (const file of this.files.get()) {
            if (file.name === filePath && file.logical_name === logicalName) {
                if (file.source_type !== newSourceType) {
                    file.source_type = newSourceType;
                    this.emitterProject.emitEvent(this.name, e_event.ADD_SOURCE);
                    return true;
                }
                break;
            }
        }
        return false;
    }

    async add_file_from_vivado(vivado_path: string, is_manual: boolean)
        : Promise<t_action_result> {

        const result = await get_files_from_vivado(this.get_config(), vivado_path, is_manual);
        this.add_file_from_array(result.file_list);
        const action_result: t_action_result = {
            result: result.file_list,
            successful: result.successful,
            msg: result.msg
        };
        return action_result;
    }

    async add_file_from_vunit(vunit_path: string, is_manual: boolean
    ): Promise<t_action_result> {

        const result = await get_files_from_vunit(this.get_config(), vunit_path, is_manual);

        this.add_file_from_array(result.file_list);
        const action_result: t_action_result = {
            result: result.file_list,
            successful: result.successful,
            msg: result.msg
        };
        return action_result;
    }

    add_file_from_csv(csv_path: string, is_manual: boolean): t_action_result {
        const result = get_files_from_csv(csv_path, is_manual);
        this.add_file_from_array(result.file_list);
        const action_result: t_action_result = {
            result: result.file_list,
            successful: result.successful,
            msg: result.msg
        };
        return action_result;
    }

    public async add_file(file: t_file): Promise<t_action_result> {
        const result = this.files.add(file);
        this.emitterProject.emitEvent(this.name, e_event.ADD_SOURCE);
        return result;
    }

    public async add_file_from_array(file_list: t_file[], emitEvent = true): Promise<t_action_result> {
        file_list.forEach(file => {
            this.files.add(file);
        });
        if (emitEvent) {
            this.emitterProject.emitEvent(this.name, e_event.ADD_SOURCE);
        }
        return {
            result: undefined,
            successful: true,
            msg: ""
        };
    }

    public async delete_file(name: string, logical_name = "") {
        const result = this.files.delete(name, logical_name);
        this.delete_phantom_toplevel();
        this.emitterProject.emitEvent(this.name, e_event.DELETE_SOURCE);
        return result;
    }

    get_file(): t_file[] {
        return this.files.get();
    }

    public async delete_file_by_logical_name(logical_name: string): Promise<t_action_result> {
        const result = this.files.delete_by_logical_name(logical_name);
        this.delete_phantom_toplevel();
        this.emitterProject.emitEvent(this.name, e_event.DELETE_SOURCE);
        return result;
    }

    public add_logical(logical_name: string) {
        const result = this.files.add_logical(logical_name);
        this.emitterProject.emitEvent(this.name, e_event.ADD_LIBRARY);
        return result;
    }

    public delete_phantom_toplevel() {
        this.toplevel_path.get().forEach(toplevel => {
            if (this.check_if_path_in_project(toplevel) === false) {
                this.delete_toplevel_path(toplevel);
            }
        });
    }

    public clearFiles(emitEvent = true) {
        this.files.clear();
        if (emitEvent) {
            this.emitterProject.emitEvent(this.name, e_event.DELETE_SOURCE);
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Dependency
    ////////////////////////////////////////////////////////////////////////////
    async get_dependency_graph(python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        // const result = await m_dependency.create_dependency_graph_pyodide(this.files.get());
        const result = await m_dependency.create_dependency_graph(this.files.get(), python_path);
        return result;
    }


    async get_dependency_tree(python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        // const result = await m_dependency.get_dependency_tree_pyodide(this.files.get());
        const result = await m_dependency.get_dependency_tree(this.files.get(), python_path);
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Config
    ////////////////////////////////////////////////////////////////////////////
    public async set_config(config: e_config, emitEvent = true): Promise<void> {
        super.set_config(diff_config(config, GlobalConfigManager.getInstance().get_config()));
        if (emitEvent) {
            this.emitterProject.emitEvent(this.name, e_event.SAVE_SETTINGS);
        }
    }

    public get_config(): e_config {
        return merge_configs(super.get_config(), GlobalConfigManager.getInstance().get_config());
    }

    public get_diff_config(): e_config {
        return super.get_config();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////
    public get_project_definition(): t_project_definition {
        const prj_definition: t_project_definition = {
            name: this.name,
            project_disk_path: this.projectDiskPath,
            project_type: this.getProjectType(),
            file_manager: this.files,
            hook_manager: this.hooks,
            parameter_manager: this.parameters,
            toplevel_path_manager: this.toplevel_path,
            watcher_manager: this.watchers,
            config: this.get_config()
        };
        return prj_definition;
    }

    public check_if_file_in_project(name: string, logical_name: string): boolean {
        const file_list = this.files.get();
        let return_value = false;
        file_list.forEach(file_inst => {
            if (file_inst.name === name && file_inst.logical_name === logical_name) {
                return_value = true;
            }
        });
        return return_value;
    }

    public check_if_path_in_project(name: string): boolean {
        const file_list = this.files.get();
        let return_value = false;
        file_list.forEach(file_inst => {
            if (file_inst.name === name) {
                return_value = true;
            }
        });
        return return_value;
    }

    public get_edam_json(reference_path?: string) {
        return utils.get_edam_json(this.get_project_definition(), undefined, reference_path);
    }

    public get_edam_yaml(reference_path?: string) {
        return utils.get_edam_yaml(this.get_project_definition(), undefined, reference_path);
    }

    public get_toml(reference_path?: string) {
        type t_lib = {
            name: string,
            files: string[]
        };

        const libraries: t_lib[] = [];
        const vhdl_sources = this.files.get(reference_path).filter((element) => {
            return element.file_type === LANGUAGE.VHDL || file_utils.get_language_from_filepath(basename(element.name)) === LANGUAGE.VHDL;
        });

        for (const source of vhdl_sources) {

            // Check if file in library
            let file_in_library = false;

            for (const library of libraries) {
                if (library.name === source.logical_name) {
                    file_in_library = true;
                    library.files.push(source.name);
                    break;
                }
            }
            if (!file_in_library) {
                libraries.push(<t_lib>{
                    name: source.logical_name,
                    files: [source.name]
                });
            }
        }

        let toml = "[libraries]\n\n";

        for (const library of libraries) {
            let files_in_library = "";
            for (const file_in_library of library.files) {
                files_in_library += `  '${file_in_library}',\n`;
            }
            if (library.name === undefined || library.name === '') {
                library.name = 'work';
            }
            toml += `${library.name}.files = [\n${files_in_library}]\n\n`;
        }

        if (libraries.length === 0) {
            toml += "work.files = []\n\n";
        }

        return toml;
    }

    public save_edam_yaml(output_path: string) {
        const edam_yaml = this.get_edam_yaml(output_path);
        file_utils.save_file_sync(output_path, edam_yaml);
    }

    public save_toml(output_path: string) {
        const toml_text = this.get_toml(output_path);
        file_utils.save_file_sync(output_path, toml_text);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Tool
    ////////////////////////////////////////////////////////////////////////////
    public async run(test_list: t_test_declaration[],
        callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void): Promise<any> {

        const python_result = await python.get_python_path(
            { "path": this.get_config().general.general.pypath });

        await this.files.order(python_result.python_path);
        const prj_def = this.get_project_definition();

        return this.tools_manager.run(prj_def, test_list, callback, callback_stream);
    }

    public clean(clean_mode: e_clean_step, callback_stream: (stream_c: any) => void): any {
        return this.tools_manager.clean(this.get_project_definition(), clean_mode, callback_stream);
    }

    public async get_test_list(): Promise<t_test_declaration[]> {

        return await this.tools_manager.get_test_list(this.get_project_definition());
    }

    public getTaskStatus(): { "taskList": t_taskRep[], "currentTask": e_taskType | undefined } {
        return { "taskList": [], "currentTask": undefined };
    }

    public async getIpCatalog(): Promise<t_ipCatalogRep[]> {
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    public runTask(_taskType: e_taskType, _callback: (result: p_result) => void): ChildProcess {
        return {} as ChildProcess;
    }

    public getTaskState(nameTask: e_taskType): e_taskState | undefined {
        return this.taskStateManager.getTaskState(nameTask);
    }

    setTaskManager(taskManager: TaskStateManager) {
        this.taskStateManager = taskManager;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getArtifact(_taskType: e_taskType, _reportType: e_reportType): Promise<t_test_artifact> {
        return {} as t_test_artifact;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public cleallAllProject(_callback:
        (result: p_result) => void): ChildProcess {
        return {} as ChildProcess;
    }

    protected emitUpdateStatus() {
        this.emitterProject.emitEvent(this.name, e_event.UPDATE_TASK);
    }

    public async getTimingReport(_numOfPaths: number, _timingMode: e_timing_mode): Promise<t_timing_path[]> {
        return [];
    }
}


////////////////////////////////////////////////////////////////////////////
// Config Helpers
////////////////////////////////////////////////////////////////////////////
function get_undefined_config(): e_config {
    return create_copy_with_undefined_values(get_default_config());
}

function create_copy_with_undefined_values<T extends Record<string, any>>(obj: T): T {
    const result: Record<string, any> = {};

    for (const key in obj) {
        const value = obj[key];
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = create_copy_with_undefined_values(value);
        } else {
            result[key] = undefined as any;
        }
    }

    return result as T;
}

function merge_configs<T extends Record<string, any>>(main_config: T, default_config: T): T {

    const result: Record<string, any> = {};

    const keys = Array.from(new Set([...Object.keys(main_config), ...Object.keys(default_config)]));

    keys.forEach((key) => {
        const value1 = main_config[key];
        const value2 = default_config[key];

        if (value1 !== undefined && value2 !== undefined
            && typeof value1 === typeof value2
            && typeof value1 === 'object' && !Array.isArray(value1)) {
            // Both are object, so merge them
            result[key] = merge_configs(value1, value2);
        } else if (value1 !== undefined) {
            // Keep main one
            result[key] = value1;
        } else {
            // Use default one
            result[key] = value2;
        }
    });

    return result as T;

}

function diff_config<T extends Record<string, any>>(config1: T, config2: T): T {
    const differences: Record<string, any> = {};

    const keys = Array.from(new Set([...Object.keys(config1), ...Object.keys(config2)]));

    keys.forEach((key) => {
        const value1 = config1[key];
        const value2 = config2[key];

        if (typeof value1 === 'object' && value1 !== null
            && typeof value2 === 'object' && value2 !== null
            && !Array.isArray(value1) && !Array.isArray(value2)) {
            const nestedDifferences = diff_config(value1, value2);
            differences[key] = nestedDifferences;
        } else if (Array.isArray(value1) && Array.isArray(value2)) {
            if (value1.length === value2.length && value1.every((value, index) => value === value2[index])) {
                differences[key] = undefined;
            } else {
                differences[key] = value1;
            }
        } else if (value1 !== value2) {
            differences[key] = value1;
        } else {
            differences[key] = undefined;
        }
    });

    return differences as T;
}
