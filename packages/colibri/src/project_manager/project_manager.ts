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

import {
    t_file_reduced, t_script, t_parameter, e_script_stage, t_action_result, t_watcher,
    e_watcher_type
} from "./common";
import * as  manager_watcher from "./list_manager/watcher";
import * as  manager_file from "./list_manager/file";
import * as  manager_hook from "./list_manager/hook";
import * as  manager_parameter from "./list_manager/parameter";
import * as  manager_toplevel_path from "./list_manager/toplevel_path";
import * as  manager_dependency from "./dependency/dependency";
import { Tool_manager } from "./tool/tools_manager";
import { t_test_declaration, t_test_result, e_clean_step } from "./tool/common";
import { t_project_definition } from "./project_definition";
import * as file_utils from "../utils/file_utils";
import { Config_manager, merge_configs } from "../config/config_manager";
import { e_config } from "../config/config_declaration";
import * as utils from "./utils/utils";
import * as process_utils from "../process/utils";
import * as python from "../process/python";
import * as events from "events";
import * as path_lib from "path";
import * as process from "../process/process";
import { l_error } from "../linter/common";
import { Linter } from "../linter/linter";
import { t_linter_name, l_options } from "../linter/common";
import { Vunit } from "./tool/vunit/vunit";

export class Project_manager {
    /**  Name of the project */
    private name: string;
    /** Contains all the HDL source files, constraint files, vendor IP description files, 
     * memory initialization files etc. for the project. */
    private files = new manager_file.File_manager();
    /** File watcher. */
    private watchers: manager_watcher.Watcher_manager;
    /** A dictionary of extra commands to execute at various stages of the project build/run. */
    private hooks = new manager_hook.Hook_manager();
    /** Specifies build- and run-time parameters, such as plusargs, VHDL generics, Verilog defines etc. */
    private parameters = new manager_parameter.Parameter_manager();
    /** Toplevel path(s) for the project. */
    private toplevel_path = new manager_toplevel_path.Toplevel_path_manager();
    /** Config manager. */
    private config_manager = new Config_manager();
    private tools_manager = new Tool_manager(undefined);
    private emitter: events.EventEmitter | undefined = undefined;
    /** Linter */
    private linter = new Linter();

    constructor(name: string, emitter: events.EventEmitter | undefined = undefined) {
        this.name = name;
        this.emitter = emitter;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const selfm = this;
        this.watchers = new manager_watcher.Watcher_manager((function () {
            selfm.files.clear_automatic_files();
            selfm.watchers.get().forEach(async (watcher: any) => {
                if (file_utils.check_if_path_exist(watcher.path)){
                    if (selfm.emitter !== undefined) {
                        selfm.emitter.emit('loading');
                    }
                    if (watcher.watcher_type === e_watcher_type.CSV) {
                        selfm.add_file_from_csv(watcher.path, false);
                    }
                    else if (watcher.watcher_type === e_watcher_type.VUNIT) {
                        await selfm.add_file_from_vunit(selfm.config_manager.get_config(), watcher.path, false);
                    }
                    else if (watcher.watcher_type === e_watcher_type.VIVADO) {
                        await selfm.add_file_from_vivado(selfm.config_manager.get_config(), watcher.path, false);
                    }
                    if (selfm.emitter !== undefined) {
                        selfm.emitter.emit('loaded');
                        selfm.emitter.emit('refresh');
                    }
                }
            });
        }), emitter);
    }

    get_name() {
        return this.name;
    }

    rename(name: string) {
        this.name = name;
    }

    get_watcher_type(path: string): e_watcher_type {
        let watcher_type = e_watcher_type.CSV;
        this.watchers.get().forEach(watcher => {
            if (watcher.path === path) {
                watcher_type = watcher.watcher_type;
            }
        });
        return watcher_type;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////
    // public save_definition() {
    //     const definition = this.get_project_definition(undefined);
    // }

    ////////////////////////////////////////////////////////////////////////////
    // Linter
    ////////////////////////////////////////////////////////////////////////////
    public async lint_from_file(file_path: string, linter_name: t_linter_name,
        options: l_options): Promise<l_error[]> {

        if (this.check_if_path_in_project(file_path) === false) {
            return await this.linter.lint_from_file(linter_name, file_path, options);
        }
        return await this.linter.lint_from_project(file_path, this.files.get(), linter_name, options);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Hook
    ////////////////////////////////////////////////////////////////////////////
    public add_hook(script: t_script, stage: e_script_stage)
        : t_action_result {
        return this.hooks.add(script, stage);
    }

    public delete_hook(script: t_script, stage: e_script_stage)
        : t_action_result {
        return this.hooks.delete(script, stage);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Parameters
    ////////////////////////////////////////////////////////////////////////////
    add_parameter(parameter: t_parameter): t_action_result {
        return this.parameters.add(parameter);
    }

    delete_parameter(parameter: t_parameter): t_action_result {
        return this.parameters.delete(parameter);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Toplevel
    ////////////////////////////////////////////////////////////////////////////
    add_toplevel_path(toplevel_path_inst: string): t_action_result {
        this.toplevel_path.clear();
        return this.toplevel_path.add(toplevel_path_inst);
    }

    delete_toplevel_path(toplevel_path_inst: string): t_action_result {
        return this.toplevel_path.delete(toplevel_path_inst);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Watcher
    ////////////////////////////////////////////////////////////////////////////
    add_file_to_watcher(watcher: t_watcher): t_action_result {
        return this.watchers.add(watcher);
    }

    delete_file_in_watcher(watcher_path: string): t_action_result {
        return this.watchers.delete(watcher_path);
    }

    ////////////////////////////////////////////////////////////////////////////
    // File
    ////////////////////////////////////////////////////////////////////////////
    async add_file_from_vivado(general_config: e_config | undefined, vivado_path: string, is_manual: boolean)
        : Promise<t_action_result> {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        // Get Vivado binary path
        let vivado_bin = n_config.tools.vivado.installation_path;
        if (vivado_bin === "") {
            vivado_bin = "vivado";
        }
        else {
            vivado_bin = path_lib.join(vivado_bin, "vivado");
        }

        // Create temp file for out.csv
        const csv_file = process_utils.create_temp_file("");
        const tcl_file = path_lib.join(__dirname, 'prj_loaders', 'vivado.tcl');

        const cmd = `vivado -mode batch -source ${tcl_file} -tclargs ${vivado_path} ${csv_file}`;
        await (new process.Process(undefined)).exec_wait(cmd);

        const result_load = this.add_file_from_csv(csv_file, is_manual);

        // Delete temp file
        file_utils.remove_file(csv_file);

        return result_load;
    }


    async add_file_from_vunit(general_config: e_config | undefined, vunit_path: string, is_manual: boolean
    ): Promise<t_action_result> {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        const vunit = new Vunit();
        const simulator_name = n_config.tools.vunit.simulator_name;
        const simulator_install_path = vunit.get_simulator_installation_path(n_config);

        const simulator_conf = vunit.get_simulator_config(simulator_name, simulator_install_path);

        const py_path = n_config_manager.get_config().general.general.pypath;
        const json_path = process_utils.create_temp_file("");
        const args = `--export-json ${json_path}`;
        console.log(`${py_path} ${vunit_path} ${args}`);
        const result = await python.exec_python_script(py_path, vunit_path, args, simulator_conf);
        console.log(result.stderr);
        console.log(result.stdout);

        if (result.successful === true) {
            try {
                const json_str = file_utils.read_file_sync(json_path);
                const file_list = JSON.parse(json_str).files;
                file_list.forEach((file: any) => {
                    const file_declaration: t_file_reduced = {
                        name: file.file_name,
                        is_include_file: false,
                        include_path: "",
                        logical_name: file.library_name,
                        is_manual: is_manual
                    };
                    this.add_file(file_declaration);
                });
                const result: t_action_result = {
                    result: undefined,
                    successful: true,
                    msg: ""
                };
                return result;
            }
            // eslint-disable-next-line no-empty
            catch (e) { }
        }
        const result_error: t_action_result = {
            result: undefined,
            successful: false,
            msg: "Error processing run.py"
        };
        return result_error;
    }

    add_file_from_csv(csv_path: string, is_manual: boolean): t_action_result {
        const csv_content = file_utils.read_file_sync(csv_path);
        const file_list_array = csv_content.split(/\r?\n|\r/);
        for (let i = 0; i < file_list_array.length; ++i) {
            const element = file_list_array[i].trim();
            if (element !== '') {
                try {
                    let proc_error = false;
                    let lib_inst = "";
                    let file_inst = "";
                    const element_split = element.split(',');
                    if (element_split.length === 1) {
                        file_inst = element.split(',')[0].trim();
                    }
                    else if (element_split.length === 2) {
                        lib_inst = element.split(',')[0].trim();
                        file_inst = element.split(',')[1].trim();
                    }
                    else {
                        proc_error = true;
                    }

                    if (proc_error === false) {
                        if (lib_inst === "") {
                            lib_inst = "";
                        }
                        const dirname_csv = file_utils.get_directory(csv_path);
                        const complete_file_path = file_utils.get_absolute_path(dirname_csv, file_inst);

                        const file_edam: t_file_reduced = {
                            name: complete_file_path,
                            is_include_file: false,
                            include_path: "",
                            logical_name: lib_inst,
                            is_manual: is_manual
                        };
                        this.add_file(file_edam);
                    }
                }
                catch (e) {
                    const result: t_action_result = {
                        result: undefined,
                        successful: false,
                        msg: "Error processing CSV."
                    };
                    return result;
                }
            }
        }
        const result: t_action_result = {
            result: undefined,
            successful: true,
            msg: ""
        };
        return result;
    }

    add_file(file: t_file_reduced): t_action_result {
        return this.files.add(file);
    }

    delete_file(name: string, logical_name = "") {
        const result = this.files.delete(name, logical_name);
        this.delete_phantom_toplevel();
        return result;
    }

    delete_file_by_logical_name(logical_name: string) {
        const result = this.files.delete_by_logical_name(logical_name);
        this.delete_phantom_toplevel();
        return result;
    }

    add_logical(logical_name: string) {
        return this.files.add_logical(logical_name);
    }

    delete_phantom_toplevel() {
        this.toplevel_path.get().forEach(toplevel => {
            if (this.check_if_path_in_project(toplevel) === false) {
                this.delete_toplevel_path(toplevel);
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////
    // Dependency
    ////////////////////////////////////////////////////////////////////////////
    async get_dependency_graph(python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        const result = await m_dependency.get_dependency_graph_svg(this.files.get(), python_path);
        return result;
    }
    async get_compile_order(python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        const result = m_dependency.get_compile_order(this.files.get(), python_path);
        return result;
    }
    async get_dependency_tree(python_path: string): Promise<t_action_result> {
        const m_dependency = new manager_dependency.Dependency_graph();
        const result = m_dependency.get_dependency_tree(this.files.get(), python_path);
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Config
    ////////////////////////////////////////////////////////////////////////////
    public set_config(new_config: e_config) {
        this.config_manager.set_config(new_config);
    }
    public get_config(): e_config {
        return this.config_manager.get_config();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////
    public get_project_definition(config_manager: Config_manager | undefined = undefined): t_project_definition {
        let current_config_manager = config_manager;
        if (current_config_manager === undefined) {
            current_config_manager = this.config_manager;
        }
        const prj_definition: t_project_definition = {
            name: this.name,
            file_manager: this.files,
            hook_manager: this.hooks,
            parameter_manager: this.parameters,
            toplevel_path_manager: this.toplevel_path,
            watcher_manager: this.watchers,
            config_manager: current_config_manager
        };
        return prj_definition;
    }

    public check_if_file_in_project(name: string, logical_name: string): boolean {
        const file_list = this.files.get();
        let return_value = false;
        file_list.forEach(file_inst => {
            if (file_inst.name === name && file_inst.logical_name === logical_name) {
                return_value = true;
            }
        });
        return return_value;
    }

    public check_if_path_in_project(name: string): boolean {
        const file_list = this.files.get();
        let return_value = false;
        file_list.forEach(file_inst => {
            if (file_inst.name === name) {
                return_value = true;
            }
        });
        return return_value;
    }

    public get_edam_json(reference_path?: string) {
        return utils.get_edam_json(this.get_project_definition(), undefined, reference_path);
    }

    public get_edam_yaml(reference_path?: string) {
        return utils.get_edam_yaml(this.get_project_definition(), undefined, reference_path);
    }

    public save_edam_yaml(output_path: string){
        const edam_yaml = this.get_edam_yaml(output_path);
        file_utils.save_file_sync(output_path, edam_yaml);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Tool
    ////////////////////////////////////////////////////////////////////////////
    public run(general_config: e_config | undefined, test_list: t_test_declaration[],
        callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void): any {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        return this.tools_manager.run(this.get_project_definition(n_config_manager),
            test_list, callback, callback_stream);
    }

    public clean(general_config: e_config | undefined,
        clean_mode : e_clean_step,
        callback_stream: (stream_c: any) => void): any {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        return this.tools_manager.clean(this.get_project_definition(n_config_manager), clean_mode, callback_stream);
    }

    public async get_test_list(general_config: e_config | undefined = undefined): Promise<t_test_declaration[]> {

        const n_config = merge_configs(general_config, this.config_manager.get_config());
        const n_config_manager = new Config_manager();
        n_config_manager.set_config(n_config);

        return await this.tools_manager.get_test_list(this.get_project_definition(n_config_manager));
    }
}





