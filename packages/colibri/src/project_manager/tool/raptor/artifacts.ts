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
    t_test_result, e_artifact_type, t_test_artifact, e_element_type
} from "../common";
import * as path_lib from "path";
import * as nunjucks from 'nunjucks';
import { e_config, e_tools_raptor } from "../../../config/config_declaration";
import { p_result } from "../../../process/common";
import * as file_utils from "../../../utils/file_utils";

export function get_results(config: e_config, base_path: string, working_directory: string, result: p_result) {
    const result_list: t_test_result[] = [];

    const result_definition = get_result_definition(config.tools.raptor);

    result_definition.forEach(step_inst => {
        const artifact_list: t_test_artifact[] = [];

        // Artifacts
        step_inst.report_list.forEach(report_inst => {

            let artifact_path = path_lib.join(base_path, report_inst.path);
            if (step_inst.suite_name !== "Simulation") {
                artifact_path = path_lib.join(base_path, 'reports', report_inst.path);
            }

            if (file_utils.check_if_path_exist(artifact_path)) {
                let artifact_type = e_artifact_type.SUMMARY;
                let element_type = e_element_type.HTML;
                let content = "";
                if (step_inst.suite_name === "Simulation") {
                    artifact_type = e_artifact_type.WAVEFORM;
                    element_type = e_element_type.FST;
                }
                else {
                    content = get_webview(path_lib.join(base_path, 'reports', report_inst.path));
                }

                const artifact: t_test_artifact = {
                    name: report_inst.name,
                    path: path_lib.join(base_path, report_inst.path),
                    content: content,
                    command: "",
                    artifact_type: artifact_type,
                    element_type: element_type
                };
                artifact_list.push(artifact);
            }
        });

        // Suite
        const test_result: t_test_result = {
            suite_name: step_inst.suite_name,
            name: step_inst.suite_name,
            edam: "edam_json",
            config_summary_path: "path_f",
            config: config,
            artifact: artifact_list,
            build_path: working_directory,
            successful: result.successful,
            stdout: result.stdout,
            stderr: result.stderr,
            time: 0,
            test_path: "result_inst.test_path"
        };

        result_list.push(test_result);
    });

    // TCL Project

    const artifact: t_test_artifact = {
        name: "Tcl project",
        path: path_lib.join(working_directory, 'prj.tcl'),
        content: "",
        command: "",
        artifact_type: e_artifact_type.SUMMARY,
        element_type: e_element_type.TEXT_FILE
    };
    const test_result: t_test_result = {
        suite_name: "Summary",
        name: "Summary",
        edam: "edam_json",
        config_summary_path: "path_f",
        config: config,
        artifact: [artifact],
        build_path: working_directory,
        successful: result.successful,
        stdout: result.stdout,
        stderr: result.stderr,
        time: 0,
        test_path: "result_inst.test_path"
    };

    result_list.unshift(test_result);


    return result_list;
}

function get_webview(path: string): string {
    const content = "";
    try {
        const json_data = JSON.parse(file_utils.read_file_sync(path));
        const template_path = path_lib.join(__dirname, 'report_webview.html.nj');
        const template = nunjucks.render(template_path, {
            data: json_data
        });

        const regex = new RegExp('teroshdlspace', 'g');
        const new_template = template.replace(regex, '&nbsp;');

        file_utils.save_file_sync("/home/carlos/Desktop/index.html",new_template)


        return new_template;
    } catch (error) {
        return content;
    }
}

function get_result_definition(config: e_tools_raptor) {
    const result_definition = [
        {
            suite_name: "Synthesis",
            report_list: [
                {
                    name: "Synthesis Utilization",
                    path: "synth_utilization.json"
                },
                {
                    name: "Synthesis Statistics",
                    path: "synth_design_stat.json"
                }
            ]
        },
        {
            suite_name: "Packing",
            report_list: [
                {
                    name: "Packing Utilization",
                    path: "packing_utilization.json"
                },
                {
                    name: "Packing Statistics",
                    path: "packing_design_stat.json"
                }
            ]
        },
        {
            suite_name: "Routing",
            report_list: [
                {
                    name: "Route Design Utilization",
                    path: "route_utilization.json"
                },
                {
                    name: "Route Design Statistics",
                    path: "route_design_stat.json"
                },
            ]
        },
        {
            suite_name: "Place",
            report_list: [
                {
                    name: "Place Design Utilization",
                    path: "place_utilization.json"
                },
                {
                    name: "Place Design Statistics",
                    path: "place_design_stat.json"
                },
            ]
        },
        {
            suite_name: "Timing Analysis",
            report_list: [
                {
                    name: "STA Utilization",
                    path: "sta_utilization.json"
                },
                {
                    name: "STA Statistics",
                    path: "sta_design_stat.json"
                },
            ]
        },
        {
            suite_name: "Simulation",
            report_list: [
                {
                    name: "RTL simulation",
                    path: config.waveform_rtl
                },
                {
                    name: "Gate simulation",
                    path: config.waveform_gate
                },
                {
                    name: "PNR simulation",
                    path: config.waveform_pnr
                },
            ]
        }
    ];
    return result_definition;
}