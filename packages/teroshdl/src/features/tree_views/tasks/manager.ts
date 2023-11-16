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
import * as events from "events";
import * as teroshdl2 from 'teroshdl2';
import { Logger } from "../../../logger";
import { RedTextDecorator } from "./element";
import { ChildProcess } from "child_process";
import * as shelljs from 'shelljs';

enum e_VIEW_STATE {
    IDLE = 0,
    RUNNING = 1,
    FINISHED = 2,
    FAILED = 3
}

export class Tasks_manager {
    private tree: element.ProjectProvider;
    private project_manager: t_Multi_project_manager;
    private logger: Logger;
    private emitter: events.EventEmitter;
    private state: e_VIEW_STATE = e_VIEW_STATE.IDLE;
    private latesRunTask: ChildProcess | undefined = undefined;
    private latestTask: teroshdl2.project_manager.tool_common.e_taskType | undefined = undefined;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager, emitter: events.EventEmitter,
        logger: Logger) {

        this.set_commands();

        this.logger = logger;
        this.project_manager = manager;
        this.tree = new element.ProjectProvider(manager);
        this.emitter = emitter;

        const provider = new RedTextDecorator();
        context.subscriptions.push(vscode.window.registerFileDecorationProvider(provider));

        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(),
            this.tree as element.BaseTreeDataProvider<element.Task>));
    }

    set_commands() {
        vscode.commands.registerCommand("teroshdl.view.tasks.report", (item) =>
            this.openReport(item, teroshdl2.project_manager.tool_common.e_reportType.REPORT));
        vscode.commands.registerCommand("teroshdl.view.tasks.timing_analyzer", (item) =>
            this.openReport(item, teroshdl2.project_manager.tool_common.e_reportType.TIMINGANALYZER));
        vscode.commands.registerCommand("teroshdl.view.tasks.technology_map_viewer", (item) =>
            this.openReport(item, teroshdl2.project_manager.tool_common.e_reportType.TECHNOLOGYMAPVIEWER));
        vscode.commands.registerCommand("teroshdl.view.tasks.snapshotviewer", (item) =>
            this.openReport(item, teroshdl2.project_manager.tool_common.e_reportType.SNAPSHOPVIEWER));

        vscode.commands.registerCommand("teroshdl.view.tasks.stop", () => this.stop());
        vscode.commands.registerCommand("teroshdl.view.tasks.run", (item) => this.run(item));
        vscode.commands.registerCommand("teroshdl.view.tasks.clean", () => this.clean());
    }

    stop() {
        if (this.latesRunTask && !this.latesRunTask.killed) {
            // const signal = process.platform === 'win32' ? 'SIGINT' : 'SIGTERM';
            const EMITSIGNAL = 'SIGKILL';
            this.latesRunTask.kill(EMITSIGNAL);
            this.latesRunTask.on('close', (code, signal) => {
                if (signal === EMITSIGNAL) {
                    this.logger.warn(`${this.latestTask} stopped with signal ${signal}`);
                    vscode.window.showInformationMessage(`${this.latestTask} stopped successfully.`);
                }
            });
        }
    }

    async run(taskItem: element.Task) {
        if (this.checkRunning()) {
            return;
        }

        this.state = e_VIEW_STATE.RUNNING;
        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

        try {
            const selectedProject = this.project_manager.get_selected_project();

            const taskStatus = selectedProject.getTaskState(taskItem.taskDefinition.name);
            if (taskStatus === teroshdl2.project_manager.tool_common.e_taskState.FINISHED) {
                const msg = `${taskItem.taskDefinition.name} has already run successfully. Do you want to run the task again?`;
                const result = await vscode.window.showInformationMessage(
                    msg,
                    'Yes',
                    'No'
                );

                if (result === 'No') {
                    this.state = e_VIEW_STATE.IDLE;
                    return;
                }
            }

            const task = taskItem.taskDefinition.name;
            statusBarItem.text = `$(sync~spin) Running Quartus task: ${task} ...`;
            statusBarItem.show();

            const exec_i = selectedProject.runTask(task, (result: teroshdl2.process.common.p_result) => {
                statusBarItem.hide();
                this.state = e_VIEW_STATE.IDLE;
                // Refresh view to set the finish decorators
                this.refresh_tree();
            });
            this.latesRunTask = exec_i;
            this.latestTask = taskItem.taskDefinition.name;
            // Refresh view to set the running decorators
            this.refresh_tree();

            this.logger.show(true);
            if (exec_i.stdout) {
                exec_i.stdout.on('data', (data: string) => {
                    this.logger.log(data);
                });
            }

            if (exec_i.stderr) {
                exec_i.stderr.on('data', (data: string) => {
                    this.logger.log(data);
                });
            }
        }
        catch (error) {
            // Refresh view to set the finish decorators
            this.refresh_tree();
            statusBarItem.hide();
            this.state = e_VIEW_STATE.IDLE;
        }
    }


    async clean() {
        if (this.checkRunning()) {
            return;
        }

        const msg = "Do you want to clean the project? Cleaning revisions removes the project database and other files generated by the Quartus Prime Software, including report and programming files.";
        const result = await vscode.window.showInformationMessage(
            msg,
            'Yes',
            'No'
        );

        if (result === 'Yes') {
            this.state = e_VIEW_STATE.RUNNING;

            const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
            statusBarItem.text = `$(sync~spin) Running Quartus task: Clean Project...`;
            statusBarItem.show();
            try {
                const selectedProject = this.project_manager.get_selected_project();
                const result = await selectedProject.cleallAllProject();

                this.logger.show(true);
                this.logger.log(result.msg);
            }
            catch (error) { }
            finally {
                statusBarItem.hide();
                this.state = e_VIEW_STATE.IDLE;
                // Refresh view to set the finish decorators
                this.refresh_tree();
            }
        }
    }

    checkRunning() {
        if (this.state === e_VIEW_STATE.RUNNING) {
            vscode.window.showInformationMessage("There is a task running. Please wait until it finishes.");
            return true;
        }
        return false;
    }

    refresh(result: teroshdl2.project_manager.tool_common.t_test_result[]) {
        this.refresh_tree();
        this.emitter.emit('refresh_output');
    }

    openReport(taskItem: element.Task, reportType: teroshdl2.project_manager.tool_common.e_reportType) {
        const selectedProject = this.project_manager.get_selected_project();
        const task = taskItem.taskDefinition.name;
        const report = selectedProject.getArtifact(task, reportType);
        if (reportType === teroshdl2.project_manager.tool_common.e_reportType.TECHNOLOGYMAPVIEWER) {
            vscode.window.showWarningMessage("Technology Map Viewer is not supported yet.");
            return;
        }
        else if (reportType === teroshdl2.project_manager.tool_common.e_reportType.SNAPSHOPVIEWER) {
            vscode.window.showWarningMessage("Snapshop Viewer is not supported yet.");
            return;
        }

        const taskStatus = selectedProject.getTaskState(task);
        if (taskStatus !== teroshdl2.project_manager.tool_common.e_taskState.FINISHED) {
            vscode.window.showWarningMessage(`The task ${task} has not finished yet. Please wait until it finishes to open the report.`);
            return;
        }

        if (report.artifact_type === teroshdl2.project_manager.tool_common.e_artifact_type.COMMAND) {
            shelljs.exec(report.command, { async: true, cwd: report.path });
        }
        if (report.artifact_type === teroshdl2.project_manager.tool_common.e_artifact_type.SUMMARY
            && report.element_type === teroshdl2.project_manager.tool_common.e_element_type.TEXT_FILE) {
            vscode.window.showTextDocument(vscode.Uri.file(report.path));
        }
    }

    refresh_tree() {
        this.tree.refresh();
    }
}

