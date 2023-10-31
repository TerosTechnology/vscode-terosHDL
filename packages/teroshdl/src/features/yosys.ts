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

import * as teroshdl2 from 'teroshdl2';

export function get_yosys_read_file(sources, backend, working_directory) {
    let vhdl_files: string[] = [];
    let verilog_files: string[] = [];
    for (let i = 0; i < sources.length; i++) {
        const element = <string>sources[i];
        const path_lib = require('path');

        let relative_path_file = element;
        if (backend !== teroshdl2.config.config_declaration.e_schematic_general_backend.yosys_ghdl 
            && backend !== teroshdl2.config.config_declaration.e_schematic_general_backend.yosys_ghdl_module) {
            const fs = require('fs');
            let filename = path_lib.basename(element);
            let dest = path_lib.join(working_directory, filename);
            fs.copyFileSync(element, dest);
            relative_path_file = filename;
        }

        let lang = teroshdl2.utils.file.get_language_from_filepath(relative_path_file);
        if (lang === teroshdl2.common.general.LANGUAGE.VHDL) {
            vhdl_files.push(relative_path_file);
        }
        else if (lang === teroshdl2.common.general.LANGUAGE.VERILOG 
            || lang === teroshdl2.common.general.LANGUAGE.SYSTEMVERILOG) {
            verilog_files.push(relative_path_file);
        }

    }
    if (vhdl_files.length > 0 && backend !== teroshdl2.config.config_declaration.e_schematic_general_backend.yosys_ghdl 
        && backend !== teroshdl2.config.config_declaration.e_schematic_general_backend.yosys_ghdl_module) {
        return undefined;
    }

    let more = '';
    let cmd = '';
    if (vhdl_files.length > 0) {
        cmd += get_yosys_read_file_command_vhdl(vhdl_files);
        more = '; ';
    }
    if (verilog_files.length > 0) {
        cmd += more + get_yosys_read_file_command_verilog(verilog_files);
    }
    return cmd;
}

export function get_yosys_read_file_command_vhdl(sources) {
    let cmd = 'ghdl --std=08 -fsynopsys';
    for (let i = 0; i < sources.length; i++) {
        const element = sources[i];
        cmd += ` ${element}`;
    }
    cmd += ' -e';
    return cmd;
}

export function get_yosys_read_file_command_verilog(sources) {
    let cmd = 'read_verilog -sv';
    for (let i = 0; i < sources.length; i++) {
        const element = sources[i];
        cmd += ` ${element}`;
    }
    return cmd;
}

export function normalize_netlist(netlist) {
    try {
        let norm_netlist = netlist;
        let modules = netlist.modules;

        // Obteniendo todas las claves del JSON
        for (let module in modules) {
            let cells_module = modules[module].cells;
            for (let cell in cells_module) {
                let cell_i = cells_module[cell];
                // if (cell_i.type === '$dff') {
                //     cell_i.type = 'D-Flip Flop';
                // }
                // else if (cell_i.type === '$adff') {
                //     cell_i.type = 'D-Flip Flop areset';
                // }
                // else if (cell_i.type === '$eq') {
                //     cell_i.type = 'equal';
                // }
                // else {
                //     cell_i.type = cell_i.type.replace('$', '');
                // }
                if (cell_i.port_directions === undefined) {
                    let tt = cell_i.connections;
                    cell_i.port_directions = {};
                    for (let port in cell_i.connections) {
                        cell_i.port_directions[port] = 'input';
                    }
                }
            }
        }
        norm_netlist.modules = modules;
        return norm_netlist;
    }
    catch (e) {
        return netlist;
    }
}

export function get_file_lang(filepath: string | undefined) {
    if (filepath === undefined) {
        return '';
    }
    const teroshdl = require('teroshdl');
    const utils = teroshdl.Utils;
    let lang = utils.get_file_lang(filepath);
    return lang;
}