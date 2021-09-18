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
const shell = require('shelljs');
import * as config_reader_lib from "../utils/config_reader";
import * as Output_channel_lib from '../utils/output_channel';
const ERROR_CODE = Output_channel_lib.ERROR_CODE;


// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class netlist_viewer_manager {
  private panel: vscode.WebviewPanel | undefined = undefined;
  private context: vscode.ExtensionContext;
  private file_path;
  private document;
  private svg_element;
  private document_element;
  private childp;
  private config_reader : config_reader_lib.Config_reader;
  private output_channel : Output_channel_lib.Output_channel;

  constructor(context: vscode.ExtensionContext, output_channel: Output_channel_lib.Output_channel, config_reader) {
    this.config_reader = config_reader;
    this.output_channel = output_channel;
    this.context = context;
  }

  async open_viewer() {
    this.create_viewer();
  }

  async create_viewer(mode_project=false) {
    // Create panel
    this.panel = vscode.window.createWebviewPanel(
      'netlist_viewer',
      'Schematic viewer',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden:true
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
        }
      },
      undefined,
      this.context.subscriptions
    );

    let previewHtml = this.getWebviewContent(this.context);
    this.panel.webview.html = previewHtml;

    if (mode_project === false) {      
      let file_path = await this.get_file_path(undefined);
      if (file_path !== undefined) {
        this.file_path = file_path;
      }
      await this.send_file_path(file_path);
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
          let path_full = fileInfos?.path;
          fs.writeFileSync(path_full, svg);

          this.show_export_message(path_full);
        }
      });
    }
    else {
      console.log("Error export documentation.");
    }
  }

  private async send_file_path(file_path) {
    let result = await this.generate(file_path);
    if (result !== undefined) {
      await this.panel?.webview.postMessage({ command: "update", result: result});
    }
  }

  private async get_file_path(document_trigger) {
    let document = document_trigger;
    if (document_trigger === undefined) {
      let active_editor = vscode.window.activeTextEditor;
      if (!active_editor) {
        return; // no editor
      }
      document = active_editor.document;
    }
    let language_id: string = document.languageId;

    if (language_id !== "verilog" && language_id !== 'systemverilog' && language_id !== 'vhdl') {
      return;
    }
    let file_path = document.uri.fsPath;
    this.document = document;
    return file_path;
  }

  async update_viewer() {
    if (this.panel !== undefined) {
      let file_path = await this.get_file_path(undefined);
      this.file_path = file_path;
      await this.send_file_path(file_path);
    }
  }

  async update_viewer_last_code() {
    if (this.panel !== undefined) {
      await this.send_file_path(this.file_path);
    }
  }

  async update_visible_viewer(e) {
    if (e.length !== 1) {
      return;
    }
    let document = e[0].document;
    if (this.panel !== undefined) {
      let file_path = await this.get_file_path(document);
      this.file_path = file_path;
      await this.send_file_path(file_path);
    }
  }

  async generate_project_netlist(project) {
    let result = await this.generate_from_project(project);
    if (result !== undefined) {
      await this.panel?.webview.postMessage({ command: "update", result: result});
    }
  }

  async generate_from_project(project) {
    let sources = project.get_sources_as_array();

    const tmpdir = require('os').homedir();

    const output_path = path_lib.join(tmpdir, '.teroshdl_yosys_output_project.json');
    const script_path = path_lib.join(tmpdir, '.teroshdl_yosys_script_project');

    return await this.run_yosys_script(sources, script_path, output_path);
  }

  async generate(file_path) {
    if (file_path === undefined){
      return '';
    }
    const tmpdir = require('os').homedir();

    const output_path = path_lib.join(tmpdir, '.teroshdl_yosys_output.json');
    const script_path = path_lib.join(tmpdir, '.teroshdl_yosys_script');
    
    return await this.run_yosys_script([file_path],script_path, output_path);
  }

  async run_yosys_script(sources, script_path, output_path) {
    let read_verilog_script = '';
    for (let i = 0; i < sources.length; i++) {
      const element = sources[i];
      read_verilog_script += `read_verilog -sv ${element}\n`;
    }

    const script_code = `${read_verilog_script}\nproc\nopt\nwrite_json ${output_path}`;
    fs.writeFileSync(script_path, script_code);

    const backend = this.config_reader.get_schematic_backend();
    let yosys_path = this.config_reader.get_tool_path('yosys');
    let command = `yowasp-yosys -s ${script_path}`;
    if (backend === 'yosys'){
      if (yosys_path === ''){
        yosys_path = 'yosys';
      }
      else{
        yosys_path = path_lib.join(yosys_path,'yosys');
        if (process.platform === "win32"){
          yosys_path += '.exe';
        }
      }
      command = `${yosys_path} -s ${script_path}`;
    }

    let element = this;
    element.output_channel.clear();
    element.output_channel.append(command);
    element.output_channel.show();

    return new Promise(resolve => {
      element.childp = shell.exec(command, { async: true }, async function (code, stdout, stderr) {
        if (code === 0) {
          let result_yosys = '';
          if (fs.existsSync(output_path)) {
            result_yosys = fs.readFileSync(output_path,{encoding:'utf8', flag:'r'});
          }
          result_yosys = JSON.parse(result_yosys);
          resolve(result_yosys);
        }
        else {
          element.output_channel.show_message(ERROR_CODE.NETLIST_VIEWER, '');
          resolve('');
        }
      });

      element.childp.stdout.on('data', function (data) {
        element.output_channel.append(data);
      });
      element.childp.stderr.on('data', function (data) {
        element.output_channel.append(data);
      });
    });
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