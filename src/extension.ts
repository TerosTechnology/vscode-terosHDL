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
// Common libraries
import * as path from 'path';
import * as fs from 'fs';
import * as utils from "./lib/utils/utils";
import * as config_reader_lib from "./lib/utils/config_reader";
//Project manager
import * as project_manager_lib from "./lib/project_manager/project_manager";
let project_manager;
//Extension manager
import * as extension_manager from "./lib/utils/extension_manager";
import * as release_notes_webview from "./lib/utils/webview/release_notes";
// Templates
import * as templates from "./lib/templates/templates";
// Documenter
import * as documentation from "./lib/documenter/documenter";
// Linter
import * as linter from "./lib/linter/linter";
// Formatter
import * as formatter from "./lib/formatter/formatter_manager";
// Number hover
import * as number_hover from "./lib/number_hover/number_hover";
//RustHDL
import * as rusthdl_lib from './lib/rusthdl/rust_hdl';
//Utils
import * as Output_channel_lib from './lib/utils/output_channel';
//Shutter mode
import * as Shutter_mode from './lib/formatter/stutter_mode';

let output_channel : Output_channel_lib.Output_channel;
let rusthdl : rusthdl_lib.Rusthdl_lsp;
let linter_vhdl;
let linter_verilog;
let linter_systemverilog;
let template;
let linter_verilog_style;
let linter_systemverilog_style;
let formatter_vhdl;
let formatter_verilog;
let documenter;
let config_reader;
// Dependencies viewer
import * as dependencies_viewer from "./lib/dependencies_viewer/dependencies_viewer";
let dependencies_viewer_manager: dependencies_viewer.default;
// State machine viewer
import * as state_machine_viewer from "./lib/state_machine_viewer/state_machine_viewer";
let state_machine_viewer_manager: state_machine_viewer.default;
// Netlist viewer
import * as netlist_viewer from "./lib/netlist_viewer/netlist_viewer";
let netlist_viewer_manager: netlist_viewer.default;
// State machine designer
import * as state_machine_designer_t from "./lib/state_machine_designer/state_machine_designer";
let state_machine_designer_manager;

// Language providers
import VerilogDocumentSymbolProvider from "./lib/language_providers/providers/DocumentSymbolProvider";
import VerilogHoverProvider from "./lib/language_providers/providers/HoverProvider";
import VerilogDefinitionProvider from "./lib/language_providers/providers/DefinitionProvider";
import VerilogCompletionItemProvider from "./lib/language_providers/providers/CompletionItemProvider";
import { CtagsManager } from "./lib/language_providers/ctags";
import { Logger } from "./lib/language_providers/Logger";

let logger: Logger = new Logger();
export let ctagsManager: CtagsManager;

let current_context;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "teroshdl" is now active!');
    try {
        //Check if update
        await extension_manager.extensionManager.init();
        const releaseNotesView = new release_notes_webview.ReleaseNotesWebview(context);
        const installationType = extension_manager.extensionManager.get_installation_type();

        if (installationType.firstInstall || installationType.update) {
            await releaseNotesView.show();
            help_message();
        }
    }
    catch (e) {
        console.log(e);
    }

    //TerosHDL console
    output_channel = new Output_channel_lib.Output_channel();

    //Context
    current_context = context;
    /**************************************************************************/
    // Config
    /**************************************************************************/
    config_reader = new config_reader_lib.Config_reader(context, output_channel);

    /**************************************************************************/
    // Shutter mode
    /**************************************************************************/
    context.subscriptions.push(Shutter_mode.get_shutter_mode(config_reader, 'vhdl'));
    context.subscriptions.push(Shutter_mode.get_shutter_mode(config_reader, 'verilog'));
    context.subscriptions.push(Shutter_mode.get_shutter_mode(config_reader, 'systemverilog'));

    /**************************************************************************/
    // Language providers
    /**************************************************************************/
    let is_alive = false;

    let enable_vhdl_provider = config_reader.get_enable_lang_provider('vhdl');
    let enable_verilog_provider = config_reader.get_enable_lang_provider('verilog');

    if (enable_vhdl_provider === true){
        rusthdl = new rusthdl_lib.Rusthdl_lsp(context);
        is_alive = await rusthdl.run_rusthdl();
    }
    else{
        context.subscriptions.push(
            vscode.commands.registerCommand('teroshdl.vhdlls.restart', async () => {
            })
        ); 
    }

    // Document selector
    let verilogSelector: vscode.DocumentSelector = [
        { scheme: 'file', language: 'verilog' },
        { scheme: 'file', language: 'systemverilog' }
    ];
    let vhdlSelector: vscode.DocumentSelector = { scheme: 'file', language: 'vhdl' };
    // Configure ctags
    ctagsManager = new CtagsManager(logger, context);
    ctagsManager.configure();
    // Configure Document Symbol Provider
    let docProvider = new VerilogDocumentSymbolProvider(logger, context);
    // // Configure Completion Item Provider
    // let compItemProvider = new VerilogCompletionItemProvider(logger);
    // context.subscriptions.push(vscode.languages.registerCompletionItemProvider(verilogSelector, compItemProvider, ".", "(", "="));
    // Configure Hover Providers
    let hoverProvider = new VerilogHoverProvider(logger);
    // Configure Definition Providers
    let defProvider = new VerilogDefinitionProvider(logger);

    //VHDL
    if (enable_vhdl_provider === true){
        context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(vhdlSelector, docProvider));
    }
    //Verilog
    if (enable_verilog_provider === true){
        context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(verilogSelector, docProvider));
        context.subscriptions.push(vscode.languages.registerHoverProvider(verilogSelector, hoverProvider));
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(verilogSelector, defProvider));
    }

    if (is_alive === false && enable_vhdl_provider === true){
        context.subscriptions.push(vscode.languages.registerHoverProvider(vhdlSelector, hoverProvider));
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(vhdlSelector, defProvider));
    }
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((doc) => { docProvider.onSave(doc); }));
    /**************************************************************************/
    // Project manager
    /**************************************************************************/
    project_manager = new project_manager_lib.Project_manager(context, output_channel, config_reader);
    /**************************************************************************/
    // Templates
    /**************************************************************************/
    template = new templates.Template(context, config_reader, output_channel);
    /**************************************************************************/
    // Formatter
    /**************************************************************************/
    formatter_vhdl = new formatter.default("vhdl", config_reader, output_channel);
    formatter_verilog = new formatter.default("verilog", config_reader, output_channel);
    // context.subscriptions.push(vscode.commands.registerCommand('teroshdl.format', formatter.format));
    const disposable = vscode.languages.registerDocumentFormattingEditProvider(
        [{ scheme: "file", language: "vhdl" }, { scheme: "file", language: "verilog" },
        { scheme: "file", language: "systemverilog" }],
        { provideDocumentFormattingEdits }
    );
    context.subscriptions.push(disposable);
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.format',
            async () => {
                vscode.commands.executeCommand("editor.action.format");
            }
        )
    );
    /**************************************************************************/
    // Documenter
    /**************************************************************************/
    documenter = new documentation.default(context, config_reader, output_channel);
    await documenter.init();
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.documentation.module',
            async () => {
                await documenter.get_documentation_module();
            }
        ),
        vscode.workspace.onDidOpenTextDocument((e) => documenter.update_open_documentation_module(e)),
        vscode.workspace.onDidSaveTextDocument((e) => documenter.update_open_documentation_module(e)),
        vscode.window.onDidChangeVisibleTextEditors((e) => documenter.update_visible_documentation_module(e)),
    );
    /**************************************************************************/
    // Dependencies viewer
    /**************************************************************************/
    dependencies_viewer_manager = new dependencies_viewer.default(context, output_channel, config_reader);
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.dependencies.viewer',
            async () => {
                let msg =  'Dependencies viewer has been moved to the project manager. Check [TerosHDL documentation.](https://terostechnology.github.io/terosHDLdoc/features/project_manager.html)';
                vscode.window.showInformationMessage(msg);
            }
        )
    );
    /**************************************************************************/
    // State machine viewer
    /**************************************************************************/
    state_machine_viewer_manager = new state_machine_viewer.default(context, config_reader);
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.state_machine.viewer',
            async () => {
                await state_machine_viewer_manager.open_viewer();
            }
        ),
        vscode.workspace.onDidOpenTextDocument((e) => state_machine_viewer_manager.update_viewer()),
        vscode.workspace.onDidSaveTextDocument((e) => state_machine_viewer_manager.update_viewer()),
        // vscode.workspace.onDidChangeTextDocument((e) => state_machine_viewer_manager.update_viewer()),
        vscode.window.onDidChangeVisibleTextEditors((e) => state_machine_viewer_manager.update_visible_viewer(e)),
    );
    /**************************************************************************/
    // Netlist viewer
    /**************************************************************************/
    netlist_viewer_manager = new netlist_viewer.default(context, output_channel, config_reader);
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.netlist.viewer',
            async () => {
                await netlist_viewer_manager.open_viewer();
            }
        ),
        vscode.workspace.onDidOpenTextDocument((e) => netlist_viewer_manager.update_viewer()),
        vscode.workspace.onDidSaveTextDocument((e) => netlist_viewer_manager.update_viewer()),
        vscode.window.onDidChangeVisibleTextEditors((e) => netlist_viewer_manager.update_visible_viewer(e)),
    );
    /**************************************************************************/
    // State machine designer
    /**************************************************************************/
    state_machine_designer_manager = new state_machine_designer_t.default(context, output_channel);
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.state_machine.designer',
            async () => {
                await state_machine_designer_manager.open_viewer();
            }
        )
    );
    /**************************************************************************/
    // Hover Hexa
    /**************************************************************************/
    let hover_numbers_vhdl = vscode.languages.registerHoverProvider(vhdlSelector, {
        provideHover(document, position, token) {
            return number_hover.vhdl_hover(document, position, token);
        }
    });
    let hover_numbers_verilog = vscode.languages.registerHoverProvider(verilogSelector, {
        provideHover(document, position, token) {
            return number_hover.verilog_hover(document, position, token);
        }
    });
    context.subscriptions.push(hover_numbers_vhdl);
    context.subscriptions.push(hover_numbers_verilog);
    // /**************************************************************************/
    // Linter
    /**************************************************************************/
    linter_vhdl = new linter.default("vhdl", "linter", context, config_reader);
    vscode.workspace.onDidOpenTextDocument((e) => linter_vhdl.lint(e));
    vscode.workspace.onDidSaveTextDocument((e) => linter_vhdl.lint(e));
    vscode.workspace.onDidCloseTextDocument((e) => linter_vhdl.remove_file_diagnostics(e));

    linter_verilog = new linter.default("verilog", "linter", context, config_reader);
    vscode.workspace.onDidOpenTextDocument((e) => linter_verilog.lint(e));
    vscode.workspace.onDidSaveTextDocument((e) => linter_verilog.lint(e));
    vscode.workspace.onDidCloseTextDocument((e) => linter_verilog.remove_file_diagnostics(e));

    linter_systemverilog = new linter.default("systemverilog", "linter", context, config_reader);
    vscode.workspace.onDidOpenTextDocument((e) => linter_systemverilog.lint(e));
    vscode.workspace.onDidSaveTextDocument((e) => linter_systemverilog.lint(e));
    vscode.workspace.onDidCloseTextDocument((e) => linter_systemverilog.remove_file_diagnostics(e));
    /**************************************************************************/
    // Check style
    /**************************************************************************/
    linter_verilog_style = new linter.default("verilog", "style", context, config_reader);
    vscode.workspace.onDidOpenTextDocument((e) => linter_verilog_style.lint(e));
    vscode.workspace.onDidSaveTextDocument((e) => linter_verilog_style.lint(e));
    vscode.workspace.onDidCloseTextDocument((e) => linter_verilog_style.remove_file_diagnostics(e));
    
    linter_systemverilog_style = new linter.default("systemverilog", "style", context, config_reader);
    vscode.workspace.onDidOpenTextDocument((e) => linter_systemverilog_style.lint(e));
    vscode.workspace.onDidSaveTextDocument((e) => linter_systemverilog_style.lint(e));
    vscode.workspace.onDidCloseTextDocument((e) => linter_systemverilog_style.remove_file_diagnostics(e));
}

// this method is called when your extension is deactivated
export function deactivate() {

}

export async function provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
): Promise<vscode.TextEdit[]> {
    const edits: vscode.TextEdit[] = [];
    //Get document code
    let code_document: string = document.getText();
    let selection_document = formatter.getDocumentRange(document);
    //Get selected text
    let editor = vscode.window.activeTextEditor;
    let selection_selected_text;
    let code_selected_text: string = '';
    if (editor !== undefined) {
        selection_selected_text = editor.selection;
        code_selected_text = editor.document.getText(editor.selection);
    }
    //Code to format
    let format_mode_selection: boolean = false;
    let code_to_format: string = '';
    let selection_to_format;
    if (code_selected_text !== '') {
        let init: number = utils.line_index_to_character_index(selection_selected_text._start._line,
            selection_selected_text._start._character, code_document);
        let end: number = utils.line_index_to_character_index(selection_selected_text._end._line,
            selection_selected_text._end._character, code_document);
        let selection_add: string = "#$$#colibri#$$#" + code_selected_text + "%%!!teros!!%%";
        code_to_format = utils.replace_range(code_document, init, end, selection_add);
        format_mode_selection = true;

        code_to_format = code_selected_text;
        selection_to_format = selection_selected_text;
    }
    else {
        code_to_format = code_document;
        selection_to_format = selection_document;
    }

    let opt = options;
    let code_format: string;
    if (document.languageId === "vhdl") {
        code_format = await formatter_vhdl.format(code_to_format);
    }
    else {
        code_format = await formatter_verilog.format(code_to_format);
    }
    //Error
    if (code_format === null) {
        // vscode.window.showErrorMessage('Select a valid file.!');
        console.log("Error format code.");
        return edits;
    }
    else {
        const replacement = vscode.TextEdit.replace(
            selection_to_format,
            code_format
        );
        edits.push(replacement);
        return edits;
    }
}

function help_message() {
    vscode.window
        .showInformationMessage('TerosHDL needs your help!  😊', ...['Know the project', 'Donate'])
        .then(selection => {
            if (selection === 'Know the project') {
                vscode.env.openExternal(vscode.Uri.parse(
                    'https://www.terostech.com/#Team'));
            }
            else if (selection === 'Donate') {
                vscode.env.openExternal(vscode.Uri.parse(
                    'https://www.terostech.com/#donate'));
            }
        });
}


