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

import { Template_manager } from "../../src/template/manager";
import * as common from "../../src/template/common";
import * as cfg from "../../src/config/config_declaration";
import * as cfg_aux from "../../src/config/auxiliar_config";
import { read_file_sync } from "../../src/utils/file_utils";
import { HDL_LANG } from "../../src/common/general";
import { equal } from "assert";
import * as paht_lib from 'path';
import * as fs from 'fs';

const language_array = [HDL_LANG.VHDL];
// const language_array = [HDL_LANG.VHDL, HDL_LANG.VERILOG];

async function generate_template_manager(language: HDL_LANG) {
    const template_manager = new Template_manager(language);
    return template_manager;
}

function create_output(base: string) {
    const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, `out_${base}`);
    fs.mkdirSync(C_OUTPUT_BASE_PATH, { recursive: true });
    return C_OUTPUT_BASE_PATH;
}

const vhdl_code = [
    `library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity test_entity_name is
generic (
    a : integer := 0;
    b : unsigned;
    c : signed;
    d : std_logic := '1';
    e : std_logic_vector := "10001";
    f : std_logic_vector(5 downto 0)
  );
port(
  g : in std_logic;
  h : out std_logic;
  i : inout std_logic
);
end test_entity_name;  

architecture e_arch of test_entity_name is
begin 

end e_arch;`,

    `library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity test_entity_name is
port(
  g : in std_logic;
  h : out std_logic;
  i : inout std_logic
);
end test_entity_name;  

architecture e_arch of test_entity_name is
begin 

end e_arch;`,
];

const verilog_code = [
    `module test_entity_name (a, b, c, d, e);  
    parameter PARAM_CNT_0 = 8;
    parameter PARAM_CNT_1 = 7;
    input [3:0] a;           
    input b = 0;  
    output [3:0] c;   
    output d;
    inout e;
endmodule `,
    `module test_entity_name (a, b, c, d, e);  
    input [3:0] a;           
    input b = 0;  
    output [3:0] c;   
    output d;
    inout e;
endmodule `,
];

const TEST_TYPE_LIST = ["with_generic", "without_generic"];

TEST_TYPE_LIST.forEach(TEST_TYPE => {

    const C_OUTPUT_BASE_PATH = create_output(TEST_TYPE);
    language_array.forEach(language => {
        describe(`Check template ${language} element ${TEST_TYPE}`, function () {
            const values = Object.values(common.get_template_names(language));
            values.forEach(template_type => {
                it(`Check ${template_type.id}`, async function () {
                    let code_hdl = verilog_code;
                    if (language === HDL_LANG.VHDL) {
                        code_hdl = vhdl_code;
                    }
                    else {
                        code_hdl = verilog_code;
                    }

                    let counter = 0;
                    if (TEST_TYPE === TEST_TYPE_LIST[1]) {
                        counter = 1;
                    }

                    const options: cfg_aux.t_template_options = {
                        header_file_path: "",
                        indent_char: "  ",
                        instance_style: cfg.e_templates_general_instance_style.inline,
                        clock_generation_style: cfg.e_templates_general_clock_generation_style.ifelse
                    };

                    const template_manager = await generate_template_manager(language);
                    const inst_hdl = code_hdl[counter];
                    const template = await template_manager.generate(inst_hdl, template_type.id, options);
                    const output_path = paht_lib.join(C_OUTPUT_BASE_PATH,
                        `${language}_${template_type.id}.${language}`);
                    fs.writeFileSync(output_path, template);

                    //Get exepcted template
                    const input_path = paht_lib.join(__dirname, `expected_${TEST_TYPE}`,
                        `${language}_${template_type.id}.${language}`);
                    const expected = read_file_sync(input_path);

                    equal(template, expected);
                });
            });

        });
    });
});