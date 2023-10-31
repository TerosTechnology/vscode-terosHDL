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

import { LANGUAGE } from "../../common/general";
import * as template_definition_general from "./template_definition";
import * as template_definition_verilog from "./template_definition_verilog";
import * as template_definition_vhdl from "./template_definition_vhdl";
import * as nunjucks from 'nunjucks';

export function get_template(language: LANGUAGE, template_name: string, template_options: any,
    header: string, clock_style: string) {

    nunjucks.configure({ autoescape: false });

    // Special charactrs
    template_options["special_char_0"] = ">";
    template_options["special_char_1"] = " ";
    template_options["special_char_2"] = "\n";

    //Global
    template_options["header"] = nunjucks.renderString(template_definition_general.header, { "header": header });

    let base_temp = undefined;
    let reverse_base_temp = undefined;
    let options = undefined;
    let reverse_options = undefined;

    // VHDL options
    const vhdl_options = {...template_options};
    vhdl_options["clock"] = nunjucks.renderString(template_definition_vhdl.clock,
        { "clock_style": clock_style });
    vhdl_options["component"] = nunjucks.renderString(template_definition_vhdl.hdl_element_component,
        template_options);
    vhdl_options["instance"] = nunjucks.renderString(template_definition_vhdl.hdl_element_instance_vhdl_new,
        template_options);

    // Verilog/SV options
    const verilog_options = {...template_options};
    verilog_options["clock"] = nunjucks.renderString(template_definition_verilog.clock,
        { "clock_style": clock_style });
        verilog_options["instance"] = nunjucks.renderString(template_definition_verilog.hdl_element_instance,
        template_options);


    if (language === LANGUAGE.VHDL) {
        base_temp = template_definition_vhdl;
        reverse_base_temp = template_definition_verilog;

        options = vhdl_options;
        reverse_options = verilog_options;
    }
    else {
        base_temp = template_definition_verilog;
        reverse_base_temp = template_definition_vhdl;

        options = verilog_options;
        reverse_options = vhdl_options;
    }

    let template_str = "";
    if (template_name === "cocotb") {
        template_str = template_definition_general.cocotb;
    }
    else {
        if (template_name === "hdl_element_instance") {
            template_str = base_temp.hdl_element_instance;
        }
        else if (template_name === "hdl_element_signal") {
            template_str = base_temp.hdl_element_signal;
        }
        else if (template_name === "hdl_element_component") {
            template_str = base_temp.hdl_element_component;
        }
        else if (template_name === "testbench_normal") {
            template_str = base_temp.testbench_normal;
        }
        else if (template_name === "testbench_vunit") {
            template_str = base_temp.testbench_vunit;
        }
        else if (template_name === "hdl_element_instance_vhdl_new") {
            template_str = base_temp.hdl_element_instance_vhdl_new;
        }

        // Mix language
        else if (template_name === "hdl_element_mix_component") {
            template_str = reverse_base_temp.hdl_element_component;
            options = reverse_options;
        }
        else if (template_name === "hdl_element_mix_instance") {
            template_str = reverse_base_temp.hdl_element_instance;
            options = reverse_options;
        }
        else if (template_name === "hdl_element_mix_testbench_normal") {
            template_str = reverse_base_temp.testbench_normal;
            options = reverse_options;
        }
        else if (template_name === "hdl_element_mix_testbench_vunit") {
            template_str = reverse_base_temp.testbench_vunit;
            options = reverse_options;
        }


    }

    const result = nunjucks.renderString(template_str, options);
    return result;
}