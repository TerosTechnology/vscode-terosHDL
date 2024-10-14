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
import 'module-alias/register';

import * as vscode from 'vscode';
import * as release_notes_webview from './features/utils/webview/release_notes';
import { ExtensionManager } from './features/utils/webview/utils';
import { Teroshdl } from './teroshdl';
import { globalLogger, toolLogger, debugLogger } from './logger';
import { Logger } from 'colibri/logger/logger';

let teroshdl: Teroshdl | undefined = undefined;

export async function activate(context: vscode.ExtensionContext) {
    debugLogger.info('Congratulations, your extension "TerosHDL" is now active!');

    const extension_manager = new ExtensionManager();

    globalLogger.clear();
    toolLogger.clear();
    debugLogger.clear();

    Logger.setLogger(debugLogger);

    try {
        await extension_manager.init();
        const releaseNotesView = new release_notes_webview.ReleaseNotesWebview(context);
        const installationType = extension_manager.get_installation_type();

        if (installationType.firstInstall || installationType.update) {
            await releaseNotesView.show();
        }
    } catch (e) {
        console.log(e);
    }

    teroshdl = new Teroshdl(context);
    await teroshdl.init_teroshdl();
}

export async function deactivate() {
    if (teroshdl === undefined) {
        return;
    }
    await teroshdl.deactivate();
    debugLogger.info('TerosHDL deactivated');
}
