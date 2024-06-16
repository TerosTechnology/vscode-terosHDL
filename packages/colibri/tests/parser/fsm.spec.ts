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
import { Factory } from "../../src/parser/factory";
import { LANGUAGE } from "../../src/common/general";
import { equal } from "assert";
import { normalize_breakline_windows } from "../../src/utils/common_utils";

const SECONDS = 1000;
jest.setTimeout(60 * SECONDS);
init();
const lang_list = [LANGUAGE.VHDL, LANGUAGE.VERILOG];

lang_list.forEach(lang_inst => {

    describe(`Check FSM for ${lang_inst}`, function () {
        it(`Normal`, async function () {
            const test_index = 0;
            await parse_fsm(lang_inst, test_index);
            check_test(test_index, lang_inst);
        });
    });
});

function init() {
    const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, 'fsm', 'out');
    try {
        fs.unlinkSync(C_OUTPUT_BASE_PATH);
    }
    // eslint-disable-next-line no-empty
    catch (error) { }
    fs.mkdirSync(C_OUTPUT_BASE_PATH, { recursive: true });
}

async function parse_fsm(lang: LANGUAGE, test_index: number) {
    const parser_common = new Factory();
    const parser = await parser_common.get_parser(lang);

    const test_path = paht_lib.join(__dirname, 'fsm', 'tests', `test_${test_index}.${lang}`);
    const code_hdl = fs.readFileSync(test_path).toString();

    const result = await parser.get_svg_sm(code_hdl, '!');
    const svg_list = result.svg;
    svg_list.forEach(function (svg_image: any) {
        const output_path = paht_lib.join(__dirname, 'fsm', 'out', `output_${test_index}_${lang}.svg`);
        fs.writeFileSync(output_path, svg_image.image);
    });
}

function check_test(test_index: number, lang: LANGUAGE) {
    const expected_path = paht_lib.join(__dirname, 'fsm', 'expected', `output_${test_index}_${lang}.svg`);
    const actual_path = paht_lib.join(__dirname, 'fsm', 'out', `output_${test_index}_${lang}.svg`);

    const expected = normalize_breakline_windows(fs.readFileSync(expected_path).toString());
    const actual = normalize_breakline_windows(fs.readFileSync(actual_path).toString());

    equal(expected, actual);
}
