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

import * as vscode from "vscode";
import * as element from "./element";
import * as path_lib from "path";
import { t_Multi_project_manager } from '../../../type_declaration';
import * as teroshdl2 from 'teroshdl2';
import * as utils from "../utils";
import { Run_output_manager } from "../run_output";
import { globalLogger } from "../../../logger";
import { t_message_level, showMessage } from "../../../utils/utils";
import * as yaml from "js-yaml";
import { BaseView } from "../baseView";
import { e_viewType } from "../common";

export class Project_manager extends BaseView {
    private tree: element.ProjectProvider;
    private project_manager: t_Multi_project_manager;
    private emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter;
    private run_output_manager: Run_output_manager;
    private context: vscode.ExtensionContext;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager,
        emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter,
        run_output_manager: Run_output_manager) {

        super(e_viewType.PROJECT);

        this.set_commands();

        this.emitterProject = emitterProject;
        this.project_manager = manager;
        this.tree = new element.ProjectProvider(manager);
        this.run_output_manager = run_output_manager;

        this.context = context;

        const provider = new element.ProjectDecorator();
        context.subscriptions.push(vscode.window.registerFileDecorationProvider(provider));

        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.ProjectProvider.getViewID(), 
            this.tree as element.BaseTreeDataProvider<element.Project>));
    }

    public getRefreshEvent(): teroshdl2.project_manager.projectEmitter.e_event[] {
        return [];
    }

    open_doc() {
        vscode.env.openExternal(vscode.Uri.parse('https://terostechnology.github.io/terosHDLdoc/'));
    }

    set_commands() {
        vscode.commands.registerCommand("teroshdl.documentation", () => this.open_doc());
        vscode.commands.registerCommand("teroshdl.check_dependencies", () => this.check_dependencies());

        vscode.commands.registerCommand("teroshdl.view.project.add", (item) => this.add_project(item));
        vscode.commands.registerCommand("teroshdl.view.project.select", (item) => this.select_project(item));
        vscode.commands.registerCommand("teroshdl.view.project.delete", (item) => this.delete_project(item));
        vscode.commands.registerCommand("teroshdl.view.project.rename", (item) => this.rename_project(item));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Project
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async add_project(item: element.Project) {
        const PROJECT_ADD_TYPES = [
            "Create an empty Generic project",
            "Create an empty Intel® Quartus® Prime project",
            "Load an existing Intel® Quartus® Prime project",
            "Load project from JSON EDAM",
            "Load project from YAML EDAM",
            "Load project from VUnit run.py",
            "Load an example project",
        ];

        const picker_value = await vscode.window.showQuickPick(PROJECT_ADD_TYPES, {
            placeHolder: "Add/load a project.",
        });

        // Empty project
        if (picker_value === PROJECT_ADD_TYPES[0]) {
            // Create project
            const project_name = await utils.get_from_input_box("Set the project name", "Project name");
            if (project_name !== undefined) {
                try {
                    this.project_manager.add_project(
                        new teroshdl2.project_manager.project_manager.Project_manager(project_name, this.emitterProject
                        ));
                } catch (error) {
                }
            }
        }
        // Create new Quartus project
        else if (picker_value === PROJECT_ADD_TYPES[1]) {
            // Working directory
            const working_directory = await
                utils.get_from_open_dialog("What is the working directory for this project?", true, false, false,
                    "Choose", {});
            if (working_directory.length !== 1) {
                return;
            }

            // Project name
            const project_name = await utils.get_from_input_box("What is the name of this project?", "Project name");
            if (project_name === undefined) {
                return;
            }
            try {
                // Device family
                const family_list = await teroshdl2.project_manager.quartus
                    .getFamilyAndParts(teroshdl2.config.configManager.GlobalConfigManager.getInstance().get_config(),
                        this.emitterProject);
                const family_list_string = family_list.map(x => x.family);
                let picker_family = await vscode.window.showQuickPick(family_list_string, {
                    placeHolder: "Device family",
                });
                if (picker_family === undefined) {
                    return;
                }
                // Device part
                const part_list = family_list.filter(x => x.family === picker_family)[0].part_list;

                const picker_part = await vscode.window.showQuickPick(part_list, {
                    placeHolder: "Device",
                });
                if (picker_part === undefined) {
                    return;
                }

                // Create project
                const quartusProject =
                    await teroshdl2.project_manager.quartusProjectManager.QuartusProjectManager.fromNewQuartusProject(
                        teroshdl2.config.configManager.GlobalConfigManager.getInstance().get_config(),
                        project_name, picker_family, picker_part,
                        working_directory[0], this.emitterProject);

                // Add project to manager
                this.project_manager.add_project(quartusProject);

                const msg = `Intel@ Quartus@ Prime project ${quartusProject.get_name()} created.`;
                showMessage(msg, t_message_level.INFO);
            } catch (error) {
                const msg = "Intel@ Quartus@ Prime project can't be created. Check the TerosHDL: Debug output.";
                showMessage(msg, t_message_level.WARNING);
            }
        }
        // Load from Quartus
        else if (picker_value === PROJECT_ADD_TYPES[2]) {
            const path_list = await utils.get_from_open_dialog("Load Quartus project", false, true, false,
                "Select Quartus project", { 'Quartus project (*.qsf)': ['qsf'] });
            for (const path of path_list) {
                await this.create_project_from_quartus(path);
            }
        }
        // Load from JSON EDAM
        else if (picker_value === PROJECT_ADD_TYPES[3]) {
            const path_list = await utils.get_from_open_dialog("Load project", false, true, true,
                "Select JSON EDAM files", { 'JSON files (*.json, *.JSON)': ['json', 'JSON'] });
            for (const path of path_list) {
                await this.create_project_from_json(path);
            };
        }
        // Load from YAML EDAM
        else if (picker_value === PROJECT_ADD_TYPES[4]) {
            const path_list = await utils.get_from_open_dialog("Load project", false, true, true,
                "Select YAML EDAM files", { 'YAML files (*.yaml, *.yml)': ['yaml', 'yml'] });
            for (const path of path_list) {
                await this.create_project_from_yaml(path);
            };
        }
        // Load from VUnit
        else if (picker_value === PROJECT_ADD_TYPES[5]) {
            // Create project
            const project_name = await utils.get_from_input_box("Set the project name", "Project name");
            if (project_name !== undefined) {
                try {
                    const prj = new teroshdl2.project_manager.project_manager.Project_manager(
                        project_name, this.emitterProject
                    );
                    this.project_manager.add_project(prj);
                    await utils.add_sources_from_vunit(prj, true);
                } catch (error) {
                }
            }
        }
        // Load an example
        else if (picker_value === PROJECT_ADD_TYPES[6]) {
            const project_examples_types = ['Documenter examples', 'State machine examples',
                'Xsim', 'GHDL', 'Icarus', 'IceStorm', 'ModelSim',
                'Vivado', 'Yosys', 'VUnit', 'cocotb', 'raptor_counter', 'raptor_counter_vhdl',
                'raptor_aes_decrypt_fpga', 'raptor_and2_gemini'];
            let picker_value = await vscode.window.showQuickPick(project_examples_types, {
                placeHolder: "Choose an example project.",
            });
            if (picker_value !== undefined) {
                if (picker_value === 'Documenter examples') {
                    picker_value = 'documenter';
                }
                if (picker_value === 'State machine examples') {
                    picker_value = 'state_machine';
                }

                const project_path = path_lib.join(this.context.extensionUri.fsPath, "resources",
                    "project_manager", "examples", picker_value.toLowerCase(), 'project.yml');
                await this.create_project_from_yaml(project_path);
            }
        }
    }

    async create_project_from_quartus(prj_path: string) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Loading Intel@ Quartus@ Project@...",
            cancellable: false
        }, (_progress, _token) => {
            return new Promise<void>(async (resolve) => {
                try {
                    // Create project
                    const quartusProject =
                        await teroshdl2.project_manager.quartusProjectManager.QuartusProjectManager.fromExistingQuartusProject(
                            teroshdl2.config.configManager.GlobalConfigManager.getInstance().get_config(),
                            prj_path, this.emitterProject
                        );
                    // Add project to manager
                    this.project_manager.add_project(quartusProject);
                    const msg = `Intel@ Quartus@ Prime project ${quartusProject.get_name()} loaded.`;
                    showMessage(msg, t_message_level.INFO);
                    resolve();
                } catch (error) {
                    const msg = "Intel@ Quartus@ Prime project can't be loaded. Check the TerosHDL: Debug Output.";
                    showMessage(msg, t_message_level.WARNING);
                    resolve();
                }
            });
        });
    }

    async create_project_from_json(prj_path: string) {
        try {
            const prj = await teroshdl2.project_manager.project_manager.Project_manager.fromJson(
                JSON.parse(teroshdl2.utils.file.read_file_sync(prj_path)), prj_path, this.emitterProject);
            this.project_manager.add_project(prj);
        } catch (error) {
        }
    }

    async create_project_from_yaml(prj_path: string) {
        try {
            const fileContent = teroshdl2.utils.file.read_file_sync(prj_path)
            const repJSON = yaml.load(fileContent, { json: true });
            const prj = await teroshdl2.project_manager.project_manager.Project_manager.fromJson(
                repJSON, prj_path, this.emitterProject);
            this.project_manager.add_project(prj);
        } catch (error) {
            console.log(error)
        }
    }

    select_project(item: element.Project) {
        try {
            this.project_manager.set_selected_project(this.project_manager.get_project_by_name(item.get_project_name()));
            this.run_output_manager.clear();
        } catch (error) {
        }
    }

    delete_project(item: element.Project) {
        try {
            this.project_manager.delete_project(this.project_manager.get_project_by_name(item.get_project_name()));
        } catch (error) {
        }
    }

    async rename_project(item: element.Project) {
        const new_project_name = await utils.get_from_input_box("New project name", "Project name");
        if (new_project_name !== undefined) {
            try {
                this.project_manager.rename_project(this.project_manager.get_project_by_name(item.get_project_name()), new_project_name);
            } catch (error) {
            }
        }
    }

    refresh_tree() {
        this.tree.refresh();
    }

    get_doc_msg(msg_url: string) {
        const doc_msg = `Check the documentation to install it: ${msg_url}`;
        return doc_msg;
    }

    async check_dependencies() {
        const options: teroshdl2.process.python.python_options = {
            path: teroshdl2.config.configManager.GlobalConfigManager.getInstance().get_config().general.general.pypath
        };

        const intro_info = "-------> ";
        const intro_warning = "----> ";
        const intro_error = "------> ";

        globalLogger.info('Checking dependencies...', true);

        // Check python
        const python_result = await teroshdl2.process.python.get_python_path(options);
        if (python_result.successful === false) {
            const doc_msg_link = "https://terostechnology.github.io/terosHDLdoc/docs/getting_started/installation#2-python3";
            const doc_msg = this.get_doc_msg(doc_msg_link);

            globalLogger.error(`${intro_error}Python not found. If you are using system path try setting the complete Python path. ${doc_msg}`);
        }
        else {
            globalLogger.info(`${intro_info} Python found: ${python_result.python_path}`);
            globalLogger.info(`${intro_info} Python found in path: ${python_result.python_complete_path}`);

            const package_list = ["vunit", "cocotb", "edalize"];
            const package_list_optional = ["cocotb"];

            for (const package_name of package_list) {
                let optional_msg = "";

                const package_result = await teroshdl2.process.python.check_python_package(python_result.python_path,
                    package_name);
                if (!package_result) {
                    const doc_msg_link = "https://terostechnology.github.io/terosHDLdoc/docs/getting_started/installation#3-python3-package-dependencies";
                    const doc_msg = this.get_doc_msg(doc_msg_link);

                    if (package_list_optional.includes(package_name)) {
                        globalLogger.warn(`${intro_warning} ${package_name} (optional installation) not found. ${doc_msg}`);
                    }
                    else {
                        globalLogger.error(`${intro_error} ${package_name} ${optional_msg} not found. ${doc_msg}`);

                    }
                }
                else {
                    globalLogger.info(`${intro_info} ${package_name} found ${optional_msg}`);
                }
            }
        }

        // Check make
        const make_binary_dir =
            teroshdl2.config.configManager.GlobalConfigManager.getInstance().get_config().general.general.makepath;
        let make_binary_path = ("make");
        if (make_binary_dir !== "") {
            make_binary_path = path_lib.join(make_binary_dir, make_binary_path);
        }

        const proc = new teroshdl2.process.process.Process();
        const make_result = await proc.exec_wait(`${make_binary_path} --version`);
        if (!make_result.successful) {
            const doc_msg_link = "https://terostechnology.github.io/terosHDLdoc/docs/getting_started/installation#4-make";
            const doc_msg = this.get_doc_msg(doc_msg_link);
            globalLogger.error(`${intro_error}Make not found in path: ${make_binary_path}. Check that the path is correct. ${doc_msg}`);
            globalLogger.error(make_result.stderr);
            globalLogger.error(make_result.stdout);
        }
        else {
            globalLogger.info(`${intro_info} Make found in path: ${make_binary_path}.`);
        }
    }
}

