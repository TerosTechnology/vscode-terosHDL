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
import * as path_lib from "path";
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import * as events from "events";
import * as utils from "../utils";

export class Tree_manager {
    private tree : element.ProjectProvider;
    private project_manager : Multi_project_manager;
    private emitter : events.EventEmitter;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager, emitter : events.EventEmitter) {
        this.set_commands();

        this.emitter = emitter;
        this.project_manager = manager;
        this.tree = new element.ProjectProvider(manager);
        
        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(), 
            this.tree as element.BaseTreeDataProvider<element.Dependency>));
    }

    async config() {
        // vscode.commands.executeCommand("teroshdl.configuration");
    }

    set_commands(){
        // vscode.commands.registerCommand("teroshdl.view.project.add", (item) => this.add_project(item));
        // vscode.commands.registerCommand("teroshdl.view.project.select", (item) => this.select_project(item));
        // vscode.commands.registerCommand("teroshdl.view.project.delete", (item) => this.delete_project(item));
        // vscode.commands.registerCommand("teroshdl.view.project.rename", (item) => this.rename_project(item));
    }



    refresh_tree(){
        this.tree.refresh();
    }
}

