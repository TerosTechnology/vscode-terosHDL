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

import { LANGUAGE } from 'colibri/common/general';
import {
    e_linter_general_linter_vhdl,
    e_linter_general_linter_verilog,
    e_linter_general_lstyle_vhdl,
    e_linter_general_lstyle_verilog
} from 'colibri/config/config_declaration';
import { Linter_manager } from '../linter';
import { buildTitle, appendMsg, replaceByResult, INTROICON } from './utils';

export async function checkLinter(linterManager: Linter_manager) {
    let isOk = true;

    let msg = '';
    msg += buildTitle('Checking Linter configuration');

    const vhdlErrorLinter = linterManager.vhdlErrorLinter;
    const verilogErrorLinter = linterManager.verilogErrorLinter;
    const vhdlStyleLinter = linterManager.vhdlStyleLinter;
    const verilogStyleLinter = linterManager.verilogStyleLinter;

    const linterList = [vhdlErrorLinter, verilogErrorLinter, vhdlStyleLinter, verilogStyleLinter];
    for (const linter of linterList) {
        const language = linter.lang;
        const linterName = linter.get_linter_name();
        const linterOptions = linter.get_options(language);
        const linterInstance = linter.linter;
        const linterMode = linter.mode;

        const languageMsg = language === LANGUAGE.VHDL ? 'VHDL' : 'Verilog/SV';

        const msgInstallationPath = linterOptions.path === '' ? 'System path' : `"${linterOptions.path}"`;

        const msgChecking = `${INTROICON} Checking linter ${linterMode} with ${linterName} for ${languageMsg}. Current configured installation path: ${msgInstallationPath}\n`;
        const msgDisabled = `${INTROICON} Linter ${linterMode} for ${languageMsg} is disabled. Skipping configuration check.\n`;

        const disabledList = [
            e_linter_general_linter_vhdl.none,
            e_linter_general_linter_vhdl.disabled,
            e_linter_general_linter_verilog.disabled,
            e_linter_general_lstyle_vhdl.disabled,
            e_linter_general_lstyle_verilog.disabled
        ];

        msg += disabledList.includes(linterName) ? msgDisabled : msgChecking;

        if (!disabledList.includes(linterName)) {
            const result = await linterInstance.checkLinterConfiguration(linterName, linterOptions.path);
            msg = appendMsg(result, msg, 'linter');
            if (!result.successfulConfig) {
                isOk = false;
            }
        }

        msg += '\n\n';
    }

    return replaceByResult(msg, isOk);
}
