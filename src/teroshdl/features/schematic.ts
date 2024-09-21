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
import * as utils from './utils/utils';
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import { Base_webview } from './base_webview';
import * as os from 'os';
import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import { globalLogger } from '../logger';
import { get_default_version_for_filepath, get_language_from_filepath } from 'colibri/utils/file_utils';
import { e_source_type, t_file } from 'colibri/project_manager/common';
import { get_toplevel_from_path } from 'colibri/utils/hdl_utils';
import { e_schematic_result, getSchematic } from 'colibri/yosys/yosys';
import { e_schematic_general_backend } from 'colibri/config/config_declaration';

const activation_command = 'teroshdl.netlist.viewer';
const id = "netlist";

export class Schematic_manager extends Base_webview {

    private working_directory = "";
    private output_path = "";
    private childp;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager, mode_project: boolean) {

        super(context, manager, path_lib.join(context.extensionPath, 'resources', 'webviews',
            'netlist_viewer', 'netlist_viewer.html'), activation_command, id);

        this.working_directory = os.tmpdir();
    }

    get_webview_content(webview: vscode.Webview) {
        const template_path = path_lib.join(this.context.extensionPath, 'resources', 'webviews', 'netlist_viewer', 'index.html.nj');
        const template_str = fs.readFileSync(template_path, 'utf-8');

        const css_bootstrap_path = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews', 'common',
            'bootstrap.min.css'));
        const css_common_path = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews', 'common',
            'style.css'));

        const css_path = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'netlist_viewer', 'style.css'));
        const js_path_0 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'netlist_viewer', 'libs', 'elk.bundled.js'));
        const js_path_1 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'netlist_viewer', 'libs', 'netlistsvg.bundle.js'));
        const js_path_2 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'netlist_viewer', 'libs', 'jquery-2.2.4.min.js'));
        const js_path_3 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'netlist_viewer', 'libs', 'svg-pan-zoom.min.js'));
        const js_path_4 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'netlist_viewer', 'libs', 'viz.js'));
        const js_path_5 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'resources', 'webviews',
            'netlist_viewer', 'libs', 'main.js'));

        const html = nunjucks.renderString(template_str, {
            "css_common_path": css_common_path,
            "css_bootstrap_path": css_bootstrap_path,
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
        else {
            await this.generate_project_netlist();
        }
    }

    async update(vscode_document: utils.t_vscode_document) {
        this.last_document = vscode_document;

        const schematic: any = await this.generateFromfile(vscode_document.filename);

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
            vscode.window.showSaveDialog({ title: "Save image", filters: filter }).then(fileInfos => {
                if (fileInfos?.path !== undefined) {
                    let path_norm = utils.normalize_path(fileInfos?.path);

                    fs.writeFileSync(path_norm, svg);
                    globalLogger.info(`Schematic saved in: ${path_norm}`, true);
                }
            });
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    // Generate netlist
    //////////////////////////////////////////////////////////////////////////////
    async generate_project_netlist() {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            cancellable: false,
            title: 'TerosHDL: Creating schematic viewer...'
        }, async (progress) => {

            progress.report({ increment: 0 });
            const result = await this.generateFromProject();
            progress.report({ increment: 100 });

            await this.update_svg_in_html(result);
        });
    }

    async generate_file_netlist(path) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            cancellable: false,
            title: 'TerosHDL: Creating schematic viewer...'
        }, async (progress) => {

            progress.report({ increment: 0 });
            const result = await this.generateFromfile(path);
            progress.report({ increment: 100 });

            await this.update_svg_in_html(result);
        });
    }

    private async update_svg_in_html(netlist) {
        if (netlist === undefined || netlist === '') {
            return;
        }

        let result = '';
        if (netlist.empty === false) {
            result = netlist.result;
        }

        await this.panel?.webview.postMessage({ command: "update", result: result });
    }

    async generateFromProject() {
        try {
            const selectedProject = this.manager.get_selected_project();

            const topLevelPath = selectedProject.get_project_definition().toplevel_path_manager.get();
            const fileList = selectedProject.get_project_definition().file_manager.get();

            let topLevel = "";
            if (topLevelPath.length === 1) {
                topLevel = get_toplevel_from_path(topLevelPath[0]);
            }

            return await this.run_yosys_script(topLevel, fileList);
        } catch (error) {
            globalLogger.error("Select a project first.", false);
            return "";
        }

    }

    async generateFromfile(file_path: string) {
        const language = get_language_from_filepath(file_path);
        const fileVersion = get_default_version_for_filepath(file_path);
        const file: t_file = {
            name: file_path,
            is_include_file: false,
            include_path: '',
            logical_name: '',
            is_manual: false,
            file_type: language,
            file_version: fileVersion,
            source_type: e_source_type.SYNTHESIS

        };
        const topLevel = get_toplevel_from_path(file_path);
        return await this.run_yosys_script(topLevel, [file]);
    }

    async run_yosys_script(topLevel: string, sources: t_file[]) {
        let netlist = {
            'result': '',
            'error': false,
            'empty': false
        };

        let config = utils.getConfig(this.manager);
        try {
            const selectedProject = this.manager.get_selected_project();
            config = selectedProject.get_config();
        }
        catch (error) { }

        return new Promise(async resolve => {
            const handleStream = (result: e_schematic_result): void => {

                if (result.sucessful) {
                    const result_yosys = JSON.parse(result.schematic);
                    netlist.empty = false;

                    this.getSvgFromJson(result_yosys)
                        .then(netlist_svg => {
                            netlist.result = netlist_svg["result"];
                            resolve(netlist);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
                else {
                    globalLogger.error("Yosys failed.", true);
                    netlist.empty = true;
                    resolve(netlist);
                }
            };
            if (config.schematic.general.backend === e_schematic_general_backend.standalone) {
                vscode.window.showInformationMessage("Standalone backend is not supported in this version.");
                return;
            }

            // Run Yosys
            const exec_i = await getSchematic(config, topLevel, sources, handleStream);

            const cmd = `Executing: ${exec_i.spawnfile}  ${exec_i.spawnargs.join(" ")}`;
            globalLogger.info(cmd);

            exec_i.stdout.on('data', function (data) {
                globalLogger.info(data);
            });
            exec_i.stderr.on('data', function (data) {
                globalLogger.append(data);
            });

        });
    }

    async getSvgFromJson(jsonSchematic: any) {
        let outputYosys = { result: jsonSchematic };
        outputYosys.result = normalizeNetlist(outputYosys.result);
        const netlistsvg = require("netlistsvg");
        const skinPath = path_lib.join(this.context.extensionPath, "resources",
            "webviews", "netlist_viewer", "default.svg");
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

        let jsonp = outputYosys.result;
        try {
            outputYosys.result = await netlistsvg.render(skin, jsonp, undefined, undefined, config);
        } catch (error) {
            console.log(error);
            globalLogger.error("Generating the schematic graph. The graph exceeds the maximum size.", true);
            return "";
        }

        return outputYosys;
    }
}

export function normalizeNetlist(netlist: any) {
    try {
        let norm_netlist = netlist;
        let modules = netlist.modules;

        for (let module in modules) {
            let cells_module = modules[module].cells;
            for (let cell in cells_module) {
                let cell_i = cells_module[cell];
                if (cell_i.port_directions === undefined) {
                    cell_i.port_directions = {};
                    for (let port in cell_i.connections) {
                        cell_i.port_directions[port] = 'input';
                    }
                }
            }
        }
        norm_netlist.modules = modules;
        return norm_netlist;
    }
    catch (e) {
        return netlist;
    }
}