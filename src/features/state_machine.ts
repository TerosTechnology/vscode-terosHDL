// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
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
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

import * as vscode from 'vscode';
import * as path_lib from 'path';
import * as fs from 'fs';
import * as teroshdl2 from 'teroshdl2';
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import * as Output_channel_lib from '../utils/output_channel';
import * as utils from '../utils/utils';
import {Base_webview} from './base_webview';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class State_machine_manager extends Base_webview{

    private state_machines;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, output_channel: Output_channel_lib.Output_channel,
        manager: Multi_project_manager) {

        const activation_command = 'teroshdl.state_machine.viewer';
        const id = "state_machine";

        const resource_path = path_lib.join(context.extensionPath, 'resources', 'state_machine_viewer', 'state_machine_viewer.html');
        super(context, output_channel, manager, resource_path, activation_command, id);

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Webview creator
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async create_webview() {
        // Get active editor file language. Return if no active editor
        const document = utils.get_vscode_active_document();
        if (document === undefined) {
            return;
        }

        this.panel = vscode.window.createWebviewPanel(
            'state_machine_viewer',
            'State machine viewer',
            vscode.ViewColumn.Two,
            {
                enableScripts: true
            }
        );

        this.panel.onDidDispose(
            () => {
                // When the panel is closed, cancel any future updates to the webview content
                this.panel = undefined;
            },
            null,
            this.context.subscriptions
        );
        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'export':
                        this.export_as(message.text);
                        return;
                    case 'go_to_state':
                        this.go_to_state(message.stm_index, message.state);
                        return;
                    case 'go_to_condition':
                        this.go_to_condition(message.stm_index, message.transition, message.condition);
                        return;
                }
            },
            undefined,
            this.context.subscriptions
        );

        this.panel.webview.html = this.html_base;

        this.update(document);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // State machines
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private async get_state_machines(document: utils.t_vscode_document) {
        this.last_document = document;

        const config = this.get_config();
        const documenter = new teroshdl2.documenter.documenter.Documenter();
        const state_machines = await documenter.get_fsm(document.code, document.lang, config);

        return state_machines;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Update
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async update(document : utils.t_vscode_document){
        const state_machines = await this.get_state_machines(document);
        this.state_machines = state_machines;
        this.send_state_machines(state_machines);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private get_config(): teroshdl2.config.auxiliar_config.t_documenter_options {
        const config = this.manager.get_config_manager().get_documenter_config();
        return config;
    }

    normalize_string(str) {
        let n_string = str.replace(/[^ -~]+/g, '');
        n_string = n_string.replace(/ /g, '');
        n_string = n_string.replace(/\n/g, '');
        return n_string;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // State machine interaction
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    go_to_state(stm_index, state) {
        if (this.state_machines === undefined) {
            return;
        }
        let states = this.state_machines.structure[stm_index].states;
        let state_stm;
        for (let i = 0; i < states.length; ++i) {
            if (states[i].name.replace(/\"/g, '').replace(/\'/g, '') === state) {
                state_stm = states[i];
            }
        }
        if (state_stm !== undefined && this.last_document !== undefined) {
            let start_position = state_stm.start_position;
            let end_position = state_stm.end_position;

            let pos_1 = new vscode.Position(start_position[0], start_position[1]);
            let pos_2 = new vscode.Position(end_position[0], end_position[1]);
            var open_path = this.last_document.filename;
            vscode.workspace.openTextDocument(open_path).then(doc => {
                vscode.window.showTextDocument(doc, vscode.ViewColumn.One).then(editor => {
                    // Line added - by having a selection at the same position twice, the cursor jumps there
                    editor.selections = [new vscode.Selection(pos_1, pos_2)];

                    // And the visible range jumps there too
                    var range = new vscode.Range(pos_1, pos_2);
                    editor.revealRange(range);
                });
            });
        }
    }

    go_to_condition(stm_index, transition, condition) {
        let normalized_condition = this.normalize_string(condition);
        let state_origen = transition[0];
        let state_destination = transition[1];
        if (this.state_machines === undefined || this.last_document === undefined) {
            return;
        }
        let states = this.state_machines.structure[stm_index].states;
        let transition_match;
        //Search state
        for (let i = 0; i < states.length; ++i) {
            if (states[i].name.replace(/\"/g, '').replace(/\'/g, '') === state_origen) {
                let transitions = states[i].transitions;
                //Search condition
                for (let j = 0; j < transitions.length; ++j) {
                    let normalized_condition_state = this.normalize_string(transitions[j].condition);
                    if (transitions[j].destination.replace(/\"/g, '').replace(/\'/g, '') === state_destination
                        && normalized_condition_state === normalized_condition) {
                        transition_match = transitions[j];
                    }
                }
            }
        }
        if (transition_match !== undefined) {
            if (transition_match.start_position === undefined || transition_match.end_position === undefined) {
                return;
            }
            let start_position = transition_match.start_position;
            let end_position = transition_match.end_position;

            let pos_1 = new vscode.Position(start_position[0], start_position[1]);
            let pos_2 = new vscode.Position(end_position[0], end_position[1]);
            var open_path = this.last_document.filename;
            vscode.workspace.openTextDocument(open_path).then(doc => {
                vscode.window.showTextDocument(doc, vscode.ViewColumn.One).then(editor => {
                    // Line added - by having a selection at the same position twice, the cursor jumps there
                    editor.selections = [new vscode.Selection(pos_1, pos_2)];

                    // And the visible range jumps there too
                    var range = new vscode.Range(pos_1, pos_2);
                    editor.revealRange(range);
                });
            });
        }
    }

    async export_as(type: string) {
        if (type === "svg") {
            let filter = { 'svg': ['svg'] };
            vscode.window.showSaveDialog({ filters: filter }).then(fileInfos => {
                if (fileInfos?.path !== undefined) {
                    let path_full = utils.normalize_path(fileInfos?.path);
                    let dir_name = path_lib.dirname(path_full);
                    let file_name = path_lib.basename(path_full).split('.')[0];

                    for (let i = 0; i < this.state_machines.svg.length; ++i) {
                        let custom_path = `${dir_name}${path_lib.sep}${file_name}_${i}.svg`;
                        fs.writeFileSync(custom_path, this.state_machines.svg[i].svg);
                    }
                }
            });
        }
        else {
            console.log("Error export documentation.");
        }
    }

    private async send_state_machines(state_machines) {
        if (state_machines !== undefined) {
            await this.panel?.webview.postMessage({ command: "update", svg: state_machines.svg, stms: state_machines.structure });
        }
    }
}