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

import { LANGUAGE } from "../common/general";
import { Vhdl_parser } from "./ts_vhdl/parser";
import { Verilog_parser } from "./ts_verilog/parser";

export class Factory {

    async get_parser(lang: LANGUAGE) {
        if (lang === LANGUAGE.VHDL) {
            return await this.get_vhdl_parser();
        }
        else {
            return await this.get_verilog_parser();
        }
    }

    async get_vhdl_parser() {
        const parser = new Vhdl_parser();
        await parser.init();
        return parser;
    }

    async get_verilog_parser() {
        const parser = new Verilog_parser();
        await parser.init();
        return parser;
    }
}