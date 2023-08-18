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

import * as common from "./common";
import * as cfg from "../config/config_declaration";

import { Standalone_vhdl } from "./standalone_vhdl";
import { Istyle } from "./istyle";
import { S3sv } from "./s3sv";
import { Verible } from "./verible";
import { Vsg } from "./vsg";

/**
 * Formatter
 */
export class Formatter {

    get_formatter(formatter_name: common.t_formatter_name) {
        if (formatter_name === cfg.e_formatter_general_formatter_vhdl.standalone) {
            return new Standalone_vhdl();
        }
        if (formatter_name === cfg.e_formatter_general_formatter_vhdl.vsg) {
            return new Vsg();
        }
        else if (formatter_name === cfg.e_formatter_general_formatter_verilog.istyle) {
            return new Istyle();
        }
        else if (formatter_name === cfg.e_formatter_general_formatter_verilog.s3sv) {
            return new S3sv();
        }
        else {
            return new Verible();
        }
    }

    /**
     * Format the code.
     * @param  {common.t_formatter_name} formatter_name Formatter name
     * @param  {string} code Code to format
     * @param  {any} opt Formatter options
     */
    async format_from_code(formatter_name: common.t_formatter_name, code: string, opt: any, python_path: string)
        : Promise<common.f_result> {
        const formatter = this.get_formatter(formatter_name);
        return formatter.format_from_code(code, opt, python_path);
    }

    async format_from_file(formatter_name: common.t_formatter_name, file_path: string, opt: any, python_path: string)
        : Promise<common.f_result> {
        const formatter = this.get_formatter(formatter_name);
        return formatter.format(file_path, opt, python_path);
    }
}
