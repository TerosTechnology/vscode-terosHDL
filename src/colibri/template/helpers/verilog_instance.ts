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

/**
 * Verilog/SV module instantiation formatter.
 *
 * Produces a table-aligned instance where the "." of every connection, the
 * opening "(" and the closing ")" share three columns:
 *
 *     top_module # (
 *         .PARAM1                    ( PARAM1                         ),
 *         .PARAM2                    ( PARAM2                         )
 *     )
 *     top_module_inst (
 *         .clk                       ( clk                            ),
 *         .data                      ( data                           ),
 *         .result                    ( result                         )
 *     );
 *
 * The module name, the instance name, the parameter list closing ")" and the
 * port list trailing ");" are flush left, while parameters and ports are
 * indented with 4 spaces inside their lists.
 */

/** A single named connection of the instance (parameter or port). */
export interface t_verilog_instance_item {
    /** Name after the "." (parameter or port name). */
    name: string;
    /** Signal/expression connected inside the parenthesis. */
    value: string;
}

/** Indentation of the parameters and ports inside their lists (4 spaces). */
export const INSTANCE_INNER_INDENT = "    ";

/** Minimum 0-based column of the opening "(" (the 32nd character). */
export const INSTANCE_MIN_LPAREN_COLUMN = 31;

/** Minimum 0-based column of the closing ")" (the 65th character). */
export const INSTANCE_MIN_RPAREN_COLUMN = 64;

/** Opening parenthesis plus its inner leading space. */
const LPAREN_TEXT = "( ";
const RPAREN_TEXT = ")";

/**
 * Compute the shared "(" and ")" columns for all the connections of an
 * instance. The columns adapt to the longest name/value and never go below the
 * minimums required by the instantiation style.
 */
function get_columns(items: t_verilog_instance_item[]) {
    let max_name_length = 0;
    let max_value_length = 0;
    for (const item of items) {
        max_name_length = Math.max(max_name_length, item.name.length);
        max_value_length = Math.max(max_value_length, item.value.length);
    }

    const lparen_column = Math.max(INSTANCE_MIN_LPAREN_COLUMN,
        INSTANCE_INNER_INDENT.length + 1 + max_name_length + 1);
    const rparen_column = Math.max(INSTANCE_MIN_RPAREN_COLUMN,
        lparen_column + LPAREN_TEXT.length + max_value_length + 1);

    return { lparen_column, rparen_column };
}

/**
 * Format a single named connection line:
 *     .name    ( value    ),
 */
function format_connection(item: t_verilog_instance_item, lparen_column: number,
    rparen_column: number, is_last: boolean): string {

    let line = INSTANCE_INNER_INDENT + "." + item.name;
    line = line.padEnd(lparen_column, " ") + LPAREN_TEXT + item.value;
    line = line.padEnd(rparen_column, " ") + RPAREN_TEXT;
    if (is_last === false) {
        line += ",";
    }
    return line;
}

/**
 * Format a complete Verilog/SV module instantiation.
 * @param name Module name.
 * @param generics Parameter list (named override).
 * @param ports Port list (named connection).
 */
export function format_verilog_instance(name: string,
    generics: t_verilog_instance_item[],
    ports: t_verilog_instance_item[]): string {

    const { lparen_column, rparen_column } = get_columns(generics.concat(ports));

    const lines: string[] = [];

    if (generics.length > 0) {
        lines.push(`${name} # (`);
        generics.forEach((item, index) => {
            lines.push(format_connection(item, lparen_column, rparen_column,
                index === generics.length - 1));
        });
        lines.push(RPAREN_TEXT);
    }

    lines.push(`${name}_inst (`);
    ports.forEach((item, index) => {
        lines.push(format_connection(item, lparen_column, rparen_column,
            index === ports.length - 1));
    });
    lines.push(RPAREN_TEXT + ";");

    return lines.join("\n");
}

/**
 * Prefix every line of a text block with the given indentation. Used to embed
 * an instance inside a testbench without breaking the column alignment.
 */
export function prefix_lines(text: string, prefix: string): string {
    return text.split("\n").map(line => prefix + line).join("\n");
}
