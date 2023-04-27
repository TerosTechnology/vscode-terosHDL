// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

import { HDL_LANG, HDL_EXTENSIONS } from "./general";

/**
 * Get the HDL language from a file path.
 * @param  {string} path File path
 * @returns HDL_LANG -> HDL language
 */
export function get_language(path: string): HDL_LANG {
    const path_lib = require('path');
    const ext_name = path_lib.extname(path);
    if (HDL_EXTENSIONS.SYSTEMVERILOG.includes(ext_name)) {
        return HDL_LANG.SYSTEMVERILOG;
    }
    else if (HDL_EXTENSIONS.VHDL.includes(ext_name)) {
        return HDL_LANG.VHDL;
    }
    else if (HDL_EXTENSIONS.VERILOG.includes(ext_name)) {
        return HDL_LANG.VERILOG;
    }
    else {
        return HDL_LANG.NONE;
    }
}