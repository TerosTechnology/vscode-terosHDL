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
import * as path_lib from 'path';
import * as shelljs from 'shelljs';
import { open_file } from "../../../utils/utils";
import { BaseView } from "../baseView";
import { e_viewType } from "../common";
import { SourcetDecorator } from "./element";

export class Source_manager extends BaseView {
    private tree: element.ProjectProvider;
    private project_manager: t_Multi_project_manager;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager) {
        super(e_viewType.SOURCE);

        this.set_commands();

        this.project_manager = manager;
        this.tree = new element.ProjectProvider(manager);

        const provider = new SourcetDecorator();
        context.subscriptions.push(vscode.window.registerFileDecorationProvider(provider));

        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(), this.tree as element.BaseTreeDataProvider<element.Source_tree_element>));
    }

    set_commands() {
        vscode.commands.registerCommand("teroshdl.view.source.search", () => this.search());
        vscode.commands.registerCommand("teroshdl.view.source.save_project", () => this.save_project());
        vscode.commands.registerCommand("teroshdl.view.source.select_toplevel", (item) => this.select_top(item));
        vscode.commands.registerCommand("teroshdl.view.source.add", async () => await this.add());
        vscode.commands.registerCommand("teroshdl.view.source.add_source_to_library", (item) => this.add_source_to_library(item));
        vscode.commands.registerCommand("teroshdl.view.source.delete_library", (item) => this.delete_library(item));
        vscode.commands.registerCommand("teroshdl.view.source.delete_source", (item) => this.delete_source(item));
        vscode.commands.registerCommand("teroshdl.view.source.open", (item) => this.openSource(item));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async openSource(name: string) {
        const fileExtension = path_lib.extname(name);

        const prj = this.project_manager.get_selected_project();
        const prjType = prj.getProjectType();
        if (prjType === teroshdl2.project_manager.common.e_project_type.QUARTUS &&
            (fileExtension === ".ip" || fileExtension === ".qsys")) {

            const config = prj.get_config();
            const pathBin = path_lib.join(teroshdl2.project_manager.quartus.getQsysPath(config), "qsys-edit");

            const qPath = prj.projectDiskPath.replace(".qsf", ".qpf");
            const cmd = `${pathBin} ${name} --quartus-project=${qPath}`;
            shelljs.exec(cmd, { async: true });
        }
        else {
            open_file(vscode.Uri.file(name));
        }
    }

    async search() {
        vscode.commands.executeCommand(element.ProjectProvider.getViewID() + ".focus")
        await vscode.commands.executeCommand('list.find');
    }

    async save_project() {
        try {
            const prj = this.project_manager.get_selected_project();
            const output_path = await utils.get_save_dialog("Save project", "Save", []);
            if (output_path !== "") {
                prj.save_edam_yaml(output_path);
            }
        } catch (error) {

        }
    }

    async add() {
        try {
            const prj = this.project_manager.get_selected_project();
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
                ];
                const picker_value = await utils.get_picker_value(element_types, "Add from:");
                // Add from browser
                if (picker_value === element_types[0]) {
                    await utils.add_sources_from_open_dialog(prj, "");
                }
                // Add from CSV
                else if (picker_value === element_types[1]) {
                    const csv_path = await utils.get_from_open_dialog("Add from CSV", false, true, false,
                        "Select CSV file", { 'CSV file (*.csv, *.CSV)': ['csv', 'CSV'] });
                    if (csv_path.length !== 0) {
                        prj.add_file_from_csv(csv_path[0], true);
                    }
                }
                // Add from VUnit
                else if (picker_value === element_types[2]) {
                    await utils.add_sources_from_vunit(prj, true);
                }
                // Add from directory and subirectories
                else if (picker_value === element_types[3]) {
                    await utils.add_sources_from_directory_and_subdirectories(prj, true);
                }
                // Add from directory and subirectories
                else if (picker_value === element_types[4]) {
                    await utils.add_sources_from_directory_and_subdirectories(prj, false);
                }
            }
            // Add library
            else {
                const logical_name = await utils.get_from_input_box("Add new library", "Library name");
                if (logical_name !== undefined) {
                    prj.add_logical(logical_name);
                }
            }
        } catch (error) {

        }
    }

    async add_source_to_library(item: element.Source_tree_element) {
        try {
            const prj = this.project_manager.get_selected_project();
            await utils.add_sources_from_open_dialog(prj, item.get_logical_name());
        } catch (error) {

        }
    }

    async delete_library(item: element.Source_tree_element) {
        try {
            const prj = this.project_manager.get_selected_project();
            await prj.delete_file_by_logical_name(item.get_logical_name());
        } catch (error) {

        }
    }

    async delete_source(item: element.Source_tree_element) {
        try {
            const prj = this.project_manager.get_selected_project();
            await prj.delete_file(item.get_name(), item.get_logical_name());
        } catch (error) {

        }
    }

    async select_top(item: element.Source_tree_element) {
        try {
            const prj = this.project_manager.get_selected_project();
            if (prj.getProjectType() !== teroshdl2.project_manager.common.e_project_type.QUARTUS) {
                await prj.add_toplevel_path(item.get_name());
                return;
            }

            const project_examples_types = [
                'Set as top level design',
                'Set as top level testbench (only for simulation)'
            ];
            let picker_value = await vscode.window.showQuickPick(project_examples_types, {
                placeHolder: "Choose the type of top level",
            });
            if (picker_value !== undefined) {
                if (picker_value === project_examples_types[0]) {
                    const result = await prj.add_toplevel_path(item.get_name());
                    this.showTopLevelMessage(result.successful, true);
                }
                else if (picker_value === project_examples_types[1]) {
                    const result = await prj.setTestbench(item.get_name());
                    this.showTopLevelMessage(result.successful, false);
                }
            }
        } catch (error) {

        }
    }

    private showTopLevelMessage(successful: boolean, onlyFailed: boolean) {
        if (successful === false && !onlyFailed === true) {
            vscode.window.showErrorMessage("The testbench can not be set as top level testbench.");
        }
        else {
            vscode.window.showInformationMessage("The testbench was set as top level testbench.");
        }
    }

    refresh_tree() {
        this.tree.refresh();
    }

    private async modifyFileProperties(element: element.Source_tree_element) {
        try {
            const prj = this.project_manager.get_selected_project();
            if (prj.getProjectType() === teroshdl2.project_manager.common.e_project_type.QUARTUS) {
                const OPTIONLIST = [
                    "Set as testbench file (only for simulation)",
                    "Set as synthesis file",
                ];
                const picker_value = await vscode.window.showQuickPick(OPTIONLIST, {
                    placeHolder: "Set file type",
                });
                if (picker_value === undefined) {
                    return;
                }
                if (picker_value === OPTIONLIST[0]) {
                    await prj.modifyFileSourceType(element.get_name(), element.get_logical_name(),
                        teroshdl2.project_manager.common.e_source_type.SIMULATION);
                }
                else if (picker_value === OPTIONLIST[1]) {
                    await prj.modifyFileSourceType(element.get_name(), element.get_logical_name(),
                        teroshdl2.project_manager.common.e_source_type.SYNTHESIS);
                }
            }
            else {
                vscode.window.showInformationMessage("File properties are not available for Generic projects");
            }
        } catch (error) { }
    }
}

