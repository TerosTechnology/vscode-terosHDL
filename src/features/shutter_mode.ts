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

import * as Output_channel_lib from '../lib/utils/output_channel';
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import * as vscode from 'vscode';
import * as teroshdl2 from 'teroshdl2';

// eslint-disable-next-line @typescript-eslint/class-name-casing
const TRIGGER_CHARACTERS = [';', '.', "'", ',', '[', ']', '-', '\n'];

// eslint-disable-next-line @typescript-eslint/class-name-casing
export class Shutter_mode_manager {
    private manager: Multi_project_manager;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, _output_channel: Output_channel_lib.Output_channel,
        manager: Multi_project_manager) {

        this.manager = manager;

        context.subscriptions.push(this.get_shutter_mode(teroshdl2.common.general.HDL_LANG.VHDL));
        context.subscriptions.push(this.get_shutter_mode(teroshdl2.common.general.HDL_LANG.VERILOG));
        context.subscriptions.push(this.get_shutter_mode(teroshdl2.common.general.HDL_LANG.SYSTEMVERILOG));
    }

    private is_enable(): boolean {
        const is_enable = this.manager.get_config_manager().get_config().editor.general.continue_comment;
        return is_enable;
    }

    private get_shutter_mode(lang: teroshdl2.common.general.HDL_LANG) {
        let shutter;

        if (this.is_enable() === false) {
            return [];
        }

        if (lang === teroshdl2.common.general.HDL_LANG.VHDL) {
            shutter = languages.registerOnTypeFormattingEditProvider(
                { scheme: '*', language: lang },
                {
                    provideOnTypeFormattingEdits(
                        document: TextDocument,
                        position: Position,
                        ch: string
                    ): ProviderResult<TextEdit[]> {
                        let linePrefix = document.lineAt(position).text.substr(0, position.character);
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
                TRIGGER_CHARACTERS[0],
                ...TRIGGER_CHARACTERS.slice(1)
            );
        }
        else {
            shutter = languages.registerOnTypeFormattingEditProvider(
                { scheme: '*', language: lang },
                {
                    provideOnTypeFormattingEdits(
                        document: TextDocument,
                        position: Position,
                        ch: string
                    ): ProviderResult<TextEdit[]> {
                        let linePrefix = document.lineAt(position).text.substr(0, position.character);
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
                TRIGGER_CHARACTERS[0],
                ...TRIGGER_CHARACTERS.slice(1)
            );
        }
        return shutter;
    }
}