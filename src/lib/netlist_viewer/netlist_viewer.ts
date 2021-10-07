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
const shell = require('shelljs');
import * as config_reader_lib from "../utils/config_reader";
import * as Output_channel_lib from '../utils/output_channel';
import * as Yosys_lib from './yosys';

const ERROR_CODE = Output_channel_lib.ERROR_CODE;
const MSG_CODE = Output_channel_lib.MSG_CODE;


// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class netlist_viewer_manager {
    private panel: vscode.WebviewPanel | undefined = undefined;
    private context: vscode.ExtensionContext;
    private file_path;
    private document;
    private svg_element;
    private document_element;
    private childp;
    private config_reader: config_reader_lib.Config_reader;
    private output_channel: Output_channel_lib.Output_channel;
    private mode_project;
    private working_directory;
    private output_path;

    constructor(context: vscode.ExtensionContext, output_channel: Output_channel_lib.Output_channel, config_reader, mode = false) {
        const os = require('os');
        this.working_directory = os.tmpdir();
        this.output_path = path_lib.join(this.working_directory, 'teroshdl_yosys_output.json');
        this.mode_project = mode;
        this.config_reader = config_reader;
        this.output_channel = output_channel;
        this.context = context;
    }

    //////////////////////////////////////////////////////////////////////////////
    // Webview functions
    //////////////////////////////////////////////////////////////////////////////
    async open_viewer() {
        if (this.panel === undefined) {
            this.create_viewer();
        }
        else {
            if (this.mode_project === false) {
                let file_path = await this.get_file_path(undefined);
                if (file_path !== undefined) {
                    this.file_path = file_path;
                }
                await this.generate_file_netlist(file_path);
            }
        }
    }

    async create_viewer() {
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

        let previewHtml = this.getWebviewContent(this.context);
        this.panel.webview.html = previewHtml;

        if (this.mode_project === false) {
            let file_path = await this.get_file_path(undefined);
            if (file_path !== undefined) {
                this.file_path = file_path;
            }
            await this.generate_file_netlist(file_path);
        }
    }

    private getWebviewContent(context: vscode.ExtensionContext) {
        let template_path = 'resources' + path_lib.sep + 'netlist_viewer' + path_lib.sep + 'netlist_viewer.html';
        const resource_path = path_lib.join(context.extensionPath, template_path);
        const dir_path = path_lib.dirname(resource_path);
        let html = fs.readFileSync(resource_path, 'utf-8');

        html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
            return $1 + vscode.Uri.file(path_lib.resolve(dir_path, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
        });
        return html;
    }
    //////////////////////////////////////////////////////////////////////////////
    // Export
    //////////////////////////////////////////////////////////////////////////////
    async export_as(type: string, svg: string) {
        if (type === "svg") {
            let filter = { 'svg': ['svg'] };
            vscode.window.showSaveDialog({ filters: filter }).then(fileInfos => {
                if (fileInfos?.path !== undefined) {
                    let path_full = fileInfos?.path;
                    fs.writeFileSync(path_full, svg);
                    this.output_channel.show_info_message(MSG_CODE.SAVE_NETLIST, path_full);
                }
            });
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    // Update viewer
    //////////////////////////////////////////////////////////////////////////////
    async update_viewer() {
        if (this.panel !== undefined) {
            let file_path = await this.get_file_path(undefined);
            this.file_path = file_path;
            await this.generate_file_netlist(file_path);
        }
    }

    async update_viewer_last_code() {
        if (this.mode_project === true) {
            return;
        }
        if (this.panel !== undefined) {
            await this.generate_file_netlist(this.file_path);
        }
    }

    async update_visible_viewer(e) {
        if (this.mode_project === true) {
            return;
        }
        if (e.length === 0) {
            return;
        }
        for (let i = 0; i < e.length; i++) {
            const element = e[i];
            if (this.panel !== undefined) {
                let document = e[i].document;
                let file_path = await this.get_file_path(document);
                if (file_path !== undefined) {
                    this.file_path = file_path;
                    await this.generate_file_netlist(file_path);
                    break;
                }
            }
        }
    }

    private async get_file_path(document_trigger) {
        let document = document_trigger;
        if (document_trigger === undefined) {
            let active_editor = vscode.window.activeTextEditor;
            if (!active_editor) {
                return; // no editor
            }
            document = active_editor.document;
        }
        let language_id: string = document.languageId;

        if (language_id !== "verilog" && language_id !== 'systemverilog' && language_id !== 'vhdl') {
            return;
        }
        let file_path = document.uri.fsPath;
        this.document = document;
        return file_path;
    }

    //////////////////////////////////////////////////////////////////////////////
    // Generate netlist
    //////////////////////////////////////////////////////////////////////////////
    clear_enviroment(output_path) {
        try {
            fs.unlinkSync(output_path);
        } catch (err) { }
    }

    async generate_project_netlist(project) {
        let result = await this.generate_from_project(project);
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

    async generate_from_project(project) {
        let sources = project.get_sources_as_array();

        const tmpdir = require('os').homedir();
        this.clear_enviroment(this.output_path);

        return await this.run_yosys_script(sources, this.output_path);
    }


    async generate_from_file(file_path) {
        if (file_path === undefined) {
            return '';
        }
        this.clear_enviroment(this.output_path);

        return await this.run_yosys_script([file_path], this.output_path);
    }

    async run_yosys_script(sources, output_path) {
        let netlist = {
            'result': '',
            'error': false,
            'empty': false
        };

        const backend = this.config_reader.get_schematic_backend();

        let cmd_files = Yosys_lib.get_yosys_read_file(sources, backend, this.working_directory);
        if (cmd_files === undefined) {
            this.output_channel.show_message(ERROR_CODE.NETLIST_VHDL_ERROR);
            netlist.empty = true;
            return netlist;
        }
        let output_path_filename = path_lib.basename(output_path);
        const script_code = `${cmd_files}; proc; opt; write_json ${output_path_filename}; stat`;

        let yosys_path = this.config_reader.get_tool_path('yosys');
        let command = `yowasp-yosys -p "${script_code}"`;
        if (backend === 'yosys' || backend === 'yosys_ghdl') {
            if (yosys_path === '') {
                yosys_path = 'yosys';
            }
            else {
                yosys_path = path_lib.join(yosys_path, 'yosys');
                if (process.platform === "win32") {
                    yosys_path += '.exe';
                }
            }
            command = `${yosys_path} -p "${script_code}"`;
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
        output_yosys.result = Yosys_lib.normalize_netlist(output_yosys.result);
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