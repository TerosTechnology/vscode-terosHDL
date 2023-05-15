/* eslint-disable max-len */
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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

export type e_config = {
    "general" : {
        "general" : e_general_general,
    }
    "documentation" : {
        "general" : e_documentation_general,
    }
    "editor" : {
        "general" : e_editor_general,
    }
    "formatter" : {
        "general" : e_formatter_general,
        "istyle" : e_formatter_istyle,
        "s3sv" : e_formatter_s3sv,
        "verible" : e_formatter_verible,
        "standalone" : e_formatter_standalone,
        "svg" : e_formatter_svg,
    }
    "linter" : {
        "general" : e_linter_general,
        "ghdl" : e_linter_ghdl,
        "icarus" : e_linter_icarus,
        "modelsim" : e_linter_modelsim,
        "verible" : e_linter_verible,
        "verilator" : e_linter_verilator,
        "vivado" : e_linter_vivado,
        "vsg" : e_linter_vsg,
    }
    "schematic" : {
        "general" : e_schematic_general,
    }
    "templates" : {
        "general" : e_templates_general,
    }
    "tools" : {
        "general" : e_tools_general,
        "osvvm" : e_tools_osvvm,
        "ascenlint" : e_tools_ascenlint,
        "cocotb" : e_tools_cocotb,
        "diamond" : e_tools_diamond,
        "ghdl" : e_tools_ghdl,
        "icarus" : e_tools_icarus,
        "icestorm" : e_tools_icestorm,
        "ise" : e_tools_ise,
        "isem" : e_tools_isem,
        "modelsim" : e_tools_modelsim,
        "morty" : e_tools_morty,
        "quartus" : e_tools_quartus,
        "radiant" : e_tools_radiant,
        "rivierapro" : e_tools_rivierapro,
        "siliconcompiler" : e_tools_siliconcompiler,
        "spyglass" : e_tools_spyglass,
        "symbiyosys" : e_tools_symbiyosys,
        "symbiflow" : e_tools_symbiflow,
        "trellis" : e_tools_trellis,
        "vcs" : e_tools_vcs,
        "verible" : e_tools_verible,
        "verilator" : e_tools_verilator,
        "vivado" : e_tools_vivado,
        "vunit" : e_tools_vunit,
        "xcelium" : e_tools_xcelium,
        "xsim" : e_tools_xsim,
        "yosys" : e_tools_yosys,
        "openfpga" : e_tools_openfpga,
        "activehdl" : e_tools_activehdl,
        "nvc" : e_tools_nvc,
        "questa" : e_tools_questa,
        "raptor" : e_tools_raptor,
    }
};
export type e_general_general = {
    logging : boolean,
    pypath : string,
    go_to_definition_vhdl : boolean,
    go_to_definition_verilog : boolean,
    developer_mode : boolean,
};
    
export type e_documentation_general = {
    language : e_documentation_general_language,
    symbol_vhdl : string,
    symbol_verilog : string,
    dependency_graph : boolean,
    self_contained : boolean,
    fsm : boolean,
    ports : e_documentation_general_ports,
    generics : e_documentation_general_generics,
    instantiations : e_documentation_general_instantiations,
    signals : e_documentation_general_signals,
    constants : e_documentation_general_constants,
    types : e_documentation_general_types,
    process : e_documentation_general_process,
    functions : e_documentation_general_functions,
    magic_config_path : string,
};
    
export type e_editor_general = {
    stutter_comment_shortcuts : boolean,
    stutter_block_width : number,
    stutter_max_width : number,
    stutter_delimiters : boolean,
    stutter_bracket_shortcuts : boolean,
};
    
export type e_formatter_general = {
    formatter_verilog : e_formatter_general_formatter_verilog,
    formatter_vhdl : e_formatter_general_formatter_vhdl,
};
    
export type e_formatter_istyle = {
    style : e_formatter_istyle_style,
    indentation_size : number,
};
    
export type e_formatter_s3sv = {
    one_bind_per_line : boolean,
    one_declaration_per_line : boolean,
    use_tabs : boolean,
    indentation_size : number,
};
    
export type e_formatter_verible = {
    format_args : string,
};
    
export type e_formatter_standalone = {
    keyword_case : e_formatter_standalone_keyword_case,
    name_case : e_formatter_standalone_name_case,
    indentation : string,
    align_port_generic : boolean,
    align_comment : boolean,
    remove_comments : boolean,
    remove_reports : boolean,
    check_alias : boolean,
    new_line_after_then : e_formatter_standalone_new_line_after_then,
    new_line_after_semicolon : e_formatter_standalone_new_line_after_semicolon,
    new_line_after_else : e_formatter_standalone_new_line_after_else,
    new_line_after_port : e_formatter_standalone_new_line_after_port,
    new_line_after_generic : e_formatter_standalone_new_line_after_generic,
};
    
export type e_formatter_svg = {
    configuration : string,
    core_number : number,
};
    
export type e_linter_general = {
    linter_vhdl : e_linter_general_linter_vhdl,
    linter_verilog : e_linter_general_linter_verilog,
    lstyle_verilog : e_linter_general_lstyle_verilog,
    lstyle_vhdl : e_linter_general_lstyle_vhdl,
};
    
export type e_linter_ghdl = {
    arguments : string,
};
    
export type e_linter_icarus = {
    arguments : string,
};
    
export type e_linter_modelsim = {
    vhdl_arguments : string,
    verilog_arguments : string,
};
    
export type e_linter_verible = {
    arguments : string,
};
    
export type e_linter_verilator = {
    arguments : string,
};
    
export type e_linter_vivado = {
    vhdl_arguments : string,
    verilog_arguments : string,
};
    
export type e_linter_vsg = {
    arguments : string,
};
    
export type e_schematic_general = {
    backend : e_schematic_general_backend,
    args : string,
};
    
export type e_templates_general = {
    header_file_path : string,
    indent : string,
    clock_generation_style : e_templates_general_clock_generation_style,
    instance_style : e_templates_general_instance_style,
};
    
export type e_tools_general = {
    select_tool : e_tools_general_select_tool,
    gtkwave_installation_path : string,
    execution_mode : e_tools_general_execution_mode,
    waveform_viewer : e_tools_general_waveform_viewer,
};
    
export type e_tools_osvvm = {
    installation_path : string,
    tclsh_binary : string,
    simulator_name : e_tools_osvvm_simulator_name,
};
    
export type e_tools_ascenlint = {
    installation_path : string,
    ascentlint_options : any[],
};
    
export type e_tools_cocotb = {
    installation_path : string,
    simulator_name : e_tools_cocotb_simulator_name,
    compile_args : string,
    run_args : string,
    plusargs : string,
};
    
export type e_tools_diamond = {
    installation_path : string,
    part : string,
};
    
export type e_tools_ghdl = {
    installation_path : string,
    waveform : e_tools_ghdl_waveform,
    analyze_options : any[],
    run_options : any[],
};
    
export type e_tools_icarus = {
    installation_path : string,
    timescale : string,
    iverilog_options : any[],
};
    
export type e_tools_icestorm = {
    installation_path : string,
    pnr : e_tools_icestorm_pnr,
    arch : e_tools_icestorm_arch,
    output_format : e_tools_icestorm_output_format,
    yosys_as_subtool : boolean,
    makefile_name : string,
    arachne_pnr_options : any[],
    nextpnr_options : any[],
    yosys_synth_options : any[],
};
    
export type e_tools_ise = {
    installation_path : string,
    family : string,
    device : string,
    package : string,
    speed : string,
};
    
export type e_tools_isem = {
    installation_path : string,
    fuse_options : any[],
    isim_options : any[],
};
    
export type e_tools_modelsim = {
    installation_path : string,
    vcom_options : any[],
    vlog_options : any[],
    vsim_options : any[],
};
    
export type e_tools_morty = {
    installation_path : string,
    morty_options : any[],
};
    
export type e_tools_quartus = {
    installation_path : string,
    family : string,
    device : string,
    cable : string,
    board_device_index : string,
    pnr : e_tools_quartus_pnr,
    dse_options : any[],
    quartus_options : any[],
};
    
export type e_tools_radiant = {
    installation_path : string,
    part : string,
};
    
export type e_tools_rivierapro = {
    installation_path : string,
    compilation_mode : string,
    vlog_options : any[],
    vsim_options : any[],
};
    
export type e_tools_siliconcompiler = {
    installation_path : string,
    target : string,
    server_enable : boolean,
    server_address : string,
    server_username : string,
    server_password : string,
};
    
export type e_tools_spyglass = {
    installation_path : string,
    methodology : string,
    goals : any[],
    spyglass_options : any[],
    rule_parameters : any[],
};
    
export type e_tools_symbiyosys = {
    installation_path : string,
    tasknames : any[],
};
    
export type e_tools_symbiflow = {
    installation_path : string,
    package : string,
    part : string,
    vendor : string,
    pnr : e_tools_symbiflow_pnr,
    vpr_options : string,
    environment_script : string,
};
    
export type e_tools_trellis = {
    installation_path : string,
    arch : e_tools_trellis_arch,
    output_format : e_tools_trellis_output_format,
    yosys_as_subtool : boolean,
    makefile_name : string,
    script_name : string,
    nextpnr_options : any[],
    yosys_synth_options : any[],
};
    
export type e_tools_vcs = {
    installation_path : string,
    vcs_options : any[],
    run_options : any[],
};
    
export type e_tools_verible = {
    installation_path : string,
};
    
export type e_tools_verilator = {
    installation_path : string,
    mode : e_tools_verilator_mode,
    libs : any[],
    verilator_options : any[],
    make_options : any[],
    run_options : any[],
};
    
export type e_tools_vivado = {
    installation_path : string,
    part : string,
    synth : string,
    pnr : e_tools_vivado_pnr,
    jtag_freq : number,
    hw_target : string,
};
    
export type e_tools_vunit = {
    installation_path : string,
    simulator_name : e_tools_vunit_simulator_name,
    runpy_mode : e_tools_vunit_runpy_mode,
    extra_options : any[],
    enable_array_util_lib : boolean,
    enable_com_lib : boolean,
    enable_json4vhdl_lib : boolean,
    enable_osvvm_lib : boolean,
    enable_random_lib : boolean,
    enable_verification_components_lib : boolean,
};
    
export type e_tools_xcelium = {
    installation_path : string,
    xmvhdl_options : any[],
    xmvlog_options : any[],
    xmsim_options : any[],
    xrun_options : any[],
};
    
export type e_tools_xsim = {
    installation_path : string,
    xelab_options : any[],
    xsim_options : any[],
};
    
export type e_tools_yosys = {
    installation_path : string,
    arch : e_tools_yosys_arch,
    output_format : e_tools_yosys_output_format,
    yosys_as_subtool : boolean,
    makefile_name : string,
    script_name : string,
    yosys_synth_options : any[],
};
    
export type e_tools_openfpga = {
    installation_path : string,
    arch : e_tools_openfpga_arch,
    output_format : e_tools_openfpga_output_format,
    yosys_as_subtool : boolean,
    makefile_name : string,
    script_name : string,
    yosys_synth_options : any[],
};
    
export type e_tools_activehdl = {
    installation_path : string,
};
    
export type e_tools_nvc = {
    installation_path : string,
};
    
export type e_tools_questa = {
    installation_path : string,
};
    
export type e_tools_raptor = {
    installation_path : string,
    target_device : string,
    vhdl_version : e_tools_raptor_vhdl_version,
    verilog_version : e_tools_raptor_verilog_version,
    sv_version : e_tools_raptor_sv_version,
    optimization : e_tools_raptor_optimization,
    effort : e_tools_raptor_effort,
    fsm_encoding : e_tools_raptor_fsm_encoding,
    carry : e_tools_raptor_carry,
    pnr_netlist_language : e_tools_raptor_pnr_netlist_language,
    dsp_limit : number,
    block_ram_limit : number,
    fast_synthesis : boolean,
    top_level : string,
    sim_source_list : any[],
    simulate_rtl : boolean,
    waveform_rtl : string,
    simulator_rtl : e_tools_raptor_simulator_rtl,
    simulation_options_rtl : string,
    simulate_gate : boolean,
    waveform_gate : string,
    simulator_gate : e_tools_raptor_simulator_gate,
    simulation_options_gate : string,
    simulate_pnr : boolean,
    waveform_pnr : string,
    simulator_pnr : e_tools_raptor_simulator_pnr,
    simulation_options_pnr : string,
};
    
export enum e_documentation_general_language {
    english = "english",
    russian = "russian",
}
export enum e_documentation_general_ports {
    all = "all",
    only_commented = "only_commented",
    none = "none",
}
export enum e_documentation_general_generics {
    all = "all",
    only_commented = "only_commented",
    none = "none",
}
export enum e_documentation_general_instantiations {
    all = "all",
    only_commented = "only_commented",
    none = "none",
}
export enum e_documentation_general_signals {
    all = "all",
    only_commented = "only_commented",
    none = "none",
}
export enum e_documentation_general_constants {
    all = "all",
    only_commented = "only_commented",
    none = "none",
}
export enum e_documentation_general_types {
    all = "all",
    only_commented = "only_commented",
    none = "none",
}
export enum e_documentation_general_process {
    all = "all",
    only_commented = "only_commented",
    none = "none",
}
export enum e_documentation_general_functions {
    all = "all",
    only_commented = "only_commented",
    none = "none",
}
export enum e_formatter_general_formatter_verilog {
    istyle = "istyle",
    s3sv = "s3sv",
    verible = "verible",
}
export enum e_formatter_general_formatter_vhdl {
    standalone = "standalone",
    vsg = "vsg",
}
export enum e_formatter_istyle_style {
    ansi = "ansi",
    kr = "kr",
    gnu = "gnu",
    indent_only = "indent_only",
}
export enum e_formatter_standalone_keyword_case {
    lowercase = "lowercase",
    uppercase = "uppercase",
}
export enum e_formatter_standalone_name_case {
    lowercase = "lowercase",
    uppercase = "uppercase",
}
export enum e_formatter_standalone_new_line_after_then {
    new_line = "new_line",
    no_new_line = "no_new_line",
    none = "none",
}
export enum e_formatter_standalone_new_line_after_semicolon {
    new_line = "new_line",
    no_new_line = "no_new_line",
    none = "none",
}
export enum e_formatter_standalone_new_line_after_else {
    new_line = "new_line",
    no_new_line = "no_new_line",
    none = "none",
}
export enum e_formatter_standalone_new_line_after_port {
    new_line = "new_line",
    no_new_line = "no_new_line",
    none = "none",
}
export enum e_formatter_standalone_new_line_after_generic {
    new_line = "new_line",
    no_new_line = "no_new_line",
    none = "none",
}
export enum e_linter_general_linter_vhdl {
    disabled = "disabled",
    ghdl = "ghdl",
    modelsim = "modelsim",
    vivado = "vivado",
    none = "none",
}
export enum e_linter_general_linter_verilog {
    disabled = "disabled",
    icarus = "icarus",
    modelsim = "modelsim",
    verilator = "verilator",
    vivado = "vivado",
}
export enum e_linter_general_lstyle_verilog {
    verible = "verible",
    disabled = "disabled",
}
export enum e_linter_general_lstyle_vhdl {
    vsg = "vsg",
    disabled = "disabled",
}
export enum e_schematic_general_backend {
    yowasp = "yowasp",
    yosys = "yosys",
    yosys_ghdl = "yosys_ghdl",
    yosys_ghdl_module = "yosys_ghdl_module",
}
export enum e_templates_general_clock_generation_style {
    inline = "inline",
    ifelse = "ifelse",
}
export enum e_templates_general_instance_style {
    inline = "inline",
    separate = "separate",
}
export enum e_tools_general_select_tool {
    osvvm = "osvvm",
    vunit = "vunit",
    ghdl = "ghdl",
    cocotb = "cocotb",
    icarus = "icarus",
    icestorm = "icestorm",
    ise = "ise",
    isim = "isim",
    modelsim = "modelsim",
    openfpga = "openfpga",
    quartus = "quartus",
    rivierapro = "rivierapro",
    spyglass = "spyglass",
    trellis = "trellis",
    vcs = "vcs",
    verilator = "verilator",
    vivado = "vivado",
    xcelium = "xcelium",
    xsim = "xsim",
    raptor = "raptor",
}
export enum e_tools_general_execution_mode {
    gui = "gui",
    cmd = "cmd",
}
export enum e_tools_general_waveform_viewer {
    tool = "tool",
    gtkwave = "gtkwave",
}
export enum e_tools_osvvm_simulator_name {
    activehdl = "activehdl",
    ghdl = "ghdl",
    nvc = "nvc",
    rivierapro = "rivierapro",
    questa = "questa",
    modelsim = "modelsim",
    vcs = "vcs",
    xsim = "xsim",
    xcelium = "xcelium",
}
export enum e_tools_cocotb_simulator_name {
    icarus = "icarus",
    verilator = "verilator",
    vcs = "vcs",
    riviera = "riviera",
    activehdl = "activehdl",
    questa = "questa",
    modelsim = "modelsim",
    ius = "ius",
    xcelium = "xcelium",
    ghdl = "ghdl",
    cvc = "cvc",
}
export enum e_tools_ghdl_waveform {
    vcd = "vcd",
    ghw = "ghw",
}
export enum e_tools_icestorm_pnr {
    arachne = "arachne",
    next = "next",
    none = "none",
}
export enum e_tools_icestorm_arch {
    xilinx = "xilinx",
    ice40 = "ice40",
    ecp5 = "ecp5",
}
export enum e_tools_icestorm_output_format {
    json = "json",
    edif = "edif",
    blif = "blif",
}
export enum e_tools_quartus_pnr {
    default = "default",
    dse = "dse",
    none = "none",
}
export enum e_tools_symbiflow_pnr {
    vpr = "vpr",
}
export enum e_tools_trellis_arch {
    xilinx = "xilinx",
    ice40 = "ice40",
    ecp5 = "ecp5",
}
export enum e_tools_trellis_output_format {
    json = "json",
    edif = "edif",
    blif = "blif",
}
export enum e_tools_verilator_mode {
    cc = "cc",
    sc = "sc",
    lint_only = "lint-only",
}
export enum e_tools_vivado_pnr {
    vivado = "vivado",
    none = "none",
}
export enum e_tools_vunit_simulator_name {
    rivierapro = "rivierapro",
    activehdl = "activehdl",
    ghdl = "ghdl",
    modelsim = "modelsim",
    xsim = "xsim",
}
export enum e_tools_vunit_runpy_mode {
    standalone = "standalone",
    creation = "creation",
}
export enum e_tools_yosys_arch {
    xilinx = "xilinx",
    ice40 = "ice40",
    ecp5 = "ecp5",
}
export enum e_tools_yosys_output_format {
    json = "json",
    edif = "edif",
    blif = "blif",
}
export enum e_tools_openfpga_arch {
    xilinx = "xilinx",
    ice40 = "ice40",
    ecp5 = "ecp5",
}
export enum e_tools_openfpga_output_format {
    json = "json",
    edif = "edif",
    blif = "blif",
}
export enum e_tools_raptor_vhdl_version {
    VHDL_1987 = "VHDL_1987",
    VHDL_1993 = "VHDL_1993",
    VHDL_2000 = "VHDL_2000",
    VHDL_2008 = "VHDL_2008",
    VHDL_2019 = "VHDL_2019",
}
export enum e_tools_raptor_verilog_version {
    V_1995 = "V_1995",
    V_2001 = "V_2001",
}
export enum e_tools_raptor_sv_version {
    SV_2005 = "SV_2005",
    SV_2009 = "SV_2009",
    SV_2012 = "SV_2012",
    SV_2017 = "SV_2017",
}
export enum e_tools_raptor_optimization {
    area = "area",
    delay = "delay",
    mixed = "mixed",
    none = "none",
}
export enum e_tools_raptor_effort {
    high = "high",
    medium = "medium",
    low = "low",
}
export enum e_tools_raptor_fsm_encoding {
    binary = "binary",
    onehot = "onehot",
}
export enum e_tools_raptor_carry {
    auto = "auto",
    all = "all",
    none = "none",
}
export enum e_tools_raptor_pnr_netlist_language {
    blif = "blif",
    edif = "edif",
    verilog = "verilog",
    vhdl = "vhdl",
}
export enum e_tools_raptor_simulator_rtl {
    verilator = "verilator",
    ghdl = "ghdl",
    icarus = "icarus",
}
export enum e_tools_raptor_simulator_gate {
    verilator = "verilator",
    ghdl = "ghdl",
    icarus = "icarus",
}
export enum e_tools_raptor_simulator_pnr {
    verilator = "verilator",
    ghdl = "ghdl",
    icarus = "icarus",
}

export function get_default_config(): e_config {
    return {
        general: {
            general: {
                logging : true,
                pypath : "",
                go_to_definition_vhdl : true,
                go_to_definition_verilog : true,
                developer_mode : false,
            },
        },
        documentation: {
            general: {
                language : e_documentation_general_language.english,
                symbol_vhdl : "!",
                symbol_verilog : "!",
                dependency_graph : true,
                self_contained : true,
                fsm : true,
                ports : e_documentation_general_ports.all,
                generics : e_documentation_general_generics.all,
                instantiations : e_documentation_general_instantiations.all,
                signals : e_documentation_general_signals.all,
                constants : e_documentation_general_constants.all,
                types : e_documentation_general_types.all,
                process : e_documentation_general_process.all,
                functions : e_documentation_general_functions.all,
                magic_config_path : "",
            },
        },
        editor: {
            general: {
                stutter_comment_shortcuts : false,
                stutter_block_width : 80,
                stutter_max_width : 0,
                stutter_delimiters : false,
                stutter_bracket_shortcuts : false,
            },
        },
        formatter: {
            general: {
                formatter_verilog : e_formatter_general_formatter_verilog.istyle,
                formatter_vhdl : e_formatter_general_formatter_vhdl.standalone,
            },
            istyle: {
                style : e_formatter_istyle_style.ansi,
                indentation_size : 2,
            },
            s3sv: {
                one_bind_per_line : false,
                one_declaration_per_line : false,
                use_tabs : false,
                indentation_size : 2,
            },
            verible: {
                format_args : "",
            },
            standalone: {
                keyword_case : e_formatter_standalone_keyword_case.lowercase,
                name_case : e_formatter_standalone_name_case.lowercase,
                indentation : "  ",
                align_port_generic : true,
                align_comment : false,
                remove_comments : false,
                remove_reports : false,
                check_alias : false,
                new_line_after_then : e_formatter_standalone_new_line_after_then.new_line,
                new_line_after_semicolon : e_formatter_standalone_new_line_after_semicolon.new_line,
                new_line_after_else : e_formatter_standalone_new_line_after_else.new_line,
                new_line_after_port : e_formatter_standalone_new_line_after_port.new_line,
                new_line_after_generic : e_formatter_standalone_new_line_after_generic.new_line,
            },
            svg: {
                configuration : "",
                core_number : 2,
            },
        },
        linter: {
            general: {
                linter_vhdl : e_linter_general_linter_vhdl.ghdl,
                linter_verilog : e_linter_general_linter_verilog.modelsim,
                lstyle_verilog : e_linter_general_lstyle_verilog.disabled,
                lstyle_vhdl : e_linter_general_lstyle_vhdl.disabled,
            },
            ghdl: {
                arguments : "",
            },
            icarus: {
                arguments : "",
            },
            modelsim: {
                vhdl_arguments : "",
                verilog_arguments : "",
            },
            verible: {
                arguments : "",
            },
            verilator: {
                arguments : "",
            },
            vivado: {
                vhdl_arguments : "",
                verilog_arguments : "",
            },
            vsg: {
                arguments : "",
            },
        },
        schematic: {
            general: {
                backend : e_schematic_general_backend.yowasp,
                args : "",
            },
        },
        templates: {
            general: {
                header_file_path : "",
                indent : "  ",
                clock_generation_style : e_templates_general_clock_generation_style.inline,
                instance_style : e_templates_general_instance_style.inline,
            },
        },
        tools: {
            general: {
                select_tool : e_tools_general_select_tool.ghdl,
                gtkwave_installation_path : "",
                execution_mode : e_tools_general_execution_mode.cmd,
                waveform_viewer : e_tools_general_waveform_viewer.tool,
            },
            osvvm: {
                installation_path : "",
                tclsh_binary : "",
                simulator_name : e_tools_osvvm_simulator_name.ghdl,
            },
            ascenlint: {
                installation_path : "",
                ascentlint_options : [],
            },
            cocotb: {
                installation_path : "",
                simulator_name : e_tools_cocotb_simulator_name.ghdl,
                compile_args : "",
                run_args : "",
                plusargs : "",
            },
            diamond: {
                installation_path : "",
                part : "",
            },
            ghdl: {
                installation_path : "",
                waveform : e_tools_ghdl_waveform.vcd,
                analyze_options : [],
                run_options : [],
            },
            icarus: {
                installation_path : "",
                timescale : "",
                iverilog_options : [],
            },
            icestorm: {
                installation_path : "",
                pnr : e_tools_icestorm_pnr.none,
                arch : e_tools_icestorm_arch.xilinx,
                output_format : e_tools_icestorm_output_format.json,
                yosys_as_subtool : false,
                makefile_name : "",
                arachne_pnr_options : [],
                nextpnr_options : [],
                yosys_synth_options : [],
            },
            ise: {
                installation_path : "",
                family : "",
                device : "",
                package : "",
                speed : "",
            },
            isem: {
                installation_path : "",
                fuse_options : [],
                isim_options : [],
            },
            modelsim: {
                installation_path : "",
                vcom_options : [],
                vlog_options : [],
                vsim_options : [],
            },
            morty: {
                installation_path : "",
                morty_options : [],
            },
            quartus: {
                installation_path : "",
                family : "",
                device : "",
                cable : "",
                board_device_index : "",
                pnr : e_tools_quartus_pnr.none,
                dse_options : [],
                quartus_options : [],
            },
            radiant: {
                installation_path : "",
                part : "",
            },
            rivierapro: {
                installation_path : "",
                compilation_mode : "",
                vlog_options : [],
                vsim_options : [],
            },
            siliconcompiler: {
                installation_path : "",
                target : "",
                server_enable : false,
                server_address : "",
                server_username : "",
                server_password : "",
            },
            spyglass: {
                installation_path : "",
                methodology : "",
                goals : [],
                spyglass_options : [],
                rule_parameters : [],
            },
            symbiyosys: {
                installation_path : "",
                tasknames : [],
            },
            symbiflow: {
                installation_path : "",
                package : "",
                part : "",
                vendor : "",
                pnr : e_tools_symbiflow_pnr.vpr,
                vpr_options : "",
                environment_script : "",
            },
            trellis: {
                installation_path : "",
                arch : e_tools_trellis_arch.xilinx,
                output_format : e_tools_trellis_output_format.json,
                yosys_as_subtool : false,
                makefile_name : "",
                script_name : "",
                nextpnr_options : [],
                yosys_synth_options : [],
            },
            vcs: {
                installation_path : "",
                vcs_options : [],
                run_options : [],
            },
            verible: {
                installation_path : "",
            },
            verilator: {
                installation_path : "",
                mode : e_tools_verilator_mode.lint_only,
                libs : [],
                verilator_options : [],
                make_options : [],
                run_options : [],
            },
            vivado: {
                installation_path : "",
                part : "",
                synth : "",
                pnr : e_tools_vivado_pnr.vivado,
                jtag_freq : 10000,
                hw_target : "",
            },
            vunit: {
                installation_path : "",
                simulator_name : e_tools_vunit_simulator_name.ghdl,
                runpy_mode : e_tools_vunit_runpy_mode.standalone,
                extra_options : [],
                enable_array_util_lib : false,
                enable_com_lib : false,
                enable_json4vhdl_lib : false,
                enable_osvvm_lib : false,
                enable_random_lib : false,
                enable_verification_components_lib : false,
            },
            xcelium: {
                installation_path : "",
                xmvhdl_options : [],
                xmvlog_options : [],
                xmsim_options : [],
                xrun_options : [],
            },
            xsim: {
                installation_path : "",
                xelab_options : [],
                xsim_options : [],
            },
            yosys: {
                installation_path : "",
                arch : e_tools_yosys_arch.xilinx,
                output_format : e_tools_yosys_output_format.json,
                yosys_as_subtool : false,
                makefile_name : "",
                script_name : "",
                yosys_synth_options : [],
            },
            openfpga: {
                installation_path : "",
                arch : e_tools_openfpga_arch.xilinx,
                output_format : e_tools_openfpga_output_format.json,
                yosys_as_subtool : false,
                makefile_name : "",
                script_name : "",
                yosys_synth_options : [],
            },
            activehdl: {
                installation_path : "",
            },
            nvc: {
                installation_path : "",
            },
            questa: {
                installation_path : "",
            },
            raptor: {
                installation_path : "",
                target_device : "1GE100",
                vhdl_version : e_tools_raptor_vhdl_version.VHDL_1993,
                verilog_version : e_tools_raptor_verilog_version.V_2001,
                sv_version : e_tools_raptor_sv_version.SV_2012,
                optimization : e_tools_raptor_optimization.none,
                effort : e_tools_raptor_effort.high,
                fsm_encoding : e_tools_raptor_fsm_encoding.onehot,
                carry : e_tools_raptor_carry.auto,
                pnr_netlist_language : e_tools_raptor_pnr_netlist_language.verilog,
                dsp_limit : 154,
                block_ram_limit : 154,
                fast_synthesis : false,
                top_level : "",
                sim_source_list : [],
                simulate_rtl : false,
                waveform_rtl : "syn_tb_rtl.fst",
                simulator_rtl : e_tools_raptor_simulator_rtl.ghdl,
                simulation_options_rtl : "--stop-time=1000ns",
                simulate_gate : false,
                waveform_gate : "syn_tb_gate.fst",
                simulator_gate : e_tools_raptor_simulator_gate.ghdl,
                simulation_options_gate : "--stop-time=1000ns",
                simulate_pnr : false,
                waveform_pnr : "sim_pnr.fst",
                simulator_pnr : e_tools_raptor_simulator_pnr.ghdl,
                simulation_options_pnr : "--stop-time=1000ns",
            },
        },
    };
}


export function get_config_from_json(json_config: any): e_config {
    const default_config = get_default_config();

    // general -> general -> logging
    const current_value_0 = json_config['general']['general']['logging'];
    if (current_value_0 === true || current_value_0 === false){
        default_config['general']['general']['logging'] = current_value_0;
    }
            
    // general -> general -> pypath
    const current_value_1 = json_config['general']['general']['pypath'];
    if (typeof current_value_1 === 'string'){
        default_config['general']['general']['pypath'] = current_value_1;
    }
            
    // general -> general -> go_to_definition_vhdl
    const current_value_2 = json_config['general']['general']['go_to_definition_vhdl'];
    if (current_value_2 === true || current_value_2 === false){
        default_config['general']['general']['go_to_definition_vhdl'] = current_value_2;
    }
            
    // general -> general -> go_to_definition_verilog
    const current_value_3 = json_config['general']['general']['go_to_definition_verilog'];
    if (current_value_3 === true || current_value_3 === false){
        default_config['general']['general']['go_to_definition_verilog'] = current_value_3;
    }
            
    // general -> general -> developer_mode
    const current_value_4 = json_config['general']['general']['developer_mode'];
    if (current_value_4 === true || current_value_4 === false){
        default_config['general']['general']['developer_mode'] = current_value_4;
    }
            
    // documentation -> general -> language
    const current_value_5 = json_config['documentation']['general']['language'];
    if ( current_value_5 === "english"){
        default_config['documentation']['general']['language'] = e_documentation_general_language.english;
    }
    if ( current_value_5 === "russian"){
        default_config['documentation']['general']['language'] = e_documentation_general_language.russian;
    }
            
    // documentation -> general -> symbol_vhdl
    const current_value_6 = json_config['documentation']['general']['symbol_vhdl'];
    if (typeof current_value_6 === 'string'){
        default_config['documentation']['general']['symbol_vhdl'] = current_value_6;
    }
            
    // documentation -> general -> symbol_verilog
    const current_value_7 = json_config['documentation']['general']['symbol_verilog'];
    if (typeof current_value_7 === 'string'){
        default_config['documentation']['general']['symbol_verilog'] = current_value_7;
    }
            
    // documentation -> general -> dependency_graph
    const current_value_8 = json_config['documentation']['general']['dependency_graph'];
    if (current_value_8 === true || current_value_8 === false){
        default_config['documentation']['general']['dependency_graph'] = current_value_8;
    }
            
    // documentation -> general -> self_contained
    const current_value_9 = json_config['documentation']['general']['self_contained'];
    if (current_value_9 === true || current_value_9 === false){
        default_config['documentation']['general']['self_contained'] = current_value_9;
    }
            
    // documentation -> general -> fsm
    const current_value_10 = json_config['documentation']['general']['fsm'];
    if (current_value_10 === true || current_value_10 === false){
        default_config['documentation']['general']['fsm'] = current_value_10;
    }
            
    // documentation -> general -> ports
    const current_value_11 = json_config['documentation']['general']['ports'];
    if ( current_value_11 === "all"){
        default_config['documentation']['general']['ports'] = e_documentation_general_ports.all;
    }
    if ( current_value_11 === "only_commented"){
        default_config['documentation']['general']['ports'] = e_documentation_general_ports.only_commented;
    }
    if ( current_value_11 === "none"){
        default_config['documentation']['general']['ports'] = e_documentation_general_ports.none;
    }
            
    // documentation -> general -> generics
    const current_value_12 = json_config['documentation']['general']['generics'];
    if ( current_value_12 === "all"){
        default_config['documentation']['general']['generics'] = e_documentation_general_generics.all;
    }
    if ( current_value_12 === "only_commented"){
        default_config['documentation']['general']['generics'] = e_documentation_general_generics.only_commented;
    }
    if ( current_value_12 === "none"){
        default_config['documentation']['general']['generics'] = e_documentation_general_generics.none;
    }
            
    // documentation -> general -> instantiations
    const current_value_13 = json_config['documentation']['general']['instantiations'];
    if ( current_value_13 === "all"){
        default_config['documentation']['general']['instantiations'] = e_documentation_general_instantiations.all;
    }
    if ( current_value_13 === "only_commented"){
        default_config['documentation']['general']['instantiations'] = e_documentation_general_instantiations.only_commented;
    }
    if ( current_value_13 === "none"){
        default_config['documentation']['general']['instantiations'] = e_documentation_general_instantiations.none;
    }
            
    // documentation -> general -> signals
    const current_value_14 = json_config['documentation']['general']['signals'];
    if ( current_value_14 === "all"){
        default_config['documentation']['general']['signals'] = e_documentation_general_signals.all;
    }
    if ( current_value_14 === "only_commented"){
        default_config['documentation']['general']['signals'] = e_documentation_general_signals.only_commented;
    }
    if ( current_value_14 === "none"){
        default_config['documentation']['general']['signals'] = e_documentation_general_signals.none;
    }
            
    // documentation -> general -> constants
    const current_value_15 = json_config['documentation']['general']['constants'];
    if ( current_value_15 === "all"){
        default_config['documentation']['general']['constants'] = e_documentation_general_constants.all;
    }
    if ( current_value_15 === "only_commented"){
        default_config['documentation']['general']['constants'] = e_documentation_general_constants.only_commented;
    }
    if ( current_value_15 === "none"){
        default_config['documentation']['general']['constants'] = e_documentation_general_constants.none;
    }
            
    // documentation -> general -> types
    const current_value_16 = json_config['documentation']['general']['types'];
    if ( current_value_16 === "all"){
        default_config['documentation']['general']['types'] = e_documentation_general_types.all;
    }
    if ( current_value_16 === "only_commented"){
        default_config['documentation']['general']['types'] = e_documentation_general_types.only_commented;
    }
    if ( current_value_16 === "none"){
        default_config['documentation']['general']['types'] = e_documentation_general_types.none;
    }
            
    // documentation -> general -> process
    const current_value_17 = json_config['documentation']['general']['process'];
    if ( current_value_17 === "all"){
        default_config['documentation']['general']['process'] = e_documentation_general_process.all;
    }
    if ( current_value_17 === "only_commented"){
        default_config['documentation']['general']['process'] = e_documentation_general_process.only_commented;
    }
    if ( current_value_17 === "none"){
        default_config['documentation']['general']['process'] = e_documentation_general_process.none;
    }
            
    // documentation -> general -> functions
    const current_value_18 = json_config['documentation']['general']['functions'];
    if ( current_value_18 === "all"){
        default_config['documentation']['general']['functions'] = e_documentation_general_functions.all;
    }
    if ( current_value_18 === "only_commented"){
        default_config['documentation']['general']['functions'] = e_documentation_general_functions.only_commented;
    }
    if ( current_value_18 === "none"){
        default_config['documentation']['general']['functions'] = e_documentation_general_functions.none;
    }
            
    // documentation -> general -> magic_config_path
    const current_value_19 = json_config['documentation']['general']['magic_config_path'];
    if (typeof current_value_19 === 'string'){
        default_config['documentation']['general']['magic_config_path'] = current_value_19;
    }
            
    // editor -> general -> stutter_comment_shortcuts
    const current_value_20 = json_config['editor']['general']['stutter_comment_shortcuts'];
    if (current_value_20 === true || current_value_20 === false){
        default_config['editor']['general']['stutter_comment_shortcuts'] = current_value_20;
    }
            
    // editor -> general -> stutter_block_width
    const current_value_21 = json_config['editor']['general']['stutter_block_width'];
    if (typeof current_value_21 === 'number'){
        default_config['editor']['general']['stutter_block_width'] = current_value_21;
    }
            
    // editor -> general -> stutter_max_width
    const current_value_22 = json_config['editor']['general']['stutter_max_width'];
    if (typeof current_value_22 === 'number'){
        default_config['editor']['general']['stutter_max_width'] = current_value_22;
    }
            
    // editor -> general -> stutter_delimiters
    const current_value_23 = json_config['editor']['general']['stutter_delimiters'];
    if (current_value_23 === true || current_value_23 === false){
        default_config['editor']['general']['stutter_delimiters'] = current_value_23;
    }
            
    // editor -> general -> stutter_bracket_shortcuts
    const current_value_24 = json_config['editor']['general']['stutter_bracket_shortcuts'];
    if (current_value_24 === true || current_value_24 === false){
        default_config['editor']['general']['stutter_bracket_shortcuts'] = current_value_24;
    }
            
    // formatter -> general -> formatter_verilog
    const current_value_25 = json_config['formatter']['general']['formatter_verilog'];
    if ( current_value_25 === "istyle"){
        default_config['formatter']['general']['formatter_verilog'] = e_formatter_general_formatter_verilog.istyle;
    }
    if ( current_value_25 === "s3sv"){
        default_config['formatter']['general']['formatter_verilog'] = e_formatter_general_formatter_verilog.s3sv;
    }
    if ( current_value_25 === "verible"){
        default_config['formatter']['general']['formatter_verilog'] = e_formatter_general_formatter_verilog.verible;
    }
            
    // formatter -> general -> formatter_vhdl
    const current_value_26 = json_config['formatter']['general']['formatter_vhdl'];
    if ( current_value_26 === "standalone"){
        default_config['formatter']['general']['formatter_vhdl'] = e_formatter_general_formatter_vhdl.standalone;
    }
    if ( current_value_26 === "vsg"){
        default_config['formatter']['general']['formatter_vhdl'] = e_formatter_general_formatter_vhdl.vsg;
    }
            
    // formatter -> istyle -> style
    const current_value_27 = json_config['formatter']['istyle']['style'];
    if ( current_value_27 === "ansi"){
        default_config['formatter']['istyle']['style'] = e_formatter_istyle_style.ansi;
    }
    if ( current_value_27 === "kr"){
        default_config['formatter']['istyle']['style'] = e_formatter_istyle_style.kr;
    }
    if ( current_value_27 === "gnu"){
        default_config['formatter']['istyle']['style'] = e_formatter_istyle_style.gnu;
    }
    if ( current_value_27 === "indent_only"){
        default_config['formatter']['istyle']['style'] = e_formatter_istyle_style.indent_only;
    }
            
    // formatter -> istyle -> indentation_size
    const current_value_28 = json_config['formatter']['istyle']['indentation_size'];
    if (typeof current_value_28 === 'number'){
        default_config['formatter']['istyle']['indentation_size'] = current_value_28;
    }
            
    // formatter -> s3sv -> one_bind_per_line
    const current_value_29 = json_config['formatter']['s3sv']['one_bind_per_line'];
    if (current_value_29 === true || current_value_29 === false){
        default_config['formatter']['s3sv']['one_bind_per_line'] = current_value_29;
    }
            
    // formatter -> s3sv -> one_declaration_per_line
    const current_value_30 = json_config['formatter']['s3sv']['one_declaration_per_line'];
    if (current_value_30 === true || current_value_30 === false){
        default_config['formatter']['s3sv']['one_declaration_per_line'] = current_value_30;
    }
            
    // formatter -> s3sv -> use_tabs
    const current_value_31 = json_config['formatter']['s3sv']['use_tabs'];
    if (current_value_31 === true || current_value_31 === false){
        default_config['formatter']['s3sv']['use_tabs'] = current_value_31;
    }
            
    // formatter -> s3sv -> indentation_size
    const current_value_32 = json_config['formatter']['s3sv']['indentation_size'];
    if (typeof current_value_32 === 'number'){
        default_config['formatter']['s3sv']['indentation_size'] = current_value_32;
    }
            
    // formatter -> verible -> format_args
    const current_value_33 = json_config['formatter']['verible']['format_args'];
    if (typeof current_value_33 === 'string'){
        default_config['formatter']['verible']['format_args'] = current_value_33;
    }
            
    // formatter -> standalone -> keyword_case
    const current_value_34 = json_config['formatter']['standalone']['keyword_case'];
    if ( current_value_34 === "lowercase"){
        default_config['formatter']['standalone']['keyword_case'] = e_formatter_standalone_keyword_case.lowercase;
    }
    if ( current_value_34 === "uppercase"){
        default_config['formatter']['standalone']['keyword_case'] = e_formatter_standalone_keyword_case.uppercase;
    }
            
    // formatter -> standalone -> name_case
    const current_value_35 = json_config['formatter']['standalone']['name_case'];
    if ( current_value_35 === "lowercase"){
        default_config['formatter']['standalone']['name_case'] = e_formatter_standalone_name_case.lowercase;
    }
    if ( current_value_35 === "uppercase"){
        default_config['formatter']['standalone']['name_case'] = e_formatter_standalone_name_case.uppercase;
    }
            
    // formatter -> standalone -> indentation
    const current_value_36 = json_config['formatter']['standalone']['indentation'];
    if (typeof current_value_36 === 'string'){
        default_config['formatter']['standalone']['indentation'] = current_value_36;
    }
            
    // formatter -> standalone -> align_port_generic
    const current_value_37 = json_config['formatter']['standalone']['align_port_generic'];
    if (current_value_37 === true || current_value_37 === false){
        default_config['formatter']['standalone']['align_port_generic'] = current_value_37;
    }
            
    // formatter -> standalone -> align_comment
    const current_value_38 = json_config['formatter']['standalone']['align_comment'];
    if (current_value_38 === true || current_value_38 === false){
        default_config['formatter']['standalone']['align_comment'] = current_value_38;
    }
            
    // formatter -> standalone -> remove_comments
    const current_value_39 = json_config['formatter']['standalone']['remove_comments'];
    if (current_value_39 === true || current_value_39 === false){
        default_config['formatter']['standalone']['remove_comments'] = current_value_39;
    }
            
    // formatter -> standalone -> remove_reports
    const current_value_40 = json_config['formatter']['standalone']['remove_reports'];
    if (current_value_40 === true || current_value_40 === false){
        default_config['formatter']['standalone']['remove_reports'] = current_value_40;
    }
            
    // formatter -> standalone -> check_alias
    const current_value_41 = json_config['formatter']['standalone']['check_alias'];
    if (current_value_41 === true || current_value_41 === false){
        default_config['formatter']['standalone']['check_alias'] = current_value_41;
    }
            
    // formatter -> standalone -> new_line_after_then
    const current_value_42 = json_config['formatter']['standalone']['new_line_after_then'];
    if ( current_value_42 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_then'] = e_formatter_standalone_new_line_after_then.new_line;
    }
    if ( current_value_42 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_then'] = e_formatter_standalone_new_line_after_then.no_new_line;
    }
    if ( current_value_42 === "none"){
        default_config['formatter']['standalone']['new_line_after_then'] = e_formatter_standalone_new_line_after_then.none;
    }
            
    // formatter -> standalone -> new_line_after_semicolon
    const current_value_43 = json_config['formatter']['standalone']['new_line_after_semicolon'];
    if ( current_value_43 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_semicolon'] = e_formatter_standalone_new_line_after_semicolon.new_line;
    }
    if ( current_value_43 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_semicolon'] = e_formatter_standalone_new_line_after_semicolon.no_new_line;
    }
    if ( current_value_43 === "none"){
        default_config['formatter']['standalone']['new_line_after_semicolon'] = e_formatter_standalone_new_line_after_semicolon.none;
    }
            
    // formatter -> standalone -> new_line_after_else
    const current_value_44 = json_config['formatter']['standalone']['new_line_after_else'];
    if ( current_value_44 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_else'] = e_formatter_standalone_new_line_after_else.new_line;
    }
    if ( current_value_44 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_else'] = e_formatter_standalone_new_line_after_else.no_new_line;
    }
    if ( current_value_44 === "none"){
        default_config['formatter']['standalone']['new_line_after_else'] = e_formatter_standalone_new_line_after_else.none;
    }
            
    // formatter -> standalone -> new_line_after_port
    const current_value_45 = json_config['formatter']['standalone']['new_line_after_port'];
    if ( current_value_45 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_port'] = e_formatter_standalone_new_line_after_port.new_line;
    }
    if ( current_value_45 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_port'] = e_formatter_standalone_new_line_after_port.no_new_line;
    }
    if ( current_value_45 === "none"){
        default_config['formatter']['standalone']['new_line_after_port'] = e_formatter_standalone_new_line_after_port.none;
    }
            
    // formatter -> standalone -> new_line_after_generic
    const current_value_46 = json_config['formatter']['standalone']['new_line_after_generic'];
    if ( current_value_46 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_generic'] = e_formatter_standalone_new_line_after_generic.new_line;
    }
    if ( current_value_46 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_generic'] = e_formatter_standalone_new_line_after_generic.no_new_line;
    }
    if ( current_value_46 === "none"){
        default_config['formatter']['standalone']['new_line_after_generic'] = e_formatter_standalone_new_line_after_generic.none;
    }
            
    // formatter -> svg -> configuration
    const current_value_47 = json_config['formatter']['svg']['configuration'];
    if (typeof current_value_47 === 'string'){
        default_config['formatter']['svg']['configuration'] = current_value_47;
    }
            
    // formatter -> svg -> core_number
    const current_value_48 = json_config['formatter']['svg']['core_number'];
    if (typeof current_value_48 === 'number'){
        default_config['formatter']['svg']['core_number'] = current_value_48;
    }
            
    // linter -> general -> linter_vhdl
    const current_value_49 = json_config['linter']['general']['linter_vhdl'];
    if ( current_value_49 === "disabled"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.disabled;
    }
    if ( current_value_49 === "ghdl"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.ghdl;
    }
    if ( current_value_49 === "modelsim"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.modelsim;
    }
    if ( current_value_49 === "vivado"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.vivado;
    }
    if ( current_value_49 === "none"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.none;
    }
            
    // linter -> general -> linter_verilog
    const current_value_50 = json_config['linter']['general']['linter_verilog'];
    if ( current_value_50 === "disabled"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.disabled;
    }
    if ( current_value_50 === "icarus"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.icarus;
    }
    if ( current_value_50 === "modelsim"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.modelsim;
    }
    if ( current_value_50 === "verilator"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.verilator;
    }
    if ( current_value_50 === "vivado"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.vivado;
    }
            
    // linter -> general -> lstyle_verilog
    const current_value_51 = json_config['linter']['general']['lstyle_verilog'];
    if ( current_value_51 === "verible"){
        default_config['linter']['general']['lstyle_verilog'] = e_linter_general_lstyle_verilog.verible;
    }
    if ( current_value_51 === "disabled"){
        default_config['linter']['general']['lstyle_verilog'] = e_linter_general_lstyle_verilog.disabled;
    }
            
    // linter -> general -> lstyle_vhdl
    const current_value_52 = json_config['linter']['general']['lstyle_vhdl'];
    if ( current_value_52 === "vsg"){
        default_config['linter']['general']['lstyle_vhdl'] = e_linter_general_lstyle_vhdl.vsg;
    }
    if ( current_value_52 === "disabled"){
        default_config['linter']['general']['lstyle_vhdl'] = e_linter_general_lstyle_vhdl.disabled;
    }
            
    // linter -> ghdl -> arguments
    const current_value_53 = json_config['linter']['ghdl']['arguments'];
    if (typeof current_value_53 === 'string'){
        default_config['linter']['ghdl']['arguments'] = current_value_53;
    }
            
    // linter -> icarus -> arguments
    const current_value_54 = json_config['linter']['icarus']['arguments'];
    if (typeof current_value_54 === 'string'){
        default_config['linter']['icarus']['arguments'] = current_value_54;
    }
            
    // linter -> modelsim -> vhdl_arguments
    const current_value_55 = json_config['linter']['modelsim']['vhdl_arguments'];
    if (typeof current_value_55 === 'string'){
        default_config['linter']['modelsim']['vhdl_arguments'] = current_value_55;
    }
            
    // linter -> modelsim -> verilog_arguments
    const current_value_56 = json_config['linter']['modelsim']['verilog_arguments'];
    if (typeof current_value_56 === 'string'){
        default_config['linter']['modelsim']['verilog_arguments'] = current_value_56;
    }
            
    // linter -> verible -> arguments
    const current_value_57 = json_config['linter']['verible']['arguments'];
    if (typeof current_value_57 === 'string'){
        default_config['linter']['verible']['arguments'] = current_value_57;
    }
            
    // linter -> verilator -> arguments
    const current_value_58 = json_config['linter']['verilator']['arguments'];
    if (typeof current_value_58 === 'string'){
        default_config['linter']['verilator']['arguments'] = current_value_58;
    }
            
    // linter -> vivado -> vhdl_arguments
    const current_value_59 = json_config['linter']['vivado']['vhdl_arguments'];
    if (typeof current_value_59 === 'string'){
        default_config['linter']['vivado']['vhdl_arguments'] = current_value_59;
    }
            
    // linter -> vivado -> verilog_arguments
    const current_value_60 = json_config['linter']['vivado']['verilog_arguments'];
    if (typeof current_value_60 === 'string'){
        default_config['linter']['vivado']['verilog_arguments'] = current_value_60;
    }
            
    // linter -> vsg -> arguments
    const current_value_61 = json_config['linter']['vsg']['arguments'];
    if (typeof current_value_61 === 'string'){
        default_config['linter']['vsg']['arguments'] = current_value_61;
    }
            
    // schematic -> general -> backend
    const current_value_62 = json_config['schematic']['general']['backend'];
    if ( current_value_62 === "yowasp"){
        default_config['schematic']['general']['backend'] = e_schematic_general_backend.yowasp;
    }
    if ( current_value_62 === "yosys"){
        default_config['schematic']['general']['backend'] = e_schematic_general_backend.yosys;
    }
    if ( current_value_62 === "yosys_ghdl"){
        default_config['schematic']['general']['backend'] = e_schematic_general_backend.yosys_ghdl;
    }
    if ( current_value_62 === "yosys_ghdl_module"){
        default_config['schematic']['general']['backend'] = e_schematic_general_backend.yosys_ghdl_module;
    }
            
    // schematic -> general -> args
    const current_value_63 = json_config['schematic']['general']['args'];
    if (typeof current_value_63 === 'string'){
        default_config['schematic']['general']['args'] = current_value_63;
    }
            
    // templates -> general -> header_file_path
    const current_value_64 = json_config['templates']['general']['header_file_path'];
    if (typeof current_value_64 === 'string'){
        default_config['templates']['general']['header_file_path'] = current_value_64;
    }
            
    // templates -> general -> indent
    const current_value_65 = json_config['templates']['general']['indent'];
    if (typeof current_value_65 === 'string'){
        default_config['templates']['general']['indent'] = current_value_65;
    }
            
    // templates -> general -> clock_generation_style
    const current_value_66 = json_config['templates']['general']['clock_generation_style'];
    if ( current_value_66 === "inline"){
        default_config['templates']['general']['clock_generation_style'] = e_templates_general_clock_generation_style.inline;
    }
    if ( current_value_66 === "ifelse"){
        default_config['templates']['general']['clock_generation_style'] = e_templates_general_clock_generation_style.ifelse;
    }
            
    // templates -> general -> instance_style
    const current_value_67 = json_config['templates']['general']['instance_style'];
    if ( current_value_67 === "inline"){
        default_config['templates']['general']['instance_style'] = e_templates_general_instance_style.inline;
    }
    if ( current_value_67 === "separate"){
        default_config['templates']['general']['instance_style'] = e_templates_general_instance_style.separate;
    }
            
    // tools -> general -> select_tool
    const current_value_68 = json_config['tools']['general']['select_tool'];
    if ( current_value_68 === "osvvm"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.osvvm;
    }
    if ( current_value_68 === "vunit"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.vunit;
    }
    if ( current_value_68 === "ghdl"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.ghdl;
    }
    if ( current_value_68 === "cocotb"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.cocotb;
    }
    if ( current_value_68 === "icarus"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.icarus;
    }
    if ( current_value_68 === "icestorm"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.icestorm;
    }
    if ( current_value_68 === "ise"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.ise;
    }
    if ( current_value_68 === "isim"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.isim;
    }
    if ( current_value_68 === "modelsim"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.modelsim;
    }
    if ( current_value_68 === "openfpga"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.openfpga;
    }
    if ( current_value_68 === "quartus"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.quartus;
    }
    if ( current_value_68 === "rivierapro"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.rivierapro;
    }
    if ( current_value_68 === "spyglass"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.spyglass;
    }
    if ( current_value_68 === "trellis"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.trellis;
    }
    if ( current_value_68 === "vcs"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.vcs;
    }
    if ( current_value_68 === "verilator"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.verilator;
    }
    if ( current_value_68 === "vivado"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.vivado;
    }
    if ( current_value_68 === "xcelium"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.xcelium;
    }
    if ( current_value_68 === "xsim"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.xsim;
    }
    if ( current_value_68 === "raptor"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.raptor;
    }
            
    // tools -> general -> gtkwave_installation_path
    const current_value_69 = json_config['tools']['general']['gtkwave_installation_path'];
    if (typeof current_value_69 === 'string'){
        default_config['tools']['general']['gtkwave_installation_path'] = current_value_69;
    }
            
    // tools -> general -> execution_mode
    const current_value_70 = json_config['tools']['general']['execution_mode'];
    if ( current_value_70 === "gui"){
        default_config['tools']['general']['execution_mode'] = e_tools_general_execution_mode.gui;
    }
    if ( current_value_70 === "cmd"){
        default_config['tools']['general']['execution_mode'] = e_tools_general_execution_mode.cmd;
    }
            
    // tools -> general -> waveform_viewer
    const current_value_71 = json_config['tools']['general']['waveform_viewer'];
    if ( current_value_71 === "tool"){
        default_config['tools']['general']['waveform_viewer'] = e_tools_general_waveform_viewer.tool;
    }
    if ( current_value_71 === "gtkwave"){
        default_config['tools']['general']['waveform_viewer'] = e_tools_general_waveform_viewer.gtkwave;
    }
            
    // tools -> osvvm -> installation_path
    const current_value_72 = json_config['tools']['osvvm']['installation_path'];
    if (typeof current_value_72 === 'string'){
        default_config['tools']['osvvm']['installation_path'] = current_value_72;
    }
            
    // tools -> osvvm -> tclsh_binary
    const current_value_73 = json_config['tools']['osvvm']['tclsh_binary'];
    if (typeof current_value_73 === 'string'){
        default_config['tools']['osvvm']['tclsh_binary'] = current_value_73;
    }
            
    // tools -> osvvm -> simulator_name
    const current_value_74 = json_config['tools']['osvvm']['simulator_name'];
    if ( current_value_74 === "activehdl"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.activehdl;
    }
    if ( current_value_74 === "ghdl"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.ghdl;
    }
    if ( current_value_74 === "nvc"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.nvc;
    }
    if ( current_value_74 === "rivierapro"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.rivierapro;
    }
    if ( current_value_74 === "questa"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.questa;
    }
    if ( current_value_74 === "modelsim"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.modelsim;
    }
    if ( current_value_74 === "vcs"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.vcs;
    }
    if ( current_value_74 === "xsim"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.xsim;
    }
    if ( current_value_74 === "xcelium"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.xcelium;
    }
            
    // tools -> ascenlint -> installation_path
    const current_value_75 = json_config['tools']['ascenlint']['installation_path'];
    if (typeof current_value_75 === 'string'){
        default_config['tools']['ascenlint']['installation_path'] = current_value_75;
    }
            
    // tools -> ascenlint -> ascentlint_options
    const current_value_76 = json_config['tools']['ascenlint']['ascentlint_options'];
    if (Array.isArray(current_value_76)){
        default_config['tools']['ascenlint']['ascentlint_options'] = current_value_76;
    }
            
    // tools -> cocotb -> installation_path
    const current_value_77 = json_config['tools']['cocotb']['installation_path'];
    if (typeof current_value_77 === 'string'){
        default_config['tools']['cocotb']['installation_path'] = current_value_77;
    }
            
    // tools -> cocotb -> simulator_name
    const current_value_78 = json_config['tools']['cocotb']['simulator_name'];
    if ( current_value_78 === "icarus"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.icarus;
    }
    if ( current_value_78 === "verilator"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.verilator;
    }
    if ( current_value_78 === "vcs"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.vcs;
    }
    if ( current_value_78 === "riviera"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.riviera;
    }
    if ( current_value_78 === "activehdl"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.activehdl;
    }
    if ( current_value_78 === "questa"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.questa;
    }
    if ( current_value_78 === "modelsim"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.modelsim;
    }
    if ( current_value_78 === "ius"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.ius;
    }
    if ( current_value_78 === "xcelium"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.xcelium;
    }
    if ( current_value_78 === "ghdl"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.ghdl;
    }
    if ( current_value_78 === "cvc"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.cvc;
    }
            
    // tools -> cocotb -> compile_args
    const current_value_79 = json_config['tools']['cocotb']['compile_args'];
    if (typeof current_value_79 === 'string'){
        default_config['tools']['cocotb']['compile_args'] = current_value_79;
    }
            
    // tools -> cocotb -> run_args
    const current_value_80 = json_config['tools']['cocotb']['run_args'];
    if (typeof current_value_80 === 'string'){
        default_config['tools']['cocotb']['run_args'] = current_value_80;
    }
            
    // tools -> cocotb -> plusargs
    const current_value_81 = json_config['tools']['cocotb']['plusargs'];
    if (typeof current_value_81 === 'string'){
        default_config['tools']['cocotb']['plusargs'] = current_value_81;
    }
            
    // tools -> diamond -> installation_path
    const current_value_82 = json_config['tools']['diamond']['installation_path'];
    if (typeof current_value_82 === 'string'){
        default_config['tools']['diamond']['installation_path'] = current_value_82;
    }
            
    // tools -> diamond -> part
    const current_value_83 = json_config['tools']['diamond']['part'];
    if (typeof current_value_83 === 'string'){
        default_config['tools']['diamond']['part'] = current_value_83;
    }
            
    // tools -> ghdl -> installation_path
    const current_value_84 = json_config['tools']['ghdl']['installation_path'];
    if (typeof current_value_84 === 'string'){
        default_config['tools']['ghdl']['installation_path'] = current_value_84;
    }
            
    // tools -> ghdl -> waveform
    const current_value_85 = json_config['tools']['ghdl']['waveform'];
    if ( current_value_85 === "vcd"){
        default_config['tools']['ghdl']['waveform'] = e_tools_ghdl_waveform.vcd;
    }
    if ( current_value_85 === "ghw"){
        default_config['tools']['ghdl']['waveform'] = e_tools_ghdl_waveform.ghw;
    }
            
    // tools -> ghdl -> analyze_options
    const current_value_86 = json_config['tools']['ghdl']['analyze_options'];
    if (Array.isArray(current_value_86)){
        default_config['tools']['ghdl']['analyze_options'] = current_value_86;
    }
            
    // tools -> ghdl -> run_options
    const current_value_87 = json_config['tools']['ghdl']['run_options'];
    if (Array.isArray(current_value_87)){
        default_config['tools']['ghdl']['run_options'] = current_value_87;
    }
            
    // tools -> icarus -> installation_path
    const current_value_88 = json_config['tools']['icarus']['installation_path'];
    if (typeof current_value_88 === 'string'){
        default_config['tools']['icarus']['installation_path'] = current_value_88;
    }
            
    // tools -> icarus -> timescale
    const current_value_89 = json_config['tools']['icarus']['timescale'];
    if (typeof current_value_89 === 'string'){
        default_config['tools']['icarus']['timescale'] = current_value_89;
    }
            
    // tools -> icarus -> iverilog_options
    const current_value_90 = json_config['tools']['icarus']['iverilog_options'];
    if (Array.isArray(current_value_90)){
        default_config['tools']['icarus']['iverilog_options'] = current_value_90;
    }
            
    // tools -> icestorm -> installation_path
    const current_value_91 = json_config['tools']['icestorm']['installation_path'];
    if (typeof current_value_91 === 'string'){
        default_config['tools']['icestorm']['installation_path'] = current_value_91;
    }
            
    // tools -> icestorm -> pnr
    const current_value_92 = json_config['tools']['icestorm']['pnr'];
    if ( current_value_92 === "arachne"){
        default_config['tools']['icestorm']['pnr'] = e_tools_icestorm_pnr.arachne;
    }
    if ( current_value_92 === "next"){
        default_config['tools']['icestorm']['pnr'] = e_tools_icestorm_pnr.next;
    }
    if ( current_value_92 === "none"){
        default_config['tools']['icestorm']['pnr'] = e_tools_icestorm_pnr.none;
    }
            
    // tools -> icestorm -> arch
    const current_value_93 = json_config['tools']['icestorm']['arch'];
    if ( current_value_93 === "xilinx"){
        default_config['tools']['icestorm']['arch'] = e_tools_icestorm_arch.xilinx;
    }
    if ( current_value_93 === "ice40"){
        default_config['tools']['icestorm']['arch'] = e_tools_icestorm_arch.ice40;
    }
    if ( current_value_93 === "ecp5"){
        default_config['tools']['icestorm']['arch'] = e_tools_icestorm_arch.ecp5;
    }
            
    // tools -> icestorm -> output_format
    const current_value_94 = json_config['tools']['icestorm']['output_format'];
    if ( current_value_94 === "json"){
        default_config['tools']['icestorm']['output_format'] = e_tools_icestorm_output_format.json;
    }
    if ( current_value_94 === "edif"){
        default_config['tools']['icestorm']['output_format'] = e_tools_icestorm_output_format.edif;
    }
    if ( current_value_94 === "blif"){
        default_config['tools']['icestorm']['output_format'] = e_tools_icestorm_output_format.blif;
    }
            
    // tools -> icestorm -> yosys_as_subtool
    const current_value_95 = json_config['tools']['icestorm']['yosys_as_subtool'];
    if (current_value_95 === true || current_value_95 === false){
        default_config['tools']['icestorm']['yosys_as_subtool'] = current_value_95;
    }
            
    // tools -> icestorm -> makefile_name
    const current_value_96 = json_config['tools']['icestorm']['makefile_name'];
    if (typeof current_value_96 === 'string'){
        default_config['tools']['icestorm']['makefile_name'] = current_value_96;
    }
            
    // tools -> icestorm -> arachne_pnr_options
    const current_value_97 = json_config['tools']['icestorm']['arachne_pnr_options'];
    if (Array.isArray(current_value_97)){
        default_config['tools']['icestorm']['arachne_pnr_options'] = current_value_97;
    }
            
    // tools -> icestorm -> nextpnr_options
    const current_value_98 = json_config['tools']['icestorm']['nextpnr_options'];
    if (Array.isArray(current_value_98)){
        default_config['tools']['icestorm']['nextpnr_options'] = current_value_98;
    }
            
    // tools -> icestorm -> yosys_synth_options
    const current_value_99 = json_config['tools']['icestorm']['yosys_synth_options'];
    if (Array.isArray(current_value_99)){
        default_config['tools']['icestorm']['yosys_synth_options'] = current_value_99;
    }
            
    // tools -> ise -> installation_path
    const current_value_100 = json_config['tools']['ise']['installation_path'];
    if (typeof current_value_100 === 'string'){
        default_config['tools']['ise']['installation_path'] = current_value_100;
    }
            
    // tools -> ise -> family
    const current_value_101 = json_config['tools']['ise']['family'];
    if (typeof current_value_101 === 'string'){
        default_config['tools']['ise']['family'] = current_value_101;
    }
            
    // tools -> ise -> device
    const current_value_102 = json_config['tools']['ise']['device'];
    if (typeof current_value_102 === 'string'){
        default_config['tools']['ise']['device'] = current_value_102;
    }
            
    // tools -> ise -> package
    const current_value_103 = json_config['tools']['ise']['package'];
    if (typeof current_value_103 === 'string'){
        default_config['tools']['ise']['package'] = current_value_103;
    }
            
    // tools -> ise -> speed
    const current_value_104 = json_config['tools']['ise']['speed'];
    if (typeof current_value_104 === 'string'){
        default_config['tools']['ise']['speed'] = current_value_104;
    }
            
    // tools -> isem -> installation_path
    const current_value_105 = json_config['tools']['isem']['installation_path'];
    if (typeof current_value_105 === 'string'){
        default_config['tools']['isem']['installation_path'] = current_value_105;
    }
            
    // tools -> isem -> fuse_options
    const current_value_106 = json_config['tools']['isem']['fuse_options'];
    if (Array.isArray(current_value_106)){
        default_config['tools']['isem']['fuse_options'] = current_value_106;
    }
            
    // tools -> isem -> isim_options
    const current_value_107 = json_config['tools']['isem']['isim_options'];
    if (Array.isArray(current_value_107)){
        default_config['tools']['isem']['isim_options'] = current_value_107;
    }
            
    // tools -> modelsim -> installation_path
    const current_value_108 = json_config['tools']['modelsim']['installation_path'];
    if (typeof current_value_108 === 'string'){
        default_config['tools']['modelsim']['installation_path'] = current_value_108;
    }
            
    // tools -> modelsim -> vcom_options
    const current_value_109 = json_config['tools']['modelsim']['vcom_options'];
    if (Array.isArray(current_value_109)){
        default_config['tools']['modelsim']['vcom_options'] = current_value_109;
    }
            
    // tools -> modelsim -> vlog_options
    const current_value_110 = json_config['tools']['modelsim']['vlog_options'];
    if (Array.isArray(current_value_110)){
        default_config['tools']['modelsim']['vlog_options'] = current_value_110;
    }
            
    // tools -> modelsim -> vsim_options
    const current_value_111 = json_config['tools']['modelsim']['vsim_options'];
    if (Array.isArray(current_value_111)){
        default_config['tools']['modelsim']['vsim_options'] = current_value_111;
    }
            
    // tools -> morty -> installation_path
    const current_value_112 = json_config['tools']['morty']['installation_path'];
    if (typeof current_value_112 === 'string'){
        default_config['tools']['morty']['installation_path'] = current_value_112;
    }
            
    // tools -> morty -> morty_options
    const current_value_113 = json_config['tools']['morty']['morty_options'];
    if (Array.isArray(current_value_113)){
        default_config['tools']['morty']['morty_options'] = current_value_113;
    }
            
    // tools -> quartus -> installation_path
    const current_value_114 = json_config['tools']['quartus']['installation_path'];
    if (typeof current_value_114 === 'string'){
        default_config['tools']['quartus']['installation_path'] = current_value_114;
    }
            
    // tools -> quartus -> family
    const current_value_115 = json_config['tools']['quartus']['family'];
    if (typeof current_value_115 === 'string'){
        default_config['tools']['quartus']['family'] = current_value_115;
    }
            
    // tools -> quartus -> device
    const current_value_116 = json_config['tools']['quartus']['device'];
    if (typeof current_value_116 === 'string'){
        default_config['tools']['quartus']['device'] = current_value_116;
    }
            
    // tools -> quartus -> cable
    const current_value_117 = json_config['tools']['quartus']['cable'];
    if (typeof current_value_117 === 'string'){
        default_config['tools']['quartus']['cable'] = current_value_117;
    }
            
    // tools -> quartus -> board_device_index
    const current_value_118 = json_config['tools']['quartus']['board_device_index'];
    if (typeof current_value_118 === 'string'){
        default_config['tools']['quartus']['board_device_index'] = current_value_118;
    }
            
    // tools -> quartus -> pnr
    const current_value_119 = json_config['tools']['quartus']['pnr'];
    if ( current_value_119 === "default"){
        default_config['tools']['quartus']['pnr'] = e_tools_quartus_pnr.default;
    }
    if ( current_value_119 === "dse"){
        default_config['tools']['quartus']['pnr'] = e_tools_quartus_pnr.dse;
    }
    if ( current_value_119 === "none"){
        default_config['tools']['quartus']['pnr'] = e_tools_quartus_pnr.none;
    }
            
    // tools -> quartus -> dse_options
    const current_value_120 = json_config['tools']['quartus']['dse_options'];
    if (Array.isArray(current_value_120)){
        default_config['tools']['quartus']['dse_options'] = current_value_120;
    }
            
    // tools -> quartus -> quartus_options
    const current_value_121 = json_config['tools']['quartus']['quartus_options'];
    if (Array.isArray(current_value_121)){
        default_config['tools']['quartus']['quartus_options'] = current_value_121;
    }
            
    // tools -> radiant -> installation_path
    const current_value_122 = json_config['tools']['radiant']['installation_path'];
    if (typeof current_value_122 === 'string'){
        default_config['tools']['radiant']['installation_path'] = current_value_122;
    }
            
    // tools -> radiant -> part
    const current_value_123 = json_config['tools']['radiant']['part'];
    if (typeof current_value_123 === 'string'){
        default_config['tools']['radiant']['part'] = current_value_123;
    }
            
    // tools -> rivierapro -> installation_path
    const current_value_124 = json_config['tools']['rivierapro']['installation_path'];
    if (typeof current_value_124 === 'string'){
        default_config['tools']['rivierapro']['installation_path'] = current_value_124;
    }
            
    // tools -> rivierapro -> compilation_mode
    const current_value_125 = json_config['tools']['rivierapro']['compilation_mode'];
    if (typeof current_value_125 === 'string'){
        default_config['tools']['rivierapro']['compilation_mode'] = current_value_125;
    }
            
    // tools -> rivierapro -> vlog_options
    const current_value_126 = json_config['tools']['rivierapro']['vlog_options'];
    if (Array.isArray(current_value_126)){
        default_config['tools']['rivierapro']['vlog_options'] = current_value_126;
    }
            
    // tools -> rivierapro -> vsim_options
    const current_value_127 = json_config['tools']['rivierapro']['vsim_options'];
    if (Array.isArray(current_value_127)){
        default_config['tools']['rivierapro']['vsim_options'] = current_value_127;
    }
            
    // tools -> siliconcompiler -> installation_path
    const current_value_128 = json_config['tools']['siliconcompiler']['installation_path'];
    if (typeof current_value_128 === 'string'){
        default_config['tools']['siliconcompiler']['installation_path'] = current_value_128;
    }
            
    // tools -> siliconcompiler -> target
    const current_value_129 = json_config['tools']['siliconcompiler']['target'];
    if (typeof current_value_129 === 'string'){
        default_config['tools']['siliconcompiler']['target'] = current_value_129;
    }
            
    // tools -> siliconcompiler -> server_enable
    const current_value_130 = json_config['tools']['siliconcompiler']['server_enable'];
    if (current_value_130 === true || current_value_130 === false){
        default_config['tools']['siliconcompiler']['server_enable'] = current_value_130;
    }
            
    // tools -> siliconcompiler -> server_address
    const current_value_131 = json_config['tools']['siliconcompiler']['server_address'];
    if (typeof current_value_131 === 'string'){
        default_config['tools']['siliconcompiler']['server_address'] = current_value_131;
    }
            
    // tools -> siliconcompiler -> server_username
    const current_value_132 = json_config['tools']['siliconcompiler']['server_username'];
    if (typeof current_value_132 === 'string'){
        default_config['tools']['siliconcompiler']['server_username'] = current_value_132;
    }
            
    // tools -> siliconcompiler -> server_password
    const current_value_133 = json_config['tools']['siliconcompiler']['server_password'];
    if (typeof current_value_133 === 'string'){
        default_config['tools']['siliconcompiler']['server_password'] = current_value_133;
    }
            
    // tools -> spyglass -> installation_path
    const current_value_134 = json_config['tools']['spyglass']['installation_path'];
    if (typeof current_value_134 === 'string'){
        default_config['tools']['spyglass']['installation_path'] = current_value_134;
    }
            
    // tools -> spyglass -> methodology
    const current_value_135 = json_config['tools']['spyglass']['methodology'];
    if (typeof current_value_135 === 'string'){
        default_config['tools']['spyglass']['methodology'] = current_value_135;
    }
            
    // tools -> spyglass -> goals
    const current_value_136 = json_config['tools']['spyglass']['goals'];
    if (Array.isArray(current_value_136)){
        default_config['tools']['spyglass']['goals'] = current_value_136;
    }
            
    // tools -> spyglass -> spyglass_options
    const current_value_137 = json_config['tools']['spyglass']['spyglass_options'];
    if (Array.isArray(current_value_137)){
        default_config['tools']['spyglass']['spyglass_options'] = current_value_137;
    }
            
    // tools -> spyglass -> rule_parameters
    const current_value_138 = json_config['tools']['spyglass']['rule_parameters'];
    if (Array.isArray(current_value_138)){
        default_config['tools']['spyglass']['rule_parameters'] = current_value_138;
    }
            
    // tools -> symbiyosys -> installation_path
    const current_value_139 = json_config['tools']['symbiyosys']['installation_path'];
    if (typeof current_value_139 === 'string'){
        default_config['tools']['symbiyosys']['installation_path'] = current_value_139;
    }
            
    // tools -> symbiyosys -> tasknames
    const current_value_140 = json_config['tools']['symbiyosys']['tasknames'];
    if (Array.isArray(current_value_140)){
        default_config['tools']['symbiyosys']['tasknames'] = current_value_140;
    }
            
    // tools -> symbiflow -> installation_path
    const current_value_141 = json_config['tools']['symbiflow']['installation_path'];
    if (typeof current_value_141 === 'string'){
        default_config['tools']['symbiflow']['installation_path'] = current_value_141;
    }
            
    // tools -> symbiflow -> package
    const current_value_142 = json_config['tools']['symbiflow']['package'];
    if (typeof current_value_142 === 'string'){
        default_config['tools']['symbiflow']['package'] = current_value_142;
    }
            
    // tools -> symbiflow -> part
    const current_value_143 = json_config['tools']['symbiflow']['part'];
    if (typeof current_value_143 === 'string'){
        default_config['tools']['symbiflow']['part'] = current_value_143;
    }
            
    // tools -> symbiflow -> vendor
    const current_value_144 = json_config['tools']['symbiflow']['vendor'];
    if (typeof current_value_144 === 'string'){
        default_config['tools']['symbiflow']['vendor'] = current_value_144;
    }
            
    // tools -> symbiflow -> pnr
    const current_value_145 = json_config['tools']['symbiflow']['pnr'];
    if ( current_value_145 === "vpr"){
        default_config['tools']['symbiflow']['pnr'] = e_tools_symbiflow_pnr.vpr;
    }
            
    // tools -> symbiflow -> vpr_options
    const current_value_146 = json_config['tools']['symbiflow']['vpr_options'];
    if (typeof current_value_146 === 'string'){
        default_config['tools']['symbiflow']['vpr_options'] = current_value_146;
    }
            
    // tools -> symbiflow -> environment_script
    const current_value_147 = json_config['tools']['symbiflow']['environment_script'];
    if (typeof current_value_147 === 'string'){
        default_config['tools']['symbiflow']['environment_script'] = current_value_147;
    }
            
    // tools -> trellis -> installation_path
    const current_value_148 = json_config['tools']['trellis']['installation_path'];
    if (typeof current_value_148 === 'string'){
        default_config['tools']['trellis']['installation_path'] = current_value_148;
    }
            
    // tools -> trellis -> arch
    const current_value_149 = json_config['tools']['trellis']['arch'];
    if ( current_value_149 === "xilinx"){
        default_config['tools']['trellis']['arch'] = e_tools_trellis_arch.xilinx;
    }
    if ( current_value_149 === "ice40"){
        default_config['tools']['trellis']['arch'] = e_tools_trellis_arch.ice40;
    }
    if ( current_value_149 === "ecp5"){
        default_config['tools']['trellis']['arch'] = e_tools_trellis_arch.ecp5;
    }
            
    // tools -> trellis -> output_format
    const current_value_150 = json_config['tools']['trellis']['output_format'];
    if ( current_value_150 === "json"){
        default_config['tools']['trellis']['output_format'] = e_tools_trellis_output_format.json;
    }
    if ( current_value_150 === "edif"){
        default_config['tools']['trellis']['output_format'] = e_tools_trellis_output_format.edif;
    }
    if ( current_value_150 === "blif"){
        default_config['tools']['trellis']['output_format'] = e_tools_trellis_output_format.blif;
    }
            
    // tools -> trellis -> yosys_as_subtool
    const current_value_151 = json_config['tools']['trellis']['yosys_as_subtool'];
    if (current_value_151 === true || current_value_151 === false){
        default_config['tools']['trellis']['yosys_as_subtool'] = current_value_151;
    }
            
    // tools -> trellis -> makefile_name
    const current_value_152 = json_config['tools']['trellis']['makefile_name'];
    if (typeof current_value_152 === 'string'){
        default_config['tools']['trellis']['makefile_name'] = current_value_152;
    }
            
    // tools -> trellis -> script_name
    const current_value_153 = json_config['tools']['trellis']['script_name'];
    if (typeof current_value_153 === 'string'){
        default_config['tools']['trellis']['script_name'] = current_value_153;
    }
            
    // tools -> trellis -> nextpnr_options
    const current_value_154 = json_config['tools']['trellis']['nextpnr_options'];
    if (Array.isArray(current_value_154)){
        default_config['tools']['trellis']['nextpnr_options'] = current_value_154;
    }
            
    // tools -> trellis -> yosys_synth_options
    const current_value_155 = json_config['tools']['trellis']['yosys_synth_options'];
    if (Array.isArray(current_value_155)){
        default_config['tools']['trellis']['yosys_synth_options'] = current_value_155;
    }
            
    // tools -> vcs -> installation_path
    const current_value_156 = json_config['tools']['vcs']['installation_path'];
    if (typeof current_value_156 === 'string'){
        default_config['tools']['vcs']['installation_path'] = current_value_156;
    }
            
    // tools -> vcs -> vcs_options
    const current_value_157 = json_config['tools']['vcs']['vcs_options'];
    if (Array.isArray(current_value_157)){
        default_config['tools']['vcs']['vcs_options'] = current_value_157;
    }
            
    // tools -> vcs -> run_options
    const current_value_158 = json_config['tools']['vcs']['run_options'];
    if (Array.isArray(current_value_158)){
        default_config['tools']['vcs']['run_options'] = current_value_158;
    }
            
    // tools -> verible -> installation_path
    const current_value_159 = json_config['tools']['verible']['installation_path'];
    if (typeof current_value_159 === 'string'){
        default_config['tools']['verible']['installation_path'] = current_value_159;
    }
            
    // tools -> verilator -> installation_path
    const current_value_160 = json_config['tools']['verilator']['installation_path'];
    if (typeof current_value_160 === 'string'){
        default_config['tools']['verilator']['installation_path'] = current_value_160;
    }
            
    // tools -> verilator -> mode
    const current_value_161 = json_config['tools']['verilator']['mode'];
    if ( current_value_161 === "cc"){
        default_config['tools']['verilator']['mode'] = e_tools_verilator_mode.cc;
    }
    if ( current_value_161 === "sc"){
        default_config['tools']['verilator']['mode'] = e_tools_verilator_mode.sc;
    }
    if ( current_value_161 === "lint-only"){
        default_config['tools']['verilator']['mode'] = e_tools_verilator_mode.lint_only;
    }
            
    // tools -> verilator -> libs
    const current_value_162 = json_config['tools']['verilator']['libs'];
    if (Array.isArray(current_value_162)){
        default_config['tools']['verilator']['libs'] = current_value_162;
    }
            
    // tools -> verilator -> verilator_options
    const current_value_163 = json_config['tools']['verilator']['verilator_options'];
    if (Array.isArray(current_value_163)){
        default_config['tools']['verilator']['verilator_options'] = current_value_163;
    }
            
    // tools -> verilator -> make_options
    const current_value_164 = json_config['tools']['verilator']['make_options'];
    if (Array.isArray(current_value_164)){
        default_config['tools']['verilator']['make_options'] = current_value_164;
    }
            
    // tools -> verilator -> run_options
    const current_value_165 = json_config['tools']['verilator']['run_options'];
    if (Array.isArray(current_value_165)){
        default_config['tools']['verilator']['run_options'] = current_value_165;
    }
            
    // tools -> vivado -> installation_path
    const current_value_166 = json_config['tools']['vivado']['installation_path'];
    if (typeof current_value_166 === 'string'){
        default_config['tools']['vivado']['installation_path'] = current_value_166;
    }
            
    // tools -> vivado -> part
    const current_value_167 = json_config['tools']['vivado']['part'];
    if (typeof current_value_167 === 'string'){
        default_config['tools']['vivado']['part'] = current_value_167;
    }
            
    // tools -> vivado -> synth
    const current_value_168 = json_config['tools']['vivado']['synth'];
    if (typeof current_value_168 === 'string'){
        default_config['tools']['vivado']['synth'] = current_value_168;
    }
            
    // tools -> vivado -> pnr
    const current_value_169 = json_config['tools']['vivado']['pnr'];
    if ( current_value_169 === "vivado"){
        default_config['tools']['vivado']['pnr'] = e_tools_vivado_pnr.vivado;
    }
    if ( current_value_169 === "none"){
        default_config['tools']['vivado']['pnr'] = e_tools_vivado_pnr.none;
    }
            
    // tools -> vivado -> jtag_freq
    const current_value_170 = json_config['tools']['vivado']['jtag_freq'];
    if (typeof current_value_170 === 'number'){
        default_config['tools']['vivado']['jtag_freq'] = current_value_170;
    }
            
    // tools -> vivado -> hw_target
    const current_value_171 = json_config['tools']['vivado']['hw_target'];
    if (typeof current_value_171 === 'string'){
        default_config['tools']['vivado']['hw_target'] = current_value_171;
    }
            
    // tools -> vunit -> installation_path
    const current_value_172 = json_config['tools']['vunit']['installation_path'];
    if (typeof current_value_172 === 'string'){
        default_config['tools']['vunit']['installation_path'] = current_value_172;
    }
            
    // tools -> vunit -> simulator_name
    const current_value_173 = json_config['tools']['vunit']['simulator_name'];
    if ( current_value_173 === "rivierapro"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.rivierapro;
    }
    if ( current_value_173 === "activehdl"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.activehdl;
    }
    if ( current_value_173 === "ghdl"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.ghdl;
    }
    if ( current_value_173 === "modelsim"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.modelsim;
    }
    if ( current_value_173 === "xsim"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.xsim;
    }
            
    // tools -> vunit -> runpy_mode
    const current_value_174 = json_config['tools']['vunit']['runpy_mode'];
    if ( current_value_174 === "standalone"){
        default_config['tools']['vunit']['runpy_mode'] = e_tools_vunit_runpy_mode.standalone;
    }
    if ( current_value_174 === "creation"){
        default_config['tools']['vunit']['runpy_mode'] = e_tools_vunit_runpy_mode.creation;
    }
            
    // tools -> vunit -> extra_options
    const current_value_175 = json_config['tools']['vunit']['extra_options'];
    if (Array.isArray(current_value_175)){
        default_config['tools']['vunit']['extra_options'] = current_value_175;
    }
            
    // tools -> vunit -> enable_array_util_lib
    const current_value_176 = json_config['tools']['vunit']['enable_array_util_lib'];
    if (current_value_176 === true || current_value_176 === false){
        default_config['tools']['vunit']['enable_array_util_lib'] = current_value_176;
    }
            
    // tools -> vunit -> enable_com_lib
    const current_value_177 = json_config['tools']['vunit']['enable_com_lib'];
    if (current_value_177 === true || current_value_177 === false){
        default_config['tools']['vunit']['enable_com_lib'] = current_value_177;
    }
            
    // tools -> vunit -> enable_json4vhdl_lib
    const current_value_178 = json_config['tools']['vunit']['enable_json4vhdl_lib'];
    if (current_value_178 === true || current_value_178 === false){
        default_config['tools']['vunit']['enable_json4vhdl_lib'] = current_value_178;
    }
            
    // tools -> vunit -> enable_osvvm_lib
    const current_value_179 = json_config['tools']['vunit']['enable_osvvm_lib'];
    if (current_value_179 === true || current_value_179 === false){
        default_config['tools']['vunit']['enable_osvvm_lib'] = current_value_179;
    }
            
    // tools -> vunit -> enable_random_lib
    const current_value_180 = json_config['tools']['vunit']['enable_random_lib'];
    if (current_value_180 === true || current_value_180 === false){
        default_config['tools']['vunit']['enable_random_lib'] = current_value_180;
    }
            
    // tools -> vunit -> enable_verification_components_lib
    const current_value_181 = json_config['tools']['vunit']['enable_verification_components_lib'];
    if (current_value_181 === true || current_value_181 === false){
        default_config['tools']['vunit']['enable_verification_components_lib'] = current_value_181;
    }
            
    // tools -> xcelium -> installation_path
    const current_value_182 = json_config['tools']['xcelium']['installation_path'];
    if (typeof current_value_182 === 'string'){
        default_config['tools']['xcelium']['installation_path'] = current_value_182;
    }
            
    // tools -> xcelium -> xmvhdl_options
    const current_value_183 = json_config['tools']['xcelium']['xmvhdl_options'];
    if (Array.isArray(current_value_183)){
        default_config['tools']['xcelium']['xmvhdl_options'] = current_value_183;
    }
            
    // tools -> xcelium -> xmvlog_options
    const current_value_184 = json_config['tools']['xcelium']['xmvlog_options'];
    if (Array.isArray(current_value_184)){
        default_config['tools']['xcelium']['xmvlog_options'] = current_value_184;
    }
            
    // tools -> xcelium -> xmsim_options
    const current_value_185 = json_config['tools']['xcelium']['xmsim_options'];
    if (Array.isArray(current_value_185)){
        default_config['tools']['xcelium']['xmsim_options'] = current_value_185;
    }
            
    // tools -> xcelium -> xrun_options
    const current_value_186 = json_config['tools']['xcelium']['xrun_options'];
    if (Array.isArray(current_value_186)){
        default_config['tools']['xcelium']['xrun_options'] = current_value_186;
    }
            
    // tools -> xsim -> installation_path
    const current_value_187 = json_config['tools']['xsim']['installation_path'];
    if (typeof current_value_187 === 'string'){
        default_config['tools']['xsim']['installation_path'] = current_value_187;
    }
            
    // tools -> xsim -> xelab_options
    const current_value_188 = json_config['tools']['xsim']['xelab_options'];
    if (Array.isArray(current_value_188)){
        default_config['tools']['xsim']['xelab_options'] = current_value_188;
    }
            
    // tools -> xsim -> xsim_options
    const current_value_189 = json_config['tools']['xsim']['xsim_options'];
    if (Array.isArray(current_value_189)){
        default_config['tools']['xsim']['xsim_options'] = current_value_189;
    }
            
    // tools -> yosys -> installation_path
    const current_value_190 = json_config['tools']['yosys']['installation_path'];
    if (typeof current_value_190 === 'string'){
        default_config['tools']['yosys']['installation_path'] = current_value_190;
    }
            
    // tools -> yosys -> arch
    const current_value_191 = json_config['tools']['yosys']['arch'];
    if ( current_value_191 === "xilinx"){
        default_config['tools']['yosys']['arch'] = e_tools_yosys_arch.xilinx;
    }
    if ( current_value_191 === "ice40"){
        default_config['tools']['yosys']['arch'] = e_tools_yosys_arch.ice40;
    }
    if ( current_value_191 === "ecp5"){
        default_config['tools']['yosys']['arch'] = e_tools_yosys_arch.ecp5;
    }
            
    // tools -> yosys -> output_format
    const current_value_192 = json_config['tools']['yosys']['output_format'];
    if ( current_value_192 === "json"){
        default_config['tools']['yosys']['output_format'] = e_tools_yosys_output_format.json;
    }
    if ( current_value_192 === "edif"){
        default_config['tools']['yosys']['output_format'] = e_tools_yosys_output_format.edif;
    }
    if ( current_value_192 === "blif"){
        default_config['tools']['yosys']['output_format'] = e_tools_yosys_output_format.blif;
    }
            
    // tools -> yosys -> yosys_as_subtool
    const current_value_193 = json_config['tools']['yosys']['yosys_as_subtool'];
    if (current_value_193 === true || current_value_193 === false){
        default_config['tools']['yosys']['yosys_as_subtool'] = current_value_193;
    }
            
    // tools -> yosys -> makefile_name
    const current_value_194 = json_config['tools']['yosys']['makefile_name'];
    if (typeof current_value_194 === 'string'){
        default_config['tools']['yosys']['makefile_name'] = current_value_194;
    }
            
    // tools -> yosys -> script_name
    const current_value_195 = json_config['tools']['yosys']['script_name'];
    if (typeof current_value_195 === 'string'){
        default_config['tools']['yosys']['script_name'] = current_value_195;
    }
            
    // tools -> yosys -> yosys_synth_options
    const current_value_196 = json_config['tools']['yosys']['yosys_synth_options'];
    if (Array.isArray(current_value_196)){
        default_config['tools']['yosys']['yosys_synth_options'] = current_value_196;
    }
            
    // tools -> openfpga -> installation_path
    const current_value_197 = json_config['tools']['openfpga']['installation_path'];
    if (typeof current_value_197 === 'string'){
        default_config['tools']['openfpga']['installation_path'] = current_value_197;
    }
            
    // tools -> openfpga -> arch
    const current_value_198 = json_config['tools']['openfpga']['arch'];
    if ( current_value_198 === "xilinx"){
        default_config['tools']['openfpga']['arch'] = e_tools_openfpga_arch.xilinx;
    }
    if ( current_value_198 === "ice40"){
        default_config['tools']['openfpga']['arch'] = e_tools_openfpga_arch.ice40;
    }
    if ( current_value_198 === "ecp5"){
        default_config['tools']['openfpga']['arch'] = e_tools_openfpga_arch.ecp5;
    }
            
    // tools -> openfpga -> output_format
    const current_value_199 = json_config['tools']['openfpga']['output_format'];
    if ( current_value_199 === "json"){
        default_config['tools']['openfpga']['output_format'] = e_tools_openfpga_output_format.json;
    }
    if ( current_value_199 === "edif"){
        default_config['tools']['openfpga']['output_format'] = e_tools_openfpga_output_format.edif;
    }
    if ( current_value_199 === "blif"){
        default_config['tools']['openfpga']['output_format'] = e_tools_openfpga_output_format.blif;
    }
            
    // tools -> openfpga -> yosys_as_subtool
    const current_value_200 = json_config['tools']['openfpga']['yosys_as_subtool'];
    if (current_value_200 === true || current_value_200 === false){
        default_config['tools']['openfpga']['yosys_as_subtool'] = current_value_200;
    }
            
    // tools -> openfpga -> makefile_name
    const current_value_201 = json_config['tools']['openfpga']['makefile_name'];
    if (typeof current_value_201 === 'string'){
        default_config['tools']['openfpga']['makefile_name'] = current_value_201;
    }
            
    // tools -> openfpga -> script_name
    const current_value_202 = json_config['tools']['openfpga']['script_name'];
    if (typeof current_value_202 === 'string'){
        default_config['tools']['openfpga']['script_name'] = current_value_202;
    }
            
    // tools -> openfpga -> yosys_synth_options
    const current_value_203 = json_config['tools']['openfpga']['yosys_synth_options'];
    if (Array.isArray(current_value_203)){
        default_config['tools']['openfpga']['yosys_synth_options'] = current_value_203;
    }
            
    // tools -> activehdl -> installation_path
    const current_value_204 = json_config['tools']['activehdl']['installation_path'];
    if (typeof current_value_204 === 'string'){
        default_config['tools']['activehdl']['installation_path'] = current_value_204;
    }
            
    // tools -> nvc -> installation_path
    const current_value_205 = json_config['tools']['nvc']['installation_path'];
    if (typeof current_value_205 === 'string'){
        default_config['tools']['nvc']['installation_path'] = current_value_205;
    }
            
    // tools -> questa -> installation_path
    const current_value_206 = json_config['tools']['questa']['installation_path'];
    if (typeof current_value_206 === 'string'){
        default_config['tools']['questa']['installation_path'] = current_value_206;
    }
            
    // tools -> raptor -> installation_path
    const current_value_207 = json_config['tools']['raptor']['installation_path'];
    if (typeof current_value_207 === 'string'){
        default_config['tools']['raptor']['installation_path'] = current_value_207;
    }
            
    // tools -> raptor -> target_device
    const current_value_208 = json_config['tools']['raptor']['target_device'];
    if (typeof current_value_208 === 'string'){
        default_config['tools']['raptor']['target_device'] = current_value_208;
    }
            
    // tools -> raptor -> vhdl_version
    const current_value_209 = json_config['tools']['raptor']['vhdl_version'];
    if ( current_value_209 === "VHDL_1987"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_1987;
    }
    if ( current_value_209 === "VHDL_1993"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_1993;
    }
    if ( current_value_209 === "VHDL_2000"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_2000;
    }
    if ( current_value_209 === "VHDL_2008"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_2008;
    }
    if ( current_value_209 === "VHDL_2019"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_2019;
    }
            
    // tools -> raptor -> verilog_version
    const current_value_210 = json_config['tools']['raptor']['verilog_version'];
    if ( current_value_210 === "V_1995"){
        default_config['tools']['raptor']['verilog_version'] = e_tools_raptor_verilog_version.V_1995;
    }
    if ( current_value_210 === "V_2001"){
        default_config['tools']['raptor']['verilog_version'] = e_tools_raptor_verilog_version.V_2001;
    }
            
    // tools -> raptor -> sv_version
    const current_value_211 = json_config['tools']['raptor']['sv_version'];
    if ( current_value_211 === "SV_2005"){
        default_config['tools']['raptor']['sv_version'] = e_tools_raptor_sv_version.SV_2005;
    }
    if ( current_value_211 === "SV_2009"){
        default_config['tools']['raptor']['sv_version'] = e_tools_raptor_sv_version.SV_2009;
    }
    if ( current_value_211 === "SV_2012"){
        default_config['tools']['raptor']['sv_version'] = e_tools_raptor_sv_version.SV_2012;
    }
    if ( current_value_211 === "SV_2017"){
        default_config['tools']['raptor']['sv_version'] = e_tools_raptor_sv_version.SV_2017;
    }
            
    // tools -> raptor -> div_0
            
    // tools -> raptor -> optimization
    const current_value_213 = json_config['tools']['raptor']['optimization'];
    if ( current_value_213 === "area"){
        default_config['tools']['raptor']['optimization'] = e_tools_raptor_optimization.area;
    }
    if ( current_value_213 === "delay"){
        default_config['tools']['raptor']['optimization'] = e_tools_raptor_optimization.delay;
    }
    if ( current_value_213 === "mixed"){
        default_config['tools']['raptor']['optimization'] = e_tools_raptor_optimization.mixed;
    }
    if ( current_value_213 === "none"){
        default_config['tools']['raptor']['optimization'] = e_tools_raptor_optimization.none;
    }
            
    // tools -> raptor -> effort
    const current_value_214 = json_config['tools']['raptor']['effort'];
    if ( current_value_214 === "high"){
        default_config['tools']['raptor']['effort'] = e_tools_raptor_effort.high;
    }
    if ( current_value_214 === "medium"){
        default_config['tools']['raptor']['effort'] = e_tools_raptor_effort.medium;
    }
    if ( current_value_214 === "low"){
        default_config['tools']['raptor']['effort'] = e_tools_raptor_effort.low;
    }
            
    // tools -> raptor -> fsm_encoding
    const current_value_215 = json_config['tools']['raptor']['fsm_encoding'];
    if ( current_value_215 === "binary"){
        default_config['tools']['raptor']['fsm_encoding'] = e_tools_raptor_fsm_encoding.binary;
    }
    if ( current_value_215 === "onehot"){
        default_config['tools']['raptor']['fsm_encoding'] = e_tools_raptor_fsm_encoding.onehot;
    }
            
    // tools -> raptor -> carry
    const current_value_216 = json_config['tools']['raptor']['carry'];
    if ( current_value_216 === "auto"){
        default_config['tools']['raptor']['carry'] = e_tools_raptor_carry.auto;
    }
    if ( current_value_216 === "all"){
        default_config['tools']['raptor']['carry'] = e_tools_raptor_carry.all;
    }
    if ( current_value_216 === "none"){
        default_config['tools']['raptor']['carry'] = e_tools_raptor_carry.none;
    }
            
    // tools -> raptor -> pnr_netlist_language
    const current_value_217 = json_config['tools']['raptor']['pnr_netlist_language'];
    if ( current_value_217 === "blif"){
        default_config['tools']['raptor']['pnr_netlist_language'] = e_tools_raptor_pnr_netlist_language.blif;
    }
    if ( current_value_217 === "edif"){
        default_config['tools']['raptor']['pnr_netlist_language'] = e_tools_raptor_pnr_netlist_language.edif;
    }
    if ( current_value_217 === "verilog"){
        default_config['tools']['raptor']['pnr_netlist_language'] = e_tools_raptor_pnr_netlist_language.verilog;
    }
    if ( current_value_217 === "vhdl"){
        default_config['tools']['raptor']['pnr_netlist_language'] = e_tools_raptor_pnr_netlist_language.vhdl;
    }
            
    // tools -> raptor -> dsp_limit
    const current_value_218 = json_config['tools']['raptor']['dsp_limit'];
    if (typeof current_value_218 === 'number'){
        default_config['tools']['raptor']['dsp_limit'] = current_value_218;
    }
            
    // tools -> raptor -> block_ram_limit
    const current_value_219 = json_config['tools']['raptor']['block_ram_limit'];
    if (typeof current_value_219 === 'number'){
        default_config['tools']['raptor']['block_ram_limit'] = current_value_219;
    }
            
    // tools -> raptor -> fast_synthesis
    const current_value_220 = json_config['tools']['raptor']['fast_synthesis'];
    if (current_value_220 === true || current_value_220 === false){
        default_config['tools']['raptor']['fast_synthesis'] = current_value_220;
    }
            
    // tools -> raptor -> div_1
            
    // tools -> raptor -> top_level
    const current_value_222 = json_config['tools']['raptor']['top_level'];
    if (typeof current_value_222 === 'string'){
        default_config['tools']['raptor']['top_level'] = current_value_222;
    }
            
    // tools -> raptor -> sim_source_list
    const current_value_223 = json_config['tools']['raptor']['sim_source_list'];
    if (Array.isArray(current_value_223)){
        default_config['tools']['raptor']['sim_source_list'] = current_value_223;
    }
            
    // tools -> raptor -> simulate_rtl
    const current_value_224 = json_config['tools']['raptor']['simulate_rtl'];
    if (current_value_224 === true || current_value_224 === false){
        default_config['tools']['raptor']['simulate_rtl'] = current_value_224;
    }
            
    // tools -> raptor -> waveform_rtl
    const current_value_225 = json_config['tools']['raptor']['waveform_rtl'];
    if (typeof current_value_225 === 'string'){
        default_config['tools']['raptor']['waveform_rtl'] = current_value_225;
    }
            
    // tools -> raptor -> simulator_rtl
    const current_value_226 = json_config['tools']['raptor']['simulator_rtl'];
    if ( current_value_226 === "verilator"){
        default_config['tools']['raptor']['simulator_rtl'] = e_tools_raptor_simulator_rtl.verilator;
    }
    if ( current_value_226 === "ghdl"){
        default_config['tools']['raptor']['simulator_rtl'] = e_tools_raptor_simulator_rtl.ghdl;
    }
    if ( current_value_226 === "icarus"){
        default_config['tools']['raptor']['simulator_rtl'] = e_tools_raptor_simulator_rtl.icarus;
    }
            
    // tools -> raptor -> simulation_options_rtl
    const current_value_227 = json_config['tools']['raptor']['simulation_options_rtl'];
    if (typeof current_value_227 === 'string'){
        default_config['tools']['raptor']['simulation_options_rtl'] = current_value_227;
    }
            
    // tools -> raptor -> simulate_gate
    const current_value_228 = json_config['tools']['raptor']['simulate_gate'];
    if (current_value_228 === true || current_value_228 === false){
        default_config['tools']['raptor']['simulate_gate'] = current_value_228;
    }
            
    // tools -> raptor -> waveform_gate
    const current_value_229 = json_config['tools']['raptor']['waveform_gate'];
    if (typeof current_value_229 === 'string'){
        default_config['tools']['raptor']['waveform_gate'] = current_value_229;
    }
            
    // tools -> raptor -> simulator_gate
    const current_value_230 = json_config['tools']['raptor']['simulator_gate'];
    if ( current_value_230 === "verilator"){
        default_config['tools']['raptor']['simulator_gate'] = e_tools_raptor_simulator_gate.verilator;
    }
    if ( current_value_230 === "ghdl"){
        default_config['tools']['raptor']['simulator_gate'] = e_tools_raptor_simulator_gate.ghdl;
    }
    if ( current_value_230 === "icarus"){
        default_config['tools']['raptor']['simulator_gate'] = e_tools_raptor_simulator_gate.icarus;
    }
            
    // tools -> raptor -> simulation_options_gate
    const current_value_231 = json_config['tools']['raptor']['simulation_options_gate'];
    if (typeof current_value_231 === 'string'){
        default_config['tools']['raptor']['simulation_options_gate'] = current_value_231;
    }
            
    // tools -> raptor -> simulate_pnr
    const current_value_232 = json_config['tools']['raptor']['simulate_pnr'];
    if (current_value_232 === true || current_value_232 === false){
        default_config['tools']['raptor']['simulate_pnr'] = current_value_232;
    }
            
    // tools -> raptor -> waveform_pnr
    const current_value_233 = json_config['tools']['raptor']['waveform_pnr'];
    if (typeof current_value_233 === 'string'){
        default_config['tools']['raptor']['waveform_pnr'] = current_value_233;
    }
            
    // tools -> raptor -> simulator_pnr
    const current_value_234 = json_config['tools']['raptor']['simulator_pnr'];
    if ( current_value_234 === "verilator"){
        default_config['tools']['raptor']['simulator_pnr'] = e_tools_raptor_simulator_pnr.verilator;
    }
    if ( current_value_234 === "ghdl"){
        default_config['tools']['raptor']['simulator_pnr'] = e_tools_raptor_simulator_pnr.ghdl;
    }
    if ( current_value_234 === "icarus"){
        default_config['tools']['raptor']['simulator_pnr'] = e_tools_raptor_simulator_pnr.icarus;
    }
            
    // tools -> raptor -> simulation_options_pnr
    const current_value_235 = json_config['tools']['raptor']['simulation_options_pnr'];
    if (typeof current_value_235 === 'string'){
        default_config['tools']['raptor']['simulation_options_pnr'] = current_value_235;
    }
            

    return default_config;
}