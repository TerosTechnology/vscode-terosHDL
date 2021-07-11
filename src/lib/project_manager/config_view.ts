// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of TerosHDL.
//
// TerosHDL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// TerosHDL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.
import * as vscode from 'vscode';
import * as path_lib from 'path';
import * as fs from 'fs';
import * as Config from './config';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class config_view {
  private panel: vscode.WebviewPanel | undefined = undefined;
  private context: vscode.ExtensionContext;
  private config;

  constructor(context: vscode.ExtensionContext, config: Config.Config) {
    this.context = context;
    this.config = config;
    vscode.commands.registerCommand("teroshdl.configuration", () => this.open());
  }

  async create_viewer() {
    // Create panel
    this.panel = vscode.window.createWebviewPanel(
      'project_manager_config',
      'Tool configuration',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true
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
          case 'set_config':
            this.set_config(message.config);
            return;
          case 'set_config_and_close':
            this.set_config_and_close(message.config);
            return;
          case 'close':
            this.close_panel();
            return;
        }
      },
      undefined,
      this.context.subscriptions
    );

    let previewHtml = this.getWebviewContent(this.context);
    this.panel.webview.html = previewHtml;

    try {
      if (this.config !== undefined) {
        let tool_config = this.config.get_config_all_tool();
        await this.panel?.webview.postMessage({
          command: "set_config",
          config: {
            tool_config: tool_config,
            selected_tool: this.config.config.config_tool.selected_tool
          }
        });
      }
    }
    catch (e) {
    }
  }

  set_config_and_close(config) {
    this.set_config(config);
    this.close_panel();
  }

  set_config(config) {
    this.config.set_config_tool(config);
    vscode.commands.executeCommand("teroshdl.formatter.vhdl.set_config");
    vscode.commands.executeCommand("teroshdl.formatter.verilog.set_config");
    vscode.commands.executeCommand("teroshdl_tree_view.refresh_tests");
    vscode.commands.executeCommand("teroshdl.documenter.set_config");
    vscode.commands.executeCommand("teroshdl.fsm.set_config");
    vscode.commands.executeCommand("teroshdl.linter.linter.vhdl.set_config");
    vscode.commands.executeCommand("teroshdl.linter.linter.verilog.set_config");
    vscode.commands.executeCommand("teroshdl.linter.linter.systemverilog.set_config");
  }

  close_panel() {
    this.panel?.dispose();
  }

  get_config_documentation() {
    return this.config.get_config_documentation();
  }

  get_config_python_path() {
    return this.config.get_config_python_path();
  }

  get_config() {
    return this.config;
  }

  open() {
    this.create_viewer();
  }

  public set_config_to_view(config) {
    this.config = config;
  }

  private getWebviewContent(context: vscode.ExtensionContext) {
    let template_path = 'resources' + path_lib.sep + 'project_manager' + path_lib.sep + 'config.html';
    const resource_path = path_lib.join(context.extensionPath, template_path);
    const dir_path = path_lib.dirname(resource_path);
    let html = fs.readFileSync(resource_path, 'utf-8');

    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
      return $1 + vscode.Uri.file(path_lib.resolve(dir_path, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
  }
}