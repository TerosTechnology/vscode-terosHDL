// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
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
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

/* eslint-disable @typescript-eslint/class-name-casing */
import * as Config from './config';

const path_lib = require('path');

export class Edam_project_manager {
  public projects: Edam_project[] = [];
  public selected_project: string = '';

  absolute_project_paths_to_realtive(project_name, path_base) {
    for (let i = 0; i < this.projects.length; i++) {
      const prj = this.projects[i];
      if (prj.name === project_name) {
        prj.absolute_project_paths_to_relative(path_base);
        break;
      }
    }
  }

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

  create_projects_from_edam(projects) {
    for (let i = 0; i < projects.length; i++) {
      const prj = projects[i];
      this.create_project_from_edam(prj);
    }
  }

  set_top(project_name, library, path) {
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].name === project_name) {
        const prj = this.projects[i];
        prj.set_top(path, library);
        break;
      }
    }
  }

  create_project_from_edam(edam, file_path = '') {
    let project_name = edam.name;
    let toplevel_library = edam.toplevel_library;
    let toplevel_path = edam.toplevel_path;
    let relative_path = edam.relative_path;
    let enable_relative_path = edam.enable_relative_path;
    if (file_path !== '' && enable_relative_path === true) {
      relative_path = file_path;
    }

    if (this.check_if_project_exists(project_name) === true) {
      return `The project with name [${project_name}] already exists in the workspace.`;
    }

    this.create_project(project_name, relative_path);
    let files = edam.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.add_file(project_name, file.name, file.is_include_file, file.include_path, file.logical_name, true);
      this.set_top(project_name, file.logical_name, file.name);
    }

    if ((toplevel_path !== '' && toplevel_path !== undefined) || (toplevel_library !== '' && toplevel_library !== undefined)) {
      this.set_top(project_name, toplevel_library, toplevel_path);
    }

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

    let prj = new Edam_project(name, relative_path);
    this.projects.push(prj);
    return 0;
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
    include_path: string = '', logic_name: string = '', force_no_relative = false) {

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
        this.projects[i].add_file(name, is_include_file, include_path, logic_name, force_no_relative);
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

class Edam_project {
  public files: Edam_file[] = [];
  //Required Name of the project
  public name: string = '';
  //Toplevel module(s) for the project.
  public toplevel: string = '';
  public toplevel_path: string = '';
  public toplevel_library: string = '';
  //A dictionary of tool-specific options.
  public tool_options;
  public relative_path: string = '';
  public enable_relative_path: boolean = false;

  constructor(name: string, relative_path, tool_options = {}) {
    this.name = name;
    this.tool_options = tool_options;
    this.relative_path = relative_path;
    if (relative_path !== '') {
      this.enable_relative_path = true;
    }
  }

  set_top(path, library) {
    this.toplevel_path = path;
    this.toplevel_library = library;
  }

  absolute_project_paths_to_relative(base_path) {
    this.enable_relative_path = true;
    let base_path_current = '';
    if (this.relative_path !== '') {
      base_path_current = `${this.relative_path}${path_lib.sep}`;
    }

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      let relative_path = path_lib.relative(base_path, base_path_current + file.name);
      file.name = relative_path;
    }
    this.toplevel_path = path_lib.relative(base_path, base_path_current + this.toplevel_path);
    this.relative_path = base_path;
  }

  get_relative_path(path, base_path) {
    let base_path_current = '';
    if (this.relative_path !== '') {
      base_path_current = `${this.relative_path}${path_lib.sep}`;
    }
    let relative_path = path_lib.relative(base_path, base_path_current + path);
    return relative_path;
  }

  check_relative_paths() {
    if (this.relative_path !== '' && this.relative_path !== undefined) {
      this.absolute_project_paths_to_relative(this.relative_path);
    }
  }

  get_number_of_files() {
    return this.files.length;
  }

  set_name(name) {
    this.name = name;
  }

  export_edam_file() {
    let edam_file = {
      name: this.name,
      tool_options: {},
      toplevel: '',
      toplevel_path: this.toplevel_path,
      toplevel_library: this.toplevel_library,
      enable_relative_path: this.enable_relative_path,
      relative_path: this.relative_path
    };
    let edam_files: {}[] = [];
    for (let i = 0; i < this.files.length; i++) {
      const element = this.files[i];
      edam_files.push(element.get_info());
    }
    edam_file['files'] = edam_files;
    return edam_file;
  }

  load_edam_file(edam) {
    this.name = edam.name;
    this.tool_options = edam.tool_options;
    this.files = [];
    for (let i = 0; i < edam.files.length; i++) {
      const element = edam.files[i];

      let is_include_file = false;
      if (element.is_include_file !== undefined) {
        is_include_file = element.is_include_file;
      }

      let include_path = '';
      if (element.include_path !== undefined) {
        include_path = element.include_path;
      }

      let logic_name = '';
      if (element.logic_name !== undefined) {
        logic_name = element.logic_name;
      }

      this.add_file(element.name, is_include_file, include_path, logic_name);
    }
    this.check_relative_paths();
  }

  rename_logical_name(name, new_name) {
    for (let i = 0; i < this.files.length; ++i) {
      if (this.files[i].logical_name === name) {
        this.files[i].logical_name = new_name;
      }
    }
  }

  add_file(name: string, is_include_file: boolean = false, include_path: string = '', logic_name: string = '', force_no_relative = false) {
    // File exists
    if (this.check_if_file_exist(name,logic_name) === true){
      return;
    }
    if (this.relative_path !== '' && this.relative_path !== undefined && force_no_relative === false) {
      name = path_lib.relative(this.relative_path, name);
    }

    let edam_file = new Edam_file(name, is_include_file, include_path, logic_name);
    this.files.push(edam_file);
  }

  check_if_file_exist(name: string, logic_name:string){
    for (let i = 0; i < this.files.length; i++) {
      const element = this.files[i];
      if (element.name === name && element.logical_name === logic_name){
        return true;
      }
    }
    return false;
  }


  delete_file(name: string, logic_name: string) {
    let new_files: Edam_file[] = [];
    for (let i = 0; i < this.files.length; ++i) {
      if (this.files[i].name !== name || this.files[i].logical_name !== logic_name) {
        new_files.push(this.files[i]);
      }
    }
    this.files = new_files;
  }

  delete_logical_name(logic_name: string) {
    let new_files: Edam_file[] = [];
    for (let i = 0; i < this.files.length; ++i) {
      if (this.files[i].logical_name !== logic_name) {
        new_files.push(this.files[i]);
      }
    }
    this.files = new_files;
  }

  get_normalized_project() {
    let libraries: {}[] = [];

    for (let i = 0; i < this.files.length; i++) {
      const element_file = this.files[i];
      const logical_name = element_file.logical_name;
      const name = element_file.name;

      let library_is = false;
      //Search if the library exists
      for (let j = 0; j < libraries.length; j++) {
        const element_lib = libraries[j];
        if (logical_name === element_lib['name'] && name !== 'teroshdl_phantom_file') {
          element_lib['files'].push(name);
          library_is = true;
          break;
        }
      }
      //Create library
      if (library_is === false && name === 'teroshdl_phantom_file') {
        let library = {
          name: logical_name,
          files: []
        };
        libraries.push(library);
      }
      else if (library_is === false && name !== 'teroshdl_phantom_file') {
        let library = {
          name: logical_name,
          files: [name]
        };
        libraries.push(library);
      }
    }

    let normalized_prj = {
      name: this.name,
      libraries: libraries
    };
    return normalized_prj;
  }

}

class Edam_file {
  //Required File name with (absolute or relative) path
  public name: string = '';
  //Required File type
  public file_type: string = '';
  //Indicates if this file should be treated as an include file (default false)
  public is_include_file: boolean = false;
  //When is_include_file is true, the directory containing the file will be added 
  //to the include path. include_path allows setting an explicit directory to use instead
  public include_path: string = '';
  //Logical name (e.g. VHDL/SystemVerilog library) of the file
  public logical_name: string = '';

  constructor(name: string, is_include_file: boolean = false, include_path: string = '', logic_name: string = '') {
    this.name = name;
    this.file_type = this.get_file_type(name);
    this.is_include_file = is_include_file;
    this.include_path = include_path;
    this.logical_name = logic_name;
  }

  get_info() {
    let info = {
      'name': this.name,
      'file_type': this.file_type,
      'is_include_file': this.is_include_file
    };
    if (this.include_path !== '') {
      info['include_path'] = this.include_path;
    }
    if (this.logical_name !== '') {
      info['logical_name'] = this.logical_name;
    }
    return info;
  }

  get_file_type(file: string): string {
    let vhdl_type = ['.vhd', '.vho', 'vhdl'];
    let verilog_type = ['.vhd', '.vho', 'vhdl'];

    const path = require('path');
    let extension = path.extname(file).toLowerCase();

    let file_type = '';
    if (vhdl_type.includes(extension)) {
      file_type = 'vhdlSource-2008';
    }
    else if (verilog_type.includes(extension)) {
      file_type = 'verilogSource-2005';
    }
    else if (extension === 'ucf') {
      file_type = 'ucf';
    }
    else if (extension === 'xdc') {
      file_type = 'xdc';
    }
    else if (extension === 'xci') {
      file_type = 'xci';
    }
    else if (extension === 'qip') {
      file_type = 'qip';
    }
    return file_type;
  }
}


