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

import { Language_provider_manager } from "./features/language_provider/language_provider";
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
        this.init_language_provider();
        console.log("activated language provider")
        this.init_template_manager();
        console.log("activated template manager")
        this.init_documenter();
        console.log("activated documenter")
        this.init_state_machine();
        console.log("activated state machine")
        const schematic = this.init_schematic();
        console.log("activated schematic")
        this.init_linter();
        console.log("activated linter")
        this.init_formatter();
        console.log("activated formatter")
        this.init_completions();
        console.log("activated completions")
        this.init_number_hover();
        console.log("activated hover")
        this.init_shutter_mode();
        console.log("activated shutter mode")
        this.init_config();
        console.log("activated config viewer")
        this.init_tree_views(schematic);
        console.log("activated views")
    }

    private init_language_provider() {
        const lang_provider = new Language_provider_manager(this.context, this.output_channel, this.manager);
        lang_provider.configure()
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
        return new Schematic_manager(this.context, this.output_channel, this.manager, false);
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

    private init_tree_views(schematic_manager : Schematic_manager) {
        new Tree_view_manager(this.context, this.manager, this.emitter, schematic_manager);
    }

}
