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

import * as vscode from 'vscode';
import * as path_lib from 'path';
import * as fs from 'fs';
import * as teroshdl2 from 'teroshdl2';
import { t_Multi_project_manager } from '../type_declaration';
import * as utils from '../utils/utils';
import * as nunjucks from 'nunjucks';
import { Base_webview } from './base_webview';
import { Logger } from '../logger';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class State_machine_manager extends Base_webview {

    private state_machines;
    private logger: Logger;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, logger: Logger, manager: t_Multi_project_manager) {

        const activation_command = 'teroshdl.state_machine.viewer';
        const id = "state_machine";

        const resource_path = path_lib.join(context.extensionPath, 'resources', 'webviews', 'state_machine_viewer', 'state_machine_viewer.html');
        super(context, manager, resource_path, activation_command, id);
        this.logger = logger;
    }

    get_webview_content(webview: vscode.Webview) {
        const template_path = path_lib.join(this.context.extensionPath, 'resources', 'webviews', 'state_machine_viewer', 'index.html.nj');
        const template_str = fs.readFileSync(template_path, 'utf-8');

        const css_bootstrap_path = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews', 'common',
            'bootstrap.min.css'));
        const css_common_path = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews', 'common',
            'style.css'));

        const js_path_0 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'state_machine_viewer', 'libs', 'jquery-2.2.4.min.js'));
        const js_path_1 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'state_machine_viewer', 'libs', 'svg-pan-zoom.min.js'));
        const js_path_2 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'state_machine_viewer', 'libs', 'vizdraw.js'));
        const js_path_3 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'state_machine_viewer', 'libs', 'full.render.js'));
        const js_path_4 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'state_machine_viewer', 'libs', 'viz.js'));

        const html = nunjucks.renderString(template_str, {
            "css_common_path": css_common_path, 
            "css_bootstrap_path": css_bootstrap_path, 
            "cspSource": webview.cspSource,
            "js_path_0": js_path_0,
            "js_path_1": js_path_1,
            "js_path_2": js_path_2,
            "js_path_3": js_path_3,
        });
        return html;
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

        this.panel.webview.html = this.get_webview_content(this.panel.webview);

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
    async update(document: utils.t_vscode_document) {
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
            const inputName = await vscode.window.showInputBox({
                prompt: "Output base file name.",
                value: "my_fsm",
            });

            if (inputName === undefined) {
                return;
            }

            const result = await vscode.window.showOpenDialog(
                {
                    title: "Select output folder",
                    canSelectFiles: false,
                    canSelectFolders: true,
                    canSelectMany: false,
                    openLabel: "Select",
                });
            if (result !== undefined) {
                const dir_name = result[0].fsPath;

                for (let i = 0; i < this.state_machines.svg.length; ++i) {
                    let custom_path = path_lib.join(dir_name, `${inputName}_${i}.svg`);
                    fs.writeFileSync(custom_path, this.state_machines.svg[i].image);
                    this.logger.info(`State machine image saved in: ${custom_path}`, true);
                }
            }
        }
        else {
            this.logger.error("Error saving state machine images.", true);
        }
    }

    private async send_state_machines(state_machines) {
        if (state_machines !== undefined) {
            await this.panel?.webview.postMessage({ command: "update", svg: state_machines.svg, stms: state_machines.structure });
        }
    }
}