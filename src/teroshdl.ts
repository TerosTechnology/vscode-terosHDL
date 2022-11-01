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
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';

import {Output_channel} from './lib/utils/output_channel';

import { Template_manager } from "./features/templates";
import { Documenter_manager } from "./features/documenter";
import { State_machine_manager } from "./features/state_machine";

export class Teroshdl {
    private context: vscode.ExtensionContext;
    // private template_manager : Template_manager;
    // private documenter_manager : Documenter_manager;
    private manager : Multi_project_manager;
    private output_channel: Output_channel;

    constructor(context: vscode.ExtensionContext, output_channgel: Output_channel){
        this.manager = new Multi_project_manager("");
        this.context = context;
        this.output_channel = output_channgel;
    }

    public init_template_manager(){
        new Template_manager(this.context, this.output_channel, this.manager);
    }

    public init_documenter(){
        new Documenter_manager(this.context, this.output_channel, this.manager);
    }

    public init_state_machine(){
        new State_machine_manager(this.context, this.output_channel, this.manager);
    }

}