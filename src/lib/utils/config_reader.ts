/* eslint-disable @typescript-eslint/class-name-casing */
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
import * as Output_channel_lib from '../utils/output_channel';
import * as vscode from 'vscode';

const ERROR_CODE = Output_channel_lib.ERROR_CODE;
const teroshdl_config_filename = 'prj_config.teros';

export class Config_reader {
  private config_filepath: string = '';
  private config: {} = {};
  private output_channel : Output_channel_lib.Output_channel;

  constructor(context: vscode.ExtensionContext, output_channel: Output_channel_lib.Output_channel) {
    this.output_channel = output_channel;
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
  
  get_config_fields(field){
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

  get_header_path(){
    let field = this.get_config_fields('templates');
    return field.header_file_path;
  }

  get_config_python_path(){
    let field = this.get_config_fields('general');
    return field.pypath;
  }

  async get_python_path_binary(verbose: boolean){
    let config_python_path = this.get_config_python_path();
    const jsteros = require('jsteros');
    let python = await jsteros.Nopy.get_python_exec(config_python_path);
    if (python === '' || python === undefined){
      if (verbose === true){
        this.output_channel.show_message(ERROR_CODE.PYTHON, config_python_path);
      }
      return config_python_path;
    }
    return python;
  }

  get_config_documentation(){
    let pypath = this.get_config_python_path();
    let field = this.get_config_fields('documentation');
    field.pypath = pypath;
    return field;
  }

  get_linter_name(lang, linter_type){
    let field_linter = this.get_config_fields('linter');
    let selected_linter = '';
    if (lang === 'verilog' && linter_type === 'style'){
      selected_linter = field_linter.style_verilog;
    }
    else if (lang === 'vhdl'){
      selected_linter = field_linter.linter_vhdl;
    }
    else{
      selected_linter = field_linter.linter_verilog;
    }
    return selected_linter;
  }

  get_formatter_name(lang){
    let field_linter = this.get_config_fields('formatter');
    let selected_formatter = '';
    if (lang === 'vhdl'){
      selected_formatter = field_linter.formatter_vhdl;
    }
    else{
      selected_formatter = field_linter.formatter_verilog;
    }
    return selected_formatter;
  }

  get_formatter_config(){
    let field_linter = this.get_config_fields('formatter');
    return field_linter;
  }

  get_linter_config(lang, linter_type){
    let linter_name = this.get_linter_name(lang, linter_type);
    if (linter_name === 'xvhdl' || linter_name === 'xvlog'){
      linter_name = 'vivado';
    }
    else if(linter_name === 'verible'){
      linter_name = 'veriblelint';
    }
    let field_linter = this.get_config_fields(linter_name);
    return field_linter;
  }

}