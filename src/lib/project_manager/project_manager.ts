// Copyright 2020-2021 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of TerosHDL.
//
// TerosHDL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// TerosHDL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from "vscode";
import * as path from "path";
import * as Config_view from "./config_view";
import * as Edam from "./edam_project";
import * as Config from "./config";
import * as Tool_manager from "./tools/tool_manager";
import * as Tree_types from "./tree_types";
import * as Tree_data_provider from "./tree_data_provider";
import * as utils from "./utils";
import * as utils_vscode from "../utils/utils";
import * as Dependencies_viewer from "../dependencies_viewer/dependencies_viewer";
import { Hdl_dependencies_tree } from './hdl_dependencies_tree';
import * as Output_channel_lib from '../utils/output_channel';
import * as config_reader_lib from "../utils/config_reader";
import * as netlist_viewer from "../netlist_viewer/netlist_viewer";
import * as vcdrom from "./vcdrom";

const ERROR_CODE = Output_channel_lib.ERROR_CODE;
const MSG_CODE = Output_channel_lib.MSG_CODE;

const path_lib = require("path");
const fs = require("fs");
const os = require("os");

export class Project_manager {
    tree!: Tree_data_provider.TreeDataProvider;
    projects: Tree_types.TreeItem[] = [];
    config_view;
    edam_project_manager;
    config_file;
    workspace_folder;
    private last_results;
    private init: boolean = false;
    private treeview;
    private init_test_list: boolean = false;
    private dependencies_viewer_manager: Dependencies_viewer.default | undefined;
    private hdl_dependencies_provider: Hdl_dependencies_tree;
    private context;
    private output_channel: Output_channel_lib.Output_channel;
    private config_reader: config_reader_lib.Config_reader;
    private netlist_viewer_manager: netlist_viewer.default;
    private tool_manager: Tool_manager.Tool_manager;

    constructor(context: vscode.ExtensionContext, output_channel, config_reader: config_reader_lib.Config_reader) {
        this.config_reader = config_reader;
        this.output_channel = output_channel;
        this.context = context;
        this.edam_project_manager = new Edam.Edam_project_manager(output_channel);

        this.config_file = new Config.Config(context.extensionPath);
        this.workspace_folder = this.config_file.get_workspace_folder();
        this.config_view = new Config_view.default(context, this.config_file);
        this.netlist_viewer_manager = new netlist_viewer.default(context, output_channel, config_reader, true);
        this.tool_manager = new Tool_manager.Tool_manager(context, output_channel, 
                    this.config_file, config_reader, this.edam_project_manager);


        this.tree = new Tree_data_provider.TreeDataProvider();
        this.set_default_projects();

        this.treeview = vscode.window.createTreeView("teroshdl_tree_view", {
            showCollapseAll: true,
            treeDataProvider: this.tree,
            canSelectMany: true,
        });
        vscode.commands.registerCommand("teroshdl_tree_view.dependencies_viewer", () => this.open_dependencies_viewer());
        vscode.commands.registerCommand("teroshdl_tree_view.add_project", () => this.add_project());
        vscode.commands.registerCommand("teroshdl_tree_view.add_file", (item) => this.add_file(item));
        vscode.commands.registerCommand("teroshdl_tree_view.delete_file", (item) => this.delete_file(item));
        vscode.commands.registerCommand("teroshdl_tree_view.delete_library", (item) => this.delete_library(item));
        vscode.commands.registerCommand("teroshdl_tree_view.add_library", (item) => this.add_library(item));
        vscode.commands.registerCommand("teroshdl_tree_view.delete_project", (item) => this.delete_project(item));
        vscode.commands.registerCommand("teroshdl_tree_view.select_project", (item) => this.select_project(item));
        vscode.commands.registerCommand("teroshdl_tree_view.rename_project", (item) => this.rename_project(item));
        vscode.commands.registerCommand("teroshdl_tree_view.rename_library", (item) => this.rename_library(item));
        vscode.commands.registerCommand("teroshdl_tree_view.config", () => this.config());
        vscode.commands.registerCommand("teroshdl_tree_view.config_check", () => this.config_check());
        vscode.commands.registerCommand("teroshdl_tree_view.simulate", () => this.simulate());
        vscode.commands.registerCommand("teroshdl_tree_view.set_top", (item) => this.set_top(item));

        vscode.commands.registerCommand("teroshdl_tree_view.run_tool_no_gui", (item) => this.run_tool_no_gui(item));
        vscode.commands.registerCommand("teroshdl_tree_view.run_tool_with_gui", (item) => this.run_tool_with_gui(item));

        vscode.commands.registerCommand("teroshdl_tree_view.go_to_code", (item) => this.go_to_code(item));
        vscode.commands.registerCommand("teroshdl_tree_view.refresh_tests", () => this.refresh_tests());
        vscode.commands.registerCommand("teroshdl_tree_view.save_project", (item) => this.save_project_to_file(item));
        vscode.commands.registerCommand("teroshdl_tree_view.stop", () => this.stop());
        vscode.commands.registerCommand("teroshdl_tree_view.open_file", (item) => this.open_file(item));
        vscode.commands.registerCommand("teroshdl_tree_view.save_doc", (item) => this.save_doc(item));
        vscode.commands.registerCommand("teroshdl_tree_view.help", (item) => this.help());
        vscode.commands.registerCommand("teroshdl_tree_view.netlist_project", (item) => this.netlist(item));
        vscode.commands.registerCommand("teroshdl.start_vcd", (item) => this.start_vcd(item));

        this.hdl_dependencies_provider = new Hdl_dependencies_tree(context, output_channel);
        vscode.window.registerTreeDataProvider('teroshdl_dependencies_tree_view', this.hdl_dependencies_provider);
        vscode.commands.registerCommand('teroshdl_dependencies_tree_view.refreshEntry', () => this.hdl_dependencies_provider.refresh());
        vscode.commands.registerCommand("teroshdl_dependencies_tree_view.open_file", (item) => this.open_file(item));
        vscode.commands.registerCommand("teroshdl_dependencies_tree_view.dependencies_viewer", () => this.open_dependencies_viewer());
    }

    start_vcd(item) {
        // if (item.extension !== 'vcd') {
        //     return;
        // }
        let waveform_path = item.path;

        let waveform_viewer = this.config_reader.get_waveform_viewer();
        if (waveform_viewer === 'gtkwave') {
            let shell = require('shelljs');
            let command = `gtkwave ${waveform_path}`;
            shell.exec(command, { async: true });
        }
        else if (waveform_viewer === "impulse") {
            let uri = vscode.Uri.file(waveform_path);
            vscode.commands.executeCommand("vscode.openWith", uri, "de.toem.impulse.editor.records");
        }
        else {
            let vcdrom_inst = new vcdrom.default(this.context);
            vcdrom_inst.update_waveform(waveform_path);
        }
    }

    help() {
        const resolve = require('path').resolve;

        const help_index_path = path.join(__filename, "..", "..", "..", "..", "resources", "project_manager", "help", 'index.html');
        let help_index_path_absolute = resolve(help_index_path);

        const open = require('open');
        open(help_index_path_absolute);
    }

    async netlist(item) {
        let project_name = item.project_name;
        let prj = this.edam_project_manager.get_project(project_name);
        this.netlist_viewer_manager.create_viewer();
        await this.netlist_viewer_manager.generate_project_netlist(prj);
    }

    open_dependencies_viewer() {
        let selected_project = this.edam_project_manager.selected_project;
        if (selected_project === "") {
            this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_TREE_VIEW, '');
            return;
        }
        let prj = this.edam_project_manager.get_project(selected_project);
        let config = this.config_view.get_config_documentation();

        if (this.dependencies_viewer_manager === undefined) {
            this.dependencies_viewer_manager = new Dependencies_viewer.default(this.context, this.output_channel, this.config_reader);
        }

        this.dependencies_viewer_manager.open_viewer(prj, config);
    }

    update_dependencies_viewer() {
        let selected_project = this.edam_project_manager.selected_project;
        if (selected_project === "") {
            this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_TREE_VIEW, '');
            return;
        }
        let prj = this.edam_project_manager.get_project(selected_project);
        let config = this.config_view.get_config_documentation();
        if (this.dependencies_viewer_manager !== undefined) {
            this.dependencies_viewer_manager.update_viewer(prj, config, false);
        }
    }

    async refresh_lint() {
        if (this.init === false) {
            this.init = false;
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        this.save_toml();
        try{
            vscode.commands.executeCommand("teroshdl.vhdlls.restart");
            await this.save_compile_order();
        }
        catch{};
    }

    async save_compile_order() {
        let developer_mode = this.config_reader.get_developer_mode();

        if (developer_mode === true) {
            let selected_project = this.edam_project_manager.selected_project;

            if (selected_project === "") {
                return;
            }
            let prj = this.edam_project_manager.get_project(selected_project);
            if (prj === undefined) {
                return;
            }
            let pypath = await this.config_reader.get_python_path_binary(false);

            let compile_order = await prj.get_compile_order(pypath);

            if (compile_order === undefined) {
                return;
            }
            let file_path = path_lib.join(os.homedir(), '.teroshdl_compile_order.toml');
            let toml = "[libraries]\n\n";
            toml += 'lib.files = [\n';
            for (let i = 0; i < compile_order.length; i++) {
                const element = compile_order[i];
                toml += `'${element}'\n,`;
            }
            toml += ']\n';
            fs.writeFileSync(file_path, toml);
        }
    }

    save_toml(): string[] {
        let files_toml: string[] = [];
        let file_path = `${os.homedir()}${path.sep}.vhdl_ls.toml`;
        let libraries = this.get_active_project_libraries();
        let toml = "[libraries]\n\n";
        if (libraries !== undefined) {
            for (let i = 0; i < libraries.length; i++) {
                let library = libraries[i];
                let files_in_library = "";
                for (let j = 0; j < library.files.length; j++) {
                    const file_in_library = library.files[j];
                    const path = require("path");
                    let filename = path.basename(file_in_library);
                    const teroshdl = require('teroshdl');
                    let lang = teroshdl.Utils.get_lang_from_path(filename);
                    if (lang === 'vhdl') {
                        files_in_library += `  '${file_in_library}',\n`;
                        files_toml.push(file_in_library);
                    }
                }
                let lib_name = library.name;
                if (lib_name === "") {
                    lib_name = "none";
                }
                if (library.name === undefined || library.name === '') {
                    library.name = 'work';
                }
                toml += `${library.name}.files = [\n${files_in_library}]\n\n`;
            }
        }
        fs.writeFileSync(file_path, toml);
        return files_toml;
    }

    open_file(item) {
        let path = item.path;
        utils.open_file(path, this.output_channel);
    }

    get_active_project_libraries() {
        let selected_project = this.edam_project_manager.selected_project;
        if (selected_project === "") {
            return;
        }
        let prj = this.edam_project_manager.get_project(selected_project);
        if (prj === undefined) {
            return [];
        }
        let files = prj.get_normalized_project().libraries;
        return files;
    }

    get_active_project_absolute_path() {
        let selected_project = this.edam_project_manager.selected_project;
        if (selected_project === "") {
            return;
        }
        let prj = this.edam_project_manager.get_project(selected_project);
        if (prj === undefined) {
            return undefined;
        }
        let abs = prj.relative_path + path_lib.sep;
        return abs;
    }

    async refresh_tests() {
        this.last_results = [];
        this.update_tree();
    }

    async save_project_to_file(item) {
        let project_name = item.project_name;
        vscode.window
            .showSaveDialog({
                saveLabel: "Save project",
                filters: { "YAML (.yml)": ["yml"] },
            })
            .then((value) => {
                if (value !== undefined) {
                    let path = value.fsPath;
                    let prj = this.edam_project_manager.get_project(project_name);
                    let tool_configuration = this.config_file.get_config_of_selected_tool();

                    let extension = path_lib.extname(path).toLowerCase();
                    if (extension === '.json') {
                        prj.save_as_json(path, tool_configuration);
                    }
                    else {
                        prj.save_as_yml(path, tool_configuration);
                    }
                    this.output_channel.show_info_message(MSG_CODE.SAVE_PROJECT, path);
                    this.update_tree();
                }
            });
    }

    async set_default_projects() {
        let selected_project = this.config_file.selected_project;
        if (selected_project !== "" && selected_project !== undefined) {
            this.edam_project_manager.selected_project = selected_project;
        }
        let current_projects = this.config_file.projects;
        await this.edam_project_manager.create_projects_from_edam(current_projects);
        await this.update_tree();
        this.refresh_lint();
    }

    async run_tool_no_gui(item) {
        let tests: string[];
        if (item === undefined) {
            tests = [];
        }
        else {
            tests = [item.label];
        }
        let gui = false;
        this.run_tool(tests, gui);
    }

    async run_tool_with_gui(item) {
        let tests: string[];
        if (item === undefined) {
            tests = [];
        }
        else {
            tests = [item.label];
        }
        let gui = true;
        this.run_tool(tests, gui);
    }

    async run_tool(tests, gui) {
        let results = <[]>(
            await this.tool_manager.run(
                tests,
                gui
            )
        );

        this.last_results = results;
        let force_fail_all = false;
        if (results.length === 0) {
            force_fail_all = true;
        }
        this.set_results(force_fail_all);
    }

    async simulate() {
        let selected_project = this.edam_project_manager.selected_project;
        if (selected_project === "") {
            this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_SIMULATION, '');
            return;
        }
        let prj = this.edam_project_manager.get_project(selected_project);
        if (prj === undefined) {
            this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_SIMULATION, '');
            return;
        }
        if (prj.toplevel_path === '' || prj.toplevel_path === undefined) {
            this.output_channel.show_message(ERROR_CODE.SELECT_TOPLEVELPATH, '');
            return;
        }

        this.run_tool([], false);
    }

    async get_toplevel_selected_prj(verbose: boolean) {
        let selected_project = this.edam_project_manager.selected_project;
        if (selected_project === "" && verbose === true) {
            this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_SIMULATION, '');
            return;
        }
        try {
            let prj = this.edam_project_manager.get_project(selected_project);
            let toplevel_path = prj.toplevel_path;
            if (toplevel_path === undefined) {
                return '';
            }
            let toplevel = await utils.get_toplevel_from_path(toplevel_path);
            if ((toplevel === '' || toplevel === undefined) && verbose === true) {
                this.output_channel.show_message(ERROR_CODE.SELECT_TOPLEVEL, '');
            }
            return toplevel;
        }
        catch {
            return '';
        }
    }

    get_toplevel_path_selected_prj() {
        let selected_project = this.edam_project_manager.selected_project;
        if (selected_project === "") {
            this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_SIMULATION, '');
            return;
        }
        let prj = this.edam_project_manager.get_project(selected_project);
        if (prj === undefined) {
            return '';
        }
        let toplevel_path = prj.toplevel_path;
        return toplevel_path;
    }

    getline_numberof_char(path, index) {
        let data = fs.readFileSync(path, "utf8");
        const lines = data.split(/\r?\n/);
        let charsToGo = index;
        let lineIndex = 0;
        while (lineIndex < lines.length) {
            const line = lines[lineIndex];
            const char = line[charsToGo];
            if (char) {
                return { row: lineIndex, col: charsToGo };
            }
            charsToGo -= line.length;
            lineIndex++;
        }
        return "None";
    }

    async go_to_code(item) {
        let location = item.location;
        if (location === undefined) {
            return;
        }
        let open_path = location.file_name;
        let position = <{}>this.getline_numberof_char(open_path, location.offset);

        let data = fs.readFileSync(open_path, "utf8");
        let row = data.substr(0, location.offset).split(/\r?\n/).length - 1;

        let arr = data.substr(0, location.offset).split(/\r?\n/);
        let element_arr = arr[arr.length - 1];
        let col = element_arr.length;

        let col_0 = col;
        let col_1 = col + location.length;

        if (row < 0) {
            row = 0;
        }
        if (col_0 < 0) {
            col_0 = 0;
        }
        if (col_1 < 0) {
            col_1 = 0;
        }

        let pos_1 = new vscode.Position(row, col_0);
        let pos_2 = new vscode.Position(row, col_1);

        vscode.workspace.openTextDocument(open_path).then((doc) => {
            vscode.window.showTextDocument(doc, vscode.ViewColumn.One).then((editor) => {
                // Line added - by having a selection at the same position twice, the cursor jumps there
                editor.selections = [new vscode.Selection(pos_1, pos_2)];

                // And the visible range jumps there too
                var range = new vscode.Range(pos_1, pos_2);
                editor.revealRange(range);
            });
        });
    }

    set_results(force_fail_all) {
        let tool_configuration = this.config_file.get_config_of_selected_tool();
        if (tool_configuration === undefined) {
            return [];
        }
        this.tree.set_results(this.last_results, force_fail_all);
    }

    set_top_from_project(project_name, library_name, path) {
        this.edam_project_manager.set_top(project_name, library_name, path);
        this.tree.select_top(project_name, library_name, path);
        this.save_project();
    }

    async set_top(item) {
        let project_name = item.project_name;
        let library_name = item.library_name;
        let path = item.path;
        await this.set_top_from_name(project_name, library_name, path);
    }

    async set_top_from_name(project_name, library_name, path) {
        await this.edam_project_manager.set_top(project_name, library_name, path);
        // this.tree.select_top(project_name, library_name, path);
        this.save_project();
        this.update_tree();
    }

    stop() {
        this.tool_manager.stop();
    }

    async config() {
        this.config_view.open();

    }
    async config_check() {
        await this.config_reader.check_configuration();
    }

    async update_tree() {
        this.update_dependencies_viewer();
        let test_list_initial = [{ name: "Loading tests...", location: undefined }];
        let normalized_prjs = this.edam_project_manager.get_normalized_projects();
        // Set "loading test" message
        this.tree.update_super_tree(normalized_prjs, test_list_initial);
        let edam_projects = this.edam_project_manager.get_edam_projects();
        this.config_file.set_projects(edam_projects);

        let selected_project = this.config_file.selected_project;
        if (selected_project !== "") {
            this.tree.select_project(selected_project);
        }

        this.set_default_tops();
        this.set_results(false);

        let test_list: {}[] = [{
            attributes: undefined,
            test_type: undefined,
            name: 'Tool is not configured',
            location: undefined
        }];

        test_list = await this.tool_manager.get_test_list();
        // Show the test list
        this.tree.update_super_tree(normalized_prjs, test_list);

        if (selected_project !== "") {
            this.tree.select_project(selected_project);
        }
        this.set_default_tops();
        this.set_results(false);
        this.init_test_list = true;
        await this.set_dependency_tree();
    }

    async set_dependency_tree() {
        let selected_project = this.edam_project_manager.selected_project;
        if (selected_project === "") {
            return;
        }
        let prj = this.edam_project_manager.get_project(selected_project);
        if (prj === undefined) {
            return;
        }
        //Check if files exist
        let check_files = prj.check_if_files_exist();

        let toplevel_path = prj.toplevel_path;
        let pypath = await this.config_reader.get_python_path_binary(false);
        let dependency_tree = await prj.get_dependency_tree(pypath);
        if (dependency_tree.root === undefined || check_files.error === true) {
            let error_message = dependency_tree.error;
            dependency_tree = {
                root: [
                    { filename: "", entity: error_message, dependencies: [] }
                ]
            };
            toplevel_path = error_message;
        }
        this.hdl_dependencies_provider.set_hdl_tree(dependency_tree, toplevel_path);
        if (check_files.error === true) {
            this.output_channel.show_message(ERROR_CODE.FILES_IN_PROJECT_NO_EXIST, check_files.files);
        }
    }

    set_default_tops() {
        let tops = this.edam_project_manager.get_tops();
        for (let i = 0; i < tops.length; i++) {
            const top = tops[i];
            this.set_top_from_project(top.project_name, top.toplevel_library, top.toplevel_path);
        }
    }

    save_project() {
        let edam_projects = this.edam_project_manager.get_edam_projects();
        this.config_file.set_projects(edam_projects);
    }


    async add_file(item) {
        const files_add_types = ["Select files from browser", "Load files from file list (CSV)", "Load all files in folder and subfolders"];
        let project_name = item.project_name;

        // Choose type
        vscode.window.showQuickPick(files_add_types, { placeHolder: "Choose file", }).then((files_type) => {
            if (files_type === undefined) {
                return;
            }
            // Files from browser
            else if (files_type === files_add_types[0]) {
                this.add_file_from_item(item);
            }
            // Load from file
            else if (files_type === files_add_types[1]) {
                // Select file
                vscode.window.showOpenDialog({ canSelectMany: false }).then((value) => {
                    if (value === undefined) {
                        return;
                    }
                    let file_path = value[0].fsPath;
                    let file_list = fs.readFileSync(file_path, "utf8");
                    let file_list_array = file_list.split(/\r?\n/);

                    for (let i = 0; i < file_list_array.length; ++i) {
                        let element = file_list_array[i];
                        if (element.trim() !== '') {
                            try {
                                let lib_inst = element.split(',')[0].trim();
                                let file_inst = element.split(',')[1].trim();
                                if (lib_inst === "") {
                                    lib_inst = "";
                                }
                                let complete_file_path = file_inst;
                                if (path.isAbsolute(file_inst) === false) {
                                    let dirname_csv = path_lib.dirname(file_path);
                                    complete_file_path = path_lib.join(dirname_csv, file_inst);
                                }
                                this.edam_project_manager.add_file(project_name, complete_file_path, false, "", lib_inst);
                            }
                            catch (e) {
                                return;
                            }
                        }
                    }
                    this.refresh_lint();
                    this.update_tree();
                });
            }
            //Load files in folder and subfolders
            else if (files_type === files_add_types[2]) {
                // Select file
                vscode.window.showOpenDialog({ canSelectMany: false, canSelectFolders: true, canSelectFiles: false }).then((value) => {
                    if (value === undefined) {
                        return;
                    }
                    let folder_path = value[0].fsPath;

                    let files_list_array = utils_vscode.get_files_from_dir_recursive(folder_path);
                    let library_name = item.library_name;
                    for (let i = 0; i < files_list_array.length; ++i) {
                        if (library_name === "") {
                            library_name = "";
                        }
                        this.edam_project_manager.add_file(project_name, files_list_array[i], false, "", library_name);
                        if (this.edam_project_manager.get_number_of_files_of_project(project_name) === 1) {
                            this.set_top_from_name(project_name, library_name, value[i].fsPath);
                        }
                    }

                    this.refresh_lint();
                    this.update_tree();
                });
            }
        });
    }

    async add_file_from_item(item) {
        let library_name = item.library_name;
        let project_name = item.project_name;
        vscode.window.showOpenDialog({ canSelectMany: true }).then((value) => {
            if (value !== undefined) {
                for (let i = 0; i < value.length; ++i) {
                    if (library_name === "") {
                        library_name = "";
                    }
                    this.edam_project_manager.add_file(project_name, value[i].fsPath, false, "", library_name);
                    if (this.edam_project_manager.get_number_of_files_of_project(project_name) === 1) {
                        this.set_top_from_name(project_name, library_name, value[i].fsPath);
                    }
                }
                this.update_tree();
                this.refresh_lint();
            }
        });
    }

    async select_project(item) {
        let project_name = item.project_name;
        this.select_project_from_name(project_name);
        this.refresh_lint();
        this.update_tree();
    }

    async select_project_from_name(project_name) {
        this.config_file.set_selected_project(project_name);
        this.edam_project_manager.select_project(project_name);
        this.tree.select_project(project_name);
    }

    async rename_project(item) {
        let project_name = item.project_name;
        vscode.window.showInputBox({ prompt: "Set the project name", value: project_name }).then((value) => {
            if (value !== undefined) {
                this.edam_project_manager.rename_project(project_name, value);
                let selected_project = this.edam_project_manager.selected_project;
                this.config_file.set_selected_project(selected_project);
                this.update_tree();
            }
        });
    }

    async rename_library(item) {
        let project_name = item.project_name;
        let library_name = item.library_name;
        vscode.window.showInputBox({ prompt: "Set the library name", value: library_name }).then((value) => {
            if (value !== undefined) {
                this.edam_project_manager.rename_library(project_name, library_name, value);
                this.update_tree();
                this.refresh_lint();
            }
        });
    }

    async delete_project(item, delete_selection = true) {
        if (delete_selection === true) {
            this.delete_selection(item);
        }
        let project_name = item.project_name;
        this.edam_project_manager.delete_project(project_name);

        if (delete_selection === true) {
            this.update_tree();
            this.refresh_lint();
        }
    }

    delete_selection(item) {
        let selection = this.treeview.selection;

        //Check if item is in the selection
        let is_selected = false;
        for (let i = 0; i < selection.length; i++) {
            const element = selection[i];
            if (element === item) {
                is_selected = true;
            }
        }

        if (is_selected === false) {
            return;
        }

        for (let i = 0; i < selection.length; i++) {
            const element = selection[i];
            if (element.item_type === "hdl_item") {
                this.delete_file(element, false);
            } else if (element.item_type === "library_item") {
                this.delete_library(element, false);
            } else if (element.item_type === "project_item") {
                this.delete_project(element, false);
            }
        }
    }

    async delete_file(item, delete_selection = true) {
        if (delete_selection === true) {
            this.delete_selection(item);
        }

        let library_name = item.library_name;
        let project_name = item.project_name;
        let path = item.path;
        this.edam_project_manager.delete_file(project_name, path, library_name);

        if (delete_selection === true) {
            this.update_tree();
            this.refresh_lint();
        }
    }

    async delete_library(item, delete_selection = true) {
        if (delete_selection === true) {
            this.delete_selection(item);
        }

        let library_name = item.library_name;
        let project_name = item.project_name;
        this.edam_project_manager.delete_logical_name(project_name, library_name);

        if (delete_selection === true) {
            this.update_tree();
            this.refresh_lint();
        }
    }

    async save_doc(item) {
        const doc_types = ["Save as HTML", "Save as Markdown"];
        let project_name = item.project_name;
        let prj = this.edam_project_manager.get_project(project_name);
        prj.cli_bar = new Edam.Cli_logger(this.output_channel);

        vscode.window.showQuickPick(doc_types, { placeHolder: "Choose output format", }).then((lib_type) => {
            if (lib_type === undefined) {
                return;
            }
            vscode.window.showOpenDialog({
                canSelectMany: false, canSelectFiles: false, canSelectFolders: true,
                title: 'Where the documentation will be generated'
            }).then((output_path) => {
                if (output_path === undefined) {
                    return;
                }
                let output_dir = output_path[0].fsPath;
                //Get documentation configuration
                let config = this.config_view.get_config_documentation();
                this.output_channel.print_project_documenter_configurtion(config, 'Project', output_dir, lib_type);
                // HTML
                let element_this = this;
                if (lib_type === doc_types[0]) {
                    this.generate_and_save_documentation(prj, output_dir, 'html', config).then(function (result) {
                        element_this.output_channel.print_project_documenter_result(result);
                    }
                    );
                }
                // Markdown
                else if (lib_type === doc_types[1]) {
                    this.generate_and_save_documentation(prj, output_dir, 'markdown', config).then(function (result) {
                        element_this.output_channel.print_project_documenter_result(result);
                    }
                    );
                }
            });
        });
    }

    private async generate_and_save_documentation(project_manager, output_path, type: string, config) {
        let result = {};
        if (type === "markdown") {
            result = await project_manager.save_markdown_doc(output_path, config);
        }
        else {
            result = await project_manager.save_html_doc(output_path, config);
        }
        return result;
    }

    async add_library(item) {
        const library_add_types = ["Empty library", "Load library from file list"];

        // Set library name
        let project_name = item.project_name;
        vscode.window.showInputBox({ prompt: "Set library name", placeHolder: "Library name" }).then((value) => {
            let library_name = value;
            if (library_name === undefined) {
                return;
            }
            // Choose type
            vscode.window.showQuickPick(library_add_types, { placeHolder: "Choose library", }).then((lib_type) => {
                if (lib_type === undefined) {
                    return;
                }
                // Empty library
                else if (lib_type === library_add_types[0]) {
                    this.edam_project_manager.add_file(project_name, "", false, "", library_name);
                    this.update_tree();
                    this.refresh_lint();
                }
                // Load from file
                else if (lib_type === library_add_types[1]) {
                    // Select file
                    vscode.window.showOpenDialog({ canSelectMany: false }).then((value) => {
                        if (value === undefined) {
                            return;
                        }
                        let file_path = value[0].fsPath;
                        let file_list = fs.readFileSync(file_path, "utf8");
                        let file_list_array = file_list.split(/\r?\n/);

                        for (let i = 0; i < file_list_array.length; ++i) {
                            let element = file_list_array[i];
                            if (element !== '') {
                                if (library_name === "") {
                                    library_name = "work";
                                }
                                this.edam_project_manager.add_file(project_name, element, false, "", library_name);
                            }
                        }
                        this.update_tree();
                        this.refresh_lint();
                    });
                }
            });
        });
    }


    load_project_from_edam() { }

    async add_project() {
        const project_add_types = ["Empty project", "Load project (EDAM format is supported)", "Load an example project"];

        let picker_value = await vscode.window.showQuickPick(project_add_types, {
            placeHolder: "Add/load a project.",
        });

        if (picker_value === project_add_types[0]) {
            vscode.window
                .showInputBox({
                    prompt: "Set the project name",
                    placeHolder: "Project name",
                })
                .then((value) => {
                    if (value !== undefined) {
                        let result = this.edam_project_manager.create_project(value);
                        if (result !== '') {
                            return;
                        }
                        if (this.edam_project_manager.get_number_of_projects() === 1) {
                            this.select_project_from_name(value);
                        }
                        this.update_tree();
                    }
                });
        }
        else if (picker_value === project_add_types[1]) {
            vscode.window
                .showOpenDialog({
                    canSelectMany: true,
                    filters: { "YAML (.yml)": ["yml"], "JSON (.json)": ["json"], "EDAM (.edam)": ["edam"] },
                })
                .then((value) => {
                    if (value !== undefined) {
                        for (let i = 0; i < value.length; ++i) {
                            let rawdata = fs.readFileSync(value[i].fsPath, 'utf8');
                            let prj_json = {};
                            let extension = path_lib.extname(value[i].fsPath).toLowerCase();
                            if (extension === '.json') {
                                prj_json = JSON.parse(rawdata);
                            }
                            else {
                                const teroshdl = require('teroshdl');
                                prj_json = teroshdl.Edam.yml_edam_str_to_json_edam(rawdata);
                            }
                            let element = this;
                            this.edam_project_manager.create_project_from_edam(prj_json, path_lib.dirname(value[i].fsPath)).then(function (value) {
                                if (element.edam_project_manager.get_number_of_projects() === 1) {
                                    let prj_name = element.edam_project_manager.projects[0].name;
                                    element.select_project_from_name(prj_name);
                                }
                                element.update_tree();
                                element.refresh_lint();
                            });
                        }
                    }
                });
        }
        else if (picker_value === project_add_types[2]) {
            const project_examples_types = ['Documenter examples', 'State machine examples', 'Xsim', 'GHDL', 'Icarus', 'IceStorm', 'ModelSim', 'Vivado', 'Yosys', 'VUnit', 'cocotb'];
            let picker_value = await vscode.window.showQuickPick(project_examples_types, {
                placeHolder: "Choose a example projectt.",
            });
            if (picker_value !== undefined) {
                if (picker_value === 'Documenter examples') {
                    picker_value = 'documenter';
                }
                if (picker_value === 'State machine examples') {
                    picker_value = 'state_machine';
                }


                let project_path = path.join(__filename, "..", "..", "..", "..", "resources", "project_manager", "examples", picker_value.toLowerCase(), 'project.yml');

                let rawdata = fs.readFileSync(project_path, 'utf8');
                let prj_json = {};
                let extension = path_lib.extname(project_path).toLowerCase();
                if (extension === '.json') {
                    prj_json = JSON.parse(rawdata);
                }
                else {
                    const teroshdl = require('teroshdl');
                    prj_json = teroshdl.Edam.yml_edam_str_to_json_edam(rawdata);
                }
                let element = this;
                this.edam_project_manager.create_project_from_edam(prj_json, path_lib.dirname(project_path)).then(function (value) {
                    if (prj_json['name'] !== undefined) {
                        let prj_name = prj_json['name'];
                        element.select_project_from_name(prj_name);
                    }
                    element.set_selected_tool_from_json_project(prj_json);
                    element.update_tree();
                    element.refresh_lint();
                });
            }
        }
    }

    set_selected_tool_from_json_project(prj) {
        let tool_options = prj.tool_options;
        let tool = '';
        for (let attributename in tool_options) {
            tool = attributename;
        }
        this.config_file.set_tool(tool);
    }
}