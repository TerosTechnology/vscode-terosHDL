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

import { Run_output_manager } from "../run_output";
import { toolLogger } from "../../../logger";
import { BaseView } from "../baseView";
import { e_viewType } from "../common";
import { GlobalConfigManager } from "colibri/config/config_manager";
import { e_tools_general_select_tool } from "colibri/config/config_declaration";
import { e_clean_step } from "colibri/project_manager/tool/common";

export class Output_manager extends BaseView{
    private tree: element.ProjectProvider;
    private run_output_manager: Run_output_manager;
    private project_manager: Multi_project_manager;
    private treeView: vscode.TreeView<element.TreeItem>;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager,
        run_output_manager: Run_output_manager) {

        super(e_viewType.OUTPUT);

        this.run_output_manager = run_output_manager;
        this.project_manager = manager;
        this.run_output_manager = run_output_manager;
        this.tree = new element.ProjectProvider(manager, run_output_manager);

        vscode.commands.registerCommand("teroshdl.view.outputs.clean", (item) => this.clean());

        this.treeView = vscode.window.createTreeView(element.ProjectProvider.getViewID(), {treeDataProvider: this.tree});
    }

    refresh_tree() {
        try {
            const prj = this.project_manager.get_selected_project();
            const title = prj.getRunTitle();
            this.treeView.title = title + " - OUTPUT";
        }
        catch (error) {}

        this.tree.refresh();
    }

    async clean() {
        const tool_name = GlobalConfigManager.getInstance().get_config().tools.general.select_tool;
        if (tool_name !== e_tools_general_select_tool.raptor) {
            return;
        }

        const step_list = Object.values(e_clean_step);
        const picker_value = await vscode.window.showQuickPick(step_list, {
            placeHolder: "Select stage.",
        });

        if (picker_value === undefined) {
            return;
        }

        try {
            const prj = this.project_manager.get_selected_project();
            const step = this.get_step_enum(picker_value);
            prj.clean(
                step,
                (function (stream_c: any) {
                    stream_c.stdout.on('data', function (data: any) {
                        toolLogger.log(data);
                    });
                    stream_c.stderr.on('data', function (data: any) {
                        toolLogger.log(data);
                    });
                }),
            );
        } catch (error) {
            return;
        }
    }

    get_step_enum(value: string): e_clean_step {
        const indexOfS = Object.values(e_clean_step).indexOf(value as unknown as e_clean_step);
        const key = Object.keys(e_clean_step)[indexOfS];
        return <e_clean_step>key;
    }
}

