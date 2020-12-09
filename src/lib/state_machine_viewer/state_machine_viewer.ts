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
  private state_machines;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async open_viewer() {
    this.create_viewer();
  }

  async create_viewer() {
    // Create panel
    this.panel = vscode.window.createWebviewPanel(
      'state_machine_viewer',
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
    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'export':
            this.export_as(message.text);
            console.log(message.text);
            return;
        }
      },
      undefined,
      this.context.subscriptions
    );

    let previewHtml = this.getWebviewContent(this.context);
    this.panel.webview.html = previewHtml;

    let state_machines = await this.get_state_machines();
    this.state_machines = state_machines;
    this.send_state_machines(state_machines);
  }

  async export_as(type: string) {
    if (type === "svg") {
      let filter = { 'svg': ['svg'] };
      vscode.window.showSaveDialog({ filters: filter }).then(fileInfos => {
        if (fileInfos?.path !== undefined) {
          let path_full = this.normalize_path(fileInfos?.path);
          let dir_name = path_lib.dirname(path_full);
          let file_name = path_lib.basename(path_full).split('.').slice(0, -1).join('.')
          for (let i = 0; i < this.state_machines.length; ++i) {
            let custom_path = `${dir_name}${path_lib.sep}${file_name}_${i}.svg`;
            fs.writeFileSync(custom_path, this.state_machines[i].svg);
          }
        }
      });
    }
    else {
      console.log("Error export documentation.");
    }
  }

  normalize_path(path: string) {
    if (path[0] === '/' && require('os').platform() === 'win32') {
      return path.substring(1);
    }
    else {
      return path;
    }
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

  async update_viewer() {
    if (this.panel !== undefined) {
      let state_machines = await this.get_state_machines();
      this.state_machines = state_machines;
      this.send_state_machines(state_machines);
    }
  }

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