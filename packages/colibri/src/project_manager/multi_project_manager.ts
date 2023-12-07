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

import { e_project_type } from "./common";
import { Project_manager } from "./project_manager";
import * as file_utils from "../utils/file_utils";
import { QuartusProjectManager } from "./tool/quartus/quartusProjectManager";
import { ProjectEmitter, e_event } from "./projectEmitter";

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
    private sync_file_path = "";
    private projectEmitter: ProjectEmitter;

    constructor(projectEmitter: ProjectEmitter, sync_file_path = "") {
        this.sync_file_path = sync_file_path;
        this.projectEmitter = projectEmitter;
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
    public async load(emitterProject: ProjectEmitter): Promise<void> {
        let failed = false;

        // Initialize
        this.project_manager_list = [];
        this.selected_project = undefined;

        try {
            const file_content = file_utils.read_file_sync(this.sync_file_path);
            const prj_saved = JSON.parse(file_content);

            for (const prj_info of prj_saved.project_list) {
                try {
                    if (prj_info.project_type === e_project_type.QUARTUS) {
                        this.add_project(
                            await QuartusProjectManager.fromJson(prj_info, this.sync_file_path, emitterProject)
                        );
                    } else {
                        this.add_project(
                            await Project_manager.fromJson(prj_info, this.sync_file_path, emitterProject)
                        );
                    }
                } catch (error) {
                    failed = true;
                }
            }

            if (prj_saved.selected_project) {
                try {
                    this.selected_project = this.get_project_by_name(prj_saved.selected_project);
                } catch (error) {
                    this.selected_project = undefined;
                    failed = true;
                }
            }
        }

        catch (error) {
            failed = true;
        }

        this.projectEmitter.emitEvent("", e_event.ADD_PROJECT);

        if (failed) {
            throw new ProjectOperationError(`There have been errors loading project list from disk.`);
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
     * Add an existing project to the project list.
     * Throws ProjectOperationError if the name is invalid.
     * Throws ProjectOperationError if that name is used by a project already in the list.
     * @param prj a Project_manager.
    **/
    public add_project(prj: Project_manager): void {
        this.validate_project_name(prj.get_name());
        try {
            this.get_project_by_name(prj.get_name());
        } catch (error) { // Not exists
            this.project_manager_list.push(prj);
            this.projectEmitter.emitEvent("", e_event.ADD_PROJECT);
            return;
        }
        throw new ProjectOperationError(`Project ${prj.get_name()} already exists. Please use a different name.`);
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

        this.projectEmitter.emitEvent("", e_event.REMOVE_PROJECT);

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
        this.projectEmitter.emitEvent("", e_event.SELECT_PROJECT);
    }

    private validate_project_name(name: string): void {
        if (!(name && /^[a-zA-Z0-9_-]{1,128}$/.test(name))) {
            throw new ProjectOperationError("Provided name is invalid or has more than 128 characters");
        }
    }

}
