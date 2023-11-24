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

import { Multi_project_manager } from "teroshdl2/out/project_manager/multi_project_manager";
import * as vscode from "vscode";
import { get_icon } from "../utils";
import * as teroshdl2 from "teroshdl2";
import { ThemeColor } from "vscode";

export const VIEW_ID = "teroshdl-view-tasks";
const URISTRINGINIT = "teroshdl:/";

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let formattedHours = (hours < 10) ? "0" + hours : hours.toString();
    let formattedMinutes = (minutes < 10) ? "0" + minutes : minutes.toString();
    let formattedSeconds = (seconds < 10) ? "0" + seconds : seconds.toString();

    return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
}

function appendDuration(name, duration) {
    return duration !== undefined ? name + ` (${msToTime(duration)})` : name;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Elements
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class Task extends vscode.TreeItem {
    public children: any[] | undefined;
    public contextValue = "";
    public taskDefinition: teroshdl2.project_manager.tool_common.t_taskRep;
    // Element
    private name: string;

    constructor(taskDefinition: teroshdl2.project_manager.tool_common.t_taskRep, children?: any[]) {

        super(
            // appendDuration(taskDefinition.name, taskDefinition.duration),
            "0",
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
        );
        // this.resourceUri = vscode.Uri.parse(URISTRINGINIT + taskDefinition.state);
        // Common
        this.children = children;
        // Element
        this.taskDefinition = taskDefinition;
        this.name = taskDefinition.name;
        if (taskDefinition.label !== "") {
            this.tooltip = taskDefinition.label;
        }
        this.iconPath = get_icon("play-blue");
        if (taskDefinition.executionType !== teroshdl2.project_manager.tool_common.e_taskExecutionType.DISPLAYGROUP) {

            if (taskDefinition.icon === teroshdl2.project_manager.tool_common.e_iconType.CHIP) {
                this.iconPath = get_icon("verilog");
            }
            else if (taskDefinition.icon === teroshdl2.project_manager.tool_common.e_iconType.WAVEFORM) {
                this.iconPath = get_icon("pulse");
            }
            else if (taskDefinition.icon === teroshdl2.project_manager.tool_common.e_iconType.TIME) {
                this.iconPath = get_icon("clock");
            }
            this.command = {
                command: "teroshdl.view.tasks.run",
                title: "Run",
                arguments: [this],
            };
        }

        if (taskDefinition.reports !== undefined) {
            if (taskDefinition.reports.includes(teroshdl2.project_manager.tool_common.e_reportType.REPORT)) {
                this.contextValue += ";report";
            }
            if (taskDefinition.reports.includes(teroshdl2.project_manager.tool_common.e_reportType.TIMINGANALYZER)) {
                this.contextValue += ";timinganalyzer";
            }
            if (taskDefinition.reports.includes(teroshdl2.project_manager.tool_common.e_reportType.TECHNOLOGYMAPVIEWER)) {
                this.contextValue += ";technologymapviewer";
            }
            if (taskDefinition.reports.includes(teroshdl2.project_manager.tool_common.e_reportType.SNAPSHOPVIEWER)) {
                this.contextValue += ";snapshotviewer";
            }
        }
    }

    get_name() {
        return this.name;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Providers
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export abstract class BaseTreeDataProvider<T> implements vscode.TreeDataProvider<T> {
    static getViewID(): string {
        throw new Error('Not implemented.');
    }

    abstract getTreeItem(element: T): vscode.TreeItem | Thenable<vscode.TreeItem>;
    abstract getChildren(element?: T | undefined): vscode.ProviderResult<T[]>;
}

export class ProjectProvider extends BaseTreeDataProvider<TreeItem> {

    private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

    data: TreeItem[] = [];
    private project_manager: Multi_project_manager;

    constructor(project_manager: Multi_project_manager) {
        super();
        this.project_manager = project_manager;
    }

    getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }

    static getViewID() {
        return VIEW_ID;
    }

    async refresh(): Promise<void> {
        try {
            const selected_project = this.project_manager.get_selected_project();
            const groupTaskList = selected_project.getBuildSteps();

            function createTasks(children, depth = 0) {
                const tasks: Task[] = [];
                for (const child of children) {
                    const childTasks = child.children ? createTasks(child.children, depth + 1) : [];
                    tasks.push(new Task(child, childTasks.length > 0 ? childTasks : undefined));
                }
                return tasks;
            }

            const taskView = createTasks(groupTaskList);


            this.data = taskView;
        } catch (error) {
            this.data = [];
        }
        this._onDidChangeTreeData.fire();
    }
}

export class TreeItem extends vscode.TreeItem {
    children: TreeItem[] | undefined;

    constructor(label: string, children?: TreeItem[]) {
        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                vscode.TreeItemCollapsibleState.Expanded);
        this.children = children;
    }
}


export class RedTextDecorator implements vscode.FileDecorationProvider {
    onDidChangeFileDecorations?: vscode.Event<vscode.Uri | vscode.Uri[]>;
    provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<vscode.FileDecoration> {
        if (uri.path === "/" + teroshdl2.project_manager.tool_common.e_taskState.RUNNING) {
            return {
                color: new ThemeColor("charts.yellow"),
                tooltip: 'Running',
                badge: "⌛"
            };
        }
        else if (uri.path === "/" + teroshdl2.project_manager.tool_common.e_taskState.FINISHED) {
            return {
                color: new ThemeColor("charts.green"),
                tooltip: 'Finished',
                badge: "✓"
            };
        }
        else if (uri.path === "/" + teroshdl2.project_manager.tool_common.e_taskState.FAILED) {
            return {
                color: new ThemeColor("charts.red"),
                tooltip: 'Failed',
                badge: "X"
            };
        }
    }
}