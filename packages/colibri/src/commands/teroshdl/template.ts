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

import { Command, Flags } from '@oclif/core';
import * as path_lib from 'path';
import * as file_utils from '../../utils/file_utils';
import * as command_utils from '../../utils/command_utils';
import * as printer from '../../utils/printer';
import * as hdl_utils from '../../utils/hdl_utils';
import * as template_manager from '../../template/manager';
import * as template_common from '../../template/common';
import * as cfg from '../../config/config_declaration';
import * as cfg_aux from '../../config/auxiliar_config';

function get_modes(): string[] {
    const vhdl_key_list = Object.values(template_common.TEMPLATE_NAME_VHDL);
    const verilog_key_list = Object.values(template_common.TEMPLATE_NAME_VERILOG);
    const key_list = verilog_key_list.concat(vhdl_key_list);
    const key_id_list: string[] = [];
    key_list.forEach(key_inst => {
        if (key_id_list.includes(key_inst.id) === false) {
            key_id_list.push(key_inst.name);
        }
    });
    return key_id_list;
}

function print_modes_description() {
    //VHDL table
    const table_vhdl: any[] = [];
    Object.values(template_common.TEMPLATE_NAME_VHDL).forEach(key_inst => {
        table_vhdl.push([key_inst.name, key_inst.description]);
    });
    printer.print_table("VHDL templates mode", ["id", "description"], ["white", "green"], table_vhdl);

    //Verilog table
    const table_verilog: any[] = [];
    Object.values(template_common.TEMPLATE_NAME_VERILOG).forEach(key_inst => {
        table_verilog.push([key_inst.name, key_inst.description]);
    });
    printer.print_table("Verilog/SV templates mode", ["id", "description"], ["white", "green"], table_verilog);
}

export default class MyCLI extends Command {
    static description = 'Generate HDL template from a file.';

    static flags = {
        input: Flags.string({
            char: 'i',
            description: 'HDL (VHDL, Verilog or SV) input file',
            hidden: false,
            multiple: false,
            required: false,
            default: ''
        }),
        output: Flags.string({
            char: 'o',
            description: 'Output file path. E.g: template.sv',
            hidden: false,
            multiple: false,
            required: false,
            default: 'template'
        }),
        mode: Flags.string({
            char: 'm',
            description: 'Template mode',
            hidden: false,
            multiple: false,
            required: false,
            options: get_modes(),
            default: "instance"
        }),


        indent: Flags.string({
            description: 'Indent',
            hidden: false,
            multiple: false,
            required: false,
            default: "  "
        }),
        header: Flags.string({
            description: 'File path with the template header (as company license). It will be inserted at be beginning',
            hidden: false,
            multiple: false,
            required: false,
            default: ""
        }),
        clock: Flags.string({
            description: 'Clock generation style. With if/else or in one line',
            hidden: false,
            multiple: false,
            required: false,
            options: ["ifelse", "inline"],
            default: "inline"
        }),
        instance: Flags.string({
            description: 'Instance style for VHDL. Only with entity or with entity + component',
            hidden: false,
            multiple: false,
            required: false,
            options: ["oneline", "separate"],
            default: "oneline"
        }),

        show_modes: Flags.boolean({
            char: 's',
            description: 'Show modes description',
            hidden: false,
            default: false,
            required: false,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(MyCLI);

        const input_path = flags.input;
        let output_path = flags.output;
        const show = flags.show_modes;
        const template_mode = flags.mode;

        if (show === true) {
            print_modes_description();
            this.exit(0);
        }

        const cmd_current_dir = command_utils.get_current_directory();

        //Input file
        const input_path_absolute = file_utils.get_absolute_path(cmd_current_dir, input_path);
        if (file_utils.check_if_path_exist(input_path_absolute) === false) {
            printer.print_msg("Input file doesn't exist.", printer.T_LOG_LEVEL.ERROR);
            this.exit(-1);
        }
        //Output file
        //If output path is default set the extension
        if (output_path === 'template') {
            output_path += file_utils.get_file_extension(input_path);
        }
        else if (file_utils.check_if_path_exist(output_path) && file_utils.check_if_file(output_path) === false) {
            output_path = path_lib.join(output_path, 'template' + file_utils.get_file_extension(input_path));
        }

        const output_path_absolute = file_utils.get_absolute_path(cmd_current_dir, output_path);
        const output_directory = file_utils.get_directory(output_path_absolute);
        if (file_utils.check_if_path_exist(output_directory) === false) {
            printer.print_msg("Output file folder doesn't exist.", printer.T_LOG_LEVEL.ERROR);
            this.exit(-1);
        }

        const input_hdl_lang = hdl_utils.get_lang_from_path(input_path_absolute);
        const cl_template = new template_manager.Template_manager(input_hdl_lang);
        const code_content = file_utils.read_file_sync(input_path_absolute);

        let clock_style = cfg.e_templates_general_clock_generation_style.inline;
        if (flags.clock === "ifelse") {
            clock_style = cfg.e_templates_general_clock_generation_style.ifelse;
        }

        let instance_style = cfg.e_templates_general_instance_style.inline;
        if (flags.instance === "separate") {
            instance_style = cfg.e_templates_general_instance_style.separate;
        }

        const template_options: cfg_aux.t_template_options = {
            header_file_path: flags.header,
            indent_char: flags.indent,
            clock_generation_style: clock_style,
            instance_style: instance_style
        };

        //Get the template normalized
        const key_list = Object.values(template_common.get_template_names(input_hdl_lang));
        let template_type_norm;
        key_list.forEach(key_inst => {
            if (key_inst.name === template_mode) {
                template_type_norm = key_inst.id;
            }
        });
        if (template_type_norm === undefined) {
            const msg_error = `Template mode "${template_mode}" doesn't supported for ${input_hdl_lang}`;
            printer.print_msg(msg_error, printer.T_LOG_LEVEL.ERROR);
            this.exit(-1);
            template_type_norm = "";
        }

        const template_content = await cl_template.generate(code_content, template_type_norm, template_options);
        file_utils.save_file_sync(output_path_absolute, template_content);
    }
}
