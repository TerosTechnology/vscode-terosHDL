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

export class Tool_base {
    private output_channel;
    private exp: string = '';
    private more: string = '';
    private switch: string = '';
    private folder_sep: string = '';
    private childp;
    private context;
    private python_path: string = '';

    constructor(context){
        this.context = context;
        this.output_channel = vscode.window.createOutputChannel('TerosHDL');
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
        let python_path = this.python_path;
        const jsteros = require('jsteros');
        python_path = await jsteros.Nopy.get_python_exec(python_path);
    
        if ( (python_path === undefined || python_path === '') && show_message === true) {
          let msg = `Install and configure Python3 in the project manager configuration. Install pyteroshdl: pip install pyteroshdl. If you dont't want to see this message select empty tool in the project manager configuration. Check [TerosHDL documentation](https://terostechnology.github.io/terosHDLdoc/configuration/general.html)`;
          vscode.window.showInformationMessage(msg);
          return undefined;
        }
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
