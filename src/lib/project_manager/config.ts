import { pathToFileURL } from "url";

const fs = require('fs');
const path = require('path');

const teroshdl_config_filename = 'prj_config.teros';

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
      this.create_new_file_config(this.config_filepath);
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

  set_config_tool(config_tool) {
    this.config['config_tool'] = config_tool;
    this.save_current_config();
  }

  set_workspace_folder(folder_path) {
    this.config['workspace_folder'] = folder_path;
    this.save_current_config();
  }

  save_current_config() {
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
  ls
  get_config_tool() {
    return this.config['config_tool'];
  }

  get_config_of_selected_tool() {
    try {
      let selected_tool = this.config['config_tool'].selected_tool;
      let all_configs = this.config['config_tool'].config;
      let config_selected_tool;
      for (let i = 0; i < all_configs.length; i++) {
        const element = all_configs[i];
        if (element.name === selected_tool) {
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