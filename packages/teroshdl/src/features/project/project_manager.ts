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

export class Project_manager {
    private treeview;
    private tree!: TreeDataProvider;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext) {
        this.treeview = vscode.window.createTreeView("teroshdl-project", {
            showCollapseAll: true,
            treeDataProvider: new TreeDataProvider(),
            canSelectMany: true,
        });
        vscode.commands.registerCommand("teroshdl.project.configuration", () => this.config());
    }

    async config() {
        vscode.commands.executeCommand("teroshdl.configuration");
    }
}

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;
  
    data: TreeItem[];
  
    constructor() {
      this.data = [];
    }
  
    getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
      return element;
    }
  
    getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
      if (element === undefined) {
        return this.data;
      }
      return element.children;
    }
  }
  
  class TreeItem extends vscode.TreeItem {
    children: TreeItem[]|undefined;
  
    constructor(label: string, children?: TreeItem[]) {
      super(
          label,
          children === undefined ? vscode.TreeItemCollapsibleState.None :
                                   vscode.TreeItemCollapsibleState.Expanded);
      this.children = children;
    }
  }

