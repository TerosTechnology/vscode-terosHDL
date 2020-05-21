// import * as vscode from 'vscode';
import {HoverProvider, TextDocument, Position, CancellationToken, Hover, window, Range, MarkdownString} from 'vscode';
import {Ctags, CtagsManager, Symbol} from '../ctags';
import { Logger, Log_Severity } from '../Logger';

export default class VerilogHoverProvider implements HoverProvider {
    // lang: verilog / systemverilog
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public provideHover(document: TextDocument, position: Position, token: CancellationToken) : Hover | undefined{
        this.logger.log("Hover requested");
        // get word start and end
        let textRange = document.getWordRangeAtPosition(position);
        if(textRange?.isEmpty)
            return;
        // hover word
        let targetText = document.getText(textRange);
        let ctags : Ctags = CtagsManager.ctags;
        if (ctags.doc === undefined || ctags.doc.uri !== document.uri ) { // systemverilog keywords
            return;
        }
        else {
            // find symbol
            for(let i of ctags.symbols) {
                // returns the first found tag. Disregards others
                // TODO: very basic hover implementation. Can be extended
                if(i.name === targetText) {
                    let codeRange = new Range(i.startPosition, new Position (i.startPosition.line, Number.MAX_VALUE));
                    let code = document.getText(codeRange).trim();
                    let hoverText : MarkdownString = new MarkdownString();
                    hoverText.appendCodeblock(code, document.languageId);
                    this.logger.log("Hover object returned");
                    return new Hover(hoverText);
                }
            }
            this.logger.log("Hover object not found", Log_Severity.Warn);
            return;
        }
    }
}

