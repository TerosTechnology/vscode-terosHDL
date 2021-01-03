/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from 'vscode';
import * as path from 'path';
import * as Config_view from './config_view';
import * as Edam from './edam_project';
import * as Config from './config';
import * as Terminal from './terminal';
import * as Sample_projects from './sample_projects';
import * as Vunit from './vunit';
const path_lib = require('path');

export class Project_manager {

  tree!: TreeDataProvider;
  projects: TreeItem[] = [];
  config_view;
  edam_project_manager;
  config_file;
  workspace_folder;
  private terminal: Terminal.Terminal;
  private vunit_test_list: string[] = [];
  private vunit: Vunit.Vunit = new Vunit.Vunit();
  private last_vunit_results;

  constructor(context: vscode.ExtensionContext) {
    this.terminal = new Terminal.Terminal(context);
    this.edam_project_manager = new Edam.Edam_project_manager();
    this.config_file = new Config.Config(context.extensionPath);
    this.workspace_folder = this.config_file.get_workspace_folder();
    this.config_view = new Config_view.default(context, this.config_file);

    this.tree = new TreeDataProvider();
    if (this.workspace_folder !== '') {
      this.set_default_projects();
    }

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
    vscode.commands.registerCommand('teroshdl_tree_view.simulate', () =>
      this.simulate()
    );
    vscode.commands.registerCommand('teroshdl_tree_view.add_workspace', () =>
      this.add_workspace()
    );
    vscode.commands.registerCommand('teroshdl_tree_view.set_top', (item) =>
      this.set_top(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.run_vunit_test', (item) =>
      this.run_vunit_test(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.run_vunit_test_gui', (item) =>
      this.run_vunit_test_gui(item)
    );
    vscode.commands.registerCommand('teroshdl_tree_view.go_to_code', (item) =>
      this.go_to_code(item)
    );
  }

  async set_default_projects() {
    this.edam_project_manager.create_projects_from_edam(this.config_file.projects);
    await this.update_tree();
    let selected_project = this.config_file.selected_project;
    if (selected_project !== '' && selected_project !== undefined) {
      this.edam_project_manager.selected_project = selected_project;
    }
    this.update_tree();
  }

  async run_vunit_test(item) {
    let test: string[] = [item.label];
    let gui = false;
    let selected_project = this.edam_project_manager.selected_project;
    let prj = this.edam_project_manager.get_project(selected_project);
    let results = await this.vunit.run_simulation(prj.toplevel_path, test, gui);
    this.last_vunit_results = results;
    this.set_results();
  }

  async run_vunit_test_gui(item) {
    let test: string[] = [item.label];
    let gui = true;
    let selected_project = this.edam_project_manager.selected_project;
    let prj = this.edam_project_manager.get_project(selected_project);
    let results = this.vunit.run_simulation(prj.toplevel_path, test, gui);
    this.last_vunit_results = results;
    this.set_results();
  }

  async go_to_code(item) {
    let test: string[] = [item.label];
    let gui = true;
    let selected_project = this.edam_project_manager.selected_project;
    let prj = this.edam_project_manager.get_project(selected_project);
    let results = this.vunit.run_simulation(prj.toplevel_path, test, gui);
    this.last_vunit_results = results;
    this.set_results();
  }

  set_results() {
    this.tree.set_results(this.last_vunit_results);
  }

  set_top_from_project(project_name, library_name, path) {
    this.edam_project_manager.set_top(project_name, library_name, path);
    this.tree.select_top(project_name, library_name, path);
    this.save_project();
  }

  set_top(item) {
    let project_name = item.project_name;
    let library_name = item.library_name;
    let path = item.path;
    this.edam_project_manager.set_top(project_name, library_name, path);
    this.tree.select_top(project_name, library_name, path);
    this.save_project();
  }

  private show_export_message(msg) {
    vscode.window.showInformationMessage(msg);
  }

  async simulate() {
    let selected_project = this.edam_project_manager.selected_project;
    if (selected_project === '') {
      let msg = 'Mark a project to simulate';
      this.show_export_message(msg);
      return;
    }
    let prj = this.edam_project_manager.get_project(selected_project);
    let tool_configuration = this.config_file.get_config_of_selected_tool();

    let edam = {
      work_path: '',
      top_level: 'top_level',
      name: prj.name,
      files: prj.files,
      tool_installation_path: tool_configuration.installation_path,
      tool_name: tool_configuration.name,
      tool_options: tool_configuration.options
    };

    let results = await this.vunit.run_simulation(prj.toplevel_path, [], false);
    this.last_vunit_results = results;
    this.set_results();
  }

  async config() {
    this.config_view.open();
  }

  async add_workspace() {
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: 'Select workspace folder',
      canSelectFiles: false,
      canSelectFolders: true
    };
    vscode.window.showOpenDialog(options).then(value => {
      if (value !== undefined) {
        this.config_file.set_workspace_folder(value[0].fsPath);
        this.workspace_folder = value[0].fsPath;
        this.tree.init_tree();
      }
    });
  }

  async update_tree() {
    let vunit_test_list = ['Loading tests...'];
    let normalized_prjs = this.edam_project_manager.get_normalized_projects();
    this.tree.update_super_tree(normalized_prjs, vunit_test_list);
    let edam_projects = this.edam_project_manager.get_edam_projects();
    this.config_file.set_projects(edam_projects);

    let selected_project = this.config_file.selected_project;
    if (selected_project !== '') {
      this.tree.select_project(selected_project);
    }

    this.set_default_tops();
    this.set_results();

    vunit_test_list = await this.get_vunit_test_list();
    this.tree.update_super_tree(normalized_prjs, vunit_test_list);

    if (selected_project !== '') {
      this.tree.select_project(selected_project);
    }
    this.set_default_tops();
    this.set_results();
  }

  set_default_tops() {
    let tops = this.edam_project_manager.get_tops();
    for (let i = 0; i < tops.length; i++) {
      const top = tops[i];
      this.set_top_from_project(top.project_name, top.toplevel_library, top.toplevel_path);
    }
  }

  save_project() {
    let edam_projects = this.edam_project_manager.get_edam_projects();
    this.config_file.set_projects(edam_projects);
  }

  async add_file(item) {
    let library_name = item.library_name;
    let project_name = item.project_name;
    vscode.window.showOpenDialog({ canSelectMany: true }).then(value => {
      if (value !== undefined) {
        for (let i = 0; i < value.length; ++i) {
          this.edam_project_manager.add_file(project_name, value[i].fsPath, false, '', library_name);
          this.update_tree();
        }
      }
    });
  }

  async select_project(item) {
    let project_name = item.project_name;
    this.config_file.set_selected_project(project_name);
    this.edam_project_manager.select_project(project_name);
    this.update_tree();
    this.tree.select_project(project_name);
  }

  async rename_project(item) {
    let project_name = item.project_name;
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

  async get_vunit_test_list() {
    let runpy = this.edam_project_manager.get_top_from_selected_project();
    let tests;
    try {
      let runpy_ext = path_lib.extname(runpy);

      if (runpy !== undefined) {
        tests = await this.vunit.get_test_list(runpy);
      }
      else {
        this.vunit_test_list = [];
        return [];
      }
      let tests_vunit: string[] = [];
      for (let i = 0; i < tests.length; i++) {
        const element = tests[i];
        tests_vunit.push(element.name);
      }

      if (tests_vunit.length === 0) {
        tests_vunit = ['Not found.'];
      }

      this.vunit_test_list = tests_vunit;
      return tests_vunit;
    }
    catch (e) {
      this.vunit_test_list = ['Not found.'];
      return ['Not found.'];
    }
  }

  async add_project() {
    const project_add_types = ['Empty project', 'Load project', 'VHDL tutorial'];

    let picker_value = await vscode.window.showQuickPick(project_add_types,
      { placeHolder: 'Add/load a project.' });

    if (picker_value === project_add_types[0]) {
      vscode.window.showInputBox({ prompt: 'Set the project name', placeHolder: 'Project name' }).then(value => {
        if (value !== undefined) {
          let result = this.edam_project_manager.create_project(value);
          if (result !== 0) {
            this.show_export_message(result);
            return;
          }
          this.update_tree();
        }
      });
    }
    else if (picker_value === project_add_types[1]) {

    }
    else if (picker_value === project_add_types[2]) {
      let result = this.edam_project_manager.create_project_from_edam(Sample_projects.sample_vhdl);
      if (result !== 0) {
        this.show_export_message(result);
        return;
      }
      this.update_tree();
    }
  }
}

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null
    | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  data: TreeItem[] = [];
  projects: TreeItem[] = [];
  vunit_test_list_items: Test_item[] = [];

  init_tree() {
    this.data = [new TreeItem('TerosHDL Projects', []), new TreeItem('VUnit test list', [])];
    this.refresh();
  }

  update_super_tree(projects, vunit_test_list) {
    this.get_vunit_test_list_items(vunit_test_list);
    this.projects = [];
    for (let i = 0; i < projects.length; i++) {
      const element = projects[i];
      let prj = new Project(element.name, element.libraries);
      let prj_data = prj.get_prj();
      this.projects.push(prj_data);
    }
    this.update_tree();
  }

  set_results(results) {
    if (results === undefined) {
      return;
    }
    for (let i = 0; i < this.vunit_test_list_items.length; ++i) {
      const test = this.vunit_test_list_items[i];
      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        if (test.label === result.name) {

          if (result.pass === false) {
            let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'failed.svg');
            let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'failed.svg');
            test.iconPath = {
              light: path_icon_light,
              dark: path_icon_dark
            };
          }
          else {
            let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'passed.svg');
            let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'passed.svg');
            test.iconPath = {
              light: path_icon_light,
              dark: path_icon_dark
            };
          }
        }
      }
    }
    this.update_tree();
  }

  get_vunit_test_list_items(vunit_test_list) {
    let vunit_test_list_items: Test_item[] = [];
    for (let i = 0; i < vunit_test_list.length; i++) {
      const element = vunit_test_list[i];
      let item = new Test_item(element);
      vunit_test_list_items.push(item);
    }
    this.vunit_test_list_items = vunit_test_list_items;
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
        let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'project.svg');
        let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'project.svg');
        this.projects[i].iconPath = {
          light: path_icon_light,
          dark: path_icon_dark
        };
      }
    }
    this.update_tree();
  }

  set_icon_select_file(item) {
    let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'star-full.svg');
    let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'star-full.svg');
    item.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark
    };
  }

  set_icon_no_select_file(item) {
    let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'verilog.svg');
    let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'verilog.svg');
    item.iconPath = {
      light: path_icon_light,
      dark: path_icon_dark
    };
  }

  select_top(project_name, library, path) {
    for (let i = 0; i < this.projects.length; ++i) {
      if (this.projects[i].project_name === project_name) {
        let libraries_and_files = this.projects[i].children;
        for (let j = 0; libraries_and_files !== undefined && j < libraries_and_files.length; j++) {
          const lib_or_file = libraries_and_files[j];
          if (lib_or_file.contextValue === 'hdl_source' && lib_or_file.library_name === library && lib_or_file.path === path) {
            this.set_icon_select_file(lib_or_file);
          }
          else if (lib_or_file.contextValue === 'hdl_source') {
            this.set_icon_no_select_file(lib_or_file);
          }
          else {
            let lib_files = lib_or_file.children;
            for (let m = 0; lib_files !== undefined && m < lib_files.length; m++) {
              let file = lib_files[m];
              if (file.contextValue === 'hdl_source' && file.library_name === library && file.path === path) {
                this.set_icon_select_file(file);
              }
              else if (file.contextValue === 'hdl_source') {
                this.set_icon_no_select_file(file);
              }
            }
          }
        }
      }
    }
    this.update_tree();
  }

  update_tree() {
    this.data = [new TreeItem('TerosHDL Projects', this.projects), new TreeItem('VUnit test list', this.vunit_test_list_items)];
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
    let files_no_lib: (Library_item | Hdl_item)[] = [];
    for (let i = 0; i < sources.length; ++i) {
      if (sources[i].name === '') {
        let sources_no_lib = this.get_no_library(sources[i].name, sources[i].files);
        for (let i = 0; i < sources_no_lib.length; ++i) {
          files_no_lib.push(sources_no_lib[i]);
        }
      }
      else {
        let library = this.get_library(sources[i].name, sources[i].files);
        libraries.push(library);
      }
    }
    libraries = libraries.concat(files_no_lib);
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
  path: string = '';

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
  path: string = '';

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
  path: string = '';

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

class Test_item extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  library_name: string;
  project_name: string;
  title: string;
  path: string;

  constructor(label: string, children?: TreeItem[]) {
    const path = require('path');
    let dirname = path.dirname(label);
    let basename = path.basename(label);
    super(
      basename,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);

    this.path = label;
    this.title = '';
    this.project_name = '';
    this.library_name = '';
    this.tooltip = label;
    this.description = '';
    this.children = children;
    this.contextValue = 'test';
    // let path_icon_light = path.join(__filename, '..', '..', '..', '..', 'resources', 'light', 'verilog.svg');
    // let path_icon_dark = path.join(__filename, '..', '..', '..', '..', 'resources', 'dark', 'verilog.svg');
    // this.iconPath = {
    //   light: path_icon_light,
    //   dark: path_icon_dark
    // };
  }
}