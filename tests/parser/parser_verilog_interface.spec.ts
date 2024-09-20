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

import { Factory } from "../../src/colibri/parser/factory";
import { LANGUAGE } from "../../src/colibri/common/general";
import { equal } from "assert";
import * as common from "../../src/colibri/parser/common";
import * as utils_test from "./utils_test";

const code_hdl = `
\`ifndef SMC_IF 
  \`define SMC_IF
  \`include "slot_mem.svh"

import commonTypes_pkg::*;

typedef struct packed
{
  logic l_0;      
  logic l_1;     
} slot_t;  

interface interface_0 #(
    parameter PARAMETER_0 = 15   
);
  ep_lookup_t              ep_lookup;
  logic                    logic_0;
  logic [PARAMETER_0-1:0] logic_1;

  modport mod_port_0(
    input input_0,
    output output_0
  );
  
   modport mod_port_1(
    input input_0,
    output output_0
  );
endinterface  

interface interface_1 #(
    parameter PARAMETER_0 = 15   
);
  ep_lookup_t              ep_lookup;
  logic                    logic_0;
  logic [PARAMETER_0-1:0] logic_1;

  modport mod_port_0(
    input input_0,
    output output_0
  );
  
   modport mod_port_1(
    input input_0,
    output output_0
  );
endinterface  

\`endif
`;
const parser_common = new Factory();
if (parser_common === undefined) {
    console.log("Error parser.");
}

async function parse() {
    const parser = await parser_common.get_parser(LANGUAGE.VERILOG);
    const result = await parser.get_all(code_hdl, '!');
    return result;
}

//Interface parameter
const parameter_item: common.Port_hdl = {
    hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "PARAMETER_0",
        description: ''
    },
    type: "",
    subtype: "",
    direction: "",
    over_comment: "",
    inline_comment: "",
    default_value: "15",
};
//Interface logic
const logic_item_0: common.Logic_hdl = {
    hdl_element_type: common.TYPE_HDL_ELEMENT.LOGIC,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "logic_0",
        description: ""
    },
    type: "logic"
};
const logic_item_1: common.Logic_hdl = {
    hdl_element_type: common.TYPE_HDL_ELEMENT.LOGIC,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "logic_1",
        description: ""
    },
    type: "logic [PARAMETER_0-1:0]"
};
//Interface custom
const custom_item: common.Custom_hdl = {
    hdl_element_type: common.TYPE_HDL_ELEMENT.CUSTOM,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "ep_lookup",
        description: ""
    },
    type: "ep_lookup_t"
};
//Interface modport
const port_item_0: common.Port_hdl = {
    hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "input_0",
        description: ""
    },
    type: "",
    subtype: "",
    direction: "input",
    over_comment: "",
    inline_comment: "",
    default_value: ""
};
const port_item_1: common.Port_hdl = {
    hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "output_0",
        description: ""
    },
    type: "",
    subtype: "",
    direction: "output",
    default_value: "",
    over_comment: "",
    inline_comment: ""
};
const port_array = [port_item_0, port_item_1];

const modport_item_0: common.Modport_hdl = {
    hdl_element_type: common.TYPE_HDL_ELEMENT.MODPORT,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "mod_port_0",
        description: ""
    },
    ports: port_array
};
const modport_item_1: common.Modport_hdl = {
    hdl_element_type: common.TYPE_HDL_ELEMENT.MODPORT,
    info: {
        position: {
            line: 0,
            column: 0
        },
        name: "mod_port_1",
        description: ""
    },
    ports: port_array
};


describe('Check interface declaration Verilog', function () {
    ////////////////////////////////////////////////////////////////////////////////
    // Interface info
    ////////////////////////////////////////////////////////////////////////////////
    describe('Check global.', function () {
        let result: common.Hdl_element;

        beforeEach(async function () {
            result = await parse();
        });
        it(`Check name`, async function () {
            equal(result.name, '');
        });
        it(`Check type is interface declaration`, async function () {
            equal(result.get_hdl_type(), common.TYPE_HDL_ELEMENT.INTERFACE_DECLARATION);
        });
    });
    ////////////////////////////////////////////////////////////////////////////////
    // Interface
    ////////////////////////////////////////////////////////////////////////////////
    function check_interface(actual: common.Hdl_element, name_expected: string) {
        equal(actual.name, name_expected);
        // Generic
        const generic_array = actual.get_generic_array();
        utils_test.check_generic(generic_array[0], parameter_item);
        // Logic
        const logic_array = actual.get_logic_array();
        utils_test.check_logic(logic_array[0], logic_item_0);
        utils_test.check_logic(logic_array[1], logic_item_1);
        // Custom
        const custom_array = actual.get_custom_array();
        utils_test.check_custom(custom_array[0], custom_item);
        // Modport
        const modport_array = actual.get_modport_array();
        utils_test.check_modport(modport_array[0], modport_item_0);
        utils_test.check_modport(modport_array[1], modport_item_1);
    }

    describe('Check interfaces.', function () {
        let result: common.Hdl_element;
        let element_array: common.Hdl_element[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_interface_array();
        });

        it(`Check interface 0`, function () {
            check_interface(element_array[0], "interface_0");
        });

        it(`Check interface 1`, function () {
            check_interface(element_array[1], "interface_1");
        });
    });

    ////////////////////////////////////////////////////////////////////////////////
    // Type
    ////////////////////////////////////////////////////////////////////////////////
    function check_type(actual: common.Type_hdl, expected: common.Type_hdl) {
        equal(actual.info.name, expected.info.name);

        for (let i = 0; i < actual.logic.length; i++) {
            equal(actual.logic[i].info.name, expected.logic[i].info.name);
            equal(actual.logic[i].type, expected.logic[i].type);
        }
    }

    describe('Check type.', function () {
        let result: common.Hdl_element;
        let element_array: common.Type_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_type_array();
        });
        it(`Check simple`, function () {
            const actual = element_array[0];

            const logic_item_0: common.Logic_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.LOGIC,
                info: {
                    position: {
                        line: 9,
                        column: 0
                    },
                    name: "l_0",
                    description: ""
                },
                type: "logic"
            };
            const logic_item_1: common.Logic_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.LOGIC,
                info: {
                    position: {
                        line: 10,
                        column: 0
                    },
                    name: "l_1",
                    description: ""
                },
                type: "logic"
            };

            const expected: common.Type_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.TYPE,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "slot_t",
                    description: ""
                },
                inline_comment: "",
                is_record : false,
                is_enum : false,
                record_elements: [],
                enum_elements: [],
                type: "",
                logic: [logic_item_0, logic_item_1]
            };
            check_type(actual, expected);
        });
    });
});