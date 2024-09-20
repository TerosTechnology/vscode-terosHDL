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

import { t_parameter, t_action_result } from "../common";
import { Manager } from "./manager";

/** A parameter is used for build- and run-time parameters, such as Verilog plusargs, VHDL generics, 
 * Verilog defines, Verilog parameters or any extra command-line options that should be sent to the 
 * simulation model. Different tools support different subsets of parameters. The list below 
 * describes valid parameter types */
export class Parameter_manager extends Manager<t_parameter, undefined, t_parameter, undefined>{

    /** Parameter list */
    private parameters: t_parameter[] = [];

    clear() {
        this.parameters = [];
    }

    get(): t_parameter[] {
        return this.parameters;
    }

    add(parameter: t_parameter): t_action_result {
        // Check if parameter exists
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(parameter)) {
            result.successful = false;
            result.msg = "Parameter is duplicated";
            return result;
        }
        this.parameters.push(parameter);
        return result;
    }

    delete(parameter: t_parameter): t_action_result {
        // Check if script exists
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(parameter) === false) {
            result.successful = false;
            result.msg = "Script name doesn't exist";
            return result;
        }

        const new_list = [];
        for (let i = 0; i < this.parameters.length; i++) {
            const element = this.parameters[i];
            if (parameter.datatype !== element.datatype || parameter.paramtype !== element.paramtype) {
                new_list.push(element);
            }
        }
        this.parameters = new_list;
        return result;
    }

    private check_if_exists(parameter: t_parameter) {
        for (let i = 0; i < this.parameters.length; i++) {
            const element = this.parameters[i];
            if (parameter.datatype === element.datatype && parameter.paramtype === element.paramtype) {
                return true;
            }
        }
        return false;
    }
}