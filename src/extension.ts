// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as templates from "./lib/templates/templates";
import * as formatter from "./lib/formatter/formatter";
import * as documentation from "./lib/documenter/documenter";
import * as linter from "./lib/linter/linter";
// import {provideDocumentFormattingEdits} from "./lib/formatter/formatter";

let linter_vhdl;
let linter_verilog;
let current_context;
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

export async function provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    const edits: vscode.TextEdit[] = [];

    let code : string = document.getText();
    let opt = options;
    let code_format : string;
    if (document.languageId == "vhdl"){
        code_format = formatter.format_vhdl(code);
    }
    else {
        code_format = formatter.format_verilog(code,current_context);
    }
    //Error
    if (code_format == null){
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