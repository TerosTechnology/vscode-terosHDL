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
import { Run_output_manager } from "../run_output";
import { Logger } from "../../../logger";
import * as tree_kill from 'tree-kill';
import { BaseView } from "../baseView";
import { e_viewType } from "../common";

export class Runs_manager extends BaseView{
    private tree: element.ProjectProvider;
    private project_manager: t_Multi_project_manager;
    private run_output_manager: Run_output_manager;
    private logger: Logger;
    private last_run: any;
    private treeView: vscode.TreeView<element.TreeItem>;
    private projectEmitter: teroshdl2.project_manager.projectEmitter.ProjectEmitter;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager,
        run_output_manager: Run_output_manager, logger: Logger, 
        projectEmitter: teroshdl2.project_manager.projectEmitter.ProjectEmitter) {

        super(e_viewType.RUNS);

        this.set_commands();

        this.logger = logger;
        this.run_output_manager = run_output_manager;
        this.project_manager = manager;
        this.tree = new element.ProjectProvider(manager, run_output_manager);
        this.projectEmitter = projectEmitter;

        this.treeView = vscode.window.createTreeView(element.ProjectProvider.getViewID(), {treeDataProvider: this.tree});
    }

    set_commands() {
        vscode.commands.registerCommand("teroshdl.view.runs.run_all", () => this.run(undefined));
        vscode.commands.registerCommand("teroshdl.view.runs.stop", () => this.stop(undefined));
        vscode.commands.registerCommand("teroshdl.view.runs.run", (item) => this.run(item));
        vscode.commands.registerCommand("teroshdl.view.runs.refresh", () => this.refresh([]));
    }

    async stop(item: element.Run | undefined) {
        try {
            const pid = this.last_run.pid;
            tree_kill(pid, 'SIGTERM', (err) => {
                if (err) {
                    console.error(err);
                } else {
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    async run(item: element.Run | undefined) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            cancellable: false,
            title: 'TerosHDL: Tool running'
        }, async (progress) => {

            // Status bar to 0
            progress.report({ increment: 0 });

            // Init output to empty
            this.refresh([]);

            try {
                const prj = this.project_manager.get_selected_project();

                let test_list: teroshdl2.project_manager.tool_common.t_test_declaration[] = [];
                if (item === undefined) {
                    test_list = await prj.get_test_list();
                }
                else {
                    const test: teroshdl2.project_manager.tool_common.t_test_declaration = {
                        suite_name: item.get_suite_name(),
                        name: item.get_name(),
                        test_type: "",
                        filename: item.get_path(),
                        location: item.get_location(),
                    };
                    test_list = [test];
                }
                this.logger.show();
                const selfm = this;
                const p = new Promise<void>(resolve => {
                    prj.run(test_list,
                        (function (result: teroshdl2.project_manager.tool_common.t_test_result[]) {
                            selfm.refresh(result);
                            // Status bar to 100
                            progress.report({ increment: 100 });
                            resolve();
                        }),
                        (function (stream_c: any) {
                            selfm.last_run = stream_c;
                            stream_c.stdout.on('data', function (data: any) {
                                selfm.logger.log(data);
                            });
                            stream_c.stderr.on('data', function (data: any) {
                                selfm.logger.log(data);
                            });
                        }),
                    );
                });
                return p;
            } catch (error) {
            }
        });
    }

    refresh(result: teroshdl2.project_manager.tool_common.t_test_result[]) {
        this.run_output_manager.set_results(result);
        this.refresh_tree();
        this.projectEmitter.emitEvent("", teroshdl2.project_manager.projectEmitter.e_event.FINISH_RUN);
    }

    refresh_tree() {
        try {
            const prj = this.project_manager.get_selected_project();
            const title = prj.getRunTitle();
            this.treeView.title = title;
        }
        catch (error) {}

        this.tree.refresh();
    }
}

