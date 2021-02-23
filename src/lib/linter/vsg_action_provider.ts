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
// eslint-disable-next-line @typescript-eslint/class-name-casing
export class Vsg_action_provider implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
    return context.diagnostics
			.filter(diagnostic => diagnostic.source == "TerosHDL:vsg")
			.map(diagnostic => this.createCommandCodeAction(diagnostic, document, range));
		// let diagnostic_array = context.diagnostics;
		// return this.createCommandCodeAction(diagnostic_array,document,range);
	}

	private createCommandCodeAction(diagnostic: vscode.Diagnostic, document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction {
		const action = new vscode.CodeAction(`Disable ${diagnostic.code} for this line.`, vscode.CodeActionKind.QuickFix);
		// action.command = 'workbench.action.files.save';
		action.command = {
			title: "info.description",
			command: 'workbench.action.files.save'
			// arguments: [document, file, info, rangeOrSelection]
		};
		action.diagnostics = [diagnostic];
		action.isPreferred = true;
		action.edit = new vscode.WorkspaceEdit();
		let spaces = document.getText(new vscode.Range(range.start.line,0,range.start.line,range.start.character));
		action.edit.insert( document.uri, new vscode.Position(range.start.line, range.start.character), `-- vsg-disable-next-line ${diagnostic.code}\n${spaces}` );
		return action;
	}
}