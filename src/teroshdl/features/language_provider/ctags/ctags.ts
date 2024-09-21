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

import { TextDocument, Position, SymbolKind, Range, DocumentSymbol, workspace, window, TextEditor, commands, Uri, ExtensionContext } from 'vscode';
import * as child from 'child_process';
import { Logger, Log_Severity } from './Logger';
import * as os from 'os';
import * as path_lib from 'path';

// Internal representation of a symbol
export class Symbol {
    name: string;
    type: string;
    pattern: string;
    startPosition: Position;
    endPosition: Position;
    parentScope: string;
    parentType: string;
    isValid: boolean | undefined;
    constructor(name: string, type: string, pattern: string, startLine: number, parentScope: string, parentType: string, endLine?: number, isValid?: boolean) {
        this.name = name;
        this.type = type;
        this.pattern = pattern;
        this.startPosition = new Position(startLine, 0);
        this.parentScope = parentScope;
        this.parentType = parentType;
        this.isValid = isValid;
        this.endPosition = new Position(<number>endLine, Number.MAX_VALUE);
    }

    setEndPosition(endLine: number) {
        this.endPosition = new Position(endLine, Number.MAX_VALUE);
        this.isValid = true;
    }

    getDocumentSymbol(): DocumentSymbol {
        let range = new Range(this.startPosition, this.endPosition);
        return new DocumentSymbol(this.name, this.type, Symbol.getSymbolKind(this.type), range, range);
    }

    static isContainer(type: string): boolean | undefined {
        switch (type) {
            case 'constant':
            case 'event':
            case 'net':
            case 'port':
            case 'register':
            case 'modport':
            case 'prototype':
            case 'typedef':
            case 'property':
            case 'assert':
                return false;
            case 'function':
            case 'module':
            case 'task':
            case 'block':
            case 'class':
            case 'covergroup':
            case 'enum':
            case 'interface':
            case 'package':
            case 'program':
            case 'struct':
                return true;
        }
    }

    // types used by ctags
    // taken from https://github.com/universal-ctags/ctags/blob/master/parsers/verilog.c
    static getSymbolKind(name: String): SymbolKind {
        switch (name) {
            case 'constant': return SymbolKind.Constant;
            case 'event': return SymbolKind.Event;
            case 'function': return SymbolKind.Function;
            case 'module': return SymbolKind.Module;
            case 'entity': return SymbolKind.Module; //VHDL
            case 'net': return SymbolKind.Variable;
            // Boolean uses a double headed arrow as symbol (kinda looks like a port)
            case 'port': return SymbolKind.Boolean;
            case 'register': return SymbolKind.Variable;
            case 'signal': return SymbolKind.Variable; //VHDL
            case 'variable': return SymbolKind.Variable; //VHDL
            case 'function': return SymbolKind.Function; //VHDL
            case 'task': return SymbolKind.Function;
            case 'block': return SymbolKind.Module;
            case 'assert': return SymbolKind.Variable;   // No idea what to use
            case 'class': return SymbolKind.Class;
            case 'covergroup': return SymbolKind.Class;  // No idea what to use
            case 'enum': return SymbolKind.Enum;
            case 'interface': return SymbolKind.Interface;
            case 'modport': return SymbolKind.Boolean;    // same as ports
            case 'package': return SymbolKind.Package;
            case 'program': return SymbolKind.Module;
            case 'process': return SymbolKind.Method; //VHDL
            case 'prototype': return SymbolKind.Function;
            case 'property': return SymbolKind.Property;
            case 'struct': return SymbolKind.Struct;
            case 'alias': return SymbolKind.TypeParameter; //VHDL
            case 'typedef': return SymbolKind.TypeParameter;
            default: return SymbolKind.Variable;
        }
    }
}

// TODO: add a user setting to enable/disable all ctags based operations
export class Ctags {

    symbols: Symbol[];
    doc: TextDocument | undefined = undefined;
    isDirty: boolean;
    private context: ExtensionContext;
    private logger: Logger;

    constructor(logger: Logger, context: ExtensionContext) {
        this.symbols = [];
        this.isDirty = true;
        this.logger = logger;
        this.context = context;
    }

    setDocument(doc: TextDocument) {
        this.doc = doc;
        this.clearSymbols();
    }

    clearSymbols() {
        this.isDirty = true;
        this.symbols = [];
    }

    getSymbolsList(): Symbol[] {
        return this.symbols;
    }

    execCtags(filepath: string): Thenable<string> {

        let path_bin = path_lib.sep + "resources" + path_lib.sep + "bin" + path_lib.sep + "ctags" + path_lib.sep;
        let path_options = this.context.asAbsolutePath(path_lib.sep + "resources" + path_lib.sep
            + "bin" + path_lib.sep + "ctags" + path_lib.sep + ".ctags");

        let platform = os.platform();
        if (platform === "darwin") {
            path_bin += "universal-ctags-darwin";
        }
        // eslint-disable-next-line eqeqeq
        else if (platform == "linux") {
            path_bin += "universal-ctags-linux";

        }
        // eslint-disable-next-line eqeqeq
        else if (platform == "win32") {
            path_bin += "universal-ctags-win32.exe";
        }

        let command: string = this.context.asAbsolutePath(path_bin) + ' --options='
            + path_options + ' -f - --fields=+K --sort=no --excmd=n "' + filepath + '"';
        this.logger.log(command, Log_Severity.Command);
        return new Promise((resolve, reject) => {
            child.exec(command, {}, (error, stdout: string) => {
                resolve(stdout);
            });
        });
    }

    parseTagLine(line: string): Symbol[] | undefined {
        try {
            let name, type, pattern, lineNoStr, parentScope, parentType: string;
            let scope: string[];
            let lineNo: number;
            let parts: string[] = line.split('\t');
            let names = parts[0].split(',');
            // pattern = parts[2];
            type = parts[3];
            if (parts.length === 5) {
                scope = parts[4].split(':');
                parentType = scope[0];
                parentScope = scope[1];
            }
            else {
                parentScope = '';
                parentType = '';
            }
            lineNoStr = parts[2];
            lineNo = Number(lineNoStr.slice(0, -2)) - 1;

            let symbols: Symbol[] = [];
            for (let i = 0; i < names.length; i++) {
                const name_i = names[i].trim();
                if (name_i !== '') {
                    let symbol = new Symbol(name_i, type, pattern, lineNo, parentScope, parentType, lineNo, false);
                    symbols.push(symbol);
                }
            }
            return symbols;
        }
        catch (e) {
            this.logger.log('Ctags Line Parser: ' + e, Log_Severity.Error);
            this.logger.log('Line: ' + line, Log_Severity.Error);
            return undefined;
        }
    }

    buildSymbolsList(tags: string): Thenable<void> | undefined {
        try {
            if (tags === '') {
                return;
            }
            // Parse ctags output
            let lines: string[] = tags.split(/\r?\n/);
            lines.forEach(line => {
                if (line !== '') {
                    let symbol = this.parseTagLine(line);
                    if (symbol !== undefined) {
                        this.symbols = this.symbols.concat(<Symbol[]>symbol);
                        // this.symbols.push(<Symbol>symbol);
                    }
                }
            });

            // end tags are not supported yet in ctags. So, using regex
            let match;
            let endPosition;
            let text = this.doc?.getText();
            let eRegex: RegExp = /^(?![\r\n])\s*end(\w*)*[\s:]?/gm;
            while (match = eRegex.exec(<string>text)) {
                if (match && typeof match[1] !== 'undefined') {
                    endPosition = this.doc?.positionAt(match.index + match[0].length - 1);
                    // get the starting symbols of the same type
                    // doesn't check for begin...end blocks
                    let s = this.symbols.filter(i => i.type === match[1] && i.startPosition.isBefore(endPosition) && !i.isValid);
                    if (s.length > 0) {
                        // get the symbol nearest to the end tag
                        let max: Symbol = s[0];
                        for (let i = 0; i < s.length; i++) {
                            max = s[i].startPosition.isAfter(max.startPosition) ? s[i] : max;
                        }
                        for (let i of this.symbols) {
                            if (i.name === max.name && i.startPosition.isEqual(max.startPosition) && i.type === max.type) {
                                i.setEndPosition(endPosition.line);
                                break;
                            }
                        }
                    }
                }
            }
            this.isDirty = false;
            return Promise.resolve();
        } catch (e) { console.log(e); }
    }

    index(): Thenable<void> {
        return new Promise((resolve, reject) => {
            this.execCtags(<string>this.doc?.uri.fsPath)
                .then(output => this.buildSymbolsList(output))
                .then(() => resolve());
        });
    }

}

export class CtagsManager {
    static ctags: Ctags;
    private logger: Logger;

    constructor(logger: Logger, context: ExtensionContext) {
        this.logger = logger;
        CtagsManager.ctags = new Ctags(logger, context);
    }

    configure() {
        // console.log("ctags manager configure");
        // workspace.onDidSaveTextDocument(this.onSave);
        // window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor);
    }

    // onSave(doc:TextDocument) {
    //     console.log("on save");
    //     CtagsManager.ctags.clearSymbols();
    //     // Should automatically refresh the Document symbols show, but doesn't seem to be working
    //     commands.executeCommand('vscode.executeDocumentSymbolProvider', doc.uri);
    //     console.log()
    // }

    onDidChangeActiveTextEditor(editor) {
        if (!this.isOutputPanel(editor.document.uri)) {
            CtagsManager.ctags.setDocument(editor.document);
        }
    }

    isOutputPanel(uri: Uri) {
        return uri.toString().startsWith('output:extension-output-');
    }

}
