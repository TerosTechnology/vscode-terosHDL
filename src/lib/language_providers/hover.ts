// The MIT License (MIT)

// Copyright (c) 2016 Masahiro H

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as vscode from 'vscode';

export class HoverProvider implements vscode.HoverProvider {
      private _excludedText: RegExp;
      // lang: verilog / systemverilog
      private lang: string;
      constructor(lang: string) {
          this._excludedText = RegExp(/\b(alias|always|always_comb|always_ff|always_latch|and|assert|assign|assume|automatic|before|begin|bind|bins|binsof|bit|break|buf|bufif0|bufif1|byte|case|casex|casez|cell|chandle|class|clocking|cmos|config|const|constraint|context|continue|cover|covergroup|coverpoint|cross|deassign|default|defparam|design|disable|dist|do|edge|else|end|endcase|endclass|endclocking|endconfig|endfunction|endgenerate|endgroup|endinterface|endmodule|endpackage|endprimitive|endprogram|endproperty|endspecify|endsequence|endtable|endtask|enum|event|expect|export|extends|extern|final|first_match|for|force|foreach|forever|fork|forkjoin|function|generate|genvar|highz0|highz1|if|iff|ifnone|ignore_bins|illegal_bins|import|incdir|include|initial|inout|input|inside|instance|int|integer|interface|intersect|join|join_any|join_none|large|liblist|library|local|localparam|logic|longint|macromodule|matches|medium|modport|module|nand|negedge|new|nmos|nor|noshowcancelled|not|notif0|notif1|null|or|output|package|packed|parameter|pmos|posedge|primitive|priority|program|property|protected|pull0|pull1|pulldown|pullup|pulsestyle_onevent|pulsestyle_ondetect|pure|rand|randc|randcase|randsequence|rcmos|real|realtime|ref|reg|release|repeat|return|rnmos|rpmos|rtran|rtranif0|rtranif1|scalared|sequence|shortint|shortreal|showcancelled|signed|small|solve|specify|specparam|static|string|strong0|strong1|struct|super|supply0|supply1|table|tagged|task|this|throughout|time|timeprecision|timeunit|tran|tranif0|tranif1|tri|tri0|tri1|triand|trior|trireg|type|typedef|union|unique|unsigned|use|uwire|var|vectored|virtual|void|wait|wait_order|wand|weak0|weak1|while|wildcard|wire|with|within|wor|xnor|xor)\b/);
          this.lang = lang;
      }

      public provideHover(
          document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
          vscode.Hover | undefined {
              // get word start and end
              let textRange = document.getWordRangeAtPosition(position);

              // hover word
              let targetText = document.getText(textRange);

              if (targetText.search(this._excludedText) !== -1) { // systemverilog keywords
                  return;
              } else { // find declaration
                  let declarationText = this._findDeclaration(document, position, targetText);
                  if (declarationText !== undefined) {
                      return new vscode.Hover([ {language: this.lang, value: declarationText.element}, <vscode.MarkedString>declarationText.comment ]);
                  } else {
                      return;
                  }
              }
      }

      private _findDeclaration(document: vscode.TextDocument, position: vscode.Position, target: string): {element: string, comment: string | undefined} | undefined {
          // check target is valid variable name
          if (target.search(/[A-Za-z_][A-Za-z0-9_]*/g) === -1) {
              return;
          }

          let variableType: string = '';
          if(this.lang === "systemverilog"){
            variableType = String.raw`\b(input|output|inout|reg|wire|` + 
                `logic|integer|bit|byte|shortint|int|longint|time|shortreal|` + 
                `real|double|realtime|rand|randc)\b\s+`;
          }
          else if(this.lang === "verilog"){
            variableType = String.raw`\b(input|output|inout|reg|wire|integer|time|real)\b\s+`;
          }
          else if(this.lang === "vhdl"){
            variableType = String.raw`\b(int|out|inout|signal)\b\s+`;
          }
          let variableTypeStart = '^' + variableType;
          let paraType = String.raw`^\b(parameter|localparam)\b\s+\b${target}\b`;

          let regexTarget = RegExp(String.raw`\b${target}\b`);
          let regexVariableType = RegExp(variableType, 'g');
          let regexVariableTypeStart = RegExp(variableTypeStart);
          let regexParaType = RegExp(paraType);

          // from previous line to first line
          for (let i = position.line-1; i >= 0; i--) {
              // text at current line
              let line = document.lineAt(i).text;
              let element = line.replace(/\/\/.*/, '').trim().replace(/\s+/g, ' ');
              let lastChar = element.charAt(element.length - 1);
              if (lastChar === ',' || lastChar === ';') { // remove last ',' or ';'
                  element = element.substring(0, element.length - 1);
              }

              // find variable declaration type
              if (element.search(regexVariableTypeStart) !== -1) {
                  // replace type to '', like input, output
                  let subText = element.replace(regexVariableType, '').trim();

                  // replace array to '', like [7:0]
                  subText = subText.replace(/(\[.+?\])?/g, '').trim();
                  if (subText.search(regexTarget) !== -1) {
                      let comment : string | undefined = getPrefixedComment(document, i);
                      if (comment){
                        return { element: element, comment: comment };
                      }
                      else {
                          comment = getSuffixedComment(document, i);
                          return { element: element, comment: comment };
                      }
                  }
              }

              // find parameter declaration type
              if (element.search(regexParaType) !== -1) {
                  let comment : string | undefined = getPrefixedComment(document, i);
                  if(comment){
                    return { element: element, comment: comment };
                  }
                  else{
                      comment = getSuffixedComment(document, i);
                      return { element: element, comment: comment };
                  }
              }
          }
      }
  }

function getPrefixedComment(document: vscode.TextDocument, lineNo: number) {
    let i = lineNo - 1;
    let buf = '';
    while (true) {
        let line = document.lineAt(i).text.trim();
        if (!line.startsWith('//')){
            break;
        }
        buf = line.substring(3) + '\n' + buf;
        i--;
    }
    return buf;
}

function getSuffixedComment(document: vscode.TextDocument, lineNo: number) : string | undefined {
    // Spearate comment after the declaration
    let line = document.lineAt(lineNo).text;
    let idx = line.indexOf("//");
    if(idx !== -1){
        return line.substr(idx + 2).trim();
    }
    else{
        return undefined;
    }
}
