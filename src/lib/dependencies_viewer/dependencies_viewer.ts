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
import * as node_utilities from './node_utilities';
import { PreviewManager } from "./viewer/previewManager";
import { InteractiveWebviewGenerator } from "./manager";

// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class Dependencies_viewer_manager {
  private panel : vscode.WebviewPanel | undefined = undefined;
  private context : vscode.ExtensionContext;
  private sources : string[] = [];

  constructor(context: vscode.ExtensionContext){
    this.context = context;
  }

  async open_viewer(){
      this.create_viewer();
  }

  async create_viewer(){
    // const previewHtml = await node_utilities.readFileAsync(this.context.asAbsolutePath("resources/preview.html"), "utf8");
    // const previewManager = new PreviewManager(this.context, previewHtml);

    // let active_editor = vscode.window.activeTextEditor;
    // previewManager.showPreviewToSide(<vscode.TextEditor>active_editor);


    let project_manager = new jsteros.ProjectManager.Manager("",null,null);
    project_manager.addSource(["/home/carlos/repo/vscode-terosHDL/resources/dependencies_viewer.html"]);

    // Create panel
    this.panel = vscode.window.createWebviewPanel(
      'catCoding',
      'Dependencies viewer',
      vscode.ViewColumn.Two,
      {
          enableScripts : true
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
                    console.log(message.text);
                    return;
            }
        },
        undefined,
        this.context.subscriptions
    );
    let path_html = path_lib.sep + "resources" + path_lib.sep + "dependencies_viewer.html";
    let previewHtml = await node_utilities.readFileAsync(
            this.context.asAbsolutePath(path_html), "utf8");
    this.panel.webview.html = previewHtml;



  }

  private add_source(source: string){
    this.sources.push(source);
    this.refresh_viewer();
  }

  private refresh_viewer(){

  }

  //Clear
  private clear_viewer(){
    this.clear_sources();
    this.refresh_viewer();
  }

  private clear_sources(){
    this.sources = [];
  }




}