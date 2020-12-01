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

import {
    DocumentSymbolProvider, CancellationToken, TextDocument, SymbolKind,
    DocumentSymbol, window, commands, workspace, ExtensionContext
} from 'vscode';
import { Ctags, CtagsManager, Symbol } from '../ctags';
import { Logger, Log_Severity } from '../Logger'

export default class VerilogDocumentSymbolProvider implements DocumentSymbolProvider {

    public docSymbols: DocumentSymbol[] = [];

    private logger: Logger;
    private context: ExtensionContext;
    constructor(logger: Logger, context: ExtensionContext) {
        this.logger = logger;
        this.context = context;
        // workspace.onDidSaveTextDocument(this.onSave);
    }


    onSave(doc) {
        CtagsManager.ctags.clearSymbols();

        CtagsManager.ctags.index()
            .then(() => {
                let symbols = CtagsManager.ctags.symbols;
                // console.log(symbols);
                this.docSymbols = this.buildDocumentSymbolList(symbols);
                this.logger.log(this.docSymbols.length + " top-level symbols returned",
                    (this.docSymbols.length > 0) ? Log_Severity.Info : Log_Severity.Warn);
                let syms = [...this.docSymbols];
                this.context.workspaceState.update("symbols", syms);
                // commands.executeCommand('vscode.executeDocumentSymbolProvider', doc.uri);
            });

    }

    provideDocumentSymbols(document: TextDocument, token: CancellationToken): Thenable<DocumentSymbol[]> {
        return new Promise((resolve) => {
            this.logger.log("Symbols Requested: " + document.uri);
            let symbols: Symbol[] = [];
            // console.log("symbol provider");
            let activeDoc: TextDocument | undefined = window.activeTextEditor?.document;
            if (CtagsManager.ctags.doc === undefined || CtagsManager.ctags.doc.uri.fsPath !== activeDoc?.uri.fsPath) {
                CtagsManager.ctags.setDocument(<TextDocument>activeDoc);
            }
            let ctags: Ctags = CtagsManager.ctags;
            // If dirty, re index and then build symbols
            if (ctags.isDirty) {
                ctags.index()
                    .then(() => {
                        symbols = ctags.symbols;
                        // console.log(symbols);
                        this.docSymbols = this.buildDocumentSymbolList(symbols);
                        this.logger.log(this.docSymbols.length + " top-level symbols returned",
                            (this.docSymbols.length > 0) ? Log_Severity.Info : Log_Severity.Warn);
                        resolve(this.docSymbols);
                    });
            }
            else {
                this.logger.log(this.docSymbols.length + " top-level symbols returned");
                resolve(this.docSymbols);
            }
        });
    }

    isContainer(type: SymbolKind): boolean | undefined {
        switch (type) {
            case SymbolKind.Array:
            case SymbolKind.Boolean:
            case SymbolKind.Constant:
            case SymbolKind.EnumMember:
            case SymbolKind.Event:
            case SymbolKind.Field:
            case SymbolKind.Key:
            case SymbolKind.Null:
            case SymbolKind.Number:
            case SymbolKind.Object:
            case SymbolKind.Property:
            case SymbolKind.String:
            case SymbolKind.TypeParameter:
            case SymbolKind.Variable:
                return false;
            case SymbolKind.Class:
            case SymbolKind.Constructor:
            case SymbolKind.Enum:
            case SymbolKind.File:
            case SymbolKind.Function:
            case SymbolKind.Interface:
            case SymbolKind.Method:
            case SymbolKind.Module:
            case SymbolKind.Namespace:
            case SymbolKind.Package:
            case SymbolKind.Struct:
                return true;
        }
    }


    // find the appropriate container RECURSIVELY and add to its childrem
    // return true: if done
    // return false: if container not found
    findContainer(con: DocumentSymbol, sym: DocumentSymbol): boolean | undefined {
        let res: boolean | undefined = false;
        for (let i of con.children) {
            if (this.isContainer(i.kind) && i.range.contains(sym.range)) {
                res = this.findContainer(i, sym);
                if (res) { return true; };
            }
        }
        if (!res) {
            con.children.push(sym);
            return true;
        }
    }

    // Build heiarchial DocumentSymbol[] from linear symbolsList[] using start and end position
    // TODO: Use parentscope/parenttype of symbol to construct heirarchial DocumentSymbol []
    buildDocumentSymbolList(symbolsList: Symbol[]): DocumentSymbol[] {
        let list: DocumentSymbol[] = [];
        symbolsList = symbolsList.sort((a, b): number => {
            if (a.startPosition.isBefore(b.startPosition)) { return -1; };
            if (a.startPosition.isAfter(b.startPosition)) { return 1; };
            return 0;
        });
        // Add each of the symbols in order
        for (let i of symbolsList) {
            if (i === undefined) {
                break;
            }
            let sym: DocumentSymbol = i.getDocumentSymbol();
            // if no top level elements present
            if (list.length === 0) {
                list.push(sym);
                continue;
            }
            else {
                // find a parent among the top level element
                let done: boolean = false;
                for (let j of list) {
                    if (this.isContainer(j.kind) && j.range.contains(sym.range)) {
                        this.findContainer(j, sym);
                        done = true;
                        break;
                    }
                }
                // add a new top level element
                if (!done) {
                    list.push(sym);
                }
            }
        }

        return list;
    }

}