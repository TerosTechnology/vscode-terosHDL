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

import { Base_formatter } from "./base_formatter";
import * as common from "./common";
import * as cfg from "../config/config_declaration";
import { beautify, BeautifierSettings, signAlignSettings, NewLineSettings } from "./bin/standalone_vhdl/VHDLFormatter";
import * as file_utils from "../utils/file_utils";

export class Standalone_vhdl extends Base_formatter {
    constructor() {
        super();
    }

    public async format_from_code(code: string, opt: cfg.e_formatter_standalone): Promise<common.f_result> {
        try {
            const code_formatted = <string>beautify(code, this.get_settings(opt));
            const result: common.f_result = {
                code_formatted: code_formatted,
                command: "",
                successful: true,
                message: "",
            };
            return result;
        } catch (error) {
            const result: common.f_result = {
                code_formatted: "",
                command: "",
                successful: false,
                message: "",
            };
            return result;
        }
    }

    public async format(file: string, opt: cfg.e_formatter_standalone): Promise<common.f_result> {
        const file_content = file_utils.read_file_sync(file);
        const result = this.format_from_code(file_content, opt);
        return result;
    }

    get_settings(opt: cfg.e_formatter_standalone): BeautifierSettings {
        const END_OF_LINE = '\n';

        // Align mode
        const ALIGN_MODE = "local";
        const IS_ALL = opt.align_port_generic;
        const IS_REGIONAL = opt.align_port_generic;

        const align_keyword_list = ['FUNCTION', 'IMPURE FUNCTION', 'GENERIC', 'PORT', 'PROCEDURE'];
        // if (opt.align_port === true) {
        //     align_keyword_list.push('PORT');
        // }
        // if (opt.align_generic === true) {
        //     align_keyword_list.push('GENERIC');
        // }
        // if (opt.align_procedure === true) {
        //     align_keyword_list.push('PROCEDURE');
        // }
        // if (opt.align_function === true) {
        //     align_keyword_list.push('FUNCTION');
        // }

        const sign_align_settings = new signAlignSettings(IS_REGIONAL, IS_ALL, ALIGN_MODE, align_keyword_list);

        // New line settings
        const new_line_settings = new NewLineSettings();

        if (opt.new_line_after_then === cfg.e_formatter_standalone_new_line_after_then.new_line) {
            new_line_settings.newLineAfterPush('THEN');
        }
        else if (opt.new_line_after_then === cfg.e_formatter_standalone_new_line_after_then.no_new_line) {
            new_line_settings.noNewLineAfterPush('THEN');
        }

        if (opt.new_line_after_semicolon === cfg.e_formatter_standalone_new_line_after_semicolon.new_line) {
            new_line_settings.newLineAfterPush(';');
        }
        else if (opt.new_line_after_semicolon === cfg.e_formatter_standalone_new_line_after_semicolon.no_new_line) {
            new_line_settings.noNewLineAfterPush(';');
        }

        if (opt.new_line_after_else === cfg.e_formatter_standalone_new_line_after_else.new_line) {
            new_line_settings.newLineAfterPush('ELSE');
        }
        else if (opt.new_line_after_else === cfg.e_formatter_standalone_new_line_after_else.no_new_line) {
            new_line_settings.noNewLineAfterPush('ELSE');
        }

        if (opt.new_line_after_port === cfg.e_formatter_standalone_new_line_after_port.new_line) {
            new_line_settings.newLineAfterPush('PORT');
            new_line_settings.newLineAfterPush('PORT MAP');
        }
        else if (opt.new_line_after_port === cfg.e_formatter_standalone_new_line_after_port.no_new_line) {
            new_line_settings.noNewLineAfterPush('PORT');
        }

        if (opt.new_line_after_generic === cfg.e_formatter_standalone_new_line_after_generic.new_line) {
            new_line_settings.newLineAfterPush('GENERIC');
        }
        else if (opt.new_line_after_generic === cfg.e_formatter_standalone_new_line_after_generic.no_new_line) {
            new_line_settings.noNewLineAfterPush('GENERIC');
        }

        const settings = new BeautifierSettings(opt.remove_comments, opt.remove_reports, opt.check_alias,
            opt.align_comment, sign_align_settings, opt.keyword_case, opt.name_case, opt.indentation,
            new_line_settings, END_OF_LINE);

        return settings;
    }
}