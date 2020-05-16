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

export async function format() {
    let active_editor = vscode.window.activeTextEditor;
    if (!active_editor) {
        return; // no editor
    }
    //Current position
    let position = active_editor.selection.active;
    let position_character = position.character;
    let position_line = position.line;

    let document = active_editor.document;
    let language_id : string = document.languageId;
    let code : string = document.getText();
    let code_format : string = "";

    if(language_id == "vhdl"){
        code_format = format_vhdl(code);
    }
    else if (language_id == "verilog"){
    }
    else{
        vscode.window.showErrorMessage('Select a valid file.!');
        return;
    }
    //Error
    if (code_format == null){
        vscode.window.showErrorMessage('Select a valid file.!');
        console.log("Error format code.");
        return;
    }
    else{
        active_editor.edit(edit => {
            let firstLine = document.lineAt(0);
            let lastLine = document.lineAt(document.lineCount - 1);
            let textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
            //Delete all code
            edit.delete(textRange);
            //Insert formatted code
            edit.insert(new vscode.Position(0, 0), code_format);
        });
        // vscode.WorkspaceEdit.set("","");
        console.log("Code formatted.")
        //Change position
        let new_position = position.with(position_line, position_character);
        let new_selection = new vscode.Selection(new_position, new_position);
        active_editor.selection = new_selection;
    }
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
