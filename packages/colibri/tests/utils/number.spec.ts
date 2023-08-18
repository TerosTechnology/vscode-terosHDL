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

import { hdl_hover } from "../../src/utils/numbers";
import { HDL_LANG } from "../../src/common/general";
import { deepEqual } from "assert";

// https://www.rapidtables.com/convert/number/hex-to-decimal.html

describe('Check hover VHDL', function () {
    const lang = HDL_LANG.VHDL;

    it(`Binary unsigned`, async function () {
        const code_dummy = '"0011"';
        const expected_number = {
            signed_n: 0,
            unsigned_n: 3,
            is_multi: false,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Binary unsigned or signed`, async function () {
        const code_dummy = '"1101"';
        const expected_number = {
            signed_n: -3,
            unsigned_n: 13,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Binary unsigned or signed with separator`, async function () {
        const code_dummy = '"1_10_0"';
        const expected_number = {
            signed_n: -4,
            unsigned_n: 12,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Hexadeximal unsigned`, async function () {
        const code_dummy = 'x"0aB0"';
        const expected_number = {
            signed_n: 0,
            unsigned_n: 2736,
            is_multi: false,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Hexadeximal unsigned or signed`, async function () {
        const code_dummy = 'x"aaB0"';
        const expected_number = {
            signed_n: -21840,
            unsigned_n: 43696,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Hexadeximal unsigned or signed with separator`, async function () {
        const code_dummy = 'x"a_a_b0"';
        const expected_number = {
            signed_n: -21840,
            unsigned_n: 43696,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Octal unsigned`, async function () {
        const code_dummy = 'o"0175"';
        const expected_number = {
            signed_n: 0,
            unsigned_n: 125,
            is_multi: false,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Octal unsigned or signed`, async function () {
        const code_dummy = 'O"232"';
        const expected_number = {
            signed_n: -102,
            unsigned_n: 154,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Octal unsigned or signed with separator`, async function () {
        const code_dummy = 'o"2_3_2"';
        const expected_number = {
            signed_n: -102,
            unsigned_n: 154,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });
});

describe('Check hover Verilog', function () {
    const lang = HDL_LANG.VERILOG;

    it(`Binary unsigned`, async function () {
        const code_dummy = "4'b0011'";
        const expected_number = {
            signed_n: 0,
            unsigned_n: 3,
            is_multi: false,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Binary unsigned or signed`, async function () {
        const code_dummy = "4'b1101'";
        const expected_number = {
            signed_n: -3,
            unsigned_n: 13,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Binary unsigned or signed with separator`, async function () {
        const code_dummy = "4'b1_10_0'";
        const expected_number = {
            signed_n: -4,
            unsigned_n: 12,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Hexadeximal unsigned`, async function () {
        const code_dummy = "4'h0aB0'";
        const expected_number = {
            signed_n: 0,
            unsigned_n: 2736,
            is_multi: false,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Hexadeximal unsigned or signed`, async function () {
        const code_dummy = "4'haaB0'";
        const expected_number = {
            signed_n: -21840,
            unsigned_n: 43696,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Hexadeximal unsigned or signed with separator`, async function () {
        const code_dummy = "4'ha_a_b0'";
        const expected_number = {
            signed_n: -21840,
            unsigned_n: 43696,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Octal unsigned`, async function () {
        const code_dummy = "4'o0175'";
        const expected_number = {
            signed_n: 0,
            unsigned_n: 125,
            is_multi: false,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Octal unsigned or signed`, async function () {
        const code_dummy = "4'o232'";
        const expected_number = {
            signed_n: -102,
            unsigned_n: 154,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });

    it(`Octal unsigned or signed with separator`, async function () {
        const code_dummy = "4'o2_3_2'";
        const expected_number = {
            signed_n: -102,
            unsigned_n: 154,
            is_multi: true,
            is_ok: true
        };
        const current_number = hdl_hover(code_dummy, lang);
        deepEqual(current_number, expected_number);
    });
});
