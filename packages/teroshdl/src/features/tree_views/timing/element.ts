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

import { t_Multi_project_manager } from '../../../type_declaration';
import * as vscode from "vscode";
import { get_icon } from '../utils';
import * as teroshdl2 from 'teroshdl2';

export const VIEW_ID = "teroshdl-view-timing";
const URISTRINGINIT = "teroshdltiming:/";

function getDescription(path: string, line: number) {
    return `${path}:${line}`;
}

enum e_Direction {
    left = 0,
    right = 1,
    none = 2,
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Elements
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class Timing extends vscode.TreeItem {
    public children: any[] | undefined;
    public contextValue = "";

    public name = "";
    public path = "";
    public line = 0;

    constructor(name: string, path: string, line: number, direction: e_Direction, children?: any[]) {

        super(
            name,
            children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Collapsed
        );
        this.children = children;

        this.iconPath = get_icon("clock");
        if (path !== "") {
            this.iconPath = get_icon("circle-outline");
            if (direction === e_Direction.left) {
                this.iconPath = get_icon("arrow-left");
            }
            if (direction === e_Direction.right) {
                this.iconPath = get_icon("arrow-right");
            }
            this.tooltip = getDescription(path, line);
            this.description = getDescription(path, line);

            const uri = vscode.Uri.parse(`file://${path}#${line},${0}`);
            this.command = {
                title: 'Open file',
                command: 'vscode.open',
                arguments: [uri]
            };
            this.resourceUri = vscode.Uri.parse(URISTRINGINIT + name);
        }
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
    private project_manager: t_Multi_project_manager;

    constructor(project_manager: t_Multi_project_manager) {
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

    async refresh(timingReport:  teroshdl2.project_manager.common.t_timing_path[] | undefined): Promise<void> {
        if (timingReport === undefined) {
            return;
        }
        const timingReportElementList: Timing[] = [];
        for (const timingPath of timingReport) {
            const timingNodeElemntList: Timing[] = [];
            for (let i = 0; i < timingPath.nodeList.length; i++) {
                let direction = e_Direction.none;
                if (i === 0) {
                    direction = e_Direction.right;
                }
                if (i === timingPath.nodeList.length - 1) {
                    direction = e_Direction.left;
                }
                const isInOut = i === 0 || i === timingPath.nodeList.length - 1;
                const timingNode = timingPath.nodeList[i];
                const timingNodeElement = new Timing(timingNode.name, timingNode.path, timingNode.line, direction);
                timingNodeElemntList.push(timingNodeElement);
            
            }
            const timingPathElement = new Timing(timingPath.name, "", 0, e_Direction.none, timingNodeElemntList);
            timingReportElementList.push(timingPathElement);
        }
        this.data = timingReportElementList;
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
        if (uri.scheme === URISTRINGINIT.replace(":", "").replace("/", "")) {
            if (uri.path !== "" && uri.path !== "/" && !uri.path.includes("~")){
                return {
                    badge: "📑",
                };
            }
        }
        return {};
    }
}