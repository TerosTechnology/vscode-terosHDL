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

import { t_file, t_action_result } from "../common";
import * as hdl_utils from "../../utils/hdl_utils";
import * as file_utils from "../../utils/file_utils";
import * as process_utils from "../../process/utils";
import * as python from "../../process/python";
import * as path_lib from 'path';
// import graphviz from 'graphviz-wasm';

export class Dependency_graph {
    // private dependency_graph_svg = "";
    private init = false;

    public async get_dependency_graph_svg(file_list: t_file[], python_path: string)
        : Promise<t_action_result> {
        const dependencies = await this.create_dependency_graph(file_list, python_path);
        return dependencies;
        if (dependencies.successful === false) {
            return dependencies;
        }

        if (this.init === false) {
            this.init = true;
            // await graphviz.loadWASM();
        }

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        try {
            return new Promise(function (resolve) {
                // const svg = graphviz.layout(dependencies.result);
                const result_return: t_action_result = {
                    result: 'svg',
                    successful: true,
                    msg: ""
                };

                resolve(result_return);
                // element.viz.renderString(dependencies.result).then(function (tps: string) {
                //     const result_return: t_action_result = {
                //         result: tps,
                //         successful: true,
                //         msg: ""
                //     };

                //     resolve(result_return);
                // });
            });
        } catch (e) {
            const result_return: t_action_result = {
                result: "",
                successful: false,
                msg: "Error generting dependency graph"
            };
            return result_return;
        }
    }

    public async get_compile_order(file_list: t_file[], python_path: string) {
        const hdl_file_list = this.clean_non_hdl_files(file_list);

        const project_files_json = JSON.stringify(hdl_file_list);
        const project_files_path = process_utils.create_temp_file(project_files_json);
        const compile_order_output = process_utils.create_temp_file("");

        const args = `"${project_files_path}" "${compile_order_output}"`;
        const python_script_path = path_lib.join(__dirname, "vunit_compile_order.py");
        const result = await python.exec_python_script(python_path, python_script_path, args);

        const result_return: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };

        let compile_order = [];
        if (result.return_value === 0) {
            try {
                const rawdata = file_utils.read_file_sync(compile_order_output);
                compile_order = JSON.parse(rawdata);
                result_return.result = compile_order;
            } catch (e) {
                result_return.successful = false;
                result_return.msg = result.stderr + '\n' + result.stdout;
                file_utils.remove_file(project_files_path);
                file_utils.remove_file(compile_order_output);
                return compile_order;
            }
        }
        else {
            result_return.successful = false;
            result_return.msg = result.stderr + '\n' + result.stdout;
        }

        file_utils.remove_file(project_files_path);
        file_utils.remove_file(compile_order_output);

        result_return.result = compile_order;

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

    private async create_dependency_graph(file_list: t_file[], python_path: string) {
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