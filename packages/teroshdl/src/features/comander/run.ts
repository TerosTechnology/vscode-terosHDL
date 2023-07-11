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

import * as opn from 'open';
import * as vscode from 'vscode';
import * as shelljs from 'shelljs';
import { Base_webview } from './web';
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import { OS } from "teroshdl2/out/process/common";
import { get_os } from "teroshdl2/out/process/utils";
import * as path_lib from 'path';
import { Logger } from '../../logger';

export class Comander {

    private manager: Multi_project_manager;
    private report_webview: Base_webview;
    private logger: Logger;

    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager, logger: Logger) {
        this.manager = manager;
        this.report_webview = new Base_webview(context);
        this.logger = logger;
    }

    public init() {
        vscode.commands.registerCommand("teroshdl.open", (ags) => this.open_file(ags));
        vscode.commands.registerCommand("teroshdl.waveform", (ags) => this.open_waveform(ags));
        vscode.commands.registerCommand("teroshdl.openwebview", (ags) => this.open_webview(ags, this.report_webview));
    }

    private open_file(args: vscode.Uri) {
        this.logger.info(`Opening the file: ${args.fsPath}`);
        // opn(`${'file://'}${args.fsPath}`);
        vscode.workspace.openTextDocument(args).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    }

    private open_waveform(args: vscode.Uri) {
        const file_path = args.fsPath;
        this.logger.info(`Opening the waveform: ${file_path}`);

        let gtkwave_binary = "gtkwave";
        const os_i = get_os();
        if (os_i === OS.WINDOWS) {
            gtkwave_binary = "gtkwave.exe";
        }

        let gtkwave_path = "";
        let base_path = this.manager.get_config_manager().get_config().tools.general.gtkwave_installation_path;
        if (base_path !== "") {
            gtkwave_path = path_lib.join(base_path, gtkwave_binary)
        }
        else {
            gtkwave_path = gtkwave_binary;
        }
        const extra_arguments = this.manager.get_config_manager().get_config().tools.general.gtkwave_extra_arguments;

        let command = `${gtkwave_path} ${file_path} ${extra_arguments}`;
        shelljs.exec(command, { async: true });
    }

    private open_webview(args: string, webview: Base_webview) {
        webview.create_webview(args)
    }

}