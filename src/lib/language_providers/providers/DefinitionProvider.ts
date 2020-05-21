import {DefinitionProvider, TextDocument, CancellationToken, Position, ProviderResult, DefinitionLink, Range} from 'vscode';
import {Ctags, CtagsManager, Symbol} from '../ctags';
import {Logger} from '../Logger';

export default class VerilogDefinitionProvider implements DefinitionProvider {

    private logger : Logger;
    constructor(logger: Logger)
    {
        this.logger = logger
    }
    
    
    provideDefinition(document: TextDocument, position: Position, token: CancellationToken) : Promise<DefinitionLink[]> {
        this.logger.log("Definitions Requested: " + document.uri)
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
                        matchingSymbols.push(i)
                    }
                }
                for(let i of matchingSymbols) {
                    definitions.push({
                        targetUri: document.uri,
                        targetRange : new Range(i.startPosition, new Position (i.startPosition.line, Number.MAX_VALUE)),
                        targetSelectionRange : new Range(i.startPosition, i.endPosition)
                    });
                }
                this.logger.log(definitions.length + " definitions returned")
                resolve(definitions);
            }
        })
    }

}