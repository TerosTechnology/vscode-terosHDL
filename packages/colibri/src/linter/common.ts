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

import * as cfg from "../config/config_declaration";

export enum LINTER_MODE {
    STYLE = "style",
    ERRORS = "errors",
}

/** Linter name */
export type t_linter_name = cfg.e_linter_general_linter_vhdl | cfg.e_linter_general_linter_verilog |
    cfg.e_linter_general_lstyle_vhdl | cfg.e_linter_general_lstyle_verilog;

/** Linter severity of error */
export enum LINTER_ERROR_SEVERITY {
    ERROR = "error",
    WARNING = "warning",
    INFO = "information",
}

/** Individual linter error description */
export type l_error = {
    severity: LINTER_ERROR_SEVERITY;
    description: string;
    code: string;
    location: {
        file: string,
        position: number[]
    };
}

/** Linter options */
export type l_options = {
    path: string;
    argument: string
}

