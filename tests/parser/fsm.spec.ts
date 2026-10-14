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
import { Factory } from "../../src/colibri/parser/factory";
import { equal } from "assert";
import { normalize_breakline_windows } from "../../src/colibri/utils/common_utils";
import { Hdl_element } from "../../src/colibri/parser/common";
import { Paser_fsm_vhdl } from "../../src/colibri/parser/ts_vhdl/fsm";
import { Vhdl_parser } from "../../src/colibri/parser/ts_vhdl/parser";
import { Parser_base } from "../../src/colibri/parser/parser";
import { Ts_base_parser } from "../../src/colibri/parser/ts_base_parser";
import * as elements_hdl from "../../src/colibri/parser/ts_vhdl/elements";
import { LANGUAGE } from "../../src/colibri/common/general";
import * as common_hdl from "../../src/colibri/parser/common";
import * as Parser from "web-tree-sitter";
import { Parser_fsm_base } from 'colibri/parser/fsm_base_parser';

const SECONDS = 1000;
jest.setTimeout(60 * SECONDS);
init();
//const lang_list = [LANGUAGE.VHDL, LANGUAGE.VERILOG];
const lang_list = [LANGUAGE.VHDL];

lang_list.forEach(lang_inst => {

    describe(`Check FSM for ${lang_inst}`, function () {
        it(`Normal`, async function () {
            const test_index = 0;
            await parse_fsm(lang_inst, test_index);
            check_test(test_index, lang_inst);
        });
    });
});

function init(): void {
    const C_OUTPUT_BASE_PATH = paht_lib.join(__dirname, 'fsm', 'out');
    try {
        fs.unlinkSync(C_OUTPUT_BASE_PATH);
    }
    // eslint-disable-next-line no-empty
    catch (error) { }
    fs.mkdirSync(C_OUTPUT_BASE_PATH, { recursive: true });
}

async function parse_fsm(lang: LANGUAGE, test_index: number): Promise<void> {
    const parser_common = new Factory();
    const parser = await parser_common.get_parser(lang);

    const test_path = paht_lib.join(__dirname, 'fsm', 'tests', `aac.vhd`);
    console.log (test_path);
    //const test_path = paht_lib.join(__dirname, 'fsm', 'tests', `test_${test_index}.${lang}`);
    const code_hdl = fs.readFileSync(test_path).toString();


        const a1 = new Paser_fsm_vhdl ('', parser);
        const b1 = new Vhdl_parser();
        await b1.init();
        //b1.get_all (code_hdl, '');
        await a1.init();
        let tree = a1.parser.parse (code_hdl);
        a1.get_svg_sm(code_hdl, '');
        let a2 = a1.get_process(tree);
        //let a3 = a1.get_state_names_from_case (tree2).map (v => v.toLowerCase())
    const aaa = new Hdl_element(LANGUAGE.VHDL, common_hdl.TYPE_HDL_ELEMENT.SIGNAL);
        b1.get_svg_sm(code_hdl, '');
        let a3 = b1.get_declaration_elements ('', code_hdl, aaa);
        console.log (aaa);
    const result1 = parser.get_all;
          //let  tree = result.parse(code_hdl);
    console.log (result1);

    const result = await parser.get_svg_sm(code_hdl, '!');
    const svg_list = result.svg;
    svg_list.forEach(function (svg_image: any) {
        const output_path = paht_lib.join(__dirname, 'fsm', 'out', `output_${test_index}_${lang}.svg`);
        fs.writeFileSync(output_path, svg_image.image);
    });
}

function check_test(test_index: number, lang: LANGUAGE): void {
    const expected_path = paht_lib.join(__dirname, 'fsm', 'expected', `output_${test_index}_${lang}.svg`);
    const actual_path = paht_lib.join(__dirname, 'fsm', 'out', `output_${test_index}_${lang}.svg`);

    const expected = normalize_breakline_windows(fs.readFileSync(expected_path).toString());
    const actual = normalize_breakline_windows(fs.readFileSync(actual_path).toString());

    equal(expected, actual);
}
