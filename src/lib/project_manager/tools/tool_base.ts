/* eslint-disable @typescript-eslint/class-name-casing */
// Copyright 2020-2021 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of TerosHDL.
//
// TerosHDL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// TerosHDL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.
import * as vscode from 'vscode';
const path_lib = require('path');
const shell = require('shelljs');
const os = require('os');
import * as Output_channel_lib from '../../utils/output_channel';
const ERROR_CODE = Output_channel_lib.ERROR_CODE;
import * as config_reader_lib from "../../utils/config_reader";

export class Tool_base {
    private exp: string = '';
    private more: string = '';
    private switch: string = '';
    private folder_sep: string = '';
    private childp;
    private context: vscode.ExtensionContext;
    private python_path: string = '';
    private output_channel : Output_channel_lib.Output_channel;
    private config_reader : config_reader_lib.Config_reader;

    constructor(context: vscode.ExtensionContext, output_channel: Output_channel_lib.Output_channel){
        this.context = context;
        this.output_channel = output_channel;
        this.config_reader = new config_reader_lib.Config_reader(context, output_channel);
        this.exp = "export ";
        this.more = ";";
        this.switch = '';
        this.folder_sep = "/";
        this.python_path = '';
    
        if (os.platform() === "win32") {
          this.exp = "SET ";
          this.more = "&&";
          this.switch = '/D';
          this.folder_sep = "\\";
        }
    }

    set_python_path(python_path){
      this.python_path = python_path;
    }

    async get_python3_path(show_message = true) {
        let python_path = await this.config_reader.get_python_path_binary(show_message);
        return python_path;
    }

    async stop_test() {
        let path_bin = path_lib.join('resources', 'bin', 'kill_vunit','kill.sh');
    
        if (this.childp === undefined) {
            return;
        }
        try {
            const os = require('os');
            let cmd = '';
            if (os.platform === "win32") {
                cmd = "TASKKILL /F /T /PID  " + (this.childp.pid);
            }
            else {
              let path_kill = this.context.asAbsolutePath(path_bin);
              cmd = "bash " + path_kill + " " + (this.childp.pid);
            }
            shell.exec(cmd, { async: true }, function (error, stdout, stderr) {
            });
        }
        catch (e) { }
    }
}
