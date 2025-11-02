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
import { spawn } from 'child_process';
import { Base_webview } from './web';
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as path_lib from 'path';
import { globalLogger } from '../../logger';
import * as utils from '../utils/utils';
import { get_os } from 'colibri/process/utils';
import { OS } from 'colibri/process/common';
import * as file_utils from 'colibri/utils/file_utils';
import { e_tools_general_waveform_viewer } from 'colibri/config/config_declaration';

export class Comander {

    private manager: Multi_project_manager;
    private report_webview: Base_webview;

    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager) {
        this.manager = manager;
        this.report_webview = new Base_webview(context);
    }

    public init() {
        vscode.commands.registerCommand("teroshdl.open", (ags) => this.open_file(ags));
        vscode.commands.registerCommand("teroshdl.waveform", (ags) => this.open_waveform(ags));
        vscode.commands.registerCommand("teroshdl.openwebview", (ags) => this.open_webview(ags, this.report_webview));
    }

    private open_file(args: vscode.Uri) {
        globalLogger.info(`Opening the file: ${args.fsPath}`);
        vscode.workspace.openTextDocument(args).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    }

    private async open_waveform(args: vscode.Uri) {
        if (!args || !file_utils.check_if_path_exist(args.fsPath) || !file_utils.check_if_file(args.fsPath)) {
            vscode.window.showInformationMessage(`Waveform file not found`);
            return;
        }

        const config = utils.getConfig(this.manager);
        const file_path = args.fsPath;
        globalLogger.info(`Opening the waveform: ${file_path}`);

        if (config.tools.general.waveform_viewer == e_tools_general_waveform_viewer.vaporView) {
            const extension = await vscode.extensions.getExtension('lramseyer.vaporview');
            if (extension && extension.isActive) {
                let vaporview_args = {
                    uri: args,
                    loadAll: config.tools.general.vaporview_load_all_signals,
                    maxSignals: 64
                };
                await vscode.commands.executeCommand('vaporview.openFile', vaporview_args);
                return;
            }
            vscode.window.showInformationMessage(`VaporView not available or not active. Defaulting to GTKWave.`);
        }

        const use_surfer = config.tools.general.waveform_viewer == e_tools_general_waveform_viewer.surfer;

        let waveviewer_binary = use_surfer ? "surfer" : "gtkwave";
        const os_i = get_os();
        if (os_i === OS.WINDOWS) {
            waveviewer_binary = use_surfer ? "surfer.exe" : "gtkwave.exe";
        }

        let waveviewer_path = "";
        let base_path = use_surfer ? config.tools.general.surfer_installation_path : config.tools.general.gtkwave_installation_path;
        if (base_path !== "") {
            waveviewer_path = path_lib.join(base_path, waveviewer_binary);
        }
        else {
            waveviewer_path = waveviewer_binary;
        }
        const extra_arguments = use_surfer ? config.tools.general.surfer_extra_arguments : config.tools.general.gtkwave_extra_arguments;

        let command = `${waveviewer_path} ${file_path} ${extra_arguments}`;
        // shelljs.exec(command, { async: true });
        spawn(command, {
            shell: true,
            stdio: 'inherit'
        });
    }

    private open_webview(args: string, webview: Base_webview) {
        webview.create_webview(args);
    }

}