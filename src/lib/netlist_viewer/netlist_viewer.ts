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
import * as vscode from 'vscode';
import * as path_lib from 'path';
import * as fs from 'fs';


// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class netlist_viewer_manager {
  private panel: vscode.WebviewPanel | undefined = undefined;
  private context: vscode.ExtensionContext;
  private code;
  private document;
  private svg_element;
  private document_element;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async open_viewer() {
    this.create_viewer();
  }

  async create_viewer() {
    // Create panel
    this.panel = vscode.window.createWebviewPanel(
      'netlist_viewer',
      'Schematic viewer',
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
            this.export_as(message.type, message.svg);
            return;
          case 'html_loaded':
            this.update_viewer_last_code();
            return;
        }
      },
      undefined,
      this.context.subscriptions
    );

    let previewHtml = this.getWebviewContent(this.context);
    this.panel.webview.html = previewHtml;

    let code = await this.get_code(undefined);
    if (code !== undefined) {
      this.code = code;
    }
  }

  private show_export_message(path_full) {
    vscode.window.showInformationMessage(`Schematic saved in ${path_full} 😊`);
  }

  async export_as(type: string, svg: string) {
    if (type === "svg") {
      let filter = { 'svg': ['svg'] };
      vscode.window.showSaveDialog({ filters: filter }).then(fileInfos => {
        if (fileInfos?.path !== undefined) {
          let path_full = this.normalize_path(fileInfos?.path);
          fs.writeFileSync(path_full, svg);

          this.show_export_message(path_full);
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

  private async send_code(code) {
    let filename = this.document.fileName;
    if (code !== undefined) {
      await this.panel?.webview.postMessage({ command: "update", code: code, filename: filename });
    }
  }

  private async get_code(document_trigger) {
    let document = document_trigger;
    if (document_trigger === undefined) {
      let active_editor = vscode.window.activeTextEditor;
      if (!active_editor) {
        return; // no editor
      }
      document = active_editor.document;
    }
    let language_id: string = document.languageId;
    let code: string = document.getText();

    if (language_id !== "verilog" && language_id !== 'systemverilog') {
      return;
    }
    this.document = document;
    return code;
  }

  async update_viewer() {
    if (this.panel !== undefined) {
      let code = await this.get_code(undefined);
      this.code = code;
      await this.send_code(code);
    }
  }

  async update_viewer_last_code() {
    if (this.panel !== undefined) {
      await this.send_code(this.code);
    }
  }

  async update_visible_viewer(e) {
    if (e.length !== 1) {
      return;
    }
    let document = e[0].document;
    if (this.panel !== undefined) {
      let code = await this.get_code(document);
      this.code = code;
      await this.send_code(code);
    }
  }

  private getWebviewContent(context: vscode.ExtensionContext) {
    let template_path = 'resources' + path_lib.sep + 'netlist_viewer' + path_lib.sep + 'netlist_viewer.html';
    const resource_path = path_lib.join(context.extensionPath, template_path);
    const dir_path = path_lib.dirname(resource_path);
    let html = fs.readFileSync(resource_path, 'utf-8');

    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
      return $1 + vscode.Uri.file(path_lib.resolve(dir_path, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
  }
}