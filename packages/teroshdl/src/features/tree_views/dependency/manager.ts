// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of teroshdl
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
// along with teroshdl. If not, see <https://www.gnu.org/licenses/>.

/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from "vscode";
import * as element from "./element";
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import {Schematic_manager} from "../../schematic";
import {Dependency_manager} from "../../dependency";

export class Tree_manager {
    private tree : element.ProjectProvider;
    private schematic_manager : Schematic_manager;
    private dependency_manager : Dependency_manager;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager, schematic_manager : Schematic_manager,
        dependency_manager : Dependency_manager) {
        this.set_commands();

        this.tree = new element.ProjectProvider(manager);
        this.schematic_manager = schematic_manager;
        this.dependency_manager = dependency_manager;
        
        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(), 
            this.tree as element.BaseTreeDataProvider<element.Dependency>));
    }

    set_commands(){
        vscode.commands.registerCommand("teroshdl.view.dependency.refresh", () => this.refresh_tree());
        vscode.commands.registerCommand("teroshdl.view.dependency.schematic", () => this.open_schematic_viewer());
        vscode.commands.registerCommand("teroshdl.view.dependency.viewer", () => this.open_dependencies_viewer());
    }

    refresh_tree(){
        this.tree.refresh();
        this.dependency_manager.update();
    }

    open_schematic_viewer(){
        this.schematic_manager.create_webview(true);
    }

    open_dependencies_viewer(){
        this.dependency_manager.create_webview();
    }
}

