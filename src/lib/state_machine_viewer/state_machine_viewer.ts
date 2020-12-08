// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.
import * as jsteros from 'jsteros';
import * as vscode from 'vscode';
import * as path_lib from 'path';
import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class State_machine_viewer_manager {
  private panel: vscode.WebviewPanel | undefined = undefined;
  private context: vscode.ExtensionContext;
  private sources: string[] = [];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async open_viewer() {
    this.create_viewer();
  }

  async create_viewer() {
    // Create panel
    this.panel = vscode.window.createWebviewPanel(
      'catCoding',
      'State machine viewer',
      vscode.ViewColumn.Two,
      {
        enableScripts: true
      }
    );

    this.panel.onDidDispose(
      () => {
        // When the panel is closed, cancel any future updates to the webview content
        this.panel = undefined;
      },
      null,
      this.context.subscriptions
    );
    // // Handle messages from the webview
    // this.panel.webview.onDidReceiveMessage(
    //   message => {
    //     switch (message.command) {
    //       case 'add_source':
    //         this.add_source();
    //         console.log("Add source: " + message.text);
    //         return;
    //       case 'clear_graph':
    //         this.clear_viewer();
    //         console.log("Clear graph");
    //         return;
    //       case 'generate_documentation_markdown':
    //         this.generate_documentation("markdown");
    //         console.log("Generate documentation Markdown");
    //         return;
    //       case 'generate_documentation_html':
    //         this.generate_documentation("html");
    //         console.log("Generate documentation HTML");
    //         return;
    //     }
    //   },
    //   undefined,
    //   this.context.subscriptions
    // );
    let previewHtml = this.getWebviewContent(this.context);
    this.panel.webview.html = previewHtml;

    let state_machines = await this.get_state_machines();
    this.send_state_machines(state_machines);
  }


  private async send_state_machines(state_machines) {
    await this.panel?.webview.postMessage({ command: "update", state_machines: state_machines });
  }

  private async get_state_machines() {
    let active_editor = vscode.window.activeTextEditor;
    if (!active_editor) {
      return; // no editor
    }
    let document = active_editor.document;
    let language_id: string = document.languageId;
    let code: string = document.getText();

    if (language_id !== "vhdl" && language_id !== "verilog" && language_id !== 'systemverilog') {
      return;
    }
    let configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('teroshdl');
    let comment_symbol = configuration.get('documenter.' + language_id + '.symbol');

    let state_machines = jsteros.State_machine.get_svg_sm(language_id, code, comment_symbol);
    return state_machines;
  }


  // private async add_source() {
  //   let files = await vscode.window.showOpenDialog({ canSelectMany: true });
  //   if (files !== undefined) {
  //     this.sources.push();
  //     for (let i = 0; i < files.length; ++i) {
  //       if (files[i]['path'][0] === '/' && require('os').platform() === 'win32') {
  //         this.sources.push(files[i]['path'].substring(1));
  //       }
  //       else {
  //         this.sources.push(files[i]['path']);
  //       }
  //     }
  //     await this.update_viewer();
  //   }
  // }

  private async get_dot() {
    let project_manager = new jsteros.Project_manager.Manager("");
    project_manager.add_source_from_array(this.sources);
    let dependencies_dot = await project_manager.get_dependency_graph_dot();
    return dependencies_dot;
  }

  async update_viewer() {
    if (this.panel !== undefined) {
      let state_machines = await this.get_state_machines();
      this.send_state_machines(state_machines);
    }
  }

  // //Clear
  // private async clear_viewer() {
  //   this.clear_sources();
  //   await this.panel?.webview.postMessage({ command: "clear" });
  // }

  // private clear_sources() {
  //   this.sources = [];
  // }

  // private generate_documentation(type: string) {
  //   vscode.window.showOpenDialog({ canSelectFiles: false, canSelectFolders: true, canSelectMany: false }).then(file_uri => {
  //     if (file_uri && file_uri[0]) {
  //       this.generate_and_save_documentation(file_uri[0].fsPath, type);
  //     }
  //   });
  // }

  // private generate_and_save_documentation(output_path, type: string) {
  //   let configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('teroshdl');
  //   let comment_symbol_vhdl = configuration.get('documenter.vhdl.symbol');
  //   let comment_symbol_verilog = configuration.get('documenter.verilog.symbol');

  //   let project_manager = new jsteros.Project_manager.Manager("");
  //   project_manager.add_source_from_array(this.sources);
  //   if (type === "markdown") {
  //     project_manager.save_markdown_doc(output_path, comment_symbol_vhdl, comment_symbol_verilog, true);
  //   }
  //   else {
  //     project_manager.save_html_doc(output_path, comment_symbol_vhdl, comment_symbol_verilog, true);
  //   }
  // }

  private getWebviewContent(context: vscode.ExtensionContext) {
    let template_path = 'resources' + path_lib.sep + 'state_machine_viewer' + path_lib.sep + 'state_machine_viewer.html';
    const resource_path = path_lib.join(context.extensionPath, template_path);
    const dir_path = path_lib.dirname(resource_path);
    let html = fs.readFileSync(resource_path, 'utf-8');

    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
      return $1 + vscode.Uri.file(path_lib.resolve(dir_path, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
  }

}