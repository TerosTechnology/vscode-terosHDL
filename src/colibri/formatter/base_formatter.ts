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
import { BinaryCheck } from "colibri/toolChecker/utils";

export abstract class Base_formatter {
    abstract argumentToCheck: string[];

    abstract format_from_code(code: string, opt: cfg.e_formatter_istyle |
        cfg.e_formatter_standalone | cfg.e_formatter_s3sv | cfg.e_formatter_svg | 
        common.e_formatter_verible_full, python_path: string
    ): Promise<common.f_result>;

    abstract format(file: string, opt: cfg.e_formatter_istyle |
        cfg.e_formatter_standalone | cfg.e_formatter_s3sv | cfg.e_formatter_svg | 
        common.e_formatter_verible_full, python_path: string
    ): Promise<common.f_result>;

    public async checkLinterConfiguration(_installationPath: string): Promise<BinaryCheck> {
        return {
            displayName: this.constructor.name,
            binaryPath: '',
            messageList: ["The formatter is built into TerosHDL. Skipping configuration check."],
            successfulFind: true,
            successfulConfig: true
        };
    }
}

