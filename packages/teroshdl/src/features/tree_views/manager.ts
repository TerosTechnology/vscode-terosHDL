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

import { Project_manager } from "./project/manager";
import { Source_manager } from "./source/manager";
import { Tree_manager } from "./dependency/manager";
import { Runs_manager } from "./runs/manager";
import { Actions_manager } from "./actions/manager";
import { Run_output_manager } from "./run_output";
import { Watcher_manager } from "./watchers/manager";
import { Output_manager } from "./output/manager";
import { Logger } from "../../logger";

import * as events from "events";
import * as vscode from "vscode";
import * as os from "os";
import * as path_lib from "path";
import { t_Multi_project_manager } from '../../type_declaration';
import { Schematic_manager } from "../schematic";
import { Dependency_manager } from "../dependency";
import * as teroshdl from "teroshdl2";

let project_manager: Project_manager;
let source_manager: Source_manager;
let tree_manager: Tree_manager;
let runs_manager: Runs_manager;
let run_output: Run_output_manager = new Run_output_manager();
let actions_manager: Actions_manager;
let watcher_manager: Watcher_manager;
let output_manager: Output_manager;
let multi_manager: t_Multi_project_manager;

export class Tree_view_manager {
    private logger: Logger = new Logger();
    private statusbar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager, emitter: events.EventEmitter,
        schematic_manager: Schematic_manager, dependency_manager: Dependency_manager, global_logger: Logger) {

        context.subscriptions.push(this.statusbar);
        multi_manager = manager;

        const slm = this;

        emitter.addListener('refresh', this.refresh);
        emitter.addListener('refresh_output', (function () {
            output_manager.refresh_tree();
        })
        );
        emitter.addListener('loading', (function () {
            slm.statusbar.text = `$(loading) TerosHDL: loading project..`;
            slm.statusbar.show();
        })
        );
        emitter.addListener('loaded', (function () {
            slm.statusbar.text = `$(megaphone) TerosHDL: project loaded!`;
            slm.statusbar.show();
        })
        );

        project_manager = new Project_manager(context, manager, emitter, run_output, global_logger);
        source_manager = new Source_manager(context, manager, emitter);
        tree_manager = new Tree_manager(context, manager, schematic_manager, dependency_manager);
        runs_manager = new Runs_manager(context, manager, emitter, run_output, this.logger);
        actions_manager = new Actions_manager(context, manager, emitter, run_output);
        watcher_manager = new Watcher_manager(context, manager, emitter);
        output_manager = new Output_manager(context, manager, run_output, this.logger);

        this.refresh();
    }

    refresh() {
        source_manager.refresh_tree();
        project_manager.refresh_tree();
        runs_manager.refresh_tree();
        watcher_manager.refresh_tree();
        output_manager.refresh_tree();
        tree_manager.refresh_tree();

        // Save toml
        const selected_prj = multi_manager.get_select_project();
        if (selected_prj.successful === false) {
            return;
        }
        const select_project = (<teroshdl.project_manager.project_manager.Project_manager>selected_prj.result);
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
                    const lang = teroshdl.utils.file.get_language_from_filepath(filename);
                    if (lang === teroshdl.common.general.LANGUAGE.VHDL) {
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
        teroshdl.utils.file.save_file_sync(file_path, toml);
        vscode.commands.executeCommand("teroshdl.vhdlls.restart");
        return files_toml;
    }

    // prj_loading(slm: any){
    //     // if (this.statusbar === undefined){
    //     //     this.statusbar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    //     //     this.context.subscriptions.push(this.statusbar);
    //     // }
    //     this.statusbar.text = `$(loading) TerosHDL: loading project..`;
    //     this.statusbar.show();
    // }

    // prj_loaded(slm: any){
    //     // if (this.statusbar !== undefined){
    //         this.statusbar.text = `$(megaphone) TerosHDL: project loaded!`;
    //     // }
    // }

}

