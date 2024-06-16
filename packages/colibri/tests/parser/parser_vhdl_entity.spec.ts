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

const code_hdl = `
library ieee;
use ieee.std_logic_1164.all;

entity test_entity_name is
generic (
    a : integer;
    b : std_logic := '1';
    c, d : std_logic_vector(1 downto 0)
  );
port(
  --! over comment 0
  x: in std_logic;
  y: out std_logic; --! inline comment 0
  z: inout std_logic;
  --! over comment 1
  m: in std_logic_vector(31 downto 0); --! inline comment
  b: in std_logic_vector(31 downto 0) := "0010";
  --! over comment 2
  c,d : in std_logic := '1' --! inline comment 2
);
end test_entity_name;  

architecture e_arch of test_entity_name is
  signal a : integer;
  signal b,c : std_logic_vector(1 downto 0);

  constant d : integer;
  constant e,f : integer := 0;

  function counter(minutes : integer := 0; seconds : integer := 0) 
    return integer is variable total_seconds : integer;
  begin
  end function;

  type state_0 is (INIT, ENDS);

  type t_rec1 is record
    f1 : std_logic;
    f2 : std_logic_vector(7 downto 0);
  end record t_rec1;

  type t_custom_array is array (natural range 0 to 1023) of std_logic_vector(7 downto 0);

  begin 

label_0: process begin
end process; 

label_1: process (clk0, reset) begin
end process;

process begin
end process;
  uut_0 : half_adder port map (a => a, b => b);
  half_adder port map (a => a, b => b);
end e_arch;
`;
const parser_common = new Factory();
if (parser_common === undefined) {
    console.log("Error parser.");
}

async function parse() {
    const parser = await parser_common.get_parser(LANGUAGE.VHDL);
    const result = await parser.get_all(code_hdl, '!');
    return result;
}
describe('Check entity VHDL', function () {
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
                direction: "",
                inline_comment: "",
                over_comment: "",
                default_value: "",
                type: "integer",
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
                direction: "",
                inline_comment: "",
                over_comment: "",
                default_value: "'1'",
                type: "std_logic",
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
                direction: "",
                inline_comment: "",
                over_comment: "",
                default_value: '"1"',
                type: "std_logic_vector(1 downto 0)",
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
                direction: "",
                inline_comment: "",
                over_comment: "",
                default_value: '"1"',
                type: "std_logic_vector(1 downto 0)",
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
        equal(actual.inline_comment.trim(), expected.inline_comment.trim());
        equal(actual.over_comment.trim(), expected.over_comment.trim());
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
                    name: "x",
                    description: "over comment 0"
                },
                direction: "in",
                inline_comment: "",
                over_comment: "over comment 0",
                default_value: "",
                type: "std_logic",
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
                    name: "y",
                    description: "inline comment 0"
                },
                direction: "out",
                inline_comment: "inline comment 0",
                over_comment: "",
                default_value: "",
                type: "std_logic",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check inout port`, function () {
            const actual = element_array[2];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "z",
                    description: ""
                },
                direction: "inout",
                inline_comment: "",
                over_comment: "",
                default_value: "",
                type: "std_logic",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check std_logic_vector port`, function () {
            const actual = element_array[3];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "m",
                    description: "inline comment"
                },
                direction: "in",
                inline_comment: "inline comment",
                over_comment: "over comment 1",
                default_value: "",
                type: "std_logic_vector(31 downto 0)",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check port with default value`, function () {
            const actual = element_array[4];
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
                direction: "in",
                inline_comment: "",
                over_comment: "",
                default_value: '"0010"',
                type: "std_logic_vector(31 downto 0)",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check multi declaration in one line 0`, function () {
            const actual = element_array[5];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "c",
                    description: "inline comment 2"
                },
                direction: "in",
                inline_comment: "inline comment 2",
                over_comment: "over comment 2",
                default_value: "'1'",
                type: "std_logic",
                subtype: ""
            };
            check_port(actual, expected);
        });
        it(`Check multi declaration in one line 1`, function () {
            const actual = element_array[6];
            const expected: common.Port_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "d",
                    description: "inline comment 2"
                },
                direction: "in",
                inline_comment: "inline comment 2",
                over_comment: "over comment 2",
                default_value: "'1'",
                type: "std_logic",
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
                    name: "a",
                    description: ""
                },
                type: "integer"
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
                    name: "b",
                    description: ""
                },
                type: "std_logic_vector(1 downto 0)"
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
    function check_constant(actual: common.Constant_hdl, expected: common.Constant_hdl) {
        equal(actual.info.name, expected.info.name);
        equal(actual.type, expected.type);
        equal(actual.default_value, expected.default_value);
        equal(actual.info.description, expected.info.description);
    }

    describe('Check constant.', function () {
        let result: common.Hdl_element;
        let element_array: common.Constant_hdl[];

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
                    name: "d",
                    description: ""
                },
                type: "integer",
                default_value: ""
            };
            check_constant(actual, expected);
        });
        it(`Check multimple declaration in one line 0`, function () {
            const actual = element_array[1];
            const expected: common.Constant_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.CONSTANT,
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
            const expected: common.Constant_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.CONSTANT,
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
    function check_type(actual: common.Type_hdl, expected: common.Type_hdl) {
      equal(actual.info.name, expected.info.name);
      equal(actual.info.description, expected.info.description);

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
        let result: common.Hdl_element;
        let element_array: common.Type_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_type_array();
        });
        it(`Check enum`, function () {
            const actual = element_array[0];
            const expected: common.Type_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.TYPE,
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
                  hdl_element_type: common.TYPE_HDL_ELEMENT.ENUM,
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
                  hdl_element_type: common.TYPE_HDL_ELEMENT.ENUM,
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
          const expected: common.Type_hdl = {
              hdl_element_type: common.TYPE_HDL_ELEMENT.TYPE,
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
                hdl_element_type: common.TYPE_HDL_ELEMENT.RECORD,
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
                hdl_element_type: common.TYPE_HDL_ELEMENT.RECORD,
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
        const expected: common.Type_hdl = {
            hdl_element_type: common.TYPE_HDL_ELEMENT.TYPE,
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
                    name: "counter",
                    description: ""
                },
                type: "",
                arguments: "(minutes : integer := 0; seconds : integer := 0)",
                return: "return integer"
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

    describe('Check process.', function () {
        let result: common.Hdl_element;
        let element_array: common.Process_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_process_array();
        });
        it(`Check without sensitive list`, function () {
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
                sens_list: "",
                type: ""
            };
            check_process(actual, expected);
        });
        it(`Check with sensitive list`, function () {
            const actual = element_array[1];
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
                sens_list: "clk0, reset",
                type: ""
            };
            check_process(actual, expected);
        });
        it(`Check without label`, function () {
            const actual = element_array[2];
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
                type: ""
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
        equal(actual.info.description, expected.info.description);
    }

    describe('Check instantiation.', function () {
        let result: common.Hdl_element;
        let element_array: common.Instantiation_hdl[];

        beforeEach(async function () {
            result = await parse();
            element_array = result.get_instantiation_array();
        });
        it(`Check with label`, function () {
            const actual = element_array[0];
            const expected: common.Instantiation_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.INSTANTIATION,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "uut_0",
                    description: ""
                },
                type: "half_adder"
            };
            check_instantiation(actual, expected);
        });
        it(`Check without label`, function () {
            const actual = element_array[1];
            const expected: common.Instantiation_hdl = {
                hdl_element_type: common.TYPE_HDL_ELEMENT.INSTANTIATION,
                info: {
                    position: {
                        line: 0,
                        column: 0
                    },
                    name: "unnamed",
                    description: ""
                },
                type: "half_adder"
            };
            check_instantiation(actual, expected);
        });
    });
});
