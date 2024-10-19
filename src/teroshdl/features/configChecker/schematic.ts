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

import { e_config, e_schematic_general_backend } from 'colibri/config/config_declaration';
import { appendMsg, buildTitle, INTROICON, replaceByResult } from './utils';
import { checkBinary } from 'colibri/toolChecker/utils';

export async function checkSchematic(currentConfig: e_config) {
    let isOk = true;
    const backend = currentConfig.schematic.general.backend;
    const preCommand = currentConfig.schematic.general.extra;
    const binaryName = backend === e_schematic_general_backend.yowasp ? 'yowasp-yosys' : 'yosys';
    const installationPath =
        backend === e_schematic_general_backend.yowasp ? '' : currentConfig.tools.yosys.installation_path;

    let msg = '';

    msg += buildTitle('Checking Schematic configuration');

    let extraMsg = '';
    if (backend === e_schematic_general_backend.yowasp || backend === e_schematic_general_backend.yosys) {
        extraMsg = "This backend doesn't support VHDL files.";
    }
    msg += `${INTROICON} Selected backend: ${backend} with installation path: "${installationPath}". ${extraMsg}\n`;

    const result = await checkBinary(backend, preCommand + installationPath, binaryName, ['--version']);
    if (!result.successfulConfig) {
        isOk = false;
    }

    msg = appendMsg(result, msg, 'Schematic Backend');
    msg += '\n';

    msg += '\n';

    return replaceByResult(msg, isOk);
}
