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
import * as file_utils from '../../utils/file_utils';
import * as command_utils from '../../utils/command_utils';
import * as printer from '../../utils/printer';
import * as formatter_common from '../../formatter/common';
import { Formatter } from '../../formatter/formatter';
import * as logger from '../../logger/logger';
import * as cfg from '../../config/config_declaration';
import {e_formatter_verible_full} from '../../formatter/common';

function get_formatters(): string[] {
    const key_list = [
        cfg.e_formatter_general_formatter_vhdl.standalone,
        cfg.e_formatter_general_formatter_vhdl.vsg,
        cfg.e_formatter_general_formatter_verilog.istyle,
        cfg.e_formatter_general_formatter_verilog.s3sv,
        cfg.e_formatter_general_formatter_verilog.verible,
    ];
    return key_list;
}

function get_formatter_name(name_str: string): formatter_common.t_formatter_name {
    if (name_str === cfg.e_formatter_general_formatter_vhdl.standalone) {
        return cfg.e_formatter_general_formatter_vhdl.standalone;
    }
    else if (name_str === cfg.e_formatter_general_formatter_vhdl.vsg) {
        return cfg.e_formatter_general_formatter_vhdl.vsg;
    }

    else if (name_str === cfg.e_formatter_general_formatter_verilog.istyle) {
        return cfg.e_formatter_general_formatter_verilog.istyle;
    }
    else if (name_str === cfg.e_formatter_general_formatter_verilog.s3sv) {
        return cfg.e_formatter_general_formatter_verilog.s3sv;
    }
    else if (name_str === cfg.e_formatter_general_formatter_verilog.verible) {
        return cfg.e_formatter_general_formatter_verilog.verible;
    }
    else {
        return cfg.e_formatter_general_formatter_vhdl.standalone;
    }
}

type i_result = {
    filename: string;
    error: boolean;
    code: string;
    formatted_code: string;
}

function print_report(error_list: i_result[]) {
    const title = "Summary";
    const column_title = ["File", "Result"];
    const column_color = ["white", "white"];
    const row_list: any[] = [];

    error_list.forEach(error_inst => {
        let result_fail = 'PASS';
        if (error_inst.error === true) {
            result_fail = 'NOT PASS';
        }
        const row = [error_inst.filename, result_fail];
        row_list.push(row);
    });
    printer.print_table(title, column_title, column_color, row_list);
}

function get_standalone_vhdl_options(_config_path: string): cfg.e_formatter_standalone {
    const config: cfg.e_formatter_standalone = {
        keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
        name_case: cfg.e_formatter_standalone_name_case.lowercase,
        indentation: '',
        align_port_generic: false,
        align_comment: false,
        remove_comments: false,
        remove_reports: false,
        check_alias: false,
        new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
        new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
        new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
        new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.new_line,
        new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
    }
    return config;
}

function get_istyle_options(_config_path: string): cfg.e_formatter_istyle {
    const config: cfg.e_formatter_istyle = {
        style: cfg.e_formatter_istyle_style.ansi,
        indentation_size: 2
    };
    return config;
}

function get_s3sv_options(_config_path: string, _python_path: string): cfg.e_formatter_s3sv {
    const config: cfg.e_formatter_s3sv = {
        one_bind_per_line: false,
        one_declaration_per_line: false,
        use_tabs: false,
        indentation_size: 2
    };
    return config;
}

function get_verible_options(_config_path: string) {
    const config: e_formatter_verible_full = {
        path: '',
        format_args: ""
    };
    return config;
}

function get_options(formatter_name: string, config_path: string, python_path: string) {
    if (formatter_name === cfg.e_formatter_general_formatter_verilog.istyle) {
        return get_istyle_options(config_path);
    }
    else if (formatter_name === cfg.e_formatter_general_formatter_verilog.s3sv) {
        return get_s3sv_options(config_path, python_path);
    }
    else if (formatter_name === cfg.e_formatter_general_formatter_vhdl.standalone) {
        return get_standalone_vhdl_options(config_path);
    }
    else {
        return get_verible_options(config_path);
    }
}

export default class MyCLI extends Command {
    static description = 'Check errors in HDL files.';

    static flags = {
        input: Flags.string({
            char: 'i',
            description: 'Path CSV with a list of files or glob pattern. E.g: --input "/mypath/*.vhd"',
            hidden: false,
            multiple: false,
            required: true,
            default: ''
        }),
        formatter: Flags.string({
            description: 'Formatter name',
            hidden: false,
            multiple: false,
            required: true,
            options: get_formatters(),
            default: "standalone_vhdl"
        }),
        mode: Flags.string({
            description: 'Opeation mode. Format and save the formatted code or only check',
            hidden: false,
            multiple: false,
            required: false,
            options: ["only-check", "format"],
            default: "only-check"
        }),
        "python-path": Flags.string({
            description: 'Python path. Empty to use the system path.',
            hidden: false,
            multiple: false,
            required: false,
            default: ""
        }),
        "formatter-arguments": Flags.string({
            description: 'Arguments passed to the formatter.',
            hidden: false,
            multiple: false,
            required: false,
            default: ""
        }),

        silent: Flags.boolean({
            char: 's',
            description: 'Silent mode',
            hidden: false,
            default: false,
            required: false,
        }),
        verbose: Flags.boolean({
            char: 'v',
            description: 'Verbose mode',
            hidden: false,
            default: false,
            required: false,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(MyCLI);

        const input_path = flags.input;
        const mode = flags.mode;
        const formatter_name = flags.formatter;
        const python_path = flags['python-path'];
        const silent = flags.silent;
        const verbose = flags.verbose;

        if (verbose === true) {
            logger.Logger.set_mode(logger.LOG_MODE.STDOUT);
        }
        else {
            logger.Logger.set_mode(logger.LOG_MODE.SILENT);
        }

        const cmd_current_dir = command_utils.get_current_directory();

        //Input
        const hdl_file_list = await command_utils.get_files_from_input(input_path, cmd_current_dir);

        const formatter_manager = new Formatter();
        const formatter_options = get_options(formatter_name, "", python_path);

        const result_list: any[] = [];
        for (let i = 0; i < hdl_file_list.length; i++) {
            const hdl_file = hdl_file_list[i];
            const filename = hdl_file.filename;
            const current_code = file_utils.read_file_sync(filename);
            const formatted_code =
                (await formatter_manager.format_from_code(get_formatter_name(formatter_name), current_code,
                    formatter_options, python_path)).code_formatted;
            let error = false;
            if (current_code !== formatted_code) {
                error = true;
            }

            const result: i_result = {
                filename: filename,
                error: error,
                code: current_code,
                formatted_code: formatted_code
            };
            result_list.push(result);

            if (mode === "format") {
                file_utils.save_file_sync(filename, formatted_code, false);
            }
        }
        if (silent === false) {
            print_report(result_list);
        }
    }
}
