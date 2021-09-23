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


const getHtml = obj => {
  return `
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="shortcut icon" href="${obj.local}/resource/project_manager/vcdrom/vcdrom.ico"/>
    <title>VCDrom</title>
    <link rel="preload" as="font" href="${obj.local}/iosevka-term-light.woff2" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${obj.local}/codemirror.css">
    <link rel="stylesheet" href="${obj.local}/blackboard.css">
    <link rel="stylesheet" href="${obj.local}/vcdrom.css">
    <script src="${obj.local}/vcdrom.js"></script>
  </head>
  <body onload="VCDrom('waveform1', '${obj.vcd}')">
    <div id="waveform1"></div>
  </body>
</html>
`;
};


// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class Vcdrom {
  private panel: vscode.WebviewPanel | undefined = undefined;
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async update_waveform(path) {

    let final_file = path;
    let vcd = vscode.Uri.file(final_file);

    const fname = vcd.path;
    const title = path_lib.basename(fname);
    const vcdDir = path_lib.dirname(fname);

    const local = vscode.Uri.file(path_lib.join(
      this.context.extensionPath,
      'resources',
      'project_manager',
      'vcdrom',
    ));
    const panel = vscode.window.createWebviewPanel(
      'vcdrom', // ID
      title, // Title
      2, // vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [local, vscode.Uri.file(vcdDir)]
      }
    );

    panel.webview.html = getHtml({
      local: panel.webview.asWebviewUri(local),
      vcd: panel.webview.asWebviewUri(vcd)
    });


  }


}