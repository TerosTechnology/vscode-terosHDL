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
import * as Vunit from "./tools/vunit";
import * as Cocotb from "./tools/cocotb";
import * as Edalize from "./tools/edalize";
import * as Tree_types from "./tree_types";
import * as utils from "./utils";
import * as utils_vscode from "../utils/utils";
import * as Dependencies_viewer from "../dependencies_viewer/dependencies_viewer";
import { Hdl_dependencies_tree } from './hdl_dependencies_tree';
import * as Output_channel_lib from '../utils/output_channel';
import * as config_reader_lib from "../utils/config_reader";

const ERROR_CODE = Output_channel_lib.ERROR_CODE;
const path_lib = require("path");
const fs = require("fs");
const os = require("os");

export class Project_manager {
  tree!: TreeDataProvider;
  projects: Tree_types.TreeItem[] = [];
  config_view;
  edam_project_manager;
  config_file;
  workspace_folder;
  private vunit_test_list: {}[] = [];
  private cocotb_test_list: Cocotb.TestItem[] = [];
  private vunit: Vunit.Vunit;
  private cocotb: Cocotb.Cocotb;
  private edalize: Edalize.Edalize;
  private last_vunit_results;
  private last_cocotb_results;
  private last_edalize_results;
  private init: boolean = false;
  private treeview;
  private init_test_list: boolean = false;
  private  dependencies_viewer_manager: Dependencies_viewer.default | undefined;
  private hdl_dependencies_provider : Hdl_dependencies_tree;
  private context;
  private output_channel : Output_channel_lib.Output_channel;
  private config_reader : config_reader_lib.Config_reader;


  constructor(context: vscode.ExtensionContext, output_channel, config_reader: config_reader_lib.Config_reader) {
    this.config_reader = config_reader;
    this.output_channel = output_channel;
    this.context = context;
    this.vunit = new Vunit.Vunit(context, output_channel);
    this.cocotb = new Cocotb.Cocotb(context, output_channel);
    this.edalize = new Edalize.Edalize(context, output_channel);
    this.edam_project_manager = new Edam.Edam_project_manager(output_channel);
    this.config_file = new Config.Config(context.extensionPath);
    this.workspace_folder = this.config_file.get_workspace_folder();
    this.config_view = new Config_view.default(context, this.config_file);

    this.tree = new TreeDataProvider();
    this.set_default_projects();
    
    this.treeview = vscode.window.createTreeView("teroshdl_tree_view", {
      showCollapseAll : false,
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
    vscode.commands.registerCommand("teroshdl_tree_view.run_vunit_test", (item) => this.run_vunit_test(item));
    vscode.commands.registerCommand("teroshdl_tree_view.run_cocotb_test", (item) => this.run_cocotb_test(item));
    vscode.commands.registerCommand("teroshdl_tree_view.run_edalize_test", (item) => this.run_edalize_test(item));
    vscode.commands.registerCommand("teroshdl_tree_view.run_vunit_test_gui", (item) => this.run_vunit_test_gui(item));
    vscode.commands.registerCommand("teroshdl_tree_view.run_edalize_test_gui", (item) => this.run_edalize_test_gui(item));
    vscode.commands.registerCommand("teroshdl_tree_view.go_to_code", (item) => this.go_to_code(item));
    vscode.commands.registerCommand("teroshdl_tree_view.refresh_tests", () => this.refresh_tests());
    vscode.commands.registerCommand("teroshdl_tree_view.save_project", (item) => this.save_project_to_file(item));
    vscode.commands.registerCommand("teroshdl_tree_view.stop", () => this.stop());
    vscode.commands.registerCommand("teroshdl_tree_view.open_file", (item) => this.open_file(item));
    vscode.commands.registerCommand("teroshdl_tree_view.save_doc", (item) => this.save_doc(item));
    vscode.commands.registerCommand("teroshdl_tree_view.help", (item) => this.help());

    this.hdl_dependencies_provider = new Hdl_dependencies_tree(context, output_channel);
    vscode.window.registerTreeDataProvider('teroshdl_dependencies_tree_view', this.hdl_dependencies_provider);
    vscode.commands.registerCommand('teroshdl_dependencies_tree_view.refreshEntry', () => this.hdl_dependencies_provider.refresh());
    vscode.commands.registerCommand("teroshdl_dependencies_tree_view.open_file", (item) => this.open_file(item));
    vscode.commands.registerCommand("teroshdl_dependencies_tree_view.dependencies_viewer", () => this.open_dependencies_viewer());

  }

  help(){
    const exec = require('child_process').exec;
    const help_index_path = path.join('file://' + __filename, "..", "..", "..", "..", "resources", "project_manager", "help", 'index.html');
    let opener;
    switch (process.platform) {
      case 'darwin':
        opener = 'open';
        break;
      case 'win32':
        opener = 'start';
        break;
      default:
        opener = 'xdg-open';
        break;
    }
    exec(`${opener} "${help_index_path.replace(/"/g, '\\\"')}"`);
  }

  open_dependencies_viewer(){
    let selected_project = this.edam_project_manager.selected_project;
    if (selected_project === "") {
      this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_TREE_VIEW, '');
      return;
    }
    let prj = this.edam_project_manager.get_project(selected_project);
    let config = this.config_view.get_config_documentation();

    if (this.dependencies_viewer_manager === undefined){
      this.dependencies_viewer_manager = new Dependencies_viewer.default(this.context, this.output_channel, this.config_reader);
    }

    this.dependencies_viewer_manager.open_viewer(prj, config);
  }

  update_dependencies_viewer(){
    let selected_project = this.edam_project_manager.selected_project;
    if (selected_project === "") {
      this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_TREE_VIEW, '');
      return;
    }
    let prj = this.edam_project_manager.get_project(selected_project);
    let config = this.config_view.get_config_documentation();
    if (this.dependencies_viewer_manager !== undefined){
      this.dependencies_viewer_manager.update_viewer(prj, config, false);
    }
  }

  async refresh_lint() {
    if (this.init === false) {
      this.init = false;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    this.save_toml();
    vscode.commands.executeCommand("teroshdl.vhdlls.restart");
    await this.save_compile_order();
  }

  async save_compile_order(){
    let developer_mode = this.config_reader.get_developer_mode();
    console.log("[Project manage| Compile order] Developer mode: " + developer_mode);

    if (developer_mode === true){
      let selected_project = this.edam_project_manager.selected_project;
      console.log("[Project manage Compile order] Selected project: " + selected_project);

      if (selected_project === "") {
        return;
      }
      let prj = this.edam_project_manager.get_project(selected_project);
      if (prj === undefined){
        return;
      }
      let pypath = await this.config_reader.get_python_path_binary(false);
      console.log("[Project manage Compile order] Python path: " + pypath);

      let compile_order = await prj.get_compile_order(pypath);
      console.log("[Project manage Compile order] Compile order: " + compile_order);

      if (compile_order === undefined){
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

  save_toml(): string[]{
    let files_toml : string[] = [];
    let file_path = `${os.homedir()}${path.sep}.vhdl_ls.toml`;
    console.log("[Project manage] Save " + file_path);
    let libraries = this.get_active_project_libraries();
    let toml = "[libraries]\n\n";
    if (libraries !== undefined){
      for (let i = 0; i < libraries.length; i++) {
        let library = libraries[i];
        let files_in_library = "";
        for (let j = 0; j < library.files.length; j++) {
          const file_in_library = library.files[j];
          console.log("[Project manage] File in library: " + file_in_library);
          const path = require("path");
          let filename = path.basename(file_in_library);
          const jsteros = require('jsteros');
          let lang = jsteros.Utils.get_lang_from_path(filename);
          if (lang === 'vhdl'){
            files_in_library += `  '${file_in_library}',\n`;
            files_toml.push(file_in_library);
          }
        }
        let lib_name = library.name;
        if (lib_name === "") {
          lib_name = "none";
        }
        if (library.name === undefined || library.name === ''){
          library.name = 'work';
        }
        toml += `${library.name}.files = [\n${files_in_library}]\n\n`;
      }
    }
    fs.writeFileSync(file_path, toml);
    console.log("[Project manage] Saved " + file_path + '\n');
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
    if (prj === undefined){
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
    if (prj === undefined){
      return undefined;
    }
    let abs = prj.relative_path + path_lib.sep;
    return abs;
  }

  async refresh_tests() {
    this.last_vunit_results = [];
    this.last_cocotb_results = [];
    this.last_edalize_results = [];  
    this.update_tree();
  }

  async save_project_to_file(item) {
    let project_name = item.project_name;
    vscode.window
      .showSaveDialog({
        saveLabel: "Save project",
        filters: { "YAML (.yml)": ["yml"]},
      })
      .then((value) => {
        if (value !== undefined) {
          let path = value.fsPath;
          let prj = this.edam_project_manager.get_project(project_name);
          let tool_configuration = this.config_file.get_config_of_selected_tool();

          let extension = path_lib.extname(path).toLowerCase();
          if (extension === '.json'){
            prj.save_as_json(path, tool_configuration);
          }
          else{
            prj.save_as_yml(path, tool_configuration);
          }
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

  async run_vunit_test(item) {
    let tests: string[] = [item.label];
    let gui = false;
    this.run_vunit_tests(tests, gui);
  }

  async run_vunit_test_gui(item) {
    let tests: string[] = [item.label];
    let gui = true;
    this.run_vunit_tests(tests, gui);
  }

  async run_cocotb_test(item) {
    let tests: string[] = [item.label];
    this.run_cocotb_tests(tests);
  }

  async run_edalize_test(item) {
    let tests: string[] = [item.label];
    let gui = false;
    this.run_edalize_tests(tests, gui);
  }

  async run_edalize_test_gui(item) {
    let tests: string[] = [item.label];
    let gui = true;
    this.run_edalize_tests(tests, gui);
  }

  async simulate() {
    let selected_project = this.edam_project_manager.selected_project;
    if (selected_project === "") {
      this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_SIMULATION, '');
      return;
    }
    let prj = this.edam_project_manager.get_project(selected_project);
    if (prj === undefined){
      this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_SIMULATION, '');
      return;
    }
    if (prj.toplevel_path === '' || prj.toplevel_path === undefined){
      this.output_channel.show_message(ERROR_CODE.SELECT_TOPLEVELPATH, '');
      return;
    }
    let tool_configuration = this.config_file.get_config_of_selected_tool();
    if (tool_configuration === undefined){
      return;
    }
    if ('vunit' in tool_configuration)
    {
      this.run_vunit_tests([], false);
    }
    else if ('cocotb' in tool_configuration)
    {
      this.run_cocotb_tests([]);
    }
    else{
      this.run_edalize_tests([], false);
    }
  }

  async get_toplevel_selected_prj(verbose: boolean){
    let selected_project = this.edam_project_manager.selected_project;
    if (selected_project === "" && verbose === true) {
      this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_SIMULATION, '');
      return;
    }
    try{
      let prj = this.edam_project_manager.get_project(selected_project);
      let toplevel_path = prj.toplevel_path;
      if (toplevel_path === undefined){
        return '';
      }
      let toplevel = await utils.get_toplevel_from_path(toplevel_path);
      if ( (toplevel === '' || toplevel === undefined)  && verbose === true){
        this.output_channel.show_message(ERROR_CODE.SELECT_TOPLEVEL, '');
      }
      return toplevel;
    }
    catch{
      return '';
    }
  }

  get_toplevel_path_selected_prj(){
    let selected_project = this.edam_project_manager.selected_project;
    if (selected_project === "") {
      this.output_channel.show_message(ERROR_CODE.SELECT_PROJECT_SIMULATION, '');
      return;
    }
    let prj = this.edam_project_manager.get_project(selected_project);
    if (prj === undefined){
      return '';
    }
    let toplevel_path = prj.toplevel_path;
    return toplevel_path;
  }

  async run_vunit_tests(tests, gui) {
    let selected_tool_configuration = this.config_file.get_config_of_selected_tool();
    let all_tool_configuration = this.config_file.get_all_config_tool();

    let selected_project = this.edam_project_manager.selected_project;
    let prj = this.edam_project_manager.get_project(selected_project);

    let runpy_path = "";
    if (prj.relative_path !== "" && prj.relative_path !== undefined) {
      runpy_path = `${prj.relative_path}${path_lib.sep}${prj.toplevel_path}`;
    } else {
      runpy_path = prj.toplevel_path;
    }

    let results = <[]>(
      await this.vunit.run_simulation(
        selected_tool_configuration,
        all_tool_configuration,
        runpy_path,
        tests,
        gui
      )
    );
    this.last_vunit_results = results;
    let force_fail_all = false;
    if (results.length === 0) {
      force_fail_all = true;
    }
    this.set_results(force_fail_all);
  }

  async run_edalize_tests(tests, gui) {
    let selected_project = this.edam_project_manager.selected_project;
    let prj = this.edam_project_manager.get_project(selected_project);
    let edam = prj.export_edam_file();
    let tool_configuration = this.config_file.get_config_of_selected_tool();
    edam.tool_options = tool_configuration;

    let toplevel = await this.get_toplevel_selected_prj(false);;
    edam.toplevel = toplevel;
    let results = <[]>await this.edalize.run_simulation(edam, toplevel, gui);
    this.last_edalize_results = results;

    let force_fail_all = false;
    if (results.length === 0) {
      force_fail_all = true;
    }
    this.set_results(force_fail_all);
  }

  async run_cocotb_tests(tests) {
    let results = <[]>await this.cocotb.run_simulation(tests, this.cocotb_test_list);

    this.last_cocotb_results = results;
    let force_fail_all = false;
    if (results.length === 0) {
      force_fail_all = true;
    }
    this.set_results(force_fail_all);
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
    if (location === undefined){
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
    if (tool_configuration === undefined){
      return [];
    }
    if ('vunit' in tool_configuration){
      this.tree.set_results(this.last_vunit_results, force_fail_all);
    }
    else if ('cocotb' in tool_configuration){
      this.tree.set_results(this.last_cocotb_results, force_fail_all);
    }
    else{
      this.tree.set_results(this.last_edalize_results, force_fail_all);
    }
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
    this.vunit.stop_test();
    this.cocotb.stop_test();
    this.edalize.stop_test();
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

    let tool_configuration = this.config_file.get_config_of_selected_tool();
    let test_list : {}[] = [{
      attributes: undefined,
      test_type: undefined,
      name: 'Tool is not configured',
      location: undefined
    }];
    if (tool_configuration !== undefined){
      if ('vunit' in tool_configuration){
        test_list = await this.get_vunit_test_list(this.init_test_list);
      }
      else if ('cocotb' in tool_configuration){
        test_list = await this.get_cocotb_test_list();
      }
      else{
        test_list = await this.get_edalize_test_list();
      }
    }
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
    if (prj === undefined){
      return;
    }
    let toplevel_path = prj.toplevel_path;
    let pypath = await this.config_reader.get_python_path_binary(false);
    let dependency_tree = await prj.get_dependency_tree(pypath);
    if (dependency_tree.root === undefined) {
      let error_message = dependency_tree.error;
      dependency_tree = {root: [
          {filename: "", entity: error_message, dependencies: []}
        ]
      };
      toplevel_path = error_message;
    }
    this.hdl_dependencies_provider.set_hdl_tree(dependency_tree, toplevel_path);
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
    vscode.window.showQuickPick(files_add_types, {placeHolder: "Choose file",}).then((files_type) => {
      if (files_type === undefined){
        return;
      }
      // Files from browser
      else if(files_type === files_add_types[0]){
        this.add_file_from_item(item);
      }
      // Load from file
      else if(files_type === files_add_types[1]){
        // Select file
        vscode.window.showOpenDialog({ canSelectMany: false }).then((value) => {
          if (value === undefined){
            return;
          }
          let file_path = value[0].fsPath;
          let file_list = fs.readFileSync(file_path, "utf8");
          let file_list_array = file_list.split(/\r?\n/);

          for (let i = 0; i < file_list_array.length; ++i) {
            let element = file_list_array[i];
            if (element.trim() !== ''){
              try{
                let lib_inst = element.split(',')[0].trim();
                let file_inst = element.split(',')[1].trim();
                if (lib_inst === ""){
                  lib_inst = "";
                }
                let complete_file_path = file_inst;
                if( path.isAbsolute(file_inst) === false ) {
                  let dirname_csv = path_lib.dirname(file_path);
                  complete_file_path = path_lib.join(dirname_csv, file_inst);
                }
                this.edam_project_manager.add_file(project_name, complete_file_path, false, "", lib_inst);
              }
              catch(e){
                console.log(e);
                return;
              }
            }
          }
          this.refresh_lint();
          this.update_tree();
        });
      }
      //Load files in folder and subfolders
      else if(files_type === files_add_types[2]){
        // Select file
        vscode.window.showOpenDialog({ canSelectMany: false, canSelectFolders: true, canSelectFiles: false }).then((value) => {
          if (value === undefined){
            return;
          }
          let folder_path = value[0].fsPath;

          let files_list_array = utils_vscode.get_files_from_dir_recursive(folder_path);
          let library_name = item.library_name;
          for (let i = 0; i < files_list_array.length; ++i) {
            if (library_name === ""){
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
          if (library_name === ""){
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

    if (is_selected === false){
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

    vscode.window.showQuickPick(doc_types, {placeHolder: "Choose output format",}).then((lib_type) => {
      if (lib_type === undefined){
        return;
      }
      vscode.window.showOpenDialog({ canSelectMany: false, canSelectFiles: false, canSelectFolders:true, 
        title:'Where the documentation will be generated'
      }).then((output_path) => {
        if (output_path === undefined){
          return;
        }
        let output_dir = output_path[0].fsPath;
        //Get documentation configuration
        let config = this.config_view.get_config_documentation();
        this.output_channel.print_project_documenter_configurtion(config, 'Project', output_dir, lib_type);
        // HTML
        let element_this = this;
        if(lib_type === doc_types[0]){
          this.generate_and_save_documentation(prj, output_dir, 'html', config).then(function(result){
              element_this.output_channel.print_project_documenter_result(result);
            }
          );
        }
        // Markdown
        else if(lib_type === doc_types[1]){
          this.generate_and_save_documentation(prj, output_dir, 'markdown', config).then(function(result){
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
      if (library_name === undefined){
        return;
      }
      // Choose type
      vscode.window.showQuickPick(library_add_types, {placeHolder: "Choose library",}).then((lib_type) => {
        if (lib_type === undefined){
          return;
        }
        // Empty library
        else if(lib_type === library_add_types[0]){
          this.edam_project_manager.add_file(project_name, "", false, "", library_name);
          this.update_tree();
          this.refresh_lint();
        }
        // Load from file
        else if(lib_type === library_add_types[1]){
          // Select file
          vscode.window.showOpenDialog({ canSelectMany: false }).then((value) => {
            if (value === undefined){
              return;
            }
            let file_path = value[0].fsPath;
            let file_list = fs.readFileSync(file_path, "utf8");
            let file_list_array = file_list.split(/\r?\n/);

            for (let i = 0; i < file_list_array.length; ++i) {
              let element = file_list_array[i];
              if (element !== ''){
                if (library_name === ""){
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

  async get_vunit_test_list(show_error_message = true) {
    let tests;
    try {
      let selected_project = this.edam_project_manager.selected_project;
      let prj = this.edam_project_manager.get_project(selected_project);
      let runpy = "";
      if (prj.relative_path !== "" && prj.relative_path !== undefined) {
        runpy = `${prj.relative_path}${path_lib.sep}${prj.toplevel_path}`;
      } else {
        runpy = prj.toplevel_path;
      }

      if (runpy !== undefined) {
        tests = await this.vunit.get_test_list(runpy, show_error_message);
      } else {
        this.vunit_test_list = [];
        return [];
      }
      let tests_vunit: {}[] = [];
      for (let i = 0; i < tests.length; i++) {
        let element = tests[i];
        element.test_type= "vunit";
        tests_vunit.push(element);
      }

      if (tests_vunit.length === 0) {
        let single_test = {
          test_type: "vunit",
          name: "Not found.",
          location: undefined,
        };
        tests_vunit = [single_test];
      }

      this.vunit_test_list = tests_vunit;
      return tests_vunit;
    } catch (e) {
      let single_test = {
        name: "Not found.",
        location: undefined,
      };
      return [single_test];
    }
  }

  async get_edalize_test_list() {
    let testname = await this.get_toplevel_selected_prj(false);
    if (testname === ''){
      return [];
    }
    let toplevel_path = this.get_toplevel_path_selected_prj();
    let single_test: Edalize.TestItem = {
      test_type: 'edalize',
      name: testname,
      location: {
        file_name: toplevel_path,
        length: 0,
        offset:0
      }
    };
    return [single_test];
  }

  async get_cocotb_test_list() {
    let single_test: Cocotb.TestItem = {
      attributes: undefined,
      test_type: undefined,
      name: 'Cocotb tests not found.',
      location: undefined
    };

    try {
      let selected_project = this.edam_project_manager.selected_project;
      let prj = this.edam_project_manager.get_project(selected_project);
      let makefile = "";
      if (prj.relative_path !== "" && prj.relative_path !== undefined) {
        makefile = `${prj.relative_path}${path_lib.sep}${prj.toplevel_path}`;
      } else {
        makefile = prj.toplevel_path;
      }

      this.cocotb_test_list = await this.cocotb.get_test_list(makefile);

      if (this.cocotb_test_list.length === 0) {
        this.cocotb_test_list = [single_test];
      }

      return this.cocotb_test_list;
    }
    catch (e) {
      return [single_test];
    }
  }

  load_project_from_edam() {}

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
          filters: { "YAML (.yml)": ["yml"], "JSON (.json)": ["json"], "EDAM (.edam)": ["edam"]},
        })
        .then((value) => {
          if (value !== undefined) {
            for (let i = 0; i < value.length; ++i) {
              let rawdata = fs.readFileSync(value[i].fsPath, 'utf8');
              let prj_json = {};
              let extension = path_lib.extname(value[i].fsPath).toLowerCase();
              if (extension === '.json'){
                prj_json = JSON.parse(rawdata);
              }
              else{
                const jsteros = require('jsteros');
                prj_json = jsteros.Edam.yml_edam_str_to_json_edam(rawdata);
              }
              let element = this;
              this.edam_project_manager.create_project_from_edam(prj_json, path_lib.dirname(value[i].fsPath)).then(function(value){
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
        const project_examples_types = ['Xsim', 'GHDL', 'Icarus', 'IceStorm', 'ModelSim', 'Quartus', 'Vivado', 'VUnit', 'cocotb', 'Yosys'];
        let picker_value = await vscode.window.showQuickPick(project_examples_types, {
          placeHolder: "Choose a example projectt.",
        });
        if (picker_value !== undefined) {
          let project_path = path.join(__filename, "..", "..", "..", "..", "resources", "project_manager", "examples", picker_value.toLowerCase(), 'project.yml');

          let rawdata = fs.readFileSync(project_path, 'utf8');
          let prj_json = {};
          let extension = path_lib.extname(project_path).toLowerCase();
          if (extension === '.json'){
            prj_json = JSON.parse(rawdata);
          }
          else{
            const jsteros = require('jsteros');
            prj_json = jsteros.Edam.yml_edam_str_to_json_edam(rawdata);
          }
          let element = this;
          this.edam_project_manager.create_project_from_edam(prj_json, path_lib.dirname(project_path)).then(function(value){
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

  set_selected_tool_from_json_project(prj){
    let tool_options = prj.tool_options;
    let tool = '';
    for(let attributename in tool_options){
      tool = attributename;
    }  
    this.config_file.set_tool(tool);
  }
}

class TreeDataProvider implements vscode.TreeDataProvider<Tree_types.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<Tree_types.TreeItem | undefined | null | void> = new vscode.EventEmitter<
  Tree_types.TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData: vscode.Event<Tree_types.TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  data: Tree_types.TreeItem[] = [];
  projects: Tree_types.TreeItem[] = [];
  test_list_items: Tree_types.Test_item[] = [];
  build_list_items: Tree_types.Build_item[] = [];

  init_tree() {
    this.data = [new Tree_types.TreeItem("TerosHDL Projects", []), new Tree_types.TreeItem("Runs list", []), 
      new Tree_types.TreeItem("Resources utilization", [])];
    this.refresh();
  }

  update_super_tree(projects, test_list) {
    this.get_test_list_items(test_list);
    this.get_build_list_items(test_list);
    this.projects = [];
    for (let i = 0; i < projects.length; i++) {
      const element = projects[i];
      let prj = new Project(element.name, element.libraries);
      let prj_data = prj.get_prj();
      this.projects.push(prj_data);
    }
    this.update_tree();
  }

  set_results(results, force_fail_all) {
    if (results === undefined) {
      return;
    }
    if (force_fail_all === true) {
      this.set_fail_all_tests();
      return;
    }
    for (let i = 0; i < this.test_list_items.length; ++i) {
      const test = this.test_list_items[i];
      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        if (test.label === result.name) {
          if (result.pass === false) {
            let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "failed.svg");
            let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "failed.svg");
            test.iconPath = {
              light: path_icon_light,
              dark: path_icon_dark,
            };
          } else {
            let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "passed.svg");
            let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "passed.svg");
            test.iconPath = {
              light: path_icon_light,
              dark: path_icon_dark,
            };
          }
        }
      }
    }
    this.get_build_list_items(results);
    this.update_tree();
  }

  set_fail_all_tests() {
    for (let i = 0; i < this.test_list_items.length; ++i) {
      const test = this.test_list_items[i];
      let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "failed.svg");
      let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "failed.svg");
      test.iconPath = {
        light: path_icon_light,
        dark: path_icon_dark,
      };
    }
    this.update_tree();
  }

  get_test_list_items(test_list) {
    let test_list_items: Tree_types.Test_item[] = [];
    for (let i = 0; i < test_list.length; i++) {
      const element = test_list[i];
      if (element.name === undefined){
        return test_list_items;
      }
      let item = new Tree_types.Test_item(element.name, element.location);
      if ("test_type" in element){
        if (element.test_type !== undefined){
          item.contextValue = `test_${element.test_type}`;
        }
      }
      test_list_items.push(item);
    }
    this.test_list_items = test_list_items;
  }

  get_build_list_items(build_list) {
    if (build_list === undefined || build_list.length === 0 || build_list[0].builds === undefined){
      this.build_list_items = [];
      return;
    }
    let build_i = build_list[0].builds;
    let build_list_items: Tree_types.Build_item[] = [];
    for (let i = 0; i < build_i.length; i++) {
      const element = build_i[i];
      let item = new Tree_types.Build_item(element.location, element.name);
      build_list_items.push(item);
    }
    this.build_list_items = build_list_items;
  }

  add_project(name: string, sources) {
    let prj = new Project(name, sources);
    let prj_data = prj.get_prj();
    this.projects.push(prj_data);
    this.update_tree();
  }

  select_project(project_name) {
    //Search project
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].project_name === project_name) {
        let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "symbol-event.svg");
        let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "symbol-event.svg");
        this.projects[i].iconPath = {
          light: path_icon_light,
          dark: path_icon_dark,
        };
      } else {
        let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "project.svg");
        let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "project.svg");
        this.projects[i].iconPath = {
          light: path_icon_light,
          dark: path_icon_dark,
        };
      }
    }
    this.update_tree();
  }

  set_icon_select_file(item) {
    let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "star-full.svg");
    let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "star-full.svg");
    item.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark,
    };
  }

  set_icon_no_select_file(item) {
    let item_path = item.path;
    let path_icon_light = utils.get_icon_light(item.path);
    let path_icon_dark = utils.get_icon_dark(item.path);
    
    item.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark,
    };
  }

  select_top(project_name, library, path) {
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].project_name === project_name) {
        let libraries_and_files = this.projects[i].children;
        for (let j = 0; libraries_and_files !== undefined && j < libraries_and_files.length; j++) {
          const lib_or_file = libraries_and_files[j];
          if (
            lib_or_file.contextValue === "hdl_source" &&
            lib_or_file.library_name === library &&
            lib_or_file.path === path
          ) {
            this.set_icon_select_file(lib_or_file);
          } else if (lib_or_file.contextValue === "hdl_source") {
            this.set_icon_no_select_file(lib_or_file);
          } else {
            let lib_files = lib_or_file.children;
            for (let m = 0; lib_files !== undefined && m < lib_files.length; m++) {
              let file = lib_files[m];
              if (file.contextValue === "hdl_source" && file.library_name === library && file.path === path) {
                this.set_icon_select_file(file);
              } else if (file.contextValue === "hdl_source") {
                this.set_icon_no_select_file(file);
              }
            }
          }
        }
      }
    }
    this.update_tree();
  }

  update_tree() {
    this.data = [
      new Tree_types.TreeItem("TerosHDL Projects", this.projects),
      new Tree_types.Test_title_item("Runs list", this.test_list_items),
      new Tree_types.Build_title_item("Resources utilization", this.build_list_items),
    ];
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Tree_types.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: Tree_types.TreeItem | undefined): vscode.ProviderResult<Tree_types.TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }
}

class Project {
  private name: string = "";
  data: Tree_types.TreeItem;

  constructor(name: string, libraries) {
    this.name = name;
    if (libraries !== undefined) {
      let sources_items = this.get_sources(libraries);
      this.data = new Tree_types.Project_item(name, sources_items);
    } else {
      this.data = new Tree_types.Project_item(name, []);
    }
  }

  get_prj() {
    return this.data;
  }

  get_sources(sources) {
    let libraries: (Tree_types.Library_item | Tree_types.Hdl_item)[] = [];
    let files_no_lib: (Tree_types.Library_item | Tree_types.Hdl_item)[] = [];
    for (let i = 0; i < sources.length; ++i) {
      if (sources[i].name === "") {
        let sources_no_lib = this.get_no_library(sources[i].name, sources[i].files);
        for (let i = 0; i < sources_no_lib.length; ++i) {
          files_no_lib.push(sources_no_lib[i]);
        }
      } else {
        let library = this.get_library(sources[i].name, sources[i].files);
        libraries.push(library);
      }
    }
    libraries = libraries.concat(files_no_lib);
    return libraries;
  }

  get_library(library_name, sources): Tree_types.Library_item {
    let tree: Tree_types.Hdl_item[] = [];
    for (let i = 0; i < sources.length; ++i) {
      if (sources[i] !== ''){
        let item_tree = new Tree_types.Hdl_item(sources[i], library_name, this.name);
        tree.push(item_tree);
      }
    }
    let library = new Tree_types.Library_item(library_name, this.name, tree);
    return library;
  }

  get_no_library(library_name, sources): Tree_types.Hdl_item[] {
    let tree: Tree_types.Hdl_item[] = [];
    for (let i = 0; i < sources.length; ++i) {
      let item_tree = new Tree_types.Hdl_item(sources[i], library_name, this.name);
      tree.push(item_tree);
    }
    return tree;
  }
}


