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

import { t_file, t_action_result, t_action_compile_order } from "../common";
import * as hdl_utils from "../../utils/hdl_utils";
import * as file_utils from "../../utils/file_utils";
import * as process_utils from "../../process/utils";
import * as python from "../../process/python";
import * as path_lib from 'path';
import { Pyodide, PACKAGE_MAP, python_result } from "../../process/pyodide";

export class Dependency_graph {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Pyodide
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Exec Python code using Pyodide
     * @param  file_list List of project files
     * @param  python_script_name Python script name
     * @returns Pyodide result
    **/
    private async run_pydodide(file_list: t_file[], python_script_name: any) : Promise<python_result>{
        // Get python code
        const python_script_path = path_lib.join(__dirname, `${python_script_name}.py`);
        const python_script_content = file_utils.read_file_sync(python_script_path);

        // Get file mapped in Pyodide
        const hdl_file_list = this.clean_non_hdl_files(file_list);
        const file_list_reduced: string[] = [];
        hdl_file_list.forEach(hdl_file_list => {
            file_list_reduced.push(hdl_file_list.name);
        });

        const pyodide = new Pyodide();
        const file_list_map = await pyodide.write_file_list(file_list_reduced);

        type t_file_map = t_file & {
            name_map: string;
        };

        const prj_file_list_map: t_file_map[] = [];
        hdl_file_list.forEach((file_inst, i) => {
            const file_map: t_file_map = {
                name: file_inst.name,
                name_map: "/" + file_list_map[i],
                file_type: file_inst.file_type,
                is_include_file: file_inst.is_include_file,
                include_path: file_inst.include_path,
                logical_name: file_inst.logical_name,
                is_manual: file_inst.is_manual,
                file_version: file_inst.file_version,
            };
            prj_file_list_map.push(file_map);
        });

        const args = {
            "project_sources": prj_file_list_map,
        };

        const result = await pyodide.exec_python_code(python_script_content, [PACKAGE_MAP.vunit], args);
        return result;
    }

    /**
     * Get project compile order using Pyodide
     * @param  file_list List of project files
     * @returns Compile order
    **/
    public async get_compile_order_pyodide(file_list: t_file[]): Promise<t_action_compile_order> {
        const result = await this.run_pydodide(file_list, "vunit_compile_order_pyodide");

        const result_return: t_action_compile_order = {
            file_order: [],
            successful: false,
            msg: ""
        };

        const compile_order: t_file[] = [];
        if (result.successful) {
            try {
                const rawdata = JSON.parse(result.return_value);
                for (let i = 0; i < rawdata.length; i++) {
                    const file_inst: t_file = {
                        name: rawdata[i].name,
                        file_type: file_utils.get_language_from_filepath(rawdata[i].name),
                        is_include_file: false,
                        include_path: "",
                        logical_name: rawdata[i].logical_name,
                        is_manual: false,
                        file_version: file_utils.get_default_version_for_filepath(rawdata[i].name),
                    };
                    compile_order.push(file_inst);
                }
                result_return.file_order = compile_order;
                result_return.successful = true;

            } catch (e) {
                result_return.msg = `${result.stderr}'\n'${result.stdout}\nError processing compile order output.`;
            }
        }
        else {
            result_return.successful = false;
            result_return.msg = `${result.stderr}'\n'${result.stdout}`;
        }
        return result_return;
    }


    /**
     * Get dependency tree using Pyodide
     * @param  file_list List of project files
     * @returns Dependency tree
    **/
    public async get_dependency_tree_pyodide(file_list: t_file[]) {
        const result = await this.run_pydodide(file_list, "vunit_dependencies_standalone_pyodide");

        const result_return: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };

        if (result.successful === true) {
            try {
                const dep_tree = JSON.parse(result.return_value);
                result_return.result = dep_tree;
                result_return.successful = true;
            } catch (e) {
                result_return.successful = false;
                result_return.msg = result.stderr + '\n' + result.stdout;
                return result_return;
            }
        }
        else {
            result_return.successful = false;
            result_return.msg = result.stderr + '\n' + result.stdout;
        }
        return result_return;
    }

    /**
     * Get dependency graph representation using Pyodide
     * @param  file_list List of project files
     * @returns Dependency graph
    **/
    public async create_dependency_graph_pyodide(file_list: t_file[]) {
        const result = await this.run_pydodide(file_list, "vunit_dependency_pyodide");

        const result_return: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };

        if (result.successful === true) {
            result_return.result = result.return_value;
        }
        else {
            result_return.successful = false;
            result_return.msg = result.stderr + '\n' + result.stdout;
        }
        return result_return;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Pure Python
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public async get_compile_order(file_list: t_file[], python_path: string): Promise<t_action_compile_order> {
        const hdl_file_list = this.clean_non_hdl_files(file_list);

        const project_files_json = JSON.stringify(hdl_file_list);
        const project_files_path = process_utils.create_temp_file(project_files_json);
        const compile_order_output = process_utils.create_temp_file("");

        const args = `"${project_files_path}" "${compile_order_output}"`;
        const python_script_path = path_lib.join(__dirname, "vunit_compile_order.py");
        const result = await python.exec_python_script(python_path, python_script_path, args);

        const result_return: t_action_compile_order = {
            file_order: [],
            successful: false,
            msg: ""
        };

        const compile_order: t_file[] = [];

        if (result.successful) {
            try {
                const rawdata = JSON.parse(file_utils.read_file_sync(compile_order_output));
                for (let i = 0; i < rawdata.length; i++) {
                    const file_inst: t_file = {
                        name: rawdata[i].name,
                        file_type: file_utils.get_language_from_filepath(rawdata[i].name),
                        is_include_file: false,
                        include_path: "",
                        logical_name: rawdata[i].logical_name,
                        is_manual: false,
                        file_version: file_utils.get_default_version_for_filepath(rawdata[i].name),
                    };
                    compile_order.push(file_inst);
                }
                result_return.file_order = compile_order;
                result_return.successful = true;

            } catch (e) {
                result_return.msg = `${result.stderr}'\n'${result.stdout}\nError processing compile order output.`;
            }
        }
        else {
            result_return.successful = false;
            result_return.msg = `${result.stderr}'\n'${result.stdout}`;
        }

        file_utils.remove_file(project_files_path);
        file_utils.remove_file(compile_order_output);

        // Add not HDL files
        file_list.forEach(file_inst => {
            let is_included = false;
            compile_order.forEach(file_included => {
                if (file_included.name === file_inst.name) {
                    is_included = true;
                }
            });

            if (!is_included) {
                compile_order.push(file_inst);
            }
        });
        result_return.file_order = compile_order;

        return result_return;
    }

    public async get_dependency_tree(file_list: t_file[], python_path: string) {
        const hdl_file_list = this.clean_non_hdl_files(file_list);

        const project_files_json = JSON.stringify(hdl_file_list);
        const project_files_path = process_utils.create_temp_file(project_files_json);
        const tree_graph_output = process_utils.create_temp_file("");

        const args = `"${project_files_path}" "${tree_graph_output}"`;
        const python_script_path = path_lib.join(__dirname, "vunit_dependencies_standalone.py");
        const result = await python.exec_python_script(python_path, python_script_path, args);

        const result_return: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };

        if (result.return_value === 0) {
            try {
                const rawdata = file_utils.read_file_sync(tree_graph_output);
                const dep_tree = JSON.parse(rawdata);
                result_return.result = dep_tree;
                result_return.successful = true;
            } catch (e) {
                result_return.successful = false;
                result_return.msg = result.stderr + '\n' + result.stdout;
                file_utils.remove_file(project_files_path);
                file_utils.remove_file(tree_graph_output);
                return result_return;
            }
        }
        else {
            result_return.successful = false;
            result_return.msg = result.stderr + '\n' + result.stdout;
        }
        file_utils.remove_file(project_files_path);
        file_utils.remove_file(tree_graph_output);
        return result_return;
    }

    private clean_non_hdl_files(file_list: t_file[]) {
        const hdl_file_list: t_file[] = [];
        for (let i = 0; i < file_list.length; i++) {
            const file_inst = file_list[i];
            if (hdl_utils.check_if_hdl_file(file_inst.name)) {
                hdl_file_list.push(file_inst);
            }
        }
        return hdl_file_list;
    }

    public async create_dependency_graph(file_list: t_file[], python_path: string) {
        const hdl_file_list = this.clean_non_hdl_files(file_list);

        // Create a temporal file with the json project
        const project_files_json = JSON.stringify(hdl_file_list);
        const tmp_filepath = process_utils.create_temp_file(project_files_json);

        const python_script_path = path_lib.join(__dirname, "vunit_dependency.py");
        const result = await python.exec_python_script(python_path, python_script_path, tmp_filepath);

        const result_return: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };

        if (result.return_value === 0) {
            result_return.result = result.stdout;
        }
        else {
            result_return.successful = false;
            result_return.msg = result.stderr + '\n' + result.stdout;
        }

        // Remove temporal file
        file_utils.remove_file(tmp_filepath);

        return result_return;
    }
}