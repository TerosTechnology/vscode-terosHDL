// Copyright (c) 2019 Rich J. Young

import {
    CompletionItem,
    CompletionItemKind,
    languages,
    Position,
    TextDocument,
    workspace
} from 'vscode';

interface IAttributeSuggestion {
    attribute: string;
    kind: CompletionItemKind;
    detail: string;
    commitCharacters?: string[];
}

const attributes: IAttributeSuggestion[] = [
    {
        attribute: 'base',
        kind: CompletionItemKind.TypeParameter,
        detail: "(type) T'base : (Type | Subtype)"
    },
    {
        attribute: 'left',
        kind: CompletionItemKind.Value,
        detail: "(value) T'left : Value"
    },
    {
        attribute: 'right',
        kind: CompletionItemKind.Value,
        detail: "(value) T'right : Value"
    },
    {
        attribute: 'high',
        kind: CompletionItemKind.Value,
        detail: "(value) T'high : Value"
    },
    {
        attribute: 'low',
        kind: CompletionItemKind.Value,
        detail: "(value) T'low : Value"
    },
    {
        attribute: 'ascending',
        kind: CompletionItemKind.Value,
        detail: "(value) T'ascending : Boolean"
    },
    {
        attribute: 'image',
        kind: CompletionItemKind.Function,
        detail: "(function) T'image(X) : String",
        commitCharacters: ['(']
    },
    {
        attribute: 'value',
        kind: CompletionItemKind.Function,
        detail: "(function) T'value(X) : Value",
        commitCharacters: ['(']
    },
    {
        attribute: 'pos',
        kind: CompletionItemKind.Function,
        detail: "(function) T'pos(X) : Integer",
        commitCharacters: ['(']
    },
    {
        attribute: 'val',
        kind: CompletionItemKind.Function,
        detail: "(function) T'val(X) : Value",
        commitCharacters: ['(']
    },
    {
        attribute: 'succ',
        kind: CompletionItemKind.Function,
        detail: "(function) T'succ(X) : Value",
        commitCharacters: ['(']
    },
    {
        attribute: 'pred',
        kind: CompletionItemKind.Function,
        detail: "(function) T'pred(X) : Value",
        commitCharacters: ['(']
    },
    {
        attribute: 'leftof',
        kind: CompletionItemKind.Function,
        detail: "(function) T'leftof(X) : Value",
        commitCharacters: ['(']
    },
    {
        attribute: 'rightof',
        kind: CompletionItemKind.Function,
        detail: "(function) T'rightof(X) : Value",
        commitCharacters: ['(']
    },
    {
        attribute: 'subtype',
        kind: CompletionItemKind.TypeParameter,
        detail: "(type) O'subtype: Subtype"
    },
    {
        attribute: 'range',
        kind: CompletionItemKind.TypeParameter,
        detail: "(type) A'range[(N)]: Range",
        commitCharacters: ['(']
    },
    {
        attribute: 'reverse_range',
        kind: CompletionItemKind.TypeParameter,
        detail: "(type) A'reverse_range[(N)]: Range",
        commitCharacters: ['(']
    },
    {
        attribute: 'length',
        kind: CompletionItemKind.Function,
        detail: "(function) A'length[(N)]: Integer",
        commitCharacters: ['(']
    },
    {
        attribute: 'ascending',
        kind: CompletionItemKind.Function,
        detail: "(function) A'ascending[(N)] : Boolean",
        commitCharacters: ['(']
    },
    {
        attribute: 'element',
        kind: CompletionItemKind.TypeParameter,
        detail: "(type) A'element : Subtype"
    },
    {
        attribute: 'delayed',
        kind: CompletionItemKind.Function,
        detail: "(function) S'delayed[(T)] : Signal",
        commitCharacters: ['(']
    },
    {
        attribute: 'stable',
        kind: CompletionItemKind.Function,
        detail: "(function) S'stable[(T)] : Boolean",
        commitCharacters: ['(']
    },
    {
        attribute: 'quiet',
        kind: CompletionItemKind.Function,
        detail: "(function) S'quiet[(T)] : Boolean",
        commitCharacters: ['(']
    },
    {
        attribute: 'transaction',
        kind: CompletionItemKind.Value,
        detail: "(value) S'transaction : Bit"
    },
    {
        attribute: 'event',
        kind: CompletionItemKind.Function,
        detail: "(function) S'event : Boolean"
    },
    {
        attribute: 'active',
        kind: CompletionItemKind.Function,
        detail: "(function) S'active : Boolean"
    },
    {
        attribute: 'last_event',
        kind: CompletionItemKind.Function,
        detail: "(function) S'last_event : Time"
    },
    {
        attribute: 'last_active',
        kind: CompletionItemKind.Function,
        detail: "(function) S'last_active : Time"
    },
    {
        attribute: 'last_value',
        kind: CompletionItemKind.Function,
        detail: "(function) S'last_value : Value"
    },
    {
        attribute: 'driving',
        kind: CompletionItemKind.Function,
        detail: "(function) S'driving : Boolean"
    },
    {
        attribute: 'driving_value',
        kind: CompletionItemKind.Function,
        detail: "(function) S'driving_value : Value"
    },
    {
        attribute: 'simple_name',
        kind: CompletionItemKind.Value,
        detail: "(value) E'simple_name : String"
    },
    {
        attribute: 'instance_name',
        kind: CompletionItemKind.Value,
        detail: "(value) E'instance_name : String"
    },
    {
        attribute: 'path_name',
        kind: CompletionItemKind.Value,
        detail: "(value) E'instance_name : String"
    }
];

export const VhdlAttributeCompletionItemProvider = languages.registerCompletionItemProvider(
    { scheme: '*', language: 'vhdl' },
    {
        provideCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
            const conf = workspace.getConfiguration('vhdl', document.uri);
            let linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (linePrefix.match(/.*[a-z0-9_]'$/i)) {
                return attributes.map(attr => {
                    let item = new CompletionItem(attr.attribute);
                    item.kind = attr.kind;
                    item.detail = attr.detail;
                    item.commitCharacters = attr.commitCharacters;
                    switch (conf.get('suggestAttributeCase')) {
                        case 'upper':
                            item.insertText = attr.attribute.toUpperCase();
                            break;
                        case 'lower':
                            item.insertText = attr.attribute.toLowerCase();
                            break;
                    }
                    return item;
                });
            }
            return [];
        }
    },
    "'"
);