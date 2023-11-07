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
import * as teroshdl2 from 'teroshdl2';

export const VIEW_ID = "teroshdl-view-dependency";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Elements
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class Dependency extends vscode.TreeItem {
    public children: any[] | undefined;
    public iconPath = get_icon("verilog");
    public contextValue = "dependency";
    // Element
    private path: string;
    // private entity_name: string;

    constructor(path: string, entity_name: string, children?: any[]) {
        super(
            teroshdl2.utils.file.get_filename(entity_name, true),
            children === undefined ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.Collapsed
        );
        // Common
        this.children = children;
        // Element
        this.path = path;
        this.tooltip = path;
        // Command
        this.command = {
            title: 'Open file',
            command: 'vscode.open',
            arguments: [vscode.Uri.file(path)]
        };
    }

    public get_path(): string {
        return this.path;
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
    private hdl_tree: any;
    private current_hdl_tree: any;

    constructor(project_manager: Multi_project_manager) {
        super();
        this.project_manager = project_manager;
    }

    getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    async getChildren(element?: Dependency): Promise<Dependency[]> {
        let toplevel_path = '';
        if (element) {
            toplevel_path = element.get_path();
        }
        else {
            const current_top = await this.get_toplevel_path();
            if (current_top === undefined) {
                return [];
            }
            toplevel_path = current_top;
        }

        // Dependencies
        if (this.hdl_tree === undefined) {
            return [];
        }
        let current_dep: any = undefined;
        for (let i = 0; i < this.hdl_tree.length; i++) {
            const element = this.hdl_tree[i];
            if (element.filename === toplevel_path) {
                current_dep = element;
            }
        }
        // const current_dep = await this.get_deps(toplevel_path);
        if (current_dep === undefined) {
            return [];
        }

        // Dependencie view
        const dependency_view = this.get_dep_view(current_dep);

        if (element) {
            return dependency_view;
        }
        else {
            return [new Dependency((<any>current_dep).filename, (<any>current_dep).entity, dependency_view)];
        }
    }

    static getViewID() {
        return VIEW_ID;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Utils
    //////////////////////////////////////////////////////////////////////////////////////////////
    async get_hdl_tree() {
        const selected_project = this.project_manager.get_select_project();
        if (selected_project.successful === false) {
            return undefined;
        }

        const python_path = this.project_manager.get_config_global_config().general.general.pypath;
        const result = await (<teroshdl2.project_manager.project_manager.Project_manager>selected_project.result)
            .get_dependency_tree(python_path);
        if (result.successful === true) {
            this.hdl_tree = result.result;
            return this.hdl_tree;
        }
        return undefined;
    }

    async get_toplevel_path() {
        const selected_project = this.project_manager.get_select_project();
        if (selected_project.successful === false) {
            return undefined;
        }
        const toplevel = await (<teroshdl2.project_manager.project_manager.Project_manager>selected_project.result)
            .get_project_definition().toplevel_path_manager.get();
        if (toplevel.length > 0) {
            return toplevel[0];
        }
        return undefined;
    }

    private async get_deps(top_path: string) {
        let current_dep = undefined;
        const hdl_tree = await this.get_hdl_tree();

        if (hdl_tree === undefined) {
            return undefined;
        }
        this.current_hdl_tree = hdl_tree;
        for (let i = 0; i < this.hdl_tree.length; i++) {
            const element = this.hdl_tree[i];
            if (element.filename === top_path) {
                current_dep = element;
            }
        }
        return current_dep;
    }

    get_dep_view(deps) {
        const dependency_view: Dependency[] = [];
        if (deps.dependencies !== undefined) {
            deps.dependencies.forEach(dep => {
                dependency_view.push(new Dependency(dep, dep));
            });
        }
        return dependency_view;
    }

    async refresh() {
        // Toplevel path
        const toplevel_path = await this.get_toplevel_path();
        if (toplevel_path === undefined) {
            this.data = [];
            this._onDidChangeTreeData.fire();
            return;
        }

        // Dependencies
        const current_dep = await this.get_deps(toplevel_path);
        if (current_dep === undefined) {
            this.data = [];
            this._onDidChangeTreeData.fire();
            return;
        }

        // Dependencie view
        const dependency_view = this.get_dep_view(current_dep);

        this.data = [new Dependency((<any>current_dep).filename, (<any>current_dep).entity, dependency_view)];
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

