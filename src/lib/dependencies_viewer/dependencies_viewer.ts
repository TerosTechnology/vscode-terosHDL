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
import * as config_reader_lib from "../utils/config_reader";
import * as Output_channel_lib from '../utils/output_channel';
const ERROR_CODE = Output_channel_lib.ERROR_CODE;

// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class Dependencies_viewer_manager {
  private panel: vscode.WebviewPanel | undefined = undefined;
  private context: vscode.ExtensionContext;
  private sources: string[] = [];
  private last_sources: [] = [];
  private output_channel: Output_channel_lib.Output_channel;
  private config_reader : config_reader_lib.Config_reader;

  constructor(context: vscode.ExtensionContext, output_channel, config_reader) {
    this.output_channel = output_channel;
    this.context = context;
    this.config_reader = config_reader;
  }

  async open_viewer(prj, config) {
    this.create_viewer();
    this.update_viewer(prj, config, true);
  }

  async create_viewer() {
    // Create panel
    this.panel = vscode.window.createWebviewPanel(
      'catCoding',
      'Dependencies viewer',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden:true
      }
    );

    this.panel.onDidDispose(
      () => {
        // When the panel is closed, cancel any future updates to the webview content
        this.last_sources = [];
        this.panel = undefined;
      },
      null,
      this.context.subscriptions
    );
    let previewHtml = this.getWebviewContent(this.context);
    this.panel.webview.html = previewHtml;
  }

  private async get_dot(config) {
    let python3_path = config.pypath;
    const jsteros = require('jsteros');
    let project_manager = new  jsteros.Edam.Edam_project('', '');
    for (let i = 0; i < this.sources.length; i++) {
      const source = this.sources[i];
      project_manager.add_file(source);
    }

    let dependencies_dot = await project_manager.get_dependency_graph_dot(python3_path);
    return dependencies_dot;
  }

  async update_viewer(prj, config, force_reload) {
    if (config === undefined){
      return;
    }
    let sources = prj.get_sources_as_array();
    this.sources = sources;
    try{
      let dot = await this.get_dot(config);
      if (dot === undefined || dot === '' || dot === null) {
        this.check_config();
      }
      else {
        if ( (JSON.stringify(this.last_sources) !== JSON.stringify(sources)) || force_reload === true){
          await this.panel?.webview.postMessage({ command: "update", message: dot });
        }
        this.last_sources = sources;
      }
    }
    catch(e){
      this.check_config();
      console.log("[TerosHDL][dependencies-viewer]");
      console.log(e);
    }
  }

  //Clear
  private async clear_viewer() {
    this.clear_sources();
    await this.panel?.webview.postMessage({ command: "clear" });
  }

  private clear_sources() {
    this.sources = [];
  }

  private check_config(){
    this.config_reader.check_configuration();
  }

  private getWebviewContent(context: vscode.ExtensionContext) {
    let template_path = 'resources' + path_lib.sep + 'dependencies_viewer' + path_lib.sep + 'dependencies_viewer.html';
    const resource_path = path_lib.join(context.extensionPath, template_path);
    const dir_path = path_lib.dirname(resource_path);
    let html = fs.readFileSync(resource_path, 'utf-8');

    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
      return $1 + vscode.Uri.file(path_lib.resolve(dir_path, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
  }
}