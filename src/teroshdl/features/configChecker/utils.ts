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

import { BinaryCheck } from 'colibri/toolChecker/utils';

export const OKICON = '🎉';
export const ERRORICON = '❌';
export const BADICON = '👎';
export const CONFIGICON = '🔧';
export const INTROICON = '⊙';

const MSGSEPARATOR = '*************************************************';
const RESULTSTR = 'TEROSHDLRESULT';


export function buildTitle(title: string): string {
    return `${MSGSEPARATOR}\n${title} ${RESULTSTR}\n${MSGSEPARATOR}\n`;
}

export function appendMsg(result: BinaryCheck, msg: string, displayGroup: string, extraIndent: string = '') {
    for (const [_, line] of result.messageList.entries()) {
        if (line !== '') {
            msg += extraIndent + `  ${line}\n`;
        }
    }
    if (result.successfulConfig) {
        msg += extraIndent + `${OKICON} The ${displayGroup} installation path is correctly configured.\n`;
    } else if (result.successfulFind) {
        const msgSystemPath = result.binaryPath === '' ? 'System Path' : `"${result.binaryPath}"`;
        msg +=
            extraIndent +
            `${CONFIGICON} TerosHDL ${displayGroup}; however, the installation path is not correctly configured. Ensure the path points to the binary folder, not the specific binary. Found in: ${msgSystemPath}\n`;
    } else {
        msg +=
            extraIndent +
            `${BADICON} The ${displayGroup} installation path is not correctly configured. The binary could not be located in either the system path or the configured path. Please check the documentation.\n`;
    }
    return msg;
}

export function replaceByResult(inputStr: string, isSucessful: boolean): string {
    const msg = isSucessful
        ? `\n${OKICON} Correctly configured ${OKICON}${OKICON}`
        : `\n${ERRORICON} Some checks failed ${ERRORICON}`;
    return inputStr.replace(RESULTSTR, msg);
}
