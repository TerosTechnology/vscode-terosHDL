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

export class Config_reader {
  private config_filepath: string = '';
  private config: {} = {};

  constructor(context) {
    let folder_path = context.extensionPath;
    this.config_filepath = path.join(folder_path, teroshdl_config_filename);
  }

  read_file_config() {
    let exists = fs.existsSync(this.config_filepath);
    if (exists === false){
        return;
    }
    try {
      let raw_data = fs.readFileSync(this.config_filepath);
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
  
  get_config_fiels(field){
    let config = this.read_file_config();
    let config_tool = config?.config.config_tool.config;
    for (let i = 0; i < config_tool.length; i++) {
      const element = config_tool[i];
      for(let attributename in element){
        if (attributename === field){
          return element[attributename];
        }
      }     
    }
  }

  get_config_python_path(){
    let field = this.get_config_fiels('general');
    return field.pypath;
  }

  get_config_documentation(){
    this.read_file_config()
    let pypath = this.get_config_python_path();
    let field = this.get_config_fiels('documentation');
    field.pypath = pypath;
    return field;
  }

}