/* eslint-disable @typescript-eslint/class-name-casing */

import * as vscode from "vscode";
import * as path_lib from "path";

export function get_icon_light(full_path){
    const path = require("path");
    let file_extension = path.extname(full_path);
    let filename = path.basename(full_path);
    
    let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "verilog.svg");
    // Python file
    if (file_extension === '.py'){
      path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "python.svg");
    }
    else if(filename === 'Makefile'){
      path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "makefile.svg");
    }
    return path_icon_light;
}
  
export function get_icon_dark(full_path){
    const path = require("path");
    let file_extension = path.extname(full_path);
    let filename = path.basename(full_path);
    
    let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "verilog.svg");
    // Python file
    if (file_extension === '.py'){
      path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "python.svg");
    }
    else if(filename === 'Makefile'){
      path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "makefile.svg");  
    }
    return path_icon_dark;
}

export class TreeItem extends vscode.TreeItem {
    children: TreeItem[] | undefined;
    project_name: string;
    title: string = "";
    library_name: string;
    path: string = "";
  
    constructor(label: string, children?: TreeItem[]) {
      super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
      );
      this.project_name = label;
      this.children = children;
      this.contextValue = "teroshdl";
      this.library_name = "";
    }
  }
  
export class Test_title_item extends vscode.TreeItem {
    children: TreeItem[] | undefined;
    project_name: string;
    title: string = "";
    library_name: string;
    path: string = "";
  
    constructor(label: string, children?: TreeItem[]) {
      super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
      );
      this.project_name = label;
      this.children = children;
      this.contextValue = "test_title";
      this.library_name = "";
    }
  }
  
export class Build_title_item extends vscode.TreeItem {
    children: TreeItem[] | undefined;
    project_name: string;
    title: string = "";
    library_name: string;
    path: string = "";
  
    constructor(label: string, children?: TreeItem[]) {
      super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
      );
      this.project_name = label;
      this.children = children;
      this.contextValue = "build_title";
      this.library_name = "";
    }
}
  
export class Project_item extends vscode.TreeItem {
    children: TreeItem[] | undefined;
    project_name: string;
    title: string = "";
    library_name: string;
    path: string = "";
    item_type;
  
    constructor(label: string, children?: TreeItem[]) {
      super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
      );
      this.item_type = "project_item";
      this.project_name = label;
      this.children = children;
      this.contextValue = "project";
      this.library_name = "";
      let path_icon_light = path_lib.join(__filename, "..", "..", "..", "..", "resources", "light", "project.svg");
      let path_icon_dark = path_lib.join(__filename, "..", "..", "..", "..", "resources", "dark", "project.svg");
      this.iconPath = {
        light: path_icon_light,
        dark: path_icon_dark,
      };
    }
}
  
export class Library_item extends vscode.TreeItem {
    children: TreeItem[] | undefined;
    library_name: string = "";
    project_name: string;
    title: string = "";
    path: string = "";
    item_type;
  
    constructor(label: string, project_name: string, children?: TreeItem[]) {
      super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
      );
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      this.item_type = "library_item";
      this.project_name = project_name;
      this.library_name = label;
      this.children = children;
      this.contextValue = "hdl_library";
      let path_icon_light = path_lib.join(__filename, "..", "..", "..", "..", "resources", "light", "library.svg");
      let path_icon_dark = path_lib.join(__filename, "..", "..", "..", "..", "resources", "dark", "library.svg");
      this.iconPath = {
        light: path_icon_light,
        dark: path_icon_dark,
      };
    }
}
  
export class Hdl_item extends vscode.TreeItem {
    children: TreeItem[] | undefined;
    library_name: string;
    project_name: string;
    title: string;
    path: string;
    item_type;
  
    constructor(label: string, library_name, project_name: string, children?: TreeItem[]) {
      const path = require("path");
      let dirname = path.dirname(label);
      let basename = path.basename(label);
      super(
        basename,
        children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
      );
  
      this.item_type = "hdl_item";
      this.path = label;
      this.title = "";
      this.project_name = project_name;
      this.library_name = library_name;
      this.tooltip = label;
      this.description = dirname;
      this.children = children;
      this.contextValue = "hdl_source";
  
      let path_icon_light = get_icon_light(label);
      let path_icon_dark = get_icon_dark(label);
  
      this.iconPath = {
        light: path_icon_light,
        dark: path_icon_dark,
      };
  
      this.command = {
        command: "teroshdl_tree_view.open_file",
        title: "Select Node",
        arguments: [this],
      };
    }
}
  
export class Test_item extends vscode.TreeItem {
    children: TreeItem[] | undefined;
    library_name: string;
    project_name: string;
    title: string;
    path: string;
    location;
    item_type;
  
    constructor(label: string, location, children?: TreeItem[]) {
      const path = require("path");
      let dirname = path.dirname(label);
      let basename = path.basename(label);
      super(
        basename,
        children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
      );
  
      this.item_type = "test_item";
      this.path = label;
      this.title = "";
      this.project_name = "";
      this.library_name = "";
      this.tooltip = label;
      this.description = "";
      this.children = children;
      this.contextValue = "test";
      this.location = location;
      this.command = {
        command: "teroshdl_tree_view.go_to_code",
        title: "Go to test code",
        arguments: [this],
      };
    }
}
  
export class Build_item extends vscode.TreeItem {
    children: TreeItem[] | undefined;
    library_name: string;
    project_name: string;
    title: string;
    path: string;
    item_type;
  
    constructor(label: string, name: string,  children?: TreeItem[]) {
      super(
        name,
        children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
      );
  
      this.item_type = "build_item";
      this.path = label;
      this.title = "";
      this.project_name = "";
      this.library_name = "";
      this.tooltip = "Open " + name.toLocaleLowerCase();
      this.description = "";
      this.children = children;
      this.contextValue = "build_source";
  
      let path_icon_light = path_lib.join(__filename, "..", "..", "..", "..", "resources", "light", "archive.svg");;
      let path_icon_dark = path_lib.join(__filename, "..", "..", "..", "..", "resources", "dark", "archive.svg");;
  
      this.iconPath = {
        light: path_icon_light,
        dark: path_icon_dark,
      };
  
      this.command = {
        command: "teroshdl_tree_view.open_file",
        title: "Select Node",
        arguments: [this],
      };
    }
}