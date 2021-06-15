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
import * as Terminal from "./terminal";
import * as Vunit from "./vunit";
import * as Cocotb from "./cocotb";
import * as Edalize from "./edalize";
const path_lib = require("path");
const fs = require("fs");
const os = require("os");

export class Project_manager {
  tree!: TreeDataProvider;
  projects: TreeItem[] = [];
  config_view;
  edam_project_manager;
  config_file;
  workspace_folder;
  private terminal: Terminal.Terminal;
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

  constructor(context: vscode.ExtensionContext) {
    this.vunit = new Vunit.Vunit(context);
    this.cocotb = new Cocotb.Cocotb(context);
    this.edalize = new Edalize.Edalize(context);
    this.terminal = new Terminal.Terminal(context);
    this.edam_project_manager = new Edam.Edam_project_manager();
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
  }

  async refresh_lint() {
    if (this.init === false) {
      this.init = false;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await this.save_toml();
    vscode.commands.executeCommand("vhdlls.restart");
  }

  async save_toml() {
    let file_path = `${os.homedir()}${path.sep}.vhdl_ls.toml`;
    let libraries = this.get_active_project_libraries();
    let absolute_path_init = this.get_active_project_absolute_path();
    if (absolute_path_init === '/' || absolute_path_init === '\\'){
      absolute_path_init = '';
    }
    let toml = "[libraries]\n\n";
    for (let i = 0; i < libraries.length; i++) {
      const library = libraries[i];
      let files_in_library = "";
      for (let j = 0; j < library.files.length; j++) {
        const file_in_library = library.files[j];
        const path = require("path");
        let file_extension = path.extname(file_in_library);
        let filename = path.basename(file_in_library);
        if (file_extension !== '.py' && filename.toLowerCase() !== 'makefile'){
          files_in_library += `  '${absolute_path_init}${file_in_library}',\n`;
        }
      }
      let lib_name = library.name;
      if (lib_name === "") {
        lib_name = "none";
      }
      toml += `${library.name}.files = [\n${files_in_library}]\n\n`;
    }
    fs.writeFileSync(file_path, toml);
  }

  open_file(item) {
    let project_name = item.project_name;
    let path = item.path;

    let prj = this.edam_project_manager.get_project(project_name);
    let relative_path = prj.relative_path;
    if (relative_path !== "" && relative_path !== undefined) {
      path = `${relative_path}${path_lib.sep}${path}`;
    }
    try {
      let pos_1 = new vscode.Position(0, 0);
      let pos_2 = new vscode.Position(0, 0);
      vscode.workspace.openTextDocument(path).then((doc) => {
        vscode.window.showTextDocument(doc, vscode.ViewColumn.One).then((editor) => {
          // Line added - by having a selection at the same position twice, the cursor jumps there
          editor.selections = [new vscode.Selection(pos_1, pos_2)];

          // And the visible range jumps there too
          var range = new vscode.Range(pos_1, pos_2);
          editor.revealRange(range);
        });
      });
    } catch (e) {}
  }

  get_active_project_libraries(absolute_path = false) {
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
        filters: { "YAML (.yml)": ["yml"], "JSON (.json)": ["json"], "EDAM (.edam)": ["edam"]},
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
    this.edam_project_manager.create_projects_from_edam(this.config_file.projects);
    await this.update_tree();
    this.update_tree();
    this.refresh_lint();
  }

  async run_vunit_test(item) {
    let tests: string[] = [item.label];
    let gui = false;
    this.run_vunit_tests(tests, gui);
  }

  async run_cocotb_test(item) {
    let tests: string[] = [item.label];
    this.run_cocotb_tests(tests);
  }

  async run_edalize_test(item) {
    let tests: string[] = [item.label];
    this.run_edalize_tests(tests, false);
  }

  async run_vunit_test_gui(item) {
    let tests: string[] = [item.label];
    let gui = true;
    this.run_vunit_tests(tests, gui);
  }

  async run_edalize_test_gui(item) {
    let tests: string[] = [item.label];
    let gui = true;
    this.run_edalize_tests(tests, gui);
  }

  async simulate() {
    let selected_project = this.edam_project_manager.selected_project;
    if (selected_project === "") {
      let msg = "Mark a project to simulate";
      this.show_export_message(msg);
      return;
    }
    let prj = this.edam_project_manager.get_project(selected_project);
    if (prj === undefined){
      //TODO: show messge
      return;
    }
    let tool_configuration = this.config_file.get_config_of_selected_tool();
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

  async get_toplevel_selected_prj(){
    let selected_project = this.edam_project_manager.selected_project;
    if (selected_project === "") {
      let msg = "Mark a project to simulate";
      this.show_export_message(msg);
      return;
    }
    try{
      let prj = this.edam_project_manager.get_project(selected_project);
      let toplevel_path = prj.toplevel_path;
      let toplevel = await this.get_toplevel_from_path(toplevel_path);
      return toplevel;
    }
    catch{
      return '';
    }
  }

  get_toplevel_path_selected_prj(){
    let selected_project = this.edam_project_manager.selected_project;
    if (selected_project === "") {
      let msg = "Mark a project to simulate";
      this.show_export_message(msg);
      return;
    }
    let prj = this.edam_project_manager.get_project(selected_project);
    if (prj === undefined){
      return '';
    }
    let toplevel_path = prj.toplevel_path;
    return toplevel_path;
  }

  async get_toplevel_from_path(filepath : string){
    const jsteros = require('jsteros');
    let lang = this.get_file_lang(filepath);
    let parser_factory = new jsteros.Parser.ParserFactory();
    let parser = await parser_factory.getParser(lang);

    let code = fs.readFileSync(filepath, "utf8");
    let entity_name = await parser.get_only_entity_name(code);
    if (entity_name === undefined){
      return '';
    }
    return entity_name;
  }

  get_file_lang(filepath : string){
    let vhdl_extensions = ['.vhd', '.vho', '.vhdl', '.vhd'];
    let verilog_extensions = ['.v', '.vh', '.vl', '.sv', '.svh'];
    let extension = path_lib.extname(filepath).toLowerCase();
    let lang = 'vhdl';
    if (vhdl_extensions.includes(extension) === true){
      lang = 'vhdl';
    }
    else if(verilog_extensions.includes(extension) === true){
      lang = 'verilog';
    }
    return lang;
  }

  async run_vunit_tests(tests, gui) {
    let selected_tool_configuration = this.config_file.get_config_of_selected_tool();
    let all_tool_configuration = this.config_file.get_config_tool();

    let python3_path = <string>vscode.workspace.getConfiguration("teroshdl.global").get("python3-path");
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
        python3_path,
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

    let toplevel = await this.get_toplevel_selected_prj();;
    edam.toplevel = toplevel;
    let python3_path = <string>vscode.workspace.getConfiguration("teroshdl.global").get("python3-path");
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
    if ('vunit' in tool_configuration)
    {
      this.tree.set_results(this.last_vunit_results, force_fail_all);
    }
    else if ('cocotb' in tool_configuration)
    {
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

  set_top(item) {
    let project_name = item.project_name;
    let library_name = item.library_name;
    let path = item.path;
    this.set_top_from_name(project_name, library_name, path);
  }

  set_top_from_name(project_name, library_name, path) {
    this.edam_project_manager.set_top(project_name, library_name, path);
    this.tree.select_top(project_name, library_name, path);
    this.save_project();
    this.update_tree();
  }

  stop() {
    this.vunit.stop_test();
    this.cocotb.stop_test();
  }

  private show_export_message(msg) {
    vscode.window.showInformationMessage(msg);
  }

  async config() {
    this.config_view.open();
  }

  async update_tree() {
    let test_list = [{ name: "Loading tests...", location: undefined }];
    let normalized_prjs = this.edam_project_manager.get_normalized_projects();
    this.tree.update_super_tree(normalized_prjs, test_list);
    let edam_projects = this.edam_project_manager.get_edam_projects();
    this.config_file.set_projects(edam_projects);

    let selected_project = this.config_file.selected_project;
    if (selected_project !== "") {
      this.tree.select_project(selected_project);
    }

    this.set_default_tops();
    this.set_results(false);

    let tool_configuration = this.config_file.get_config_of_selected_tool();
    let test_list_result : {}[] = [{
      attributes: undefined,
      test_type: undefined,
      name: 'Tool is not configured',
      location: undefined
    }];

    if ('vunit' in tool_configuration)
    {
      test_list_result = await this.get_vunit_test_list();
    }
    else if ('cocotb' in tool_configuration)
    {
      test_list_result = await this.get_cocotb_test_list();
    }
    else{
      test_list_result = await this.get_edalize_test_list();
    }

    this.tree.update_super_tree(normalized_prjs, test_list_result);

    if (selected_project !== "") {
      this.tree.select_project(selected_project);
    }
    this.set_default_tops();
    this.set_results(false);
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
    const files_add_types = ["Select files from browser", "Load files from file list"];

    let library_name = item.library_name;
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
                this.edam_project_manager.add_file(project_name, file_inst, false, "", lib_inst);
              }
              catch(e){
                console.log(e);
                return;
              }
            }
          }
          this.update_tree();
          this.refresh_lint();
        });
      }
    });
    this.update_tree();
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
  }

  async select_project_from_name(project_name) {
    this.config_file.set_selected_project(project_name);
    this.edam_project_manager.select_project(project_name);
    this.update_tree();
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
      this.delete_selection();
    }
    let project_name = item.project_name;
    this.edam_project_manager.delete_project(project_name);

    if (delete_selection === true) {
      this.update_tree();
      this.refresh_lint();
    }
  }

  delete_selection() {
    let selection = this.treeview.selection;
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
      this.delete_selection();
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
      this.delete_selection();
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

        // HTML
        if(lib_type === doc_types[0]){
          this.generate_and_save_documentation(prj, output_dir, 'html', config);
        }
        // Markdown
        else if(lib_type === doc_types[0]){
          this.generate_and_save_documentation(prj, output_dir, 'html', config);
        }
      });
    });
  }

  private generate_and_save_documentation(project_manager, output_path, type: string, config) {
    let configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('teroshdl');
    let comment_symbol_vhdl = configuration.get('documenter.vhdl.symbol');
    let comment_symbol_verilog = configuration.get('documenter.verilog.symbol');
    let python3_path = <string>vscode.workspace.getConfiguration('teroshdl.global').get("python3-path");

    if (type === "markdown") {
      project_manager.save_markdown_doc(output_path, comment_symbol_vhdl, comment_symbol_verilog, true, python3_path, config);
    }
    else {
      project_manager.save_html_doc(output_path, comment_symbol_vhdl, comment_symbol_verilog, true, python3_path, config);
    }
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
          this.edam_project_manager.add_file(project_name, "teroshdl_phantom_file", false, "", value);
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

  async get_vunit_test_list() {
    let python3_path = <string>vscode.workspace.getConfiguration("teroshdl.global").get("python3-path");

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

      let runpy_ext = path_lib.extname(runpy);

      if (runpy !== undefined) {
        tests = await this.vunit.get_test_list(python3_path, runpy);
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
    let testname = await this.get_toplevel_selected_prj();
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
    const project_add_types = ["Empty project", "Load project (EDAM format is supported)"];

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
            if (result !== 0) {
              this.show_export_message(result);
              return;
            }
            if (this.edam_project_manager.get_number_of_projects() === 1) {
              this.select_project_from_name(value);
            }
            this.update_tree();
            this.refresh_tests();
            this.refresh_lint();
          }
        });
    } else if (picker_value === project_add_types[1]) {
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
              this.edam_project_manager.create_project_from_edam(prj_json, path_lib.dirname(value[i].fsPath));
              if (this.edam_project_manager.get_number_of_projects() === 1) {
                let prj_name = this.edam_project_manager.projects[0].name;
                this.select_project_from_name(prj_name);
              }
            }
          }
          this.update_tree();
          this.refresh_tests();
        });
    }
    this.refresh_lint();
  }
}

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<
    TreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  data: TreeItem[] = [];
  projects: TreeItem[] = [];
  test_list_items: Test_item[] = [];

  init_tree() {
    this.data = [new TreeItem("TerosHDL Projects", []), new TreeItem("Test list", [])];
    this.refresh();
  }

  update_super_tree(projects, test_list) {
    this.get_test_list_items(test_list);
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
    let test_list_items: Test_item[] = [];
    for (let i = 0; i < test_list.length; i++) {
      const element = test_list[i];
      let item = new Test_item(element.name, element.location);
      if ("test_type" in element)
      {
        if (element.test_type !== undefined )
        {
          item.contextValue = `test_${element.test_type}`;
        }
      }
      test_list_items.push(item);
    }
    this.test_list_items = test_list_items;
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
    let path_icon_light = get_icon_light(item.path);
    let path_icon_dark = get_icon_dark(item.path);
    
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
      new TreeItem("TerosHDL Projects", this.projects),
      new Test_title_item("Test list", this.test_list_items),
    ];
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }
}

class Project {
  private name: string = "";
  data: TreeItem;

  constructor(name: string, libraries) {
    this.name = name;
    if (libraries !== undefined) {
      let sources_items = this.get_sources(libraries);
      this.data = new Project_item(name, sources_items);
    } else {
      this.data = new Project_item(name, []);
    }
  }

  get_prj() {
    return this.data;
  }

  get_sources(sources) {
    let libraries: (Library_item | Hdl_item)[] = [];
    let files_no_lib: (Library_item | Hdl_item)[] = [];
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

  get_library(library_name, sources): Library_item {
    let tree: Hdl_item[] = [];
    for (let i = 0; i < sources.length; ++i) {
      if (sources[i].includes("teroshdl_phantom_file") === false) {
        let item_tree = new Hdl_item(sources[i], library_name, this.name);
        tree.push(item_tree);
      }
    }
    let library = new Library_item(library_name, this.name, tree);
    return library;
  }

  get_no_library(library_name, sources): Hdl_item[] {
    let tree: Hdl_item[] = [];
    for (let i = 0; i < sources.length; ++i) {
      let item_tree = new Hdl_item(sources[i], library_name, this.name);
      tree.push(item_tree);
    }
    return tree;
  }
}

function get_icon_light(full_path){
  const path = require("path");
  let file_extension = path.extname(full_path);
  let filename = path.basename(full_path);
  
  let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "verilog.svg");
  // Python file
  if (file_extension === '.py'){
    path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "python.svg");
  }
  else if(filename === 'Makefile'){
    path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "makefile.svg");
  }
  return path_icon_light;
}

function get_icon_dark(full_path){
  const path = require("path");
  let file_extension = path.extname(full_path);
  let filename = path.basename(full_path);
  
  let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "verilog.svg");
  // Python file
  if (file_extension === '.py'){
    path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "python.svg");
  }
  else if(filename === 'Makefile'){
    path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "makefile.svg");  
  }
  return path_icon_dark;
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  project_name: string;
  title: string = "";
  library_name: string;
  path: string = "";

  constructor(label: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
    );
    this.project_name = label;
    this.children = children;
    this.contextValue = "teroshdl";
    this.library_name = "";
  }
}

class Test_title_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  project_name: string;
  title: string = "";
  library_name: string;
  path: string = "";

  constructor(label: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
    );
    this.project_name = label;
    this.children = children;
    this.contextValue = "test_title";
    this.library_name = "";
  }
}

class Project_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  project_name: string;
  title: string = "";
  library_name: string;
  path: string = "";
  item_type;

  constructor(label: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
    );
    this.item_type = "project_item";
    this.project_name = label;
    this.children = children;
    this.contextValue = "project";
    this.library_name = "";
    let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "project.svg");
    let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "project.svg");
    this.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark,
    };
  }
}

class Library_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  library_name: string = "";
  project_name: string;
  title: string = "";
  path: string = "";
  item_type;

  constructor(label: string, project_name: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
    );
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.item_type = "library_item";
    this.project_name = project_name;
    this.library_name = label;
    this.children = children;
    this.contextValue = "hdl_library";
    let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "library.svg");
    let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "library.svg");
    this.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark,
    };
  }
}

class Hdl_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  library_name: string;
  project_name: string;
  title: string;
  path: string;
  item_type;

  constructor(label: string, library_name, project_name: string, children?: TreeItem[]) {
    const path = require("path");
    let dirname = path.dirname(label);
    let basename = path.basename(label);
    super(
      basename,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
    );

    this.item_type = "hdl_item";
    this.path = label;
    this.title = "";
    this.project_name = project_name;
    this.library_name = library_name;
    this.tooltip = label;
    this.description = dirname;
    this.children = children;
    this.contextValue = "hdl_source";

    let path_icon_light = get_icon_light(label);
    let path_icon_dark = get_icon_dark(label);

    this.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark,
    };

    this.command = {
      command: "teroshdl_tree_view.open_file",
      title: "Select Node",
      arguments: [this],
    };
  }
}

class Test_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  library_name: string;
  project_name: string;
  title: string;
  path: string;
  location;
  item_type;

  constructor(label: string, location, children?: TreeItem[]) {
    const path = require("path");
    let dirname = path.dirname(label);
    let basename = path.basename(label);
    super(
      basename,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
    );

    this.item_type = "test_item";
    this.path = label;
    this.title = "";
    this.project_name = "";
    this.library_name = "";
    this.tooltip = label;
    this.description = "";
    this.children = children;
    this.contextValue = "test";
    this.location = location;
    this.command = {
      command: "teroshdl_tree_view.go_to_code",
      title: "Go to test code",
      arguments: [this],
    };
  }
}
