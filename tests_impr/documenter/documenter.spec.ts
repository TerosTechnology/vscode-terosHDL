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
import { HDL_LANG } from "../../src/common/general";
import * as common_process from "../../src/process/common";
import { get_os } from "../../src/process/utils";
import * as cfg from "../../src/config/config_declaration";
import { t_documenter_options } from "../../src/config/auxiliar_config";
import { equal } from "assert";

const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, 'complete');

const output_types = [common_documenter.doc_output_type.HTML, common_documenter.doc_output_type.MARKDOWN];

output_types.forEach(output_type_inst => {
    describe.skip(`Check documenter creator with ${output_type_inst}`, function () {

        const system_os = get_os();
        if (system_os === common_process.OS.WINDOWS || system_os === common_process.OS.MAC) {
            jest.setTimeout(115000);
        }
        jest.setTimeout(115000);

        it(`Entity VHDL`, async function () {
            const hdl_lang = HDL_LANG.VHDL;
            const hdl_type = 'entity';

            await run(hdl_type, hdl_lang, output_type_inst);
        });

        it(`Package VHDL`, async function () {
            const hdl_lang = HDL_LANG.VHDL;
            const hdl_type = 'package';

            await run(hdl_type, hdl_lang, output_type_inst);
        });

        it(`Module Verilog`, async function () {
            const hdl_lang = HDL_LANG.VERILOG;
            const hdl_type = 'entity';

            await run(hdl_type, hdl_lang, output_type_inst);
        });

        it(`Package SystemVerilog`, async function () {
            const hdl_lang = HDL_LANG.SYSTEMVERILOG;
            const hdl_type = 'package';

            await run(hdl_type, hdl_lang, output_type_inst);
        });


        it(`Interface SystemVerilog`, async function () {
            const hdl_lang = HDL_LANG.SYSTEMVERILOG;
            const hdl_type = 'interface';

            await run(hdl_type, hdl_lang, output_type_inst);
        });

    });
});

async function run(hdl_type: string, hdl_lang: HDL_LANG, output_type_inst: common_documenter.doc_output_type) {
    const configuration = get_config();
    const input = get_input(hdl_type, hdl_lang);
    const documenter = new Documenter();
    const output_path = get_output_path(output_type_inst, hdl_type, hdl_lang);
    await documenter.save_document(input.hdl_code, hdl_lang, configuration, input.path, output_path, output_type_inst);
    if (output_type_inst === common_documenter.doc_output_type.HTML) {
        check_html(hdl_type, hdl_lang);
    }
}

function check_html(hdl_type: string, hdl_lang: HDL_LANG) {
    const expected_path = paht_lib.join(C_OUTPUT_BASE_PATH, 'expected', `${hdl_type}_${hdl_lang}_html`, 'output.html');
    const output_path = paht_lib.join(C_OUTPUT_BASE_PATH, 'out', `${hdl_type}_${hdl_lang}_html`, 'output.html');

    const expected_content = fs.readFileSync(expected_path).toString('utf8');
    const output_content = fs.readFileSync(output_path).toString('utf8');

    equal(expected_content, output_content);
}

function get_input(hdl_type: string, hdl_lang: HDL_LANG) {
    const input_path =
        paht_lib.join(C_OUTPUT_BASE_PATH, `${hdl_type}.${hdl_lang}`);

    const hdl_code = fs.readFileSync(input_path).toString();

    return { path: input_path, hdl_code: hdl_code };
}

function get_output_path(output_type: common_documenter.doc_output_type,
    hdl_type: string, hdl_lang: HDL_LANG) {

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