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

/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from "vscode";
import * as element from "./element";
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import {e_clean_step} from 'teroshdl2/out/project_manager/tool/common';

import * as teroshdl2 from 'teroshdl2';
import { Run_output_manager } from "../run_output";
import {Logger} from "../../../logger";

export class Output_manager {
    private tree: element.ProjectProvider;
    private run_output_manager: Run_output_manager;
    private project_manager : Multi_project_manager;
    private logger : Logger;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager,
        run_output_manager: Run_output_manager, logger: Logger) {

        this.run_output_manager = run_output_manager;
        this.project_manager = manager;
        this.run_output_manager = run_output_manager;
        this.tree = new element.ProjectProvider(manager, run_output_manager);
        this.logger = logger;

        vscode.commands.registerCommand("teroshdl.view.outputs.clean", (item) => this.clean());

        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(),
            this.tree as element.BaseTreeDataProvider<element.Output>));
    }

    refresh_tree() {
        this.tree.refresh();
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

    async clean() {
        const tool_name = this.project_manager.get_config_global_config().tools.general.select_tool;
        if (tool_name !== teroshdl2.config.config_declaration.e_tools_general_select_tool.raptor){
            return;
        }

        const step_list = Object.values(teroshdl2.project_manager.tool_common.e_clean_step)
        const picker_value = await vscode.window.showQuickPick(step_list, {
            placeHolder: "Select stage.",
        });

        if (picker_value === undefined){
            return;
        }

        const prj_name = this.get_selected_project_name();
        if (prj_name === undefined){
            return;
        }

        const selfm = this;
        const step = this.get_step_enum(picker_value);
        this.project_manager.clean(prj_name, this.project_manager.get_config_global_config(), 
        step,
            (function (stream_c: any) {
                stream_c.stdout.on('data', function (data: any) {
                    selfm.logger.log(data);
                });
                stream_c.stderr.on('data', function (data: any) {
                    selfm.logger.log(data);
                });
            }),
        );
    }

    get_step_enum(value: string) : e_clean_step{
        const indexOfS = Object.values(e_clean_step).indexOf(value as unknown as e_clean_step);
        const key = Object.keys(e_clean_step)[indexOfS];
        return <e_clean_step>key;
    }
}

