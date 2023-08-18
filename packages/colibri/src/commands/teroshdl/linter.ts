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

import { Command, Flags } from '@oclif/core';
import * as path_lib from 'path';
import * as file_utils from '../../utils/file_utils';
import * as command_utils from '../../utils/command_utils';
import * as printer from '../../utils/printer';
import { Linter } from "../../linter/linter";
import * as linter_common from '../../linter/common';
import * as logger from '../../logger/logger';
import * as reporter from '../../reporter/reporter';
import * as cfg from '../../config/config_declaration';

function get_linters(): string[] {
    const key_list = [
        cfg.e_linter_general_linter_vhdl.ghdl,
        cfg.e_linter_general_linter_vhdl.modelsim,
        cfg.e_linter_general_linter_vhdl.vivado,
        cfg.e_linter_general_linter_verilog.icarus,
        cfg.e_linter_general_linter_verilog.verilator,
        cfg.e_linter_general_lstyle_vhdl.vsg,
        cfg.e_linter_general_lstyle_verilog.verible,
    ];
    return key_list;
}

function get_linter_name(name_str: string): linter_common.t_linter_name {
    if (name_str === cfg.e_linter_general_linter_vhdl.ghdl) {
        return cfg.e_linter_general_linter_vhdl.ghdl;
    }
    else if (name_str === cfg.e_linter_general_linter_vhdl.modelsim) {
        return cfg.e_linter_general_linter_vhdl.modelsim;
    }
    else if (name_str === cfg.e_linter_general_linter_vhdl.vivado) {
        return cfg.e_linter_general_linter_vhdl.vivado;
    }
    else if (name_str === cfg.e_linter_general_linter_verilog.icarus) {
        return cfg.e_linter_general_linter_verilog.icarus;
    }
    else if (name_str === cfg.e_linter_general_lstyle_vhdl.vsg) {
        return cfg.e_linter_general_lstyle_vhdl.vsg;
    }
    else if (name_str === cfg.e_linter_general_lstyle_verilog.verible) {
        return cfg.e_linter_general_lstyle_verilog.verible;
    }
    else {
        return cfg.e_linter_general_linter_vhdl.ghdl;
    }
}

function get_norm_error(filename: string, error_list: linter_common.l_error[])
    : reporter.i_file_error {

    const i_file_error: reporter.i_file_error = {
        filePath: filename,
        messages: [],
        errorCount: 0,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        source: ''
    };

    let error_count = 0;
    let warning_count = 0;
    error_list.forEach(error_inst => {
        let severity = 0;
        if (error_inst.severity === linter_common.LINTER_ERROR_SEVERITY.ERROR) {
            severity = 2;
            ++error_count;
        }
        else {
            severity = 1;
            ++warning_count;
        }

        const error_norm: reporter.i_error = {
            ruleId: error_inst.description,
            severity: severity,
            message: error_inst.description,
            line: error_inst.location.position[0] + 1,
            column: error_inst.location.position[1],
            nodeType: '',
            messageId: '',
            endLine: error_inst.location.position[0],
            endColumn: error_inst.location.position[1] + 1
        };
        i_file_error.messages.push(error_norm);
    });
    i_file_error.errorCount = error_count;
    i_file_error.warningCount = warning_count;
    return i_file_error;
}


function print_summary(error_list: reporter.i_file_error[]) {
    const title = "Summary";
    const column_title = ["File", "Warnings", "Errors"];
    const column_color = ["white", "yellow", "red"];
    const row_list: any[] = [];

    error_list.forEach(error_inst => {
        const row = [error_inst.filePath, error_inst.warningCount, error_inst.errorCount];
        row_list.push(row);
    });
    printer.print_table(title, column_title, column_color, row_list);
}

function print_error_table(error_file: reporter.i_file_error) {
    // eslint-disable-next-line no-console
    const title = `Errors report for ${file_utils.get_filename(error_file.filePath)}`;
    const column_title = ["Severty", "Description"];
    const column_color = ["white", "green"];
    const row_list: any[] = [];

    const message_list = error_file.messages;

    const error_list: any[] = [];
    const warning_list: any[] = [];
    message_list.forEach(message_inst => {
        if (message_inst.severity !== 0) {
            error_list.push(message_inst);
        }
        else {
            warning_list.push(message_inst);
        }
    });

    const complete_list = warning_list.concat(error_list);
    complete_list.forEach(error_inst => {
        let severity = 'warning';
        if (error_inst.severity !== 0) {
            severity = 'error';
        }
        const row = [severity, error_inst.message];
        row_list.push(row);
    });

    printer.print_table(title, column_title, column_color, row_list);
}


function print_report(error_list: reporter.i_file_error[]) {
    print_summary(error_list);
    error_list.forEach(error_inst => {
        print_error_table(error_inst);
    });
}

type t_output_path = {
    html: string;
    html_detailed: string;
    junit: string;
    json: string;
    compact: string;
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


        html: Flags.string({
            description: 'HTML report path. E.g: report.html',
            hidden: false,
            multiple: false,
            required: false,
            default: ''
        }),
        "html-detailed": Flags.string({
            description: 'HTML detailed report path. E.g: report.html',
            hidden: false,
            multiple: false,
            required: false,
            default: ''
        }),
        junit: Flags.string({
            description: 'JUnit report path. E.g: report.xml',
            hidden: false,
            multiple: false,
            required: false,
            default: ''
        }),
        "json-format": Flags.string({
            description: 'JSON report path. E.g: report.xml',
            hidden: false,
            multiple: false,
            required: false,
            default: ''
        }),
        compact: Flags.string({
            description: 'Compact report path. E.g: report.txt',
            hidden: false,
            multiple: false,
            required: false,
            default: ''
        }),

        linter: Flags.string({
            description: 'Linter name',
            hidden: false,
            multiple: false,
            required: true,
            options: get_linters(),
            default: "ghdl"
        }),
        "linter-path": Flags.string({
            description: 'Directory to the location where tool binary is located. Empty to use the system path.',
            hidden: false,
            multiple: false,
            required: false,
            default: ""
        }),
        "linter-arguments": Flags.string({
            description: 'Arguments passed to the linter.',
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

    get_output_extension(type: reporter.TYPE_REPORT): string {
        if (type === reporter.TYPE_REPORT.HTML) {
            return 'html';
        }
        else if (type === reporter.TYPE_REPORT.HTML_DETAILED) {
            return '.html';
        }
        else if (type === reporter.TYPE_REPORT.JUNIT) {
            return '.xml';
        }
        else if (type === reporter.TYPE_REPORT.JSON) {
            return '.json';
        }
        else if (type === reporter.TYPE_REPORT.COMPACT) {
            return '.txt';
        }
        return 'txt';
    }

    create_report_inst(output_path_user: string, cmd_current_dir: string, error_list: reporter.i_file_error[],
        type: reporter.TYPE_REPORT, linter_name: string) {

        const extension_default = this.get_output_extension(type);
        const output_path = this.get_output_path(cmd_current_dir, output_path_user, extension_default);
        if (output_path === '') {
            return;
        }
        const report_str = reporter.get_report(type, error_list, linter_name);
        file_utils.save_file_sync(output_path, report_str);
    }

    create_report(output_path_list: t_output_path, cmd_current_dir: string,
        error_list: reporter.i_file_error[], linter_name: string) {
        // HTML
        this.create_report_inst(output_path_list.html, cmd_current_dir, error_list,
            reporter.TYPE_REPORT.HTML, linter_name);
        // HTML detailed
        this.create_report_inst(output_path_list.html_detailed, cmd_current_dir, error_list,
            reporter.TYPE_REPORT.HTML_DETAILED, linter_name);
        // JUnit
        this.create_report_inst(output_path_list.junit, cmd_current_dir, error_list,
            reporter.TYPE_REPORT.JUNIT, linter_name);
        // JSON
        this.create_report_inst(output_path_list.json, cmd_current_dir, error_list,
            reporter.TYPE_REPORT.JSON, linter_name);
        // compact
        this.create_report_inst(output_path_list.compact, cmd_current_dir, error_list,
            reporter.TYPE_REPORT.COMPACT, linter_name);
    }

    get_output_path(cmd_current_dir: string, current_path: string, file_extension: string): string {
        let output_path = '';
        if (current_path !== '') {
            // If path is a directory, it creates a default path
            if (file_utils.check_if_path_exist(current_path) && file_utils.check_if_file(current_path) === false) {
                output_path = path_lib.join(cmd_current_dir, `report.${file_extension}`);
            }

            output_path = file_utils.get_full_path(current_path);
            const output_directory = file_utils.get_directory(output_path);
            if (file_utils.check_if_path_exist(output_directory) === false) {
                printer.print_msg(`Output file folder "${output_directory}" doesn't exist.`, printer.T_LOG_LEVEL.ERROR);
                this.exit(-1);
            }
        }
        return output_path;
    }

    async run(): Promise<void> {
        const { flags } = await this.parse(MyCLI);

        const input_path = flags.input;
        const linter_name = flags.linter;
        const linter_path = flags['linter-path'];
        const linter_arguments = flags['linter-arguments'];
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

        const linter_manager = new Linter();
        const linter_options: linter_common.l_options = {
            path: linter_path,
            argument: linter_arguments
        };

        const error_list_end: reporter.i_file_error[] = [];
        for (let i = 0; i < hdl_file_list.length; i++) {
            const hdl_file = hdl_file_list[i];
            const error_list = await linter_manager.lint_from_file(get_linter_name(linter_name),
                hdl_file.filename, linter_options);
            const const_error_list_norm = get_norm_error(hdl_file.filename, error_list);
            error_list_end.push(const_error_list_norm);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Reports
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const output_report_path: t_output_path = {
            'html': flags.html,
            'html_detailed': flags["html-detailed"],
            'junit': flags.junit,
            'json': flags["json-format"],
            'compact': flags.compact,
        };

        this.create_report(output_report_path, cmd_current_dir, error_list_end, linter_name);

        if (silent === false) {
            print_report(error_list_end);
        }
    }
}
