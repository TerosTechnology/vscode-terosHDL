// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// Common libraries
import * as path from 'path';
import * as fs from 'fs';
// Templates
import * as templates from "./lib/templates/templates";
// Formatter
import * as formatter from "./lib/formatter/formatter";
// Documenter
import * as documentation from "./lib/documenter/documenter";
// Linter
import * as linter from "./lib/linter/linter";


let linter_vhdl;
let linter_verilog;
let linter_vhdl_style;
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
	context.subscriptions.push(vscode.commands.registerCommand('teroshdl.format', formatter.format));
	const disposable = vscode.languages.registerDocumentFormattingEditProvider(
		[{ scheme: "file", language: "vhdl" }, { scheme: "file", language: "verilog" }],
		{ provideDocumentFormattingEdits }
	  );
	context.subscriptions.push(disposable);
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
	linter_vhdl = new linter.default("vhdl","linter");
    linter_verilog = new linter.default("verilog","linter");
    /**************************************************************************/
    // Check style
    /**************************************************************************/
    linter_vhdl_style = new linter.default("vhdl","linter_style");


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
        code_format = formatter.format_vhdl(code);
    }
    else {
        code_format = formatter.format_verilog(code,current_context);
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