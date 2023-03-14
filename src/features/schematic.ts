/* eslint-disable @typescript-eslint/class-name-casing */
// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of vscode-terosHDL.
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
import * as Output_channel_lib from '../utils/output_channel';
import * as utils from '../utils/utils';
import * as teroshdl2 from 'teroshdl2';
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import { Base_webview } from './base_webview';
import * as os from 'os';
import * as fs from 'fs';
import * as yosys from './yosys';
import * as shell from 'shelljs';
import * as nunjucks from 'nunjucks';

const ERROR_CODE = Output_channel_lib.ERROR_CODE;
const MSG_CODE = Output_channel_lib.MSG_CODE;

const activation_command = 'teroshdl.netlist.viewer';
const id = "netlist";

export class Schematic_manager extends Base_webview {

    private mode_project = false;
    private working_directory = "";
    private output_path = "";
    private childp;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, output_channel: Output_channel_lib.Output_channel,
        manager: Multi_project_manager, mode_project: boolean) {

        super(context, output_channel, manager, path_lib.join(context.extensionPath, 'resources', 'netlist_viewer', 'netlist_viewer.html'), activation_command, id);
        
        this.mode_project = mode_project;

        this.working_directory = os.tmpdir();
        this.output_path = path_lib.join(this.working_directory, 'teroshdl_yosys_output.json');
    }

    get_webview_content(webview: vscode.Webview){
        const template_path = path_lib.join(this.context.extensionPath, 'resources', 'netlist_viewer', 'index.html.nj');
        const template_str = fs.readFileSync(template_path, 'utf-8');

        const css_path = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'netlist_viewer', 'style.css'));
        const js_path_0 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'netlist_viewer', 'libs', 'elk.bundled.js'));
        const js_path_1 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'netlist_viewer', 'libs', 'netlistsvg.bundle.js'));
        const js_path_2 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'netlist_viewer', 'libs', 'jquery-2.2.4.min.js'));
        const js_path_3 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'netlist_viewer', 'libs', 'svg-pan-zoom.min.js'));
        const js_path_4 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'netlist_viewer', 'libs', 'viz.js'));
        const js_path_5 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 
            'netlist_viewer', 'libs', 'main.js'));

        const html = nunjucks.renderString(template_str, {
            "css_path": css_path, 
            "cspSource": webview.cspSource, 
            "js_path_0": js_path_0,
            "js_path_1": js_path_1,
            "js_path_2": js_path_2,
            "js_path_3": js_path_3,
            "js_path_4": js_path_4,
            "js_path_5": js_path_5,
        });
        return html;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Webview creator
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async create_webview(mode_project = false) {
        // Create panel
        this.panel = vscode.window.createWebviewPanel(
            'netlist_viewer',
            'Schematic viewer',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true
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
                        this.export_as(message.type, message.svg);
                        return;
                }
            },
            undefined,
            this.context.subscriptions
        );

        this.panel.webview.html = this.get_webview_content(this.panel.webview);

        if (mode_project === false) {
            const document = utils.get_vscode_active_document();
            if (document === undefined) {
                return;
            }
            await this.update(document);
        }
        else{
            await this.generate_project_netlist();
        }
    }

    async update(vscode_document: utils.t_vscode_document) {
        this.last_document = vscode_document;

        const schematic: any = await this.generate_from_file(vscode_document.filename);

        if (schematic === undefined || schematic === '') {
            return;
        }

        let result = '';
        if (schematic.empty === false) {
            result = schematic.result;
        }

        await this.panel?.webview.postMessage({ command: "update", result: result });

    }
    
    //////////////////////////////////////////////////////////////////////////////
    // Export
    //////////////////////////////////////////////////////////////////////////////
    async export_as(type: string, svg: string) {
        if (type === "svg") {
            let filter = { 'svg': ['svg'] };
            vscode.window.showSaveDialog({ filters: filter }).then(fileInfos => {
                if (fileInfos?.path !== undefined) {
                    let path_norm = utils.normalize_path(fileInfos?.path);

                    fs.writeFileSync(path_norm, svg);
                    this.output_channel.show_info_message(MSG_CODE.SAVE_NETLIST, path_norm);
                }
            });
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    // Generate netlist
    //////////////////////////////////////////////////////////////////////////////
    clear_enviroment(output_path) {
        try {
            fs.unlinkSync(output_path);
        } catch (err) { }
    }

    async generate_project_netlist() {        
        const result = await this.generate_from_project();
        await this.update_svg_in_html(result);
    }

    async generate_file_netlist(path) {
        let result = await this.generate_from_file(path);
        await this.update_svg_in_html(result);
    }

    private async update_svg_in_html(netlist) {
        if (netlist === undefined || netlist === '') {
            return;
        }

        let result = '';
        if (netlist.empty === false) {
            result = netlist.result;
            // result = Yosys_lib.normalize_netlist(result);
        }

        await this.panel?.webview.postMessage({ command: "update", result: result });
    }

    async generate_from_project() {
        const selected_project = this.manager.get_select_project();
        if (selected_project.successful === false) {
            return "";
        }

        const sources = (<teroshdl2.project_manager.project_manager.Project_manager>selected_project.result)
            .get_project_definition().file_manager.get()

        const file_array : string[] = [];
        sources.forEach(source_inst => {
            file_array.push(source_inst.name);
        });

        this.clear_enviroment(this.output_path);

        return await this.run_yosys_script(file_array, this.output_path);
    }

    async generate_from_file(file_path: string) {
        this.clear_enviroment(this.output_path);

        return await this.run_yosys_script([file_path], this.output_path);
    }

    async run_yosys_script(sources: string[], output_path: string) {
        let netlist = {
            'result': '',
            'error': false,
            'empty': false
        };

        const config = this.manager.get_config_manager().get_config();

        const backend = config.schematic.general.backend;
        let yosys_path = config.tools.yosys.installation_path;

        let cmd_files = yosys.get_yosys_read_file(sources, backend, this.working_directory);
        if (cmd_files === undefined) {
            this.output_channel.show_message(ERROR_CODE.NETLIST_VHDL_ERROR);
            netlist.empty = true;
            return netlist;
        }
        let output_path_filename = path_lib.basename(output_path);
        const script_code = `${cmd_files}; proc; write_json ${output_path_filename}; stat`;

        let plugin = ``;
        if (backend === 'yosys_ghdl_module') {
            plugin = `-m ghdl`;
        }
        let command = `yowasp-yosys -p "${script_code}"`;
        if (backend === 'yosys' || backend === 'yosys_ghdl' || backend === 'yosys_ghdl_module') {
            if (yosys_path === '') {
                yosys_path = 'yosys';
            }
            else {
                yosys_path = path_lib.join(yosys_path, 'yosys');
                if (process.platform === "win32") {
                    yosys_path += '.exe';
                }
            }
            command = `${yosys_path} ${plugin} -p "${script_code}"`;
        }
        command += '\n';

        let element = this;
        element.output_channel.clear();
        element.output_channel.append(command);
        element.output_channel.show();

        return new Promise(resolve => {
            element.childp = shell.exec(command, { async: true, cwd: this.working_directory }, async function (code, stdout, stderr) {
                if (code === 0) {
                    let result_yosys = '';
                    if (fs.existsSync(output_path)) {
                        result_yosys = fs.readFileSync(output_path, { encoding: 'utf8', flag: 'r' });
                    }
                    result_yosys = JSON.parse(result_yosys);
                    netlist.empty = false;
                    netlist.result = result_yosys;

                    let netlist_svg = await element.get_svg_from_json(netlist);

                    resolve(netlist_svg);
                }
                else {
                    element.output_channel.show_message(ERROR_CODE.NETLIST_VIEWER, '');
                    netlist.empty = true;
                    resolve(netlist);
                }
            });

            element.childp.stdout.on('data', function (data) {
                element.output_channel.append(data);
            });
            element.childp.stderr.on('data', function (data) {
                element.output_channel.append(data);
            });
        });
    }

    async get_svg_from_json(output_yosys) {
        output_yosys.result = yosys.normalize_netlist(output_yosys.result);
        const netlistsvg = require("netlistsvg");
        const skinPath = path_lib.join(this.context.extensionPath, "resources", "netlist_viewer", "default.svg");
        const skin = fs.readFileSync(skinPath);

        const config = {
            "hierarchy": {
                "enable": "all",
                "expandLevel": 0,
                "expandModules": {
                    "types": [],
                    "ids": []
                },
                "colour": ["#e9e9e9"]
            },
            "top": {
                "enable": false,
                "module": ""
            }
        };

        let jsonp = output_yosys.result;
        output_yosys.result = await netlistsvg.render(skin, jsonp, undefined, undefined, config);

        return output_yosys;
    }
}






