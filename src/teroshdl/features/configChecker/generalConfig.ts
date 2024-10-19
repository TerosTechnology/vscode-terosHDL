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

import { e_config } from 'colibri/config/config_declaration';
import { appendMsg, BADICON, buildTitle, INTROICON, OKICON, replaceByResult } from './utils';
import { get_python_path, check_python_package } from 'colibri/process/python';
import { checkBinary } from 'colibri/toolChecker/utils';

export async function checkGeneralConfig(currentConfig: e_config): Promise<string> {
    const installationPath = currentConfig.general.general.makepath;

    let isOk = true;

    let msg = '';
    msg += buildTitle('Checking general configuration');

    // Check make
    msg += `${INTROICON} Checking make. This tool is used to run some external tools. Current configured installation path: "${installationPath}"\n`;
    const result = await checkBinary('make', installationPath, 'make', ['--version']);
    msg = appendMsg(result, msg, 'make');
    msg += '\n\n';
    isOk = !result.successfulConfig ? false : isOk;

    // Python
    const pythonInstallationPath = currentConfig.general.general.pypath;
    msg += `${INTROICON} Checking Python installation. Configured installation path: "${pythonInstallationPath}"\n`;
    const pythonResult = await get_python_path({ path: pythonInstallationPath });
    for (const msgInst of pythonResult.checkMessageList) {
        msg += '  ' + msgInst + '\n';
    }
    if (pythonResult.successful) {
        msg += `${OKICON} Python installation path is correctly configured. Using "${pythonResult.python_complete_path}"\n`;
        isOk = false;
    } else {
        msg += `${BADICON} Python installation path is not correctly configured. Python binary was not found in the system path or in the configured path. Check the documentation.\n`;
    }
    msg += '\n\n';

    // Python packages
    const packageList = [
        {
            name: 'vunit',
            isOptional: false,
            extraMessage: ''
        },
        {
            name: 'edalize',
            isOptional: false,
            extraMessage: ''
        },
        {
            name: 'cocotb',
            isOptional: true,
            extraMessage: ''
        },
        {
            name: 'vsg',
            isOptional: true,
            extraMessage: ''
        }
    ];

    if (pythonResult.successful) {
        msg += `${INTROICON} Checking Python dependencies. Current configured installation path: "${pythonInstallationPath}"\n`;
        for (const packageInst of packageList) {
            const packageResult = await check_python_package(pythonResult.python_path, packageInst.name);
            const optionalMsg = packageInst.isOptional ? ' (optional)' : '';
            if (packageResult) {
                msg += `  ${OKICON} ${packageInst.name}${optionalMsg} found.\n`;
            } else {
                msg += `  ${BADICON} ${packageInst.name}${optionalMsg} not found.\n`;
            }

            if (!packageResult && !packageInst.isOptional) {
                isOk = false;
            }
        }
    } else {
        msg += `${INTROICON} Python is bad configured. Skipping Python dependencies check"\n`;
    }

    return replaceByResult(msg, isOk);
}
