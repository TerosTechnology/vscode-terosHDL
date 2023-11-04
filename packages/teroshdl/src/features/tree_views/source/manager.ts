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
import * as utils from "../utils";
import { t_Multi_project_manager } from '../../../type_declaration';
import * as teroshdl2 from 'teroshdl2';
import * as events from "events";
import * as file_utils from "teroshdl2/out/utils/file_utils";

export class Source_manager {
    private tree: element.ProjectProvider;
    private project_manager: t_Multi_project_manager;
    private emitter : events.EventEmitter;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager, emitter : events.EventEmitter) {
        this.set_commands();

        this.emitter = emitter;
        this.project_manager = manager;
        this.tree = new element.ProjectProvider(manager);

        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(), this.tree as element.BaseTreeDataProvider<element.Source_tree_element>));
    }

    set_commands() {
        vscode.commands.registerCommand("teroshdl.view.source.save_project", () => this.save_project());
        vscode.commands.registerCommand("teroshdl.view.source.select_toplevel", (item) => this.select_top(item));
        vscode.commands.registerCommand("teroshdl.view.source.add", async () => await this.add());
        vscode.commands.registerCommand("teroshdl.view.source.add_source_to_library", (item) => this.add_source_to_library(item));
        vscode.commands.registerCommand("teroshdl.view.source.delete_library", (item) => this.delete_library(item));
        vscode.commands.registerCommand("teroshdl.view.source.delete_source", (item) => this.delete_source(item));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async save_project() {
        const prj_name = this.get_selected_project_name();
        if (prj_name === undefined) {
            return;
        }
        const output_path = await utils.get_save_dialog("Save project", "Save", []);
        if (output_path !== ""){
            const prj = this.project_manager.get_project_by_name(prj_name);
            const prj_edam = prj?.save_edam_yaml(output_path);
            // file_utils.save_file_sync()
            // console.log("")
        }
    }

    async add() {
        const prj_name = this.get_selected_project_name();
        if (prj_name === undefined) {
            return;
        }

        const element_types = ["Source", "Library"];
        const picker_value = await utils.get_picker_value(element_types, "Add source/library:");

        // Add source
        if (picker_value === element_types[0]) {
            // const element_types = ["Browser", "Load from CSV", "Load from VUnit run.py", "Load from Vivado .xpr"];
            const element_types = [
                "Browser", 
                "Load from CSV", 
                "Load from VUnit run.py",
                "Add all HDL files from a directory and subdirectories",
                "Add all files from a directory",
                "Load from Intel® Quartus® Prime project"
            ];
            const picker_value = await utils.get_picker_value(element_types, "Add from:");

            // Add from browser
            if (picker_value === element_types[0]) {
                await utils.add_sources_from_open_dialog(this.project_manager, prj_name, "");
            }
            // Add from CSV
            else if (picker_value === element_types[1]) {
                const csv_path = await utils.get_from_open_dialog("Add from CSV", false, true, false, 
                    "Select CSV file", {'CSV file (*.csv, *.CSV)': ['csv', 'CSV']});
                if (csv_path.length !== 0) {
                    this.project_manager.add_file_from_csv(prj_name, csv_path[0], true);
                }
            }
            // Add from VUnit
            else if (picker_value === element_types[2]) {
                await utils.add_sources_from_vunit(this.project_manager, prj_name, true);
            }
            // Add from directory and subirectories
            else if (picker_value === element_types[3]) {
                await utils.add_sources_from_directory_and_subdirectories(this.project_manager, prj_name, true);
            }
            // Add from directory and subirectories
            else if (picker_value === element_types[4]) {
                await utils.add_sources_from_directory_and_subdirectories(this.project_manager, prj_name, false);
            }
            // Add from Quartus
            else if (picker_value === element_types[5]) {
                await utils.add_sources_from_quartus(this.project_manager, prj_name, true);
            }
        }
        // Add library
        else {
            const logical_name = await utils.get_from_input_box("Add new library", "Library name");
            if (logical_name !== undefined) {
                this.project_manager.add_logical(prj_name, logical_name);
            }
        }
        this.refresh();
    }

    async add_source_to_library(item: element.Source_tree_element) {
        const prj_name = this.get_selected_project_name();
        if (prj_name === undefined) {
            return;
        }
        await utils.add_sources_from_open_dialog(this.project_manager, prj_name, item.get_logical_name());
        this.refresh();
    }

    async delete_library(item: element.Source_tree_element) {
        const prj_name = this.get_selected_project_name();
        if (prj_name === undefined) {
            return;
        }
        this.project_manager.delete_file_by_logical_name(prj_name, item.get_logical_name());
        this.refresh();
    }

    async delete_source(item: element.Source_tree_element) {
        const prj_name = this.get_selected_project_name();
        if (prj_name === undefined) {
            return;
        }
        this.project_manager.delete_file(prj_name, item.get_name(), item.get_logical_name());
        this.refresh();
    }

    async select_top(item: element.Source_tree_element) {
        const prj_name = this.get_selected_project_name();
        if (prj_name === undefined) {
            return;
        }
        this.project_manager.add_toplevel_path(prj_name, item.get_name());
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

    refresh(){
        this.emitter.emit('refresh');
    }

    refresh_tree(){
        this.tree.refresh();
    }
}

