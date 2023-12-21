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
import { t_Multi_project_manager } from '../../../type_declaration';
import * as teroshdl2 from 'teroshdl2';
import { RedTextDecorator } from "./element";
import { BaseView } from "../baseView";
import { e_viewType } from "../common";

export class Timing_manager extends BaseView {
    private tree: element.ProjectProvider;
    private project_manager: t_Multi_project_manager;
    private emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager,
        emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter) {

        super(e_viewType.TIMING);

        this.set_commands();

        this.project_manager = manager;
        this.tree = new element.ProjectProvider(manager);
        this.emitterProject = emitterProject;

        const provider = new RedTextDecorator();
        context.subscriptions.push(vscode.window.registerFileDecorationProvider(provider));

        // context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(),
        //     this.tree as element.BaseTreeDataProvider<element.Timing>));
    }

    set_commands() {
        // vscode.commands.registerCommand("teroshdl.view.tasks.show_timing_report", async (item) =>
        //     await this.openTimingReport());
    }

    private async openTimingReport() {
        const selectProject = await this.project_manager.get_selected_project();
        let timmingReport : teroshdl2.project_manager.common.t_timing_path[] = [];
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            cancellable: false,
            title: 'Generating Timming Report'
        }, async (progress) => {
            timmingReport = await selectProject.getTimingReport();
        });

        this.tree.refresh(timmingReport);
    }

    private refresh_tree() {
        return;
    }
}

function showTaskWarningMessage(task: string) {
    vscode.window.showWarningMessage(`The task ${task} has not finished yet. Please wait until it finishes to open the report.`);
}

