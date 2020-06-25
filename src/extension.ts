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
// Templates
import * as templates from "./lib/templates/templates";
// Documenter
import * as documentation from "./lib/documenter/documenter";
// Linter
import * as linter from "./lib/linter/linter";
// Formatter
import * as formatter from "./lib/formatter/formatter_manager";

let linter_vhdl;
let linter_verilog;
let linter_vhdl_style;
let linter_verilog_style;
let formatter_vhdl;
let formatter_verilog;
// Dependencies viewer
import * as dependencies_viewer from "./lib/dependencies_viewer/dependencies_viewer";
let dependencies_viewer_manager : dependencies_viewer.default;
// Test Manager
import { VUnitAdapter } from './lib/tester/controller';
import { TestHub, testExplorerExtensionId } from 'vscode-test-adapter-api';
import { Log, TestAdapterRegistrar } from 'vscode-test-adapter-util';

let testHub   : TestHub | undefined;
let controller: VUnitAdapter | undefined;
// Language providers
import VerilogDocumentSymbolProvider from "./lib/language_providers/providers/DocumentSymbolProvider";
import VerilogHoverProvider from "./lib/language_providers/providers/HoverProvider";
import VerilogDefinitionProvider from "./lib/language_providers/providers/DefinitionProvider";
import VerilogCompletionItemProvider from "./lib/language_providers/providers/CompletionItemProvider";
import {CtagsManager} from "./lib/language_providers/ctags";
import {Logger} from "./lib/language_providers/Logger";

let logger: Logger = new Logger();
export let ctagsManager: CtagsManager;

let current_context;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "teroshdl" is now active!');
	//Context
	current_context = context;
    /**************************************************************************/
    // Templates
    /**************************************************************************/
    context.subscriptions.push(vscode.commands.registerCommand('teroshdl.generate_template', templates.get_template));
    /**************************************************************************/
    // Formatter
    /**************************************************************************/
    formatter_vhdl = new formatter.default("vhdl");
    formatter_verilog = new formatter.default("verilog");
    // context.subscriptions.push(vscode.commands.registerCommand('teroshdl.format', formatter.format));
    const disposable = vscode.languages.registerDocumentFormattingEditProvider(
        [{ scheme: "file", language: "vhdl" }, { scheme: "file", language: "verilog" }],
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
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.documentation.module',
            async () => {
				await documentation.get_documentation_module(context);
            }
		),
        // vscode.workspace.onDidChangeTextDocument((e) => documentation.update_documentation_module(e.document)),
        vscode.workspace.onDidOpenTextDocument((e) => documentation.update_documentation_module(e)),
        vscode.workspace.onDidSaveTextDocument((e) => documentation.update_documentation_module(e)),
    );
    /**************************************************************************/
    // Linter
    /**************************************************************************/
	linter_vhdl = new linter.default("vhdl","linter",context);
    linter_verilog = new linter.default("verilog","linter",context);
    /**************************************************************************/
    // Check style
    /**************************************************************************/
    linter_vhdl_style = new linter.default("vhdl","linter_style",context);
    linter_verilog_style = new linter.default("verilog","linter_style",context);
    /**************************************************************************/
    // Dependencies viewer
    /**************************************************************************/
    dependencies_viewer_manager = new dependencies_viewer.default(context);
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.dependencies.viewer',
            async () => {
				await dependencies_viewer_manager.open_viewer();
            }
		)
    );
    /**************************************************************************/
    // Language providers
    /**************************************************************************/
    // document selector
    let verilogSelector : vscode.DocumentSelector = {scheme: 'file', language: 'verilog'};
    let vhdlSelector : vscode.DocumentSelector = {scheme: 'file', language: 'vhdl'};
    // Configure ctags
    ctagsManager = new CtagsManager(logger, context);
    ctagsManager.configure();
    // Configure Document Symbol Provider
    let docProvider = new VerilogDocumentSymbolProvider(logger,context);
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(vhdlSelector, docProvider));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(verilogSelector, docProvider));
    // Configure Completion Item Provider
    // Trigger on ".", "(", "="
    let compItemProvider = new VerilogCompletionItemProvider(logger);
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(vhdlSelector, compItemProvider, ".", "(", "="));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(verilogSelector, compItemProvider, ".", "(", "="));
    // Configure Hover Providers
    let hoverProvider = new VerilogHoverProvider(logger);
    context.subscriptions.push(vscode.languages.registerHoverProvider(vhdlSelector, hoverProvider));
    context.subscriptions.push(vscode.languages.registerHoverProvider(verilogSelector, hoverProvider));
    // Configure Definition Providers
    let defProvider = new VerilogDefinitionProvider(logger);
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(vhdlSelector, defProvider));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(verilogSelector, defProvider));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((doc) => { docProvider.onSave(doc);}));
    /**************************************************************************/
    // Hover Hexa
    /**************************************************************************/
    let hover_numbers_vhdl = vscode.languages.registerHoverProvider({scheme: 'file', language: 'vhdl'}, { 
        provideHover(document, position, token) {
            // const wordRange = document.getText(document.getWordRangeAtPosition(position,/\w[-\w\.\""]*/g));
            let wordRange = document.getWordRangeAtPosition(position, /\w[-\w\.\"]*/g);
            if (wordRange !== undefined){
                let leadingText = document.getText(new vscode.Range(wordRange.start, wordRange.end));
                if (/x"[0-9a-fA-F_]+"/g.test(leadingText)) {
                    const regex = /x"([0-9a-fA-F_]+)"/g;
                    let number = regex.exec(leadingText.replace('_',''));
                    if (number === null || number[1] === null){
                        return;
                    }
                    let x = parseInt(number[1], 16);
                    return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned)');
                }
                else if (/[0-1_]+"/g.test(leadingText)) {
                    const regex = /([0-1_]+)"/g;
                    let number = regex.exec(leadingText.replace('_',''));
                    if (number === null || number[1] === null){
                        return;
                    }
                    let x = parseInt(number[0], 2);
                    return new vscode.Hover('"' + leadingText + ' = ' + x + ' (unsigned)');
                }
            }
        }
    });
    let hover_numbers_verilog = vscode.languages.registerHoverProvider({scheme: 'file', language: 'verilog'}, { 
        provideHover(document, position, token) {
            // const wordRange = document.getText(document.getWordRangeAtPosition(position,/\w[-\w\.\""]*/g));
            let wordRange = document.getWordRangeAtPosition(position, /\w[-\w\.\']*/g);
            if (wordRange !== undefined){
                let leadingText = document.getText(new vscode.Range(wordRange.start, wordRange.end));
                if (/h[0-9a-fA-F_]+/g.test(leadingText)) {
                    const regex = /h([0-9a-fA-F_]+)/g;
                    let number = regex.exec(leadingText.replace('_',''));
                    if (number === null || number[1] === null){
                        return;
                    }
                    let x = parseInt(number[1], 16);
                    return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned)');
                }
                else if (/b[0-1_]+/g.test(leadingText)) {
                    const regex = /b([0-1_]+)/g;
                    let number = regex.exec(leadingText.replace('_',''));
                    if (number === null || number[1] === null){
                        return;
                    }
                    let x = parseInt(number[1], 2);
                    return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned)');
                }
                else if (/o[0-8_]+/g.test(leadingText)) {
                    const regex = /o([0-7_]+)/g;
                    let number = regex.exec(leadingText.replace('_',''));
                    if (number === null || number[1] === null){
                        return;
                    }
                    let x = parseInt(number[1], 8);
                    return new vscode.Hover(leadingText + ' = ' + x + ' (unsigned)');
                }
            }
        }
    });
    context.subscriptions.push(hover_numbers_vhdl); 
    context.subscriptions.push(hover_numbers_verilog); 
    /**************************************************************************/
    // Test manager
    /**************************************************************************/
    // get the Test Explorer extension
    const workspaceFolder = (vscode.workspace.workspaceFolders || [])[0];
    const workDir = path.join(context.globalStoragePath, 'workdir');
    fs.mkdirSync(workDir, { recursive: true });
    const log = new Log('vunit', workspaceFolder, 'VUnit Explorer Log');
    context.subscriptions.push(log);
    // get the Test Explorer extension
    const testExplorerExtension = vscode.extensions.getExtension<TestHub>(
        testExplorerExtensionId
    );
    if (log.enabled) {
        log.info(`Test Explorer ${testExplorerExtension ? '' : 'not '}found`);
    }
    if (testExplorerExtension) {
        const testHub = testExplorerExtension.exports;

        context.subscriptions.push(
            new TestAdapterRegistrar(
                testHub,
                (workspaceFolder) =>
                    new VUnitAdapter(workspaceFolder, workDir, log),
                log
            )
        );
    }
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

    let code : string = document.getText();
    let opt = options;
    let code_format : string;
    if (document.languageId === "vhdl"){
        code_format = await formatter_vhdl.format(code);
    }
    else {
        code_format = await formatter_verilog.format(code);
    }
    //Error
    if (code_format === null){
        // vscode.window.showErrorMessage('Select a valid file.!');
        console.log("Error format code.");
        return edits;
    }
    else{
        const replacement = vscode.TextEdit.replace(
            formatter.getDocumentRange(document),
            code_format
        );
        edits.push(replacement);
        return edits;
    }
}



