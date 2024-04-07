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

import * as fs from 'fs';
import * as paht_lib from 'path';
import * as common_hdl from "../../src/parser/common";
import * as common_documenter from "../../src/documenter/common";
import * as section_creator from "../../src/documenter/section_creator";
import { LANGUAGE } from "../../src/common/general";
import { equal } from "assert";
import { normalize_breakline_windows } from "../../src/utils/common_utils";
import { t_documenter_options } from "../../src/config/auxiliar_config";
import * as cfg from "../../src/config/config_declaration";

const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, 'section_creator', 'out');
fs.mkdirSync(C_OUTPUT_BASE_PATH, { recursive: true });

const creator = new section_creator.Creator();
const hdl_element = create_hdl_element();
const output_types = [common_documenter.doc_output_type.HTML, common_documenter.doc_output_type.MARKDOWN];
const input_name = 'input_path';

output_types.forEach(output_type_inst => {
    describe(`Check sections creator with ${output_type_inst}`, function () {
        const configuration: t_documenter_options = {
            generic_visibility: cfg.e_documentation_general_generics.all,
            port_visibility: cfg.e_documentation_general_ports.all,
            signal_visibility: cfg.e_documentation_general_signals.all,
            constant_visibility: cfg.e_documentation_general_constants.all,
            type_visibility: cfg.e_documentation_general_types.all,
            task_visibility: cfg.e_documentation_general_tasks.all,
            function_visibility: cfg.e_documentation_general_functions.all,
            instantiation_visibility: cfg.e_documentation_general_instantiations.all,
            process_visibility: cfg.e_documentation_general_process.all,
            language: cfg.e_documentation_general_language.english,
            vhdl_symbol: '!',
            verilog_symbol: '!',
            enable_fsm: true
        };

        it(`Title section`, function () {
            const section_name = "title";
            const section = creator.get_title_section(hdl_element, configuration, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it(`Input section`, function () {
            const section_name = "input";
            const file_path = "/example/of/sample.vhd";
            const section = creator.get_input_section(file_path, configuration, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it.skip(`Info section`, function () {
            const section_name = "info";
            const section = creator.get_info_section(hdl_element, configuration, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it.skip(`Diagram section`, function () {
            const section_name = "diagram";
            const svg_path = paht_lib.join(C_OUTPUT_BASE_PATH, 'input_path.svg');
            const section = creator.get_diagram_section(hdl_element, configuration, svg_path, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, true);
        });

        it(`Custom begin section`, function () {
            const section_name = "custom_section_begin";
            const input_path = paht_lib.join(__dirname, 'section_creator', 'helpers', 'input_path.vhd');
            const section = creator.get_custom_section('custom_section_begin', hdl_element, input_path,
                output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it(`Custom end section`, function () {
            const section_name = "custom_section_end";
            const input_path = paht_lib.join(__dirname, 'section_creator', 'helpers', 'input_path.vhd');
            const section = creator.get_custom_section('custom_section_end', hdl_element, input_path, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it.skip(`Description section`, function () {
            // if (output_type_inst === common_documenter.doc_output_type.MARKDOWN) {
            //     this.skip();
            // }
            const section_name = "description";
            const section = creator.get_description_section(hdl_element, configuration,
                C_OUTPUT_BASE_PATH, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it(`Port section`, function () {
            const section_name = "port";
            const section = creator.get_in_out_section(hdl_element, configuration, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it(`Signal-constant section`, function () {
            const section_name = "signal_constant";
            const section = creator.get_signal_constant_section(hdl_element, configuration, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it(`Process section`, function () {
            const section_name = "process";
            const section = creator.get_process_section(hdl_element, configuration, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it(`Function section`, function () {
            const section_name = "function";
            const section = creator.get_function_section(hdl_element, configuration, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });

        it(`Instantiation section`, function () {
            const section_name = "instantiation";
            const section = creator.get_instantiation_section(hdl_element, configuration, output_type_inst);
            save_output(section, section_name, output_type_inst);
            check(section_name, output_type_inst, false);
        });
    });
});

function check(section_name: string, extension: string, check_svg: boolean) {
    let exp_path = paht_lib.join(__dirname, 'section_creator', 'expected', `${section_name}.${extension}`);
    let actual_path = paht_lib.join(__dirname, 'section_creator', 'out', `${section_name}.${extension}`);

    let expected = normalize_breakline_windows(fs.readFileSync(exp_path).toString('utf8'));
    let actual = normalize_breakline_windows(fs.readFileSync(actual_path).toString('utf8'));

    // let check = expected.equals(actual);
    equal(expected, actual);

    if (check_svg === true) {
        exp_path = paht_lib.join(__dirname, 'section_creator', 'expected', `${input_name}.svg`);
        actual_path = paht_lib.join(__dirname, 'section_creator', 'out', `${input_name}.svg`);

        expected = fs.readFileSync(exp_path).toString();
        actual = fs.readFileSync(actual_path).toString();

        // check = expected.equals(actual);
        equal(expected, actual);

        equal(true, check);
    }
}

function save_output(section: string, section_name: string, extension: string) {
    const output_path = paht_lib.join(__dirname, 'section_creator', 'out', `${section_name}.${extension}`);
    fs.writeFileSync(output_path, section);
}

function create_hdl_element(): common_hdl.Hdl_element {
    const C_AUX_BASE_PATH = paht_lib.join(__dirname, 'section_creator', 'helpers');
    const custom_section_begin = paht_lib.join(C_AUX_BASE_PATH, 'begin.txt');
    const custom_section_end = paht_lib.join(C_AUX_BASE_PATH, 'end.txt');

    const hdl_element = new common_hdl.Hdl_element(LANGUAGE.VHDL, common_hdl.TYPE_HDL_ELEMENT.ENTITY);
    hdl_element.name = "EntityExample";
    hdl_element.description = `Description of **HDL element**
@author Carlos Alberto

@version 1.0.0

@custom_section_begin ${custom_section_begin}

@custom_section_end ${custom_section_end}


{ signal: [
    { name: "pclk", wave: 'p.......' },
    { name: "Pclk", wave: 'P.......' },
    { name: "nclk", wave: 'n.......' },
    { name: "Nclk", wave: 'N.......' },
    {},
    { name: 'clk0', wave: 'phnlPHNL' },
    { name: 'clk1', wave: 'xhlhLHl.' },
    { name: 'clk2', wave: 'hpHplnLn' },
    { name: 'clk3', wave: 'nhNhplPl' },
    { name: 'clk4', wave: 'xlh.L.Hx' },
]}

`;
    ////////////////////////////////////////////////////////////////////////////
    // Port
    ////////////////////////////////////////////////////////////////////////////
    const port_0: common_hdl.Port_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "input_0",
            description: "Description **sample**"
        },
        direction: "input",
        default_value: "8",
        type: "std_logic_vector(1 downto 0)",
        subtype: "",
        over_comment: '',
        inline_comment: ''
    };
    hdl_element.add_port(port_0);

    const port_1: common_hdl.Port_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "output_0",
            description: "Description **sample** 1"
        },
        direction: "output",
        default_value: "11",
        type: "std_logic_vector(22 downto 0)",
        subtype: "",
        over_comment: '',
        inline_comment: ''
    };
    hdl_element.add_port(port_1);
    ////////////////////////////////////////////////////////////////////////////
    // Generic
    ////////////////////////////////////////////////////////////////////////////
    const generic_0: common_hdl.Port_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "generic_0",
            description: "Description **sample** 2"
        },
        direction: "",
        default_value: "8",
        type: "integer",
        subtype: "",
        over_comment: '',
        inline_comment: ''
    };
    hdl_element.add_generic(generic_0);

    const generic_1: common_hdl.Port_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "generic_1",
            description: "Description **sample** 3"
        },
        direction: "",
        default_value: "8",
        type: "std_logic",
        subtype: "",
        over_comment: '',
        inline_comment: ''
    };
    hdl_element.add_generic(generic_1);
    ////////////////////////////////////////////////////////////////////////////
    // Signal
    ////////////////////////////////////////////////////////////////////////////
    const signal_0: common_hdl.Signal_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.SIGNAL,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "m",
            description: "Description **sample** 4"
        },
        type: "integer"
    };
    hdl_element.add_signal(signal_0);
    ////////////////////////////////////////////////////////////////////////////
    // Process
    ////////////////////////////////////////////////////////////////////////////
    const process_0: common_hdl.Process_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PROCESS,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "label_0",
            description: "Description **sample** 5"
        },
        sens_list: "@(posedge a)",
        type: "always"
    };
    hdl_element.add_process(process_0);
    ////////////////////////////////////////////////////////////////////////////
    // Constant
    ////////////////////////////////////////////////////////////////////////////
    const constant_0: common_hdl.Constant_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.CONSTANT,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "r",
            description: "Description **sample** 6"
        },
        type: "integer",
        default_value: "2"
    };
    hdl_element.add_constant(constant_0);
    ////////////////////////////////////////////////////////////////////////////
    // Type
    ////////////////////////////////////////////////////////////////////////////
    const type_enum_0: common_hdl.Enum_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.ENUM,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "INIT",
            description: "Description INIT"
        },
        type: "",
        inline_comment: "string"
    };

    const type_enum_1: common_hdl.Enum_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.ENUM,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "END",
            description: "Description END"
        },
        type: "",
        inline_comment: "string"
    };

    const type_0: common_hdl.Type_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.TYPE,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "state_0",
            description: "Description **sample** 7"
        },
        type: "(INIT, END)",
        inline_comment: "Description **sample** 7",
        is_record: false,
        is_enum: false,
        record_elements: [],
        enum_elements: [type_enum_0, type_enum_1],
        logic: []
    };
    hdl_element.add_type(type_0);
    ////////////////////////////////////////////////////////////////////////////
    // Function
    ////////////////////////////////////////////////////////////////////////////
    const function_0: common_hdl.Function_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.FUNCTION,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "sum",
            description: "Description **sample** 8"
        },
        type: "",
        arguments: "(input [7:0] a, b;)",
        return: "return ([7:0])"
    };
    hdl_element.add_function(function_0);
    ////////////////////////////////////////////////////////////////////////////
    // Instantiation
    ////////////////////////////////////////////////////////////////////////////
    const instantiation_0: common_hdl.Instantiation_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.INSTANTIATION,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "test_entity_name_dut",
            description: "Description **sample** 9"
        },
        type: "test_entity_name"
    };
    hdl_element.add_instantiation(instantiation_0);

    return hdl_element;
}


