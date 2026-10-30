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

import * as fs from 'fs';
import * as path_lib from 'path';

export function normalizeNetlist(netlist: any): any {
    try {
        const modules = netlist.modules;
        for (const module in modules) {
            const cells_module = modules[module].cells;
            for (const cell in cells_module) {
                const cell_i = cells_module[cell];
                if (cell_i.port_directions === undefined) {
                    cell_i.port_directions = {};
                    for (const port in cell_i.connections) {
                        cell_i.port_directions[port] = 'input';
                    }
                }
            }
        }
        netlist.modules = modules;
        return netlist;
    }
    catch (e) {
        return netlist;
    }
}


export async function getSvgFromJson(outputYosys: any) {
    outputYosys = normalizeNetlist(outputYosys);
    const netlistsvg = require("netlistsvg");
    const skinPath = path_lib.join(__dirname, "bin", "default.svg");
    const skin = fs.readFileSync(skinPath);


    const config = {
        "hierarchy": {
            "enable": "all",
            "expandLevel": 0,
            "expandModules": {
                "types": [],
                "ids": []
            },
            "colour": ["#e9e9e9"]
        },
        "top": {
            "enable": false,
            "module": ""
        }
    };

    const jsonp =outputYosys;
    try {
        outputYosys = await netlistsvg.render(skin, jsonp, undefined, undefined, config);
    } catch (error) {
        return "";
    }

    return outputYosys;
}

export type t_net_source_info = {
    name: string,
    file: string,
    line: number
};

export type t_nets_source_info = {
    [bits: string]: t_net_source_info
};

type t_net_candidate = {
    name: string,
    src: string
};

const max_net_label_length = 48;

/**
 * The Yosys JSON netlist numbers the bits of every module independently, so the
 * same bit ids can belong to different nets of different modules. The schematic
 * renderer names the net lines of the SVG with the bit ids of the net (class
 * "net_<bit ids>"), therefore the bit ids are renumbered to be unique in the
 * whole netlist before rendering. This way every net line of the SVG maps to a
 * single net.
 */
export function makeBitIdsUnique(netlist: any): void {
    const modules = netlist.modules || {};
    let base = 0;
    for (const module_name of Object.keys(modules)) {
        const module_i = modules[module_name];

        let max_bit = 1;
        let num_constants = 0;
        const visit_bits = (bits: any[]): void => {
            for (const bit of bits || []) {
                if (typeof bit === 'number') {
                    if (bit > max_bit) {
                        max_bit = bit;
                    }
                }
                else {
                    num_constants++;
                }
            }
        };

        const netnames = module_i.netnames || {};
        for (const net_name of Object.keys(netnames)) {
            visit_bits(netnames[net_name].bits);
        }
        const ports = module_i.ports || {};
        for (const port_name of Object.keys(ports)) {
            visit_bits(ports[port_name].bits);
        }
        const cells = module_i.cells || {};
        for (const cell_name of Object.keys(cells)) {
            const connections = cells[cell_name].connections || {};
            for (const port_name of Object.keys(connections)) {
                visit_bits(connections[port_name]);
            }
        }

        const shift_bits = (bits: any[]): any[] => {
            return (bits || []).map((bit) => typeof bit === 'number' ? bit + base : bit);
        };
        for (const net_name of Object.keys(netnames)) {
            netnames[net_name].bits = shift_bits(netnames[net_name].bits);
        }
        for (const port_name of Object.keys(ports)) {
            ports[port_name].bits = shift_bits(ports[port_name].bits);
        }
        for (const cell_name of Object.keys(cells)) {
            const connections = cells[cell_name].connections || {};
            for (const port_name of Object.keys(connections)) {
                connections[port_name] = shift_bits(connections[port_name]);
            }
        }

        // netlistsvg replaces the constant bits of the connections with new bit
        // ids starting at max_bit + 1: reserve room for them to keep the bit ids
        // unique across the modules
        base = base + max_bit + num_constants + 1;
    }
}

/**
 * Get the source location (file and line) of the nets of a Yosys JSON netlist.
 * The result is indexed by the bit ids of the net (e.g. "2,5,6"), which is the
 * name that the schematic renderer gives to the net lines of the SVG. Only the
 * nets with a real name (written in the source code) are included: the
 * auto-generated names (e.g. "$auto$ghdl.cc:862:import_module$2") are not
 * labeled. It must be called after makeBitIdsUnique so the bit ids are unique
 * across the modules.
 */
export function getNetsSourceInfo(netlist: any): t_nets_source_info {
    const nets_info: t_nets_source_info = {};
    const modules = netlist.modules || {};
    for (const module_name of Object.keys(modules)) {
        const module_i = modules[module_name];
        const netnames = module_i.netnames || {};

        // Several netnames can share the same bits (aliases): keep the most
        // representative one (the one with source information first, then the
        // shortest name)
        const best_by_bits: { [bits: string]: t_net_candidate } = {};
        for (const net_name of Object.keys(netnames)) {
            if (!isRealNetName(net_name)) {
                continue;
            }
            const candidate: t_net_candidate = {
                name: net_name,
                src: (netnames[net_name].attributes || {}).src || ''
            };
            const bits = (netnames[net_name].bits || []).join(',');
            const current = best_by_bits[bits];
            if (current === undefined || isBetterNetCandidate(candidate, current)) {
                best_by_bits[bits] = candidate;
            }
        }

        for (const bits of Object.keys(best_by_bits)) {
            nets_info[bits] = netCandidateToInfo(best_by_bits[bits]);
        }

        // The cells can be connected to a part of a net (bus slice). The
        // renderer draws those parts as independent nets, so register them too
        const connection_bits = getConnectionBits(module_i);
        for (const bits of connection_bits) {
            if (nets_info[bits] !== undefined) {
                continue;
            }
            const slice_info = getNetSliceInfo(netnames, bits);
            if (slice_info !== undefined) {
                nets_info[bits] = slice_info;
            }
        }
    }
    return nets_info;
}

/**
 * Parse a Yosys "src" attribute: "<file>:<line>.<column>-<line>.<column>"
 */
export function parseSrcLocation(src: string): { file: string, line: number } {
    const match = /^(.*):(\d+)(?:\.\d+)?(?:-\d+(?:\.\d+)?)?$/.exec(src);
    if (match === null) {
        return { file: src, line: 0 };
    }
    return { file: match[1], line: parseInt(match[2]) };
}

function getConnectionBits(module_i: any): string[] {
    const connection_bits: { [bits: string]: boolean } = {};
    const add_bits = (bits: any[]): void => {
        connection_bits[(bits || []).join(',')] = true;
    };
    const ports = module_i.ports || {};
    for (const port_name of Object.keys(ports)) {
        add_bits(ports[port_name].bits);
    }
    const cells = module_i.cells || {};
    for (const cell_name of Object.keys(cells)) {
        const connections = cells[cell_name].connections || {};
        for (const port_name of Object.keys(connections)) {
            add_bits(connections[port_name]);
        }
    }
    return Object.keys(connection_bits);
}

function getNetSliceInfo(netnames: any, bits_str: string): t_net_source_info | undefined {
    const bits = bits_str.split(',');
    let best: t_net_candidate | undefined = undefined;
    let slice_start = -1;
    for (const net_name of Object.keys(netnames)) {
        if (!isRealNetName(net_name)) {
            continue;
        }
        const net_bits = (netnames[net_name].bits || []).map((bit) => String(bit));
        const start = indexOfSubarray(net_bits, bits);
        if (start < 0) {
            continue;
        }
        const candidate: t_net_candidate = {
            name: net_name,
            src: (netnames[net_name].attributes || {}).src || ''
        };
        if (best === undefined || isBetterNetCandidate(candidate, best)) {
            best = candidate;
            slice_start = start;
        }
    }
    if (best === undefined) {
        return undefined;
    }
    const slice_end = slice_start + bits.length - 1;
    const range = slice_start === slice_end ? `[${slice_start}]` : `[${slice_end}:${slice_start}]`;
    const src = parseSrcLocation(best.src);
    return {
        name: makeNetLabel(best.name, range),
        file: src.file,
        line: src.line
    };
}

/**
 * Check if a netname is a real net name (written in the source code) and not
 * an auto-generated name (e.g. "$auto$ghdl.cc:862:import_module$2"). The wires
 * renamed by a Yosys pass keep the original name in a "$0\<name>" alias.
 */
function isRealNetName(name: string): boolean {
    return !name.startsWith('$') || name.startsWith('$0\\');
}

function isBetterNetCandidate(candidate: t_net_candidate, current: t_net_candidate): boolean {
    const candidate_src = candidate.src !== '' ? 1 : 0;
    const current_src = current.src !== '' ? 1 : 0;
    if (candidate_src !== current_src) {
        return candidate_src > current_src;
    }
    return candidate.name.length < current.name.length;
}

function netCandidateToInfo(candidate: t_net_candidate): t_net_source_info {
    const src = parseSrcLocation(candidate.src);
    return {
        name: cleanNetName(candidate.name),
        file: src.file,
        line: src.line
    };
}

/**
 * Clean a net name for display: the wires renamed by a Yosys pass keep the
 * original name in a "$0\<name>" alias, and the labels are truncated to keep
 * the schematic readable
 */
function cleanNetName(name: string): string {
    const renamed = /^\$0\\(.*)$/.exec(name);
    const clean = renamed !== null ? renamed[1] : name;
    if (clean.length > max_net_label_length) {
        return clean.substring(0, max_net_label_length - 1) + '…';
    }
    return clean;
}

function makeNetLabel(name: string, range: string): string {
    let label = cleanNetName(name);
    if (label.length + range.length > max_net_label_length) {
        label = label.substring(0, max_net_label_length - range.length - 1) + '…';
    }
    return label + range;
}

function indexOfSubarray(haystack: string[], needle: string[]): number {
    if (needle.length === 0 || needle.length > haystack.length) {
        return -1;
    }
    for (let i = 0; i + needle.length <= haystack.length; i++) {
        let found = true;
        for (let j = 0; j < needle.length; j++) {
            if (haystack[i + j] !== needle[j]) {
                found = false;
                break;
            }
        }
        if (found) {
            return i;
        }
    }
    return -1;
}

/**
 * Search the declaration of a net in HDL source files. Used as a fallback when
 * the netlist does not have the source location of the net (e.g. VHDL
 * netlists).
 */
export function findNetInSources(net_name: string,
    source_paths: string[]): { file: string, line: number } | undefined {
    if (net_name === '' || source_paths.length === 0) {
        return undefined;
    }

    // The name of the net can have a bit range (e.g. "count[7:0]"): search the
    // base name too
    const names = [net_name];
    const base_name = net_name.replace(/\[.*\]$/, '');
    if (base_name !== net_name && base_name !== '') {
        names.push(base_name);
    }

    const patterns: RegExp[] = [];
    for (const name of names) {
        const escaped = escapeRegExp(name);
        // Verilog declaration
        patterns.push(new RegExp(`\\b(?:input|output|inout|wire|reg|logic)\\b[^;]*\\b${escaped}\\b`));
        // VHDL signal/generic declaration
        patterns.push(new RegExp(`\\b(?:signal|generic)\\b[^;]*\\b${escaped}\\b`));
        // VHDL port/signal declaration
        patterns.push(new RegExp(`\\b${escaped}\\b\\s*:`));
        // Any occurrence
        patterns.push(new RegExp(`\\b${escaped}\\b`));
    }

    for (const pattern of patterns) {
        for (const source_path of source_paths) {
            if (!fs.existsSync(source_path)) {
                continue;
            }
            const lines = fs.readFileSync(source_path, 'utf-8').split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
                if (pattern.test(lines[i])) {
                    return { file: source_path, line: i + 1 };
                }
            }
        }
    }
    return undefined;
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}