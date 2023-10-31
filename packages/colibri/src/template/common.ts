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

/** Templates types for VHDL */
export class TEMPLATE_NAME_VHDL {
    static readonly COCOTB = {
        name: "cocotb",
        id: "cocotb",
        description: "cocotb",
        lang: LANGUAGE.PYTHON
    };

    static readonly TESTBENCH_NORMAL = {
        name: "testbench",
        id: "testbench_normal",
        description: "VHDL testbench",
        lang: LANGUAGE.VHDL
    };
    static readonly TESTBENCH_VUNIT = {
        name: "vunit_testbench",
        id: "testbench_vunit",
        description: "VUnit testbench",
        lang: LANGUAGE.VHDL
    };

    static readonly HDL_ELEMENT_COMPONENT = {
        name: "component",
        id: "hdl_element_component",
        description: "Copy as component",
        lang: LANGUAGE.VHDL
    };
    static readonly HDL_ELEMENT_INSTANCE = {
        name: "instance",
        id: "hdl_element_instance",
        description: "Copy as instance",
        lang: LANGUAGE.VHDL
    };
    static readonly HDL_ELEMENT_INSTANCE_NEW = {
        name: "instance new",
        id: "hdl_element_instance_vhdl_new",
        description: "Copy as instance > VHDL 93",
        lang: LANGUAGE.VHDL
    };
    static readonly HDL_ELEMENT_SIGNAL = {
        name: "signal",
        id: "hdl_element_signal",
        description: "Copy as signal",
        lang: LANGUAGE.VHDL
    };

    static readonly HDL_ELEMENT_MIX_INSTANCE = {
        name: "mix_instance",
        id: "hdl_element_mix_instance",
        description: "Copy as Verilog instance",
        lang: LANGUAGE.VERILOG
    };
    static readonly HDL_ELEMENT_MIX_TESTBENCH_NORMAL = {
        name: "mix_testbench",
        id: "hdl_element_mix_testbench_normal",
        description: "Copy as Verilog testbench",
        lang: LANGUAGE.VERILOG
    };
    static readonly HDL_ELEMENT_MIX_TESTBENCH_VUNIT = {
        name: "mix_vunit_testbench",
        id: "hdl_element_mix_testbench_vunit",
        description: "Copy as Verilog VUnit testbench",
        lang: LANGUAGE.VERILOG
    };

    // private to disallow creating other instances of this type
    // private constructor(private readonly key: string, public readonly value: any) {}
}

/** Templates types for Verilog/SV */
export class TEMPLATE_NAME_VERILOG {
    static readonly COCOTB = {
        name: "cocotb",
        id: "cocotb",
        description: "cocotb",
        lang: LANGUAGE.PYTHON
    };
    static readonly TESTBENCH_NORMAL = {
        name: "testbench",
        id: "testbench_normal",
        description: "Verilog testbench",
        lang: LANGUAGE.VERILOG
    };
    static readonly TESTBENCH_VUNIT = {
        name: "vunit_testbench",
        id: "testbench_vunit",
        description: "Vunit testbench",
        lang: LANGUAGE.VERILOG
    };
    static readonly HDL_ELEMENT_INSTANCE = {
        name: "instance",
        id: "hdl_element_instance",
        description: "Copy as instance",
        lang: LANGUAGE.VERILOG
    };
    static readonly HDL_ELEMENT_SIGNAL = {
        name: "signal",
        id: "hdl_element_signal",
        description: "Copy as signal",
        lang: LANGUAGE.VERILOG
    };

    static readonly HDL_ELEMENT_MIX_COMPONENT = {
        name: "mix_component",
        id: "hdl_element_mix_component",
        description: "Copy as VHDL component",
        lang: LANGUAGE.VHDL
    };
    static readonly HDL_ELEMENT_MIX_INSTANCE = {
        name: "mix_instance",
        id: "hdl_element_mix_instance",
        description: "Copy as VHDL instance",
        lang: LANGUAGE.VHDL
    };
    static readonly HDL_ELEMENT_MIX_TESTBENCH_NORMAL = {
        name: "mix_testbench",
        id: "hdl_element_mix_testbench_normal",
        description: "Copy as VHDL testbench",
        lang: LANGUAGE.VHDL
    };
    static readonly HDL_ELEMENT_MIX_TESTBENCH_VUNIT = {
        name: "mix_vunit_testbench",
        id: "hdl_element_mix_testbench_vunit",
        description: "Copy as VHDL VUnit testbench",
        lang: LANGUAGE.VHDL
    };

    // private to disallow creating other instances of this type
    // private constructor(private readonly key: string, public readonly value: any) {}
}

/**
 * Get type of templates for HDL language
 * @param  {HDL_LANG} lang HDL language
 */
export function get_template_names(lang: LANGUAGE) {
    if (lang === LANGUAGE.VHDL) {
        return TEMPLATE_NAME_VHDL;
    }
    else {
        return TEMPLATE_NAME_VERILOG;
    }
}

/**
 * Get templete description and IDs
 * @param  {HDL_LANG} lang HDL language
 */
export function get_template_definition(lang: LANGUAGE) {
    if (lang === LANGUAGE.VHDL) {
        const template_names = TEMPLATE_NAME_VHDL;
        const description_list: string[] = [];
        const id_list: string[] = [];
        const lang_list: LANGUAGE[] = [];
        for (const [_key, value] of Object.entries(template_names)) {
            description_list.push(value.description);
            id_list.push(value.id);
            lang_list.push(value.lang);
        }
        return { description_list: description_list, id_list: id_list, lang_list: lang_list };
    }
    else {
        const template_names = TEMPLATE_NAME_VERILOG;
        const description_list: string[] = [];
        const id_list: string[] = [];
        const lang_list: LANGUAGE[] = [];
        for (const [_key, value] of Object.entries(template_names)) {
            description_list.push(value.description);
            id_list.push(value.id);
            lang_list.push(value.lang);
        }
        return { description_list: description_list, id_list: id_list, lang_list: lang_list };
    }
}