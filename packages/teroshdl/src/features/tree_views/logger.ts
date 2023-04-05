/* eslint-disable @typescript-eslint/class-name-casing */
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
// along with teroshdl. If not, see <https://www.gnu.org/licenses/>.
import * as vscode from "vscode";

export class Logger {
    private output_channel: vscode.OutputChannel = vscode.window.createOutputChannel('TerosHDL: Tool manager');

    clear() {
        this.output_channel.clear();
    }

    append(msg: string) {
        this.output_channel.append(msg);
    }

    appendLine(msg: string) {
        this.output_channel.appendLine(msg);
    }

    show() {
        this.output_channel.show();
    }

    log(msg: string){
        this.appendLine(msg);
    }
}