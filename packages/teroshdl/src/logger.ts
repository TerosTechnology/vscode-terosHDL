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

import * as vscode from "vscode";

export class Logger {
    private output_channel: vscode.LogOutputChannel;

    constructor(name = ""){
        if (name === ""){
            name = 'TerosHDL: Tool manager';
        }
        this.output_channel = vscode.window.createOutputChannel(name, {log: true});
        // this.output_channel.logLevel = vscode.LogLevel.Debug;
    }

    clear() {
        this.output_channel.clear();
    }

    append(msg: string) {
        this.output_channel.append(msg);
    }

    appendLine(msg: string) {
        this.output_channel.appendLine(msg);
    }

    show(enable = true) {
        if (enable) {
            this.output_channel.show();
        }
    }

    log(msg: string){
        this.info(msg);
    }

    debug(msg: string, enable_show = false){
        this.show(enable_show);
        this.output_channel.debug(msg);
    }
    warn(msg: string, enable_show = false){
        this.show(enable_show);
        this.output_channel.warn(msg);
    }
    info(msg: string, enable_show = false){
        this.show(enable_show);
        this.output_channel.info(msg);
    }
    trace(msg: string, enable_show = false){
        this.show(enable_show);
        this.output_channel.trace(msg);
    }
    error(msg: string, enable_show = false){
        this.show(enable_show);
        this.output_channel.error(msg);
    }
}