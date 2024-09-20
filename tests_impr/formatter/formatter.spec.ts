import { Formatter } from "../../../back_colibri/src/formatter/formatter";
import * as common from "../../../back_colibri/src/formatter/common";
import * as fs from 'fs';
import * as paht_lib from 'path';
import { HDL_LANG } from '../../../back_colibri/src/common/general';
import { equal } from "assert";
import { normalize_breakline_windows } from '../common_utils';
import { get_os } from "../../../back_colibri/src/process/utils";
import * as common_process from "../../../back_colibri/src/process/common";
import * as cfg from "../../../back_colibri/src/config/config_declaration";

const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, 'out');
fs.mkdirSync(C_OUTPUT_BASE_PATH, { recursive: true });

async function format_and_check(formatter_name: common.t_formatter_name, language: HDL_LANG,
    test_index: number, opt: any, python_path: string) {
    const formatter = new Formatter();

    const file_i = paht_lib.join(__dirname, 'helpers', formatter_name, `input_${test_index}.${language}`);
    const content_i = fs.readFileSync(file_i).toString('utf8');

    const file_o = paht_lib.join(__dirname, 'helpers', formatter_name, `output_${test_index}.${language}`);
    const expected = fs.readFileSync(file_o).toString('utf8');

    const output_path = paht_lib.join(C_OUTPUT_BASE_PATH, `${formatter_name}_${test_index}.${language}`);

    const formatter_result = await formatter.format_from_code(formatter_name, content_i, opt, python_path);
    fs.writeFileSync(output_path, formatter_result.code_formatted);

    equal(normalize_breakline_windows(formatter_result.code_formatted), normalize_breakline_windows(expected));
}

describe('Check standalone VHDL formatter', function () {
    const language = HDL_LANG.VHDL;
    const formatter_name = cfg.e_formatter_general_formatter_vhdl.standalone;

    it(`Check align comments true, indentation and keyworks lowercase`, async function () {
        const test_index = 0;

        const options: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
            name_case: cfg.e_formatter_standalone_name_case.lowercase,
            indentation: "    ",
            align_port_generic: true,
            align_comment: true,
            remove_comments: false,
            remove_reports: false,
            check_alias: false,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.none,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.none,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.none,
        };

        await format_and_check(formatter_name, language, test_index, options, "");
    });

    it(`Check align comments false, indentation and keyworks uppercase`, async function () {
        const test_index = 1;

        const options: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.uppercase,
            name_case: cfg.e_formatter_standalone_name_case.uppercase,
            indentation: "      ",
            align_port_generic: true,
            align_comment: false,
            remove_comments: false,
            remove_reports: false,
            check_alias: false,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.none,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.none,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.none,
        };

        await format_and_check(formatter_name, language, test_index, options, "");
    });
});

describe('Check istyle formatter', function () {
    const language = HDL_LANG.VERILOG;
    const formatter_name = cfg.e_formatter_general_formatter_verilog.istyle;

    const style_list = [cfg.e_formatter_istyle_style.ansi, cfg.e_formatter_istyle_style.kr,
    cfg.e_formatter_istyle_style.gnu, cfg.e_formatter_istyle_style.indent_only];

    for (let index = 0; index < style_list.length; index++) {
        const style_inst = style_list[index];
        it(`Check ${style_inst} with indent = 2`, async function () {
            const test_index = index;

            const options: cfg.e_formatter_istyle = {
                style: style_inst,
                indentation_size: 2
            };
            await format_and_check(formatter_name, language, test_index, options, "");
        });
    }

    for (let index = 0; index < style_list.length; index++) {
        const style_inst = style_list[index];
        it(`Check ${style_inst} with indent = 6`, async function () {
            const test_index = index + style_list.length;

            const options: cfg.e_formatter_istyle = {
                style: style_inst,
                indentation_size: 6
            };
            await format_and_check(formatter_name, language, test_index, options, "");
        });
    }
});

describe('Check s3sv formatter', function () {
    const language = HDL_LANG.SYSTEMVERILOG;
    const formatter_name = cfg.e_formatter_general_formatter_verilog.s3sv;

    const system_os = get_os();
    if (system_os === common_process.OS.WINDOWS || system_os === common_process.OS.MAC) {
        jest.setTimeout(10000);
    }

    it(`Check config 0`, async function () {
        const test_index = 0;

        const options: cfg.e_formatter_s3sv = {
            one_bind_per_line: true,
            one_declaration_per_line: true,
            use_tabs: false,
            indentation_size: 2
        };
        await format_and_check(formatter_name, language, test_index, options, "");
    });

    it(`Check config 1`, async function () {
        const test_index = 1;

        const options: cfg.e_formatter_s3sv = {
            one_bind_per_line: true,
            one_declaration_per_line: true,
            use_tabs: true,
            indentation_size: 4
        };
        await format_and_check(formatter_name, language, test_index, options, "");
    });

    it(`Check config 2 and bad python3 path`, async function () {
        const test_index = 2;

        const options: cfg.e_formatter_s3sv = {
            one_bind_per_line: false,
            one_declaration_per_line: true,
            use_tabs: true,
            indentation_size: 2
        };
        await format_and_check(formatter_name, language, test_index, options, "asdf");
    });
});
