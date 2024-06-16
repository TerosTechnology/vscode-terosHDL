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
import { Constant_hdl, Function_hdl, Signal_hdl, 
        Type_hdl, TYPE_HDL_ELEMENT, Hdl_element } from "../../src/parser/common";

const code_hdl = `
package test_package_name is
  signal a : integer;
  signal b,c : std_logic_vector(1 downto 0);

  constant d : integer := 8;
  constant e,f : integer := 0;

  type state_0 is (INIT, ENDS);

  type t_rec1 is record
    f1 : std_logic;
    f2 : std_logic_vector(7 downto 0);
  end record t_rec1;

  type t_custom_array is array (natural range 0 to 1023) of std_logic_vector(7 downto 0);

  procedure counter(signal minutes: in integer; signal seconds: out integer;);
end package test_package_name;
 
package body test_package_name is
end package body test_package_name;
`;
const parser_common = new Factory();

async function parse() {
    const parser = await parser_common.get_parser(LANGUAGE.VHDL);
    const result = await parser.get_all(code_hdl, '!');
    return result;
}
describe('Check package VHDL', function () {
    ////////////////////////////////////////////////////////////////////////////////
    // Package
    ////////////////////////////////////////////////////////////////////////////////
    describe('Check pacakge.', function () {
        let result: Hdl_element;

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
        let result: Hdl_element;
        let element_array: Signal_hdl[];

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
        let result: Hdl_element;
        let element_array: Constant_hdl[];

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
        if (expected.is_enum === true){
          for (let index = 0; index < expected.enum_elements.length; index++) {
            equal(expected.enum_elements[index].hdl_element_type, actual.enum_elements[index].hdl_element_type);
            equal(expected.enum_elements[index].info.name, actual.enum_elements[index].info.name);
          }
          return;
        }
        if (expected.is_record === true){
          for (let index = 0; index < expected.record_elements.length; index++) {
            equal(expected.record_elements[index].hdl_element_type, actual.record_elements[index].hdl_element_type);
            equal(expected.record_elements[index].info.name, actual.record_elements[index].info.name);
            equal(expected.record_elements[index].type, actual.record_elements[index].type);
          }
          return;
        }
        // Normal type:
        equal(actual.type, expected.type);
        return;
    }

    describe('Check type', function () {
        let result: Hdl_element;
        let element_array: Type_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_type_array();
        });
        it(`Check enum`, function () {
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
                inline_comment: "",
                is_record : false,
                is_enum : true,
                record_elements: [],
                enum_elements: [{
                  hdl_element_type: TYPE_HDL_ELEMENT.ENUM,
                  info: {
                    position: {
                      line: 8,
                      column: 0,
                    },
                    name: "INIT",
                    description: "",
                  },
                  type: "",
                  inline_comment: "",
                },
                {
                  hdl_element_type: TYPE_HDL_ELEMENT.ENUM,
                  info: {
                    position: {
                      line: 8,
                      column: 0,
                    },
                    name: "ENDS",
                    description: "",
                  },
                  type: "",
                  inline_comment: "",
                }],
                type: "",
                logic: []
            };
            check_type(actual, expected);
        });
        it(`Check record`, function () {
          const actual = element_array[1];
          const expected: Type_hdl = {
              hdl_element_type: TYPE_HDL_ELEMENT.TYPE,
              info: {
                  position: {
                      line: 0,
                      column: 0
                  },
                  name: "t_rec1",
                  description: ""
              },
              inline_comment: "",
              is_record : true,
              is_enum : false,
              enum_elements: [],
              record_elements: [{
                hdl_element_type: TYPE_HDL_ELEMENT.RECORD,
                info: {
                  position: {
                    line: 12,
                    column: 0,
                  },
                  name: "f1",
                  description: "",
                },
                type: "std_logic",
                inline_comment: "",
              },
              {
                hdl_element_type: TYPE_HDL_ELEMENT.RECORD,
                info: {
                  position: {
                    line: 12,
                    column: 0,
                  },
                  name: "f2",
                  description: "",
                },
                type: "std_logic_vector(7 downto 0)",
                inline_comment: "",
              }],
              type: "",
              logic: []
          };
          check_type(actual, expected);
      });
      it(`Check type`, function () {
        const actual = element_array[2];
        const expected: Type_hdl = {
            hdl_element_type: TYPE_HDL_ELEMENT.TYPE,
            info: {
                position: {
                    line: 0,
                    column: 0
                },
                name: "t_custom_array",
                description: ""
            },
            inline_comment: "std_logic",
            is_record : false,
            is_enum : false,
            record_elements: [],
            enum_elements: [],
            type: "",
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
        let result: Hdl_element;
        let element_array: Function_hdl[];

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
