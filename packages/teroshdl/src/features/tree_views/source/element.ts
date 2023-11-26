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
import * as path_lib from 'path';


export const VIEW_ID = "teroshdl-view-source";
enum SOURCE_TREE_ELEMENT {
    SOURCE = "source",
    LIBRARY = "library",
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Elements
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class Source_tree_element extends vscode.TreeItem {
    public children: any[] | undefined;
    private logical_name: string = "";
    private name: string = "";

    constructor(element_type: SOURCE_TREE_ELEMENT, name: string, is_manual: boolean, select_check: boolean, logical_name: string, children?: any[]) {
        super(
            name,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed
        );
        // Common
        this.children = children;
        this.logical_name = logical_name;
        this.tooltip = name;
        this.name = name;

        if (element_type === SOURCE_TREE_ELEMENT.LIBRARY) {
            this.label = name;
            this.contextValue = "library";
            this.iconPath = get_icon("library");
        }
        else {
            this.label = path_lib.basename(name);

            if (select_check === true) {
                this.iconPath = get_icon("file-open");
            }
            else {
                this.iconPath = get_icon("file");
            }

            if (is_manual === true) {
                this.label = `${this.label} (M)`;
            }
            else {
                this.label = `${this.label} (A)`;
            }

            this.contextValue = "source";
            this.command = {
                title: 'Open file',
                command: 'vscode.open',
                arguments: [vscode.Uri.file(name)]
            };
        }
    }

    get_name(): string {
        return this.name;
    }
    get_logical_name(): string {
        return this.logical_name;
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
        try {
            const prj_definition = this.project_manager.get_selected_project().get_project_definition();
            const logical_list = prj_definition.file_manager.get_by_logical_name();
            const toplevel = prj_definition.toplevel_path_manager.get();

            let source_view: Source_tree_element[] = [];
            let empty_logical: Source_tree_element[] = [];
            logical_list.forEach(logical_inst => {
                const children_list: Source_tree_element[] = [];
                logical_inst.file_list.forEach(file_inst => {
                    const name = file_inst.name;
                    const is_manual = file_inst.is_manual;
                    const logical_name = file_inst.logical_name;
                    if (name !== '') {
                        let select_check = false;
                        if (toplevel.length !== 0 && toplevel[0] === name) {
                            select_check = true;
                        }
                        children_list.push(new Source_tree_element(SOURCE_TREE_ELEMENT.SOURCE, name, is_manual, select_check, logical_name));
                    }
                });
                if (logical_inst.name !== "") {
                    source_view.push(new Source_tree_element(SOURCE_TREE_ELEMENT.LIBRARY, logical_inst.name, false, false, logical_inst.name, children_list));
                }
                else {
                    empty_logical = children_list;
                }
            });

            //Add sources with empty logical name
            source_view = source_view.concat(empty_logical);

            this.data = source_view;
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
                vscode.TreeItemCollapsibleState.Collapsed);
        this.children = children;
    }
}

