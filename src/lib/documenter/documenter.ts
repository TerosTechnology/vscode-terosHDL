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
import * as jsteros from 'jsteros';
import * as node_utilities from './node_utilities';
import * as path_lib from 'path';

let panel;
let main_context;
let current_documenter;
let current_path;
export async function get_documentation_module(context: vscode.ExtensionContext) {
    main_context = context;
    let active_editor = vscode.window.activeTextEditor;
    if (!active_editor) {
        return; // no editor
    }
    let document = active_editor.document;
    let language_id: string = document.languageId;
    let code: string = document.getText();

    if (language_id !== "vhdl" && language_id !== "verilog" && language_id !== "systemverilog") {
        vscode.window.showErrorMessage('Select a valid file.!');
        return;
    }
    if (language_id === 'systemverilog') {
        language_id = 'verilog';
    }
    current_path = vscode.window.activeTextEditor?.document.uri.fsPath;
    let configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('teroshdl');
    let comment_symbol = configuration.get('documenter.' + language_id + '.symbol');

    current_documenter = new jsteros.Documenter.Documenter(code, language_id, comment_symbol);
    if (true) {
        // if (await current_documenter.check_correct_file() === true){
        let path_html = path_lib.sep + "resources" + path_lib.sep + "documenter" + path_lib.sep + "preview_module_doc.html";
        let previewHtml = await node_utilities.readFileAsync(
            context.asAbsolutePath(path_html), "utf8");
        let html_result = await current_documenter.get_html(true);
        let html_error = html_result.error;
        previewHtml += html_result.html;

        if (panel === undefined) {
            // Create and show panel
            panel = vscode.window.createWebviewPanel(
                'catCoding',
                'Module documentation',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true
                }
            );
            panel.onDidDispose(
                () => {
                    // When the panel is closed, cancel any future updates to the webview content
                    panel = undefined;
                    current_documenter = undefined;
                },
                null,
                context.subscriptions
            );
            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'export':
                            export_as(message.text);
                            console.log(message.text);
                            return;
                    }
                },
                undefined,
                context.subscriptions
            );
        }
        // And set its HTML content
        panel.webview.html = previewHtml;
    }
    else {
        vscode.window.showErrorMessage('Select a valid file.!');
    }
    panel.webview.postMessage({ command: 'refactor' });
}

export async function update_documentation_module(document) {
    if (panel !== undefined) {
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
        current_path = vscode.window.activeTextEditor?.document.uri.fsPath;
        let configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('teroshdl');
        let comment_symbol = configuration.get('documenter.' + language_id + '.symbol');

        current_documenter = new jsteros.Documenter.Documenter(code, language_id, comment_symbol);
        if (true) {
            // if (await current_documenter.check_correct_file() === true){
            let path_html = path_lib.sep + "resources" + path_lib.sep + "documenter" + path_lib.sep + "preview_module_doc.html";
            let previewHtml = await node_utilities.readFileAsync(
                main_context.asAbsolutePath(path_html), "utf8");

            let html_result = await current_documenter.get_html(true);
            let html_error = html_result.error;
            previewHtml += html_result.html;

            panel.webview.html = previewHtml;
        }
        else {
            return;
        }
    }
}

function show_python3_error_message() {
    vscode.window.showInformationMessage('Error: make sure Python3 is installed in your system and added to the system path.');
}

function normalize_path(path: string) {
    if (path[0] === '/' && require('os').platform() === 'win32') {
        return path.substring(1);
    }
    else {
        return path;
    }
}

async function export_as(type: string) {
    const path_lib = require('path');
    // /one/two/five.h --> five.h
    let basename = path_lib.basename(current_path);
    // five.h --> .h
    let ext_name = path_lib.extname(basename);
    // /one/two/five.h --> five
    let filename = path_lib.basename(current_path, ext_name);
    // /one/two/five
    let full_path = path_lib.dirname(current_path) + path_lib.sep + filename;

    if (type === "markdown") {
        let filter = { 'markdown': ['md'] };
        let default_path = full_path + '.md';
        let uri = vscode.Uri.file(default_path);
        vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
            if (fileInfos?.path !== undefined) {
                current_documenter.save_markdown(normalize_path(fileInfos?.path));
            }
        });
    }
    else if (type === "pdf") {
        let platform = require('os').platform();
        if (platform !== 'linux') {
            vscode.window.showErrorMessage('Currently this feature is only supported for Linux.');
            return;
        }

        let filter = { 'PDF': ['pdf'] };
        let default_path = full_path + '.pdf';
        let uri = vscode.Uri.file(default_path);
        vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
            if (fileInfos?.path !== undefined) {
                current_documenter.save_pdf(normalize_path(fileInfos?.path));
            }
        });
    }
    else if (type === "html") {
        let filter = { 'HTML': ['html'] };
        let default_path = full_path + '.html';
        let uri = vscode.Uri.file(default_path);
        vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
            if (fileInfos?.path !== undefined) {
                current_documenter.save_html(normalize_path(fileInfos?.path));
            }
        });
    }
    else if (type === "image") {
        let filter = { 'SVG': ['svg'] };
        let default_path = full_path + '.svg';
        let uri = vscode.Uri.file(default_path);
        vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
            if (fileInfos?.path !== undefined) {
                current_documenter.save_svg(normalize_path((fileInfos?.path)));
            }
        });
    }
    else if (type === "latex") {
        let filter = { 'latex': ['latex'] };
        let default_path = full_path + '.tex';
        let uri = vscode.Uri.file(default_path);
        vscode.window.showSaveDialog({ filters: filter, defaultUri: uri }).then(fileInfos => {
            if (fileInfos?.path !== undefined) {
                current_documenter.save_latex(normalize_path((fileInfos?.path)));
            }
        });
    }
    else {
        console.log("Error export documentation.");
    }
}