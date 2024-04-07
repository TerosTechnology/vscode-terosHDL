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
import * as paht_lib from 'path';
import * as common_documenter from "../../src/documenter/common";
import { Documenter } from "../../src/documenter/documenter";
import { LANGUAGE } from "../../src/common/general";
import * as common_process from "../../src/process/common";
import { get_os } from "../../src/process/utils";
import * as cfg from "../../src/config/config_declaration";
import { t_documenter_options } from "../../src/config/auxiliar_config";
import { normalize_breakline_windows } from "../../src/utils/common_utils";
import { read_file_sync } from '../../src/utils/file_utils';

const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, 'complete');

const output_types = [common_documenter.doc_output_type.HTML, common_documenter.doc_output_type.MARKDOWN];

output_types.forEach(output_type_inst => {
    describe(`Check documenter creator with ${output_type_inst}`, function () {

        const system_os = get_os();
        if (system_os === common_process.OS.WINDOWS || system_os === common_process.OS.MAC) {
            jest.setTimeout(115000);
        }
        jest.setTimeout(115000);

        it(`Entity VHDL`, async function () {
            const hdl_lang = LANGUAGE.VHDL;
            const hdl_type = 'entity';

            await run(hdl_type, hdl_lang, output_type_inst);
        });

        it(`Package VHDL`, async function () {
            const hdl_lang = LANGUAGE.VHDL;
            const hdl_type = 'package';

            await run(hdl_type, hdl_lang, output_type_inst);
        });

        it(`Module Verilog`, async function () {
            const hdl_lang = LANGUAGE.VERILOG;
            const hdl_type = 'entity';

            await run(hdl_type, hdl_lang, output_type_inst);
        });

        it(`Package SystemVerilog`, async function () {
            const hdl_lang = LANGUAGE.SYSTEMVERILOG;
            const hdl_type = 'package';

            await run(hdl_type, hdl_lang, output_type_inst);
        });


        it(`Interface SystemVerilog`, async function () {
            const hdl_lang = LANGUAGE.SYSTEMVERILOG;
            const hdl_type = 'interface';

            await run(hdl_type, hdl_lang, output_type_inst);
        });

    });
});

async function run(hdl_type: string, hdl_lang: LANGUAGE, output_type_inst: common_documenter.doc_output_type) {
    const configuration = get_config();
    const input = get_input(hdl_type, hdl_lang);
    const documenter = new Documenter();
    const output_path = get_output_path(output_type_inst, hdl_type, hdl_lang);
    await documenter.save_document(input.hdl_code, hdl_lang, configuration, input.path, output_path, output_type_inst);
    if (output_type_inst === common_documenter.doc_output_type.HTML) {
        check_html(hdl_type, hdl_lang);
    }
}

function check_html(hdl_type: string, hdl_lang: LANGUAGE) {
    const expected_path = paht_lib.join(C_OUTPUT_BASE_PATH, 'expected', `${hdl_type}_${hdl_lang}_html`, 'output.html');
    const output_path = paht_lib.join(C_OUTPUT_BASE_PATH, 'out', `${hdl_type}_${hdl_lang}_html`, 'output.html');

    const expected_content = read_file_sync(expected_path);
    const output_content = read_file_sync(output_path);
    const expected_result_fix = normalize_breakline_windows(expected_content);
    expect(expected_result_fix).toBe(output_content);
}

function get_input(hdl_type: string, hdl_lang: LANGUAGE) {
    const input_path =
        paht_lib.join(C_OUTPUT_BASE_PATH, `${hdl_type}.${hdl_lang}`);

    const hdl_code = read_file_sync(input_path);

    return { path: input_path, hdl_code: hdl_code };
}

function get_output_path(output_type: common_documenter.doc_output_type,
    hdl_type: string, hdl_lang: LANGUAGE) {

    let output = paht_lib.join(C_OUTPUT_BASE_PATH, 'out', `${hdl_type}_${hdl_lang}_${output_type}`);
    // fs.rmSync(output, { recursive: true });
    fs.mkdirSync(output, { recursive: true });
    output = paht_lib.join(output, `output.${output_type}`);
    return output;
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