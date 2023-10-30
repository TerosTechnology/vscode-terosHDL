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
} from 'vscode';

import { t_Multi_project_manager } from '../type_declaration';
import * as vscode from 'vscode';
import * as teroshdl2 from 'teroshdl2';

// eslint-disable-next-line @typescript-eslint/class-name-casing
const TRIGGER_CHARACTERS = [';', '.', "'", ',', '[', ']', '-', '\n'];

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class Stutter_mode_manager {
    private manager: t_Multi_project_manager;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager) {

        this.manager = manager;

        context.subscriptions.push(this.get_stutter_mode(teroshdl2.common.general.HDL_LANG.VHDL));
        context.subscriptions.push(this.get_stutter_mode(teroshdl2.common.general.HDL_LANG.VERILOG));
        context.subscriptions.push(this.get_stutter_mode(teroshdl2.common.general.HDL_LANG.SYSTEMVERILOG));
    }

    private get_stutter_mode(lang: teroshdl2.common.general.HDL_LANG) {
        let stutter;
        const element = this;

        if (lang === teroshdl2.common.general.HDL_LANG.VHDL) {
            stutter = languages.registerOnTypeFormattingEditProvider(
                { scheme: '*', language: 'vhdl' },
                {
                    provideOnTypeFormattingEdits(
                        document: TextDocument,
                        position: Position,
                        ch: string
                    ): ProviderResult<TextEdit[]> {
                        const stutter_delimiters = element.manager.get_config_manager().get_config().editor.general.stutter_delimiters;
                        const stutter_bracket_shortcuts = element.manager.get_config_manager().get_config().editor.general.stutter_bracket_shortcuts;
                        const stutter_comment_shortcuts = element.manager.get_config_manager().get_config().editor.general.stutter_comment_shortcuts;
                        const stutter_block_width = element.manager.get_config_manager().get_config().editor.general.stutter_block_width;
                        const stutter_max_width = element.manager.get_config_manager().get_config().editor.general.stutter_max_width;

                        let inComment = document.lineAt(position).text.match(/^.*--.*$/);
                        let linePrefix = document.lineAt(position).text.substr(0, position.character);

                        switch (ch) {
                            case "'":
                                if (!stutter_delimiters) {break;}
                                if (inComment) {break;}
                                if (linePrefix.endsWith("''")) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            '"'
                                        )
                                    ];
                                }
                                break;

                            case ';':
                                if (!stutter_delimiters) {break;}
                                if (inComment) {break;}
                                if (linePrefix.endsWith(': ;')) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            '= '
                                        )
                                    ];
                                } else if (linePrefix.match(/\s;;/)) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            ': '
                                        )
                                    ];
                                } else if (linePrefix.endsWith(';;')) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            ' : '
                                        )
                                    ];
                                }
                                break;

                            case '.':
                                if (!stutter_delimiters) {break;}
                                if (inComment) {break;}
                                if (linePrefix.match(/\s\.\./)) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            '=> '
                                        )
                                    ];
                                } else if (linePrefix.endsWith('..')) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            ' => '
                                        )
                                    ];
                                }
                                break;

                            case ',':
                                if (!stutter_delimiters) {break;}
                                if (inComment) {break;}
                                if (linePrefix.match(/\s,,/)) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            '<= '
                                        )
                                    ];
                                } else if (linePrefix.endsWith(',,')) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            ' <= '
                                        )
                                    ];
                                }
                                break;

                            case '[':
                                if (!stutter_bracket_shortcuts) {break;}
                                if (inComment) {break;}
                                if (linePrefix.endsWith('([')) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            '['
                                        )
                                    ];
                                } else if (linePrefix.endsWith('[')) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -1), position.with()),
                                            '('
                                        )
                                    ];
                                }
                                break;

                            case ']':
                                if (!stutter_bracket_shortcuts) {break;}
                                if (inComment) {break;}
                                if (linePrefix.endsWith(')]')) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -2), position.with()),
                                            ']'
                                        )
                                    ];
                                } else if (linePrefix.endsWith(']')) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -1), position.with()),
                                            ')'
                                        )
                                    ];
                                }
                                break;

                            case '-':
                                if (!stutter_comment_shortcuts) {break;}
                                let max: number = stutter_max_width;
                                let width: number = stutter_block_width;

                                const intd = linePrefix.match(/^(\s*).*$/);
                                let indent = "";
                                if (intd !== null){
                                    indent = intd[1];
                                }

                                // Adjust width if max is set
                                if (max > 0) {
                                    width = Math.min(width, max - indent.length);
                                }

                                if (linePrefix.match(/^\s*----+$/)) {
                                    return [
                                        TextEdit.replace(
                                            new Range(position.translate(0, -1), position.with()),
                                            (document.eol == 1 ? '\n' : '\r\n') + indent + '-- '
                                        ),
                                        TextEdit.insert(
                                            new Position(position.line + 1, 0),
                                            indent + '-'.repeat(width) + (document.eol == 1 ? '\n' : '\r\n')
                                        )
                                    ];
                                } else if (linePrefix.match(/^\s*---$/)) {
                                    return [TextEdit.insert(position.with(), '-'.repeat(width - 3))];
                                }
                                break;

                            case '\n':
                                if (!stutter_comment_shortcuts) {break;}
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
                TRIGGER_CHARACTERS[0],
                ...TRIGGER_CHARACTERS.slice(1)
            );
        }
        else {
            stutter = languages.registerOnTypeFormattingEditProvider(
                { scheme: '*', language: lang },
                {
                    provideOnTypeFormattingEdits(
                        document: TextDocument,
                        position: Position,
                        ch: string
                    ): ProviderResult<TextEdit[]> {
                        const stutter_comment_shortcuts = element.manager.get_config_manager().get_config().editor.general.stutter_comment_shortcuts;

                        let linePrefix = document.lineAt(position).text.substr(0, position.character);
                        switch (ch) {
                            case '\n':
                                if (!stutter_comment_shortcuts) {break;}
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
                TRIGGER_CHARACTERS[0],
                ...TRIGGER_CHARACTERS.slice(1)
            );
        }
        return stutter;
    }
}