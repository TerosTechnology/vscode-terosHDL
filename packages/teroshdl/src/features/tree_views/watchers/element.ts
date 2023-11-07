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
import * as path_lib from "path";

export const VIEW_ID = "teroshdl-view-watcher";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Elements
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class Watcher extends vscode.TreeItem {
    public children: any[] | undefined;
    public iconPath = get_icon("search");
    public contextValue = "watcher";
    private name: string;

    constructor(name: string, children?: any[]) {
        super(
            name,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
        );
        // Common
        this.children = children;
        this.name = name;
        // Element
        this.tooltip = name;
        this.label = path_lib.basename(name);
        this.command = {
            title: 'Open file',
            command: 'vscode.open',
            arguments: [vscode.Uri.file(name)]
        };
    }

    public get_name(): string {
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

    refresh(): void {
        const watcher_view : Watcher[] = [];
        const selected_project = this.project_manager.get_select_project();
        if (selected_project.successful === false) {
            this.data = [];
            this._onDidChangeTreeData.fire();
            return;
        }

        const prj_definition = (<teroshdl2.project_manager.project_manager.Project_manager>selected_project.result).get_project_definition();
        const watcher_list = prj_definition.watcher_manager.get();

        watcher_list.forEach(watcher_inst => {
            watcher_view.push(new Watcher(watcher_inst.path));
        });
        this.data = watcher_view;
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

