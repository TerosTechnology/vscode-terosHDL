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

import * as hdl_utils from "../../src/utils/hdl_utils";
import { HDL_LANG } from "../../src/common/general";
import { equal } from "assert";
import * as path_lib from "path";

describe('HDL utils', function () {

    it(`get_lang_from_extension`, async function () {
        expect(hdl_utils.get_lang_from_extension(".vhdl")).toBe(HDL_LANG.VHDL);
        expect(hdl_utils.get_lang_from_extension(".v")).toBe(HDL_LANG.VERILOG);
        expect(hdl_utils.get_lang_from_extension(".sv")).toBe(HDL_LANG.SYSTEMVERILOG);
        expect(hdl_utils.get_lang_from_extension(".cpp")).toBe(HDL_LANG.CPP);
        expect(hdl_utils.get_lang_from_extension(".sf")).toBe(HDL_LANG.NONE);
    });

    it(`get_lang_from_path`, async function () {
        expect(hdl_utils.get_lang_from_path("/this/my/path.vhdl")).toBe(HDL_LANG.VHDL);
    });

    it(`check_if_hdl_file`, async function () {
        expect(hdl_utils.check_if_hdl_file("/this/my/path.vhdl")).toBe(true);
        expect(hdl_utils.check_if_hdl_file("/this/my/path.v")).toBe(true);
        expect(hdl_utils.check_if_hdl_file("/this/my/path.sv")).toBe(true);
        expect(hdl_utils.check_if_hdl_file("/this/my/path.cpp")).toBe(false);
    });

    it(`remove_comments_vhdl`, async function () {
        const code_dummy = `
-- One line comment
-- One line comment 2
Test no comment
/* multiline
comment
example*/
Test no comment 2`;
        // eslint-disable-next-line max-len
        const code_expected = "\n                   \n                     \nTest no comment\n/           \n       \n         \nTest no comment 2";
        const code_current = hdl_utils.remove_comments_vhdl(code_dummy);
        equal(code_current, code_expected);
    });

    it(`remove_comments_verilog`, async function () {
        const code_dummy = `
// One line comment
// One line comment 2
Test no comment
/* multiline
comment
example*/
Test no comment 2`;
        // eslint-disable-next-line max-len
        const code_expected = "\n                   \n                     \nTest no comment\n            \n       \n         \nTest no comment 2";
        const code_current = hdl_utils.remove_comments_verilog(code_dummy);
        equal(code_current, code_expected);
    });


    it(`get_toplevel VHDL`, function () {
        const code_dummy = `
            library ieee;
            use ieee.std_logic_1164.all;
            use ieee.numeric_std.all;

            entity test_entity_name is
            generic (
                a : integer;
                b : unsigned;
                c : signed;
                d : std_logic;
                e : std_logic_vector;
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

            end e_arch;
            `;

        const expected = 'test_entity_name';
        const current = hdl_utils.get_toplevel(code_dummy, HDL_LANG.VHDL);
        equal(current, expected);
    });

    it(`get_toplevel Verilog`, function () {
        const code_dummy = `
            module test_entity_name2 
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
                reg [1:0] q;
            
                localparam r = 2;
            
                always @(posedge a) begin : label_0
                end
            
                always_comb begin
                end
            
                always_ff begin : label_1
                end
            
                always_latch begin
                end
            
                test_entity_name 
                #(
                  .a(a ),
                  .b(b ),
                  .c(c ),
                  .d (d )
                )
                test_entity_name_dut (
                  .e (e ),
                  .f (f ),
                  .g (g ),
                  .h (h ),
                  .i (i ),
                  .j (j ),
                  .k (k ),
                  .l  ( l)
    });

            endmodule
            `;
        const expected = 'test_entity_name2';
        const current = hdl_utils.get_toplevel(code_dummy, HDL_LANG.VERILOG);
        equal(current, expected);
    });


    it(`get_toplevel None`, function () {
        const current = hdl_utils.get_toplevel("", HDL_LANG.VERILOG);
        equal(current, "");
    });

    it(`get_toplevel_from_path`, async function () {
        const current = hdl_utils.get_toplevel_from_path(path_lib.join(__dirname, "helpers", "mod.vhdl"));
        equal(current, "myent");

        expect(hdl_utils.get_toplevel_from_path("/sample/fail")).toBe('');
        expect(hdl_utils.get_toplevel_from_path(path_lib.join(__dirname, "helpers", "sample.txt"))).toBe('');

    });
});