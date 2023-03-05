// Copyright 2022
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import * as vscode from 'vscode';
import * as path_lib from 'path';

import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';

import { Output_channel } from './utils/output_channel';

import { Template_manager } from "./features/templates";
import { Documenter_manager } from "./features/documenter";
import { State_machine_manager } from "./features/state_machine";
import { Schematic_manager } from "./features/schematic";
import { Linter_manager } from "./features/linter";
import { Formatter_manager } from "./features/formatter";
import { Completions_manager } from "./features/completions/completions";
import { Number_hover_manager } from "./features/number_hover";
import { Stutter_mode_manager } from "./features/stutter_mode";
import { Config_manager } from "./features/config";
import { Tree_view_manager } from "./features/tree_views/manager";
import * as teroshdl2 from 'teroshdl2';
import * as events from "events";
import * as cmd from "./utils/commands";

const CONFIG_FILENAME = '.teroshdl2_config.json';
const PRJ_FILENAME = '.teroshdl2_prj.json';

export class Teroshdl {
    private context: vscode.ExtensionContext;
    private manager: Multi_project_manager;
    private output_channel: Output_channel;
    private emitter : events.EventEmitter = new events.EventEmitter();

    constructor(context: vscode.ExtensionContext, output_channgel: Output_channel) {
        vscode.commands.registerCommand("teroshdl.open", (ags) => cmd.open_file(ags) );



        const homedir = teroshdl2.utils.common.get_home_directory();
        const file_config_path = path_lib.join(homedir, CONFIG_FILENAME);
        const file_prj_path = path_lib.join(homedir, PRJ_FILENAME);

        this.manager = new Multi_project_manager("", file_config_path, file_prj_path, this.emitter);
        this.context = context;
        this.output_channel = output_channgel;
    }

    public init_teroshdl(){
        this.init_template_manager();
        this.init_documenter();
        this.init_state_machine();
        this.init_schematic();
        this.init_linter();
        this.init_formatter();
        this.init_completions();
        this.init_number_hover();
        this.init_shutter_mode();
        this.init_config();
        this.init_tree_views();
    }

    private init_template_manager() {
        new Template_manager(this.context, this.output_channel, this.manager);
    }

    private init_documenter() {
        new Documenter_manager(this.context, this.output_channel, this.manager);
    }

    private init_state_machine() {
        new State_machine_manager(this.context, this.output_channel, this.manager);
    }

    private init_schematic() {
        new Schematic_manager(this.context, this.output_channel, this.manager, false);
    }

    private init_linter() {
        new Linter_manager(this.context, this.manager);
    }

    private init_formatter() {
        new Formatter_manager(this.context, this.output_channel, this.manager);
    }

    private init_completions() {
        new Completions_manager(this.context, this.output_channel);
    }

    private init_number_hover() {
        new Number_hover_manager(this.context, this.output_channel);
    }

    private init_shutter_mode() {
        new Stutter_mode_manager(this.context, this.output_channel, this.manager);
    }

    private init_config() {
        new Config_manager(this.context, this.output_channel, this.manager);
    }

    private init_tree_views() {
        new Tree_view_manager(this.context, this.manager, this.emitter);
    }

}