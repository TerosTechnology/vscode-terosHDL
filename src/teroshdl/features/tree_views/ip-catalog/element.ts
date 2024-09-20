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

import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as vscode from "vscode";
import { get_icon } from "../utils";
import { t_ipCatalogRep } from 'colibri/project_manager/tool/common';

export const VIEW_ID = "teroshdl-view-ip-catalog";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Elements
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class CatalogElement extends vscode.TreeItem {
    public children: any[] | undefined;
    public contextValue = "ip-catalog";
    public elementDefinition:t_ipCatalogRep;
    // Element
    private name: string;

    constructor(elementDefinition: t_ipCatalogRep, children?: any[]) {

        super(
            elementDefinition.display_name,
            // taskDefinition.name,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed
        );
        // Common
        this.children = children;
        // Element
        this.elementDefinition = elementDefinition;
        this.name = elementDefinition.name;

        if (elementDefinition.name === "loading") {
            this.iconPath = get_icon("loading");
        }
        else if (!elementDefinition.is_group) {
            this.iconPath = get_icon("verilog");
            this.command = {
                title: 'Create IP',
                command: 'teroshdl.quartus.create_ip',
                arguments: [this]
            };
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

export class IpCatalogProvider extends BaseTreeDataProvider<TreeItem> {

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
        // Set loading..
        const elementEmpty: t_ipCatalogRep = {
            display_name: "Loading...",
            name: "loading",
            supportedDeviceFamily: [],
            is_group: true,
            children: []
        };
        this.data = [new CatalogElement(elementEmpty, undefined)];
        this._onDidChangeTreeData.fire();

        try {
            const selected_project = this.project_manager.get_selected_project();
            const catalog = await selected_project.getIpCatalog();

            function createCatalog(children, depth = 0) {
                const catalogList: CatalogElement[] = [];
                for (const child of children) {
                    const childTasks = child.children ? createCatalog(child.children, depth + 1) : [];
                    catalogList.push(new CatalogElement(child, childTasks.length > 0 ? childTasks : undefined));
                }
                return catalogList;
            }

            const taskView = createCatalog(catalog);


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