import * as Tree_types from "./tree_types";
import * as vscode from "vscode";
import * as path from "path";
import * as utils from "./utils";

export class TreeDataProvider implements vscode.TreeDataProvider<Tree_types.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<Tree_types.TreeItem | undefined | null | void> = new vscode.EventEmitter<
        Tree_types.TreeItem | undefined | null | void
    >();
    readonly onDidChangeTreeData: vscode.Event<Tree_types.TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    data: Tree_types.TreeItem[] = [];
    projects: Tree_types.TreeItem[] = [];
    test_list_items: Tree_types.Test_item[] = [];
    build_list_items: Tree_types.Build_item[] = [];

    init_tree() {
        this.data = [new Tree_types.TreeItem("TerosHDL Projects", []), new Tree_types.TreeItem("Runs list", []),
        new Tree_types.TreeItem("Output products", [])];
        this.refresh();
    }

    set_test_list(test_list) {
        this.get_test_list_items(test_list);
        this.update_tree();
    }

    update_super_tree(projects, test_list) {
        this.get_test_list_items(test_list);
        this.get_build_list_items(test_list);
        this.projects = [];
        for (let i = 0; i < projects.length; i++) {
            const element = projects[i];
            let prj = new Project(element.name, element.libraries);
            let prj_data = prj.get_prj();
            this.projects.push(prj_data);
        }
        this.update_tree();
    }

    set_results(results, force_fail_all) {
        if (results === undefined) {
            return;
        }
        if (force_fail_all === true) {
            this.set_fail_all_tests();
            return;
        }
        for (let i = 0; i < this.test_list_items.length; ++i) {
            const test = this.test_list_items[i];
            for (let j = 0; j < results.length; j++) {
                const result = results[j];
                if (test.label === result.name) {
                    if (result.pass === false) {
                        let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "failed.svg");
                        let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "failed.svg");
                        test.iconPath = {
                            light: path_icon_light,
                            dark: path_icon_dark,
                        };
                    } else {
                        let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "passed.svg");
                        let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "passed.svg");
                        test.iconPath = {
                            light: path_icon_light,
                            dark: path_icon_dark,
                        };
                    }
                }
            }
        }
        this.get_build_list_items(results);
        this.update_tree();
    }

    set_fail_all_tests() {
        for (let i = 0; i < this.test_list_items.length; ++i) {
            const test = this.test_list_items[i];
            let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "failed.svg");
            let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "failed.svg");
            test.iconPath = {
                light: path_icon_light,
                dark: path_icon_dark,
            };
        }
        this.update_tree();
    }

    get_test_list_items(test_list) {
        let test_list_items: Tree_types.Test_item[] = [];
        for (let i = 0; i < test_list.length; i++) {
            const element = test_list[i];
            if (element.name === undefined) {
                return test_list_items;
            }
            let item = new Tree_types.Test_item(element.name, element.location);
            if ("test_type" in element) {
                if (element.test_type !== undefined) {
                    item.contextValue = 'test_item';
                }
            }
            test_list_items.push(item);
        }
        this.test_list_items = test_list_items;
    }

    get_build_list_items(build_list) {
        if (build_list === undefined || build_list.length === 0 || build_list[0].builds === undefined) {
            this.build_list_items = [];
            return;
        }
        let build_i = build_list[0].builds;
        let build_list_items: Tree_types.Build_item[] = [];
        for (let i = 0; i < build_i.length; i++) {
            const element = build_i[i];
            let item = new Tree_types.Build_item(element.location, element.name);
            build_list_items.push(item);
        }
        this.build_list_items = build_list_items;
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
                let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "select.svg");
                let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "select.svg");
                this.projects[i].iconPath = {
                    light: path_icon_light,
                    dark: path_icon_dark,
                };
            } else {
                let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "project.svg");
                let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "project.svg");
                this.projects[i].iconPath = {
                    light: path_icon_light,
                    dark: path_icon_dark,
                };
            }
        }
        this.update_tree();
    }

    set_icon_select_file(item) {
        let path_icon_light = path.join(__filename, "..", "..", "..", "..", "resources", "light", "select.svg");
        let path_icon_dark = path.join(__filename, "..", "..", "..", "..", "resources", "dark", "select.svg");
        item.iconPath = {
            light: path_icon_light,
            dark: path_icon_dark,
        };
    }

    set_icon_no_select_file(item) {
        let item_path = item.path;
        let path_icon_light = utils.get_icon_light(item.path);
        let path_icon_dark = utils.get_icon_dark(item.path);

        item.iconPath = {
            light: path_icon_light,
            dark: path_icon_dark,
        };
    }

    select_top(project_name, library, path) {
        for (let i = 0; i < this.projects.length; ++i) {
            if (this.projects[i].project_name === project_name) {
                let libraries_and_files = this.projects[i].children;
                for (let j = 0; libraries_and_files !== undefined && j < libraries_and_files.length; j++) {
                    const lib_or_file = libraries_and_files[j];
                    if (
                        lib_or_file.contextValue === "hdl_source" &&
                        lib_or_file.library_name === library &&
                        lib_or_file.path === path
                    ) {
                        this.set_icon_select_file(lib_or_file);
                    } else if (lib_or_file.contextValue === "hdl_source") {
                        this.set_icon_no_select_file(lib_or_file);
                    } else {
                        let lib_files = lib_or_file.children;
                        for (let m = 0; lib_files !== undefined && m < lib_files.length; m++) {
                            let file = lib_files[m];
                            if (file.contextValue === "hdl_source" && file.library_name === library && file.path === path) {
                                this.set_icon_select_file(file);
                            } else if (file.contextValue === "hdl_source") {
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
        this.data = [
            new Tree_types.TreeItem("TerosHDL Projects", this.projects),
            new Tree_types.Test_title_item("Runs list", this.test_list_items),
            new Tree_types.Build_title_item("Output products", this.build_list_items),
        ];
        this.refresh();
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Tree_types.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: Tree_types.TreeItem | undefined): vscode.ProviderResult<Tree_types.TreeItem[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}

class Project {
    private name: string = "";
    data: Tree_types.TreeItem;

    constructor(name: string, libraries) {
        this.name = name;
        if (libraries !== undefined) {
            let sources_items = this.get_sources(libraries);
            this.data = new Tree_types.Project_item(name, sources_items);
        } else {
            this.data = new Tree_types.Project_item(name, []);
        }
    }

    get_prj() {
        return this.data;
    }

    get_sources(sources) {
        let libraries: (Tree_types.Library_item | Tree_types.Hdl_item)[] = [];
        let files_no_lib: (Tree_types.Library_item | Tree_types.Hdl_item)[] = [];
        for (let i = 0; i < sources.length; ++i) {
            if (sources[i].name === "") {
                let sources_no_lib = this.get_no_library(sources[i].name, sources[i].files);
                for (let i = 0; i < sources_no_lib.length; ++i) {
                    files_no_lib.push(sources_no_lib[i]);
                }
            } else {
                let library = this.get_library(sources[i].name, sources[i].files);
                libraries.push(library);
            }
        }
        libraries = libraries.concat(files_no_lib);
        return libraries;
    }

    get_library(library_name, sources): Tree_types.Library_item {
        let tree: Tree_types.Hdl_item[] = [];
        for (let i = 0; i < sources.length; ++i) {
            if (sources[i] !== '') {
                let item_tree = new Tree_types.Hdl_item(sources[i], library_name, this.name);
                tree.push(item_tree);
            }
        }
        let library = new Tree_types.Library_item(library_name, this.name, tree);
        return library;
    }

    get_no_library(library_name, sources): Tree_types.Hdl_item[] {
        let tree: Tree_types.Hdl_item[] = [];
        for (let i = 0; i < sources.length; ++i) {
            let item_tree = new Tree_types.Hdl_item(sources[i], library_name, this.name);
            tree.push(item_tree);
        }
        return tree;
    }
}


