/* eslint-disable @typescript-eslint/class-name-casing */
// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of vscode-terosHDL.
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
import * as util from "util";

export default class Documenter {
  private subscriptions: vscode.Disposable[] | undefined;
  private created_documenter = false;
  private documenter;
  private panel;
  private context;
  private current_document;
  private current_path;
  private html_base: string = '';
  private global_config = {
    'fsm': true,
    'signals': 'all',
    'constants': 'all',
    'process': 'all',
    'symbol_vhdl': '',
    'symbol_verilog': '',
    'extra_top_space': true
  };
  private last_document: vscode.TextDocument | undefined = undefined;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    vscode.workspace.onDidChangeConfiguration(this.force_update_documentation_module, this, this.subscriptions);
  }

  async init() {
    const fs = require('fs');
    let path_html = path_lib.sep + "resources" + path_lib.sep + "documenter" + path_lib.sep + "preview_module_doc.html";
    const readFileAsync = util.promisify(fs.readFile);
    this.html_base = await readFileAsync(
      this.context.asAbsolutePath(path_html), "utf8");
  }

  async get_documenter() {
    if (this.created_documenter === false){
      const jsteros = require('jsteros');
      this.documenter = new jsteros.Documenter.Documenter();
      this.created_documenter = true;
    }
    return this.documenter;
  }

  get_symbol(language_id) {
    let configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('teroshdl');
    let comment_symbol = configuration.get('documenter.' + language_id + '.symbol');
    return comment_symbol;
  }

  get_language(document): string {
    if (document === undefined) {
      return '';
    }
    let language_id: string = document.languageId;
    if (language_id === 'systemverilog') {
      language_id = 'verilog';
    }
    else if (language_id === undefined) {
      language_id = '';
    }
    return language_id;
  }

  check_document(document) {
    let language_id = this.get_language(document);
    if (language_id !== "vhdl" && language_id !== "verilog" && language_id !== "systemverilog") {
      return false;
    }
    else {
      return true;
    }
  }

  get_active_document() {
    let active_editor = vscode.window.activeTextEditor;
    if (!active_editor) {
      return undefined;
    }
    let document = active_editor.document;
    let language_id = this.get_language(document);
    if (language_id !== "vhdl" && language_id !== "verilog" && language_id !== "systemverilog") {
      return undefined;
    }
    else {
      return document;
    }
  }

  get_document_code(document) {
    let code: string = document.getText();
    return code;
  }


  async get_documentation_module() {
    let active_document = this.get_active_document();
    if (active_document === undefined) {
      vscode.window.showErrorMessage('Select a valid file.!');
      return;
    }
    this.current_path = active_document.uri.fsPath;

    if (this.panel === undefined) {
      // Create and show panel
      this.panel = vscode.window.createWebviewPanel(
        'catCoding',
        'Module documentation',
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
            case 'set_config':
              this.set_config(message.config);
              return;
          }
        },
        undefined,
        this.context.subscriptions
      );
    }
    // And set its HTML content
    this.update_doc(active_document);
  }

  get_configuration(){
    this.global_config.symbol_vhdl = <string>this.get_symbol('vhdl');
    this.global_config.symbol_verilog = <string>this.get_symbol('verilog');
    this.global_config.extra_top_space = true;

    return this.global_config;
  }

  set_config(config) {
    this.global_config = config;
    this.force_update_documentation_module();
  }

  async update_doc(document) {
    let language_id: string = this.get_language(document);
    let code = this.get_document_code(document);

    let documenter = await this.get_documenter();
    this.current_document = document;
    this.last_document = document;

    let configuration = this.get_configuration();

    let html_result = await documenter.get_html(code, language_id, configuration);
    let preview_html = this.html_base;
    preview_html += html_result.html;

    this.panel.webview.html = preview_html;
    await this.panel?.webview.postMessage({ command: "set_config", config: this.global_config });
  }


  async force_update_documentation_module() {
    if (this.panel !== undefined && this.last_document !== undefined) {
      await this.update_doc(this.last_document);
    }
  }

  async update_visible_documentation_module(e) {
    if (e.length === 0) {
      return;
    }
    let document = e[e.length-1].document;
    if (this.panel === undefined) {
      return;
    }
    let check_document = this.check_document(document);
    if (check_document === false) {
      return;
    }
    await this.update_doc(document);
    this.current_path = document.uri.fsPath;
  }

  async update_open_documentation_module(document) {
    if (this.panel === undefined) {
      return;
    }
    let check_document = this.check_document(document);
    if (check_document === false) {
      return;
    }
    await this.update_doc(document);
    this.current_path = document.uri.fsPath;
  }

  async update_change_documentation_module(e) {
    let document = e.document;
    if (this.panel === undefined) {
      return;
    }
    let check_document = this.check_document(document);
    if (check_document === false) {
      return;
    }
    await this.update_doc(document);
    this.current_path = document.uri.fsPath;
  }

  normalize_path(path: string) {
    if (path[0] === '/' && require('os').platform() === 'win32') {
      return path.substring(1);
    }
    else {
      return path;
    }
  }

  async export_as(type: string) {
    const path_lib = require('path');
    // /one/two/five.h --> five.h
    let basename = path_lib.basename(this.current_path);
    // five.h --> .h
    let ext_name = path_lib.extname(basename);
    // /one/two/five.h --> five
    let filename = path_lib.basename(this.current_path, ext_name);
    // /one/two/five
    let full_path = path_lib.dirname(this.current_path) + path_lib.sep + filename;


    let language_id: string = this.get_language(this.current_document);
    let code = this.get_document_code(this.current_document);    
    let documenter = await this.get_documenter();
    let configuration = this.get_configuration();
    
    if (type === "markdown") {
      let filter = { 'markdown': ['md'] };
      let default_path = full_path + '.md';
      let uri = vscode.Uri.file(default_path);
      vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
        if (fileInfos?.path !== undefined) {
          let path_norm = this.normalize_path(fileInfos?.path);
          this.show_export_message(path_norm);
          documenter.save_markdown(code, language_id, configuration, path_norm);
        }
      });
    }
    else if (type === "html") {
      let filter = { 'HTML': ['html'] };
      let default_path = full_path + '.html';
      let uri = vscode.Uri.file(default_path);
      vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
        if (fileInfos?.path !== undefined) {
          let path_norm = this.normalize_path(fileInfos?.path);
          this.show_export_message(path_norm);
          documenter.save_html(code, language_id, configuration, path_norm);
        }
      });
    }
    else if (type === "image") {
      let filter = { 'SVG': ['svg'] };
      let default_path = full_path + '.svg';
      let uri = vscode.Uri.file(default_path);
      vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
        if (fileInfos?.path !== undefined) {
          let path_norm = this.normalize_path(fileInfos?.path);
          this.show_export_message(path_norm);
          documenter.save_svg(code, language_id, configuration, path_norm);
        }
      });
    }
    else if (type === "latex") {
      let filter = { 'latex': ['latex'] };
      let default_path = full_path + '.tex';
      let uri = vscode.Uri.file(default_path);
      vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
        if (fileInfos?.path !== undefined) {
          let path_norm = this.normalize_path(fileInfos?.path);
          this.show_export_message(path_norm);
          documenter.save_latex(path_norm);
        }
      });
    }
    else {
      console.log("Error export documentation.");
    }
  }


  private show_export_message(path_exp) {
    vscode.window.showInformationMessage(`Documentation saved in ${path_exp} 😊`);
  }

}






