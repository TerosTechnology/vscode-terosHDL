// Copyright 2024
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as vscode from 'vscode';
import { getConfig } from '../utils/utils';
import { globalLogger } from '../../logger';
import { Linter_manager } from '../linter';
import { Formatter_manager } from '../formatter';
import { Schematic_manager } from '../schematic';
import { checkExternalToolManager } from './externalTools';
import { checkFormatter } from './formatter';
import { checkGeneralConfig } from './generalConfig';
import { checkLinter } from './linter';
import { checkSchematic } from './schematic';

export class configCheckerManager {
    private multiProjectManager: Multi_project_manager;
    private linterManager: Linter_manager;
    private formatterManager: Formatter_manager;
    private schematicManager: Schematic_manager;

    constructor(
        manager: Multi_project_manager,
        linterManager: Linter_manager,
        formatterManager: Formatter_manager,
        schematicManager: Schematic_manager
    ) {
        this.multiProjectManager = manager;
        this.linterManager = linterManager;
        this.formatterManager = formatterManager;
        this.schematicManager = schematicManager;

        vscode.commands.registerCommand('teroshdl.verifySetup', async () => await this.verifySetup());
    }

    public async verifySetup() {
        await verifySetup(
            this.multiProjectManager,
            this.linterManager,
            this.formatterManager,
            this.schematicManager
        );
    }
}

async function verifySetup(
    multiProjectManager: Multi_project_manager,
    linterManager: Linter_manager,
    formatterManager: Formatter_manager,
    _schematicManager: Schematic_manager
) {
    const currentConfig = getConfig(multiProjectManager);

    let msg = '';
    msg += await checkExternalToolManager(currentConfig);
    msg += await checkLinter(linterManager);
    msg += await checkFormatter(formatterManager);
    msg += await checkSchematic(currentConfig);
    msg += await checkGeneralConfig(currentConfig);

    globalLogger.info(msg, true);

    return;
}
