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

import { HDL_LANG } from "../common/general";

// Common
export type Position_hdl = {
    line: number;
    column: number;
}

export enum TYPE_HDL_ELEMENT {
    NONE = "none",
    ENTITY = "entity",
    PACKAGE = "package",
    INTERFACE = "interface",
    SIGNAL = "signal",
    CONSTANT = "constant",
    TYPE = "type",
    FUNCTION = "function",
    GENERIC = "generic",
    PORT = "port",
    VIRTUAL_BUS = "virtual_bus",
    INSTANTIATION = "instantiation",
    PROCESS = "process",
    MODPORT = "modport",
    LOGIC = "logic",
    CUSTOM = "custom",
    INTERFACE_DECLARATION = "interface_declaration"
}

export type Common_info = {
    position: Position_hdl;
    name: string;
    description: string;
}

// HDL elements
export type Signal_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.SIGNAL;
    info: Common_info;
    type: string;
};

export type Constant_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.CONSTANT;
    info: Common_info;
    type: string;
    default_value: string;
};

export type Type_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.TYPE;
    info: Common_info;
    type: string;
    logic: Logic_hdl[];
};

export type Function_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.FUNCTION;
    info: Common_info;
    type: string;
    arguments: string;
    return: string;
};


export type Virtual_bus_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.VIRTUAL_BUS;
    info: Common_info;
    direction: string;
    notable: boolean;
    port_list: Port_hdl[];
    type: string;
};

export type Port_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.PORT;
    info: Common_info;
    over_comment: string;
    inline_comment: string;
    direction: string;
    default_value: string;
    type: string;
    subtype: string;
};

export type Instantiation_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.INSTANTIATION;
    info: Common_info;
    type: string;
};

export type Process_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.PROCESS;
    info: Common_info;
    sens_list: string;
    type: string;
};

export type Modport_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.MODPORT;
    info: Common_info;
    ports: Port_hdl[];
};

export type Logic_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.LOGIC;
    info: Common_info;
    type: string;
};

export type Custom_hdl = {
    hdl_element_type: TYPE_HDL_ELEMENT.CUSTOM;
    info: Common_info;
    type: string;
};

export class Hdl_element {
    public lang: HDL_LANG = HDL_LANG.VHDL;
    public hdl_type: TYPE_HDL_ELEMENT = TYPE_HDL_ELEMENT.NONE;
    private _name = "";
    private _description = "";
    private signal_array: Signal_hdl[] = [];
    private constant_array: Constant_hdl[] = [];
    private type_array: Type_hdl[] = [];
    private function_array: Function_hdl[] = [];
    private generic_array: Port_hdl[] = [];
    private port_array: Port_hdl[] = [];
    private instantiation_array: Instantiation_hdl[] = [];
    private process_array: Process_hdl[] = [];
    private modport_array: Modport_hdl[] = [];
    private logic_array: Logic_hdl[] = [];
    private custom_array: Custom_hdl[] = [];
    private interface_array: Hdl_element[] = [];
    public error_state = false;

    constructor(lang: HDL_LANG, hdl_type: TYPE_HDL_ELEMENT) {
        this.lang = lang;
        this.hdl_type = hdl_type;
    }

    public get_hdl_type() {
        return this.hdl_type;
    }
    public set_hdl_type(hdl_type: TYPE_HDL_ELEMENT) {
        this.hdl_type = hdl_type;
    }

    public get name() {
        return this._name;
    }
    public set name(name: string) {
        this._name = name;
    }

    public get description() {
        return this._description;
    }
    public set description(description: string) {
        this._description = description;
    }

    public add_signal(element: Signal_hdl) {
        this.signal_array.push(element);
    }
    public get_signal_array(): Signal_hdl[] {
        return this.signal_array;
    }

    public add_constant(element: Constant_hdl) {
        this.constant_array.push(element);
    }
    public get_constant_array(): Constant_hdl[] {
        return this.constant_array;
    }

    public add_type(element: Type_hdl) {
        this.type_array.push(element);
    }
    public get_type_array(): Type_hdl[] {
        return this.type_array;
    }

    public add_function(element: Function_hdl) {
        this.function_array.push(element);
    }
    public get_function_array(): Function_hdl[] {
        return this.function_array;
    }

    public add_generic(element: Port_hdl) {
        this.generic_array.push(element);
    }
    public get_generic_array(): Port_hdl[] {
        return this.generic_array;
    }

    public add_port(element: Port_hdl) {
        this.port_array.push(element);
    }
    public get_port_array(): Port_hdl[] {
        return this.port_array;
    }

    public add_instantiation(element: Instantiation_hdl) {
        this.instantiation_array.push(element);
    }
    public get_instantiation_array(): Instantiation_hdl[] {
        return this.instantiation_array;
    }

    public add_process(element: Process_hdl) {
        this.process_array.push(element);
    }
    public get_process_array(): Process_hdl[] {
        return this.process_array;
    }

    public add_modport(element: Modport_hdl) {
        this.modport_array.push(element);
    }
    public get_modport_array(): Modport_hdl[] {
        return this.modport_array;
    }

    public add_logic(element: Logic_hdl) {
        this.logic_array.push(element);
    }
    public get_logic_array(): Logic_hdl[] {
        return this.logic_array;
    }

    public add_custom(element: Custom_hdl) {
        this.custom_array.push(element);
    }
    public get_custom_array(): Custom_hdl[] {
        return this.custom_array;
    }

    public add_interface(element: Hdl_element) {
        this.interface_array.push(element);
    }
    public get_interface_array(): Hdl_element[] {
        return this.interface_array;
    }

    public is_empty(): boolean {
        if (
            this.signal_array.length === 0 &&
            this.constant_array.length === 0 &&
            this.type_array.length === 0 &&
            this.function_array.length === 0 &&
            this.generic_array.length === 0 &&
            this.port_array.length === 0 &&
            this.instantiation_array.length === 0 &&
            this.process_array.length === 0
        ) {
            return true;
        }
        return false;
    }

}


