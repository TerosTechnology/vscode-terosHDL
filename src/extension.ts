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
//Extension manager
import * as release_notes_webview from "./utils/webview/release_notes";
//Utils
import * as Output_channel_lib from './utils/output_channel';


// TerosHDL
import {Teroshdl} from './teroshdl';


let output_channel: Output_channel_lib.Output_channel;



export async function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "TerosHDL" is now active!');

    //TerosHDL console
    output_channel = new Output_channel_lib.Output_channel(context);

    const teroshdl = new Teroshdl(context, output_channel);
    teroshdl.init_teroshdl();
}




