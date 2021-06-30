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
const path_lib = require('path');
import * as vscode from "vscode";

export class Edam_project_manager {
  public projects: any[] = [];
  public selected_project: string = '';

  get_number_of_projects() {
    return this.projects.length;
  }

  get_number_of_files_of_project(project_name) {
    for (let i = 0; i < this.projects.length; i++) {
      const prj = this.projects[i];
      if (prj.name === project_name) {
        return prj.get_number_of_files();
      }
    }
  }

  get_top_from_selected_project() {
    for (let i = 0; i < this.projects.length; i++) {
      const prj = this.projects[i];
      if (prj.name === this.selected_project) {
        return prj.toplevel_path;
      }
    }
    return undefined;
  }

  check_if_project_exists(name) {
    for (let i = 0; i < this.projects.length; i++) {
      const prj = this.projects[i];
      if (prj.name === name) {
        return true;
      }
    }
    return false;
  }

  get_project(name) {
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].name === name) {
        return this.projects[i];
      }
    }
  }

  async create_projects_from_edam(projects) {
    for (let i = 0; i < projects.length; i++) {
      const prj = projects[i];
     await this.create_project_from_edam(prj);
    }
  }

  async set_top(project_name, library, toplevel_path, toplevel) {
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].name === project_name) {
        const prj = this.projects[i];
        if (toplevel_path !== '' && toplevel_path !== undefined){
          await prj.set_top(toplevel_path, library);
        }
        else{
          await prj.set_top_from_toplevel(toplevel, library);
        }
        break;
      }
    }
  }

  async create_project_from_edam(edam, relative_path = '') {
    let project_name = edam.name;
    let toplevel_library = edam.toplevel_library;
    let toplevel_path = edam.toplevel_path;
    let toplevel = edam.toplevel;
    if (toplevel_path === undefined){
      toplevel_path = '';
    }
    if (toplevel_library === undefined){
      toplevel_library = '';
    }
    if (toplevel === undefined){
      toplevel = '';
    }

    if (this.check_if_project_exists(project_name) === true) {
      return `The project with name [${project_name}] already exists in the workspace.`;
    }

    this.create_project(project_name, relative_path);
    let files = edam.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filename = files[i].name;
      //Relative path to absolute
      let resolve = require('path').resolve;
      let absolute_path = filename;
      if (relative_path !== ''){
        let full_path = relative_path + path_lib.sep + filename;
        absolute_path = resolve(full_path);
      }
      if (file.logical_name === undefined){
        file.logical_name = '';
      }
      if (file.include_path === undefined){
        file.include_path = false;
      }
      this.add_file(project_name, absolute_path, file.is_include_file, file.include_path, file.logical_name);
      // this.set_top(project_name, file.logical_name, file.name);
    }

    await this.set_top(project_name, toplevel_library, toplevel_path, toplevel);

    return 0;
  }

  get_tops() {
    let tops: {}[] = [];
    for (let i = 0; i < this.projects.length; i++) {
      const prj = this.projects[i];
      let top = {
        project_name: prj.name,
        toplevel_library: prj.toplevel_library,
        toplevel_path: prj.toplevel_path
      };
      tops.push(top);
    }
    return tops;
  }

  rename_project(name, new_name) {
    if (this.select_project === name){
      this.selected_project = new_name;
    }
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].name === name) {
        this.projects[i].name = new_name;
        break;
      }
    }
    if (this.selected_project === name) {
      this.selected_project = new_name;
    }
  }

  rename_library(prj_name, logical_name, new_logical_name) {
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].name === prj_name) {
        this.projects[i].rename_logical_name(logical_name, new_logical_name);
        break;
      }
    }
  }

  select_project(name) {
    this.selected_project = name;
  }

  create_project(name, relative_path = '') {
    if (this.check_if_project_exists(name) === true) {
      return `The project with name [${name}] already exists in the workspace.`;
    }
    let logger = new Cli_logger();
    const jsteros = require('jsteros');
    let prj = new  jsteros.Edam.Edam_project(name, relative_path, logger);
    this.projects.push(prj);
    return '';
  }

  delete_project(name) {
    if (this.selected_project === name) {
      this.selected_project = '';
    }
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].name === name) {
        this.projects.splice(i, 1);
        break;
      }
    }
  }

  add_file(prj_name: string, name: string, is_include_file: boolean = false,
    include_path: string = '', logic_name: string = '') {

    if (is_include_file === undefined) {
      is_include_file = false;
    }

    if (include_path === undefined) {
      include_path = '';
    }

    if (logic_name === undefined) {
      logic_name = '';
    }

    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].name === prj_name) {
        this.projects[i].add_file(name, is_include_file, include_path, logic_name);
        break;
      }
    }
  }

  delete_file(prj_name: string, name: string, logic_name: string = '') {
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].name === prj_name) {
        this.projects[i].delete_file(name, logic_name);
        break;
      }
    }
  }

  delete_logical_name(prj_name: string, logic_name: string = '') {
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].name === prj_name) {
        this.projects[i].delete_logical_name(logic_name);
        break;
      }
    }
  }

  get_normalized_projects() {
    let normalized_prjs: {}[] = [];
    for (let i = 0; i < this.projects.length; i++) {
      const element = this.projects[i];
      normalized_prjs.push(element.get_normalized_project());
    }
    return normalized_prjs;
  }

  get_edam_projects() {
    let projects: {}[] = [];
    for (let i = 0; i < this.projects.length; i++) {
      const prj = this.projects[i];
      projects.push(prj.export_edam_file());
    }
    return projects;
  }
}

class Cli_logger {
  output_channel;
  constructor(){
    this.output_channel = vscode.window.createOutputChannel('TerosHDL');
  }

  start(value0){
    this.output_channel.show();
  }

  update(value0, value1){
    if (value1 !== undefined){
      this.output_channel.appendLine(value1.filename);
    }
  }

  stop(){
  }
}