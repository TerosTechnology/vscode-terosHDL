// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import * as path_lib from 'path';
import { Standalone_vhdl } from '../../src/colibri/formatter/standalone_vhdl';
import * as cfg from "../../src/colibri/config/config_declaration";
import { normalize_breakline_windows } from "../../src/colibri/utils/common_utils";
import { read_file_sync, save_file_sync,create_directory, remove_directory } from '../../src/colibri/utils/file_utils';

const C_OUTPUT_BASE_PATH = path_lib.join(__dirname, "out");
const C_EXPECTED_BASE_PATH = path_lib.join(__dirname, "helpers/expected");

function create_output() {
    remove_directory(C_OUTPUT_BASE_PATH);
    create_directory(C_OUTPUT_BASE_PATH, true);
    return C_OUTPUT_BASE_PATH;
}

describe('standalone_vhdl', () => {
    jest.setTimeout(1000000);

    beforeAll(() => {
        create_output();
    });
    it('vhdl_case_0', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_0.vhd');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
            name_case: cfg.e_formatter_standalone_name_case.lowercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: false,
            remove_comments: true,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config, "");

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_0.vhd');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_0.vhd'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_0b', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_0b.vhd');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.uppercase,
            name_case: cfg.e_formatter_standalone_name_case.uppercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: false,
            remove_comments: true,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config, "");

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_0b.vhd');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_0b.vhd'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_0c', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_0c.vhd');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.uppercase,
            name_case: cfg.e_formatter_standalone_name_case.uppercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: false,
            remove_comments: true,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.no_new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.no_new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config, "");

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_0c.vhd');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_0c.vhd'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_1', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_1.vhd');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
            name_case: cfg.e_formatter_standalone_name_case.lowercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: true,
            remove_comments: false,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.no_new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config, "");

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_1.vhd');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_1.vhd'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_2', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_2.vhdl');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
            name_case: cfg.e_formatter_standalone_name_case.lowercase,
            indentation: "    ",
            align_port_generic: true,
            align_comment: true,
            remove_comments: false,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.no_new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.no_new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config, "");

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_2.vhdl');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_2.vhdl'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_3', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_3.vhdl');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.uppercase,
            name_case: cfg.e_formatter_standalone_name_case.uppercase,
            indentation: "      ",
            align_port_generic: true,
            align_comment: false,
            remove_comments: false,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.no_new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.no_new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config, "");

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_3.vhdl');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_3.vhdl'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_4', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_4.vhdl');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
            name_case: cfg.e_formatter_standalone_name_case.lowercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: true,
            remove_comments: false,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config, "");

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_4.vhdl');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_4.vhdl'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
});
