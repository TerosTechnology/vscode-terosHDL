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

import { e_config } from "../../config/config_declaration";
import { t_file } from "../common";

////////////////////////////////////////////////////////////////////////////////
// Quartus
////////////////////////////////////////////////////////////////////////////////
export enum e_taskType {
    // Quartus tasks
    QUARTUS_COMPILEDESIGN = "Compile Design",
    QUARTUS_IPGENERATION = "IP Generation",
    QUARTUS_ANALYSISSYNTHESIS = "Analysis & Synthesis",
    QUARTUS_ANALYSISELABORATION = "Analysis & Elaboration",
    QUARTUS_SYNTHESIS = "Synthesis",
    QUARTUS_EARLYTIMINGANALYSIS = "Early Timing Analysis",
    QUARTUS_FITTER = "Fitter",
    QUARTUS_FITTERIMPLEMENT = "Fitter (Implement)",
    QUARTUS_PLAN = "Plan",
    QUARTUS_PLACE = "Place",
    QUARTUS_ROUTE = "Route",
    QUARTUS_FITTERFINALIZE = "Fitter (Finalize)",
    QUARTUS_TIMING = "Timing Analysis (Signoff)",
    QUARTUS_RTL_ANALYZER = "RTL Analyzer",
    QUARTUS_ASSEMBLER = "Assembler (Generate programming files)",
    // SandPiper tasks
    SANDPIPER_TLVERILOGTOVERILOG = "TL-Verilog to Verilog",
    // Common
    OPENFOLDER = "Open Project Folder",
    SETTINGS = "Settings",
    CHANGEDEVICE = "Device",
    TCLCONSOLE = "Tcl Console",
}

export enum e_iconType {
    RUN = "run",
    TIME = "time",
    WAVEFORM = "waveform",
    CHIP = "chip",
    LENS = "lens",
    REPORT = "report",
}

export enum e_reportType {
    REPORT = "Report",
    REPORTDB = "Logs",
    TIMINGANALYZER = "Timing Analyzer",
    TECHNOLOGYMAPVIEWER = "Technology Map Viewer",
    SNAPSHOPVIEWER = "Snapshop Viewer",
}

export enum e_taskState {
    IDLE = "Idle",
    RUNNING = "Running",
    FINISHED = "Finished",
    FAILED = "Failed",
}

/** Task execution type */
export enum e_taskExecutionType {
    /** Run a complex command. Execute the command in the back-end */
    COMPLEXCOMMAND = "COMPLEXCOMMAND",
    /** Execute the command in the front-end. */
    SIMPLECOMMAND = "SIMPLECOMMAND",
    /** Only display information. Not execution. */
    DISPLAYGROUP = "DISPLAYGROUP",
    OPENFOLDER = "FOLDER",
    OPENSETTINGS = "SETTINGS",
}

export type t_taskRep = {
    "name": e_taskType,
    "label": string,
    "executionType": e_taskExecutionType,
    "reports"?: e_reportType[],
    "children"?: t_taskRep[],
    "icon"?: e_iconType,

    "status"?: e_taskState | undefined,
    "success"?: boolean | undefined,
    "elapsed_time"?: number | undefined,
    "percent"?: number | undefined,
}

export type t_ipCatalogRep = {
    "name": string,
    "display_name": string,
    "is_group": boolean,
    "supportedDeviceFamily"?: string[],
    "children": t_ipCatalogRep[],
    "command"?: string,
}

////////////////////////////////////////////////////////////////////////////////
// Common
////////////////////////////////////////////////////////////////////////////////
/** Character location */
export type t_location = {
    filename: string;
    length: number;
    offset: number;
}

/** Test declaration */
export type t_test_declaration = {
    suite_name: string;
    /** Test name */
    name: string;
    /** Test type */
    test_type: string;
    /** Filename */
    filename: string;
    /** Test location */
    location: t_location | undefined;
}

/** Artifact type */
export enum e_artifact_type {
    LOG = "log",
    CONSOLE_LOG = "console_log",
    SUMMARY = "summary",
    OTHER = "other",
    WAVEFORM = "waveform",
    BUILD = "folder",
    COMMAND = "command",
}

/** File type */
export enum e_element_type {
    HTML_FILE = "html_file",
    TEXT_FILE = "text_file",
    HTML = "html",
    TEXT = "text",
    FILE = "file",
    FOLDER = "folder",
    FST = "fst",
    NONE = "none",
    DATABASE = "database",
}

/** Test artifact */
export type t_test_artifact = {
    /** Artifact name */
    name: string;
    /** Artifact path */
    path: string;
    /** If associated command */
    command: string;
    /** Type of artifact */
    artifact_type: e_artifact_type,
    /** Type of file */
    element_type: e_element_type,
    content: string | undefined
}

/** Test result */
export type t_test_result = {
    suite_name: string;
    /** Test name */
    name: string;
    config: e_config;
    edam: any;
    config_summary_path: string;
    /** Artifact generated by the test. E.g: binary, HTML result */
    artifact: t_test_artifact[];
    /** True if test pass */
    successful: boolean;
    build_path: string;
    stdout: string;
    stderr: string;
    time: number;
    test_path: string;
}

export enum e_clean_step {
    Analyze = "Analyze",
    Synthesize = "Synthesize",
    Packing = "Packing",
    Place = "Place",
    Route = "Route",
    Sta = "Sta",
    Bitstream = "Bitstream"
}

export type t_board_list = {
    family: string;
    part_list: string[];
}

export type t_loader_boards_result = {
    board_list: t_board_list[];
    successful: boolean;
    msg: string;
}

export type t_loader_file_list_result = {
    file_list: t_file[];
    successful: boolean;
    msg: string;
}

export type t_loader_prj_info_result = {
    prj_name: string;
    prj_revision: string;
    prj_top_entity: string;
    revision_list: string[];
    successful: boolean;
    msg: string;
}

export type t_loader_action_result = {
    successful: boolean;
    msg: string;
}

export const terminalTypeMap = new Map<string, string>([
    ["Quartus Prime Shell", "quartus_sh"],
    ["Quartus Prime Fitter", "quartus_fit"],
    ["Quartus Prime Compiler Database Interface", "quartus_cdb"],
    ["Quartus Prime Timing Analyzer", "quartus_sta"],
]);