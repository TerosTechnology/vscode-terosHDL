// Copyright 2020 Teros Technology
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
const fs = require('fs');
const path = require('path');

const teroshdl_config_filename = 'prj_config.teros';
const teroshdl_config_filename_default = 'prj_config_default.teros';

export class Config {
  private config_filepath: string = '';
  private config: {} = {};
  private projects: {}[] = [];
  public selected_project: string = '';

  constructor(folder_path) {
    this.config_filepath = folder_path + path.sep + teroshdl_config_filename;
    let exists = fs.existsSync(this.config_filepath);
    if (exists === true) {
      let result = this.read_file_config(this.config_filepath);
      this.config = result.config;
      this.projects = result.projects;
      this.selected_project = result.selected_project;
    }
    else {
      let default_confi_path = folder_path + path.sep + teroshdl_config_filename_default;
      let result = this.read_file_config(default_confi_path);
      this.config = result.config;
      this.projects = result.projects;
      this.selected_project = result.selected_project;
    }
  }

  get_workspace_folder() {
    try {
      let workspace_folder = this.config['workspace_folder'];
      if (workspace_folder === undefined) {
        workspace_folder = '';
      }
      return workspace_folder;
    }
    catch (e) {
      return '';
    }
  }

  set_selected_project(selected_project) {
    this.selected_project = selected_project;
    this.save_current_config();
  }

  set_projects(projects) {
    this.projects = projects;
    this.save_current_config();
  }

  // set_config_tool_for_project_selected(){
  //   let current_config_tool = this.get_config_of_selected_tool();
  //   for (let i = 0; i < this.projects.length; i++) {
  //     const element = this.projects[i];
  //     if (element['name'] === this.selected_project){
  //       let selected_project_config_tool = element['tool_options'];

  //       current_config_tool.toplevel = '';
  //       if (selected_project_config_tool.toplevel !== undefined){
  //         current_config_tool.toplevel = selected_project_config_tool.toplevel;
  //       }

  //       current_config_tool.toplevel_library = '';
  //       if (selected_project_config_tool.toplevel_library !== undefined){
  //         current_config_tool.toplevel_library = selected_project_config_tool.toplevel_library;
  //       }

  //       current_config_tool.toplevel_path = '';
  //       if (selected_project_config_tool.toplevel_path !== undefined){
  //         current_config_tool.toplevel_path = selected_project_config_tool.toplevel_path;
  //       }
  //     }
  //   }
  // }

  set_config_tool(config_tool) {
    this.config['config_tool'] = config_tool;
    this.save_current_config();
  }

  set_workspace_folder(folder_path) {
    this.config['workspace_folder'] = folder_path;
    this.save_current_config();
  }

  save_current_config() {
    // this.set_config_tool_for_project_selected();
    let config_to_file = {
      selected_project: this.selected_project,
      projects: this.projects,
      config: this.config
    };

    let json_content = JSON.stringify(config_to_file);
    fs.writeFileSync(this.config_filepath, json_content, 'utf8');
  }

  read_file_config(file_path) {
    try {
      let raw_data = fs.readFileSync(file_path);
      let json_data = JSON.parse(raw_data);
      let config = json_data.config;
      let projects = json_data.projects;
      let selected_project = json_data.selected_project;
      return { selected_project: selected_project, config: config, projects: projects };
    }
    catch (e) {
      return { config: {}, projects: [] };
    }
  }
  

  get_config_documentation(){
    let pypath = this.get_config_python_path();
    let config_tool = this.config['config_tool'].config;
    for (let i = 0; i < config_tool.length; i++) {
      const element = config_tool[i];
      for(let attributename in element){
        if (attributename === 'documentation'){
          element[attributename]['pypath'] = pypath;
          return element[attributename];
        }
      }     
    }
  }

  get_config_python_path(){
    let config_tool = this.config['config_tool'].config;
    for (let i = 0; i < config_tool.length; i++) {
      const element = config_tool[i];
      for(let attributename in element){
        if (attributename === 'general'){
          return element[attributename].pypath;
        }
      }     
    }
  }


  get_config_all_tool() {
    return this.config['config_tool'].config;
  }

  set_tool(tool){
    // let all_tools = this.get_config_tool();
    let config_tool = this.config['config_tool'].config;
    for (let i = 0; i < config_tool.length; i++) {
      const element = config_tool[i];
      for(let attributename in element){
        if (attributename === 'general'){
          element[attributename].select_tool = tool;
          break;
        }
      }     
    }
    this.save_current_config();
  }

  get_config_tool() {
    let config_tool = this.config['config_tool'].config;
    for (let i = 0; i < config_tool.length; i++) {
      const element = config_tool[i];
      for(let attributename in element){
        if (attributename === 'general'){
          return element[attributename].select_tool;
        }
      }     
    }
  }

  get_all_config_tool() {
    let config_tool = this.config['config_tool'].config;
    return config_tool;
  }

  get_config_of_selected_tool() {
    try {
      let selected_tool = this.get_config_tool();
      let all_configs = this.config['config_tool'].config;
      let config_selected_tool;
      for (let i = 0; i < all_configs.length; i++) {
        const element = all_configs[i];
        let tool_name = '';
        for (var attributename in element) {
          tool_name = attributename;
        }

        if (tool_name === selected_tool) {
          config_selected_tool = element;
        }
      }
      return config_selected_tool;
    }
    catch (e) {
      return {};
    }
  }

  create_new_file_config(file_path) {
    let config = {
      selected_project: '',
      workspace_folder: '',
      projects: []
    };
    let json_content = JSON.stringify(config);
    fs.writeFileSync(file_path, json_content, 'utf8');
  }

}