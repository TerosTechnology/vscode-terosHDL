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

import { equal, ok } from "assert";
import {
    format_verilog_instance, prefix_lines, t_verilog_instance_item,
    INSTANCE_MIN_LPAREN_COLUMN, INSTANCE_MIN_RPAREN_COLUMN
} from "../../src/colibri/template/helpers/verilog_instance";
import { Template_manager } from "../../src/colibri/template/manager";
import * as cfg from "../../src/colibri/config/config_declaration";
import * as cfg_aux from "../../src/colibri/config/auxiliar_config";
import { LANGUAGE } from "../../src/colibri/common/general";

function get_default_config(): cfg_aux.t_template_options {
    return {
        header_file_path: "",
        indent_char: "    ",
        instance_style: cfg.e_templates_general_instance_style.inline,
        clock_generation_style: cfg.e_templates_general_clock_generation_style.ifelse
    };
}

/**
 * Build the connection line exactly as shown in the coding style example: the
 * "." starts at column 4, "(" at column 31 and ")" at column 64 (0-based).
 */
function example_line(name: string, value: string, is_last: boolean): string {
    return ref_line_at(name, value, is_last, 31, 64);
}

/** Connection line with explicit "(" and ")" columns. */
function ref_line_at(name: string, value: string, is_last: boolean,
    lparen: number, rparen: number): string {
    let line = "    " + "." + name;
    line = line + " ".repeat(lparen - line.length) + "( " + value;
    line = line + " ".repeat(rparen - line.length) + ")";
    return is_last ? line : line + ",";
}

describe('Verilog instance formatter', function () {
    it('reproduces the coding style example', function () {
        const generics: t_verilog_instance_item[] = [
            { name: "PARAM1", value: "PARAM1" },
            { name: "PARAM2", value: "PARAM2" },
        ];
        const ports: t_verilog_instance_item[] = [
            { name: "clk", value: "clk" },
            { name: "data", value: "data" },
            { name: "result", value: "result" },
        ];

        const expected = [
            "top_module # (",
            example_line("PARAM1", "PARAM1", false),
            example_line("PARAM2", "PARAM2", true),
            ")",
            "top_module_inst (",
            example_line("clk", "clk", false),
            example_line("data", "data", false),
            example_line("result", "result", true),
            ");"
        ].join("\n");

        equal(format_verilog_instance("top_module", generics, ports), expected);
    });

    it('aligns the three columns and keeps the minimum column widths', function () {
        const long_name = "A_VERY_LONG_PARAMETER_NAME_ABCDE";
        const generics: t_verilog_instance_item[] = [
            { name: long_name, value: long_name },
            { name: "P", value: "P" },
        ];
        const ports: t_verilog_instance_item[] = [{ name: "clk", value: "clk" }];

        const result = format_verilog_instance("top_module", generics, ports);
        const connection_lines = result.split("\n").filter(line => line.trim().startsWith("."));

        equal(connection_lines.length, 3);

        const lparen_columns = connection_lines.map(line => line.indexOf("("));
        const rparen_columns = connection_lines.map(line => line.lastIndexOf(")"));

        // All the "(" and ")" must share the same column...
        equal(new Set(lparen_columns).size, 1);
        equal(new Set(rparen_columns).size, 1);
        // ... and never go below the minimums of the coding style.
        ok(lparen_columns[0] >= INSTANCE_MIN_LPAREN_COLUMN);
        ok(rparen_columns[0] >= INSTANCE_MIN_RPAREN_COLUMN);
        // A long name must expand the columns instead of breaking the alignment.
        ok(lparen_columns[0] > INSTANCE_MIN_LPAREN_COLUMN);
    });

    it('handles modules without parameters and without ports', function () {
        const only_ports = format_verilog_instance("top_module", [],
            [{ name: "clk", value: "clk" }]);
        ok(only_ports.startsWith("top_module_inst (\n"));
        ok(!only_ports.includes("# ("));
        ok(only_ports.endsWith(");"));

        const only_params = format_verilog_instance("top_module",
            [{ name: "P", value: "P" }], []);
        ok(only_params.startsWith("top_module # (\n"));
        ok(only_params.endsWith("top_module_inst (\n);"));

        const empty = format_verilog_instance("top_module", [], []);
        equal(empty, "top_module_inst (\n);");
    });

    it('prefixes every line when embedding an instance', function () {
        const text = "top_module_inst (\n    .clk ( clk )\n);";
        equal(prefix_lines(text, "  "), "  top_module_inst (\n      .clk ( clk )\n  );");
    });
});

describe('Verilog instance end to end', function () {
    it('generates an aligned instance with #(...) parameters', async function () {
        const code = `module top_module #(
    parameter PARAM1 = 1,
    parameter PARAM2 = 2
) (
    input clk,
    input [7:0] data,
    output result
);
endmodule`;

        const template_manager = new Template_manager(LANGUAGE.VERILOG);
        const template = await template_manager.generate(code, "hdl_element_instance",
            get_default_config(), LANGUAGE.VERILOG);

        const expected = [
            "top_module # (",
            example_line("PARAM1", "PARAM1", false),
            example_line("PARAM2", "PARAM2", true),
            ")",
            "top_module_inst (",
            example_line("clk", "clk", false),
            example_line("data", "data", false),
            example_line("result", "result", true),
            ");"
        ].join("\n");

        equal(template, expected);
    });

    it('expands the columns for long names (slvs_ec_top)', async function () {
        const code = `module slvs_ec_top  #(
   parameter RX_LANES =  1,   // rx line number
   parameter WIDTH = 16      // word, or byte, or double word, now only support word.
)(

  input                     gtwiz_reset_rx_done_int,
  input [RX_LANES*16 - 1:0] gtwiz_userdata_rx_int,
  input [RX_LANES*16 - 1:0] rxctrl0_int,
  input                     gtwiz_userclk_rx_usrclk2_int,

  input  [1   : 0] ECC_Option_i,
  input            CRC_Option_i,
  input  [13  : 0] pixel_num_i,
  input  [4   : 0] pixel_bit_i,

  output                             video_clk,
  output [RX_LANES*WIDTH*2 - 1  : 0] vdata_o,
  output                             vs_o,
  output                             hs_o,
  output                             de_o,
  output [12              : 0]       linenum_o,
  output                             embed_o,
  output [3               : 0]       err_o
);

endmodule`;

        const template_manager = new Template_manager(LANGUAGE.VERILOG);
        const template = await template_manager.generate(code, "hdl_element_instance",
            get_default_config(), LANGUAGE.VERILOG);

        // Longest connection name is 28 characters, so both columns are pushed
        // past their minimums: "(" ends up at column 34 and ")" at column 65.
        const lparen = 34;
        const rparen = 65;
        const generic_names = ["RX_LANES", "WIDTH"];
        const port_names = [
            "gtwiz_reset_rx_done_int", "gtwiz_userdata_rx_int", "rxctrl0_int",
            "gtwiz_userclk_rx_usrclk2_int", "ECC_Option_i", "CRC_Option_i",
            "pixel_num_i", "pixel_bit_i", "video_clk", "vdata_o", "vs_o", "hs_o",
            "de_o", "linenum_o", "embed_o", "err_o"
        ];

        const expected = [
            "slvs_ec_top # (",
            ...generic_names.map((name, index) =>
                ref_line_at(name, name, index === generic_names.length - 1, lparen, rparen)),
            ")",
            "slvs_ec_top_inst (",
            ...port_names.map((name, index) =>
                ref_line_at(name, name, index === port_names.length - 1, lparen, rparen)),
            ");"
        ].join("\n");

        equal(template, expected);
    });
});
