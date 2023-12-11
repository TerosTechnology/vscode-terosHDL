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

    constructor(name = "") {
        if (name === "") {
            name = 'TerosHDL: Tool manager';
        }
        this.output_channel = vscode.window.createOutputChannel(name, { log: true });
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

    log(msg: string) {
        this.info(msg);
    }

    debug(msg: string, enable_show = false) {
        this.show(enable_show);
        this.output_channel.debug(this.replaceFilePath(msg));
    }
    warn(msg: string, enable_show = false) {
        this.show(enable_show);
        this.output_channel.warn(this.replaceFilePath(msg));
    }
    info(msg: string, enable_show = false) {
        this.show(enable_show);
        this.output_channel.info(this.replaceFilePath(msg));
    }
    trace(msg: string, enable_show = false) {
        this.show(enable_show);
        this.output_channel.trace(this.replaceFilePath(msg));
    }
    error(msg: string, enable_show = false) {
        this.show(enable_show);
        this.output_channel.error(this.replaceFilePath(msg));
    }
    replaceFilePath(input: string): string {
        return input;
        const regex = /file:? ?"?([\/\w.-]+(\s[\/\w.-]+)*)"?\s?/ig;
        return input.replace(regex, 'file://$1');
    }
}

export const debugLogger: Logger = new Logger("TerosHDL: Debug");