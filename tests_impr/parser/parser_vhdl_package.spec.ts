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
import { Constant_hdl, Function_hdl, Signal_hdl, Type_hdl, TYPE_HDL_ELEMENT } from "../../src/parser/common";

const code_hdl = `
package test_package_name is
  signal a : integer;
  signal b,c : std_logic_vector(1 downto 0);

  constant d : integer := 8;
  constant e,f : integer := 0;

  type state_0 is (INIT, ENDS);
  procedure counter(signal minutes: in integer; signal seconds: out integer;);
end package test_package_name;
 
package body test_package_name is
end package body test_package_name;
`;
const parser_common = new Factory();
if (parser_common === undefined) {
    console.log("Error parser.");
}

async function parse() {
    const parser = await parser_common.get_parser(HDL_LANG.VHDL);
    const result = await parser.get_all(code_hdl, '!');
    return result;
}
describe.skip('Check package VHDL', function () {
    ////////////////////////////////////////////////////////////////////////////////
    // Package
    ////////////////////////////////////////////////////////////////////////////////
    describe('Check pacakge.', function () {
        let result: any;

        beforeEach(async function () {
            result = await parse();
        });
        it(`Check name`, async function () {
            equal(result.name, 'test_package_name');
        });
        it(`Check type is entity`, async function () {
            equal(result.get_hdl_type(), TYPE_HDL_ELEMENT.PACKAGE);
        });
    });
    ////////////////////////////////////////////////////////////////////////////////
    // Signal
    ////////////////////////////////////////////////////////////////////////////////
    function check_signal(actual: Signal_hdl, expected: Signal_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.type, expected.type);
        // equal(actual.default_value, expected.default_value);
    }

    describe('Check signal.', function () {
        let result: any;
        let element_array: any;

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_signal_array();
        });
        it(`Check simple`, function () {
            const actual = element_array[0];
            const expected: Signal_hdl = {
                hdl_element_type: TYPE_HDL_ELEMENT.SIGNAL,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "a",
                    description: ""
                },
                type: "integer"
            };
            check_signal(actual, expected);
        });
        it(`Check multimple declaration in one line 0`, function () {
            const actual = element_array[1];
            const expected: Signal_hdl = {
                hdl_element_type: TYPE_HDL_ELEMENT.SIGNAL,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "b",
                    description: ""
                },
                type: "std_logic_vector(1 downto 0)"
            };
            check_signal(actual, expected);
        });
        it(`Check multimple declaration in one line 1`, function () {
            const actual = element_array[2];
            const expected: Signal_hdl = {
                hdl_element_type: TYPE_HDL_ELEMENT.SIGNAL,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "c",
                    description: ""
                },
                type: "std_logic_vector(1 downto 0)"
            };
            check_signal(actual, expected);
        });
    });
    ////////////////////////////////////////////////////////////////////////////////
    // Constant
    ////////////////////////////////////////////////////////////////////////////////
    function check_constant(actual: Constant_hdl, expected: Constant_hdl) {
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
            const expected: Constant_hdl = {
                hdl_element_type: TYPE_HDL_ELEMENT.CONSTANT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "d",
                    description: ""
                },
                type: "integer",
                default_value: "8"
            };
            check_constant(actual, expected);
        });
        it(`Check multimple declaration in one line 0`, function () {
            const actual = element_array[1];
            const expected: Constant_hdl = {
                hdl_element_type: TYPE_HDL_ELEMENT.CONSTANT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "e",
                    description: ""
                },
                type: "integer",
                default_value: "0"
            };
            check_constant(actual, expected);
        });
        it(`Check multimple declaration in one line 1`, function () {
            const actual = element_array[2];
            const expected: Constant_hdl = {
                hdl_element_type: TYPE_HDL_ELEMENT.CONSTANT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "f",
                    description: ""
                },
                type: "integer",
                default_value: "0"
            };
            check_constant(actual, expected);
        });
    });
    ////////////////////////////////////////////////////////////////////////////////
    // Type
    ////////////////////////////////////////////////////////////////////////////////
    function check_type(actual: Type_hdl, expected: Type_hdl) {
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
            const expected: Type_hdl = {
                hdl_element_type: TYPE_HDL_ELEMENT.TYPE,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "state_0",
                    description: ""
                },
                type: "(INIT, ENDS)",
                logic: []
            };
            check_type(actual, expected);
        });
    });

    ////////////////////////////////////////////////////////////////////////////////
    // Function
    ////////////////////////////////////////////////////////////////////////////////
    function check_function(actual: Function_hdl, expected: Function_hdl) {
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
            const expected: Function_hdl = {
                hdl_element_type: TYPE_HDL_ELEMENT.FUNCTION,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "counter",
                    description: ""
                },
                type: "",
                arguments: "(signal minutes: in integer; signal seconds: out integer;)",
                return: ""
            };
            check_function(actual, expected);
        });
    });
});
