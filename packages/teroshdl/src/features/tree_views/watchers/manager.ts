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
import * as element from "./element";
import * as path_lib from "path";
import { t_Multi_project_manager } from '../../../type_declaration';
import * as events from "events";
import * as utils from "../utils";
import * as teroshdl2 from "teroshdl2";

export class Watcher_manager {
    private tree: element.ProjectProvider;
    private project_manager: t_Multi_project_manager;
    private emitter: events.EventEmitter;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager, emitter: events.EventEmitter) {
        this.set_commands();

        this.emitter = emitter;
        this.project_manager = manager;
        this.tree = new element.ProjectProvider(manager);

        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(), this.tree as element.BaseTreeDataProvider<element.Watcher>));
    }

    set_commands() {
        vscode.commands.registerCommand("teroshdl.view.watcher.add", (item) => this.add(item));
        vscode.commands.registerCommand("teroshdl.view.watcher.delete", (item) => this.delete(item));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async add(item: element.Watcher){
        const prj_name = this.get_selected_project_name();
        if (prj_name === undefined){
            return;
        }

        // const element_types = ["VUnit", "CSV", "Vivado project"];
        const element_types = ["VUnit", "CSV"];
        const picker_value = await utils.get_picker_value(element_types, "Choose file watcher type");
        let watcher_type = teroshdl2.project_manager.common.e_watcher_type.CSV;
        if (picker_value === element_types[0]){
            watcher_type = teroshdl2.project_manager.common.e_watcher_type.VUNIT;
        }
        else if(picker_value === element_types[1]){
            watcher_type = teroshdl2.project_manager.common.e_watcher_type.CSV;
        }
        // else if(picker_value === element_types[2]){
        //     watcher_type = teroshdl2.project_manager.common.e_watcher_type.VIVADO;
        // }
        else{
            return;
        }
        const path_list = await utils.get_from_open_dialog("Add watcher", false, true, true, 
            "Select watcher files", {'File (*.*)': ['*']});
        
        path_list.forEach(path_inst => {
            this.project_manager.add_file_to_watcher(prj_name, {path: path_inst, watcher_type: watcher_type});
        });
        this.refresh();
    }

    get_selected_project_name(): string | undefined {
        const selected_prj = this.project_manager.get_select_project();
        // No project select
        if (selected_prj.successful === false) {
            return undefined;
        }
        else {
            return (<teroshdl2.project_manager.project_manager.Project_manager>selected_prj.result).get_name();
        }
    }

    delete(item: element.Watcher){
        const prj_name = this.get_selected_project_name();
        if (prj_name === undefined){
            return;
        }
        this.project_manager.delete_file_in_watcher(prj_name, item.get_name());
        this.refresh();
    }

    refresh() {
        this.emitter.emit('refresh');
    }

    refresh_tree() {
        this.tree.refresh();
    }
}

