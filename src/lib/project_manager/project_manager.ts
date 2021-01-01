/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from 'vscode';
import * as path from 'path';
import * as Config_view from './config_view';
import * as Edam from './edam_project';

// {
//   "general_config": {
//     "top" : "top_entity"
//   },
//   "sources": [
//     {
//       "name": "library_0",
//       "sources": [
//         "source_0.vhd",
//         "source_1.vhd",
//         "source_2.vhd"
//       ]
//     },
//     {
//       "name": "library_1",
//       "sources": [
//         "source_1.vhd"
//       ]
//     },
//     {
//       "name": "library_2",
//       "sources": [
//         "source_0.vhd",
//         "source_3.vhd"
//       ]
//     },
//     {
//       "name": "teros_hdl_default",
//       "sources": [
//         "source_5.vhd",
//         "source_6.vhd"
//       ]
//     }
//   ]
// }



// - add_file -> (name, library) : añade un fichero en la librería L
// - delete_file -> (name, library) : borra un fichero de la libería L
// - add_library -> (name) : crea una librería nueva L
// - delete_library -> (name) : borra la librería L
// - get_tree(id) : devuelve el json de un proyecto ID
// - set_simulator_configuration() : envía la configuración de los tools
// - get_simulator_configuration() : pide la configuración de los tools


let example_json = {
  "name": "sample",
  "general_config": {
    "top": "top_entity",
    "project_directory": "/project/directory"
  },
  "libraries": [
    {
      "name": "library_0",
      "files": [
        "/path/to/source/source_0.vhd",
        "/path/to/source/source_1.vhd",
        "/path/to/source/source_2.vhd"
      ]
    },
    {
      "name": "library_1",
      "files": [
        "/path/to/source/source_1.vhd"
      ]
    },
    {
      "name": "library_2",
      "files": [
        "/path/to/source/source_0.vhd",
        "/path/to/source/source_3.vhd"
      ]
    },
    {
      "name": "teroshdl_no_library",
      "files": [
        "/path/to/source/source_5.vhd",
        "/path/to/source/source_6.vhd"
      ]
    }
  ]
};

export class Project_manager {

  tree!: TreeDataProvider;
  projects: TreeItem[] = [];
  selected_project: string = '';
  config_view;
  edam_project_manager;

  constructor(context: vscode.ExtensionContext) {
    this.edam_project_manager = new Edam.Edam_project_manager();

    this.config_view = new Config_view.default(context);

    this.tree = new TreeDataProvider();
    vscode.window.registerTreeDataProvider('teroshdl_tree_view', this.tree);
    vscode.commands.registerCommand('teroshdl_tree_view.add_project', () =>
      this.add_project()
    );
    vscode.commands.registerCommand('teroshdl_tree_view.add_file', (item) =>
      this.add_file(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.delete_file', (item) =>
      this.delete_file(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.delete_library', (item) =>
      this.delete_library(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.add_library', (item) =>
      this.add_library(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.delete_project', (item) =>
      this.delete_project(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.select_project', (item) =>
      this.select_project(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.rename_project', (item) =>
      this.rename_project(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.rename_library', (item) =>
      this.rename_library(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.config', () =>
      this.config()
    );
  }

  async config() {
    this.config_view.open();
  }


  async update_tree() {
    let normalized_prjs = this.edam_project_manager.get_normalized_projects();
    this.tree.update_super_tree(normalized_prjs);
  }


  async add_file(item) {
    let library_name = item.library_name;
    if (library_name === '') {
      library_name = 'teroshdl_no_library';
    }

    let project_name = item.project_name;
    vscode.window.showOpenDialog({ canSelectMany: true }).then(value => {
      if (value !== undefined) {
        // let file_path = value.path;
        for (let i = 0; i < value.length; ++i) {
          this.edam_project_manager.add_file(project_name, value[i].fsPath, false, '', library_name);
          this.update_tree();
        }
      }
    });
  }

  async select_project(item) {
    let project_name = item.project_name;
    this.edam_project_manager.select_project(project_name);
    this.tree.select_project(project_name);
  }

  async rename_project(item) {
    let project_name = item.project_name;
    this.selected_project = project_name;
    vscode.window.showInputBox({ prompt: 'Set the project name', value: project_name }).then(value => {
      if (value !== undefined) {
        this.edam_project_manager.rename_project(project_name, value);
        this.update_tree();
      }
    });
  }

  async rename_library(item) {
    let project_name = item.project_name;
    let library_name = item.library_name;
    vscode.window.showInputBox({ prompt: 'Set the library name', value: library_name }).then(value => {
      if (value !== undefined) {
        this.edam_project_manager(project_name, library_name, value);
        this.update_tree();
      }
    });
  }

  async delete_project(item) {
    let project_name = item.project_name;
    if (this.selected_project === project_name) {
      this.selected_project = '';
    }
    this.edam_project_manager.delete_project(project_name);
    this.update_tree();
  }

  async delete_file(item) {
    let library_name = item.library_name;
    let project_name = item.project_name;
    let path = item.path;

    this.edam_project_manager.delete_file(project_name, path, library_name);
    this.update_tree();
  }

  async delete_library(item) {
    let library_name = item.library_name;
    let project_name = item.project_name;
    this.edam_project_manager.delete_logical_name(project_name, library_name);
    this.update_tree();
  }

  async add_library(item) {
    let project_name = item.project_name;
    vscode.window.showInputBox({ prompt: 'Set library name', placeHolder: 'Library name' }).then(value => {
      if (value !== undefined) {
        this.edam_project_manager.add_file(project_name, 'teroshdl_phantom_file', false, '', value);
        this.update_tree();
      }
    });
  }

  async add_project() {
    const project_add_types = ['Empty project', 'Load project', 'VHDL tutorial'];

    let picker_value = await vscode.window.showQuickPick(project_add_types,
      { placeHolder: 'Add/load a project.' });

    if (picker_value === project_add_types[0]) {
      vscode.window.showInputBox({ prompt: 'Set the project name', placeHolder: 'Project name' }).then(value => {
        if (value !== undefined) {
          this.edam_project_manager.create_project(value);
          this.update_tree();
        }
      });
    }
    else if (picker_value === project_add_types[1]) {

    }
    else if (picker_value === project_add_types[2]) {
      this.tree.add_project('VHDL_tutorial', example_json.libraries);
    }
  }
}

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null
    | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  data: TreeItem[] = [];
  projects: TreeItem[] = [];

  constructor() {
    this.data = [new TreeItem('TerosHDL Projects', [])];
  }


  update_super_tree(projects) {
    this.projects = [];
    for (let i = 0; i < projects.length; i++) {
      const element = projects[i];
      let prj = new Project(element.name, element.libraries);
      let prj_data = prj.get_prj();
      this.projects.push(prj_data);
    }
    this.update_tree();
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
        let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'symbol-event.svg');
        let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'symbol-event.svg');
        this.projects[i].iconPath = {
          light: path_icon_light,
          dark: path_icon_dark
        };
      }
      else {
        this.projects[i].iconPath = undefined;
      }
    }
    this.update_tree();
  }

  update_tree() {
    // this.data = [new TreeItem('TerosHDL Projects', this.projects)];
    this.data = [new TreeItem('TerosHDL Projects', this.projects)];

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
  private name: string = '';
  data: TreeItem;

  constructor(name: string, libraries) {
    this.name = name;
    if (libraries !== undefined) {
      let sources_items = this.get_sources(libraries);
      this.data = new Project_item(name, sources_items);
    }
    else {
      this.data = new Project_item(name, []);
    }
  }

  get_prj() {
    return this.data;
  }

  get_sources(sources) {
    let libraries: (Library_item | Hdl_item)[] = [];
    for (let i = 0; i < sources.length; ++i) {
      if (sources[i].name === 'teroshdl_no_library') {
        let sources_no_lib = this.get_no_library(sources[i].name, sources[i].files);
        for (let i = 0; i < sources_no_lib.length; ++i) {
          libraries.push(sources_no_lib[i]);
        }
      }
      else {
        let library = this.get_library(sources[i].name, sources[i].files);
        libraries.push(library);
      }
    }
    return libraries;
  }

  get_library(library_name, sources): Library_item {
    let tree: Hdl_item[] = [];
    for (let i = 0; i < sources.length; ++i) {
      let item_tree = new Hdl_item(sources[i], library_name, this.name);
      tree.push(item_tree);
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

class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  project_name: string;
  title: string = '';
  library_name: string;

  constructor(label: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);
    this.project_name = label;
    this.children = children;
    this.contextValue = 'teroshdl';
    this.library_name = '';
    // let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'teros_logo.svg');
    // let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'teros_logo.svg');
    // this.iconPath = {
    //   light: path_icon_light,
    //   dark: path_icon_dark
    // };
  }
}

class Project_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  project_name: string;
  title: string = '';
  library_name: string;

  constructor(label: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);
    this.project_name = label;
    this.children = children;
    this.contextValue = 'project';
    this.library_name = '';
    let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'project.svg');
    let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'project.svg');
    this.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark
    };
  }
}

class Library_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  library_name: string = '';
  project_name: string;
  title: string = '';

  constructor(label: string, project_name: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);
    this.project_name = project_name;
    this.library_name = label;
    this.children = children;
    this.contextValue = 'hdl_library';
    let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'library.svg');
    let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'library.svg');
    this.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark
    };
  }
}

class Hdl_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  library_name: string;
  project_name: string;
  title: string;
  path: string;

  constructor(label: string, library_name, project_name: string, children?: TreeItem[]) {
    const path = require('path');
    let dirname = path.dirname(label);
    let basename = path.basename(label);
    super(
      basename,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);

    this.path = label;
    this.title = '';
    this.project_name = project_name;
    this.library_name = library_name;
    this.tooltip = label;
    this.description = dirname;
    this.children = children;
    this.contextValue = 'hdl_source';
    let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'verilog.svg');
    let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'verilog.svg');
    this.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark
    };
  }
}