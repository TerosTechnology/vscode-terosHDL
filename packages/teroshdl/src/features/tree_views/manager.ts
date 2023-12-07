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

import * as vscode from "vscode";
import * as os from "os";
import * as path_lib from "path";
import * as teroshdl2 from "teroshdl2";
import { Project_manager } from "./project/manager";
import { Source_manager } from "./source/manager";
import { TreeDependencyManager } from "./dependency/manager";
import { Runs_manager } from "./runs/manager";
import { Tasks_manager } from "./tasks/manager";
import { IpCatalogManager } from "./ip-catalog/manager";
import { Actions_manager } from "./actions/manager";
import { Run_output_manager } from "./run_output";
import { Watcher_manager } from "./watchers/manager";
import { Output_manager } from "./output/manager";
import { Logger } from "../../logger";
import { t_Multi_project_manager } from '../../type_declaration';
import { Schematic_manager } from "../schematic";
import { Dependency_manager } from "../dependency";
import { LogView } from "../../views/logs";

let run_output: Run_output_manager = new Run_output_manager();
let multi_manager: t_Multi_project_manager;
let viewList: any[] = [];

export class Tree_view_manager {
    private logger: Logger = new Logger();
    private statusbar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager,
        emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter,
        schematic_manager: Schematic_manager,
        dependency_manager: Dependency_manager, global_logger: Logger,
        logView: LogView) {

        context.subscriptions.push(this.statusbar);
        multi_manager = manager;

        viewList = [
            new Project_manager(context, manager, emitterProject, run_output, global_logger),
            new Source_manager(context, manager),
            new TreeDependencyManager(context, manager, schematic_manager, dependency_manager),
            new Runs_manager(context, manager, run_output, this.logger),
            new Tasks_manager(context, manager, this.logger, logView),
            new IpCatalogManager(context, manager, this.logger),
            new Actions_manager(context),
            new Watcher_manager(context, manager),
            new Output_manager(context, manager, run_output, this.logger),
        ];

        emitterProject.addProjectListener(this.runRefresh);
        emitterProject.addProjectListener(this.refreshToml);

        emitterProject.enable();
        emitterProject.emitEvent("", teroshdl2.project_manager.projectEmitter.e_event.GLOBAL_REFRESH);
    }

    private async runRefresh(projectName: string, eventType: teroshdl2.project_manager.projectEmitter.e_event): Promise<void> {
        for (const view of viewList) {
            if (view.getRefreshEventList().includes(eventType)) {
                view.refresh_tree();
            }
        }
        multi_manager.save();
    }

    private async refreshToml(projectName: string, eventType: teroshdl2.project_manager.projectEmitter.e_event): Promise<void> {
        const refuseRefreshEventList = [
            teroshdl2.project_manager.projectEmitter.e_event.EXEC_RUN,
            teroshdl2.project_manager.projectEmitter.e_event.FINISH_RUN,
            teroshdl2.project_manager.projectEmitter.e_event.UPDATE_TASK,
        ];

        if (refuseRefreshEventList.includes(eventType)) {
            return;
        }

        try {
            // Save toml
            const select_project = multi_manager.get_selected_project();
            if (select_project.get_name() !== projectName && projectName !== "") {
                return;
            }

            const prj_sources = select_project.get_project_definition().file_manager.get();

            type t_lib = {
                name: string,
                files: string[]
            };

            let libraries: t_lib[] = [];

            for (let i = 0; i < prj_sources.length; i++) {
                const source = prj_sources[i];

                // Check if file in library
                let file_in_library = false;
                for (let j = 0; j < libraries.length; j++) {
                    const library = libraries[j];
                    if (library.name === source.logical_name) {
                        file_in_library = true;
                        library.files.push(source.name);
                        break;
                    }
                }
                if (file_in_library === false) {
                    let new_library: t_lib = {
                        name: source.logical_name,
                        files: [source.name]
                    };
                    libraries.push(new_library);
                }
            }

            let files_toml: string[] = [];
            let file_path = path_lib.join(os.homedir(), ".vhdl_ls.toml");
            let toml = "[libraries]\n\n";
            if (libraries !== undefined) {
                for (let i = 0; i < libraries.length; i++) {
                    let library = libraries[i];
                    let files_in_library = "";
                    for (let j = 0; j < library.files.length; j++) {
                        const file_in_library = library.files[j];
                        let filename = path_lib.basename(file_in_library);
                        const lang = teroshdl2.utils.file.get_language_from_filepath(filename);
                        if (lang === teroshdl2.common.general.LANGUAGE.VHDL) {
                            files_in_library += `  '${file_in_library}',\n`;
                            files_toml.push(file_in_library);
                        }
                    }
                    let lib_name = library.name;
                    if (lib_name === "") {
                        lib_name = "none";
                    }
                    if (library.name === undefined || library.name === '') {
                        library.name = 'work';
                    }
                    toml += `${library.name}.files = [\n${files_in_library}]\n\n`;
                }
            }
            teroshdl2.utils.file.save_file_sync(file_path, toml);
            vscode.commands.executeCommand("teroshdl.vhdlls.restart");
        } catch (error) {
            return;
        }
    }
}

