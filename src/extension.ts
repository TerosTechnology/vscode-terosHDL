// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as templates from "./lib/templates/templates";
import * as formatter from "./lib/formatter/formatter";
import * as documentation from "./lib/documenter/documenter";
import * as linter from "./lib/linter/linter";
import * as dependencies_viewer from "./lib/dependencies_viewer/dependencies_viewer";

// import {provideDocumentFormattingEdits} from "./lib/formatter/formatter";

import {workspace, window, DocumentSelector, ExtensionContext, extensions, Uri, languages, commands} from "vscode";

// ctags
import {CtagsManager} from "./lib/language_providers/ctags";

// Providers
import VerilogDocumentSymbolProvider from "./lib/language_providers/providers/DocumentSymbolProvider";
import VerilogHoverProvider from "./lib/language_providers/providers/HoverProvider";
import VerilogDefinitionProvider from "./lib/language_providers/providers/DefinitionProvider";
import VerilogCompletionItemProvider from "./lib/language_providers/providers/CompletionItemProvider";

// Logger
import {Logger} from "./lib/language_providers/Logger";

// let logger: Logger = new Logger();
// export let ctagsManager: CtagsManager;
// export let ctagsManager: CtagsManager = new CtagsManager(logger);

let linter_vhdl;
let linter_verilog;
let current_context;
let dependencies_viewer_manager : dependencies_viewer.default;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "teroshdl" is now active!');
	//Context
	current_context = context;
	//Templates
	context.subscriptions.push(vscode.commands.registerCommand('teroshdl.generate_template', templates.get_template));
	//Formatter
	context.subscriptions.push(vscode.commands.registerCommand('teroshdl.format', formatter.format));
	const disposable = vscode.languages.registerDocumentFormattingEditProvider(
		[{ scheme: "file", language: "vhdl" }, { scheme: "file", language: "verilog" }],
		{ provideDocumentFormattingEdits }
	  );
	context.subscriptions.push(disposable);
	//Documenter
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
	linter_vhdl = new linter.default("vhdl");
    linter_verilog = new linter.default("verilog");


    //Dependencies viewer
    dependencies_viewer_manager = new dependencies_viewer.default(context);
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'teroshdl.dependencies.viewer',
            async () => {
				await dependencies_viewer_manager.open_viewer();
            }
		)
    );






    // // document selector
    // let systemverilogSelector:DocumentSelector = { scheme: 'file', language: 'systemverilog' };
    // let verilogSelector:DocumentSelector = {scheme: 'file', language: 'verilog'};
    // let vhdlSelector:DocumentSelector = {scheme: 'file', language: 'vhdl'};

    // // Configure ctags
    // ctagsManager = new CtagsManager(logger, context);
    // ctagsManager.configure();

    // // Configure Document Symbol Provider
    // let docProvider = new VerilogDocumentSymbolProvider(logger,context);
    // // context.subscriptions.push(languages.registerDocumentSymbolProvider(systemverilogSelector, docProvider));
    // context.subscriptions.push(languages.registerDocumentSymbolProvider(vhdlSelector, docProvider));
    // context.subscriptions.push(languages.registerDocumentSymbolProvider(verilogSelector, docProvider));

    // // Configure Completion Item Provider
    // // Trigger on ".", "(", "="
    // let compItemProvider = new VerilogCompletionItemProvider(logger);
    // context.subscriptions.push(languages.registerCompletionItemProvider(vhdlSelector, compItemProvider, ".", "(", "="));
    // context.subscriptions.push(languages.registerCompletionItemProvider(verilogSelector, compItemProvider, ".", "(", "="));

    // // Configure Hover Providers
    // let hoverProvider = new VerilogHoverProvider(logger);
    // context.subscriptions.push(languages.registerHoverProvider(vhdlSelector, hoverProvider));
    // context.subscriptions.push(languages.registerHoverProvider(verilogSelector, hoverProvider));

    // // Configure Definition Providers
    // let defProvider = new VerilogDefinitionProvider(logger);
    // context.subscriptions.push(languages.registerDefinitionProvider(vhdlSelector, defProvider));
    // context.subscriptions.push(languages.registerDefinitionProvider(verilogSelector, defProvider));

    // context.subscriptions.push(workspace.onDidSaveTextDocument((doc) => { docProvider.onSave(doc)  }));




}

// this method is called when your extension is deactivated
export function deactivate() {}

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