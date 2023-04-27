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
import { HDL_LANG } from "../../src/common/general";
import { equal } from "assert";
import * as common from "../../src/parser/common";

//// Verilog-2001 ANSI-style
const code_hdl = `
package test_pkg;
    parameter a=8;
    parameter b=9;
    parameter c=10;

    function [7:0] sum;  
        input [7:0] a, b;  
        begin  
            sum = a + b;  
        end  
    endfunction

    typedef enum {ADD, SUB} op_list;

    typedef struct {logic [4:0] a, b; logic [9:0] m;} port_t;
endpackage
`;
const parser_common = new Factory();
if (parser_common === undefined) {
    console.log("Error parser.");
}

async function parse() {
    const parser = await parser_common.get_parser(HDL_LANG.VERILOG);
    const result = await parser.get_all(code_hdl, '!');
    return result;
}
describe.skip('Check package Verilog', function () {
    ////////////////////////////////////////////////////////////////////////////////
    // Package
    ////////////////////////////////////////////////////////////////////////////////
    describe('Check package.', function () {
        let result: any;

        beforeEach(async function () {
            result = await parse();
        });
        it(`Check name`, async function () {
            equal(result.name, 'test_pkg');
        });
        it(`Check type is package`, async function () {
            equal(result.get_hdl_type(), common.TYPE_HDL_ELEMENT.PACKAGE);
        });
    });
    ////////////////////////////////////////////////////////////////////////////////
    // Constant
    ////////////////////////////////////////////////////////////////////////////////
    function check_constant(actual: common.Constant_hdl, expected: common.Constant_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.type, expected.type);
        equal(actual.default_value, expected.default_value);
    }

    describe('Check constant.', function () {
        let result: any;
        let element_array: any;

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_constant_array();
        });
        it(`Check simple`, function () {
            const actual = element_array[0];
            const expected: common.Constant_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.CONSTANT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "a",
                    description: ""
                },
                type: "",
                default_value: "8"
            };
            check_constant(actual, expected);
        });
        it(`Check simple`, function () {
            const actual = element_array[1];
            const expected: common.Constant_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.CONSTANT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "b",
                    description: ""
                },
                type: "",
                default_value: "9"
            };
            check_constant(actual, expected);
        });
        it(`Check simple`, function () {
            const actual = element_array[2];
            const expected: common.Constant_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.CONSTANT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "c",
                    description: ""
                },
                type: "",
                default_value: "10"
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
    }

    describe('Check function.', function () {
        let result: any;
        let element_array: any;

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
    // Type
    ////////////////////////////////////////////////////////////////////////////////
    function check_type(actual: common.Type_hdl, expected: common.Type_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.type, expected.type);
    }

    describe('Check type.', function () {
        let result: any;
        let element_array: any;

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_type_array();
        });
        it(`Check simple`, function () {
            const actual = element_array[0];
            const expected: common.Type_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.TYPE,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "op_list",
                    description: ""
                },
                type: "enum {ADD, SUB}",
                logic: []
            };
            check_type(actual, expected);
        });
        it(`Check simple`, function () {
            const actual = element_array[1];
            const expected: common.Type_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.TYPE,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "port_t",
                    description: ""
                },
                type: "struct {logic [4:0] a, b; logic [9:0] m;}",
                logic: []
            };
            check_type(actual, expected);
        });
    });
});
