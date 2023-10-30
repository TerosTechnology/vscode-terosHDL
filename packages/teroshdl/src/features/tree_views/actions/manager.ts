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
import * as element from "./element";
import { t_Multi_project_manager } from '../../../type_declaration';
import * as events from "events";
import {Run_output_manager} from "../run_output";

export class Actions_manager {
    private project_manager : t_Multi_project_manager;
    private emitter : events.EventEmitter;
    private run_output_manager : Run_output_manager;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager, emitter : events.EventEmitter,
        run_output_manager: Run_output_manager) {

        this.run_output_manager = run_output_manager;
        this.emitter = emitter;
        this.project_manager = manager;
        const tree = new element.ActionsProvider();
        
        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ActionsProvider.getViewID(), tree));
    }
}

