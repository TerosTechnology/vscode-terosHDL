/* eslint-disable @typescript-eslint/class-name-casing */
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

import {Project_manager} from "./project/manager";
import {Source_manager} from "./source/manager";
import {Runs_manager} from "./runs/manager";
import {Actions_manager} from "./actions/manager";
import {Run_output_manager} from "./run_output";
import {Watcher_manager} from "./watchers/manager";
import {Output_manager} from "./output/manager";
import {Logger} from "./logger";

import * as events from "events";
import * as vscode from "vscode";
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';

let project_manager : Project_manager;
let source_manager : Source_manager;
let runs_manager : Runs_manager;
let run_output : Run_output_manager = new Run_output_manager();
let actions_manager : Actions_manager;
let watcher_manager : Watcher_manager;
let output_manager : Output_manager;

export class Tree_view_manager{
    private logger : Logger = new Logger();
    private statusbar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager, emitter : events.EventEmitter){
        context.subscriptions.push(this.statusbar);

        const slm = this;

        emitter.addListener('refresh', this.refresh);
        emitter.addListener('refresh_output', (function () {
            output_manager.refresh_tree();
        })
    );
        emitter.addListener('loading', (function () {
                slm.statusbar.text = `$(loading) TerosHDL: loading project..`;
                slm.statusbar.show();
            })
        );
        emitter.addListener('loaded', (function () {
                slm.statusbar.text = `$(megaphone) TerosHDL: project loaded!`;
                slm.statusbar.show();
            })
        );

        project_manager = new Project_manager(context, manager, emitter, run_output);
        source_manager = new Source_manager(context, manager, emitter);
        runs_manager = new Runs_manager(context, manager, emitter, run_output, this.logger);
        actions_manager = new Actions_manager(context, manager, emitter, run_output);
        watcher_manager = new Watcher_manager(context, manager, emitter);
        output_manager = new Output_manager(context, manager, run_output);

        this.refresh();
    }

    refresh(){
        source_manager.refresh_tree();
        project_manager.refresh_tree();
        runs_manager.refresh_tree();
        watcher_manager.refresh_tree();
        output_manager.refresh_tree();
    }

    // prj_loading(slm: any){
    //     // if (this.statusbar === undefined){
    //     //     this.statusbar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    //     //     this.context.subscriptions.push(this.statusbar);
    //     // }
    //     this.statusbar.text = `$(loading) TerosHDL: loading project..`;
    //     this.statusbar.show();
    // }

    // prj_loaded(slm: any){
    //     // if (this.statusbar !== undefined){
    //         this.statusbar.text = `$(megaphone) TerosHDL: project loaded!`;
    //     // }
    // }

}

