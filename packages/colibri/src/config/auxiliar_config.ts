// Copyright 2022
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>

import * as cfg from './config_declaration';

export type t_linter_vhdl_options = {
    /** Linter name */
    name: cfg.e_linter_general_linter_vhdl;
    /** Linter arguments */
    arguments: string;
}

export type t_linter_verilog_options = {
    /** Linter name */
    name: cfg.e_linter_general_linter_verilog;
    /** Linter arguments */
    arguments: string;
}

export type t_style_vhdl_options = {
    /** Style linter name */
    name: cfg.e_linter_general_lstyle_vhdl;
    /** Linter arguments */
    arguments: string;
}

export type t_style_verilog_options = {
    /** Style linter name */
    name: cfg.e_linter_general_lstyle_verilog;
    /** Linter arguments */
    arguments: string;
}

export type t_exec_config = {
    execution_mode: cfg.e_tools_general_execution_mode;
    python_path: string;
    developer_mode: boolean;
    waveform_viewer: cfg.e_tools_general_waveform_viewer;
}

export type t_tool_options = {
    /** Tool name */
    name: string;
    /** Tool installation path */
    installation_path: string;
    /** Tool config */
    config: any;
}

/** Options to generate a template */
export type t_template_options = {
    header_file_path: string;
    indent_char: string;
    clock_generation_style: cfg.e_templates_general_clock_generation_style,
    instance_style: cfg.e_templates_general_instance_style
};

/** Options to generate documentation */
export type t_documenter_options = {
    generic_visibility: cfg.e_documentation_general_generics;
    port_visibility: cfg.e_documentation_general_ports;
    signal_visibility: cfg.e_documentation_general_signals;
    constant_visibility: cfg.e_documentation_general_constants;
    type_visibility: cfg.e_documentation_general_types;
    function_visibility: cfg.e_documentation_general_functions;
    instantiation_visibility: cfg.e_documentation_general_instantiations;
    process_visibility: cfg.e_documentation_general_process;
    language: cfg.e_documentation_general_language;
    vhdl_symbol: string;
    verilog_symbol: string;
    enable_fsm: boolean;
};