// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as templates from "./lib/templates/templates";
import * as formatter from "./lib/formatter/formatter";
import * as documentation from "./lib/documenter/documenter";
import * as linter from "./lib/linter/linter";
import {provideDocumentFormattingEdits} from "./lib/formatter/formatter";

let linter_vhdl;
let linter_verilog;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "teroshdl" is now active!');
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
            () => {
				documentation.get_documentation_module(context);
            }
		),
        vscode.workspace.onDidChangeTextDocument((e) => documentation.update_documentation_module(e.document)),
	)
	linter_vhdl = new linter.default("vhdl");
	linter_verilog = new linter.default("verilog");
}

// this method is called when your extension is deactivated
export function deactivate() {}
