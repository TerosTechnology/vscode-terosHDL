/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from 'vscode';


// {
//   "hdl_sources": [
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



// - add_file -> (name, library)
// - delete_file -> (name, library)
// - add_library -> (name)
// - delete_library -> (name)
// - get_tree()
// - set_simulator_configuration()
// - get_simulator_configuration()


let example_json = {
  "hdl_sources": [
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
      "name": "teros_hdl_default",
      "sources": [
        "/path/to/source/source_5.vhd",
        "/path/to/source/source_6.vhd"
      ]
    }
  ]
};



export class Project_manager {
  tree!: TreeDataProvider;

  constructor() {
    this.tree = new TreeDataProvider();
    vscode.window.registerTreeDataProvider('teroshdl_tree_view', this.tree);
    // vscode.commands.registerCommand('TerosHDLtreeview.refreshEntry', () =>
    //   console.log("hola")
    // );
  }
}




class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  onDidChangeTreeData?: vscode.Event<TreeItem | null | undefined> | undefined;

  data: TreeItem[] = [];

  constructor() {
    let json_hdl_sources = example_json.hdl_sources;
    let hdl_sources = this.get_hdl_sources(json_hdl_sources);

    this.data = [new TreeItem('TerosHDL Project', [
      new TreeItem(
        'HDL sources', hdl_sources)
    ])];
  }

  get_hdl_sources(hdl_sources) {
    let libraries: Library_item[] = [];
    for (let i = 0; i < hdl_sources.length; ++i) {
      let library = this.get_library(hdl_sources[i].name, hdl_sources[i].sources);
      libraries.push(library);
    }
    return libraries;
  }

  get_library(library_name, sources) {
    let tree: Hdl_item[] = [];
    for (let i = 0; i < sources.length; ++i) {
      let item_tree = new Hdl_item(sources[i]);
      tree.push(item_tree);
    }
    let library = new Library_item(library_name, tree);
    return library;
  }




  set_tree(hdl_sources, other_sources) {
    let hdl_tree: TreeItem[] = [];
    for (let i = 0; i < hdl_sources.length; ++i) {
      let item_tree = new TreeItem(hdl_sources[i]);
      hdl_tree.push(item_tree);
    }

    let other_tree: TreeItem[] = [];
    for (let i = 0; i < other_sources.length; ++i) {
      let item_tree = new TreeItem(other_sources[i]);
      other_tree.push(item_tree);
    }

    this.data = [new TreeItem('TerosHDL Project', [
      new TreeItem(
        'HDL sources', hdl_tree),
      new TreeItem(
        'Other sources', other_tree)
    ])];
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

class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;

  constructor(label: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);
    this.tooltip = `this is tooltip`;
    this.description = 'esto es una descripción';
    this.children = children;
    this.contextValue = 'title';
  }
}

class Library_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;

  constructor(label: string, children?: TreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);
    this.description = 'Library item';
    this.children = children;
    this.contextValue = 'hdl_library';
  }
}

class Hdl_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;

  constructor(label: string, children?: TreeItem[]) {
    const path = require('path');
    let dirname = path.dirname(label);
    let basename = path.basename(label);
    super(
      basename,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);

    this.tooltip = label;
    this.description = dirname;
    this.children = children;
    this.contextValue = 'hdl_source';
  }
}