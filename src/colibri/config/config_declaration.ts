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
        "vsg" : e_formatter_vsg,
    }
    "linter" : {
        "general" : e_linter_general,
        "vhdlls" : e_linter_vhdlls,
        "ghdl" : e_linter_ghdl,
        "nvc" : e_linter_nvc,
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
        "quartus" : e_tools_quartus,
        "vsg" : e_tools_vsg,
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
        "questa" : e_tools_questa,
        "raptor" : e_tools_raptor,
        "nvc" : e_tools_nvc,
    }
    [key: string]: {
        [key: string]: any;
    };
};
export type e_general_general = {
    pypath : string,
    makepath : string,
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
    tasks : e_documentation_general_tasks,
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
    
export type e_formatter_vsg = {
};
    
export type e_linter_general = {
    linter_vhdl : e_linter_general_linter_vhdl,
    linter_verilog : e_linter_general_linter_verilog,
    lstyle_verilog : e_linter_general_lstyle_verilog,
    lstyle_vhdl : e_linter_general_lstyle_vhdl,
};
    
export type e_linter_vhdlls = {
    standard : e_linter_vhdlls_standard,
    ignoreVunit : boolean,
    vunitPath : string,
};
    
export type e_linter_ghdl = {
    arguments : string,
};

export type e_linter_nvc = {
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
};
    
export type e_schematic_general = {
    backend : e_schematic_general_backend,
    extra : string,
    args : string,
    args_ghdl : string,
};
    
export type e_templates_general = {
    header_file_path : string,
    indent : string,
    clock_generation_style : e_templates_general_clock_generation_style,
    instance_style : e_templates_general_instance_style,
};
    
export type e_tools_general = {
    select_tool : e_tools_general_select_tool,
    manual_compilation_order : string,
    execution_mode : e_tools_general_execution_mode,
    waveform_viewer : e_tools_general_waveform_viewer,
    gtkwave_installation_path : string,
    gtkwave_extra_arguments : string,
};
    
export type e_tools_quartus = {
    installation_path : string,
    family : string,
    device : string,
    optimization_mode : e_tools_quartus_optimization_mode,
    allow_register_retiming : boolean,
    wave_file_questa : string,
};
    
export type e_tools_vsg = {
    installation_path : string,
    style_config : string,
    core_number : number,
    aditional_arguments : string,
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
    vhdl_standard : e_tools_ghdl_vhdl_standard,
    ieee_library : e_tools_ghdl_ieee_library,
    relaxed_parsing : boolean,
    unicode_support : boolean,
    psl_enabled : boolean,
    work_library : string,
    library_paths : any[],
    check_syntax_options : any[],
    analyze_options : any[],
    elaborate_options : any[],
    run_options : any[],
    synthesis_options : any[],
    extra_flags : any[],
    relaxed_rules : boolean,
    bind_checks : boolean,
    vital_checks : boolean,
    simulation_time : string,
    resolution_limit : string,
    stack_size : string,
    stop_delta_cycles : number,
    waveform_enabled : boolean,
    waveform_format : e_tools_ghdl_waveform_format,
    waveform_options : any[],
    wave_start_time : string,
    vcd_4states : boolean,
    vcd_nodate : boolean,
    read_wave_opt : string,
    write_wave_opt : string,
    debug_level : e_tools_ghdl_debug_level,
    verbose : boolean,
    warnings_as_errors : boolean,
    suppress_warnings : any[],
    assert_level : e_tools_ghdl_assert_level,
    display_time : boolean,
    unbuffered_output : boolean,
    max_stack_alloc : number,
    backtrace_severity : e_tools_ghdl_backtrace_severity,
    ieee_asserts : e_tools_ghdl_ieee_asserts,
    asserts_policy : e_tools_ghdl_asserts_policy,
    sdf_file : string,
    vpi_modules : any[],
    vhpi_modules : any[],
    vpi_trace_file : string,
    vhpi_trace_file : string,
    psl_report_file : string,
    psl_report_uncovered : boolean,
    disp_tree : e_tools_ghdl_disp_tree,
    no_run : boolean,
};

export type e_tools_nvc = {
    installation_path : string,
    vhdl_standard : e_tools_nvc_vhdl_standard,
    ieee_library : e_tools_nvc_ieee_library,
    relaxed_parsing : boolean,
    unicode_support : boolean,
    psl_enabled : boolean,
    work_library : string,
    library_paths : any[],
    check_syntax_options : any[],
    analyze_options : any[],
    elaborate_options : any[],
    run_options : any[],
    synthesis_options : any[],
    extra_flags : any[],
    relaxed_rules : boolean,
    bind_checks : boolean,
    vital_checks : boolean,
    simulation_time : string,
    resolution_limit : string,
    stack_size : string,
    stop_delta_cycles : number,
    waveform_enabled : boolean,
    waveform_format : e_tools_nvc_waveform_format,
    waveform_options : any[],
    wave_start_time : string,
    vcd_4states : boolean,
    vcd_nodate : boolean,
    read_wave_opt : string,
    write_wave_opt : string,
    debug_level : e_tools_nvc_debug_level,
    verbose : boolean,
    warnings_as_errors : boolean,
    suppress_warnings : any[],
    assert_level : e_tools_nvc_assert_level,
    display_time : boolean,
    unbuffered_output : boolean,
    max_stack_alloc : number,
    backtrace_severity : e_tools_nvc_backtrace_severity,
    ieee_asserts : e_tools_nvc_ieee_asserts,
    asserts_policy : e_tools_nvc_asserts_policy,
    sdf_file : string,
    vpi_modules : any[],
    vhpi_modules : any[],
    vpi_trace_file : string,
    vhpi_trace_file : string,
    psl_report_file : string,
    psl_report_uncovered : boolean,
    disp_tree : e_tools_nvc_disp_tree,
    no_run : boolean,
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
    synth : e_tools_vivado_synth,
    pnr : e_tools_vivado_pnr,
    jtag_freq : number,
    hw_target : string,
};
    
export type e_tools_vunit = {
    installation_path : string,
    simulator_name : e_tools_vunit_simulator_name,
    runpy_mode : e_tools_vunit_runpy_mode,
    extra_options : string,
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
    read_verilog_options : any[],
    read_systemverilog_options : any[],
    read_liberty_options : any[],
    hierarchy_options : any[],
    proc_options : any[],
    opt_options : any[],
    flatten_enabled : boolean,
    flatten_options : any[],
    memory_options : any[],
    fsm_enabled : boolean,
    fsm_options : any[],
    techmap_enabled : boolean,
    techmap_options : any[],
    abc_enabled : boolean,
    abc_options : any[],
    synthesis_target : e_tools_yosys_synthesis_target,
    ice40_device : e_tools_yosys_ice40_device,
    ice40_top_module : string,
    ice40_output_blif : string,
    ice40_output_edif : string,
    ice40_output_json : string,
    ice40_noflatten : boolean,
    ice40_dff : boolean,
    ice40_retime : boolean,
    ice40_nocarry : boolean,
    ice40_nodffe : boolean,
    ice40_dffe_min_ce_use : number,
    ice40_nobram : boolean,
    ice40_spram : boolean,
    ice40_dsp : boolean,
    ice40_noabc : boolean,
    ice40_abc2 : boolean,
    ice40_vpr : boolean,
    ice40_noabc9 : boolean,
    ice40_flowmap : boolean,
    ice40_no_rw_check : boolean,
    ecp5_top_module : string,
    ecp5_output_blif : string,
    ecp5_output_edif : string,
    ecp5_output_json : string,
    ecp5_noflatten : boolean,
    ecp5_dff : boolean,
    ecp5_retime : boolean,
    ecp5_noccu2 : boolean,
    ecp5_nodffe : boolean,
    ecp5_nobram : boolean,
    ecp5_nolutram : boolean,
    ecp5_nowidelut : boolean,
    ecp5_asyncprld : boolean,
    ecp5_abc2 : boolean,
    ecp5_noabc9 : boolean,
    ecp5_vpr : boolean,
    ecp5_iopad : boolean,
    ecp5_nodsp : boolean,
    ecp5_no_rw_check : boolean,
    verbose : boolean,
    debug_level : e_tools_yosys_debug_level,
    log_file : string,
    custom_load_commands : any[],
    custom_analyze_commands : any[],
    custom_elaborate_commands : any[],
    extra_flags : any[],
    check_enabled : boolean,
    check_options : any[],
    stat_enabled : boolean,
    stat_options : any[],
};
    
export type e_tools_openfpga = {
    installation_path : string,
    arch : string,
    task_options : any[],
};
    
export type e_tools_activehdl = {
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
export enum e_documentation_general_tasks {
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
    nvc = "nvc",
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
export enum e_linter_vhdlls_standard {
    v1993 = "v1993",
    v2008 = "v2008",
    v2019 = "v2019",
}
export enum e_schematic_general_backend {
    yowasp = "yowasp",
    yosys = "yosys",
    yosys_ghdl = "yosys_ghdl",
    standalone = "standalone",
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
    radiant = "radiant",
    sandpiper = "sandpiper",
    yosys = "yosys",
    nvc = "nvc",
}

export enum e_tools_general_execution_mode {
    gui = "gui",
    cmd = "cmd",
}
export enum e_tools_general_waveform_viewer {
    tool = "tool",
    vaporView = "vaporView",
    gtkwave = "gtkwave",
}
export enum e_tools_quartus_optimization_mode {
    BALANCED = "BALANCED",
    HIGH_PERFORMANCE_EFFORT = "HIGH_PERFORMANCE_EFFORT",
    HIGH_PERFORMANCE_EFFORT_WITH_MAXIMUM_PLACEMENT_EFFORT = "HIGH_PERFORMANCE_EFFORT_WITH_MAXIMUM_PLACEMENT_EFFORT",
    HIGH_PERFORMANCE_WITH_AGGRESSIVE_POWER_EFFORT = "HIGH_PERFORMANCE_WITH_AGGRESSIVE_POWER_EFFORT",
    SUPERIOR_PERFORMANCE = "SUPERIOR_PERFORMANCE",
    SUPERIOR_PERFORMANCE_WITH_MAXIMUM_PLACEMENT_EFFORT = "SUPERIOR_PERFORMANCE_WITH_MAXIMUM_PLACEMENT_EFFORT",
    AGGRESSIVE_AREA = "AGGRESSIVE_AREA",
    HIGH_PLACEMENT_ROUTABILITY_EFFORT = "HIGH_PLACEMENT_ROUTABILITY_EFFORT",
    HIGH_PACKING_ROUTABILITY_EFFORT = "HIGH_PACKING_ROUTABILITY_EFFORT",
    OPTIMIZE_NETLIST_FOR_ROUTABILITY = "OPTIMIZE_NETLIST_FOR_ROUTABILITY",
    AGGRESSIVE_POWER = "AGGRESSIVE_POWER",
    AGGRESSIVE_COMPILE_TIME = "AGGRESSIVE_COMPILE_TIME",
    FAST_FUNCTIONAL_TEST = "FAST_FUNCTIONAL_TEST",
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
export enum e_tools_ghdl_vhdl_standard {
    auto = "auto",
    vhdl87 = "vhdl87",
    vhdl93 = "vhdl93",
    vhdl02 = "vhdl02",
    vhdl08 = "vhdl08",
    vhdl19 = "vhdl19",
}
export enum e_tools_ghdl_ieee_library {
    standard = "standard",
    synopsys = "synopsys",
}
export enum e_tools_ghdl_waveform_format {
    vcd = "vcd",
    ghw = "ghw",
    fst = "fst",
}
export enum e_tools_ghdl_debug_level {
    none = "none",
    minimal = "minimal",
    full = "full",
}
export enum e_tools_ghdl_assert_level {
    note = "note",
    warning = "warning",
    error = "error",
    failure = "failure",
    none = "none",
}
export enum e_tools_ghdl_backtrace_severity {
    note = "note",
    warning = "warning",
    error = "error",
    failure = "failure",
    none = "none",
}
export enum e_tools_ghdl_ieee_asserts {
    enable = "enable",
    disable = "disable",
    disable_at_0 = "disable-at-0",
}
export enum e_tools_ghdl_asserts_policy {
    enable = "enable",
    disable = "disable",
    disable_at_0 = "disable-at-0",
}
export enum e_tools_ghdl_disp_tree {
    none = "none",
    inst = "inst",
    proc = "proc",
    port = "port",
}
export enum e_tools_nvc_vhdl_standard {
    auto = "auto",
    vhdl87 = "vhdl87",
    vhdl93 = "vhdl93",
    vhdl02 = "vhdl02",
    vhdl08 = "vhdl08",
    vhdl19 = "vhdl19",
}
export enum e_tools_nvc_ieee_library {
    standard = "standard",
    synopsys = "synopsys",
}
export enum e_tools_nvc_waveform_format {
    vcd = "vcd",
    ghw = "ghw",
    fst = "fst",
}
export enum e_tools_nvc_debug_level {
    none = "none",
    minimal = "minimal",
    full = "full",
}
export enum e_tools_nvc_assert_level {
    note = "note",
    warning = "warning",
    error = "error",
    failure = "failure",
    none = "none",
}
export enum e_tools_nvc_backtrace_severity {
    note = "note",
    warning = "warning",
    error = "error",
    failure = "failure",
    none = "none",
}
export enum e_tools_nvc_ieee_asserts {
    enable = "enable",
    disable = "disable",
    disable_at_0 = "disable-at-0",
}
export enum e_tools_nvc_asserts_policy {
    enable = "enable",
    disable = "disable",
    disable_at_0 = "disable-at-0",
}
export enum e_tools_nvc_disp_tree {
    none = "none",
    inst = "inst",
    proc = "proc",
    port = "port",
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
export enum e_tools_vivado_synth {
    vivado = "vivado",
    yosys = "yosys",
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
export enum e_tools_yosys_synthesis_target {
    ice40 = "ice40",
    ecp5 = "ecp5",
}
export enum e_tools_yosys_ice40_device {
    hx = "hx",
    lp = "lp",
    u = "u",
}
export enum e_tools_yosys_debug_level {
    none = "none",
    basic = "basic",
    detailed = "detailed",
    verbose = "verbose",
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
                pypath : "",
                makepath : "",
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
                tasks : e_documentation_general_tasks.all,
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
            vsg: {
            },
        },
        linter: {
            general: {
                linter_vhdl : e_linter_general_linter_vhdl.none,
                linter_verilog : e_linter_general_linter_verilog.modelsim,
                lstyle_verilog : e_linter_general_lstyle_verilog.disabled,
                lstyle_vhdl : e_linter_general_lstyle_vhdl.disabled,
            },
            vhdlls: {
                standard : e_linter_vhdlls_standard.v2008,
                ignoreVunit : false,
                vunitPath : "",
            },
            ghdl: {
                arguments : "",
            },
            nvc: {
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
            },
        },
        schematic: {
            general: {
                backend : e_schematic_general_backend.yowasp,
                extra : "",
                args : "",
                args_ghdl : "",
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
                manual_compilation_order : "",
                execution_mode : e_tools_general_execution_mode.cmd,
                waveform_viewer : e_tools_general_waveform_viewer.tool,
                gtkwave_installation_path : "",
                gtkwave_extra_arguments : "",
            },
            quartus: {
                installation_path : "",
                family : "",
                device : "",
                optimization_mode : e_tools_quartus_optimization_mode.BALANCED,
                allow_register_retiming : true,
                wave_file_questa : "",
            },
            vsg: {
                installation_path : "",
                style_config : "",
                core_number : 2,
                aditional_arguments : "",
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
                vhdl_standard : e_tools_ghdl_vhdl_standard.auto,
                ieee_library : e_tools_ghdl_ieee_library.standard,
                relaxed_parsing : false,
                unicode_support : false,
                psl_enabled : false,
                work_library : "work",
                library_paths : [],
                check_syntax_options : [],
                analyze_options : [],
                elaborate_options : [],
                run_options : [],
                synthesis_options : [],
                extra_flags : [],
                relaxed_rules : false,
                bind_checks : true,
                vital_checks : false,
                simulation_time : "",
                resolution_limit : "",
                stack_size : "",
                stop_delta_cycles : 0,
                waveform_enabled : true,
                waveform_format : e_tools_ghdl_waveform_format.vcd,
                waveform_options : [],
                wave_start_time : "",
                vcd_4states : false,
                vcd_nodate : false,
                read_wave_opt : "",
                write_wave_opt : "",
                debug_level : e_tools_ghdl_debug_level.minimal,
                verbose : true,
                warnings_as_errors : false,
                suppress_warnings : [],
                assert_level : e_tools_ghdl_assert_level.error,
                display_time : false,
                unbuffered_output : false,
                max_stack_alloc : 0,
                backtrace_severity : e_tools_ghdl_backtrace_severity.error,
                ieee_asserts : e_tools_ghdl_ieee_asserts.enable,
                asserts_policy : e_tools_ghdl_asserts_policy.enable,
                sdf_file : "",
                vpi_modules : [],
                vhpi_modules : [],
                vpi_trace_file : "",
                vhpi_trace_file : "",
                psl_report_file : "",
                psl_report_uncovered : false,
                disp_tree : e_tools_ghdl_disp_tree.none,
                no_run : false,
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
                synth : e_tools_vivado_synth.vivado,
                pnr : e_tools_vivado_pnr.vivado,
                jtag_freq : 10000,
                hw_target : "",
            },
            vunit: {
                installation_path : "",
                simulator_name : e_tools_vunit_simulator_name.ghdl,
                runpy_mode : e_tools_vunit_runpy_mode.standalone,
                extra_options : "",
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
                read_verilog_options : [],
                read_systemverilog_options : [],
                read_liberty_options : [],
                hierarchy_options : [],
                proc_options : [],
                opt_options : [],
                flatten_enabled : true,
                flatten_options : [],
                memory_options : [],
                fsm_enabled : false,
                fsm_options : [],
                techmap_enabled : false,
                techmap_options : [],
                abc_enabled : false,
                abc_options : [],
                synthesis_target : e_tools_yosys_synthesis_target.ice40,
                ice40_device : e_tools_yosys_ice40_device.hx,
                ice40_top_module : "",
                ice40_output_blif : "",
                ice40_output_edif : "",
                ice40_output_json : "",
                ice40_noflatten : false,
                ice40_dff : false,
                ice40_retime : false,
                ice40_nocarry : false,
                ice40_nodffe : false,
                ice40_dffe_min_ce_use : 0,
                ice40_nobram : false,
                ice40_spram : false,
                ice40_dsp : false,
                ice40_noabc : false,
                ice40_abc2 : false,
                ice40_vpr : false,
                ice40_noabc9 : false,
                ice40_flowmap : false,
                ice40_no_rw_check : false,
                ecp5_top_module : "",
                ecp5_output_blif : "",
                ecp5_output_edif : "",
                ecp5_output_json : "",
                ecp5_noflatten : false,
                ecp5_dff : false,
                ecp5_retime : false,
                ecp5_noccu2 : false,
                ecp5_nodffe : false,
                ecp5_nobram : false,
                ecp5_nolutram : false,
                ecp5_nowidelut : false,
                ecp5_asyncprld : false,
                ecp5_abc2 : false,
                ecp5_noabc9 : false,
                ecp5_vpr : false,
                ecp5_iopad : false,
                ecp5_nodsp : false,
                ecp5_no_rw_check : false,
                verbose : false,
                debug_level : e_tools_yosys_debug_level.none,
                log_file : "",
                custom_load_commands : [],
                custom_analyze_commands : [],
                custom_elaborate_commands : [],
                extra_flags : [],
                check_enabled : true,
                check_options : [],
                stat_enabled : true,
                stat_options : [],
            },
            openfpga: {
                installation_path : "",
                arch : "",
                task_options : [],
            },
            activehdl: {
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
            nvc: {
                installation_path: "",
                vhdl_standard : e_tools_nvc_vhdl_standard.vhdl08,
                ieee_library : e_tools_nvc_ieee_library.standard,
                relaxed_parsing : false,
                unicode_support : false,
                psl_enabled : false,
                work_library : "work",
                library_paths : [],
                check_syntax_options : [],
                analyze_options : [],
                elaborate_options : [],
                run_options : [],
                synthesis_options : [],
                extra_flags : [],
                relaxed_rules : false,
                bind_checks : true,
                vital_checks : false,
                simulation_time : "",
                resolution_limit : "",
                stack_size : "",
                stop_delta_cycles : 0,
                waveform_enabled : true,
                waveform_format : e_tools_nvc_waveform_format.vcd,
                waveform_options : [],
                wave_start_time : "",
                vcd_4states : false,
                vcd_nodate : false,
                read_wave_opt : "",
                write_wave_opt : "",
                debug_level : e_tools_nvc_debug_level.none,
                verbose : false,
                warnings_as_errors : false,
                suppress_warnings : [],
                assert_level : e_tools_nvc_assert_level.error,
                display_time : false,
                unbuffered_output : false,
                max_stack_alloc : 0,
                backtrace_severity : e_tools_nvc_backtrace_severity.error,
                ieee_asserts : e_tools_nvc_ieee_asserts.enable,
                asserts_policy : e_tools_nvc_asserts_policy.enable,
                sdf_file : "",
                vpi_modules : [],
                vhpi_modules : [],
                vpi_trace_file : "",
                vhpi_trace_file : "",
                psl_report_file : "",
                psl_report_uncovered : false,
                disp_tree : e_tools_nvc_disp_tree.none,
                no_run : false,
            },
        },
    };
}


export function get_config_from_json(json_config: any): e_config {
    const default_config = get_default_config();

    // general -> general -> pypath
    let current_value_0 = undefined;
    try {
        current_value_0 = json_config['general']['general']['pypath'];
    }
    catch(e){}
    if (typeof current_value_0 === 'string'){
        default_config['general']['general']['pypath'] = current_value_0;
    }
            
    // general -> general -> makepath
    let current_value_1 = undefined;
    try {
        current_value_1 = json_config['general']['general']['makepath'];
    }
    catch(e){}
    if (typeof current_value_1 === 'string'){
        default_config['general']['general']['makepath'] = current_value_1;
    }
            
    // general -> general -> go_to_definition_vhdl
    let current_value_2 = undefined;
    try {
        current_value_2 = json_config['general']['general']['go_to_definition_vhdl'];
    }
    catch(e){}
    if (current_value_2 === true || current_value_2 === false){
        default_config['general']['general']['go_to_definition_vhdl'] = current_value_2;
    }
            
    // general -> general -> go_to_definition_verilog
    let current_value_3 = undefined;
    try {
        current_value_3 = json_config['general']['general']['go_to_definition_verilog'];
    }
    catch(e){}
    if (current_value_3 === true || current_value_3 === false){
        default_config['general']['general']['go_to_definition_verilog'] = current_value_3;
    }
            
    // general -> general -> developer_mode
    let current_value_4 = undefined;
    try {
        current_value_4 = json_config['general']['general']['developer_mode'];
    }
    catch(e){}
    if (current_value_4 === true || current_value_4 === false){
        default_config['general']['general']['developer_mode'] = current_value_4;
    }
            
    // documentation -> general -> language
    let current_value_5 = undefined;
    try {
        current_value_5 = json_config['documentation']['general']['language'];
    }
    catch(e){}
    if ( current_value_5 === "english"){
        default_config['documentation']['general']['language'] = e_documentation_general_language.english;
    }
    if ( current_value_5 === "russian"){
        default_config['documentation']['general']['language'] = e_documentation_general_language.russian;
    }
            
    // documentation -> general -> symbol_vhdl
    let current_value_6 = undefined;
    try {
        current_value_6 = json_config['documentation']['general']['symbol_vhdl'];
    }
    catch(e){}
    if (typeof current_value_6 === 'string'){
        default_config['documentation']['general']['symbol_vhdl'] = current_value_6;
    }
            
    // documentation -> general -> symbol_verilog
    let current_value_7 = undefined;
    try {
        current_value_7 = json_config['documentation']['general']['symbol_verilog'];
    }
    catch(e){}
    if (typeof current_value_7 === 'string'){
        default_config['documentation']['general']['symbol_verilog'] = current_value_7;
    }
            
    // documentation -> general -> dependency_graph
    let current_value_8 = undefined;
    try {
        current_value_8 = json_config['documentation']['general']['dependency_graph'];
    }
    catch(e){}
    if (current_value_8 === true || current_value_8 === false){
        default_config['documentation']['general']['dependency_graph'] = current_value_8;
    }
            
    // documentation -> general -> self_contained
    let current_value_9 = undefined;
    try {
        current_value_9 = json_config['documentation']['general']['self_contained'];
    }
    catch(e){}
    if (current_value_9 === true || current_value_9 === false){
        default_config['documentation']['general']['self_contained'] = current_value_9;
    }
            
    // documentation -> general -> fsm
    let current_value_10 = undefined;
    try {
        current_value_10 = json_config['documentation']['general']['fsm'];
    }
    catch(e){}
    if (current_value_10 === true || current_value_10 === false){
        default_config['documentation']['general']['fsm'] = current_value_10;
    }
            
    // documentation -> general -> ports
    let current_value_11 = undefined;
    try {
        current_value_11 = json_config['documentation']['general']['ports'];
    }
    catch(e){}
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
    let current_value_12 = undefined;
    try {
        current_value_12 = json_config['documentation']['general']['generics'];
    }
    catch(e){}
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
    let current_value_13 = undefined;
    try {
        current_value_13 = json_config['documentation']['general']['instantiations'];
    }
    catch(e){}
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
    let current_value_14 = undefined;
    try {
        current_value_14 = json_config['documentation']['general']['signals'];
    }
    catch(e){}
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
    let current_value_15 = undefined;
    try {
        current_value_15 = json_config['documentation']['general']['constants'];
    }
    catch(e){}
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
    let current_value_16 = undefined;
    try {
        current_value_16 = json_config['documentation']['general']['types'];
    }
    catch(e){}
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
    let current_value_17 = undefined;
    try {
        current_value_17 = json_config['documentation']['general']['process'];
    }
    catch(e){}
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
    let current_value_18 = undefined;
    try {
        current_value_18 = json_config['documentation']['general']['functions'];
    }
    catch(e){}
    if ( current_value_18 === "all"){
        default_config['documentation']['general']['functions'] = e_documentation_general_functions.all;
    }
    if ( current_value_18 === "only_commented"){
        default_config['documentation']['general']['functions'] = e_documentation_general_functions.only_commented;
    }
    if ( current_value_18 === "none"){
        default_config['documentation']['general']['functions'] = e_documentation_general_functions.none;
    }
            
    // documentation -> general -> tasks
    let current_value_19 = undefined;
    try {
        current_value_19 = json_config['documentation']['general']['tasks'];
    }
    catch(e){}
    if ( current_value_19 === "all"){
        default_config['documentation']['general']['tasks'] = e_documentation_general_tasks.all;
    }
    if ( current_value_19 === "only_commented"){
        default_config['documentation']['general']['tasks'] = e_documentation_general_tasks.only_commented;
    }
    if ( current_value_19 === "none"){
        default_config['documentation']['general']['tasks'] = e_documentation_general_tasks.none;
    }
            
    // documentation -> general -> magic_config_path
    let current_value_20 = undefined;
    try {
        current_value_20 = json_config['documentation']['general']['magic_config_path'];
    }
    catch(e){}
    if (typeof current_value_20 === 'string'){
        default_config['documentation']['general']['magic_config_path'] = current_value_20;
    }
            
    // editor -> general -> stutter_comment_shortcuts
    let current_value_21 = undefined;
    try {
        current_value_21 = json_config['editor']['general']['stutter_comment_shortcuts'];
    }
    catch(e){}
    if (current_value_21 === true || current_value_21 === false){
        default_config['editor']['general']['stutter_comment_shortcuts'] = current_value_21;
    }
            
    // editor -> general -> stutter_block_width
    let current_value_22 = undefined;
    try {
        current_value_22 = json_config['editor']['general']['stutter_block_width'];
    }
    catch(e){}
    if (typeof current_value_22 === 'number'){
        default_config['editor']['general']['stutter_block_width'] = current_value_22;
    }
            
    // editor -> general -> stutter_max_width
    let current_value_23 = undefined;
    try {
        current_value_23 = json_config['editor']['general']['stutter_max_width'];
    }
    catch(e){}
    if (typeof current_value_23 === 'number'){
        default_config['editor']['general']['stutter_max_width'] = current_value_23;
    }
            
    // editor -> general -> stutter_delimiters
    let current_value_24 = undefined;
    try {
        current_value_24 = json_config['editor']['general']['stutter_delimiters'];
    }
    catch(e){}
    if (current_value_24 === true || current_value_24 === false){
        default_config['editor']['general']['stutter_delimiters'] = current_value_24;
    }
            
    // editor -> general -> stutter_bracket_shortcuts
    let current_value_25 = undefined;
    try {
        current_value_25 = json_config['editor']['general']['stutter_bracket_shortcuts'];
    }
    catch(e){}
    if (current_value_25 === true || current_value_25 === false){
        default_config['editor']['general']['stutter_bracket_shortcuts'] = current_value_25;
    }
            
    // formatter -> general -> formatter_verilog
    let current_value_26 = undefined;
    try {
        current_value_26 = json_config['formatter']['general']['formatter_verilog'];
    }
    catch(e){}
    if ( current_value_26 === "istyle"){
        default_config['formatter']['general']['formatter_verilog'] = e_formatter_general_formatter_verilog.istyle;
    }
    if ( current_value_26 === "s3sv"){
        default_config['formatter']['general']['formatter_verilog'] = e_formatter_general_formatter_verilog.s3sv;
    }
    if ( current_value_26 === "verible"){
        default_config['formatter']['general']['formatter_verilog'] = e_formatter_general_formatter_verilog.verible;
    }
            
    // formatter -> general -> formatter_vhdl
    let current_value_27 = undefined;
    try {
        current_value_27 = json_config['formatter']['general']['formatter_vhdl'];
    }
    catch(e){}
    if ( current_value_27 === "standalone"){
        default_config['formatter']['general']['formatter_vhdl'] = e_formatter_general_formatter_vhdl.standalone;
    }
    if ( current_value_27 === "vsg"){
        default_config['formatter']['general']['formatter_vhdl'] = e_formatter_general_formatter_vhdl.vsg;
    }
            
    // formatter -> istyle -> style
    let current_value_28 = undefined;
    try {
        current_value_28 = json_config['formatter']['istyle']['style'];
    }
    catch(e){}
    if ( current_value_28 === "ansi"){
        default_config['formatter']['istyle']['style'] = e_formatter_istyle_style.ansi;
    }
    if ( current_value_28 === "kr"){
        default_config['formatter']['istyle']['style'] = e_formatter_istyle_style.kr;
    }
    if ( current_value_28 === "gnu"){
        default_config['formatter']['istyle']['style'] = e_formatter_istyle_style.gnu;
    }
    if ( current_value_28 === "indent_only"){
        default_config['formatter']['istyle']['style'] = e_formatter_istyle_style.indent_only;
    }
            
    // formatter -> istyle -> indentation_size
    let current_value_29 = undefined;
    try {
        current_value_29 = json_config['formatter']['istyle']['indentation_size'];
    }
    catch(e){}
    if (typeof current_value_29 === 'number'){
        default_config['formatter']['istyle']['indentation_size'] = current_value_29;
    }
            
    // formatter -> s3sv -> one_bind_per_line
    let current_value_30 = undefined;
    try {
        current_value_30 = json_config['formatter']['s3sv']['one_bind_per_line'];
    }
    catch(e){}
    if (current_value_30 === true || current_value_30 === false){
        default_config['formatter']['s3sv']['one_bind_per_line'] = current_value_30;
    }
            
    // formatter -> s3sv -> one_declaration_per_line
    let current_value_31 = undefined;
    try {
        current_value_31 = json_config['formatter']['s3sv']['one_declaration_per_line'];
    }
    catch(e){}
    if (current_value_31 === true || current_value_31 === false){
        default_config['formatter']['s3sv']['one_declaration_per_line'] = current_value_31;
    }
            
    // formatter -> s3sv -> use_tabs
    let current_value_32 = undefined;
    try {
        current_value_32 = json_config['formatter']['s3sv']['use_tabs'];
    }
    catch(e){}
    if (current_value_32 === true || current_value_32 === false){
        default_config['formatter']['s3sv']['use_tabs'] = current_value_32;
    }
            
    // formatter -> s3sv -> indentation_size
    let current_value_33 = undefined;
    try {
        current_value_33 = json_config['formatter']['s3sv']['indentation_size'];
    }
    catch(e){}
    if (typeof current_value_33 === 'number'){
        default_config['formatter']['s3sv']['indentation_size'] = current_value_33;
    }
            
    // formatter -> verible -> format_args
    let current_value_34 = undefined;
    try {
        current_value_34 = json_config['formatter']['verible']['format_args'];
    }
    catch(e){}
    if (typeof current_value_34 === 'string'){
        default_config['formatter']['verible']['format_args'] = current_value_34;
    }
            
    // formatter -> standalone -> keyword_case
    let current_value_35 = undefined;
    try {
        current_value_35 = json_config['formatter']['standalone']['keyword_case'];
    }
    catch(e){}
    if ( current_value_35 === "lowercase"){
        default_config['formatter']['standalone']['keyword_case'] = e_formatter_standalone_keyword_case.lowercase;
    }
    if ( current_value_35 === "uppercase"){
        default_config['formatter']['standalone']['keyword_case'] = e_formatter_standalone_keyword_case.uppercase;
    }
            
    // formatter -> standalone -> name_case
    let current_value_36 = undefined;
    try {
        current_value_36 = json_config['formatter']['standalone']['name_case'];
    }
    catch(e){}
    if ( current_value_36 === "lowercase"){
        default_config['formatter']['standalone']['name_case'] = e_formatter_standalone_name_case.lowercase;
    }
    if ( current_value_36 === "uppercase"){
        default_config['formatter']['standalone']['name_case'] = e_formatter_standalone_name_case.uppercase;
    }
            
    // formatter -> standalone -> indentation
    let current_value_37 = undefined;
    try {
        current_value_37 = json_config['formatter']['standalone']['indentation'];
    }
    catch(e){}
    if (typeof current_value_37 === 'string'){
        default_config['formatter']['standalone']['indentation'] = current_value_37;
    }
            
    // formatter -> standalone -> align_port_generic
    let current_value_38 = undefined;
    try {
        current_value_38 = json_config['formatter']['standalone']['align_port_generic'];
    }
    catch(e){}
    if (current_value_38 === true || current_value_38 === false){
        default_config['formatter']['standalone']['align_port_generic'] = current_value_38;
    }
            
    // formatter -> standalone -> align_comment
    let current_value_39 = undefined;
    try {
        current_value_39 = json_config['formatter']['standalone']['align_comment'];
    }
    catch(e){}
    if (current_value_39 === true || current_value_39 === false){
        default_config['formatter']['standalone']['align_comment'] = current_value_39;
    }
            
    // formatter -> standalone -> remove_comments
    let current_value_40 = undefined;
    try {
        current_value_40 = json_config['formatter']['standalone']['remove_comments'];
    }
    catch(e){}
    if (current_value_40 === true || current_value_40 === false){
        default_config['formatter']['standalone']['remove_comments'] = current_value_40;
    }
            
    // formatter -> standalone -> remove_reports
    let current_value_41 = undefined;
    try {
        current_value_41 = json_config['formatter']['standalone']['remove_reports'];
    }
    catch(e){}
    if (current_value_41 === true || current_value_41 === false){
        default_config['formatter']['standalone']['remove_reports'] = current_value_41;
    }
            
    // formatter -> standalone -> check_alias
    let current_value_42 = undefined;
    try {
        current_value_42 = json_config['formatter']['standalone']['check_alias'];
    }
    catch(e){}
    if (current_value_42 === true || current_value_42 === false){
        default_config['formatter']['standalone']['check_alias'] = current_value_42;
    }
            
    // formatter -> standalone -> new_line_after_then
    let current_value_43 = undefined;
    try {
        current_value_43 = json_config['formatter']['standalone']['new_line_after_then'];
    }
    catch(e){}
    if ( current_value_43 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_then'] = e_formatter_standalone_new_line_after_then.new_line;
    }
    if ( current_value_43 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_then'] = e_formatter_standalone_new_line_after_then.no_new_line;
    }
    if ( current_value_43 === "none"){
        default_config['formatter']['standalone']['new_line_after_then'] = e_formatter_standalone_new_line_after_then.none;
    }
            
    // formatter -> standalone -> new_line_after_semicolon
    let current_value_44 = undefined;
    try {
        current_value_44 = json_config['formatter']['standalone']['new_line_after_semicolon'];
    }
    catch(e){}
    if ( current_value_44 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_semicolon'] = e_formatter_standalone_new_line_after_semicolon.new_line;
    }
    if ( current_value_44 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_semicolon'] = e_formatter_standalone_new_line_after_semicolon.no_new_line;
    }
    if ( current_value_44 === "none"){
        default_config['formatter']['standalone']['new_line_after_semicolon'] = e_formatter_standalone_new_line_after_semicolon.none;
    }
            
    // formatter -> standalone -> new_line_after_else
    let current_value_45 = undefined;
    try {
        current_value_45 = json_config['formatter']['standalone']['new_line_after_else'];
    }
    catch(e){}
    if ( current_value_45 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_else'] = e_formatter_standalone_new_line_after_else.new_line;
    }
    if ( current_value_45 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_else'] = e_formatter_standalone_new_line_after_else.no_new_line;
    }
    if ( current_value_45 === "none"){
        default_config['formatter']['standalone']['new_line_after_else'] = e_formatter_standalone_new_line_after_else.none;
    }
            
    // formatter -> standalone -> new_line_after_port
    let current_value_46 = undefined;
    try {
        current_value_46 = json_config['formatter']['standalone']['new_line_after_port'];
    }
    catch(e){}
    if ( current_value_46 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_port'] = e_formatter_standalone_new_line_after_port.new_line;
    }
    if ( current_value_46 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_port'] = e_formatter_standalone_new_line_after_port.no_new_line;
    }
    if ( current_value_46 === "none"){
        default_config['formatter']['standalone']['new_line_after_port'] = e_formatter_standalone_new_line_after_port.none;
    }
            
    // formatter -> standalone -> new_line_after_generic
    let current_value_47 = undefined;
    try {
        current_value_47 = json_config['formatter']['standalone']['new_line_after_generic'];
    }
    catch(e){}
    if ( current_value_47 === "new_line"){
        default_config['formatter']['standalone']['new_line_after_generic'] = e_formatter_standalone_new_line_after_generic.new_line;
    }
    if ( current_value_47 === "no_new_line"){
        default_config['formatter']['standalone']['new_line_after_generic'] = e_formatter_standalone_new_line_after_generic.no_new_line;
    }
    if ( current_value_47 === "none"){
        default_config['formatter']['standalone']['new_line_after_generic'] = e_formatter_standalone_new_line_after_generic.none;
    }
            
    // linter -> general -> linter_vhdl
    let current_value_48 = undefined;
    try {
        current_value_48 = json_config['linter']['general']['linter_vhdl'];
    }
    catch(e){}
    if ( current_value_48 === "disabled"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.disabled;
    }
    if ( current_value_48 === "ghdl"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.ghdl;
    }
    if ( current_value_48 === "modelsim"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.modelsim;
    }
    if ( current_value_48 === "vivado"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.vivado;
    }
    if ( current_value_48 === "none"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.none;
    }
    if ( current_value_48 === "nvc"){
        default_config['linter']['general']['linter_vhdl'] = e_linter_general_linter_vhdl.nvc;
    }
            
    // linter -> general -> linter_verilog
    let current_value_49 = undefined;
    try {
        current_value_49 = json_config['linter']['general']['linter_verilog'];
    }
    catch(e){}
    if ( current_value_49 === "disabled"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.disabled;
    }
    if ( current_value_49 === "icarus"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.icarus;
    }
    if ( current_value_49 === "modelsim"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.modelsim;
    }
    if ( current_value_49 === "verilator"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.verilator;
    }
    if ( current_value_49 === "vivado"){
        default_config['linter']['general']['linter_verilog'] = e_linter_general_linter_verilog.vivado;
    }
            
    // linter -> general -> lstyle_verilog
    let current_value_50 = undefined;
    try {
        current_value_50 = json_config['linter']['general']['lstyle_verilog'];
    }
    catch(e){}
    if ( current_value_50 === "verible"){
        default_config['linter']['general']['lstyle_verilog'] = e_linter_general_lstyle_verilog.verible;
    }
    if ( current_value_50 === "disabled"){
        default_config['linter']['general']['lstyle_verilog'] = e_linter_general_lstyle_verilog.disabled;
    }
            
    // linter -> general -> lstyle_vhdl
    let current_value_51 = undefined;
    try {
        current_value_51 = json_config['linter']['general']['lstyle_vhdl'];
    }
    catch(e){}
    if ( current_value_51 === "vsg"){
        default_config['linter']['general']['lstyle_vhdl'] = e_linter_general_lstyle_vhdl.vsg;
    }
    if ( current_value_51 === "disabled"){
        default_config['linter']['general']['lstyle_vhdl'] = e_linter_general_lstyle_vhdl.disabled;
    }
            
    // linter -> vhdlls -> standard
    let current_value_52 = undefined;
    try {
        current_value_52 = json_config['linter']['vhdlls']['standard'];
    }
    catch(e){}
    if ( current_value_52 === "v1993"){
        default_config['linter']['vhdlls']['standard'] = e_linter_vhdlls_standard.v1993;
    }
    if ( current_value_52 === "v2008"){
        default_config['linter']['vhdlls']['standard'] = e_linter_vhdlls_standard.v2008;
    }
    if ( current_value_52 === "v2019"){
        default_config['linter']['vhdlls']['standard'] = e_linter_vhdlls_standard.v2019;
    }
            
    // linter -> vhdlls -> ignoreVunit
    let current_value_53 = undefined;
    try {
        current_value_53 = json_config['linter']['vhdlls']['ignoreVunit'];
    }
    catch(e){}
    if (current_value_53 === true || current_value_53 === false){
        default_config['linter']['vhdlls']['ignoreVunit'] = current_value_53;
    }
            
    // linter -> vhdlls -> vunitPath
    let current_value_54 = undefined;
    try {
        current_value_54 = json_config['linter']['vhdlls']['vunitPath'];
    }
    catch(e){}
    if (typeof current_value_54 === 'string'){
        default_config['linter']['vhdlls']['vunitPath'] = current_value_54;
    }
            
    // linter -> ghdl -> arguments
    let current_value_55 = undefined;
    try {
        current_value_55 = json_config['linter']['ghdl']['arguments'];
    }
    catch(e){}
    if (typeof current_value_55 === 'string'){
        default_config['linter']['ghdl']['arguments'] = current_value_55;
    }

    // linter -> nvc -> arguments
    let current_value_55_nvc = undefined;
    try {
        current_value_55_nvc = json_config['linter']['nvc']['arguments'];
    }
    catch(e){}
    if (typeof current_value_55_nvc === 'string'){
        default_config['linter']['nvc']['arguments'] = current_value_55_nvc;
    }
            
    // linter -> icarus -> arguments
    let current_value_56 = undefined;
    try {
        current_value_56 = json_config['linter']['icarus']['arguments'];
    }
    catch(e){}
    if (typeof current_value_56 === 'string'){
        default_config['linter']['icarus']['arguments'] = current_value_56;
    }
            
    // linter -> modelsim -> vhdl_arguments
    let current_value_57 = undefined;
    try {
        current_value_57 = json_config['linter']['modelsim']['vhdl_arguments'];
    }
    catch(e){}
    if (typeof current_value_57 === 'string'){
        default_config['linter']['modelsim']['vhdl_arguments'] = current_value_57;
    }
            
    // linter -> modelsim -> verilog_arguments
    let current_value_58 = undefined;
    try {
        current_value_58 = json_config['linter']['modelsim']['verilog_arguments'];
    }
    catch(e){}
    if (typeof current_value_58 === 'string'){
        default_config['linter']['modelsim']['verilog_arguments'] = current_value_58;
    }
            
    // linter -> verible -> arguments
    let current_value_59 = undefined;
    try {
        current_value_59 = json_config['linter']['verible']['arguments'];
    }
    catch(e){}
    if (typeof current_value_59 === 'string'){
        default_config['linter']['verible']['arguments'] = current_value_59;
    }
            
    // linter -> verilator -> arguments
    let current_value_60 = undefined;
    try {
        current_value_60 = json_config['linter']['verilator']['arguments'];
    }
    catch(e){}
    if (typeof current_value_60 === 'string'){
        default_config['linter']['verilator']['arguments'] = current_value_60;
    }
            
    // linter -> vivado -> vhdl_arguments
    let current_value_61 = undefined;
    try {
        current_value_61 = json_config['linter']['vivado']['vhdl_arguments'];
    }
    catch(e){}
    if (typeof current_value_61 === 'string'){
        default_config['linter']['vivado']['vhdl_arguments'] = current_value_61;
    }
            
    // linter -> vivado -> verilog_arguments
    let current_value_62 = undefined;
    try {
        current_value_62 = json_config['linter']['vivado']['verilog_arguments'];
    }
    catch(e){}
    if (typeof current_value_62 === 'string'){
        default_config['linter']['vivado']['verilog_arguments'] = current_value_62;
    }
            
    // schematic -> general -> backend
    let current_value_63 = undefined;
    try {
        current_value_63 = json_config['schematic']['general']['backend'];
    }
    catch(e){}
    if ( current_value_63 === "yowasp"){
        default_config['schematic']['general']['backend'] = e_schematic_general_backend.yowasp;
    }
    if ( current_value_63 === "yosys"){
        default_config['schematic']['general']['backend'] = e_schematic_general_backend.yosys;
    }
    if ( current_value_63 === "yosys_ghdl"){
        default_config['schematic']['general']['backend'] = e_schematic_general_backend.yosys_ghdl;
    }
    if ( current_value_63 === "standalone"){
        default_config['schematic']['general']['backend'] = e_schematic_general_backend.standalone;
    }
            
    // schematic -> general -> extra
    let current_value_64 = undefined;
    try {
        current_value_64 = json_config['schematic']['general']['extra'];
    }
    catch(e){}
    if (typeof current_value_64 === 'string'){
        default_config['schematic']['general']['extra'] = current_value_64;
    }
            
    // schematic -> general -> args
    let current_value_65 = undefined;
    try {
        current_value_65 = json_config['schematic']['general']['args'];
    }
    catch(e){}
    if (typeof current_value_65 === 'string'){
        default_config['schematic']['general']['args'] = current_value_65;
    }
            
    // schematic -> general -> args_ghdl
    let current_value_66 = undefined;
    try {
        current_value_66 = json_config['schematic']['general']['args_ghdl'];
    }
    catch(e){}
    if (typeof current_value_66 === 'string'){
        default_config['schematic']['general']['args_ghdl'] = current_value_66;
    }
            
    // templates -> general -> header_file_path
    let current_value_67 = undefined;
    try {
        current_value_67 = json_config['templates']['general']['header_file_path'];
    }
    catch(e){}
    if (typeof current_value_67 === 'string'){
        default_config['templates']['general']['header_file_path'] = current_value_67;
    }
            
    // templates -> general -> indent
    let current_value_68 = undefined;
    try {
        current_value_68 = json_config['templates']['general']['indent'];
    }
    catch(e){}
    if (typeof current_value_68 === 'string'){
        default_config['templates']['general']['indent'] = current_value_68;
    }
            
    // templates -> general -> clock_generation_style
    let current_value_69 = undefined;
    try {
        current_value_69 = json_config['templates']['general']['clock_generation_style'];
    }
    catch(e){}
    if ( current_value_69 === "inline"){
        default_config['templates']['general']['clock_generation_style'] = e_templates_general_clock_generation_style.inline;
    }
    if ( current_value_69 === "ifelse"){
        default_config['templates']['general']['clock_generation_style'] = e_templates_general_clock_generation_style.ifelse;
    }
            
    // templates -> general -> instance_style
    let current_value_70 = undefined;
    try {
        current_value_70 = json_config['templates']['general']['instance_style'];
    }
    catch(e){}
    if ( current_value_70 === "inline"){
        default_config['templates']['general']['instance_style'] = e_templates_general_instance_style.inline;
    }
    if ( current_value_70 === "separate"){
        default_config['templates']['general']['instance_style'] = e_templates_general_instance_style.separate;
    }
            
    // tools -> general -> select_tool
    let current_value_71 = undefined;
    try {
        current_value_71 = json_config['tools']['general']['select_tool'];
    }
    catch(e){}
    if ( current_value_71 === "osvvm"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.osvvm;
    }
    if ( current_value_71 === "vunit"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.vunit;
    }
    if ( current_value_71 === "ghdl"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.ghdl;
    }
    if ( current_value_71 === "cocotb"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.cocotb;
    }
    if ( current_value_71 === "icarus"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.icarus;
    }
    if ( current_value_71 === "icestorm"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.icestorm;
    }
    if ( current_value_71 === "ise"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.ise;
    }
    if ( current_value_71 === "isim"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.isim;
    }
    if ( current_value_71 === "modelsim"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.modelsim;
    }
    if ( current_value_71 === "openfpga"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.openfpga;
    }
    if ( current_value_71 === "quartus"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.quartus;
    }
    if ( current_value_71 === "rivierapro"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.rivierapro;
    }
    if ( current_value_71 === "spyglass"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.spyglass;
    }
    if ( current_value_71 === "trellis"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.trellis;
    }
    if ( current_value_71 === "vcs"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.vcs;
    }
    if ( current_value_71 === "verilator"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.verilator;
    }
    if ( current_value_71 === "vivado"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.vivado;
    }
    if ( current_value_71 === "xcelium"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.xcelium;
    }
    if ( current_value_71 === "xsim"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.xsim;
    }
    if ( current_value_71 === "raptor"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.raptor;
    }
    if ( current_value_71 === "radiant"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.radiant;
    }
    if ( current_value_71 === "sandpiper"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.sandpiper;
    }
    if ( current_value_71 === "yosys"){
        default_config['tools']['general']['select_tool'] = e_tools_general_select_tool.yosys;
    }
            
    // tools -> general -> manual_compilation_order
    let current_value_72 = undefined;
    try {
        current_value_72 = json_config['tools']['general']['manual_compilation_order'];
    }
    catch(e){}
    if (typeof current_value_72 === 'string'){
        default_config['tools']['general']['manual_compilation_order'] = current_value_72;
    }
            
    // tools -> general -> execution_mode
    let current_value_73 = undefined;
    try {
        current_value_73 = json_config['tools']['general']['execution_mode'];
    }
    catch(e){}
    if ( current_value_73 === "gui"){
        default_config['tools']['general']['execution_mode'] = e_tools_general_execution_mode.gui;
    }
    if ( current_value_73 === "cmd"){
        default_config['tools']['general']['execution_mode'] = e_tools_general_execution_mode.cmd;
    }
            
    // tools -> general -> waveform_viewer
    let current_value_74 = undefined;
    try {
        current_value_74 = json_config['tools']['general']['waveform_viewer'];
    }
    catch(e){}
    if ( current_value_74 === "tool"){
        default_config['tools']['general']['waveform_viewer'] = e_tools_general_waveform_viewer.tool;
    }
    if ( current_value_74 === "vaporView"){
        default_config['tools']['general']['waveform_viewer'] = e_tools_general_waveform_viewer.vaporView;
    }
    if ( current_value_74 === "gtkwave"){
        default_config['tools']['general']['waveform_viewer'] = e_tools_general_waveform_viewer.gtkwave;
    }
            
    // tools -> general -> gtkwave_installation_path
    let current_value_75 = undefined;
    try {
        current_value_75 = json_config['tools']['general']['gtkwave_installation_path'];
    }
    catch(e){}
    if (typeof current_value_75 === 'string'){
        default_config['tools']['general']['gtkwave_installation_path'] = current_value_75;
    }
            
    // tools -> general -> gtkwave_extra_arguments
    let current_value_76 = undefined;
    try {
        current_value_76 = json_config['tools']['general']['gtkwave_extra_arguments'];
    }
    catch(e){}
    if (typeof current_value_76 === 'string'){
        default_config['tools']['general']['gtkwave_extra_arguments'] = current_value_76;
    }
            
    // tools -> quartus -> installation_path
    let current_value_77 = undefined;
    try {
        current_value_77 = json_config['tools']['quartus']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_77 === 'string'){
        default_config['tools']['quartus']['installation_path'] = current_value_77;
    }
            
    // tools -> quartus -> family
    let current_value_78 = undefined;
    try {
        current_value_78 = json_config['tools']['quartus']['family'];
    }
    catch(e){}
    if (typeof current_value_78 === 'string'){
        default_config['tools']['quartus']['family'] = current_value_78;
    }
            
    // tools -> quartus -> device
    let current_value_79 = undefined;
    try {
        current_value_79 = json_config['tools']['quartus']['device'];
    }
    catch(e){}
    if (typeof current_value_79 === 'string'){
        default_config['tools']['quartus']['device'] = current_value_79;
    }
            
    // tools -> quartus -> optimization_mode
    let current_value_80 = undefined;
    try {
        current_value_80 = json_config['tools']['quartus']['optimization_mode'];
    }
    catch(e){}
    if ( current_value_80 === "BALANCED"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.BALANCED;
    }
    if ( current_value_80 === "HIGH_PERFORMANCE_EFFORT"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.HIGH_PERFORMANCE_EFFORT;
    }
    if ( current_value_80 === "HIGH_PERFORMANCE_EFFORT_WITH_MAXIMUM_PLACEMENT_EFFORT"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.HIGH_PERFORMANCE_EFFORT_WITH_MAXIMUM_PLACEMENT_EFFORT;
    }
    if ( current_value_80 === "HIGH_PERFORMANCE_WITH_AGGRESSIVE_POWER_EFFORT"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.HIGH_PERFORMANCE_WITH_AGGRESSIVE_POWER_EFFORT;
    }
    if ( current_value_80 === "SUPERIOR_PERFORMANCE"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.SUPERIOR_PERFORMANCE;
    }
    if ( current_value_80 === "SUPERIOR_PERFORMANCE_WITH_MAXIMUM_PLACEMENT_EFFORT"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.SUPERIOR_PERFORMANCE_WITH_MAXIMUM_PLACEMENT_EFFORT;
    }
    if ( current_value_80 === "AGGRESSIVE_AREA"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.AGGRESSIVE_AREA;
    }
    if ( current_value_80 === "HIGH_PLACEMENT_ROUTABILITY_EFFORT"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.HIGH_PLACEMENT_ROUTABILITY_EFFORT;
    }
    if ( current_value_80 === "HIGH_PACKING_ROUTABILITY_EFFORT"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.HIGH_PACKING_ROUTABILITY_EFFORT;
    }
    if ( current_value_80 === "OPTIMIZE_NETLIST_FOR_ROUTABILITY"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.OPTIMIZE_NETLIST_FOR_ROUTABILITY;
    }
    if ( current_value_80 === "AGGRESSIVE_POWER"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.AGGRESSIVE_POWER;
    }
    if ( current_value_80 === "AGGRESSIVE_COMPILE_TIME"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.AGGRESSIVE_COMPILE_TIME;
    }
    if ( current_value_80 === "FAST_FUNCTIONAL_TEST"){
        default_config['tools']['quartus']['optimization_mode'] = e_tools_quartus_optimization_mode.FAST_FUNCTIONAL_TEST;
    }
            
    // tools -> quartus -> allow_register_retiming
    let current_value_81 = undefined;
    try {
        current_value_81 = json_config['tools']['quartus']['allow_register_retiming'];
    }
    catch(e){}
    if (current_value_81 === true || current_value_81 === false){
        default_config['tools']['quartus']['allow_register_retiming'] = current_value_81;
    }
            
    // tools -> quartus -> wave_file_questa
    let current_value_82 = undefined;
    try {
        current_value_82 = json_config['tools']['quartus']['wave_file_questa'];
    }
    catch(e){}
    if (typeof current_value_82 === 'string'){
        default_config['tools']['quartus']['wave_file_questa'] = current_value_82;
    }
            
    // tools -> vsg -> installation_path
    let current_value_83 = undefined;
    try {
        current_value_83 = json_config['tools']['vsg']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_83 === 'string'){
        default_config['tools']['vsg']['installation_path'] = current_value_83;
    }
            
    // tools -> vsg -> style_config
    let current_value_84 = undefined;
    try {
        current_value_84 = json_config['tools']['vsg']['style_config'];
    }
    catch(e){}
    if (typeof current_value_84 === 'string'){
        default_config['tools']['vsg']['style_config'] = current_value_84;
    }
            
    // tools -> vsg -> core_number
    let current_value_85 = undefined;
    try {
        current_value_85 = json_config['tools']['vsg']['core_number'];
    }
    catch(e){}
    if (typeof current_value_85 === 'number'){
        default_config['tools']['vsg']['core_number'] = current_value_85;
    }
            
    // tools -> vsg -> aditional_arguments
    let current_value_86 = undefined;
    try {
        current_value_86 = json_config['tools']['vsg']['aditional_arguments'];
    }
    catch(e){}
    if (typeof current_value_86 === 'string'){
        default_config['tools']['vsg']['aditional_arguments'] = current_value_86;
    }
            
    // tools -> osvvm -> installation_path
    let current_value_87 = undefined;
    try {
        current_value_87 = json_config['tools']['osvvm']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_87 === 'string'){
        default_config['tools']['osvvm']['installation_path'] = current_value_87;
    }
            
    // tools -> osvvm -> tclsh_binary
    let current_value_88 = undefined;
    try {
        current_value_88 = json_config['tools']['osvvm']['tclsh_binary'];
    }
    catch(e){}
    if (typeof current_value_88 === 'string'){
        default_config['tools']['osvvm']['tclsh_binary'] = current_value_88;
    }
            
    // tools -> osvvm -> simulator_name
    let current_value_89 = undefined;
    try {
        current_value_89 = json_config['tools']['osvvm']['simulator_name'];
    }
    catch(e){}
    if ( current_value_89 === "activehdl"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.activehdl;
    }
    if ( current_value_89 === "ghdl"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.ghdl;
    }
    if ( current_value_89 === "nvc"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.nvc;
    }
    if ( current_value_89 === "rivierapro"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.rivierapro;
    }
    if ( current_value_89 === "questa"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.questa;
    }
    if ( current_value_89 === "modelsim"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.modelsim;
    }
    if ( current_value_89 === "vcs"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.vcs;
    }
    if ( current_value_89 === "xsim"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.xsim;
    }
    if ( current_value_89 === "xcelium"){
        default_config['tools']['osvvm']['simulator_name'] = e_tools_osvvm_simulator_name.xcelium;
    }
            
    // tools -> ascenlint -> installation_path
    let current_value_90 = undefined;
    try {
        current_value_90 = json_config['tools']['ascenlint']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_90 === 'string'){
        default_config['tools']['ascenlint']['installation_path'] = current_value_90;
    }
            
    // tools -> ascenlint -> ascentlint_options
    let current_value_91 = undefined;
    try {
        current_value_91 = json_config['tools']['ascenlint']['ascentlint_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_91)){
        default_config['tools']['ascenlint']['ascentlint_options'] = current_value_91;
    }
            
    // tools -> cocotb -> installation_path
    let current_value_92 = undefined;
    try {
        current_value_92 = json_config['tools']['cocotb']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_92 === 'string'){
        default_config['tools']['cocotb']['installation_path'] = current_value_92;
    }
            
    // tools -> cocotb -> simulator_name
    let current_value_93 = undefined;
    try {
        current_value_93 = json_config['tools']['cocotb']['simulator_name'];
    }
    catch(e){}
    if ( current_value_93 === "icarus"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.icarus;
    }
    if ( current_value_93 === "verilator"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.verilator;
    }
    if ( current_value_93 === "vcs"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.vcs;
    }
    if ( current_value_93 === "riviera"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.riviera;
    }
    if ( current_value_93 === "activehdl"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.activehdl;
    }
    if ( current_value_93 === "questa"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.questa;
    }
    if ( current_value_93 === "modelsim"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.modelsim;
    }
    if ( current_value_93 === "ius"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.ius;
    }
    if ( current_value_93 === "xcelium"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.xcelium;
    }
    if ( current_value_93 === "ghdl"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.ghdl;
    }
    if ( current_value_93 === "cvc"){
        default_config['tools']['cocotb']['simulator_name'] = e_tools_cocotb_simulator_name.cvc;
    }
            
    // tools -> cocotb -> compile_args
    let current_value_94 = undefined;
    try {
        current_value_94 = json_config['tools']['cocotb']['compile_args'];
    }
    catch(e){}
    if (typeof current_value_94 === 'string'){
        default_config['tools']['cocotb']['compile_args'] = current_value_94;
    }
            
    // tools -> cocotb -> run_args
    let current_value_95 = undefined;
    try {
        current_value_95 = json_config['tools']['cocotb']['run_args'];
    }
    catch(e){}
    if (typeof current_value_95 === 'string'){
        default_config['tools']['cocotb']['run_args'] = current_value_95;
    }
            
    // tools -> cocotb -> plusargs
    let current_value_96 = undefined;
    try {
        current_value_96 = json_config['tools']['cocotb']['plusargs'];
    }
    catch(e){}
    if (typeof current_value_96 === 'string'){
        default_config['tools']['cocotb']['plusargs'] = current_value_96;
    }
            
    // tools -> diamond -> installation_path
    let current_value_97 = undefined;
    try {
        current_value_97 = json_config['tools']['diamond']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_97 === 'string'){
        default_config['tools']['diamond']['installation_path'] = current_value_97;
    }
            
    // tools -> diamond -> part
    let current_value_98 = undefined;
    try {
        current_value_98 = json_config['tools']['diamond']['part'];
    }
    catch(e){}
    if (typeof current_value_98 === 'string'){
        default_config['tools']['diamond']['part'] = current_value_98;
    }
            
    // tools -> ghdl -> installation_path
    let current_value_99 = undefined;
    try {
        current_value_99 = json_config['tools']['ghdl']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_99 === 'string'){
        default_config['tools']['ghdl']['installation_path'] = current_value_99;
    }
            
    // tools -> ghdl -> vhdl_standard
    let current_value_100 = undefined;
    try {
        current_value_100 = json_config['tools']['ghdl']['vhdl_standard'];
    }
    catch(e){}
    if ( current_value_100 === "auto"){
        default_config['tools']['ghdl']['vhdl_standard'] = e_tools_ghdl_vhdl_standard.auto;
    }
    if ( current_value_100 === "vhdl87"){
        default_config['tools']['ghdl']['vhdl_standard'] = e_tools_ghdl_vhdl_standard.vhdl87;
    }
    if ( current_value_100 === "vhdl93"){
        default_config['tools']['ghdl']['vhdl_standard'] = e_tools_ghdl_vhdl_standard.vhdl93;
    }
    if ( current_value_100 === "vhdl02"){
        default_config['tools']['ghdl']['vhdl_standard'] = e_tools_ghdl_vhdl_standard.vhdl02;
    }
    if ( current_value_100 === "vhdl08"){
        default_config['tools']['ghdl']['vhdl_standard'] = e_tools_ghdl_vhdl_standard.vhdl08;
    }
    if ( current_value_100 === "vhdl19"){
        default_config['tools']['ghdl']['vhdl_standard'] = e_tools_ghdl_vhdl_standard.vhdl19;
    }
            
    // tools -> ghdl -> ieee_library
    let current_value_101 = undefined;
    try {
        current_value_101 = json_config['tools']['ghdl']['ieee_library'];
    }
    catch(e){}
    if ( current_value_101 === "standard"){
        default_config['tools']['ghdl']['ieee_library'] = e_tools_ghdl_ieee_library.standard;
    }
    if ( current_value_101 === "synopsys"){
        default_config['tools']['ghdl']['ieee_library'] = e_tools_ghdl_ieee_library.synopsys;
    }
            
    // tools -> ghdl -> relaxed_parsing
    let current_value_102 = undefined;
    try {
        current_value_102 = json_config['tools']['ghdl']['relaxed_parsing'];
    }
    catch(e){}
    if (current_value_102 === true || current_value_102 === false){
        default_config['tools']['ghdl']['relaxed_parsing'] = current_value_102;
    }
            
    // tools -> ghdl -> unicode_support
    let current_value_103 = undefined;
    try {
        current_value_103 = json_config['tools']['ghdl']['unicode_support'];
    }
    catch(e){}
    if (current_value_103 === true || current_value_103 === false){
        default_config['tools']['ghdl']['unicode_support'] = current_value_103;
    }
            
    // tools -> ghdl -> psl_enabled
    let current_value_104 = undefined;
    try {
        current_value_104 = json_config['tools']['ghdl']['psl_enabled'];
    }
    catch(e){}
    if (current_value_104 === true || current_value_104 === false){
        default_config['tools']['ghdl']['psl_enabled'] = current_value_104;
    }
            
    // tools -> ghdl -> work_library
    let current_value_105 = undefined;
    try {
        current_value_105 = json_config['tools']['ghdl']['work_library'];
    }
    catch(e){}
    if (typeof current_value_105 === 'string'){
        default_config['tools']['ghdl']['work_library'] = current_value_105;
    }
            
    // tools -> ghdl -> library_paths
    let current_value_106 = undefined;
    try {
        current_value_106 = json_config['tools']['ghdl']['library_paths'];
    }
    catch(e){}
    if (Array.isArray(current_value_106)){
        default_config['tools']['ghdl']['library_paths'] = current_value_106;
    }
            
    // tools -> ghdl -> check_syntax_options
    let current_value_107 = undefined;
    try {
        current_value_107 = json_config['tools']['ghdl']['check_syntax_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_107)){
        default_config['tools']['ghdl']['check_syntax_options'] = current_value_107;
    }
            
    // tools -> ghdl -> analyze_options
    let current_value_108 = undefined;
    try {
        current_value_108 = json_config['tools']['ghdl']['analyze_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_108)){
        default_config['tools']['ghdl']['analyze_options'] = current_value_108;
    }
            
    // tools -> ghdl -> elaborate_options
    let current_value_109 = undefined;
    try {
        current_value_109 = json_config['tools']['ghdl']['elaborate_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_109)){
        default_config['tools']['ghdl']['elaborate_options'] = current_value_109;
    }
            
    // tools -> ghdl -> run_options
    let current_value_110 = undefined;
    try {
        current_value_110 = json_config['tools']['ghdl']['run_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_110)){
        default_config['tools']['ghdl']['run_options'] = current_value_110;
    }
            
    // tools -> ghdl -> synthesis_options
    let current_value_111 = undefined;
    try {
        current_value_111 = json_config['tools']['ghdl']['synthesis_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_111)){
        default_config['tools']['ghdl']['synthesis_options'] = current_value_111;
    }
            
    // tools -> ghdl -> extra_flags
    let current_value_112 = undefined;
    try {
        current_value_112 = json_config['tools']['ghdl']['extra_flags'];
    }
    catch(e){}
    if (Array.isArray(current_value_112)){
        default_config['tools']['ghdl']['extra_flags'] = current_value_112;
    }
            
    // tools -> ghdl -> relaxed_rules
    let current_value_113 = undefined;
    try {
        current_value_113 = json_config['tools']['ghdl']['relaxed_rules'];
    }
    catch(e){}
    if (current_value_113 === true || current_value_113 === false){
        default_config['tools']['ghdl']['relaxed_rules'] = current_value_113;
    }
            
    // tools -> ghdl -> bind_checks
    let current_value_114 = undefined;
    try {
        current_value_114 = json_config['tools']['ghdl']['bind_checks'];
    }
    catch(e){}
    if (current_value_114 === true || current_value_114 === false){
        default_config['tools']['ghdl']['bind_checks'] = current_value_114;
    }
            
    // tools -> ghdl -> vital_checks
    let current_value_115 = undefined;
    try {
        current_value_115 = json_config['tools']['ghdl']['vital_checks'];
    }
    catch(e){}
    if (current_value_115 === true || current_value_115 === false){
        default_config['tools']['ghdl']['vital_checks'] = current_value_115;
    }
            
    // tools -> ghdl -> simulation_time
    let current_value_116 = undefined;
    try {
        current_value_116 = json_config['tools']['ghdl']['simulation_time'];
    }
    catch(e){}
    if (typeof current_value_116 === 'string'){
        default_config['tools']['ghdl']['simulation_time'] = current_value_116;
    }
            
    // tools -> ghdl -> resolution_limit
    let current_value_117 = undefined;
    try {
        current_value_117 = json_config['tools']['ghdl']['resolution_limit'];
    }
    catch(e){}
    if (typeof current_value_117 === 'string'){
        default_config['tools']['ghdl']['resolution_limit'] = current_value_117;
    }
            
    // tools -> ghdl -> stack_size
    let current_value_118 = undefined;
    try {
        current_value_118 = json_config['tools']['ghdl']['stack_size'];
    }
    catch(e){}
    if (typeof current_value_118 === 'string'){
        default_config['tools']['ghdl']['stack_size'] = current_value_118;
    }
            
    // tools -> ghdl -> stop_delta_cycles
    let current_value_119 = undefined;
    try {
        current_value_119 = json_config['tools']['ghdl']['stop_delta_cycles'];
    }
    catch(e){}
    if (typeof current_value_119 === 'number'){
        default_config['tools']['ghdl']['stop_delta_cycles'] = current_value_119;
    }
            
    // tools -> ghdl -> waveform_enabled
    let current_value_120 = undefined;
    try {
        current_value_120 = json_config['tools']['ghdl']['waveform_enabled'];
    }
    catch(e){}
    if (current_value_120 === true || current_value_120 === false){
        default_config['tools']['ghdl']['waveform_enabled'] = current_value_120;
    }
            
    // tools -> ghdl -> waveform_format
    let current_value_121 = undefined;
    try {
        current_value_121 = json_config['tools']['ghdl']['waveform_format'];
    }
    catch(e){}
    if ( current_value_121 === "vcd"){
        default_config['tools']['ghdl']['waveform_format'] = e_tools_ghdl_waveform_format.vcd;
    }
    if ( current_value_121 === "ghw"){
        default_config['tools']['ghdl']['waveform_format'] = e_tools_ghdl_waveform_format.ghw;
    }
    if ( current_value_121 === "fst"){
        default_config['tools']['ghdl']['waveform_format'] = e_tools_ghdl_waveform_format.fst;
    }
            
    // tools -> ghdl -> waveform_options
    let current_value_122 = undefined;
    try {
        current_value_122 = json_config['tools']['ghdl']['waveform_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_122)){
        default_config['tools']['ghdl']['waveform_options'] = current_value_122;
    }
            
    // tools -> ghdl -> wave_start_time
    let current_value_123 = undefined;
    try {
        current_value_123 = json_config['tools']['ghdl']['wave_start_time'];
    }
    catch(e){}
    if (typeof current_value_123 === 'string'){
        default_config['tools']['ghdl']['wave_start_time'] = current_value_123;
    }
            
    // tools -> ghdl -> vcd_4states
    let current_value_124 = undefined;
    try {
        current_value_124 = json_config['tools']['ghdl']['vcd_4states'];
    }
    catch(e){}
    if (current_value_124 === true || current_value_124 === false){
        default_config['tools']['ghdl']['vcd_4states'] = current_value_124;
    }
            
    // tools -> ghdl -> vcd_nodate
    let current_value_125 = undefined;
    try {
        current_value_125 = json_config['tools']['ghdl']['vcd_nodate'];
    }
    catch(e){}
    if (current_value_125 === true || current_value_125 === false){
        default_config['tools']['ghdl']['vcd_nodate'] = current_value_125;
    }
            
    // tools -> ghdl -> read_wave_opt
    let current_value_126 = undefined;
    try {
        current_value_126 = json_config['tools']['ghdl']['read_wave_opt'];
    }
    catch(e){}
    if (typeof current_value_126 === 'string'){
        default_config['tools']['ghdl']['read_wave_opt'] = current_value_126;
    }
            
    // tools -> ghdl -> write_wave_opt
    let current_value_127 = undefined;
    try {
        current_value_127 = json_config['tools']['ghdl']['write_wave_opt'];
    }
    catch(e){}
    if (typeof current_value_127 === 'string'){
        default_config['tools']['ghdl']['write_wave_opt'] = current_value_127;
    }
            
    // tools -> ghdl -> debug_level
    let current_value_128 = undefined;
    try {
        current_value_128 = json_config['tools']['ghdl']['debug_level'];
    }
    catch(e){}
    if ( current_value_128 === "none"){
        default_config['tools']['ghdl']['debug_level'] = e_tools_ghdl_debug_level.none;
    }
    if ( current_value_128 === "minimal"){
        default_config['tools']['ghdl']['debug_level'] = e_tools_ghdl_debug_level.minimal;
    }
    if ( current_value_128 === "full"){
        default_config['tools']['ghdl']['debug_level'] = e_tools_ghdl_debug_level.full;
    }
            
    // tools -> ghdl -> verbose
    let current_value_129 = undefined;
    try {
        current_value_129 = json_config['tools']['ghdl']['verbose'];
    }
    catch(e){}
    if (current_value_129 === true || current_value_129 === false){
        default_config['tools']['ghdl']['verbose'] = current_value_129;
    }
            
    // tools -> ghdl -> warnings_as_errors
    let current_value_130 = undefined;
    try {
        current_value_130 = json_config['tools']['ghdl']['warnings_as_errors'];
    }
    catch(e){}
    if (current_value_130 === true || current_value_130 === false){
        default_config['tools']['ghdl']['warnings_as_errors'] = current_value_130;
    }
            
    // tools -> ghdl -> suppress_warnings
    let current_value_131 = undefined;
    try {
        current_value_131 = json_config['tools']['ghdl']['suppress_warnings'];
    }
    catch(e){}
    if (Array.isArray(current_value_131)){
        default_config['tools']['ghdl']['suppress_warnings'] = current_value_131;
    }
            
    // tools -> ghdl -> assert_level
    let current_value_132 = undefined;
    try {
        current_value_132 = json_config['tools']['ghdl']['assert_level'];
    }
    catch(e){}
    if ( current_value_132 === "note"){
        default_config['tools']['ghdl']['assert_level'] = e_tools_ghdl_assert_level.note;
    }
    if ( current_value_132 === "warning"){
        default_config['tools']['ghdl']['assert_level'] = e_tools_ghdl_assert_level.warning;
    }
    if ( current_value_132 === "error"){
        default_config['tools']['ghdl']['assert_level'] = e_tools_ghdl_assert_level.error;
    }
    if ( current_value_132 === "failure"){
        default_config['tools']['ghdl']['assert_level'] = e_tools_ghdl_assert_level.failure;
    }
    if ( current_value_132 === "none"){
        default_config['tools']['ghdl']['assert_level'] = e_tools_ghdl_assert_level.none;
    }
            
    // tools -> ghdl -> display_time
    let current_value_133 = undefined;
    try {
        current_value_133 = json_config['tools']['ghdl']['display_time'];
    }
    catch(e){}
    if (current_value_133 === true || current_value_133 === false){
        default_config['tools']['ghdl']['display_time'] = current_value_133;
    }
            
    // tools -> ghdl -> unbuffered_output
    let current_value_134 = undefined;
    try {
        current_value_134 = json_config['tools']['ghdl']['unbuffered_output'];
    }
    catch(e){}
    if (current_value_134 === true || current_value_134 === false){
        default_config['tools']['ghdl']['unbuffered_output'] = current_value_134;
    }
            
    // tools -> ghdl -> max_stack_alloc
    let current_value_135 = undefined;
    try {
        current_value_135 = json_config['tools']['ghdl']['max_stack_alloc'];
    }
    catch(e){}
    if (typeof current_value_135 === 'number'){
        default_config['tools']['ghdl']['max_stack_alloc'] = current_value_135;
    }
            
    // tools -> ghdl -> backtrace_severity
    let current_value_136 = undefined;
    try {
        current_value_136 = json_config['tools']['ghdl']['backtrace_severity'];
    }
    catch(e){}
    if ( current_value_136 === "note"){
        default_config['tools']['ghdl']['backtrace_severity'] = e_tools_ghdl_backtrace_severity.note;
    }
    if ( current_value_136 === "warning"){
        default_config['tools']['ghdl']['backtrace_severity'] = e_tools_ghdl_backtrace_severity.warning;
    }
    if ( current_value_136 === "error"){
        default_config['tools']['ghdl']['backtrace_severity'] = e_tools_ghdl_backtrace_severity.error;
    }
    if ( current_value_136 === "failure"){
        default_config['tools']['ghdl']['backtrace_severity'] = e_tools_ghdl_backtrace_severity.failure;
    }
    if ( current_value_136 === "none"){
        default_config['tools']['ghdl']['backtrace_severity'] = e_tools_ghdl_backtrace_severity.none;
    }
            
    // tools -> ghdl -> ieee_asserts
    let current_value_137 = undefined;
    try {
        current_value_137 = json_config['tools']['ghdl']['ieee_asserts'];
    }
    catch(e){}
    if ( current_value_137 === "enable"){
        default_config['tools']['ghdl']['ieee_asserts'] = e_tools_ghdl_ieee_asserts.enable;
    }
    if ( current_value_137 === "disable"){
        default_config['tools']['ghdl']['ieee_asserts'] = e_tools_ghdl_ieee_asserts.disable;
    }
    if ( current_value_137 === "disable-at-0"){
        default_config['tools']['ghdl']['ieee_asserts'] = e_tools_ghdl_ieee_asserts.disable_at_0;
    }
            
    // tools -> ghdl -> asserts_policy
    let current_value_138 = undefined;
    try {
        current_value_138 = json_config['tools']['ghdl']['asserts_policy'];
    }
    catch(e){}
    if ( current_value_138 === "enable"){
        default_config['tools']['ghdl']['asserts_policy'] = e_tools_ghdl_asserts_policy.enable;
    }
    if ( current_value_138 === "disable"){
        default_config['tools']['ghdl']['asserts_policy'] = e_tools_ghdl_asserts_policy.disable;
    }
    if ( current_value_138 === "disable-at-0"){
        default_config['tools']['ghdl']['asserts_policy'] = e_tools_ghdl_asserts_policy.disable_at_0;
    }
            
    // tools -> ghdl -> sdf_file
    let current_value_139 = undefined;
    try {
        current_value_139 = json_config['tools']['ghdl']['sdf_file'];
    }
    catch(e){}
    if (typeof current_value_139 === 'string'){
        default_config['tools']['ghdl']['sdf_file'] = current_value_139;
    }
            
    // tools -> ghdl -> vpi_modules
    let current_value_140 = undefined;
    try {
        current_value_140 = json_config['tools']['ghdl']['vpi_modules'];
    }
    catch(e){}
    if (Array.isArray(current_value_140)){
        default_config['tools']['ghdl']['vpi_modules'] = current_value_140;
    }
            
    // tools -> ghdl -> vhpi_modules
    let current_value_141 = undefined;
    try {
        current_value_141 = json_config['tools']['ghdl']['vhpi_modules'];
    }
    catch(e){}
    if (Array.isArray(current_value_141)){
        default_config['tools']['ghdl']['vhpi_modules'] = current_value_141;
    }
            
    // tools -> ghdl -> vpi_trace_file
    let current_value_142 = undefined;
    try {
        current_value_142 = json_config['tools']['ghdl']['vpi_trace_file'];
    }
    catch(e){}
    if (typeof current_value_142 === 'string'){
        default_config['tools']['ghdl']['vpi_trace_file'] = current_value_142;
    }
            
    // tools -> ghdl -> vhpi_trace_file
    let current_value_143 = undefined;
    try {
        current_value_143 = json_config['tools']['ghdl']['vhpi_trace_file'];
    }
    catch(e){}
    if (typeof current_value_143 === 'string'){
        default_config['tools']['ghdl']['vhpi_trace_file'] = current_value_143;
    }
            
    // tools -> ghdl -> psl_report_file
    let current_value_144 = undefined;
    try {
        current_value_144 = json_config['tools']['ghdl']['psl_report_file'];
    }
    catch(e){}
    if (typeof current_value_144 === 'string'){
        default_config['tools']['ghdl']['psl_report_file'] = current_value_144;
    }
            
    // tools -> ghdl -> psl_report_uncovered
    let current_value_145 = undefined;
    try {
        current_value_145 = json_config['tools']['ghdl']['psl_report_uncovered'];
    }
    catch(e){}
    if (current_value_145 === true || current_value_145 === false){
        default_config['tools']['ghdl']['psl_report_uncovered'] = current_value_145;
    }
            
    // tools -> ghdl -> disp_tree
    let current_value_146 = undefined;
    try {
        current_value_146 = json_config['tools']['ghdl']['disp_tree'];
    }
    catch(e){}
    if ( current_value_146 === "none"){
        default_config['tools']['ghdl']['disp_tree'] = e_tools_ghdl_disp_tree.none;
    }
    if ( current_value_146 === "inst"){
        default_config['tools']['ghdl']['disp_tree'] = e_tools_ghdl_disp_tree.inst;
    }
    if ( current_value_146 === "proc"){
        default_config['tools']['ghdl']['disp_tree'] = e_tools_ghdl_disp_tree.proc;
    }
    if ( current_value_146 === "port"){
        default_config['tools']['ghdl']['disp_tree'] = e_tools_ghdl_disp_tree.port;
    }
            
    // tools -> ghdl -> no_run
    let current_value_147 = undefined;
    try {
        current_value_147 = json_config['tools']['ghdl']['no_run'];
    }
    catch(e){}
    if (current_value_147 === true || current_value_147 === false){
        default_config['tools']['ghdl']['no_run'] = current_value_147;
    }
            
    // tools -> icarus -> installation_path
    let current_value_148 = undefined;
    try {
        current_value_148 = json_config['tools']['icarus']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_148 === 'string'){
        default_config['tools']['icarus']['installation_path'] = current_value_148;
    }
            
    // tools -> icarus -> timescale
    let current_value_149 = undefined;
    try {
        current_value_149 = json_config['tools']['icarus']['timescale'];
    }
    catch(e){}
    if (typeof current_value_149 === 'string'){
        default_config['tools']['icarus']['timescale'] = current_value_149;
    }
            
    // tools -> icarus -> iverilog_options
    let current_value_150 = undefined;
    try {
        current_value_150 = json_config['tools']['icarus']['iverilog_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_150)){
        default_config['tools']['icarus']['iverilog_options'] = current_value_150;
    }
            
    // tools -> icestorm -> installation_path
    let current_value_151 = undefined;
    try {
        current_value_151 = json_config['tools']['icestorm']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_151 === 'string'){
        default_config['tools']['icestorm']['installation_path'] = current_value_151;
    }
            
    // tools -> icestorm -> pnr
    let current_value_152 = undefined;
    try {
        current_value_152 = json_config['tools']['icestorm']['pnr'];
    }
    catch(e){}
    if ( current_value_152 === "arachne"){
        default_config['tools']['icestorm']['pnr'] = e_tools_icestorm_pnr.arachne;
    }
    if ( current_value_152 === "next"){
        default_config['tools']['icestorm']['pnr'] = e_tools_icestorm_pnr.next;
    }
    if ( current_value_152 === "none"){
        default_config['tools']['icestorm']['pnr'] = e_tools_icestorm_pnr.none;
    }
            
    // tools -> icestorm -> arch
    let current_value_153 = undefined;
    try {
        current_value_153 = json_config['tools']['icestorm']['arch'];
    }
    catch(e){}
    if ( current_value_153 === "xilinx"){
        default_config['tools']['icestorm']['arch'] = e_tools_icestorm_arch.xilinx;
    }
    if ( current_value_153 === "ice40"){
        default_config['tools']['icestorm']['arch'] = e_tools_icestorm_arch.ice40;
    }
    if ( current_value_153 === "ecp5"){
        default_config['tools']['icestorm']['arch'] = e_tools_icestorm_arch.ecp5;
    }
            
    // tools -> icestorm -> output_format
    let current_value_154 = undefined;
    try {
        current_value_154 = json_config['tools']['icestorm']['output_format'];
    }
    catch(e){}
    if ( current_value_154 === "json"){
        default_config['tools']['icestorm']['output_format'] = e_tools_icestorm_output_format.json;
    }
    if ( current_value_154 === "edif"){
        default_config['tools']['icestorm']['output_format'] = e_tools_icestorm_output_format.edif;
    }
    if ( current_value_154 === "blif"){
        default_config['tools']['icestorm']['output_format'] = e_tools_icestorm_output_format.blif;
    }
            
    // tools -> icestorm -> yosys_as_subtool
    let current_value_155 = undefined;
    try {
        current_value_155 = json_config['tools']['icestorm']['yosys_as_subtool'];
    }
    catch(e){}
    if (current_value_155 === true || current_value_155 === false){
        default_config['tools']['icestorm']['yosys_as_subtool'] = current_value_155;
    }
            
    // tools -> icestorm -> makefile_name
    let current_value_156 = undefined;
    try {
        current_value_156 = json_config['tools']['icestorm']['makefile_name'];
    }
    catch(e){}
    if (typeof current_value_156 === 'string'){
        default_config['tools']['icestorm']['makefile_name'] = current_value_156;
    }
            
    // tools -> icestorm -> arachne_pnr_options
    let current_value_157 = undefined;
    try {
        current_value_157 = json_config['tools']['icestorm']['arachne_pnr_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_157)){
        default_config['tools']['icestorm']['arachne_pnr_options'] = current_value_157;
    }
            
    // tools -> icestorm -> nextpnr_options
    let current_value_158 = undefined;
    try {
        current_value_158 = json_config['tools']['icestorm']['nextpnr_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_158)){
        default_config['tools']['icestorm']['nextpnr_options'] = current_value_158;
    }
            
    // tools -> icestorm -> yosys_synth_options
    let current_value_159 = undefined;
    try {
        current_value_159 = json_config['tools']['icestorm']['yosys_synth_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_159)){
        default_config['tools']['icestorm']['yosys_synth_options'] = current_value_159;
    }
            
    // tools -> ise -> installation_path
    let current_value_160 = undefined;
    try {
        current_value_160 = json_config['tools']['ise']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_160 === 'string'){
        default_config['tools']['ise']['installation_path'] = current_value_160;
    }
            
    // tools -> ise -> family
    let current_value_161 = undefined;
    try {
        current_value_161 = json_config['tools']['ise']['family'];
    }
    catch(e){}
    if (typeof current_value_161 === 'string'){
        default_config['tools']['ise']['family'] = current_value_161;
    }
            
    // tools -> ise -> device
    let current_value_162 = undefined;
    try {
        current_value_162 = json_config['tools']['ise']['device'];
    }
    catch(e){}
    if (typeof current_value_162 === 'string'){
        default_config['tools']['ise']['device'] = current_value_162;
    }
            
    // tools -> ise -> package
    let current_value_163 = undefined;
    try {
        current_value_163 = json_config['tools']['ise']['package'];
    }
    catch(e){}
    if (typeof current_value_163 === 'string'){
        default_config['tools']['ise']['package'] = current_value_163;
    }
            
    // tools -> ise -> speed
    let current_value_164 = undefined;
    try {
        current_value_164 = json_config['tools']['ise']['speed'];
    }
    catch(e){}
    if (typeof current_value_164 === 'string'){
        default_config['tools']['ise']['speed'] = current_value_164;
    }
            
    // tools -> isem -> installation_path
    let current_value_165 = undefined;
    try {
        current_value_165 = json_config['tools']['isem']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_165 === 'string'){
        default_config['tools']['isem']['installation_path'] = current_value_165;
    }
            
    // tools -> isem -> fuse_options
    let current_value_166 = undefined;
    try {
        current_value_166 = json_config['tools']['isem']['fuse_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_166)){
        default_config['tools']['isem']['fuse_options'] = current_value_166;
    }
            
    // tools -> isem -> isim_options
    let current_value_167 = undefined;
    try {
        current_value_167 = json_config['tools']['isem']['isim_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_167)){
        default_config['tools']['isem']['isim_options'] = current_value_167;
    }
            
    // tools -> modelsim -> installation_path
    let current_value_168 = undefined;
    try {
        current_value_168 = json_config['tools']['modelsim']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_168 === 'string'){
        default_config['tools']['modelsim']['installation_path'] = current_value_168;
    }
            
    // tools -> modelsim -> vcom_options
    let current_value_169 = undefined;
    try {
        current_value_169 = json_config['tools']['modelsim']['vcom_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_169)){
        default_config['tools']['modelsim']['vcom_options'] = current_value_169;
    }
            
    // tools -> modelsim -> vlog_options
    let current_value_170 = undefined;
    try {
        current_value_170 = json_config['tools']['modelsim']['vlog_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_170)){
        default_config['tools']['modelsim']['vlog_options'] = current_value_170;
    }
            
    // tools -> modelsim -> vsim_options
    let current_value_171 = undefined;
    try {
        current_value_171 = json_config['tools']['modelsim']['vsim_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_171)){
        default_config['tools']['modelsim']['vsim_options'] = current_value_171;
    }
            
    // tools -> morty -> installation_path
    let current_value_172 = undefined;
    try {
        current_value_172 = json_config['tools']['morty']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_172 === 'string'){
        default_config['tools']['morty']['installation_path'] = current_value_172;
    }
            
    // tools -> morty -> morty_options
    let current_value_173 = undefined;
    try {
        current_value_173 = json_config['tools']['morty']['morty_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_173)){
        default_config['tools']['morty']['morty_options'] = current_value_173;
    }
            
    // tools -> radiant -> installation_path
    let current_value_174 = undefined;
    try {
        current_value_174 = json_config['tools']['radiant']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_174 === 'string'){
        default_config['tools']['radiant']['installation_path'] = current_value_174;
    }
            
    // tools -> radiant -> part
    let current_value_175 = undefined;
    try {
        current_value_175 = json_config['tools']['radiant']['part'];
    }
    catch(e){}
    if (typeof current_value_175 === 'string'){
        default_config['tools']['radiant']['part'] = current_value_175;
    }
            
    // tools -> rivierapro -> installation_path
    let current_value_176 = undefined;
    try {
        current_value_176 = json_config['tools']['rivierapro']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_176 === 'string'){
        default_config['tools']['rivierapro']['installation_path'] = current_value_176;
    }
            
    // tools -> rivierapro -> compilation_mode
    let current_value_177 = undefined;
    try {
        current_value_177 = json_config['tools']['rivierapro']['compilation_mode'];
    }
    catch(e){}
    if (typeof current_value_177 === 'string'){
        default_config['tools']['rivierapro']['compilation_mode'] = current_value_177;
    }
            
    // tools -> rivierapro -> vlog_options
    let current_value_178 = undefined;
    try {
        current_value_178 = json_config['tools']['rivierapro']['vlog_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_178)){
        default_config['tools']['rivierapro']['vlog_options'] = current_value_178;
    }
            
    // tools -> rivierapro -> vsim_options
    let current_value_179 = undefined;
    try {
        current_value_179 = json_config['tools']['rivierapro']['vsim_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_179)){
        default_config['tools']['rivierapro']['vsim_options'] = current_value_179;
    }
            
    // tools -> siliconcompiler -> installation_path
    let current_value_180 = undefined;
    try {
        current_value_180 = json_config['tools']['siliconcompiler']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_180 === 'string'){
        default_config['tools']['siliconcompiler']['installation_path'] = current_value_180;
    }
            
    // tools -> siliconcompiler -> target
    let current_value_181 = undefined;
    try {
        current_value_181 = json_config['tools']['siliconcompiler']['target'];
    }
    catch(e){}
    if (typeof current_value_181 === 'string'){
        default_config['tools']['siliconcompiler']['target'] = current_value_181;
    }
            
    // tools -> siliconcompiler -> server_enable
    let current_value_182 = undefined;
    try {
        current_value_182 = json_config['tools']['siliconcompiler']['server_enable'];
    }
    catch(e){}
    if (current_value_182 === true || current_value_182 === false){
        default_config['tools']['siliconcompiler']['server_enable'] = current_value_182;
    }
            
    // tools -> siliconcompiler -> server_address
    let current_value_183 = undefined;
    try {
        current_value_183 = json_config['tools']['siliconcompiler']['server_address'];
    }
    catch(e){}
    if (typeof current_value_183 === 'string'){
        default_config['tools']['siliconcompiler']['server_address'] = current_value_183;
    }
            
    // tools -> siliconcompiler -> server_username
    let current_value_184 = undefined;
    try {
        current_value_184 = json_config['tools']['siliconcompiler']['server_username'];
    }
    catch(e){}
    if (typeof current_value_184 === 'string'){
        default_config['tools']['siliconcompiler']['server_username'] = current_value_184;
    }
            
    // tools -> siliconcompiler -> server_password
    let current_value_185 = undefined;
    try {
        current_value_185 = json_config['tools']['siliconcompiler']['server_password'];
    }
    catch(e){}
    if (typeof current_value_185 === 'string'){
        default_config['tools']['siliconcompiler']['server_password'] = current_value_185;
    }
            
    // tools -> spyglass -> installation_path
    let current_value_186 = undefined;
    try {
        current_value_186 = json_config['tools']['spyglass']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_186 === 'string'){
        default_config['tools']['spyglass']['installation_path'] = current_value_186;
    }
            
    // tools -> spyglass -> methodology
    let current_value_187 = undefined;
    try {
        current_value_187 = json_config['tools']['spyglass']['methodology'];
    }
    catch(e){}
    if (typeof current_value_187 === 'string'){
        default_config['tools']['spyglass']['methodology'] = current_value_187;
    }
            
    // tools -> spyglass -> goals
    let current_value_188 = undefined;
    try {
        current_value_188 = json_config['tools']['spyglass']['goals'];
    }
    catch(e){}
    if (Array.isArray(current_value_188)){
        default_config['tools']['spyglass']['goals'] = current_value_188;
    }
            
    // tools -> spyglass -> spyglass_options
    let current_value_189 = undefined;
    try {
        current_value_189 = json_config['tools']['spyglass']['spyglass_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_189)){
        default_config['tools']['spyglass']['spyglass_options'] = current_value_189;
    }
            
    // tools -> spyglass -> rule_parameters
    let current_value_190 = undefined;
    try {
        current_value_190 = json_config['tools']['spyglass']['rule_parameters'];
    }
    catch(e){}
    if (Array.isArray(current_value_190)){
        default_config['tools']['spyglass']['rule_parameters'] = current_value_190;
    }
            
    // tools -> symbiyosys -> installation_path
    let current_value_191 = undefined;
    try {
        current_value_191 = json_config['tools']['symbiyosys']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_191 === 'string'){
        default_config['tools']['symbiyosys']['installation_path'] = current_value_191;
    }
            
    // tools -> symbiyosys -> tasknames
    let current_value_192 = undefined;
    try {
        current_value_192 = json_config['tools']['symbiyosys']['tasknames'];
    }
    catch(e){}
    if (Array.isArray(current_value_192)){
        default_config['tools']['symbiyosys']['tasknames'] = current_value_192;
    }
            
    // tools -> symbiflow -> installation_path
    let current_value_193 = undefined;
    try {
        current_value_193 = json_config['tools']['symbiflow']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_193 === 'string'){
        default_config['tools']['symbiflow']['installation_path'] = current_value_193;
    }
            
    // tools -> symbiflow -> package
    let current_value_194 = undefined;
    try {
        current_value_194 = json_config['tools']['symbiflow']['package'];
    }
    catch(e){}
    if (typeof current_value_194 === 'string'){
        default_config['tools']['symbiflow']['package'] = current_value_194;
    }
            
    // tools -> symbiflow -> part
    let current_value_195 = undefined;
    try {
        current_value_195 = json_config['tools']['symbiflow']['part'];
    }
    catch(e){}
    if (typeof current_value_195 === 'string'){
        default_config['tools']['symbiflow']['part'] = current_value_195;
    }
            
    // tools -> symbiflow -> vendor
    let current_value_196 = undefined;
    try {
        current_value_196 = json_config['tools']['symbiflow']['vendor'];
    }
    catch(e){}
    if (typeof current_value_196 === 'string'){
        default_config['tools']['symbiflow']['vendor'] = current_value_196;
    }
            
    // tools -> symbiflow -> pnr
    let current_value_197 = undefined;
    try {
        current_value_197 = json_config['tools']['symbiflow']['pnr'];
    }
    catch(e){}
    if ( current_value_197 === "vpr"){
        default_config['tools']['symbiflow']['pnr'] = e_tools_symbiflow_pnr.vpr;
    }
            
    // tools -> symbiflow -> vpr_options
    let current_value_198 = undefined;
    try {
        current_value_198 = json_config['tools']['symbiflow']['vpr_options'];
    }
    catch(e){}
    if (typeof current_value_198 === 'string'){
        default_config['tools']['symbiflow']['vpr_options'] = current_value_198;
    }
            
    // tools -> symbiflow -> environment_script
    let current_value_199 = undefined;
    try {
        current_value_199 = json_config['tools']['symbiflow']['environment_script'];
    }
    catch(e){}
    if (typeof current_value_199 === 'string'){
        default_config['tools']['symbiflow']['environment_script'] = current_value_199;
    }
            
    // tools -> trellis -> installation_path
    let current_value_200 = undefined;
    try {
        current_value_200 = json_config['tools']['trellis']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_200 === 'string'){
        default_config['tools']['trellis']['installation_path'] = current_value_200;
    }
            
    // tools -> trellis -> arch
    let current_value_201 = undefined;
    try {
        current_value_201 = json_config['tools']['trellis']['arch'];
    }
    catch(e){}
    if ( current_value_201 === "xilinx"){
        default_config['tools']['trellis']['arch'] = e_tools_trellis_arch.xilinx;
    }
    if ( current_value_201 === "ice40"){
        default_config['tools']['trellis']['arch'] = e_tools_trellis_arch.ice40;
    }
    if ( current_value_201 === "ecp5"){
        default_config['tools']['trellis']['arch'] = e_tools_trellis_arch.ecp5;
    }
            
    // tools -> trellis -> output_format
    let current_value_202 = undefined;
    try {
        current_value_202 = json_config['tools']['trellis']['output_format'];
    }
    catch(e){}
    if ( current_value_202 === "json"){
        default_config['tools']['trellis']['output_format'] = e_tools_trellis_output_format.json;
    }
    if ( current_value_202 === "edif"){
        default_config['tools']['trellis']['output_format'] = e_tools_trellis_output_format.edif;
    }
    if ( current_value_202 === "blif"){
        default_config['tools']['trellis']['output_format'] = e_tools_trellis_output_format.blif;
    }
            
    // tools -> trellis -> yosys_as_subtool
    let current_value_203 = undefined;
    try {
        current_value_203 = json_config['tools']['trellis']['yosys_as_subtool'];
    }
    catch(e){}
    if (current_value_203 === true || current_value_203 === false){
        default_config['tools']['trellis']['yosys_as_subtool'] = current_value_203;
    }
            
    // tools -> trellis -> makefile_name
    let current_value_204 = undefined;
    try {
        current_value_204 = json_config['tools']['trellis']['makefile_name'];
    }
    catch(e){}
    if (typeof current_value_204 === 'string'){
        default_config['tools']['trellis']['makefile_name'] = current_value_204;
    }
            
    // tools -> trellis -> script_name
    let current_value_205 = undefined;
    try {
        current_value_205 = json_config['tools']['trellis']['script_name'];
    }
    catch(e){}
    if (typeof current_value_205 === 'string'){
        default_config['tools']['trellis']['script_name'] = current_value_205;
    }
            
    // tools -> trellis -> nextpnr_options
    let current_value_206 = undefined;
    try {
        current_value_206 = json_config['tools']['trellis']['nextpnr_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_206)){
        default_config['tools']['trellis']['nextpnr_options'] = current_value_206;
    }
            
    // tools -> trellis -> yosys_synth_options
    let current_value_207 = undefined;
    try {
        current_value_207 = json_config['tools']['trellis']['yosys_synth_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_207)){
        default_config['tools']['trellis']['yosys_synth_options'] = current_value_207;
    }
            
    // tools -> vcs -> installation_path
    let current_value_208 = undefined;
    try {
        current_value_208 = json_config['tools']['vcs']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_208 === 'string'){
        default_config['tools']['vcs']['installation_path'] = current_value_208;
    }
            
    // tools -> vcs -> vcs_options
    let current_value_209 = undefined;
    try {
        current_value_209 = json_config['tools']['vcs']['vcs_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_209)){
        default_config['tools']['vcs']['vcs_options'] = current_value_209;
    }
            
    // tools -> vcs -> run_options
    let current_value_210 = undefined;
    try {
        current_value_210 = json_config['tools']['vcs']['run_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_210)){
        default_config['tools']['vcs']['run_options'] = current_value_210;
    }
            
    // tools -> verible -> installation_path
    let current_value_211 = undefined;
    try {
        current_value_211 = json_config['tools']['verible']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_211 === 'string'){
        default_config['tools']['verible']['installation_path'] = current_value_211;
    }
            
    // tools -> verilator -> installation_path
    let current_value_212 = undefined;
    try {
        current_value_212 = json_config['tools']['verilator']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_212 === 'string'){
        default_config['tools']['verilator']['installation_path'] = current_value_212;
    }
            
    // tools -> verilator -> mode
    let current_value_213 = undefined;
    try {
        current_value_213 = json_config['tools']['verilator']['mode'];
    }
    catch(e){}
    if ( current_value_213 === "cc"){
        default_config['tools']['verilator']['mode'] = e_tools_verilator_mode.cc;
    }
    if ( current_value_213 === "sc"){
        default_config['tools']['verilator']['mode'] = e_tools_verilator_mode.sc;
    }
    if ( current_value_213 === "lint-only"){
        default_config['tools']['verilator']['mode'] = e_tools_verilator_mode.lint_only;
    }
            
    // tools -> verilator -> libs
    let current_value_214 = undefined;
    try {
        current_value_214 = json_config['tools']['verilator']['libs'];
    }
    catch(e){}
    if (Array.isArray(current_value_214)){
        default_config['tools']['verilator']['libs'] = current_value_214;
    }
            
    // tools -> verilator -> verilator_options
    let current_value_215 = undefined;
    try {
        current_value_215 = json_config['tools']['verilator']['verilator_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_215)){
        default_config['tools']['verilator']['verilator_options'] = current_value_215;
    }
            
    // tools -> verilator -> make_options
    let current_value_216 = undefined;
    try {
        current_value_216 = json_config['tools']['verilator']['make_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_216)){
        default_config['tools']['verilator']['make_options'] = current_value_216;
    }
            
    // tools -> verilator -> run_options
    let current_value_217 = undefined;
    try {
        current_value_217 = json_config['tools']['verilator']['run_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_217)){
        default_config['tools']['verilator']['run_options'] = current_value_217;
    }
            
    // tools -> vivado -> installation_path
    let current_value_218 = undefined;
    try {
        current_value_218 = json_config['tools']['vivado']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_218 === 'string'){
        default_config['tools']['vivado']['installation_path'] = current_value_218;
    }
            
    // tools -> vivado -> part
    let current_value_219 = undefined;
    try {
        current_value_219 = json_config['tools']['vivado']['part'];
    }
    catch(e){}
    if (typeof current_value_219 === 'string'){
        default_config['tools']['vivado']['part'] = current_value_219;
    }
            
    // tools -> vivado -> synth
    let current_value_220 = undefined;
    try {
        current_value_220 = json_config['tools']['vivado']['synth'];
    }
    catch(e){}
    if ( current_value_220 === "vivado"){
        default_config['tools']['vivado']['synth'] = e_tools_vivado_synth.vivado;
    }
    if ( current_value_220 === "yosys"){
        default_config['tools']['vivado']['synth'] = e_tools_vivado_synth.yosys;
    }
            
    // tools -> vivado -> pnr
    let current_value_221 = undefined;
    try {
        current_value_221 = json_config['tools']['vivado']['pnr'];
    }
    catch(e){}
    if ( current_value_221 === "vivado"){
        default_config['tools']['vivado']['pnr'] = e_tools_vivado_pnr.vivado;
    }
    if ( current_value_221 === "none"){
        default_config['tools']['vivado']['pnr'] = e_tools_vivado_pnr.none;
    }
            
    // tools -> vivado -> jtag_freq
    let current_value_222 = undefined;
    try {
        current_value_222 = json_config['tools']['vivado']['jtag_freq'];
    }
    catch(e){}
    if (typeof current_value_222 === 'number'){
        default_config['tools']['vivado']['jtag_freq'] = current_value_222;
    }
            
    // tools -> vivado -> hw_target
    let current_value_223 = undefined;
    try {
        current_value_223 = json_config['tools']['vivado']['hw_target'];
    }
    catch(e){}
    if (typeof current_value_223 === 'string'){
        default_config['tools']['vivado']['hw_target'] = current_value_223;
    }
            
    // tools -> vunit -> installation_path
    let current_value_224 = undefined;
    try {
        current_value_224 = json_config['tools']['vunit']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_224 === 'string'){
        default_config['tools']['vunit']['installation_path'] = current_value_224;
    }
            
    // tools -> vunit -> simulator_name
    let current_value_225 = undefined;
    try {
        current_value_225 = json_config['tools']['vunit']['simulator_name'];
    }
    catch(e){}
    if ( current_value_225 === "rivierapro"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.rivierapro;
    }
    if ( current_value_225 === "activehdl"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.activehdl;
    }
    if ( current_value_225 === "ghdl"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.ghdl;
    }
    if ( current_value_225 === "modelsim"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.modelsim;
    }
    if ( current_value_225 === "xsim"){
        default_config['tools']['vunit']['simulator_name'] = e_tools_vunit_simulator_name.xsim;
    }
            
    // tools -> vunit -> runpy_mode
    let current_value_226 = undefined;
    try {
        current_value_226 = json_config['tools']['vunit']['runpy_mode'];
    }
    catch(e){}
    if ( current_value_226 === "standalone"){
        default_config['tools']['vunit']['runpy_mode'] = e_tools_vunit_runpy_mode.standalone;
    }
    if ( current_value_226 === "creation"){
        default_config['tools']['vunit']['runpy_mode'] = e_tools_vunit_runpy_mode.creation;
    }
            
    // tools -> vunit -> extra_options
    let current_value_227 = undefined;
    try {
        current_value_227 = json_config['tools']['vunit']['extra_options'];
    }
    catch(e){}
    if (typeof current_value_227 === 'string'){
        default_config['tools']['vunit']['extra_options'] = current_value_227;
    }
            
    // tools -> vunit -> enable_array_util_lib
    let current_value_228 = undefined;
    try {
        current_value_228 = json_config['tools']['vunit']['enable_array_util_lib'];
    }
    catch(e){}
    if (current_value_228 === true || current_value_228 === false){
        default_config['tools']['vunit']['enable_array_util_lib'] = current_value_228;
    }
            
    // tools -> vunit -> enable_com_lib
    let current_value_229 = undefined;
    try {
        current_value_229 = json_config['tools']['vunit']['enable_com_lib'];
    }
    catch(e){}
    if (current_value_229 === true || current_value_229 === false){
        default_config['tools']['vunit']['enable_com_lib'] = current_value_229;
    }
            
    // tools -> vunit -> enable_json4vhdl_lib
    let current_value_230 = undefined;
    try {
        current_value_230 = json_config['tools']['vunit']['enable_json4vhdl_lib'];
    }
    catch(e){}
    if (current_value_230 === true || current_value_230 === false){
        default_config['tools']['vunit']['enable_json4vhdl_lib'] = current_value_230;
    }
            
    // tools -> vunit -> enable_osvvm_lib
    let current_value_231 = undefined;
    try {
        current_value_231 = json_config['tools']['vunit']['enable_osvvm_lib'];
    }
    catch(e){}
    if (current_value_231 === true || current_value_231 === false){
        default_config['tools']['vunit']['enable_osvvm_lib'] = current_value_231;
    }
            
    // tools -> vunit -> enable_random_lib
    let current_value_232 = undefined;
    try {
        current_value_232 = json_config['tools']['vunit']['enable_random_lib'];
    }
    catch(e){}
    if (current_value_232 === true || current_value_232 === false){
        default_config['tools']['vunit']['enable_random_lib'] = current_value_232;
    }
            
    // tools -> vunit -> enable_verification_components_lib
    let current_value_233 = undefined;
    try {
        current_value_233 = json_config['tools']['vunit']['enable_verification_components_lib'];
    }
    catch(e){}
    if (current_value_233 === true || current_value_233 === false){
        default_config['tools']['vunit']['enable_verification_components_lib'] = current_value_233;
    }
            
    // tools -> xcelium -> installation_path
    let current_value_234 = undefined;
    try {
        current_value_234 = json_config['tools']['xcelium']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_234 === 'string'){
        default_config['tools']['xcelium']['installation_path'] = current_value_234;
    }
            
    // tools -> xcelium -> xmvhdl_options
    let current_value_235 = undefined;
    try {
        current_value_235 = json_config['tools']['xcelium']['xmvhdl_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_235)){
        default_config['tools']['xcelium']['xmvhdl_options'] = current_value_235;
    }
            
    // tools -> xcelium -> xmvlog_options
    let current_value_236 = undefined;
    try {
        current_value_236 = json_config['tools']['xcelium']['xmvlog_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_236)){
        default_config['tools']['xcelium']['xmvlog_options'] = current_value_236;
    }
            
    // tools -> xcelium -> xmsim_options
    let current_value_237 = undefined;
    try {
        current_value_237 = json_config['tools']['xcelium']['xmsim_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_237)){
        default_config['tools']['xcelium']['xmsim_options'] = current_value_237;
    }
            
    // tools -> xcelium -> xrun_options
    let current_value_238 = undefined;
    try {
        current_value_238 = json_config['tools']['xcelium']['xrun_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_238)){
        default_config['tools']['xcelium']['xrun_options'] = current_value_238;
    }
            
    // tools -> xsim -> installation_path
    let current_value_239 = undefined;
    try {
        current_value_239 = json_config['tools']['xsim']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_239 === 'string'){
        default_config['tools']['xsim']['installation_path'] = current_value_239;
    }
            
    // tools -> xsim -> xelab_options
    let current_value_240 = undefined;
    try {
        current_value_240 = json_config['tools']['xsim']['xelab_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_240)){
        default_config['tools']['xsim']['xelab_options'] = current_value_240;
    }
            
    // tools -> xsim -> xsim_options
    let current_value_241 = undefined;
    try {
        current_value_241 = json_config['tools']['xsim']['xsim_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_241)){
        default_config['tools']['xsim']['xsim_options'] = current_value_241;
    }
            
    // tools -> yosys -> installation_path
    let current_value_242 = undefined;
    try {
        current_value_242 = json_config['tools']['yosys']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_242 === 'string'){
        default_config['tools']['yosys']['installation_path'] = current_value_242;
    }
            
    // tools -> yosys -> read_verilog_options
    let current_value_243 = undefined;
    try {
        current_value_243 = json_config['tools']['yosys']['read_verilog_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_243)){
        default_config['tools']['yosys']['read_verilog_options'] = current_value_243;
    }
            
    // tools -> yosys -> read_systemverilog_options
    let current_value_244 = undefined;
    try {
        current_value_244 = json_config['tools']['yosys']['read_systemverilog_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_244)){
        default_config['tools']['yosys']['read_systemverilog_options'] = current_value_244;
    }
            
    // tools -> yosys -> read_liberty_options
    let current_value_245 = undefined;
    try {
        current_value_245 = json_config['tools']['yosys']['read_liberty_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_245)){
        default_config['tools']['yosys']['read_liberty_options'] = current_value_245;
    }
            
    // tools -> yosys -> hierarchy_options
    let current_value_246 = undefined;
    try {
        current_value_246 = json_config['tools']['yosys']['hierarchy_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_246)){
        default_config['tools']['yosys']['hierarchy_options'] = current_value_246;
    }
            
    // tools -> yosys -> proc_options
    let current_value_247 = undefined;
    try {
        current_value_247 = json_config['tools']['yosys']['proc_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_247)){
        default_config['tools']['yosys']['proc_options'] = current_value_247;
    }
            
    // tools -> yosys -> opt_options
    let current_value_248 = undefined;
    try {
        current_value_248 = json_config['tools']['yosys']['opt_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_248)){
        default_config['tools']['yosys']['opt_options'] = current_value_248;
    }
            
    // tools -> yosys -> flatten_enabled
    let current_value_249 = undefined;
    try {
        current_value_249 = json_config['tools']['yosys']['flatten_enabled'];
    }
    catch(e){}
    if (current_value_249 === true || current_value_249 === false){
        default_config['tools']['yosys']['flatten_enabled'] = current_value_249;
    }
            
    // tools -> yosys -> flatten_options
    let current_value_250 = undefined;
    try {
        current_value_250 = json_config['tools']['yosys']['flatten_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_250)){
        default_config['tools']['yosys']['flatten_options'] = current_value_250;
    }
            
    // tools -> yosys -> memory_options
    let current_value_251 = undefined;
    try {
        current_value_251 = json_config['tools']['yosys']['memory_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_251)){
        default_config['tools']['yosys']['memory_options'] = current_value_251;
    }
            
    // tools -> yosys -> fsm_enabled
    let current_value_252 = undefined;
    try {
        current_value_252 = json_config['tools']['yosys']['fsm_enabled'];
    }
    catch(e){}
    if (current_value_252 === true || current_value_252 === false){
        default_config['tools']['yosys']['fsm_enabled'] = current_value_252;
    }
            
    // tools -> yosys -> fsm_options
    let current_value_253 = undefined;
    try {
        current_value_253 = json_config['tools']['yosys']['fsm_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_253)){
        default_config['tools']['yosys']['fsm_options'] = current_value_253;
    }
            
    // tools -> yosys -> techmap_enabled
    let current_value_254 = undefined;
    try {
        current_value_254 = json_config['tools']['yosys']['techmap_enabled'];
    }
    catch(e){}
    if (current_value_254 === true || current_value_254 === false){
        default_config['tools']['yosys']['techmap_enabled'] = current_value_254;
    }
            
    // tools -> yosys -> techmap_options
    let current_value_255 = undefined;
    try {
        current_value_255 = json_config['tools']['yosys']['techmap_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_255)){
        default_config['tools']['yosys']['techmap_options'] = current_value_255;
    }
            
    // tools -> yosys -> abc_enabled
    let current_value_256 = undefined;
    try {
        current_value_256 = json_config['tools']['yosys']['abc_enabled'];
    }
    catch(e){}
    if (current_value_256 === true || current_value_256 === false){
        default_config['tools']['yosys']['abc_enabled'] = current_value_256;
    }
            
    // tools -> yosys -> abc_options
    let current_value_257 = undefined;
    try {
        current_value_257 = json_config['tools']['yosys']['abc_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_257)){
        default_config['tools']['yosys']['abc_options'] = current_value_257;
    }
            
    // tools -> yosys -> synthesis_target
    let current_value_258 = undefined;
    try {
        current_value_258 = json_config['tools']['yosys']['synthesis_target'];
    }
    catch(e){}
    if ( current_value_258 === "ice40"){
        default_config['tools']['yosys']['synthesis_target'] = e_tools_yosys_synthesis_target.ice40;
    }
    if ( current_value_258 === "ecp5"){
        default_config['tools']['yosys']['synthesis_target'] = e_tools_yosys_synthesis_target.ecp5;
    }
            
    // tools -> yosys -> ice40_device
    let current_value_259 = undefined;
    try {
        current_value_259 = json_config['tools']['yosys']['ice40_device'];
    }
    catch(e){}
    if ( current_value_259 === "hx"){
        default_config['tools']['yosys']['ice40_device'] = e_tools_yosys_ice40_device.hx;
    }
    if ( current_value_259 === "lp"){
        default_config['tools']['yosys']['ice40_device'] = e_tools_yosys_ice40_device.lp;
    }
    if ( current_value_259 === "u"){
        default_config['tools']['yosys']['ice40_device'] = e_tools_yosys_ice40_device.u;
    }
            
    // tools -> yosys -> ice40_top_module
    let current_value_260 = undefined;
    try {
        current_value_260 = json_config['tools']['yosys']['ice40_top_module'];
    }
    catch(e){}
    if (typeof current_value_260 === 'string'){
        default_config['tools']['yosys']['ice40_top_module'] = current_value_260;
    }
            
    // tools -> yosys -> ice40_output_blif
    let current_value_261 = undefined;
    try {
        current_value_261 = json_config['tools']['yosys']['ice40_output_blif'];
    }
    catch(e){}
    if (typeof current_value_261 === 'string'){
        default_config['tools']['yosys']['ice40_output_blif'] = current_value_261;
    }
            
    // tools -> yosys -> ice40_output_edif
    let current_value_262 = undefined;
    try {
        current_value_262 = json_config['tools']['yosys']['ice40_output_edif'];
    }
    catch(e){}
    if (typeof current_value_262 === 'string'){
        default_config['tools']['yosys']['ice40_output_edif'] = current_value_262;
    }
            
    // tools -> yosys -> ice40_output_json
    let current_value_263 = undefined;
    try {
        current_value_263 = json_config['tools']['yosys']['ice40_output_json'];
    }
    catch(e){}
    if (typeof current_value_263 === 'string'){
        default_config['tools']['yosys']['ice40_output_json'] = current_value_263;
    }
            
    // tools -> yosys -> ice40_noflatten
    let current_value_264 = undefined;
    try {
        current_value_264 = json_config['tools']['yosys']['ice40_noflatten'];
    }
    catch(e){}
    if (current_value_264 === true || current_value_264 === false){
        default_config['tools']['yosys']['ice40_noflatten'] = current_value_264;
    }
            
    // tools -> yosys -> ice40_dff
    let current_value_265 = undefined;
    try {
        current_value_265 = json_config['tools']['yosys']['ice40_dff'];
    }
    catch(e){}
    if (current_value_265 === true || current_value_265 === false){
        default_config['tools']['yosys']['ice40_dff'] = current_value_265;
    }
            
    // tools -> yosys -> ice40_retime
    let current_value_266 = undefined;
    try {
        current_value_266 = json_config['tools']['yosys']['ice40_retime'];
    }
    catch(e){}
    if (current_value_266 === true || current_value_266 === false){
        default_config['tools']['yosys']['ice40_retime'] = current_value_266;
    }
            
    // tools -> yosys -> ice40_nocarry
    let current_value_267 = undefined;
    try {
        current_value_267 = json_config['tools']['yosys']['ice40_nocarry'];
    }
    catch(e){}
    if (current_value_267 === true || current_value_267 === false){
        default_config['tools']['yosys']['ice40_nocarry'] = current_value_267;
    }
            
    // tools -> yosys -> ice40_nodffe
    let current_value_268 = undefined;
    try {
        current_value_268 = json_config['tools']['yosys']['ice40_nodffe'];
    }
    catch(e){}
    if (current_value_268 === true || current_value_268 === false){
        default_config['tools']['yosys']['ice40_nodffe'] = current_value_268;
    }
            
    // tools -> yosys -> ice40_dffe_min_ce_use
    let current_value_269 = undefined;
    try {
        current_value_269 = json_config['tools']['yosys']['ice40_dffe_min_ce_use'];
    }
    catch(e){}
    if (typeof current_value_269 === 'number'){
        default_config['tools']['yosys']['ice40_dffe_min_ce_use'] = current_value_269;
    }
            
    // tools -> yosys -> ice40_nobram
    let current_value_270 = undefined;
    try {
        current_value_270 = json_config['tools']['yosys']['ice40_nobram'];
    }
    catch(e){}
    if (current_value_270 === true || current_value_270 === false){
        default_config['tools']['yosys']['ice40_nobram'] = current_value_270;
    }
            
    // tools -> yosys -> ice40_spram
    let current_value_271 = undefined;
    try {
        current_value_271 = json_config['tools']['yosys']['ice40_spram'];
    }
    catch(e){}
    if (current_value_271 === true || current_value_271 === false){
        default_config['tools']['yosys']['ice40_spram'] = current_value_271;
    }
            
    // tools -> yosys -> ice40_dsp
    let current_value_272 = undefined;
    try {
        current_value_272 = json_config['tools']['yosys']['ice40_dsp'];
    }
    catch(e){}
    if (current_value_272 === true || current_value_272 === false){
        default_config['tools']['yosys']['ice40_dsp'] = current_value_272;
    }
            
    // tools -> yosys -> ice40_noabc
    let current_value_273 = undefined;
    try {
        current_value_273 = json_config['tools']['yosys']['ice40_noabc'];
    }
    catch(e){}
    if (current_value_273 === true || current_value_273 === false){
        default_config['tools']['yosys']['ice40_noabc'] = current_value_273;
    }
            
    // tools -> yosys -> ice40_abc2
    let current_value_274 = undefined;
    try {
        current_value_274 = json_config['tools']['yosys']['ice40_abc2'];
    }
    catch(e){}
    if (current_value_274 === true || current_value_274 === false){
        default_config['tools']['yosys']['ice40_abc2'] = current_value_274;
    }
            
    // tools -> yosys -> ice40_vpr
    let current_value_275 = undefined;
    try {
        current_value_275 = json_config['tools']['yosys']['ice40_vpr'];
    }
    catch(e){}
    if (current_value_275 === true || current_value_275 === false){
        default_config['tools']['yosys']['ice40_vpr'] = current_value_275;
    }
            
    // tools -> yosys -> ice40_noabc9
    let current_value_276 = undefined;
    try {
        current_value_276 = json_config['tools']['yosys']['ice40_noabc9'];
    }
    catch(e){}
    if (current_value_276 === true || current_value_276 === false){
        default_config['tools']['yosys']['ice40_noabc9'] = current_value_276;
    }
            
    // tools -> yosys -> ice40_flowmap
    let current_value_277 = undefined;
    try {
        current_value_277 = json_config['tools']['yosys']['ice40_flowmap'];
    }
    catch(e){}
    if (current_value_277 === true || current_value_277 === false){
        default_config['tools']['yosys']['ice40_flowmap'] = current_value_277;
    }
            
    // tools -> yosys -> ice40_no_rw_check
    let current_value_278 = undefined;
    try {
        current_value_278 = json_config['tools']['yosys']['ice40_no_rw_check'];
    }
    catch(e){}
    if (current_value_278 === true || current_value_278 === false){
        default_config['tools']['yosys']['ice40_no_rw_check'] = current_value_278;
    }
            
    // tools -> yosys -> ecp5_top_module
    let current_value_279 = undefined;
    try {
        current_value_279 = json_config['tools']['yosys']['ecp5_top_module'];
    }
    catch(e){}
    if (typeof current_value_279 === 'string'){
        default_config['tools']['yosys']['ecp5_top_module'] = current_value_279;
    }
            
    // tools -> yosys -> ecp5_output_blif
    let current_value_280 = undefined;
    try {
        current_value_280 = json_config['tools']['yosys']['ecp5_output_blif'];
    }
    catch(e){}
    if (typeof current_value_280 === 'string'){
        default_config['tools']['yosys']['ecp5_output_blif'] = current_value_280;
    }
            
    // tools -> yosys -> ecp5_output_edif
    let current_value_281 = undefined;
    try {
        current_value_281 = json_config['tools']['yosys']['ecp5_output_edif'];
    }
    catch(e){}
    if (typeof current_value_281 === 'string'){
        default_config['tools']['yosys']['ecp5_output_edif'] = current_value_281;
    }
            
    // tools -> yosys -> ecp5_output_json
    let current_value_282 = undefined;
    try {
        current_value_282 = json_config['tools']['yosys']['ecp5_output_json'];
    }
    catch(e){}
    if (typeof current_value_282 === 'string'){
        default_config['tools']['yosys']['ecp5_output_json'] = current_value_282;
    }
            
    // tools -> yosys -> ecp5_noflatten
    let current_value_283 = undefined;
    try {
        current_value_283 = json_config['tools']['yosys']['ecp5_noflatten'];
    }
    catch(e){}
    if (current_value_283 === true || current_value_283 === false){
        default_config['tools']['yosys']['ecp5_noflatten'] = current_value_283;
    }
            
    // tools -> yosys -> ecp5_dff
    let current_value_284 = undefined;
    try {
        current_value_284 = json_config['tools']['yosys']['ecp5_dff'];
    }
    catch(e){}
    if (current_value_284 === true || current_value_284 === false){
        default_config['tools']['yosys']['ecp5_dff'] = current_value_284;
    }
            
    // tools -> yosys -> ecp5_retime
    let current_value_285 = undefined;
    try {
        current_value_285 = json_config['tools']['yosys']['ecp5_retime'];
    }
    catch(e){}
    if (current_value_285 === true || current_value_285 === false){
        default_config['tools']['yosys']['ecp5_retime'] = current_value_285;
    }
            
    // tools -> yosys -> ecp5_noccu2
    let current_value_286 = undefined;
    try {
        current_value_286 = json_config['tools']['yosys']['ecp5_noccu2'];
    }
    catch(e){}
    if (current_value_286 === true || current_value_286 === false){
        default_config['tools']['yosys']['ecp5_noccu2'] = current_value_286;
    }
            
    // tools -> yosys -> ecp5_nodffe
    let current_value_287 = undefined;
    try {
        current_value_287 = json_config['tools']['yosys']['ecp5_nodffe'];
    }
    catch(e){}
    if (current_value_287 === true || current_value_287 === false){
        default_config['tools']['yosys']['ecp5_nodffe'] = current_value_287;
    }
            
    // tools -> yosys -> ecp5_nobram
    let current_value_288 = undefined;
    try {
        current_value_288 = json_config['tools']['yosys']['ecp5_nobram'];
    }
    catch(e){}
    if (current_value_288 === true || current_value_288 === false){
        default_config['tools']['yosys']['ecp5_nobram'] = current_value_288;
    }
            
    // tools -> yosys -> ecp5_nolutram
    let current_value_289 = undefined;
    try {
        current_value_289 = json_config['tools']['yosys']['ecp5_nolutram'];
    }
    catch(e){}
    if (current_value_289 === true || current_value_289 === false){
        default_config['tools']['yosys']['ecp5_nolutram'] = current_value_289;
    }
            
    // tools -> yosys -> ecp5_nowidelut
    let current_value_290 = undefined;
    try {
        current_value_290 = json_config['tools']['yosys']['ecp5_nowidelut'];
    }
    catch(e){}
    if (current_value_290 === true || current_value_290 === false){
        default_config['tools']['yosys']['ecp5_nowidelut'] = current_value_290;
    }
            
    // tools -> yosys -> ecp5_asyncprld
    let current_value_291 = undefined;
    try {
        current_value_291 = json_config['tools']['yosys']['ecp5_asyncprld'];
    }
    catch(e){}
    if (current_value_291 === true || current_value_291 === false){
        default_config['tools']['yosys']['ecp5_asyncprld'] = current_value_291;
    }
            
    // tools -> yosys -> ecp5_abc2
    let current_value_292 = undefined;
    try {
        current_value_292 = json_config['tools']['yosys']['ecp5_abc2'];
    }
    catch(e){}
    if (current_value_292 === true || current_value_292 === false){
        default_config['tools']['yosys']['ecp5_abc2'] = current_value_292;
    }
            
    // tools -> yosys -> ecp5_noabc9
    let current_value_293 = undefined;
    try {
        current_value_293 = json_config['tools']['yosys']['ecp5_noabc9'];
    }
    catch(e){}
    if (current_value_293 === true || current_value_293 === false){
        default_config['tools']['yosys']['ecp5_noabc9'] = current_value_293;
    }
            
    // tools -> yosys -> ecp5_vpr
    let current_value_294 = undefined;
    try {
        current_value_294 = json_config['tools']['yosys']['ecp5_vpr'];
    }
    catch(e){}
    if (current_value_294 === true || current_value_294 === false){
        default_config['tools']['yosys']['ecp5_vpr'] = current_value_294;
    }
            
    // tools -> yosys -> ecp5_iopad
    let current_value_295 = undefined;
    try {
        current_value_295 = json_config['tools']['yosys']['ecp5_iopad'];
    }
    catch(e){}
    if (current_value_295 === true || current_value_295 === false){
        default_config['tools']['yosys']['ecp5_iopad'] = current_value_295;
    }
            
    // tools -> yosys -> ecp5_nodsp
    let current_value_296 = undefined;
    try {
        current_value_296 = json_config['tools']['yosys']['ecp5_nodsp'];
    }
    catch(e){}
    if (current_value_296 === true || current_value_296 === false){
        default_config['tools']['yosys']['ecp5_nodsp'] = current_value_296;
    }
            
    // tools -> yosys -> ecp5_no_rw_check
    let current_value_297 = undefined;
    try {
        current_value_297 = json_config['tools']['yosys']['ecp5_no_rw_check'];
    }
    catch(e){}
    if (current_value_297 === true || current_value_297 === false){
        default_config['tools']['yosys']['ecp5_no_rw_check'] = current_value_297;
    }
            
    // tools -> yosys -> verbose
    let current_value_298 = undefined;
    try {
        current_value_298 = json_config['tools']['yosys']['verbose'];
    }
    catch(e){}
    if (current_value_298 === true || current_value_298 === false){
        default_config['tools']['yosys']['verbose'] = current_value_298;
    }
            
    // tools -> yosys -> debug_level
    let current_value_299 = undefined;
    try {
        current_value_299 = json_config['tools']['yosys']['debug_level'];
    }
    catch(e){}
    if ( current_value_299 === "none"){
        default_config['tools']['yosys']['debug_level'] = e_tools_yosys_debug_level.none;
    }
    if ( current_value_299 === "basic"){
        default_config['tools']['yosys']['debug_level'] = e_tools_yosys_debug_level.basic;
    }
    if ( current_value_299 === "detailed"){
        default_config['tools']['yosys']['debug_level'] = e_tools_yosys_debug_level.detailed;
    }
    if ( current_value_299 === "verbose"){
        default_config['tools']['yosys']['debug_level'] = e_tools_yosys_debug_level.verbose;
    }
            
    // tools -> yosys -> log_file
    let current_value_300 = undefined;
    try {
        current_value_300 = json_config['tools']['yosys']['log_file'];
    }
    catch(e){}
    if (typeof current_value_300 === 'string'){
        default_config['tools']['yosys']['log_file'] = current_value_300;
    }
            
    // tools -> yosys -> custom_load_commands
    let current_value_301 = undefined;
    try {
        current_value_301 = json_config['tools']['yosys']['custom_load_commands'];
    }
    catch(e){}
    if (Array.isArray(current_value_301)){
        default_config['tools']['yosys']['custom_load_commands'] = current_value_301;
    }
            
    // tools -> yosys -> custom_analyze_commands
    let current_value_302 = undefined;
    try {
        current_value_302 = json_config['tools']['yosys']['custom_analyze_commands'];
    }
    catch(e){}
    if (Array.isArray(current_value_302)){
        default_config['tools']['yosys']['custom_analyze_commands'] = current_value_302;
    }
            
    // tools -> yosys -> custom_elaborate_commands
    let current_value_303 = undefined;
    try {
        current_value_303 = json_config['tools']['yosys']['custom_elaborate_commands'];
    }
    catch(e){}
    if (Array.isArray(current_value_303)){
        default_config['tools']['yosys']['custom_elaborate_commands'] = current_value_303;
    }
            
    // tools -> yosys -> extra_flags
    let current_value_304 = undefined;
    try {
        current_value_304 = json_config['tools']['yosys']['extra_flags'];
    }
    catch(e){}
    if (Array.isArray(current_value_304)){
        default_config['tools']['yosys']['extra_flags'] = current_value_304;
    }
            
    // tools -> yosys -> check_enabled
    let current_value_305 = undefined;
    try {
        current_value_305 = json_config['tools']['yosys']['check_enabled'];
    }
    catch(e){}
    if (current_value_305 === true || current_value_305 === false){
        default_config['tools']['yosys']['check_enabled'] = current_value_305;
    }
            
    // tools -> yosys -> check_options
    let current_value_306 = undefined;
    try {
        current_value_306 = json_config['tools']['yosys']['check_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_306)){
        default_config['tools']['yosys']['check_options'] = current_value_306;
    }
            
    // tools -> yosys -> stat_enabled
    let current_value_307 = undefined;
    try {
        current_value_307 = json_config['tools']['yosys']['stat_enabled'];
    }
    catch(e){}
    if (current_value_307 === true || current_value_307 === false){
        default_config['tools']['yosys']['stat_enabled'] = current_value_307;
    }
            
    // tools -> yosys -> stat_options
    let current_value_308 = undefined;
    try {
        current_value_308 = json_config['tools']['yosys']['stat_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_308)){
        default_config['tools']['yosys']['stat_options'] = current_value_308;
    }
            
    // tools -> openfpga -> installation_path
    let current_value_309 = undefined;
    try {
        current_value_309 = json_config['tools']['openfpga']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_309 === 'string'){
        default_config['tools']['openfpga']['installation_path'] = current_value_309;
    }
            
    // tools -> openfpga -> arch
    let current_value_310 = undefined;
    try {
        current_value_310 = json_config['tools']['openfpga']['arch'];
    }
    catch(e){}
    if (typeof current_value_310 === 'string'){
        default_config['tools']['openfpga']['arch'] = current_value_310;
    }
            
    // tools -> openfpga -> task_options
    let current_value_311 = undefined;
    try {
        current_value_311 = json_config['tools']['openfpga']['task_options'];
    }
    catch(e){}
    if (Array.isArray(current_value_311)){
        default_config['tools']['openfpga']['task_options'] = current_value_311;
    }
            
    // tools -> activehdl -> installation_path
    let current_value_312 = undefined;
    try {
        current_value_312 = json_config['tools']['activehdl']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_312 === 'string'){
        default_config['tools']['activehdl']['installation_path'] = current_value_312;
    }
            
    // tools -> questa -> installation_path
    let current_value_313 = undefined;
    try {
        current_value_313 = json_config['tools']['questa']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_313 === 'string'){
        default_config['tools']['questa']['installation_path'] = current_value_313;
    }
            
    // tools -> raptor -> installation_path
    let current_value_314 = undefined;
    try {
        current_value_314 = json_config['tools']['raptor']['installation_path'];
    }
    catch(e){}
    if (typeof current_value_314 === 'string'){
        default_config['tools']['raptor']['installation_path'] = current_value_314;
    }
            
    // tools -> raptor -> target_device
    let current_value_315 = undefined;
    try {
        current_value_315 = json_config['tools']['raptor']['target_device'];
    }
    catch(e){}
    if (typeof current_value_315 === 'string'){
        default_config['tools']['raptor']['target_device'] = current_value_315;
    }
            
    // tools -> raptor -> vhdl_version
    let current_value_316 = undefined;
    try {
        current_value_316 = json_config['tools']['raptor']['vhdl_version'];
    }
    catch(e){}
    if ( current_value_316 === "VHDL_1987"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_1987;
    }
    if ( current_value_316 === "VHDL_1993"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_1993;
    }
    if ( current_value_316 === "VHDL_2000"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_2000;
    }
    if ( current_value_316 === "VHDL_2008"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_2008;
    }
    if ( current_value_316 === "VHDL_2019"){
        default_config['tools']['raptor']['vhdl_version'] = e_tools_raptor_vhdl_version.VHDL_2019;
    }
            
    // tools -> raptor -> verilog_version
    let current_value_317 = undefined;
    try {
        current_value_317 = json_config['tools']['raptor']['verilog_version'];
    }
    catch(e){}
    if ( current_value_317 === "V_1995"){
        default_config['tools']['raptor']['verilog_version'] = e_tools_raptor_verilog_version.V_1995;
    }
    if ( current_value_317 === "V_2001"){
        default_config['tools']['raptor']['verilog_version'] = e_tools_raptor_verilog_version.V_2001;
    }
            
    // tools -> raptor -> sv_version
    let current_value_318 = undefined;
    try {
        current_value_318 = json_config['tools']['raptor']['sv_version'];
    }
    catch(e){}
    if ( current_value_318 === "SV_2005"){
        default_config['tools']['raptor']['sv_version'] = e_tools_raptor_sv_version.SV_2005;
    }
    if ( current_value_318 === "SV_2009"){
        default_config['tools']['raptor']['sv_version'] = e_tools_raptor_sv_version.SV_2009;
    }
    if ( current_value_318 === "SV_2012"){
        default_config['tools']['raptor']['sv_version'] = e_tools_raptor_sv_version.SV_2012;
    }
    if ( current_value_318 === "SV_2017"){
        default_config['tools']['raptor']['sv_version'] = e_tools_raptor_sv_version.SV_2017;
    }
            
    // tools -> raptor -> div_0
            
    // tools -> raptor -> optimization
    let current_value_320 = undefined;
    try {
        current_value_320 = json_config['tools']['raptor']['optimization'];
    }
    catch(e){}
    if ( current_value_320 === "area"){
        default_config['tools']['raptor']['optimization'] = e_tools_raptor_optimization.area;
    }
    if ( current_value_320 === "delay"){
        default_config['tools']['raptor']['optimization'] = e_tools_raptor_optimization.delay;
    }
    if ( current_value_320 === "mixed"){
        default_config['tools']['raptor']['optimization'] = e_tools_raptor_optimization.mixed;
    }
    if ( current_value_320 === "none"){
        default_config['tools']['raptor']['optimization'] = e_tools_raptor_optimization.none;
    }
            
    // tools -> raptor -> effort
    let current_value_321 = undefined;
    try {
        current_value_321 = json_config['tools']['raptor']['effort'];
    }
    catch(e){}
    if ( current_value_321 === "high"){
        default_config['tools']['raptor']['effort'] = e_tools_raptor_effort.high;
    }
    if ( current_value_321 === "medium"){
        default_config['tools']['raptor']['effort'] = e_tools_raptor_effort.medium;
    }
    if ( current_value_321 === "low"){
        default_config['tools']['raptor']['effort'] = e_tools_raptor_effort.low;
    }
            
    // tools -> raptor -> fsm_encoding
    let current_value_322 = undefined;
    try {
        current_value_322 = json_config['tools']['raptor']['fsm_encoding'];
    }
    catch(e){}
    if ( current_value_322 === "binary"){
        default_config['tools']['raptor']['fsm_encoding'] = e_tools_raptor_fsm_encoding.binary;
    }
    if ( current_value_322 === "onehot"){
        default_config['tools']['raptor']['fsm_encoding'] = e_tools_raptor_fsm_encoding.onehot;
    }
            
    // tools -> raptor -> carry
    let current_value_323 = undefined;
    try {
        current_value_323 = json_config['tools']['raptor']['carry'];
    }
    catch(e){}
    if ( current_value_323 === "auto"){
        default_config['tools']['raptor']['carry'] = e_tools_raptor_carry.auto;
    }
    if ( current_value_323 === "all"){
        default_config['tools']['raptor']['carry'] = e_tools_raptor_carry.all;
    }
    if ( current_value_323 === "none"){
        default_config['tools']['raptor']['carry'] = e_tools_raptor_carry.none;
    }
            
    // tools -> raptor -> pnr_netlist_language
    let current_value_324 = undefined;
    try {
        current_value_324 = json_config['tools']['raptor']['pnr_netlist_language'];
    }
    catch(e){}
    if ( current_value_324 === "blif"){
        default_config['tools']['raptor']['pnr_netlist_language'] = e_tools_raptor_pnr_netlist_language.blif;
    }
    if ( current_value_324 === "edif"){
        default_config['tools']['raptor']['pnr_netlist_language'] = e_tools_raptor_pnr_netlist_language.edif;
    }
    if ( current_value_324 === "verilog"){
        default_config['tools']['raptor']['pnr_netlist_language'] = e_tools_raptor_pnr_netlist_language.verilog;
    }
    if ( current_value_324 === "vhdl"){
        default_config['tools']['raptor']['pnr_netlist_language'] = e_tools_raptor_pnr_netlist_language.vhdl;
    }
            
    // tools -> raptor -> dsp_limit
    let current_value_325 = undefined;
    try {
        current_value_325 = json_config['tools']['raptor']['dsp_limit'];
    }
    catch(e){}
    if (typeof current_value_325 === 'number'){
        default_config['tools']['raptor']['dsp_limit'] = current_value_325;
    }
            
    // tools -> raptor -> block_ram_limit
    let current_value_326 = undefined;
    try {
        current_value_326 = json_config['tools']['raptor']['block_ram_limit'];
    }
    catch(e){}
    if (typeof current_value_326 === 'number'){
        default_config['tools']['raptor']['block_ram_limit'] = current_value_326;
    }
            
    // tools -> raptor -> fast_synthesis
    let current_value_327 = undefined;
    try {
        current_value_327 = json_config['tools']['raptor']['fast_synthesis'];
    }
    catch(e){}
    if (current_value_327 === true || current_value_327 === false){
        default_config['tools']['raptor']['fast_synthesis'] = current_value_327;
    }
            
    // tools -> raptor -> div_1
            
    // tools -> raptor -> top_level
    let current_value_329 = undefined;
    try {
        current_value_329 = json_config['tools']['raptor']['top_level'];
    }
    catch(e){}
    if (typeof current_value_329 === 'string'){
        default_config['tools']['raptor']['top_level'] = current_value_329;
    }
            
    // tools -> raptor -> sim_source_list
    let current_value_330 = undefined;
    try {
        current_value_330 = json_config['tools']['raptor']['sim_source_list'];
    }
    catch(e){}
    if (Array.isArray(current_value_330)){
        default_config['tools']['raptor']['sim_source_list'] = current_value_330;
    }
            
    // tools -> raptor -> simulate_rtl
    let current_value_331 = undefined;
    try {
        current_value_331 = json_config['tools']['raptor']['simulate_rtl'];
    }
    catch(e){}
    if (current_value_331 === true || current_value_331 === false){
        default_config['tools']['raptor']['simulate_rtl'] = current_value_331;
    }
            
    // tools -> raptor -> waveform_rtl
    let current_value_332 = undefined;
    try {
        current_value_332 = json_config['tools']['raptor']['waveform_rtl'];
    }
    catch(e){}
    if (typeof current_value_332 === 'string'){
        default_config['tools']['raptor']['waveform_rtl'] = current_value_332;
    }
            
    // tools -> raptor -> simulator_rtl
    let current_value_333 = undefined;
    try {
        current_value_333 = json_config['tools']['raptor']['simulator_rtl'];
    }
    catch(e){}
    if ( current_value_333 === "verilator"){
        default_config['tools']['raptor']['simulator_rtl'] = e_tools_raptor_simulator_rtl.verilator;
    }
    if ( current_value_333 === "ghdl"){
        default_config['tools']['raptor']['simulator_rtl'] = e_tools_raptor_simulator_rtl.ghdl;
    }
    if ( current_value_333 === "icarus"){
        default_config['tools']['raptor']['simulator_rtl'] = e_tools_raptor_simulator_rtl.icarus;
    }
            
    // tools -> raptor -> simulation_options_rtl
    let current_value_334 = undefined;
    try {
        current_value_334 = json_config['tools']['raptor']['simulation_options_rtl'];
    }
    catch(e){}
    if (typeof current_value_334 === 'string'){
        default_config['tools']['raptor']['simulation_options_rtl'] = current_value_334;
    }
            
    // tools -> raptor -> simulate_gate
    let current_value_335 = undefined;
    try {
        current_value_335 = json_config['tools']['raptor']['simulate_gate'];
    }
    catch(e){}
    if (current_value_335 === true || current_value_335 === false){
        default_config['tools']['raptor']['simulate_gate'] = current_value_335;
    }
            
    // tools -> raptor -> waveform_gate
    let current_value_336 = undefined;
    try {
        current_value_336 = json_config['tools']['raptor']['waveform_gate'];
    }
    catch(e){}
    if (typeof current_value_336 === 'string'){
        default_config['tools']['raptor']['waveform_gate'] = current_value_336;
    }
            
    // tools -> raptor -> simulator_gate
    let current_value_337 = undefined;
    try {
        current_value_337 = json_config['tools']['raptor']['simulator_gate'];
    }
    catch(e){}
    if ( current_value_337 === "verilator"){
        default_config['tools']['raptor']['simulator_gate'] = e_tools_raptor_simulator_gate.verilator;
    }
    if ( current_value_337 === "ghdl"){
        default_config['tools']['raptor']['simulator_gate'] = e_tools_raptor_simulator_gate.ghdl;
    }
    if ( current_value_337 === "icarus"){
        default_config['tools']['raptor']['simulator_gate'] = e_tools_raptor_simulator_gate.icarus;
    }
            
    // tools -> raptor -> simulation_options_gate
    let current_value_338 = undefined;
    try {
        current_value_338 = json_config['tools']['raptor']['simulation_options_gate'];
    }
    catch(e){}
    if (typeof current_value_338 === 'string'){
        default_config['tools']['raptor']['simulation_options_gate'] = current_value_338;
    }
            
    // tools -> raptor -> simulate_pnr
    let current_value_339 = undefined;
    try {
        current_value_339 = json_config['tools']['raptor']['simulate_pnr'];
    }
    catch(e){}
    if (current_value_339 === true || current_value_339 === false){
        default_config['tools']['raptor']['simulate_pnr'] = current_value_339;
    }
            
    // tools -> raptor -> waveform_pnr
    let current_value_340 = undefined;
    try {
        current_value_340 = json_config['tools']['raptor']['waveform_pnr'];
    }
    catch(e){}
    if (typeof current_value_340 === 'string'){
        default_config['tools']['raptor']['waveform_pnr'] = current_value_340;
    }
            
    // tools -> raptor -> simulator_pnr
    let current_value_341 = undefined;
    try {
        current_value_341 = json_config['tools']['raptor']['simulator_pnr'];
    }
    catch(e){}
    if ( current_value_341 === "verilator"){
        default_config['tools']['raptor']['simulator_pnr'] = e_tools_raptor_simulator_pnr.verilator;
    }
    if ( current_value_341 === "ghdl"){
        default_config['tools']['raptor']['simulator_pnr'] = e_tools_raptor_simulator_pnr.ghdl;
    }
    if ( current_value_341 === "icarus"){
        default_config['tools']['raptor']['simulator_pnr'] = e_tools_raptor_simulator_pnr.icarus;
    }
            
    // tools -> raptor -> simulation_options_pnr
    let current_value_342 = undefined;
    try {
        current_value_342 = json_config['tools']['raptor']['simulation_options_pnr'];
    }
    catch(e){}
    if (typeof current_value_342 === 'string'){
        default_config['tools']['raptor']['simulation_options_pnr'] = current_value_342;
    }
            

    return default_config;
}