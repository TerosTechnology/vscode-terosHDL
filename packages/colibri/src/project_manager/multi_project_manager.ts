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

import { t_file, t_action_result } from "./common";
import { Config_manager } from "../config/config_manager";
import { Project_manager } from "./project_manager";
import { e_config } from "../config/config_declaration";
import * as file_utils from "../utils/file_utils";
import { get_language_from_filepath } from "../utils/file_utils";

import * as yaml from "js-yaml";
import * as events from "events";
import { get_project_info_from_quartus } from "./tool/quartus/utils";

class ProjectNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ProjectNotFoundError";
    }
}

class ProjectOperationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ProjectOperationError";
    }
}

export class Multi_project_manager {
    private project_manager_list: Project_manager[] = [];
    private selected_project: Project_manager | undefined = undefined;
    private global_config: Config_manager;
    private sync_file_path = "";
    private emitter: events.EventEmitter | undefined = undefined;

    constructor(global_config_sync_path: string, sync_file_path = "",
        emitter: events.EventEmitter | undefined) {

        this.global_config = new Config_manager(global_config_sync_path);
        this.sync_file_path = sync_file_path;
        this.emitter = emitter;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Getters
    ////////////////////////////////////////////////////////////////////////////

    /**
     * Returns a list of projects
     * @returns list of Project_manager.
    **/
    public get_projects(): Project_manager[] {
        return this.project_manager_list;
    }

    /**
     * Returns the selected project.
     * Throws a ProjectOperationError if there is no selected project.
     * @returns selected Project_manager.
    **/
    public get_selected_project(): Project_manager {
        if (this.selected_project === undefined) {
            throw new ProjectOperationError("There is no selected project.");
        }
        return this.selected_project;
    }

    /**
     * Returns the project in the list by the specified name.
     * Throws ProjectNotFoundError if there's no project with that name in the list.
     * @param name Project name.
     * @returns a Project_manager.
    **/
    public get_project_by_name(name: string): Project_manager {
        let return_value: Project_manager | undefined = undefined;
        this.project_manager_list.forEach(project => {
            if (project.get_name() === name) {
                return_value = project;
            }
        });
        if (return_value === undefined) {
            throw new ProjectNotFoundError(`Project ${name} could not be found.`);
        }
        return return_value;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Load / Save in a file
    ////////////////////////////////////////////////////////////////////////////
    public load(): void {
        try {
            const file_content = file_utils.read_file_sync(this.sync_file_path);
            const prj_saved = JSON.parse(file_content);

            const prj_list = prj_saved.project_list;
            prj_list.forEach((prj_info: any) => {
                const prj = this.initialize_project(prj_info.name);
                // Files
                prj_info.files.forEach((file: any) => {
                    prj.add_file({
                        name: file.name, is_include_file: file.is_include_file,
                        include_path: file.include_path, logical_name: file.logical_name,
                        is_manual: file.is_manual, file_type: file.file_type,
                        file_version: file_utils.check_default_version_for_filepath(file.name, file.file_version)
                    });
                });
                // Hooks
                // Toplevel
                prj.add_toplevel_path(prj_info.toplevel);
                // Tool options
                // Watchers
                const watcher_list = prj_info.watchers;
                watcher_list.forEach((watcher: any) => {
                    prj.add_file_to_watcher(watcher);
                });
            });

            try {
                this.selected_project = this.get_project_by_name(prj_saved.selected_project);
            } catch (error) {
                this.selected_project = undefined;
            }

        }
        // eslint-disable-next-line no-empty
        catch (error) {
            // TODO Log the error
        }
    }

    public save(): void {
        const prj_list: any[] = [];
        this.project_manager_list.forEach(prj => {
            prj_list.push(prj.get_edam_json());
        });

        let selected_project_name;
        try {
            selected_project_name = this.get_selected_project().get_name();
        } catch (error) {
            selected_project_name = "";
        }
        const total = {
            selected_project: selected_project_name,
            project_list: prj_list
        };
        const config_string = JSON.stringify(total, null, 4);
        file_utils.save_file_sync(this.sync_file_path, config_string);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Project Actions
    ////////////////////////////////////////////////////////////////////////////

    /**
     * Create a project with the specified name.
     * Throws ProjectOperationError if the name is invalid.
     * Throws ProjectOperationError if that name is already being used by a project.
     * @param prj_name project name.
     * @returns a Project_manager.
    **/
    public initialize_project(prj_name: string): Project_manager {
        this.validate_project_name(prj_name);
        try {
            this.get_project_by_name(prj_name);
        } catch (error) { // Not exists
            const prj = new Project_manager(prj_name, this.emitter);
            this.project_manager_list.push(prj);
            return prj;
        }
        throw new ProjectOperationError(`Project ${prj_name} already exists. Please use a different name.`);
    }

    public create_project(prj_info: any, base_path: string): Project_manager {
        const prj = this.initialize_project(prj_info.name);

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
            let file_type = file.file_type;
            if (file_type === undefined) {
                file_type = get_language_from_filepath(name);
            }
            let file_version = file_utils.check_default_version_for_filepath(name, file.file_version);
            if (file_version === undefined) {
                file_version = file_utils.get_default_version_for_filepath(name);
            }

            const file_definition: t_file = {
                name: name,
                is_include_file: is_include_file,
                include_path: include_path,
                logical_name: logical_name,
                is_manual: is_manual,
                file_type: file_type,
                file_version: file_version
            };

            prj.add_file(file_definition);
        });

        if (prj_info.toplevel !== undefined) {
            const toplevel_path = file_utils.get_absolute_path(file_utils.get_directory(base_path),
                prj_info.toplevel);
            if (file_utils.check_if_path_exist(toplevel_path)) {
                prj.add_toplevel_path(toplevel_path);
            }
        }

        return prj;
    }

    /**
     * Rename the specified project to the new name.
     * Throws ProjectOperationError if the name is invalid.
     * Throws ProjectOperationError if that name is already being used by a project.
     * @param prj project to rename.
     * @param new_name new name.
    **/
    public rename_project(prj: Project_manager, new_name: string): void {
        this.validate_project_name(new_name);
        try {
            this.get_project_by_name(new_name);
        } catch (error) {
            // new name is valid and doesn't exits
            // Using get_project_by_name to validate if this prj is in the project list
            this.get_project_by_name(prj.get_name()).rename(new_name);
            return;
        }
        throw new ProjectOperationError(`Project ${new_name} already exists. Please use a different name.`);
    }

    /**
     * Deletes a project.
     * Throws ProjectNotFoundError if project is not in the project list.
     * @param prj project to delete.
    **/
    public delete_project(prj: Project_manager): void {

        // Check if project is in the list. Error if not.
        this.get_project_by_name(prj.get_name());

        // If it's selected, put selected empty
        try {
            if (this.get_selected_project() === prj) {
                this.selected_project = undefined;
            }
        } catch (error) { /* empty */ }

        // Create new list with rest of the projects
        const new_project_manager_list: Project_manager[] = [];
        this.project_manager_list.forEach(another_project => {
            if (another_project.get_name() !== prj.get_name()) {
                new_project_manager_list.push(another_project);
            }
        });
        this.project_manager_list = new_project_manager_list;

        // TODO
        // prj.delete();
    }

    /**
     * Mark a project as currently selected.
     * Throws ProjectNotFoundError if project is not in the project list.
     * @param prj project to select.
    **/
    public set_selected_project(prj: Project_manager): void {
        // Check if project is in the list. Error if not.
        this.get_project_by_name(prj.get_name());
        this.selected_project = prj;
    }

    private validate_project_name(name: string): void {
        if (!(name && /^[a-zA-Z0-9_-]{1,128}$/.test(name))) {
            throw new ProjectOperationError("Provided name is invalid or has more than 128 characters");
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    // Creators
    ////////////////////////////////////////////////////////////////////////////

    async create_project_from_quartus(prj_path: string): Promise<Project_manager> {
        const result = await get_project_info_from_quartus(this.get_config_global_config(), prj_path);
        const prj = this.initialize_project(result.prj_name);
        await prj.add_file_from_quartus(this.get_config_global_config(), prj_path, true);
        prj.add_toplevel_path_from_entity(result.prj_top_entity);
        return prj;
    }

    public create_project_from_json_edam(filepath: string): Project_manager {
        const prj_info = JSON.parse(file_utils.read_file_sync(filepath));
        return this.create_project(prj_info, filepath);
    }

    public create_project_from_yaml_edam(filepath: string): Project_manager {
        const prj_info = yaml.load(file_utils.read_file_sync(filepath));
        return this.create_project(prj_info, filepath);
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

    public get_config_global_config() {
        return this.global_config.get_config();
    }

    private get_sucessful_result(result_i: any): t_action_result {
        const result: t_action_result = {
            result: result_i,
            successful: true,
            msg: ""
        };
        return result;
    }

}
