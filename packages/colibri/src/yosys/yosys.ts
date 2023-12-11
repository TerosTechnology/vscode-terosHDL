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

import { e_config, e_schematic_general_backend } from "../config/config_declaration";
import * as fs from 'fs';
import * as path_lib from 'path';
import { get_language_from_filepath } from "../utils/file_utils";
import { LANGUAGE } from "../common/general";
import { t_file } from "../project_manager/common";
import { getSvgFromJson } from "./utils";
import { runYosys } from '@yowasp/yosys';

const shell = require('shelljs');


export async function runYosysScript(config: e_config, topTevel: string, sources: t_file[], outputPath: string, 
    workingDirectory: string) {

    await runYosys(["--version"]);

    const netlist = {
        'result': '',
        'error': false,
        'empty': false
    };

    const backend = config.schematic.general.backend;
    const custom_argumens = config.schematic.general.args;
    const extra = config.schematic.general.extra;

    let yosysPath = config.tools.yosys.installation_path;

    const cmd_files = getYosysReadFile(sources, backend, workingDirectory);
    if (cmd_files === undefined) {
        netlist.empty = true;
        return netlist;
    }
    const outputPathFilename = path_lib.basename(outputPath);
    let top_level_cmd = "";
    if (topTevel !== "") {
        top_level_cmd = `hierarchy -top ${topTevel}`;
    }
    // eslint-disable-next-line max-len
    const script_code = `${cmd_files}; ${top_level_cmd}; proc; ${custom_argumens} ; write_json ${outputPathFilename}; stat`;

    let plugin = "";
    if (backend === e_schematic_general_backend.yosys_ghdl_module) {
        plugin = "-m ghdl";
    }
    let command = `${extra} yowasp-yosys -p "${script_code}"`;
    if (backend === e_schematic_general_backend.yosys
        || backend === e_schematic_general_backend.yosys_ghdl
        || backend === e_schematic_general_backend.yosys_ghdl_module) {
        if (yosysPath === '') {
            yosysPath = 'yosys';
        }
        else {
            yosysPath = path_lib.join(yosysPath, 'yosys');
            if (process.platform === "win32") {
                yosysPath += '.exe';
            }
        }
        command = `${yosysPath} ${plugin} -p "${script_code}"`;
    }
    command += '\n';

    return new Promise(resolve => {
        shell.exec(command, { async: true, cwd: workingDirectory }, 
            async function (code: any, _stdout: any, _stderr: any) {
            if (code === 0) {
                let result_yosys = '';
                if (fs.existsSync(outputPath)) {
                    result_yosys = fs.readFileSync(outputPath, { encoding: 'utf8', flag: 'r' });
                }
                result_yosys = JSON.parse(result_yosys);
                netlist.empty = false;
                netlist.result = result_yosys;

                const netlist_svg = await getSvgFromJson(netlist);

                resolve(netlist_svg);
            }
            else {
                netlist.empty = true;
                resolve(netlist);
            }
        });
    });
}

export function getYosysReadFile(sourceList: t_file[], backend: e_schematic_general_backend,
    working_directory: string) {

    const vhdlFileList: string[] = [];
    const verilogFileList: string[] = [];

    for (const source of sourceList) {

        let relative_path_file = source.name;
        if (backend !== e_schematic_general_backend.yosys_ghdl
            && backend !== e_schematic_general_backend.yosys_ghdl_module) {
            const filename = path_lib.basename(source.name);
            const dest = path_lib.join(working_directory, filename);
            fs.copyFileSync(source.name, dest);
            relative_path_file = filename;
        }

        const lang = get_language_from_filepath(relative_path_file);
        if (lang === LANGUAGE.VHDL) {
            vhdlFileList.push(relative_path_file);
        }
        else if (lang === LANGUAGE.VERILOG
            || lang === LANGUAGE.SYSTEMVERILOG) {
            verilogFileList.push(relative_path_file);
        }

    }

    // Need to use GHDL to read VHDL files
    if (vhdlFileList.length > 0 && backend !== e_schematic_general_backend.yosys_ghdl
        && backend !== e_schematic_general_backend.yosys_ghdl_module) {
        return undefined;
    }

    let more = '';
    let cmd = '';
    if (vhdlFileList.length > 0) {
        cmd += getYosysReadFileCommandVhdl(vhdlFileList);
        more = '; ';
    }
    if (verilogFileList.length > 0) {
        cmd += more + getYosysReadFileCommandVerilog(verilogFileList);
    }
    return cmd;
}

export function getYosysReadFileCommandVhdl(sourceList: string[]) {
    let cmd = 'ghdl --std=08 -fsynopsys';
    for (const source of sourceList) {
        cmd += ` ${source}`;
    }
    cmd += ' -e';
    return cmd;
}

export function getYosysReadFileCommandVerilog(sourceList: string[]) {
    let cmd = 'read_verilog -sv';
    for (const source of sourceList) {
        cmd += ` ${source}`;
    }
    return cmd;
}