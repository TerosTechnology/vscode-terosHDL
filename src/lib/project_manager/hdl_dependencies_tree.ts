/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable no-mixed-spaces-and-tabs */
import * as vscode from 'vscode';
import * as path from 'path';

export class Hdl_dependencies_tree implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;
	private hdl_tree : any[];
	private toplevel_path : string = '';

	constructor() {
		// let hdl_tree = {
		// 		"root": [
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_top.v",
		// 			"entity": "serv_top",
		// 			"dependencies": [
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_decode.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_alu.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_bufreg.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_state.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_csr.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_ctrl.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_mem_if.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_immdec.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_rf_if.v"
		// 			]
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_state.v",
		// 			"entity": "serv_state",
		// 			"dependencies": []
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_rf_top.v",
		// 			"entity": "serv_rf_top",
		// 			"dependencies": [
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_top.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_rf_ram_if.v",
		// 			  "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_rf_ram.v"
		// 			]
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_rf_ram_if.v",
		// 			"entity": "serv_rf_ram_if",
		// 			"dependencies": []
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_rf_ram.v",
		// 			"entity": "serv_rf_ram",
		// 			"dependencies": []
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_rf_if.v",
		// 			"entity": "serv_rf_if",
		// 			"dependencies": []
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_mem_if.v",
		// 			"entity": "serv_mem_if",
		// 			"dependencies": []
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_immdec.v",
		// 			"entity": "serv_immdec",
		// 			"dependencies": []
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_decode.v",
		// 			"entity": "serv_decode",
		// 			"dependencies": []
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_ctrl.v",
		// 			"entity": "serv_ctrl",
		// 			"dependencies": []
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_csr.v",
		// 			"entity": "serv_csr",
		// 			"dependencies": ["/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_decode.v"]
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_bufreg.v",
		// 			"entity": "serv_bufreg",
		// 			"dependencies": []
		// 		  },
		// 		  {
		// 			"filename": "/home/carlos/workspace/teroshdl-documenter-demo/serv/rtl/serv_alu.v",
		// 			"entity": "serv_alu",
		// 			"dependencies": []
		// 		  }
		// 		]
		// 	  };

		let hdl_tree = {
			"root": []
		};

		this.hdl_tree = hdl_tree.root;
	}

	set_hdl_tree(hdl_tree, toplevel_path){
		if (hdl_tree === undefined || hdl_tree.root === undefined){
			return;
		}
		this.toplevel_path = toplevel_path;
		this.hdl_tree = hdl_tree.root;
		this._onDidChangeTreeData.fire();
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		if (element) {
			return Promise.resolve(this.getDepsInPackageJson(<string>element.filename));
		} else {
			return Promise.resolve(this.getDepsInPackageJson(this.toplevel_path));
		}
	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getDepsInPackageJson(root_element: string): Dependency[] {
		let packageJson;
		for (let i = 0; i < this.hdl_tree.length; i++) {
			const element = this.hdl_tree[i];
			if (element.filename === root_element){
				packageJson = element;
			}
			
		}

		if (packageJson === undefined){
			let empty_dep = [];
			return empty_dep;
		}

		const toDep = (filename: string): Dependency => {
			let entity_name = '';
			for (let i = 0; i < this.hdl_tree.length; i++) {
				const element = this.hdl_tree[i];
				if (element.filename === filename){
					entity_name = element.entity;
				}
				
			}
			return new Dependency(filename, entity_name, vscode.TreeItemCollapsibleState.Collapsed);
		};

		const deps = packageJson.dependencies
			? Object.keys(packageJson.dependencies).map(dep => toDep(packageJson.dependencies[dep]))
			: [];
		return deps;
	}
}

export class Dependency extends vscode.TreeItem {
	path : string;
	constructor(
		public readonly filename: string,
		public readonly entity_name: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(entity_name, collapsibleState);
		this.filename = filename;
		this.path = filename;
		this.description = filename;
		this.command = {
			command: "teroshdl_tree_view.open_file",
			title: "Select Node",
			arguments: [this],
		};
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';
}