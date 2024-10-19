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
import { Formatter_manager } from '../formatter';
import { appendMsg, buildTitle, INTROICON, replaceByResult } from './utils';

const HELP = 'https://terostechnology.github.io/terosHDLdoc/docs/guides/formatter';

export async function checkFormatter(formatterManager: Formatter_manager) {
    let msg = '';
    let isOk = true;

    msg += buildTitle('Checking Formatter configuration', HELP);

    const formatterVhdl = formatterManager.formatterVhdl;
    const formatterVerilog = formatterManager.formatterVerilog;

    const formatterList = [formatterVhdl, formatterVerilog];
    for (const formatter of formatterList) {
        const language = formatter.lang;
        const formatterName = formatter.get_formatter_name();
        const installationPath = formatter.getInstallationPath();

        const languageMsg = language === LANGUAGE.VHDL ? 'VHDL' : 'Verilog/SV';
        msg += `${INTROICON} Checking formatter ${formatterName} for ${languageMsg}.\n`;

        const result = await formatter.getFormatter().checkLinterConfiguration(installationPath);
        msg = appendMsg(result, msg, 'linter');

        if (!result.successfulConfig) {
            isOk = false;
        }

        msg += '\n\n';
    }

    return replaceByResult(msg, isOk);
}
