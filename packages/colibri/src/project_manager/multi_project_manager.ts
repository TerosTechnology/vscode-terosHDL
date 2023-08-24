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

// import { t_file_reduced, t_script, t_parameter, e_script_stage, t_action_result, t_watcher, } from "./common";
import { t_file_reduced, t_action_result, t_watcher, } from "./common";
import { Config_manager } from "../config/config_manager";
import { e_clean_step } from "./tool/common";
import { Project_manager } from "./project_manager";
import { t_test_declaration, t_test_result } from "./tool/common";
import { e_config } from "../config/config_declaration";
import * as file_utils from "../utils/file_utils";
import { get_linter_name, get_linter_options } from "../config/utils";
import { get_hdl_language } from "../utils/common_utils";
import { LINTER_MODE, l_error } from "../linter/common";
import { Linter } from "../linter/linter";

import * as yaml from "js-yaml";
import * as events from "events";

export class Multi_project_manager {
    private project_manager_list: Project_manager[] = [];
    private selected_project = "";
    private global_config: Config_manager;
    private name = "";
    private sync_file_path = "";
    private emitter: events.EventEmitter | undefined = undefined;

    // Linter
    private linter = new Linter();


    constructor(name: string, global_config_sync_path: string, sync_file_path = "",
        emitter: events.EventEmitter | undefined) {

        this.name = name;
        this.emitter = emitter;
        this.global_config = new Config_manager(global_config_sync_path);
        this.sync_file_path = sync_file_path;
        this.load_from_sync_file();
    }

    get_name(): string {
        return this.name;
    }

    get_projects(): Project_manager[] {
        return this.project_manager_list;
    }


    ////////////////////////////////////////////////////////////////////////////
    // Linter
    ////////////////////////////////////////////////////////////////////////////
    public async lint_from_file(file_path: string, mode: LINTER_MODE,
        general_config: e_config): Promise<l_error[]> {

        const file_lang = get_hdl_language(file_path);
        const linter_name = get_linter_name(file_lang, mode, general_config);
        const linter_options = get_linter_options();

        const result = this.get_select_project();
        if (result.successful === false) {
            return await this.linter.lint_from_file(linter_name, file_path, linter_options);
        }
        const prj_file_list = (<Project_manager>result.result).get_project_definition().file_manager.get();
        return await this.linter.lint_from_project(file_path, prj_file_list, linter_name, linter_options);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////
    public save() {
        if (this.sync_file_path === "") {
            return;
        }
        const prj_list: any[] = [];
        this.project_manager_list.forEach(prj => {
            prj_list.push(prj.get_edam_json());
        });
        const total = {
            name: this.name,
            selected_project: this.selected_project,
            project_list: prj_list
        };
        const config_string = JSON.stringify(total, null, 4);
        file_utils.save_file_sync(this.sync_file_path, config_string);
    }

    public load_from_sync_file() {
        try {
            const file_content = file_utils.read_file_sync(this.sync_file_path);
            const prj_saved = JSON.parse(file_content);
            this.name = prj_saved.name;
            this.selected_project = prj_saved.selected_project;
            const prj_list = prj_saved.project_list;
            prj_list.forEach((prj: any) => {
                const prj_name = prj.name
                this.create_project(prj_name);
                // Files
                const file_list = prj.files;
                file_list.forEach((file: any) => {
                    this.add_file(prj_name, {
                        name: file.name, is_include_file: file.is_include_file,
                        include_path: file.include_path, logical_name: file.logical_name,
                        is_manual: file.is_manual
                    });
                });
                // Hooks
                // Toplevel
                this.add_toplevel_path(prj_name, prj.toplevel);
                // Tool options
                // Watchers
                const watcher_list = prj.watchers;
                watcher_list.forEach((watcher: any) => {
                    this.add_file_to_watcher(prj_name, watcher);
                });
            });
        }
        // eslint-disable-next-line no-empty
        catch (error) { }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////
    public rename_project(prj_name: string, new_name: string) {
        // Check if project to reanme exists
        const exist_prj_0 = this.get_project_by_name(prj_name);
        if (exist_prj_0 === undefined) {
            return this.get_project_not_exist();
        }
        // Check if new name projec exists
        const exist_prj_1 = this.get_project_by_name(new_name);
        if (exist_prj_1 !== undefined) {
            return this.get_project_exist();
        }

        exist_prj_0.rename(new_name);
        this.save();
        return this.get_sucessful_result(undefined);
    }

    public create_project(prj_name: string) {
        const exist_prj = this.get_project_by_name(prj_name);
        if (exist_prj !== undefined) {
            return this.get_project_exist();
        }
        const prj = new Project_manager(prj_name, this.emitter);
        this.project_manager_list.push(prj);
        this.save();
        return this.get_sucessful_result(undefined);
    }

    public create_project_from_json_edam(filepath: string) {
        try {
            const prj_info = JSON.parse(file_utils.read_file_sync(filepath));
            return this.create_project_from_dict(prj_info, filepath);
        } catch (error) {
            return this.get_error_reading_prj();
        }
    }

    public create_project_from_yaml_edam(filepath: string) {
        try {
            const prj_info = yaml.load(file_utils.read_file_sync(filepath));
            return this.create_project_from_dict(prj_info, filepath);
        } catch (error) {
            return this.get_error_reading_prj();
        }
    }

    public create_project_from_dict(prj_info: any, base_path: string) {
        try {
            // Create project
            const prj_name = prj_info.name;
            const prj = new Project_manager(prj_name, this.emitter);

            // Check if exists
            const exist_prj = this.get_project_by_name(prj_name);
            if (exist_prj !== undefined) {
                return this.get_project_exist();
            }

            // Add files
            const file_list = prj_info.files;
            file_list.forEach((file: any) => {
                //Relative path to absolute
                const name = file_utils.get_absolute_path(file_utils.get_directory(base_path), file.name);

                let is_include_file = false;
                if (file.is_include_file !== undefined) {
                    is_include_file = file.is_include_file;
                }
                let include_path = "";
                if (file.include_path !== undefined) {
                    include_path = file.include_path;
                }
                let logical_name = "";
                if (file.logical_name !== undefined) {
                    logical_name = file.logical_name;
                }
                let is_manual = true;
                if (file.is_manual !== undefined) {
                    is_manual = file.is_manual;
                }

                const file_definition: t_file_reduced = {
                    name: name,
                    is_include_file: is_include_file,
                    include_path: include_path,
                    logical_name: logical_name,
                    is_manual: is_manual
                };

                prj.add_file(file_definition);
            });

            if (prj_info.toplevel !== undefined){
                const toplevel_path = file_utils.get_absolute_path(file_utils.get_directory(base_path), 
                    prj_info.toplevel);
                if (file_utils.check_if_path_exist(toplevel_path)){
                    prj.add_toplevel_path(toplevel_path);
                }
            }

            // // Add watchers
            // const watcher_list = prj_info.watchers;
            // watcher_list.forEach((watcher: any) => {
            //     //Relative path to absolute
            //     const name = file_utils.get_absolute_path(file_utils.get_directory(base_path), watcher.name);

            //     let is_include_file = false;
            //     if (file.is_include_file !== undefined) {
            //         is_include_file = file.is_include_file;
            //     }
            //     let include_path = "";
            //     if (file.include_path !== undefined) {
            //         include_path = file.include_path;
            //     }
            //     let logical_name = "";
            //     if (file.logical_name !== undefined) {
            //         logical_name = file.logical_name;
            //     }

            //     const file_definition: t_file_reduced = {
            //         name: name,
            //         is_include_file: is_include_file,
            //         include_path: include_path,
            //         logical_name: logical_name
            //     };

            //     prj.add_file(file_definition);
            // });
            this.project_manager_list.push(prj);

            this.save();
            return this.get_sucessful_result(undefined);
        } catch (error) {
            return this.get_error_reading_prj();
        }
    }

    public delete_project(prj_name: string): t_action_result {
        const new_project_manager_list: Project_manager[] = [];

        if (prj_name === this.selected_project) {
            this.selected_project = "";
        }

        let is_prj = false;
        for (let i = 0; i < this.project_manager_list.length; i++) {
            const element = this.project_manager_list[i];
            if (element.get_name() !== prj_name) {
                new_project_manager_list.push(element);
            }
            else {
                is_prj = true;
            }
        }
        this.project_manager_list = new_project_manager_list;
        this.save();
        if (is_prj === true) {
            return this.get_sucessful_result(undefined);
        }
        return this.get_project_not_exist();
    }

    public select_project_current(prj_name: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        this.selected_project = prj_name;
        this.save();
        return this.get_sucessful_result(undefined);
    }

    public get_project_by_name(name: string): Project_manager | undefined {
        let return_value: Project_manager | undefined = undefined;
        this.project_manager_list.forEach(project => {
            if (project.get_name() === name) {
                return_value = project;
            }
        });
        return return_value;
    }

    public get_select_project(): t_action_result {
        const prj = this.get_project_by_name(this.selected_project);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return this.get_sucessful_result(prj);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Watcher
    ////////////////////////////////////////////////////////////////////////////
    public add_file_to_watcher(prj_name: string, watcher: t_watcher): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            this.save();
            return this.get_project_not_exist();
        }
        const result = prj.add_file_to_watcher(watcher);
        this.save();
        return result;
    }

    public delete_file_in_watcher(prj_name: string, watcher_path: string)
        : t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            this.save();
            return this.get_project_not_exist();
        }
        const result = prj.delete_file_in_watcher(watcher_path);
        this.save();
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Hook
    ////////////////////////////////////////////////////////////////////////////
    // public add_hook(prj_name: string, script: t_script, stage: e_script_stage)
    //     : t_action_result {
    //     const prj = this.get_project_by_name(prj_name);
    //     if (prj === undefined) {
    //         this.save();
    //         return this.get_project_not_exist();
    //     }
    //     const result = prj.add_hook(script, stage);
    //     this.save();
    //     return result;
    // }

    // public delete_hook(prj_name: string, script: t_script, stage: e_script_stage)
    //     : t_action_result {
    //     const prj = this.get_project_by_name(prj_name);
    //     if (prj === undefined) {
    //         this.save();
    //         return this.get_project_not_exist();
    //     }
    //     const result = prj.delete_hook(script, stage);
    //     this.save();
    //     return result;
    // }

    ////////////////////////////////////////////////////////////////////////////
    // Parameters
    ////////////////////////////////////////////////////////////////////////////
    // add_parameter(prj_name: string, parameter: t_parameter): t_action_result {
    //     const prj = this.get_project_by_name(prj_name);
    //     if (prj === undefined) {
    //         return this.get_project_not_exist();
    //     }
    //     const result = prj.add_parameter(parameter);
    //     this.save();
    //     return result;
    // }

    // delete_parameter(prj_name: string, parameter: t_parameter): t_action_result {
    //     const prj = this.get_project_by_name(prj_name);
    //     if (prj === undefined) {
    //         return this.get_project_not_exist();
    //     }
    //     const result = prj.delete_parameter(parameter);
    //     this.save();
    //     return result;
    // }

    ////////////////////////////////////////////////////////////////////////////
    // Toplevel
    ////////////////////////////////////////////////////////////////////////////
    add_toplevel_path(prj_name: string, toplevel_path_inst: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.add_toplevel_path(toplevel_path_inst);
        this.save();
        return result;
    }

    delete_toplevel_path(prj_name: string, toplevel_path_inst: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.delete_toplevel_path(toplevel_path_inst);
        this.save();
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////
    // File
    ////////////////////////////////////////////////////////////////////////////
    add_logical(prj_name: string, logical_name: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.add_logical(logical_name);
        this.save();
        return result;
    }

    add_file(prj_name: string, file: t_file_reduced): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.add_file(file);
        this.save();
        return result;
    }

    add_file_from_csv(prj_name: string, csv_path: string, is_manual: boolean): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.add_file_from_csv(csv_path, is_manual);
        this.save();
        return result;
    }

    async add_file_from_vunit(prj_name: string, general_config: e_config | undefined,
        vunit_path: string, is_manual: boolean): Promise<t_action_result> {

        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = await prj.add_file_from_vunit(general_config, vunit_path, is_manual);
        this.save();
        return result;
    }

    async add_file_from_vivado(prj_name: string, general_config: e_config | undefined,
        vivado_path: string, is_manual: boolean): Promise<t_action_result> {

        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = await prj.add_file_from_vivado(general_config, vivado_path, is_manual);
        this.save();
        return result;
    }

    delete_file(prj_name: string, name: string, logical_name = "") {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.delete_file(name, logical_name);
        this.save();
        return result;
    }

    delete_file_by_logical_name(prj_name: string, logical_name: string) {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.delete_file_by_logical_name(logical_name);
        this.save();
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Dependency
    ////////////////////////////////////////////////////////////////////////////
    async get_dependency_graph(prj_name: string, python_path: string): Promise<t_action_result> {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return await prj.get_dependency_graph(python_path);
    }

    async get_dependency_tree(prj_name: string, python_path: string): Promise<t_action_result> {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        return prj.get_dependency_tree(python_path);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Config
    ////////////////////////////////////////////////////////////////////////////
    public get_config_manager() {
        // // Selected project config
        // const selected_prj = this.get_select_project();
        // let prj_config = undefined;
        // if (selected_prj.successful === true) {
        //     prj_config = selected_prj.result.get_config_manager();
        // }
        // Glogal config
        const global_config = this.global_config.get_config();
        // Merge configs
        const config_manager = new Config_manager();
        // config_manager.set_config(merge_configs(global_config, prj_config));

        config_manager.set_config(global_config);


        return config_manager;
    }

    public set_global_config(config: e_config) {
        this.global_config.set_config(config);
        return this.get_sucessful_result(undefined);
    }

    public set_global_config_from_json(config: any) {
        this.global_config.set_config_from_json(config);
        return this.get_sucessful_result(undefined);
    }

    public set_config(prj_name: string, config: e_config): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        prj.set_config(config);
        return this.get_sucessful_result(undefined);
    }

    public get_config(prj_name: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.get_config();
        return this.get_sucessful_result(result);
    }

    public get_config_global_config() {
        return this.global_config.get_config();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Tool
    ////////////////////////////////////////////////////////////////////////////
    public run(prj_name: string, general_config: e_config | undefined, test_list: t_test_declaration[],
        callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: t_action_result) => void): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            callback([]);
            return this.get_project_not_exist();
        }
        const exec_i = prj.run(general_config, test_list, callback, callback_stream);
        return this.get_sucessful_result(exec_i);
    }

    public clean(prj_name: string, general_config: e_config | undefined, clean_mode: e_clean_step,
        callback_stream: (stream_c: t_action_result) => void): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const exec_i = prj.clean(general_config, clean_mode, callback_stream);
        return this.get_sucessful_result(exec_i);
    }

    public async get_test_list(prj_name: string, general_config: e_config): Promise<t_test_declaration[]> {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return [];
        }
        return await prj.get_test_list(general_config);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////
    private get_project_not_exist(): t_action_result {
        const result: t_action_result = {
            result: undefined,
            successful: false,
            msg: "Project doesn't exists"
        };
        return result;
    }

    private get_project_exist(): t_action_result {
        const result: t_action_result = {
            result: undefined,
            successful: false,
            msg: "Project name exists"
        };
        return result;
    }

    private get_error_reading_prj(): t_action_result {
        const result: t_action_result = {
            result: undefined,
            successful: false,
            msg: "Error reading the project"
        };
        return result;
    }

    private get_sucessful_result(result_i: any): t_action_result {
        const result: t_action_result = {
            result: result_i,
            successful: true,
            msg: ""
        };
        return result;
    }

    public check_if_file_in_project(prj_name: string, name: string, logical_name: string): t_action_result {
        const prj = this.get_project_by_name(prj_name);
        if (prj === undefined) {
            return this.get_project_not_exist();
        }
        const result = prj.check_if_file_in_project(name, logical_name);
        return this.get_sucessful_result(result);
    }

}
