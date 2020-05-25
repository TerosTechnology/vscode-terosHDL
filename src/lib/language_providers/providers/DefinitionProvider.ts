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

import {DefinitionProvider, TextDocument, CancellationToken, Position, 
        ProviderResult, DefinitionLink, Range} from 'vscode';
import {Ctags, CtagsManager, Symbol} from '../ctags';
import {Logger} from '../Logger';

export default class VerilogDefinitionProvider implements DefinitionProvider {

    private logger : Logger;
    constructor(logger: Logger)
    {
        this.logger = logger;
    }
    
    provideDefinition(document: TextDocument, position: Position, 
                        token: CancellationToken) : Promise<DefinitionLink[]> {
        this.logger.log("Definitions Requested: " + document.uri);
        return new Promise((resolve, reject) => {
            // get word start and end
            let textRange = document.getWordRangeAtPosition(position);
            if(textRange?.isEmpty){
                return;
            }
            // hover word
            let targetText = document.getText(textRange);
            let ctags : Ctags = CtagsManager.ctags;
            if (ctags.doc === undefined || ctags.doc.uri !== document.uri ) { // systemverilog keywords
                return;
            }
            else {
                let matchingSymbols : Symbol [] = [];
                let definitions : DefinitionLink [] = [];
                // find all matching symbols
                for(let i of ctags.symbols) {
                    if(i.name === targetText) {
                        matchingSymbols.push(i);
                    }
                }
                for(let i of matchingSymbols) {
                    definitions.push({
                        targetUri: document.uri,
                        targetRange : new Range(i.startPosition, new Position (i.startPosition.line, Number.MAX_VALUE)),
                        targetSelectionRange : new Range(i.startPosition, i.endPosition)
                    });
                }
                this.logger.log(definitions.length + " definitions returned");
                resolve(definitions);
            }
        });
    }

}