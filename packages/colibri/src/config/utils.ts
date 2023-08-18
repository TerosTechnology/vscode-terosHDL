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

import { HDL_LANG } from '../common/general';
import { e_config } from './config_declaration';
import { t_linter_name, LINTER_MODE, l_options } from '../linter/common';

export function get_linter_name(lang: HDL_LANG, mode: LINTER_MODE, config: e_config): t_linter_name {
    if (lang === HDL_LANG.VHDL && mode === LINTER_MODE.ERRORS) {
        return config.linter.general.linter_vhdl;
    }
    else if ((lang === HDL_LANG.VERILOG
        || lang === HDL_LANG.SYSTEMVERILOG)
        && mode === LINTER_MODE.ERRORS) {
        return config.linter.general.linter_verilog;
    }
    else if (lang === HDL_LANG.VHDL && mode === LINTER_MODE.STYLE) {
        return config.linter.general.lstyle_vhdl;
    }
    else {
        return config.linter.general.lstyle_verilog;
    }
}

export function get_linter_options() {
    const options: l_options = {
        path: '',
        argument: ''
    };
    return options;
}