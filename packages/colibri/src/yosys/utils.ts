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