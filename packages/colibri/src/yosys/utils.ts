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

        // Obteniendo todas las claves del JSON
        for (const module in modules) {
            const cells_module = modules[module].cells;
            for (const cell in cells_module) {
                const cell_i = cells_module[cell];
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
                    // const tt = cell_i.connections;
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


export async function getSvgFromJson(output_yosys: any) {
    output_yosys.result = normalizeNetlist(output_yosys.result);
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

    const jsonp = output_yosys.result;
    try {
        output_yosys.result = await netlistsvg.render(skin, jsonp, undefined, undefined, config);
    } catch (error) {
        return "";
    }

    return output_yosys;
}