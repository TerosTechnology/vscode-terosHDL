/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from 'vscode';
import * as path from 'path';

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
  "general_config": {
    "top": "top_entity",
    "project_directory": "/project/directory"
  },
  "libraries": [
    {
      "name": "library_0",
      "sources": [
        "/path/to/source/source_0.vhd",
        "/path/to/source/source_1.vhd",
        "/path/to/source/source_2.vhd"
      ]
    },
    {
      "name": "library_1",
      "sources": [
        "/path/to/source/source_1.vhd"
      ]
    },
    {
      "name": "library_2",
      "sources": [
        "/path/to/source/source_0.vhd",
        "/path/to/source/source_3.vhd"
      ]
    },
    {
      "name": "teroshdl_no_library",
      "sources": [
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

  constructor() {
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
    vscode.commands.registerCommand('teroshdl_tree_view.select_project', (item) =>
      this.select_project(item)
    );
  }
  async add_file(item) {
    let library_name = item.library_name;
    let project_name = item.project_name;
    vscode.window.showOpenDialog({ canSelectMany: true }).then(value => {
      if (value !== undefined) {
        // let file_path = value.path;
        let paths: string[] = [];
        for (let i = 0; i < value.length; ++i) {
          paths.push(value[i].fsPath);
        }
        this.tree.add_file(project_name, library_name, paths);
      }
    });
  }

  async select_project(item) {
    let project_name = item.project_name;
    this.selected_project = project_name;
    this.tree.select_project(project_name);
  }

  async delete_file(item) {
    let library_name = item.library_name;
    let project_name = item.project_name;
    let path = item.path;
    this.tree.delete_file(project_name, library_name, path);
  }

  async add_project() {
    const project_add_types = ['Empty project', 'Load project', 'VHDL tutorial'];

    let picker_value = await vscode.window.showQuickPick(project_add_types,
      { placeHolder: 'Add/load a project.' });

    if (picker_value === project_add_types[0]) {
      vscode.window.showInputBox({ prompt: 'Set the project name', placeHolder: 'Project name' }).then(value => {
        if (value !== undefined) {
          this.tree.add_project(value, undefined);
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

  add_file(project_name, library_name, files) {
    let project = this.search_project_in_tree(project_name);
    let library = this.search_library_in_project(project, library_name);
    let files_lib = this.get_files_from_library(library);
    files_lib = files_lib.concat(files);
    library = this.get_library(project_name, library_name, files_lib);
    this.insert_library(project_name, library_name, library);
    this.update_tree();
  }

  delete_file(project_name, library_name, file) {
    if (library_name !== 'teroshdl_no_library') {
      this.delete_file_with_library(project_name, library_name, file);
    }
    else {
      this.delete_file_no_library(project_name, file);
    }
  }

  delete_file_with_library(project_name, library_name, file) {
    let project = this.search_project_in_tree(project_name);
    let library = this.search_library_in_project(project, library_name);
    let files_lib = this.get_files_from_library(library);
    files_lib = files_lib.filter(e => e !== file);
    library = this.get_library(project_name, library_name, files_lib);
    this.insert_library(project_name, library_name, library);
    this.update_tree();
  }

  delete_file_no_library(project_name, file) {
    let project = this.search_project_in_tree(project_name);
    let libraries = this.search_no_library_in_project(project, file);
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].project_name === project_name) {
        this.projects[i] = new Project_item(project_name, libraries);
      }
    }
    this.update_tree();
  }

  insert_library(project_name, library_name, library) {
    //Search project
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].project_name === project_name) {
        let project = this.projects[i];
        //Search sources
        let libraries = project.children;
        for (let m = 0; libraries !== undefined && m < libraries.length; ++m) {
          if (libraries[m].library_name === library_name) {
            libraries[m] = library;
          }
        }
      }
    }
  }

  get_library(project_name, library_name, sources) {
    let tree: Hdl_item[] = [];
    for (let i = 0; i < sources.length; ++i) {
      let item_tree = new Hdl_item(sources[i], library_name, project_name);
      tree.push(item_tree);
    }
    let library = new Library_item(library_name, project_name, tree);
    return library;
  }

  search_project_in_tree(project_name) {
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].project_name === project_name) {
        return this.projects[i];
      }
    }
    return undefined;
  }

  search_library_in_project(project, library_name) {
    let libraries = project.children;
    if (libraries === undefined) {
      return undefined;
    }
    for (let i = 0; i < libraries.length; ++i) {
      if (libraries[i].library_name === library_name) {
        return libraries[i];
      }
    }
    return undefined;
  }

  search_no_library_in_project(project, file) {
    let files_no_libraries: (Library_item | Hdl_item)[] = [];
    let no_libraries = project.children;
    if (no_libraries === undefined) {
      return undefined;
    }
    for (let i = 0; i < no_libraries.length; ++i) {
      if (no_libraries[i].contextValue === 'hdl_library') {
        files_no_libraries.push(no_libraries[i]);
      }
      else if (no_libraries[i].library_name === 'teroshdl_no_library' && no_libraries[i].path !== file) {
        files_no_libraries.push(no_libraries[i]);
      }
    }
    return files_no_libraries;
  }

  get_files_from_library(library) {
    let files: string[] = [];
    let childrens = library.children;
    for (let i = 0; i < childrens.length; ++i) {
      files.push(childrens[i].path);
    }
    return files;
  }

  update_tree() {
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

  constructor(name: string, sources) {
    this.name = name;
    if (sources !== undefined) {
      let sources_items = this.get_sources(sources);
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
        let sources_no_lib = this.get_no_library(sources[i].name, sources[i].sources);
        for (let i = 0; i < sources_no_lib.length; ++i) {
          libraries.push(sources_no_lib[i]);
        }
      }
      else {
        let library = this.get_library(sources[i].name, sources[i].sources);
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
  }
}