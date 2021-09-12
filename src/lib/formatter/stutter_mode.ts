// The MIT License (MIT)

// Copyright (c) 2019 Rich J. Young

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.

import {
    languages,
    Position,
    ProviderResult,
    Range,
    TextDocument,
    TextEdit,
    workspace
} from 'vscode';

const triggerCharacters = [';', '.', "'", ',', '[', ']', '-', '\n'];

export function get_shutter_mode(config_reader, language) {
    
    let shutter;

    if (language === 'vhdl') {
        shutter = languages.registerOnTypeFormattingEditProvider(
            { scheme: '*', language: 'vhdl' },
            {
                provideOnTypeFormattingEdits(
                    document: TextDocument,
                    position: Position,
                    ch: string
                ): ProviderResult<TextEdit[]> {
                    let linePrefix = document.lineAt(position).text.substr(0, position.character);
                    let enable = config_reader.get_continue_comment();
                    if (enable === false) {
                        return [];
                    }

                    switch (ch) {
                        case '\n':
                            if (linePrefix.match(/^\s*$/)) {
                                let prevLineIsComment = document
                                    .lineAt(position.line - 1)
                                    .text.match(/^\s*(--[^-]\s*)\S+.*$/);
                                let prevLineIsEmptyComment = document
                                    .lineAt(position.line - 1)
                                    .text.match(/^\s*--\s*$/);
                                if (prevLineIsComment) {
                                    return [TextEdit.insert(position.with(), prevLineIsComment[1])];
                                } else if (prevLineIsEmptyComment) {
                                    return [
                                        TextEdit.delete(
                                            new Range(position.translate(-1, 0), position.with())
                                        )
                                    ];
                                }
                            }
                            break;
                    }
                    return [];
                }
            },
            triggerCharacters[0],
            ...triggerCharacters.slice(1)
        );
    }
    else {
        shutter = languages.registerOnTypeFormattingEditProvider(
            { scheme: '*', language: language },
            {
                provideOnTypeFormattingEdits(
                    document: TextDocument,
                    position: Position,
                    ch: string
                ): ProviderResult<TextEdit[]> {
                    let linePrefix = document.lineAt(position).text.substr(0, position.character);
                    let enable = config_reader.get_continue_comment();
                    if (enable === false) {
                        return [];
                    }

                    switch (ch) {
                        case '\n':
                            if (linePrefix.match(/^\s*$/)) {
                                let prevLineIsComment = document
                                    .lineAt(position.line - 1)
                                    .text.match(/^\s*(\/\/[^-]\s*)\S+.*$/);
                                let prevLineIsEmptyComment = document
                                    .lineAt(position.line - 1)
                                    .text.match(/^\s*\/\/\s*$/);
                                if (prevLineIsComment) {
                                    return [TextEdit.insert(position.with(), prevLineIsComment[1])];
                                } else if (prevLineIsEmptyComment) {
                                    return [
                                        TextEdit.delete(
                                            new Range(position.translate(-1, 0), position.with())
                                        )
                                    ];
                                }
                            }
                            break;
                    }
                    return [];
                }
            },
            triggerCharacters[0],
            ...triggerCharacters.slice(1)
        );
    }
    return shutter;

}




// export const VhdlStutterModeFormattingEditProvider = languages.registerOnTypeFormattingEditProvider(
//     { scheme: '*', language: 'vhdl' },
//     {
//         provideOnTypeFormattingEdits(
//             document: TextDocument,
//             position: Position,
//             ch: string
//         ): ProviderResult<TextEdit[]> {
//             let linePrefix = document.lineAt(position).text.substr(0, position.character);

//             switch (ch) {
//                 case '\n':
//                     if (linePrefix.match(/^\s*$/)) {
//                         let prevLineIsComment = document
//                             .lineAt(position.line - 1)
//                             .text.match(/^\s*(--[^-]\s*)\S+.*$/);
//                         let prevLineIsEmptyComment = document
//                             .lineAt(position.line - 1)
//                             .text.match(/^\s*--\s*$/);
//                         if (prevLineIsComment) {
//                             return [TextEdit.insert(position.with(), prevLineIsComment[1])];
//                         } else if (prevLineIsEmptyComment) {
//                             return [
//                                 TextEdit.delete(
//                                     new Range(position.translate(-1, 0), position.with())
//                                 )
//                             ];
//                         }
//                     }
//                     break;
//             }
//             return [];
//         }
//     },
//     triggerCharacters[0],
//     ...triggerCharacters.slice(1)
// );

// export const VerilogStutterModeFormattingEditProvider = languages.registerOnTypeFormattingEditProvider(
//     { scheme: '*', language: 'verilog' },
//     {
//         provideOnTypeFormattingEdits(
//             document: TextDocument,
//             position: Position,
//             ch: string
//         ): ProviderResult<TextEdit[]> {
//             let linePrefix = document.lineAt(position).text.substr(0, position.character);

//             switch (ch) {
//                 case '\n':
//                     if (linePrefix.match(/^\s*$/)) {
//                         let prevLineIsComment = document
//                             .lineAt(position.line - 1)
//                             .text.match(/^\s*(\/\/[^-]\s*)\S+.*$/);
//                         let prevLineIsEmptyComment = document
//                             .lineAt(position.line - 1)
//                             .text.match(/^\s*\/\/\s*$/);
//                         if (prevLineIsComment) {
//                             return [TextEdit.insert(position.with(), prevLineIsComment[1])];
//                         } else if (prevLineIsEmptyComment) {
//                             return [
//                                 TextEdit.delete(
//                                     new Range(position.translate(-1, 0), position.with())
//                                 )
//                             ];
//                         }
//                     }
//                     break;
//             }
//             return [];
//         }
//     },
//     triggerCharacters[0],
//     ...triggerCharacters.slice(1)
// );

// export const SystemVerilogStutterModeFormattingEditProvider = languages.registerOnTypeFormattingEditProvider(
//     { scheme: '*', language: 'verilog' },
//     {
//         provideOnTypeFormattingEdits(
//             document: TextDocument,
//             position: Position,
//             ch: string
//         ): ProviderResult<TextEdit[]> {
//             let linePrefix = document.lineAt(position).text.substr(0, position.character);

//             switch (ch) {
//                 case '\n':
//                     if (linePrefix.match(/^\s*$/)) {
//                         let prevLineIsComment = document
//                             .lineAt(position.line - 1)
//                             .text.match(/^\s*(\/\/[^-]\s*)\S+.*$/);
//                         let prevLineIsEmptyComment = document
//                             .lineAt(position.line - 1)
//                             .text.match(/^\s*\/\/\s*$/);
//                         if (prevLineIsComment) {
//                             return [TextEdit.insert(position.with(), prevLineIsComment[1])];
//                         } else if (prevLineIsEmptyComment) {
//                             return [
//                                 TextEdit.delete(
//                                     new Range(position.translate(-1, 0), position.with())
//                                 )
//                             ];
//                         }
//                     }
//                     break;
//             }
//             return [];
//         }
//     },
//     triggerCharacters[0],
//     ...triggerCharacters.slice(1)
// );