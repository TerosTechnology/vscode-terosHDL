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

import { LANGUAGE } from "../common/general";

export type result_t = {
    signed_n: number;
    unsigned_n: number;
    is_multi: boolean;
    is_ok: boolean;
}

export function hdl_hover(txt: string, lang: LANGUAGE) {
    if (lang === LANGUAGE.VHDL) {
        return vhdl_hover(txt);
    }
    else {
        return verilog_hover(txt);
    }
}

function vhdl_hover(leading_text: string): result_t {
    const result: result_t = {
        signed_n: 0,
        unsigned_n: 0,
        is_multi: false,
        is_ok: false
    };
    leading_text = leading_text.toLowerCase();
    // Hexadecimal
    if (/x"[0-9a-fA-F_]+"/g.test(leading_text)) {
        const regex = /x"([0-9a-fA-F_]+)"/g;
        const number = regex.exec(leading_text.replace(/_/g, ''));
        if (number === null || number[1] === null) {
            return result;
        }
        const x = parseInt(number[1], 16);
        const x1 = eval_signed_hex(number[1], x);
        if (x === x1) {
            result.unsigned_n = x;
            result.is_ok = true;
        } else {
            result.unsigned_n = x;
            result.signed_n = x1;
            result.is_ok = true;
            result.is_multi = true;
        }
        return result;
    }
    // Octal
    else if (/o"[0-7_]+"/g.test(leading_text)) {
        const regex = /([0-7_]+)"/g;
        const number = regex.exec(leading_text.replace(/_/g, ''));
        if (number === null || number[1] === null) {
            return result;
        }
        const x = parseInt(number[1], 8);
        const x1 = eval_signed_oct(number[1], x);
        if (x === x1) {
            result.unsigned_n = x;
            result.is_ok = true;
        } else {
            result.unsigned_n = x;
            result.signed_n = x1;
            result.is_ok = true;
            result.is_multi = true;
        }
    }
    // Binary
    else if (/[0-1_]+"/g.test(leading_text)) {
        const regex = /([0-1_]+)"/g;
        const number = regex.exec(leading_text.replace(/_/g, ''));
        if (number === null || number[1] === null) {
            return result;
        }
        const x = parseInt(number[0], 2);
        const x1 = eval_signed_bin(number[0], x);
        if (x === x1) {
            result.unsigned_n = x;
            result.is_ok = true;
        } else {
            result.unsigned_n = x;
            result.signed_n = x1;
            result.is_ok = true;
            result.is_multi = true;
        }
    }
    return result;
}

function verilog_hover(leading_text: string): result_t {
    const result: result_t = {
        signed_n: 0,
        unsigned_n: 0,
        is_multi: false,
        is_ok: false
    };

    if (/h[0-9a-fA-F_]+/g.test(leading_text)) {
        const regex = /h([0-9a-fA-F_]+)/g;
        const number = regex.exec(leading_text.replace(/_/g, ''));
        if (number === null || number[1] === null) {
            return result;
        }
        const x = parseInt(number[1], 16);
        const x1 = eval_signed_hex(number[1], x);
        if (x === x1) {
            result.unsigned_n = x;
            result.is_ok = true;
        } else {
            result.unsigned_n = x;
            result.signed_n = x1;
            result.is_ok = true;
            result.is_multi = true;
        }
    }
    else if (/b[0-1_]+/g.test(leading_text)) {
        const regex = /b([0-1_]+)/g;
        const number = regex.exec(leading_text.replace(/_/g, ''));
        if (number === null || number[1] === null) {
            return result;
        }
        const x = parseInt(number[1], 2);
        const x1 = eval_signed_bin(number[1], x);
        if (x === x1) {
            result.unsigned_n = x;
            result.is_ok = true;
        } else {
            result.unsigned_n = x;
            result.signed_n = x1;
            result.is_ok = true;
            result.is_multi = true;
        }
    }
    else if (/o[0-8_]+/g.test(leading_text)) {
        const regex = /o([0-7_]+)/g;
        const number = regex.exec(leading_text.replace(/_/g, ''));
        if (number === null || number[1] === null) {
            return result;
        }
        const x = parseInt(number[1], 8);
        const x1 = eval_signed_oct(number[1], x);
        if (x === x1) {
            result.unsigned_n = x;
            result.is_ok = true;
        } else {
            result.unsigned_n = x;
            result.signed_n = x1;
            result.is_ok = true;
            result.is_multi = true;
        }
    }
    return result;
}

function normalize(txt: string): string {
    return txt.replace(/"/g, '').replace(/'/g, '');
}

function eval_signed_hex(number_s: string, int_number: number): number {
    number_s = normalize(number_s);
    const pow_hex = Math.pow(16, number_s.length);
    let x1 = int_number;
    if (int_number >= pow_hex >> 1) {
        x1 = int_number - pow_hex;
    }
    return x1;
}

function eval_signed_bin(number_s: string, int_number: number): number {
    number_s = normalize(number_s);
    const pow_bin = 1 << number_s.length;
    let x1 = int_number;
    if (number_s[0] === '1') {
        x1 = int_number - pow_bin;
    }
    return x1;
}

function eval_signed_oct(_number_s: string, int_number: number): number {
    return eval_signed_hex(int_number.toString(16), int_number);
    // const pow_oct = Math.pow(8, number_s.length);
    // let x1 = int_number;
    // if (int_number >= pow_oct >> 1) {
    //     x1 = int_number - pow_oct;
    // }
    // return x1;
}