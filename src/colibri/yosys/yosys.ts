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
import glob = require('tiny-glob');

export type e_schematic_result = {
    schematic: string,
    error_msg: string,
    sucessful: boolean,
    empty: boolean
};

/** Row of the libraries table of the schematic settings */
export type t_schematic_library_setting = {
    name: string,
    path: string
};

/** Library of the schematic settings resolved to the files to read into it */
export type t_schematic_library = {
    name: string,
    files: string[]
};

/**
 * Remove the sources matching the ignore paths of the schematic settings: the
 * excluded files are not passed to Yosys
 */
export function filter_schematic_sources(sources: t_file[], ignorePaths: string[]): t_file[] {
    if (ignorePaths.length === 0) {
        return sources;
    }
    return sources.filter((source) => !file_utils.is_path_matching(source.name, ignorePaths));
}

/**
 * Resolve the libraries table of the schematic settings: the path of each row
 * is a file or a glob pattern and is expanded to the files to read into the
 * library. Rows with an empty name or path and files matching the ignore paths
 * are skipped.
 */
export async function get_schematic_libraries(libraries: t_schematic_library_setting[],
    ignorePaths: string[]): Promise<t_schematic_library[]> {
    const resolved_libraries: t_schematic_library[] = [];
    for (const library of libraries) {
        const name = library.name.trim();
        const library_path = library.path.trim();
        if (name === "" || library_path === "") {
            continue;
        }
        const files = (await glob(library_path, { absolute: true, filesOnly: true }))
            .filter((file) => !file_utils.is_path_matching(file, ignorePaths));
        if (files.length > 0) {
            resolved_libraries.push({ name: name, files: files });
        }
    }
    return resolved_libraries;
}

function removeEmptyCommands(cmd: string): string {
    return cmd.replace(/; ;/g, ";");
}

export async function getSchematic(config: e_config, topTevel: string, sources: t_file[],
    callback_stream: (stream_c: e_schematic_result) => void) : Promise<any>{

    const filtered_sources = filter_schematic_sources(sources, config.schematic.general.ignorePaths);
    const libraries = await get_schematic_libraries(config.schematic.general.libraries,
        config.schematic.general.ignorePaths);

    const backend = config.schematic.general.backend;
    if (backend === e_schematic_general_backend.yosys || backend === e_schematic_general_backend.yowasp) {
        return runYosysRaw(config, topTevel, filtered_sources, callback_stream, libraries);
    }
    else if (backend === e_schematic_general_backend.yosys_ghdl) {
        return await runYosysGhdl(config, topTevel, filtered_sources, callback_stream, libraries);
    }
    else if (backend === e_schematic_general_backend.standalone) {
        return runYosysStandalone(config, topTevel, filtered_sources, callback_stream, libraries);
    }
}

export function runYosysRaw(config: e_config, topTevel: string, sources: t_file[],
    callback: (result: e_schematic_result) => void, libraries: t_schematic_library[] = []): any {

    const yosysPath = getRawYosysPath(config);

    // Command for the files of the configured libraries (e.g. UNISIM): they
    // are read before the project sources so the sources can use them
    let cmdFiles = "";
    for (const library of libraries) {
        for (const library_file of library.files) {
            const language = file_utils.get_language_from_filepath(library_file);
            if (language === LANGUAGE.VERILOG || language === LANGUAGE.SYSTEMVERILOG) {
                const normalizedPath = config.schematic.general.backend === e_schematic_general_backend.yowasp ?
                    normalizePathForLinux(library_file) : library_file;
                cmdFiles += getYosysReadFileCommandVerilog(normalizedPath) + "; ";
            }
        }
    }

    // Command for files
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
    
    const outputPathName = file_utils.get_filename(outputPathFilename, true);

    let cmd =
        // eslint-disable-next-line max-len
        `${preArguments} ${yosysPath} -p "${cmdFiles}; ${topLevelCmd}; proc; ${customArguments}; write_json ${outputPathName}; stat"`;
    cmd = removeEmptyCommands(cmd);
    
    const opt_exec = { cwd: get_directory(outputPathFilename) };

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

export async function runYosysGhdl(config: e_config, topTevel: string, sources: t_file[],
    callback: (result: e_schematic_result) => void, libraries: t_schematic_library[] = []): Promise<any> {

    const yosysPath = getRawYosysPath(config);
    let isVhdl = false;
    sources.forEach(source => {
        if (source.file_type === LANGUAGE.VHDL) {
            isVhdl = true;
        }
    });

    if (!isVhdl) {
        return runYosysRaw(config, topTevel, sources, callback, libraries);
    }

    // Command for the files of the configured libraries (e.g. UNISIM): they
    // are read into their library before the project sources so the sources
    // can use them
    let cmdFiles = "";
    for (const library of libraries) {
        for (const library_file of library.files) {
            if (file_utils.get_language_from_filepath(library_file) === LANGUAGE.VHDL) {
                cmdFiles += getYosysReadFileCommandVhdl(library_file, library.name) + " ";
            }
        }
    }

    // Command for files
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
        `${preArguments} ${yosysPath} ${await getGHDLCommnand(preArguments, yosysPath)} -p "ghdl --std=08 -fsynopsys ${ghdlArguments} ${cmdFiles} -e ${topTevel}; ${topLevelCmd}; proc; ${customArguments}; write_json ${outputPathFilename}; stat"`;
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
            schematicResult.error_msg = result.stdout + "\n" + result.stderr;
        }
        else {
            schematicResult.schematic = read_file_sync(outputPathFilename);
        }

        remove_file(outputPathFilename);
        callback(schematicResult);
    });
    return exec_i;
}

async function getGHDLCommnand(preArgument: string, yosysPath: string) : Promise<string> {
    try {
        const p = new Process();
        const commnad = `${preArgument} ${yosysPath} -m ghdl -p "help"`;
        const result = await p.exec_wait(commnad, { cwd: process_utils.get_home_directory() });
        const endOfScriptStdout = result.stdout.toLowerCase().includes("end of script");
        const runningStdout = result.stdout.toLowerCase().includes("running command");

        if (result.successful && (endOfScriptStdout || runningStdout)) {
            return "-m ghdl";
        }
        else {
            return "";
        }
    }
    catch (error) {
        return "";
    }
}

export async function runYosysStandalone(config: e_config, topTevel: string, sources: t_file[],
    callback: (result: e_schematic_result) => void, libraries: t_schematic_library[] = []): Promise<any> {

    try {
        const { runYosys } = await import('@yowasp/yosys');

        const fileDeclaration : any = {};
        let cmdFiles = "";

        // The files of the configured libraries are read before the project sources
        const verilog_files: string[] = [];
        for (const library of libraries) {
            for (const library_file of library.files) {
                if (file_utils.get_language_from_filepath(library_file) === LANGUAGE.VERILOG) {
                    verilog_files.push(library_file);
                }
            }
        }
        for (const source of sources) {
            if (source.file_type === LANGUAGE.VERILOG) {
                verilog_files.push(source.name);
            }
        }

        for (let i = 0; i < verilog_files.length; i++) {
            const extension = path_lib.extname(verilog_files[i]);
            const newName = `file${i}${extension}`;
            fileDeclaration[newName] = read_file_sync(verilog_files[i]);
            cmdFiles += getYosysReadFileCommandVerilog(`/${newName}`) + "; ";
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
    return `${libraryCommand} "${filePath}"`;
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
