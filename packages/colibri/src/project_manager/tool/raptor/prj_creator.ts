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
import { t_project_definition } from "../../project_definition";
import { e_clean_step } from "../common";
import { get_toplevel_from_path } from "../../../utils/hdl_utils";
import { e_tools_raptor } from "../../../config/config_declaration";
import { t_file } from "../../common";
import { get_lang_from_path } from "../../../utils/hdl_utils";
import { HDL_LANG } from "../../../common/general";

export function get_tcl_script(prj: t_project_definition, is_clean_mode: boolean,
    clean_step: e_clean_step | undefined): string {
    const file_list = prj.file_manager.get();
    const config = prj.config_manager.get_config().tools.raptor;

    ////////////////////////////////////////////////////////////////////////////
    // Design project
    ////////////////////////////////////////////////////////////////////////////
    const design_project = `create_design ${prj.name}\n`;

    ////////////////////////////////////////////////////////////////////////////
    // Design files
    ////////////////////////////////////////////////////////////////////////////
    const design_file_list = get_design_files(config, file_list);

    ////////////////////////////////////////////////////////////////////////////
    // Top module
    ////////////////////////////////////////////////////////////////////////////
    const entity_name = get_toplevel_from_path(prj.toplevel_path_manager.get()[0]);
    const module = `set_top_module ${entity_name}\n`;

    ////////////////////////////////////////////////////////////////////////////
    // Simulation
    ////////////////////////////////////////////////////////////////////////////
    const simulation = get_simulation_file(config);

    ////////////////////////////////////////////////////////////////////////////
    // Constraints
    ////////////////////////////////////////////////////////////////////////////
    const constratints_file_list = get_constraint_files(file_list);

    ////////////////////////////////////////////////////////////////////////////
    // Steps arguments
    ////////////////////////////////////////////////////////////////////////////
    const target = `target_device ${config.target_device.replace('target_', '')}\n`;

    ////////////////////////////////////////////////////////////////////////////
    // Steps arguments
    ////////////////////////////////////////////////////////////////////////////
    // Synt
    const synt_args = get_synthesize_args(config);

    ////////////////////////////////////////////////////////////////////////////
    // Steps
    ////////////////////////////////////////////////////////////////////////////
    let steps = get_compile_steps(config);
    if (is_clean_mode === true && clean_step !== undefined){
        steps = get_clean_steps(clean_step);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Script
    ////////////////////////////////////////////////////////////////////////////
    const tcl_script = `
${design_project}
${design_file_list}
${module}
${constratints_file_list}
${simulation}
${target}
${synt_args}
pin_loc_assign_method free
${steps}`;

    return tcl_script;
}

function get_simulation_file(config: e_tools_raptor){
    const top_level_path = config.top_level;
    if (top_level_path === ""){
        return "";
    }

    const top_level = get_toplevel_from_path(top_level_path);
    if (top_level === ""){
        return "";
    }

    let cmd = "";
    const simulation_file_list = [...config.sim_source_list];
    simulation_file_list.push(top_level_path);

    simulation_file_list.forEach((file_tb: string) => {
        if (file_tb !== ""){
            const lang = get_lang_from_path(file_tb);
            let cmd_lang = `-${config.vhdl_version}`;
            if (lang === HDL_LANG.VERILOG){
                cmd_lang = `-${config.verilog_version}`;
            }
            else if (lang === HDL_LANG.SYSTEMVERILOG){
                cmd_lang = `-${config.sv_version}`;
            }
            else {
                cmd_lang = "";
            }
        
            cmd += `add_simulation_file ${cmd_lang} ${file_tb}\n`;
        }
    });

    cmd += `set_top_testbench ${top_level}\n`;

    return cmd;
}


function get_compile_steps(config: e_tools_raptor){
    let pnr_netlist_lang = "";

    // RTL simulation
    let rtl_simulation = "";
    if (config.simulate_rtl === true){
        if (config.simulation_options_rtl !== ""){
            rtl_simulation = `simulation_options "${config.simulator_rtl}" "simulation" "${config.simulation_options_rtl}"\n`;
        }
        rtl_simulation += `simulate "rtl" "${config.simulator_rtl}" ${config.waveform_rtl}`;
    }
    // Gate simulation
    let gate_simulation = "";
    if (config.simulate_gate === true){
        const top_level_path = config.top_level;
        const lang = get_lang_from_path(top_level_path);
        if (lang === HDL_LANG.VHDL){
            pnr_netlist_lang = "pnr_netlist_lang vhdl";
        }
        if (lang === HDL_LANG.SYSTEMVERILOG){
            pnr_netlist_lang = "pnr_netlist_lang verilog";
        }

        if (config.simulation_options_gate !== ""){
            gate_simulation = `simulation_options "${config.simulator_gate}" "simulation" "${config.simulation_options_gate}"\n`;
        }
        gate_simulation += `simulate "gate" "${config.simulator_gate}" ${config.waveform_gate}`;
    }
    // PNR simulation
    let pnr_simulation = "";
    if (config.simulate_pnr === true){
        if (config.simulation_options_gate !== ""){
            pnr_simulation = `simulation_options "${config.simulator_pnr}" "simulation" "${config.simulation_options_pnr}"\n`;
        }
        pnr_simulation += `simulate "pnr" "${config.simulator_pnr}" ${config.waveform_pnr}`;
    }

    const steps = `
analyze
${rtl_simulation}
${pnr_netlist_lang}
set_limits bram ${config.block_ram_limit}
set_limits dsp ${config.dsp_limit}
synthesize ${config.optimization}
${gate_simulation}
packing
place
route
${pnr_simulation}
sta
bitstream         
`;
    return steps;
}

function get_design_files(config: e_tools_raptor, file_list: t_file[]){
    let design_file_list = "";
    file_list.forEach(element => {
        let library_cmd = "";
        if (element.logical_name !== ""){
            library_cmd = `-L ${element.logical_name}`;
        }

        let version_cmd = "";
        if (element.file_type === "vhdlSource-2008") {
            version_cmd = `-${config.vhdl_version}`;
        }
        else if (element.file_type === "verilogSource-2005") {
            version_cmd = `-${config.verilog_version}`;
        }
        else if (element.file_type === "systemVerilogSource") {
            version_cmd = `-${config.sv_version}`;
        }

        if (element.file_type !== "xdc" && element.file_type !== "pin" && element.file_type !== "sdc"){
            design_file_list += `add_design_file ${version_cmd} ${library_cmd} ${element.name}\n`;
        }
    });
    return design_file_list;
}

function get_constraint_files(file_list: t_file[]){
    let constratints_file_list = "";
    file_list.forEach(element => {
        if (element.file_type === "sdc" || element.file_type === "xdc" || element.file_type === "pin") {
            constratints_file_list += `add_constraint_file ${element.name}\n`;
        }
    });
    return constratints_file_list;
}

function get_clean_steps(clean_step: e_clean_step){
    const step_list = Object.values(e_clean_step).map(v => v.toLowerCase());
    const step_str = e_clean_step[clean_step].toLocaleLowerCase();

    let clean_cmd = "";
    for (let i = step_list.length-1; i > 0; i--) {
        const element = step_list[i];
        clean_cmd += `${element} clean\n`;
        if (element === step_str){
            break;
        }
    }
    return clean_cmd;
}

function get_synthesize_args(config: e_tools_raptor) {
    let synt_args = `synth_options -effort ${config.effort} -carry ${config.carry} -fsm_encoding ${config.fsm_encoding}`;
    if (config.fast_synthesis) {
        synt_args += " -fast";
    }
    return synt_args;
}