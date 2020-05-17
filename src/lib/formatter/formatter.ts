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
import * as formatter_verilog from "./formatter_verilog";

export async function format(){
    vscode.commands.executeCommand("editor.action.formatDocument")
}

export function format_vhdl(code: string) {
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

export const getDocumentRange = (document: vscode.TextDocument): vscode.Range => {
    const lastLineId = document.lineCount - 1;
    return new vscode.Range(
      0,
      0,
      lastLineId,
      document.lineAt(lastLineId).text.length
    );
};

export function format_verilog(code: string, context: vscode.ExtensionContext) {
    return formatter_verilog.format_verilog(code,context);
}
