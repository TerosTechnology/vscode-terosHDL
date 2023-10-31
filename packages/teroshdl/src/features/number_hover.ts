// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
//
// This file is part of TerosHDL
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
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import * as vscode from 'vscode';
import * as teroshdl2 from 'teroshdl2';
import * as utils from '../utils/utils';

export class Number_hover_manager {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext) {
        // VHDL
        let hover_numbers_vhdl = vscode.languages.registerHoverProvider(utils.VHDL_SELECTOR, {
            provideHover(document, position, token) {
                return hover(document, position, teroshdl2.common.general.LANGUAGE.VHDL);
            }
        });
        // Verilog/SV
        let hover_numbers_verilog = vscode.languages.registerHoverProvider(utils.VERILOG_SELECTOR, {
            provideHover(document, position, token) {
                return hover(document, position, teroshdl2.common.general.LANGUAGE.VERILOG);
            }
        });
        context.subscriptions.push(hover_numbers_vhdl);
        context.subscriptions.push(hover_numbers_verilog);
    }
}

function hover(document, position, lang: teroshdl2.common.general.LANGUAGE) {
    let wordRange = document.getWordRangeAtPosition(position, /\w[-\w\.\"]*/g);
    let result: teroshdl2.utils.numbers.result_t;
    if (wordRange !== undefined) {
        let leadingText = document.getText(new vscode.Range(wordRange.start, wordRange.end));
        result = teroshdl2.utils.numbers.hdl_hover(leadingText, lang);
        if (result.is_ok === false){
            return;
        }

        const content = new vscode.MarkdownString();
        content.supportHtml = true;
        content.isTrusted = true;
        content.appendMarkdown(`Number conversion of **${leadingText}**:<br>`);

        if (result.is_multi === false) {
            content.appendMarkdown(`- <span style="color:#569cd6;">Unsigned</span> &nbsp;<span style="color:#b5cea8;">${result.unsigned_n}</span>`);
        } else {
            content.appendMarkdown(`- <span style="color:#569cd6;">Unsigned</span> &nbsp;<span style="color:#b5cea8;">${result.unsigned_n}</span><br>`);
            content.appendMarkdown(`- <span style="color:#569cd6;">Signed&nbsp;&nbsp;&nbsp;&nbsp;</span> &nbsp;<span style="color:#b5cea8;">${result.signed_n}</span>`);
        }

        return new vscode.Hover(content);
    }
}







