/* eslint-disable @typescript-eslint/class-name-casing */
export class Edam_project_manager {
  public projects: Edam_project[] = [];
  public selected_project: string = '';

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


  create_project_from_edam(edam) {
    if (this.check_if_project_exists(edam.name) === true) {
      return `The project with name [${edam.name}] already exists in the workspace.`;
    }

    this.create_project(edam.name);
    let files = edam.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.add_file(edam.name, file.name, file.is_include_file, file.include_path, file.logical_name);
    }
    return 0;
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

  create_project(name) {
    if (this.check_if_project_exists(name) === true) {
      return `The project with name [${name}] already exists in the workspace.`;
    }

    let prj = new Edam_project(name);
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

class Edam_project {
  public files: Edam_file[] = [];
  //Required Name of the project
  public name: string = '';
  //Toplevel module(s) for the project.
  public top_level: string = '';
  //A dictionary of tool-specific options.
  public tool_options;

  constructor(name: string, tool_options = {}) {
    this.name = name;
    this.tool_options = tool_options;
  }

  set_name(name) {
    this.name = name;
  }

  export_edam_file() {
    let edam_file = {
      name: this.name,
      tool_options: {},
      toplevel: ''
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
  }

  rename_logical_name(name, new_name) {
    for (let i = 0; i < this.files.length; ++i) {
      if (this.files[i].logical_name !== name) {
        this.files[i].logical_name = new_name;
      }
    }
  }

  add_file(name: string, is_include_file: boolean = false, include_path: string = '', logic_name: string = '') {
    let edam_file = new Edam_file(name, is_include_file, include_path, logic_name);
    this.files.push(edam_file);
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


