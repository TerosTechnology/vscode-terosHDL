import * as vscode from 'vscode';
import * as teroshdl2 from 'teroshdl2';
import * as Output_channel_lib from '../lib/utils/output_channel';
import * as utils from '../lib/utils/utils';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class Number_hover_manager {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, _output_channel: Output_channel_lib.Output_channel){
        // VHDL
        let hover_numbers_vhdl = vscode.languages.registerHoverProvider(utils.VHDL_SELECTOR, {
            provideHover(document, position, token) {
                return hover(document, position, teroshdl2.common.general.HDL_LANG.VHDL);
            }
        });
        // Verilog/SV
        let hover_numbers_verilog = vscode.languages.registerHoverProvider(utils.VERILOG_SELECTOR, {
            provideHover(document, position, token) {
                return hover(document, position, teroshdl2.common.general.HDL_LANG.VERILOG);
            }
        });
        context.subscriptions.push(hover_numbers_vhdl);
        context.subscriptions.push(hover_numbers_verilog);
    }
}

function hover(document, position, lang: teroshdl2.common.general.HDL_LANG) {
    let wordRange = document.getWordRangeAtPosition(position, /\w[-\w\.\"]*/g);
    let result: teroshdl2.utils.numbers.result_t;
    if (wordRange !== undefined) {
        let leadingText = document.getText(new vscode.Range(wordRange.start, wordRange.end));
        result = teroshdl2.utils.numbers.hdl_hover(leadingText, lang);
        if (result.is_multi === false) {
            return new vscode.Hover(`${leadingText} = ${result.unsigned_n}`);
        } else {
            return new vscode.Hover(`${leadingText} = ${result.unsigned_n} (unsigned) || ${result.signed_n} (signed)`);
        }
    }
}







