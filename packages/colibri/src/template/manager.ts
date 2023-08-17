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

import * as fs from 'fs';
import { HDL_LANG } from "../common/general";
import * as parser_lib from "../parser/factory";
import * as common_hdl from "../parser/common";
import { t_template_options } from "../config/auxiliar_config";
import { get_template } from "./helpers/template";

/** Template */
export class Template_manager {
    private language: HDL_LANG = HDL_LANG.VHDL;
    private comment_symbol = "//";

    /**
     * @param  {HDL_LANG} language Language name
     */
    constructor(language: HDL_LANG) {
        if (language === HDL_LANG.VHDL) {
            this.comment_symbol = '//';
        }
        else {
            this.comment_symbol = '--';
        }
        this.language = language;
    }

    /**
     * Get the text header from a file path
     * @param  {string} header_file_path File path with the header
     */
    private get_header(header_file_path: string) {
        if (header_file_path === '') {
            return '';
        }

        try {
            const header_f = fs.readFileSync(header_file_path, 'utf8');
            const lines = header_f.split(/\r?\n/g);
            let header = '';
            for (let i = 0; i < lines.length; i++) {
                const element = lines[i];
                header += `${this.comment_symbol}  ${element}\n`;
            }
            return header + '\n';
        }
        catch (e) {
            return '';
        }
    }

    /**
     * Gen indent
     * @param  {string} indent_char Indent character
     */
    private get_indent(indent_char: string) {
        const indent = ['', '', '', '', '', ''];

        let base = '    ';
        if (indent_char !== '') {
            base = indent_char;
        }
        for (let i = 0; i < indent.length; i++) {
            indent[i] = base.repeat(i);
        }
        return indent;
    }
    /**
     * Parse the code
     * @param  {string} code Text code
     */
    private async parse(code: string) {
        const parser_f = new parser_lib.Factory();
        const parser = await parser_f.get_parser(this.language);
        parser.init();

        const code_tree = await parser.get_all(code, '}{}');
        return code_tree;
    }

    /**
     * Generate a template from HDL code
     * @param  {string} code HDL code
     * @param  {common.TEMPLATE_NAME} template_type Template type
     * @param  {common.t_options} options Template options
     */
    async generate(code: string, template_type: string, options: t_template_options) {
        let norm_language = this.language;
        if (this.language === HDL_LANG.SYSTEMVERILOG) {
            norm_language = HDL_LANG.VERILOG;
        }

        let template = '';
        const code_tree = await this.parse(code);
        if (code_tree === undefined || code_tree.name === "") {
            return template;
        }
        // Get header
        const header = this.get_header(options.header_file_path);
        // Indent
        const indent = this.get_indent(options.indent_char);
        // Template parent
        const name = code_tree.name;
        const generic = this.adapt_port(code_tree.get_generic_array(), template_type, true);
        // Set default value to generics
        for (let i = 0; i < generic.length; i++) {
            const element = generic[i];
            if (element.default_value.trim() === "") {
                const normalized_type = element.type.replace(/\s/g, '').toLowerCase();
                if (normalized_type === "integer") {
                    element.default_value = "0";
                }
                else if (normalized_type === "signed" || normalized_type === "unsigned") {
                    element.default_value = "(others => '0')";
                }
                else if (normalized_type === "string") {
                    element.default_value = '""';
                }
                else if (normalized_type === "boolean") {
                    element.default_value = "false";
                }
                else if (normalized_type.includes("std_logic_vector")) {
                    element.default_value = "(others => '0')";
                }
                else if (normalized_type === "std_logic") {
                    element.default_value = "'0'";
                }
            }
        }
        const port = this.adapt_port(code_tree.get_port_array(), template_type, false);
        
        
        const template_options = {
            indent: indent, name: name,
            generic: generic, port: port,
            instance_style: options.instance_style,
        };
        template = get_template(norm_language, template_type, template_options, header, options.clock_generation_style);

        return template;
    }
    /**
     * Adapt the ports/generics from VHDL/Verilog to Verilog/VHDL. It useful for mix templates
     * @param  {common_hdl.Port_hdl[]} port_list List of ports
     * @param  {string} template_type Type of template
     * @param  {boolean} is_generic Genercis enable
     */
    private adapt_port(port_list: common_hdl.Port_hdl[], template_type: string, is_generic: boolean)
        : common_hdl.Port_hdl[] {

        if (this.language === HDL_LANG.VHDL && template_type.includes("mix")) {
            return this.adapt_port_to_verilog(port_list, is_generic);
        }
        else if ((this.language === HDL_LANG.VERILOG || this.language === HDL_LANG.SYSTEMVERILOG)
            && template_type.includes("mix")) {
            return this.adapt_port_to_vhdl(port_list, is_generic);
        }

        return port_list;
    }

    private adapt_port_to_vhdl(port_list: common_hdl.Port_hdl[], is_generic: boolean): common_hdl.Port_hdl[] {
        port_list.forEach(port_inst => {
            //Adapt direction
            const direction = port_inst.direction;
            if (direction === 'input') {
                port_inst.direction = 'in';
            }
            else if (direction === 'output') {
                port_inst.direction = 'out';
            }
            else if (direction === 'inout') {
                port_inst.direction = 'inout';
            }

            //Adapt type
            const type = port_inst.type;
            if (type === '' || type === 'wire' || type === 'reg') {
                port_inst.type = 'std_logic';
            } else if (type.includes('[')) {
                port_inst.type = type.replace('[', '(').replace(']', ')').replace('wire', '').replace('reg', '');
                port_inst.type = `std_logic_vector ${port_inst.type.replace(':', ' downto ')}`;
            } else {
                port_inst.type = type;
            }

            //Adapt generic
            if (is_generic === true) {
                port_inst.type = "integer";
                if (port_inst.default_value === "") {
                    port_inst.default_value = "0";
                }
            }
        });
        return port_list;
    }

    private adapt_port_to_verilog(port_list: common_hdl.Port_hdl[], is_generic: boolean): common_hdl.Port_hdl[] {
        port_list.forEach(port_inst => {
            //Adapt direction
            const direction = port_inst.direction;
            if (direction === 'in') {
                port_inst.direction = 'input';
            }
            else if (direction === 'out') {
                port_inst.direction = 'output';
            }
            else if (direction === 'inout') {
                port_inst.direction = 'inout';
            }

            //Adapt type
            const type = port_inst.type;
            if (type === '' || type === 'std_logic') {
                port_inst.type = '';
            } else if (type.includes('(')) {
                port_inst.type = type.replace('(', '[').replace(')', ']');
                port_inst.type = port_inst.type.replace('std_logic_vector', '');
                port_inst.type = port_inst.type.replace('std_logic', '');
                port_inst.type = port_inst.type.replace('signed', '');
                port_inst.type = port_inst.type.replace('unsigned', '');
                port_inst.type = `${port_inst.type.replace('downto', ':')}`;
            } else {
                port_inst.type = type;
            }
            //Adapt generic
            if (is_generic === true) {
                port_inst.type = "";
                if (port_inst.default_value === "") {
                    port_inst.default_value = "0";
                }
            }
        });
        return port_list;
    }
}
