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
import * as events from "events";
import {Run_output_manager} from "../run_output";

export class Actions_manager {
    private project_manager : Multi_project_manager;
    private emitter : events.EventEmitter;
    private run_output_manager : Run_output_manager;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager, emitter : events.EventEmitter,
        run_output_manager: Run_output_manager) {

        this.run_output_manager = run_output_manager;
        this.emitter = emitter;
        this.project_manager = manager;
        const tree = new element.ActionsProvider();
        
        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ActionsProvider.getViewID(), tree));
    }
}

