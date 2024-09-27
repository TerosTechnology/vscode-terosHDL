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
import { t_file } from "../project_manager/common";
import * as process_utils from "../process/utils";
import { Process } from "../process/process";
import { OS, p_result } from "../process/common";
import { read_file_sync, remove_file, get_directory } from "../utils/file_utils";
import { LANGUAGE } from "../common/general";
import * as path_lib from "path";
import * as file_utils from "../utils/file_utils";

export type e_schematic_result = {
    schematic: string,
    error_msg: string,
    sucessful: boolean,
    empty: boolean
};

function removeEmptyCommands(cmd: string): string {
    return cmd.replace(/; ;/g, ";");
}

export async function getSchematic(config: e_config, topTevel: string, sources: t_file[],
    callback_stream: (stream_c: e_schematic_result) => void) : Promise<any>{

    const backend = config.schematic.general.backend;
    if (backend === e_schematic_general_backend.yosys || backend === e_schematic_general_backend.yowasp) {
        return runYosysRaw(config, topTevel, sources, callback_stream);
    }
    else if (backend === e_schematic_general_backend.yosys_ghdl) {
        return runYosysGhdl(config, topTevel, sources, callback_stream);
    }
    else if (backend === e_schematic_general_backend.standalone) {
        return runYosysStandalone(config, topTevel, sources, callback_stream);
    }
}

export function runYosysRaw(config: e_config, topTevel: string, sources: t_file[],
    callback: (result: e_schematic_result) => void): any {

    const yosysPath = getRawYosysPath(config);

    // Command for files
    let cmdFiles = "";
    sources.forEach(source => {
        if (source.file_type === LANGUAGE.VERILOG || source.file_type === LANGUAGE.SYSTEMVERILOG) {
            const normalizedPath = config.schematic.general.backend === e_schematic_general_backend.yowasp ?
                normalizePathForLinux(source.name) : source.name;
            cmdFiles += getYosysReadFileCommandVerilog(normalizedPath) + "; ";
        }
    });

    // Command for top level
    const topLevelCmd = getToplevelCommand(topTevel);

    // Command for custom arguments
    const customArguments = config.schematic.general.args.trim();

    // Command for pre arguments
    const preArguments = config.schematic.general.extra;

    const outputPathFilename = config.schematic.general.backend === e_schematic_general_backend.yowasp ?
        process_utils.createTempFileInHome("") : process_utils.create_temp_file("");

    let cmd =
        // eslint-disable-next-line max-len
        `${preArguments} ${yosysPath} -p '${cmdFiles}; ${topLevelCmd}; proc; ${customArguments}; write_json ${outputPathFilename}; stat'`;
    cmd = removeEmptyCommands(cmd);
    
    const opt_exec = { cwd: get_directory(topTevel) };

    const p = new Process();
    const exec_i = p.exec(cmd, opt_exec, (result: p_result) => {
        const schematicResult: e_schematic_result = {
            schematic: "",
            error_msg: "",
            sucessful: true,
            empty: false
        };

        if (!result.successful) {
            schematicResult.sucessful = false;
            schematicResult.error_msg = result.stderr;
        }
        else {
            schematicResult.schematic = read_file_sync(outputPathFilename);
        }

        remove_file(outputPathFilename);
        callback(schematicResult);
    });
    return exec_i;
}

export function runYosysGhdl(config: e_config, topTevel: string, sources: t_file[],
    callback: (result: e_schematic_result) => void): any {

    const yosysPath = getRawYosysPath(config);

    // Command for files
    let cmdFiles = "";
    sources.forEach(source => {
        if (source.file_type === LANGUAGE.VHDL) {
            cmdFiles += getYosysReadFileCommandVhdl(source.name, source.logical_name) + " ";
        }
    });

    // Command for top level
    const topLevelCmd = getToplevelCommand(topTevel);

    // Command for custom arguments
    const customArguments = config.schematic.general.args.trim();

    // Command for pre arguments
    const preArguments = config.schematic.general.extra;

    // GHDL arguments
    const ghdlArguments = config.schematic.general.args_ghdl.trim();

    const outputPathFilename = process_utils.createTempFileInHome("");

    let cmd =
        // eslint-disable-next-line max-len
        `${preArguments} ${yosysPath} -m ghdl -p 'ghdl --std=08 -fsynopsys ${ghdlArguments} ${cmdFiles} --work=work -e ${topTevel}; ${topLevelCmd}; proc; ${customArguments}; write_json ${outputPathFilename}; stat'`;
    cmd = removeEmptyCommands(cmd);

    const opt_exec = { cwd: process_utils.get_home_directory() };

    const p = new Process();
    const exec_i = p.exec(cmd, opt_exec, (result: p_result) => {
        const schematicResult: e_schematic_result = {
            schematic: "",
            error_msg: "",
            sucessful: true,
            empty: false
        };

        if (!result.successful) {
            schematicResult.sucessful = false;
            schematicResult.error_msg = result.stderr;
        }
        else {
            schematicResult.schematic = read_file_sync(outputPathFilename);
        }

        callback(schematicResult);
    });
    return exec_i;
}

export async function runYosysStandalone(config: e_config, topTevel: string, sources: t_file[],
    callback: (result: e_schematic_result) => void): Promise<any> {

    try {
        const { runYosys } = await import('@yowasp/yosys');

        const fileDeclaration : any = {};
        let cmdFiles = "";

        for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            if (source.file_type === LANGUAGE.VERILOG) {
                const extension = path_lib.extname(source.name);
                const newName = `file${i}${extension}`;
                fileDeclaration[newName] = read_file_sync(source.name);
                cmdFiles += getYosysReadFileCommandVerilog(`/${newName}`) + "; ";
            }
        }

        // Command for top level
        const topLevelCmd = getToplevelCommand(topTevel);

        // Command for custom arguments
        const customArguments = config.schematic.general.args.trim();

        const outputFilename = "schematic.json";

        let cmd = `${cmdFiles}; ${topLevelCmd}; proc; ${customArguments}; write_json ${outputFilename}; stat`;
        cmd = removeEmptyCommands(cmd);

        const cmdList = ['-p'].concat([cmd]);

        const result = await runYosys(cmdList, fileDeclaration, { decodeASCII: true });

        const schematicResult: e_schematic_result = {
            schematic: "",
            error_msg: "",
            sucessful: true,
            empty: false
        };

        if (result === undefined) {
            schematicResult.sucessful = false;
            schematicResult.error_msg = "Error running Yosys";
        }
        else {
            schematicResult.schematic = JSON.stringify(result[outputFilename]);
        }

        callback(schematicResult);
    } catch (error) {
        console.log(error);
        const schematicResult = {
            schematic: "",
            error_msg: "Error running Yosys",
            sucessful: false,
            empty: true
        };
        callback(schematicResult);
    }
}

function getYosysReadFileCommandVhdl(filePath: string, logicalName: string): string {
    const libraryCommand = logicalName !== "" ? `--work=${logicalName}` : "--work=work";
    return `${libraryCommand} ${filePath}`;
}

function getYosysReadFileCommandVerilog(filePath: string): string {
    return `read_verilog -sv "${filePath}"`;
}

function getToplevelCommand(topTevel: string): string {
    return topTevel !== "" ? `hierarchy -top ${topTevel}` : "";
}

function getRawYosysPath(config: e_config) {
    if (config.schematic.general.backend === e_schematic_general_backend.yowasp) {
        return "yowasp-yosys";
    }
    else {
        const configInstallationPath = config.tools.yosys.installation_path;
        let yosysPath = "yosys";
        if (configInstallationPath !== "") {
            yosysPath = path_lib.join(configInstallationPath, "yosys");
        }

        if (!file_utils.check_if_path_exist(yosysPath) && process_utils.get_os() === OS.WINDOWS) {
            yosysPath += ".exe";
        }

        return yosysPath;
    }
}

function normalizePathForLinux(filepath: string): string {
    if (process_utils.get_os() !== OS.WINDOWS) {
        return filepath;
    }
    const normalizedPath = path_lib.normalize(filepath);
    return normalizedPath.replace(/\\/g, '/');
}