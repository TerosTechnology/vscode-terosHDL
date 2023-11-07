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
    e_watcher_type
} from "./common";
import * as  manager_watcher from "./list_manager/watcher";
import * as  manager_file from "./list_manager/file";
import * as  manager_hook from "./list_manager/hook";
import * as  manager_parameter from "./list_manager/parameter";
import * as  manager_toplevel_path from "./list_manager/toplevel_path";
import * as  manager_dependency from "./dependency/dependency";
import { Tool_manager } from "./tool/tools_manager";
import { t_test_declaration, t_test_result, e_clean_step } from "./tool/common";
import { t_project_definition } from "./project_definition";
import * as file_utils from "../utils/file_utils";
import * as hdl_utils from "../utils/hdl_utils";
import { Config_manager, merge_configs } from "../config/config_manager";
import { e_config } from "../config/config_declaration";
import * as utils from "./utils/utils";
import * as python from "../process/python";
import * as events from "events";
import { l_error } from "../linter/common";
import { Linter } from "../linter/linter";
import { t_linter_name, l_options } from "../linter/common";
import { get_files_from_csv } from "./prj_loaders/csv_loader";
import { get_files_from_vivado } from "./prj_loaders/vivado_loader";
import { get_files_from_vunit } from "./prj_loaders/vunit_loader";
import { getFilesFromProject, QuartusExecutionError } from "./tool/quartus/utils";

export class Project_manager {
    /**  Name of the project */
    private name: string;
    /** Contains all the HDL source files, constraint files, vendor IP description files, 
     * memory initialization files etc. for the project. */
    protected files = new manager_file.File_manager();
    /** File watcher. */
    private watchers: manager_watcher.Watcher_manager;
    /** A dictionary of extra commands to execute at various stages of the project build/run. */
    private hooks = new manager_hook.Hook_manager();
    /** Specifies build- and run-time parameters, such as plusargs, VHDL generics, Verilog defines etc. */
    private parameters = new manager_parameter.Parameter_manager();
    /** Toplevel path(s) for the project. */
    private toplevel_path = new manager_toplevel_path.Toplevel_path_manager();
    /** Config manager. */
    private config_manager = new Config_manager();
    private tools_manager = new Tool_manager(undefined);
    private emitter: events.EventEmitter | undefined = undefined;
    /** Linter */
    private linter = new Linter();

    constructor(name: string, emitter: events.EventEmitter | undefined = undefined) {
        this.name = name;
        this.emitter = emitter;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const selfm = this;
        this.watchers = new manager_watcher.Watcher_manager((function () {
            selfm.files.clear_automatic_files();
            selfm.watchers.get().forEach(async (watcher: any) => {
                if (file_utils.check_if_path_exist(watcher.path)) {
                    if (selfm.emitter !== undefined) {
                        selfm.emitter.emit('loading');
                    }
                    if (watcher.watcher_type === e_watcher_type.CSV) {
                        selfm.add_file_from_csv(watcher.path, false);
                    }
                    else if (watcher.watcher_type === e_watcher_type.VUNIT) {
                        await selfm.add_file_from_vunit(selfm.config_manager.get_config(), watcher.path, false);
                    }
                    else if (watcher.watcher_type === e_watcher_type.VIVADO) {
                        await selfm.add_file_from_vivado(selfm.config_manager.get_config(), watcher.path, false);
                    }
                    if (selfm.emitter !== undefined) {
                        selfm.emitter.emit('loaded');
                        selfm.emitter.emit('refresh');
                    }
                }
            });
        }), emitter);
    }

    get_name() {
        return this.name;
    }

    rename(name: string) {
        this.name = name;
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

    ////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////
    // public save_definition() {
    //     const definition = this.get_project_definition(undefined);
    // }

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
    // Hook
    ////////////////////////////////////////////////////////////////////////////
    // public add_hook(script: t_script, stage: e_script_stage)
    //     : t_action_result {
    //     return this.hooks.add(script, stage);
    // }

    // public delete_hook(script: t_script, stage: e_script_stage)
    //     : t_action_result {
    //     return this.hooks.delete(script, stage);
    // }

    ////////////////////////////////////////////////////////////////////////////
    // Parameters
    ////////////////////////////////////////////////////////////////////////////
    // add_parameter(parameter: t_parameter): t_action_result {
    //     return this.parameters.add(parameter);
    // }

    // delete_parameter(parameter: t_parameter): t_action_result {
    //     return this.parameters.delete(parameter);
    // }

    ////////////////////////////////////////////////////////////////////////////
    // Toplevel
    ////////////////////////////////////////////////////////////////////////////
    /**
     * Add top level path to project from entity. Delete de previous one.
     * @param toplevel_path_inst Top level entity to add.
     * @returns Operation result
    **/
    add_toplevel_path_from_entity(entity_name: string): t_action_result {
        const file_list = this.files.get();
        for (const file of file_list) {
            const entity_name_of_file = hdl_utils.get_toplevel_from_path(file.name);
            if (entity_name_of_file === entity_name) {
                this.toplevel_path.clear();
                return this.add_toplevel_path(file.name);
            }
        }

        return {
            result: undefined,
            successful: false,
            msg: "Entity not found."
        };
    }

    /**
     * Add top level path to project. Delete de previous one.
     * @param toplevel_path_inst Top level path to add.
     * @returns Operation result
    **/
    add_toplevel_path(toplevel_path_inst: string): t_action_result {
        this.toplevel_path.clear();
        return this.toplevel_path.add(toplevel_path_inst);
    }

    /**
     * Delete top level path to project.
     * @param toplevel_path_inst Top level path to delete.
     * @returns Operation result
    **/
    delete_toplevel_path(toplevel_path_inst: string): t_action_result {
        return this.toplevel_path.delete(toplevel_path_inst);
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
        return this.watchers.add(watcher);
    }

    delete_file_in_watcher(watcher_path: string): t_action_result {
        return this.watchers.delete(watcher_path);
    }

    ////////////////////////////////////////////////////////////////////////////
    // File
    ////////////////////////////////////////////////////////////////////////////
    async add_file_from_quartus(general_config: e_config | undefined, vivado_path: string, is_manual: boolean)
        : Promise<void> {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        try {
            const fileList = await getFilesFromProject(n_config, vivado_path, is_manual);
            this.add_file_from_array(fileList);

        } catch (error) {
            throw new QuartusExecutionError("Error in Quartus execution");
        }
    }

    async add_file_from_vivado(general_config: e_config | undefined, vivado_path: string, is_manual: boolean)
        : Promise<t_action_result> {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        const result = await get_files_from_vivado(n_config, vivado_path, is_manual);
        this.add_file_from_array(result.file_list);
        const action_result: t_action_result = {
            result: result.file_list,
            successful: result.successful,
            msg: result.msg
        };
        return action_result;
    }

    async add_file_from_vunit(general_config: e_config | undefined, vunit_path: string, is_manual: boolean
    ): Promise<t_action_result> {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        const result = await get_files_from_vunit(n_config, vunit_path, is_manual);

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

    add_file(file: t_file): t_action_result {
        return this.files.add(file);
    }

    add_file_from_array(file_list: t_file[]): t_action_result {
        file_list.forEach(file => {
            this.files.add(file);
        });
        return {
            result: undefined,
            successful: true,
            msg: ""
        };
    }

    delete_file(name: string, logical_name = "") {
        const result = this.files.delete(name, logical_name);
        this.delete_phantom_toplevel();
        return result;
    }

    get_file(): t_file[] {
        return this.files.get();
    }

    delete_file_by_logical_name(logical_name: string) {
        const result = this.files.delete_by_logical_name(logical_name);
        this.delete_phantom_toplevel();
        return result;
    }

    add_logical(logical_name: string) {
        return this.files.add_logical(logical_name);
    }

    delete_phantom_toplevel() {
        this.toplevel_path.get().forEach(toplevel => {
            if (this.check_if_path_in_project(toplevel) === false) {
                this.delete_toplevel_path(toplevel);
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////
    // Dependency
    ////////////////////////////////////////////////////////////////////////////
    async get_dependency_graph(python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        const result = await m_dependency.get_dependency_graph_svg(this.files.get(), python_path);
        return result;
    }


    async get_dependency_tree(_python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        const result = await m_dependency.get_dependency_tree_pyodide(this.files.get());
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Config
    ////////////////////////////////////////////////////////////////////////////
    public set_config(new_config: e_config) {
        this.config_manager.set_config(new_config);
    }
    public get_config(): e_config {
        return this.config_manager.get_config();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////
    public get_project_definition(config_manager: Config_manager | undefined = undefined): t_project_definition {
        let current_config_manager = config_manager;
        if (current_config_manager === undefined) {
            current_config_manager = this.config_manager;
        }
        const prj_definition: t_project_definition = {
            name: this.name,
            file_manager: this.files,
            hook_manager: this.hooks,
            parameter_manager: this.parameters,
            toplevel_path_manager: this.toplevel_path,
            watcher_manager: this.watchers,
            config_manager: current_config_manager
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

    public save_edam_yaml(output_path: string) {
        const edam_yaml = this.get_edam_yaml(output_path);
        file_utils.save_file_sync(output_path, edam_yaml);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Tool
    ////////////////////////////////////////////////////////////////////////////
    public async run(general_config: e_config | undefined, test_list: t_test_declaration[],
        callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void): Promise<any> {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        const python_result = await python.get_python_path(
            { "path": n_config_manager.get_config().general.general.pypath });

        await this.files.order(python_result.python_path);
        const prj_def = this.get_project_definition(n_config_manager);

        return this.tools_manager.run(prj_def, test_list, callback, callback_stream);
    }

    public clean(general_config: e_config | undefined,
        clean_mode: e_clean_step,
        callback_stream: (stream_c: any) => void): any {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        return this.tools_manager.clean(this.get_project_definition(n_config_manager), clean_mode, callback_stream);
    }

    public async get_test_list(general_config: e_config | undefined = undefined): Promise<t_test_declaration[]> {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        return await this.tools_manager.get_test_list(this.get_project_definition(n_config_manager));
    }
}





