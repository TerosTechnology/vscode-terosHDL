// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com ]
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

/** Linter name */
export type t_formatter_name = cfg.e_formatter_general_formatter_vhdl | cfg.e_formatter_general_formatter_verilog;

/** Result type for formatter */
export type f_result = {
    code_formatted: string;
    command: string;
    successful: boolean;
    message: string;
};

export type e_formatter_verible_full = {
    format_args : string;
    path: string;
};
