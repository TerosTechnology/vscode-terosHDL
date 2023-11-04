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
import * as file_utils from './file_utils';

/**
 * Check if file is HDL
 * @param file_path File path. E.g: /home/user/file.vhd
 * @returns True if file is HDL
**/
export function check_if_hdl_file(file_path: string): boolean {
    const lang = file_utils.get_language_from_filepath(file_path);
    return check_if_hdl_language(lang);
}

/**
 * Check if language is HDL
 * @param language Language
 * @returns True if language is HDL
**/
export function check_if_hdl_language(language: LANGUAGE): boolean {
    return (language === LANGUAGE.VHDL || language === LANGUAGE.VERILOG || language === LANGUAGE.SYSTEMVERILOG);
}

/**
 * Remove comments from VHDL code
 * @param content VHDL code
 * @returns VHDL code without comments
**/
export function remove_comments_vhdl(content: string): string {
    const l_comment = new RegExp([
        /--.*/
    ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
    const b_comment = new RegExp([
        /\*[\s\S]*?\*\//
    ].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');

    let match = content.match(b_comment);
    if (match != null) {
        for (let i = 0; i < match.length; i++) {
            const element = match[i];
            const newElement = element.replace(/\S/g, ' ');
            content = content.replace(element, newElement);
        }
    }
    match = content.match(l_comment);
    if (match != null) {
        for (let i = 0; i < match.length; i++) {
            const element = match[i];
            const newElement = element.replace(/\S/g, ' ');
            content = content.replace(element, newElement);
        }
    }
    return content;
}

/**
 * Remove comments from Verilog code
 * @param content Verilog code
 * @returns Verilog code without comments
**/
export function remove_comments_verilog(content: string): string {
    const l_comment = new RegExp([
        /\/\/.*/].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
    const b_comment = new RegExp([
        /\/\*[\s\S]*?\*\//].map(x => (typeof x === 'string') ? x : x.source).join(''), 'mg');
    let match = content.match(b_comment);
    if (match != null) {
        for (let i = 0; i < match.length; i++) {
            const element = match[i];
            const newElement = element.replace(/\S/g, ' ');
            content = content.replace(element, newElement);
        }
    }
    match = content.match(l_comment);
    if (match != null) {
        for (let i = 0; i < match.length; i++) {
            const element = match[i];
            const newElement = element.replace(/\S/g, ' ');
            content = content.replace(element, newElement);
        }
    }
    return content;
}

/**
 * Get top level from code
 * @param code HDL code
 * @param lang HDL language
 * @returns Top level name
**/
export function get_toplevel(code: string, lang: LANGUAGE): string {
    if (!check_if_hdl_language(lang)) { return ''; }
    let result;
    let regex;
    if (lang === LANGUAGE.VHDL) {
        code = remove_comments_vhdl(code);
        regex = /(entity|package)\s+(?<name>\w+)\s*is\s*/gim;
        result = regex.exec(code);
        if (result !== null && result !== undefined && result.length >= 3) {
            return result[2];
        }
    }
    else {
        //Remove comments
        code = remove_comments_verilog(code);
        regex = /(?<type>module|program|interface|package|primitive|config|property)\s+(?:automatic\s+)?(?<name>\w+)/gm;
        result = regex.exec(code);
        if (result !== null && result !== undefined && result.length >= 3) {
            return result[2];
        }
    }
    return '';
}

export function get_toplevel_from_path(filepath: string): string {
    if (file_utils.check_if_file(filepath) === false) {
        return '';
    }
    if (!check_if_hdl_file(filepath)) { return ''; }

    const code = file_utils.read_file_sync(filepath);
    const entity_name = get_toplevel(code, file_utils.get_language_from_filepath(filepath));
    return entity_name;
}