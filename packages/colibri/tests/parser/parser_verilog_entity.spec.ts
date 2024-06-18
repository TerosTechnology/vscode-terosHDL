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

import { Factory } from "../../src/parser/factory";
import { LANGUAGE } from "../../src/common/general";
import { equal } from "assert";
import * as common from "../../src/parser/common";

//// Verilog-2001 ANSI-style
const code_hdl = `
//! mymodule design
module test_entity_name 
    #(
        parameter a=8,
        parameter b=9,
        parameter c=10, d=11
    )
    (
        input e,
        output f,
        input reg g,
        input wire h,
        input reg [7:0] i, j,
        input wire [9:0] k,
        output wire [9:0] l
    );  

    function [7:0] sum;  
        input [7:0] a, b;  
        begin  
            sum = a + b;  
        end  
    endfunction

    wire m;
    wire n, p;
    reg [$clog2(clk_freq_hz)] q;

    //! Description localparam 0
    localparam r = 2;

    localparam r_0 = 5; //! Description localparam 1

    always @(posedge a) begin : label_0
    end

    always_comb begin
    end

    always_ff begin : label_1
    end

    always_latch begin
    end

    //! Instantiation description
    test_entity_name_0
    #(
      .a(a ),
      .b(b ),
      .c(c ),
      .d (d )
    )
    test_entity_name_dut_0 (
      .e (e ),
      .f (f ),
      .g (g ),
      .h (h ),
      .i (i ),
      .j (j ),
      .k (k ),
      .l  ( l)
    );

    test_entity_name_1
    test_entity_name_dut_1 (
      .e (e ),
      .f (f ),
      .g (g ),
      .h (h ),
      .i (i ),
      .j (j ),
      .k (k ),
      .l  ( l)
    );

    test_entity_name_2
    #(
      .a(a ),
      .b(b ),
      .c(c ),
      .d (d )
    )
    test_entity_name_dut_2();
  
endmodule
`;
const parser_common = new Factory();

async function parse() {
    const parser = await parser_common.get_parser(LANGUAGE.VERILOG);
    const result = await parser.get_all(code_hdl, '!');
    return result;
}
describe('Check entity Verilog', function () {
    ////////////////////////////////////////////////////////////////////////////////
    // Entity
    ////////////////////////////////////////////////////////////////////////////////
    describe('Check entity.', function () {
        let result: common.Hdl_element;

        beforeEach(async function () {
            result = await parse();
        });
        it(`Check name`, async function () {
            equal(result.name, 'test_entity_name');
        });
        it(`Check type is entity`, async function () {
            equal(result.get_hdl_type(), common.TYPE_HDL_ELEMENT.ENTITY);
        });
    });
    ////////////////////////////////////////////////////////////////////////////////
    // Generic
    ////////////////////////////////////////////////////////////////////////////////
    function check_generic(actual: common.Port_hdl, expected: common.Port_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.direction, expected.direction);
        equal(actual.type, expected.type);
        equal(actual.info.description, expected.info.description);
        // equal(actual.default_value, expected.default_value);
    }

    describe('Check generic.', function () {
        let result: common.Hdl_element;
        let element_array: common.Port_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_generic_array();
        });
        it(`Check simple`, function () {
            const actual = element_array[0];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "a",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "",
                default_value: "8",
                type: "",
                subtype: ""
            };
            check_generic(actual, expected);
        });
        it(`Check with default value`, function () {
            const actual = element_array[1];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "b",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "",
                default_value: "9",
                type: "",
                subtype: ""
            };
            check_generic(actual, expected);
        });
        it(`Check multiple declarations and default value in one line 0`, function () {
            const actual = element_array[2];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "c",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "",
                default_value: "10",
                type: "",
                subtype: ""
            };
            check_generic(actual, expected);
        });
        it(`Check multiple declarations and default value in one line 1`, function () {
            const actual = element_array[3];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "d",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "",
                default_value: "11",
                type: "",
                subtype: ""
            };
            check_generic(actual, expected);
        });
    });

    ////////////////////////////////////////////////////////////////////////////////
    // Port
    ////////////////////////////////////////////////////////////////////////////////
    function check_port(actual: common.Port_hdl, expected: common.Port_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.direction, expected.direction);
        equal(actual.type, expected.type);
        equal(actual.default_value, expected.default_value);
        equal(actual.info.description, expected.info.description);
    }

    describe('Check port.', function () {
        let result: common.Hdl_element;
        let element_array: common.Port_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_port_array();
        });
        it(`Check input port`, function () {
            const actual = element_array[0];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "e",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "input",
                default_value: "",
                type: "",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check output port`, function () {
            const actual = element_array[1];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "f",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "output",
                default_value: "",
                type: "",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check input reg port`, function () {
            const actual = element_array[2];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "g",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "input",
                default_value: "",
                type: "",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check input wire port`, function () {
            const actual = element_array[3];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "h",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "input",
                default_value: "",
                type: "wire",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check input multiple reg array 0`, function () {
            const actual = element_array[4];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "i",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "input",
                default_value: "",
                type: "[7:0]",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it.skip(`Check input multiple reg array 1`, function () {
            const actual = element_array[5];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "j",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "input",
                default_value: "",
                type: "[7:0]",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check input wire array`, function () {
            const actual = element_array[6];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "k",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "input",
                default_value: "",
                type: "wire [9:0]",
                subtype: ""
            };
            check_port(actual, expected);
        });

        it(`Check output wire array`, function () {
            const actual = element_array[7];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "l",
                    description: ""
                },
                inline_comment: "",
                over_comment: "",
                direction: "output",
                default_value: "",
                type: "wire [9:0]",
                subtype: ""
            };
            check_port(actual, expected);
        });
    });

    ////////////////////////////////////////////////////////////////////////////////
    // Signal
    ////////////////////////////////////////////////////////////////////////////////
    function check_signal(actual: common.Signal_hdl, expected: common.Signal_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.type, expected.type);
        equal(actual.info.description, expected.info.description);
        // equal(actual.default_value, expected.default_value);
    }

    describe('Check signal.', function () {
        let result: common.Hdl_element;
        let element_array: common.Signal_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_signal_array();
        });
        it(`Check simple`, function () {
            const actual = element_array[0];
            const expected: common.Signal_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.SIGNAL,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "m",
                    description: ""
                },
                type: "wire"
            };
            check_signal(actual, expected);
        });
        it(`Check multimple declaration in one line 0`, function () {
            const actual = element_array[1];
            const expected: common.Signal_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.SIGNAL,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "n",
                    description: ""
                },
                type: "wire"
            };
            check_signal(actual, expected);
        });
        it(`Check multimple declaration in one line 1`, function () {
            const actual = element_array[2];
            const expected: common.Signal_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.SIGNAL,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "p",
                    description: ""
                },
                type: "wire"
            };
            check_signal(actual, expected);
        });
        it(`Check array`, function () {
            const actual = element_array[3];
            const expected: common.Signal_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.SIGNAL,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "q",
                    description: ""
                },
                type: "reg [clog2(clk_freq_hz)]"
            };
            check_signal(actual, expected);
        });
    });
    ////////////////////////////////////////////////////////////////////////////////
    // Constant
    ////////////////////////////////////////////////////////////////////////////////
    function check_constant(actual: common.Constant_hdl, expected: common.Constant_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.type, expected.type);
        equal(actual.default_value, expected.default_value);
        equal(actual.info.description.trim(), expected.info.description.trim());
    }

    describe('Check constant.', function () {
        let result: common.Hdl_element;
        let element_array: common.Constant_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_constant_array();
        });
        it(`Check simple 0`, function () {
            const actual = element_array[0];
            const expected: common.Constant_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.CONSTANT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "r",
                    description: "Description localparam 0"
                },
                type: "",
                default_value: "2"
            };
            check_constant(actual, expected);
        });
        it(`Check simple 1`, function () {
            const actual = element_array[1];
            const expected: common.Constant_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.CONSTANT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "r_0",
                    description: "Description localparam 1"
                },
                type: "",
                default_value: "5"
            };
            check_constant(actual, expected);
        });
    });

    ////////////////////////////////////////////////////////////////////////////////
    // Function
    ////////////////////////////////////////////////////////////////////////////////
    function check_function(actual: common.Function_hdl, expected: common.Function_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.type, expected.type);
        equal(actual.arguments, expected.arguments);
        equal(actual.return, expected.return);
        equal(actual.info.description, expected.info.description);
    }

    describe('Check function.', function () {
        let result: common.Hdl_element;
        let element_array: common.Function_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_function_array();
        });
        it(`Check with arguments and return`, function () {
            const actual = element_array[0];
            const expected: common.Function_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.FUNCTION,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "sum",
                    description: ""
                },
                type: "",
                arguments: "(input [7:0] a, b;)",
                return: "return ([7:0])"
            };
            check_function(actual, expected);
        });
    });
    ////////////////////////////////////////////////////////////////////////////////
    // Process
    ////////////////////////////////////////////////////////////////////////////////
    function check_process(actual: common.Process_hdl, expected: common.Process_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.sens_list, expected.sens_list);
        equal(actual.info.description, expected.info.description);
    }

    describe('Check always.', function () {
        let result: common.Hdl_element;
        let element_array: common.Process_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_process_array();
        });
        it(`Check always with sensitive list and label`, function () {
            const actual = element_array[0];
            const expected: common.Process_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PROCESS,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "label_0",
                    description: ""
                },
                sens_list: "@(posedge a)",
                type: "always"
            };
            check_process(actual, expected);
        });
        it(`Check always_comb without sensitive list and label`, function () {
            const actual = element_array[1];
            const expected: common.Process_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PROCESS,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "unnamed",
                    description: ""
                },
                sens_list: "",
                type: "always_comb"
            };
            check_process(actual, expected);
        });
        it(`Check always_ff without sensitive list and with label`, function () {
            const actual = element_array[2];
            const expected: common.Process_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PROCESS,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "label_1",
                    description: ""
                },
                sens_list: "",
                type: "always_ff"
            };
            check_process(actual, expected);
        });
        it(`Check always_latch without sensitive list and label`, function () {
            const actual = element_array[3];
            const expected: common.Process_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PROCESS,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "unnamed",
                    description: ""
                },
                sens_list: "",
                type: "always_latch"
            };
            check_process(actual, expected);
        });
    });
    ////////////////////////////////////////////////////////////////////////////////
    // Instantiation
    ////////////////////////////////////////////////////////////////////////////////
    function check_instantiation(actual: common.Instantiation_hdl, expected: common.Instantiation_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.type, expected.type);
        equal(actual.info.description.trim(), expected.info.description.trim());
    }

    describe('Check instantiation.', function () {
        let result: common.Hdl_element;
        let element_array: common.Instantiation_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_instantiation_array();
        });
        it(`Check with generics and ports`, function () {
            const actual = element_array[0];
            const expected: common.Instantiation_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.INSTANTIATION,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "test_entity_name_dut_0",
                    description: " Instantiation description"
                },
                type: "test_entity_name_0"
            };
            check_instantiation(actual, expected);
        });

        it(`Check with ports`, function () {
            const actual = element_array[1];
            const expected: common.Instantiation_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.INSTANTIATION,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "test_entity_name_dut_1",
                    description: ""
                },
                type: "test_entity_name_1"
            };
            check_instantiation(actual, expected);
        });

        it(`Check with generics`, function () {
            const actual = element_array[2];
            const expected: common.Instantiation_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.INSTANTIATION,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "test_entity_name_dut_2",
                    description: ""
                },
                type: "test_entity_name_2"
            };
            check_instantiation(actual, expected);
        });

    });
});
