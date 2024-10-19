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

import { Ghdl } from "./ghdl";
import { Icarus } from "./icarus";
import { Verilator } from "./verilator";
import { Vivado } from "./vivado";
import { Modelsim } from "./modelsim";
import { Verible } from "./verible";
import { Vsg } from "./vsg";
import * as common from "./common";
import * as cfg from "../config/config_declaration";
import { t_file } from "../project_manager/common";
import { BinaryCheck } from "colibri/toolChecker/utils";

/** Linter */
export class Linter {

    private get_linter(linter_name: common.t_linter_name) {

        if (linter_name === cfg.e_linter_general_linter_vhdl.ghdl) {
            return new Ghdl();
        }
        else if (linter_name === cfg.e_linter_general_linter_vhdl.vivado) {
            return new Vivado();
        }
        else if (linter_name === cfg.e_linter_general_linter_vhdl.modelsim) {
            return new Modelsim();
        }
        else if (linter_name === cfg.e_linter_general_linter_verilog.icarus) {
            return new Icarus();
        }
        else if (linter_name === cfg.e_linter_general_linter_verilog.modelsim) {
            return new Modelsim();
        }
        else if (linter_name === cfg.e_linter_general_linter_verilog.verilator) {
            return new Verilator();
        }
        else if (linter_name === cfg.e_linter_general_linter_verilog.vivado) {
            return new Vivado();
        }
        else if (linter_name === cfg.e_linter_general_lstyle_verilog.verible) {
            return new Verible();
        }
        else if (linter_name === cfg.e_linter_general_lstyle_vhdl.vsg) {
            return new Vsg();
        }
        else {
            return new Ghdl();
        }
    }

    parse_output(linter_name: common.t_linter_name, output: string, file: string): common.l_error[] {
        const linter = this.get_linter(linter_name);
        const errors = linter.parse_output(output, file);
        return errors;
    }

    async checkLinterConfiguration(linterName: common.t_linter_name, installationPath: string): Promise<BinaryCheck> {
        const linter = this.get_linter(linterName);
        return await linter.checkLinterConfiguration(installationPath);
    }

    /**
     * Lint a file from path
     * @param  {string} file File path to lint
     * @param  {common.l_options} options Linter options
     */
    async lint_from_file(linter_name: common.t_linter_name, file: string, options: common.l_options) {
        const linter = this.get_linter(linter_name);
        const errors = await linter.lint_from_file(file, options);
        return errors;
    }

    /**
     * Lint a file from the code
     * @param  {string} code Code to lint
     * @param  {common.l_options} options Linter options
     */
    async lint_from_code(linter_name: common.t_linter_name, code: string, options: common.l_options) {
        const linter = this.get_linter(linter_name);
        const errors = await linter.lint_from_code(code, options);
        return errors;
    }

    async lint_from_project(file_path: string, prj_file_list: t_file[],
        linter_name: common.t_linter_name, options: common.l_options): Promise<common.l_error[]> {

        const linter = this.get_linter(linter_name);
        const errors = await linter.lint_from_project(file_path, prj_file_list, options);
        return errors;
    }

}
