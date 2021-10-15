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

    constructor() {
        vscode.commands.registerCommand("teroshdl.vsg.fixall", (document) => this.fix_all(document));
        vscode.commands.registerCommand("teroshdl.vsg.fixrule", (document, diagnostic) => this.fix_rule(document, diagnostic));
        vscode.commands.registerCommand("teroshdl.vsg.fixrule_type", (document, diagnostic) => this.fix_rule_type(document, diagnostic));
    }


    fix_all(document) {
        let file_path = document.fileName;
        const exec = require('child_process');
        let cmd = `vsg --fix -f ${file_path}`;
        try {
            exec.execSync(cmd);
            vscode.commands.executeCommand("teroshdl.linter.linter.vhdl.refresh");
            vscode.commands.executeCommand("teroshdl.linter.style.vhdl.refresh");
        }
        catch { }
    }

    fix_rule(document, diagnostic) {
        let file_path = document.fileName;
        let json_fix = {
            "fix": {
                "rule": {

                }
            }
        };
        json_fix['fix']['rule'][diagnostic.code] = [diagnostic.range.start.line + 1];

        const tmpdir = require('os').tmpdir();
        const path_lib = require('path');
        const fs = require('fs');

        let path_tmp = path_lib.join(tmpdir, 'tmp_vsg.json');

        let data = JSON.stringify(json_fix);
        fs.writeFileSync(path_tmp, data);

        const exec = require('child_process');
        let cmd = `vsg --fix --fix_only ${path_tmp} -f ${file_path}`;
        try {
            exec.execSync(cmd);
            vscode.commands.executeCommand("teroshdl.linter.linter.vhdl.refresh");
            vscode.commands.executeCommand("teroshdl.linter.style.vhdl.refresh");
        }
        catch { }
    }

    fix_rule_type(document, diagnostic) {
        let file_path = document.fileName;
        let json_fix = {
            "fix": {
                "rule": {

                }
            }
        };
        json_fix['fix']['rule'][diagnostic.code] = ["all"];

        const tmpdir = require('os').tmpdir();
        const path_lib = require('path');
        const fs = require('fs');

        let path_tmp = path_lib.join(tmpdir, 'tmp_vsg.json');

        let data = JSON.stringify(json_fix);
        fs.writeFileSync(path_tmp, data);

        const exec = require('child_process');
        let cmd = `vsg --fix --fix_only ${path_tmp} -f ${file_path}`;
        try {
            exec.execSync(cmd);
            vscode.commands.executeCommand("teroshdl.linter.linter.vhdl.refresh");
            vscode.commands.executeCommand("teroshdl.linter.style.vhdl.refresh");
        }
        catch { }
    }

    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
        let code_actions: vscode.CodeAction[] = [];
        let diagnostic_array = context.diagnostics.filter(diagnostic => diagnostic.source === "TerosHDL: vsg");

        let disable_all = this.create_command_code_action_disable_all(document);
        code_actions.push(disable_all);

        let fix_all = this.create_command_code_action_fix_all(document);
        code_actions.push(fix_all);

        let rule_type: string[] = [];
        for (let diagnostic_error of diagnostic_array) {

            let action_disable_line = this.create_command_code_action_disable_line(diagnostic_error, document, range);
            code_actions.push(action_disable_line);

            let action_rule = this.create_command_code_action_fix_rule(diagnostic_error, document, range);
            code_actions.push(action_rule);

            let diagnostic_error_code = <string>diagnostic_error.code;
            if (!rule_type.includes(diagnostic_error_code)) {
                let action_rule_type = this.create_command_code_action_fix_rule_type(diagnostic_error, document, range);
                code_actions.push(action_rule_type);
                rule_type.push(diagnostic_error_code);
            }
        }

        return code_actions;
    }

    private create_command_code_action_disable_all(document: vscode.TextDocument): vscode.CodeAction {
        const action = new vscode.CodeAction("Disable all rules.", vscode.CodeActionKind.QuickFix);
        action.command = {
            title: "info.description",
            command: 'workbench.action.files.save'
        };
        action.isPreferred = true;
        action.edit = new vscode.WorkspaceEdit();
        action.edit.insert(document.uri, new vscode.Position(0, 0), '-- vsg_off\n');
        return action;
    }


    private create_command_code_action_fix_all(document: vscode.TextDocument): vscode.CodeAction {
        const action = new vscode.CodeAction("Fix all problems.", vscode.CodeActionKind.QuickFix);
        action.command = {
            title: "info.description",
            command: 'teroshdl.vsg.fixall',
            arguments: [document]
        };
        action.isPreferred = true;
        return action;
    }

    private create_command_code_action_disable_line(diagnostic: vscode.Diagnostic, document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction {
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
        let spaces = document.getText(new vscode.Range(range.start.line, 0, range.start.line, range.start.character));
        action.edit.insert(document.uri, new vscode.Position(range.start.line, range.start.character), `-- vsg_disable_next_line ${diagnostic.code}\n${spaces}`);
        return action;
    }

    private create_command_code_action_fix_rule(diagnostic: vscode.Diagnostic, document: vscode.TextDocument, range:
        vscode.Range): vscode.CodeAction {
        const action = new vscode.CodeAction(`Fix ${diagnostic.code} for this line.`, vscode.CodeActionKind.QuickFix);
        action.command = {
            title: "info.description",
            command: 'teroshdl.vsg.fixrule',
            arguments: [document, diagnostic]
        };
        action.isPreferred = true;
        return action;
    }

    private create_command_code_action_fix_rule_type(diagnostic: vscode.Diagnostic, document: vscode.TextDocument, range:
        vscode.Range): vscode.CodeAction {
        const action = new vscode.CodeAction(`Fix all problems: ${diagnostic.code}.`, vscode.CodeActionKind.QuickFix);
        action.command = {
            title: "info.description",
            command: 'teroshdl.vsg.fixrule_type',
            arguments: [document, diagnostic]
        };
        action.isPreferred = true;
        return action;
    }
}