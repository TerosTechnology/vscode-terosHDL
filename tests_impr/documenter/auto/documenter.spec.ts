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

import * as paht_lib from 'path';
import * as file_utils from '../../../src/utils/file_utils';
import * as cfg from "../../../src/config/config_declaration";
import * as common_documenter from "../../../src/documenter/common";
import { Documenter } from "../../../src/documenter/documenter";
import { t_documenter_options } from "../../../src/config/auxiliar_config";
import { HDL_LANG } from "../../../src/common/general";
import { get_language } from "../../../src/common/utils";
import { equal } from "assert";

export enum MODE {
    EXPECTED = "expected",
    OUT = "out",
}

const DEBUG_SELECTED_FILE = "example_2.v";

// Input
const C_INPUT_BASE_PATH_VHDL = paht_lib.join(__dirname, 'vhdl');
const C_INPUT_BASE_PATH_VERILOG = paht_lib.join(__dirname, 'verilog');

const input_vhdl = file_utils.read_directory(C_INPUT_BASE_PATH_VHDL);
const input_verilog = file_utils.read_directory(C_INPUT_BASE_PATH_VERILOG);
const input_total = input_vhdl.concat(input_verilog);

// Expected
const C_EXPECTED_BASE_PATH = paht_lib.join(__dirname, 'expected');

// Output
const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, 'out');
const OUTPUT_TYPE = common_documenter.doc_output_type.HTML;
file_utils.remove_directory(C_OUTPUT_BASE_PATH);
file_utils.create_directory(C_OUTPUT_BASE_PATH, true);

describe.skip(`Check documenter`, function () {
    input_total.forEach(input_inst => {
        it.skip(`Check ${input_inst}`, async function () {
            const filename = file_utils.get_filename(input_inst);
            if (DEBUG_SELECTED_FILE === filename) {
                await run(input_inst, OUTPUT_TYPE);
            }
        });
    });
});

async function run(input: string, output_type_inst: common_documenter.doc_output_type) {
    const configuration = get_config();
    const documenter = new Documenter();
    const output_path = get_path(input, MODE.OUT, output_type_inst);

    const input_content = file_utils.read_file_sync(input);
    const input_lang = get_language(input);

    await documenter.save_document(input_content, input_lang, configuration, input, output_path, output_type_inst);
    check_output(input, output_type_inst);
}

function check_output(input: string, output_type_inst: common_documenter.doc_output_type) {
    const expected_path = get_path(input, MODE.EXPECTED, output_type_inst);
    const output_path = get_path(input, MODE.OUT, output_type_inst);

    const expected_content = file_utils.read_file_sync(expected_path);
    const output_content = file_utils.read_file_sync(output_path);

    equal(expected_content, output_content);
}

function get_path(input: string, mode: MODE, output_type: common_documenter.doc_output_type) {
    let base_path = C_OUTPUT_BASE_PATH;
    if (mode === MODE.EXPECTED) {
        base_path = C_EXPECTED_BASE_PATH;
    }

    let extension = ".md";
    if (output_type === common_documenter.doc_output_type.HTML) {
        extension = ".html";
    }

    const input_filename = file_utils.get_filename(input, false);
    const input_lang = get_language(input);

    let lang_out = "vhdl";
    if (input_lang !== HDL_LANG.VHDL) {
        lang_out = "verilog";
    }
    const output_path = paht_lib.join(base_path, `${input_filename}_${lang_out}${extension}`);
    return output_path;
}

function get_config() {
    const configuration: t_documenter_options = {
        generic_visibility: cfg.e_documentation_general_generics.all,
        port_visibility: cfg.e_documentation_general_ports.all,
        signal_visibility: cfg.e_documentation_general_signals.all,
        constant_visibility: cfg.e_documentation_general_constants.all,
        type_visibility: cfg.e_documentation_general_types.all,
        task_visibility: cfg.e_documentation_general_tasks.all,
        function_visibility: cfg.e_documentation_general_functions.all,
        instantiation_visibility: cfg.e_documentation_general_instantiations.all,
        process_visibility: cfg.e_documentation_general_process.all,
        language: cfg.e_documentation_general_language.english,
        vhdl_symbol: '!',
        verilog_symbol: '!',
        enable_fsm: true
    };
    return configuration;
}