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
import * as jsteros from 'jsteros';

import * as child from 'child_process';
import * as temp from 'temp';
import * as fs from 'fs';

export async function format(){
    vscode.commands.executeCommand("editor.action.formatDocument")
}

function format_vhdl(code: string) {
    let configuration : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('teroshdl');
    let settings = {
      "RemoveComments": configuration.get('formatting.vhdl.remove-comments'),
      "RemoveAsserts": configuration.get('formatting.vhdl.remove-asserts'),
      "CheckAlias": false,
      "SignAlignSettings": {
          "isRegional": true,
          "isAll": true,
          "mode": configuration.get('formatting.vhdl.mode'),
          "keyWords": [
              "FUNCTION",
              "IMPURE FUNCTION",
              "GENERIC",
              "PORT",
              "PROCEDURE"
          ]
      },
      "KeywordCase": configuration.get('formatting.vhdl.keyword-case'),
      "TypeNameCase": configuration.get('formatting.vhdl.type-name-case'),
      "Indentation": configuration.get('formatting.vhdl.indentation'),
      "NewLineSettings": {
          "newLineAfter": [
              ";",
              "then"
          ],
          "noNewLineAfter": []
      },
      "EndOfLine": "\n"
    };

    let beautifuler = new jsteros.Beautifuler.BeautifulerFactory;
    beautifuler = beautifuler.getBeautifuler("vhdl");
    let code_format : string = beautifuler.beauty(code,settings);
    return code_format;
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
    if (document.languageId == "vhdl"){
        code_format = format_vhdl(code);
    }
    else {
        code_format = format_verilog(code);
    }
    //Error
    if (code_format == null){
        // vscode.window.showErrorMessage('Select a valid file.!');
        console.log("Error format code.");
        return edits;
    }
    else{
        const replacement = vscode.TextEdit.replace(
            getDocumentRange(document),
            code_format
        );
        edits.push(replacement);
        return edits;
    }
}

const getDocumentRange = (document: vscode.TextDocument): vscode.Range => {
    const lastLineId = document.lineCount - 1;
    return new vscode.Range(
      0,
      0,
      lastLineId,
      document.lineAt(lastLineId).text.length
    );
};

const style_map: { [style: string]: string } = {
    "Indent only": "",
	"Kernighan&Ritchie": "kr",
	"GNU": "gnu",
	"ANSI": "ansi"
};

function format_verilog(code: string) {
	const iStylePath = "/home/carlos/repo/vscode-terosHDL/src/lib/formatter/bin/iStyle";
	const iStyleExtraArgs = "";
	var args: string[] = [
		"-n", // Do not create a .orig file
	];
	const style = get_formatting_style_arg();
	if (style.length !== 0) {
		args.push(style);
	}
	if (iStyleExtraArgs.length !== 0) {
		args = args.concat(iStyleExtraArgs.split(" "));
	}
	var tempfile: string = create_temp_file_of_code(code);
	args.push(tempfile);
    child.execFileSync(iStylePath, args, {});
    let formatted_code = fs.readFileSync(tempfile, { encoding: "utf8" });
    return formatted_code;
}

function get_formatting_style_arg(): string {    
    const style = <string>vscode.workspace.getConfiguration("teroshdl.formatting.verilog").get("style");
    const map_style = style_map[style];
	if (map_style !== undefined && map_style.length !== 0) {
        return `--style=ansi`;
	} else {
		return "";
	}
}

function create_temp_file_of_code(content: string) {
	const temp_file = temp.openSync();
	if (temp_file === undefined) {
		throw "Unable to create temporary file";
	}
	fs.writeSync(temp_file.fd, content);
	fs.closeSync(temp_file.fd);
	return temp_file.path;
}

