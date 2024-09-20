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
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as utils from "../utils";
import { BaseView } from "../baseView";
import { e_viewType } from "../common";
import { e_watcher_type } from "colibri/project_manager/common";

export class Watcher_manager extends BaseView{
    private tree: element.ProjectProvider;
    private project_manager: Multi_project_manager;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager) {
        super(e_viewType.WATCHERS);
        
        this.set_commands();
        this.project_manager = manager;
        this.tree = new element.ProjectProvider(manager);

        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(), this.tree as unknown as element.BaseTreeDataProvider<element.Watcher>));
    }

    set_commands() {
        vscode.commands.registerCommand("teroshdl.view.watcher.add", (item) => this.add(item));
        vscode.commands.registerCommand("teroshdl.view.watcher.delete", (item) => this.delete(item));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async add(item: element.Watcher) {
        try {

            const prj = this.project_manager.get_selected_project();

            const element_types = ["VUnit", "CSV"];
            const picker_value = await utils.get_picker_value(element_types, "Choose file watcher type");
            let watcher_type = e_watcher_type.CSV;
            if (picker_value === element_types[0]) {
                watcher_type = e_watcher_type.VUNIT;
            }
            else if (picker_value === element_types[1]) {
                watcher_type = e_watcher_type.CSV;
            }
            else {
                return;
            }
            const path_list = await utils.get_from_open_dialog("Add watcher", false, true, true,
                "Select watcher files", { 'File (*.*)': ['*'] });

            path_list.forEach(path_inst => {
                prj.add_file_to_watcher({ path: path_inst, watcher_type: watcher_type });
            });
        } catch (error) {

        }
    }

    delete(item: element.Watcher) {
        try {
            const prj = this.project_manager.get_selected_project();
            prj.delete_file_in_watcher(item.get_name());
        } catch (error) {

        }
    }

    refresh_tree() {
        this.tree.refresh();
    }
}

