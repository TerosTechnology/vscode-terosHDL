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
import * as config_reader_lib from "./lib/utils/config_reader";
//Project manager
import * as project_manager_lib from "./lib/project_manager/project_manager";
let project_manager;
//Extension manager
import * as extension_manager from "./lib/utils/extension_manager";
import * as release_notes_webview from "./lib/utils/webview/release_notes";
//RustHDL
import * as rusthdl_lib from './lib/rusthdl/rust_hdl';
//Utils
import * as Output_channel_lib from './lib/utils/output_channel';


// TerosHDL
import {Teroshdl} from './teroshdl';




let output_channel: Output_channel_lib.Output_channel;
let rusthdl: rusthdl_lib.Rusthdl_lsp;
let config_reader;
// Dependencies viewer
import * as dependencies_viewer from "./lib/dependencies_viewer/dependencies_viewer";
let dependencies_viewer_manager: dependencies_viewer.default;


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
    output_channel = new Output_channel_lib.Output_channel(context);

    const teroshdl = new Teroshdl(context, output_channel);
    teroshdl.init_teroshdl();


























    //Context
    current_context = context;
    /**************************************************************************/
    // Config
    /**************************************************************************/
    config_reader = new config_reader_lib.Config_reader(context, output_channel);


    /**************************************************************************/
    // Language providers
    /**************************************************************************/
    let is_alive = false;

    let enable_vhdl_provider = config_reader.get_enable_lang_provider('vhdl');
    let enable_verilog_provider = config_reader.get_enable_lang_provider('verilog');

    if (enable_vhdl_provider === true) {
        rusthdl = new rusthdl_lib.Rusthdl_lsp(context, config_reader);
        is_alive = await rusthdl.run_rusthdl();
    }
    else {
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
    let tcl_selector: vscode.DocumentSelector = { scheme: 'file', language: 'tcl' };

    // Configure ctags
    ctagsManager = new CtagsManager(logger, context);
    ctagsManager.configure();
    // Configure Document Symbol Provider
    let docProvider = new VerilogDocumentSymbolProvider(logger, context);
    // // Configure Completion Item Provider
    let compItemProvider = new VerilogCompletionItemProvider(logger);
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(verilogSelector, compItemProvider, ".", "(", "="));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(vhdlSelector, compItemProvider, ".", "(", "="));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(tcl_selector, compItemProvider, ".", "(", "="));
    // Configure Hover Providers
    let hoverProvider = new VerilogHoverProvider(logger);
    // Configure Definition Providers
    let defProvider = new VerilogDefinitionProvider(logger);

    //TCL
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(tcl_selector, docProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider(tcl_selector, hoverProvider));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(tcl_selector, defProvider));

    //VHDL
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(vhdlSelector, docProvider));

    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(verilogSelector, docProvider));
    if (enable_verilog_provider === true) {
        context.subscriptions.push(vscode.languages.registerHoverProvider(verilogSelector, hoverProvider));
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(verilogSelector, defProvider));
    }

    if (is_alive === false && enable_vhdl_provider === true) {
        context.subscriptions.push(vscode.languages.registerHoverProvider(vhdlSelector, hoverProvider));
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(vhdlSelector, defProvider));
    }
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((doc) => { docProvider.onSave(doc); }));
    /**************************************************************************/
    // Project manager
    /**************************************************************************/
    project_manager = new project_manager_lib.Project_manager(context, output_channel, config_reader);
    /**************************************************************************/
    // Dependencies viewer
    /**************************************************************************/
    dependencies_viewer_manager = new dependencies_viewer.default(context, output_channel, config_reader);
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.dependencies.viewer',
            async () => {
                let msg = 'Dependencies viewer has been moved to the project manager. Check [TerosHDL documentation.](https://terostechnology.github.io/terosHDLdoc/features/project_manager.html)';
                vscode.window.showInformationMessage(msg);
            }
        )
    );


}

export function deactivate(): Thenable<void> | undefined {
    console.log("TerosHDL deactivate!");
    rusthdl.stop_client = true;
    let promises = [rusthdl.deactivate()];
    return Promise.all(promises).then(() => undefined);
}

function help_message() {
    vscode.window
        .showInformationMessage('TerosHDL needs your help!  😊', ...['Know the team', 'Documentation'])
        .then(selection => {
            if (selection === 'Know the team') {
                vscode.env.openExternal(vscode.Uri.parse(
                    'https://terostechnology.github.io/terosHDLdoc/about/team.html'));
            }
            else if (selection === 'Documentation') {
                vscode.env.openExternal(vscode.Uri.parse(
                    'https://terostechnology.github.io'));
            }
        });
}


