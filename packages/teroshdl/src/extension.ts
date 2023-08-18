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
//Extension manager
import * as release_notes_webview from "./utils/webview/release_notes";
import { Extension_manager } from "./utils/webview/utils";
//Utils

// TerosHDL
import { Teroshdl } from './teroshdl';
import { Logger } from './logger';

export async function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "TerosHDL" is now active!');

    const extension_manager = new Extension_manager();

    const global_logger = new Logger("TerosHDL: Global");
    global_logger.clear();
    
    try {
        await extension_manager.init();
        const releaseNotesView = new release_notes_webview.ReleaseNotesWebview(context);
        const installationType = extension_manager.get_installation_type();

        if (installationType.firstInstall || installationType.update) {
            await releaseNotesView.show();
        }
    }
    catch (e) {
        console.log(e);
    }

    const teroshdl = new Teroshdl(context, global_logger);
    teroshdl.init_teroshdl();
}
