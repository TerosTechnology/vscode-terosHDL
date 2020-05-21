import { CompletionItemProvider, CompletionItem, TextDocument, Position, CancellationToken, CompletionContext, ProviderResult, CompletionItemKind, CompletionTriggerKind, Range, MarkdownString } from "vscode";
import {Ctags, CtagsManager, Symbol} from '../ctags';
import { Logger } from "../Logger";

export default class VerilogCompletionItemProvider implements CompletionItemProvider {

    private logger: Logger;

    constructor(logger: Logger)
    {
        this.logger = logger;
    }

    //TODO: Better context based completion items
    provideCompletionItems (document: TextDocument, position: Position, token: CancellationToken,
        context: CompletionContext) : ProviderResult<CompletionItem[]> {
        this.logger.log("Completion items requested");
        return new Promise((resolve, reject) => {
            let items : CompletionItem[] = [];
            
            let ctags : Ctags = CtagsManager.ctags;
            if (ctags.doc === undefined || ctags.doc.uri !== document.uri ) { // systemverilog keywords
                return;
            }
            else {
                ctags.symbols.forEach(symbol => {
                    let newItem : CompletionItem = new CompletionItem(symbol.name, this.getCompletionItemKind(symbol.type));
                    let codeRange = new Range(symbol.startPosition, new Position (symbol.startPosition.line, Number.MAX_VALUE));
                    let code = document.getText(codeRange).trim();
                    newItem.detail = symbol.type;
                    let doc : string = "```systemverilog\n" + code + "\n```";
                    if(symbol.parentScope !== undefined && symbol.parentScope !== ""){
                        doc += "\nHeirarchial Scope: " + symbol.parentScope;
                    }
                    newItem.documentation = new MarkdownString(doc);
                    items.push(newItem);
                });
            }
            this.logger.log(items.length + " items requested");
            resolve(items);
        });
    }

    private getCompletionItemKind(type: string) : CompletionItemKind {
        switch(type) {
            case 'constant' : return CompletionItemKind.Constant;
            case 'event'    : return CompletionItemKind.Event;
            case 'function' : return CompletionItemKind.Function;
            case 'module'   : return CompletionItemKind.Module;
            case 'net'      : return CompletionItemKind.Variable;
            case 'port'     : return CompletionItemKind.Variable;
            case 'register' : return CompletionItemKind.Variable;
            case 'task'     : return CompletionItemKind.Function;
            case 'block'    : return CompletionItemKind.Module;
            case 'assert'   : return CompletionItemKind.Variable;   // No idea what to use
            case 'class'    : return CompletionItemKind.Class;
            case 'covergroup':return CompletionItemKind.Class;  // No idea what to use
            case 'enum'     : return CompletionItemKind.Enum;
            case 'interface': return CompletionItemKind.Interface;
            case 'modport'  : return CompletionItemKind.Variable;    // same as ports
            case 'package'  : return CompletionItemKind.Module;
            case 'program'  : return CompletionItemKind.Module;
            case 'prototype': return CompletionItemKind.Function;
            case 'property' : return CompletionItemKind.Property;
            case 'struct'   : return CompletionItemKind.Struct;
            case 'typedef'  : return CompletionItemKind.TypeParameter;
            default         : return CompletionItemKind.Variable;
        }
    }

}