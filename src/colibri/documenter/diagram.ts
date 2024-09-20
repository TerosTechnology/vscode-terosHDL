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

import * as common_hdl from "../parser/common";
import * as doxygen from "./doxygen_parser";

const INPUT_LABEL_LIST = ['in', 'input'];
const OUTPUT_LABEL_LIST = ['out', 'output', 'inout', 'buffer'];

export type Diagram_options = {
    blackandwhite: boolean;
};

export function diagram_generator(structure: common_hdl.Hdl_element, opt: Diagram_options): string {
    const window = require('svgdom');
    const SVG = require('svg.js')(window);
    const document = window.document;

    const canvas = SVG(document.documentElement);
    canvas.clear();
    let border = 'black';
    let genBox = '#bdecb6';  //'blue'
    let portBox = '#fdfd96';  //'red'
    let locx = 200;
    let locy = 0;
    let width = 100;
    let high = 100;
    let total_high = 100;
    const size = 20;
    const font = 'Helvetica';
    const offset = 10;
    const text_offset = 7;
    const text_space = 15;
    const text_space_pin = text_space / 3;
    const separator = 10;
    const name = 0;
    const kind = 1;
    let generics: any = [[], []];
    let in_ports: any = [[], []];
    let out_ports: any = [[], []];

    if (opt.blackandwhite) {
        border = 'black';
        genBox = 'white';
        portBox = 'white';
    }

    generics = get_generics(structure, name, kind);
    in_ports = get_ports_in(structure, name, kind);
    out_ports = get_ports_out(structure, name, kind);
    locx = (size / 2) * max_string(generics, in_ports, [0, 0], kind) + 2 * offset;
    width = (size / 2) * (max_string(generics, in_ports, [0, 0], name) + max_string([0, 0], [0, 0], out_ports, name));
    if ((generics[0].length === 0 && in_ports[0].length === 0) || out_ports[0].length === 0) {
        width = width * 1.5;
    }
    let min_x = 0;
    let max_x = 0;
    let max_leght_text_x = 0;
    let max_leght_text_out_kind = 0;

    //generic square
    high = size * generics[0].length;
    total_high = high + offset / 2;
    if (generics[0].length > 0) {
        canvas.rect(width, high + offset).fill(border).move(locx, locy);
        canvas.rect(width - 4, high + offset / 2).fill(genBox).move(locx + 2, locy + 2);
        //write generics
        for (let i = 0; i < generics[0].length; i++) {
            locy = size * i + offset / 2;
            let textleft = canvas.text(generics[kind][i]).move(locx - text_space - text_space_pin, locy - text_offset)
                .font({ family: font, size: size, anchor: 'end' });
            textleft = canvas.text(generics[name][i]).move(locx + text_space, locy - text_offset)
                .font({ family: font, size: size, anchor: 'start' });
            const max_local = generics[name][i].length + generics[kind][i].length;
            max_leght_text_x = Math.max(max_leght_text_x, max_local);
            max_x = max_leght_text_x;
            min_x = Math.min(min_x, textleft['node'].getAttribute('x'));
            canvas.line(locx - text_space, 0, locx, 0).move(locx - text_space, locy + size * 2 / 4)
                .stroke({ color: 'black', width: size / 4, linecap: 'rec' });
        }
    }
    //ports square
    locy = high + offset / 2 + separator;
    high = size * Math.max(in_ports[0].length, out_ports[0].length);
    total_high = total_high + high + offset / 2;
    if (in_ports[0].length > 0 || out_ports[0].length > 0) {
        canvas.rect(width, high + offset).fill(border).move(locx, locy);
        canvas.rect(width - 4, high + offset / 2).fill(portBox).move(locx + 2, locy + 2);
        //write ports
        for (let i = 0; i < in_ports[0].length; i++) {
            locy = size * generics[0].length + offset + size * i + separator;
            let textleft = canvas.text(in_ports[kind][i]).move(locx - text_space - text_space_pin, locy - text_offset)
                .font({ family: font, size: size, anchor: 'end' });
            textleft = canvas.text(in_ports[name][i]).move(locx + text_space, locy - text_offset)
                .font({ family: font, size: size, anchor: 'start' });
            const max_local = in_ports[kind][i].length;
            max_leght_text_x = Math.max(max_leght_text_x, max_local);
            min_x = Math.min(min_x, textleft['node'].getAttribute('x'));
            canvas.line(locx - text_space, 0, locx, 0).move(locx - text_space, locy + size * 2 / 4)
                .stroke({ color: 'black', width: size / 4, linecap: 'rec' });
        }
    }
    max_x = width;
    max_leght_text_out_kind = Math.max(max_leght_text_x + offset, offset);
    if (out_ports[0].length > 0) {
        max_x = 0;
        max_leght_text_out_kind = 0;
        for (let i = 0; i < out_ports[0].length; i++) {
            locy = size * generics[0].length + offset + size * i + separator;
            let textright = canvas.text(out_ports[kind][i])
                .move(locx + width + text_space + text_space_pin, locy - text_offset)
                .font({ family: font, size: size, anchor: 'start' });
            textright = canvas.text(out_ports[name][i]).move(locx + width - text_space, locy - text_offset)
                .font({ family: font, size: size, anchor: 'end' });
            const max_local = out_ports[kind][i].length;
            max_leght_text_out_kind = Math.max(max_leght_text_out_kind, max_local);
            max_x = Math.max(max_x, textright['node'].getAttribute('x'));
            canvas.line(locx - text_space, 0, locx, 0).move(locx + width, locy + size * 2 / 4)
                .stroke({ color: 'black', width: size / 4, linecap: 'rec' });
        }
    }

    const total_width = max_x + (size / 2) * max_leght_text_out_kind + 2 * offset;
    canvas.viewbox(0, 0, total_width, 2 * offset + total_high);

    if (in_ports[0].length > 0 || out_ports[0].length > 0 || generics[0].length > 0) {
        return canvas.svg();
    } else {
        return '';
    }
}

function nomalize_str(input: string): string {
    return input.replace(/`/g, '\\`');
}

function get_generics(structure: common_hdl.Hdl_element, name: number, kind: number) {
    const str: any = [[], []];
    const generic_list = structure.get_generic_array();
    for (let x = 0; x <= generic_list.length - 1; ++x) {
        str[name][x] = '   ' + nomalize_str(generic_list[x].info.name) + ' ';
        str[kind][x] = '   ' + nomalize_str(generic_list[x].type) + ' ';
    }
    return str;
}

function get_ports(hdl_element: common_hdl.Hdl_element) {
    const port_list = hdl_element.get_port_array();
    const port_list_vbus = doxygen.get_virtual_bus(port_list);
    let complete_list: any[] = [];
    complete_list = complete_list.concat(port_list_vbus.port_list);
    complete_list = complete_list.concat(port_list_vbus.v_port_list);
    return complete_list;
}

function get_ports_in(structure: common_hdl.Hdl_element, name: number, kind: number) {
    const str_in: any = [[], []];
    const port_list = get_ports(structure);
    let cont_in = 0;
    for (let x = 0; x <= port_list.length - 1; ++x) {
        if (INPUT_LABEL_LIST.includes(port_list[x].direction)) {
            str_in[name][cont_in] = '   ' + nomalize_str(port_list[x].info.name) + ' ';
            str_in[kind][cont_in] = '   ' + nomalize_str(port_list[x].type) + ' ';
            cont_in++;
        }
    }
    return str_in;
}

function get_ports_out(structure: common_hdl.Hdl_element, name: number, kind: number) {
    const str_in: any = [[], []];
    let cont_in = 0;
    const port_list = get_ports(structure);
    for (let x = 0; x <= port_list.length - 1; ++x) {
        if (OUTPUT_LABEL_LIST.includes(port_list[x].direction)) {
            str_in[name][cont_in] = '   ' + nomalize_str(port_list[x].info.name) + ' ';
            str_in[kind][cont_in] = '   ' + nomalize_str(port_list[x].type) + ' ';
            cont_in++;
        }
    }
    return str_in;
}

function max_string(generics: any, in_ports: any, output_ports: any, data: number) {
    let max = 2;
    for (let i = 0; i < generics[data].length; i++) {
        max = Math.max(max, generics[data][i].length);
    }
    max = max / 1.5;
    for (let i = 0; i < in_ports[data].length; i++) {
        max = Math.max(max, in_ports[data][i].length);
    }
    for (let i = 0; i < output_ports[data].length; i++) {
        max = Math.max(max, output_ports[data][i].length);
    }
    return max;
}
