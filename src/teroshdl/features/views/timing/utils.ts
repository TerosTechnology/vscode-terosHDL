// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of TerosHDL
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import * as vscode from 'vscode';
import { get_icon } from '../../tree_views/utils';
import { t_timing_node, t_timing_path } from 'colibri/project_manager/common';
import { check_if_path_exist } from 'colibri/utils/file_utils';

export function deleteDecorators(decoratorList: vscode.TextEditorDecorationType[]): void {
    for (const decorator of decoratorList) {
        decorator.dispose();
    }
}

export function createDecoratorList(editor: vscode.TextEditor | undefined,
    timmingReport: t_timing_path[],
    decoratorList: vscode.TextEditorDecorationType[], pathSelectionList: number[]): void {

    try {
        if (editor === undefined) {
            editor = vscode.window.activeTextEditor;
        }
        if (editor === undefined) {
            return;
        }

        const filePath = editor.document.fileName;

        const lineRegistry: number[] = [];
        for (const timingPath of timmingReport) {
            const isRed = timingPath.slack < 0;
            const slackMsgBase = `Path ${timingPath.index},slack=${timingPath.slack.toFixed(3)}ns`;

            const nodeList = timingPath.nodeList;
            if (nodeList.length > 0) {
                let timingNode = nodeList[0];
                // Set from
                if (timingNode.path === filePath && pathSelectionList.includes(timingPath.index)) {
                    const slackMsg = slackMsgBase + "[from]";
                    setDecoration(editor, timingNode.line - 1, slackMsg,
                        !lineRegistry.includes(timingNode.line), isRed, decoratorList, false);
                    // Prevent create multiple decorators in the same place
                    lineRegistry.push(timingNode.line);
                }

                // Set to
                if (timingNode.path === filePath && pathSelectionList.includes(timingPath.index)) {
                    const slackMsg = slackMsgBase + "[to]";
                    timingNode = nodeList[nodeList.length - 1];
                    setDecoration(editor, timingNode.line - 1, slackMsg,
                        !lineRegistry.includes(timingNode.line), isRed, decoratorList, false);

                    // Prevent create multiple decorators in the same place
                    lineRegistry.push(timingNode.line);
                }
            }
        }
    }
    catch (error) {
    }
}

export function createNodeDecoratorList(editor: vscode.TextEditor | undefined,
    timingNodeList: t_timing_node[],
    slack: number,
    decoratorList: vscode.TextEditorDecorationType[], pathSelectionList: number[]): void {

    try {
        if (editor === undefined) {
            editor = vscode.window.activeTextEditor;
        }
        if (editor === undefined) {
            return;
        }

        const filePath = editor.document.fileName;

        const lineRegistry: number[] = [];
        for (const timingNode of timingNodeList) {
            const isRed = slack < 0;
            const slackMs = `Node ${timingNode.index}[incr.delay=${timingNode.incremental_delay.toFixed(3)}ns]`;

            if (timingNode.path === filePath && pathSelectionList.includes(timingNode.index)) {
                setDecoration(editor, timingNode.line - 1, slackMs,
                    !lineRegistry.includes(timingNode.line), isRed, decoratorList, true);
                // Prevent create multiple decorators in the same place
                lineRegistry.push(timingNode.line);
            }
        }
    }
    catch (error) {
    }
}

export function setDecoration(editor: vscode.TextEditor, line: number, slackMsg: string, setBackground: boolean, isRed: boolean,
    decoratorList: vscode.TextEditorDecorationType[], lowMode: boolean): void {

    // const message = new vscode.MarkdownString(
    //     `Incremental delay: *s**`,
    //     true,
    // );

    const range = new vscode.Range(line, 0, line, editor.document.lineAt(line).text.length);
    const decorationOptions = {
        range: range,
        // hoverMessage: message
    };

    let icon = get_icon("clock").dark;
    const currentTheme = vscode.window.activeColorTheme;
    if (currentTheme.kind === vscode.ColorThemeKind.Dark) {
        icon = get_icon("clock").dark;
    } else if (currentTheme.kind === vscode.ColorThemeKind.Light) {
        icon = get_icon("clock").light;
    } else {
        icon = get_icon("clock").dark;
    }

    let decoratorOptions = {
        backgroundColor: '',
        isWholeLine: true,
        gutterIconPath: icon,
        gutterIconSize: 'contain',
        after: {
            contentText: slackMsg,
            margin: '0 0 0 3em',
            // color: 'rgba(255, 0, 0, 0.8)',
            fontWeight: 'bold',
        }
    };

    if (setBackground) {
        if (isRed) {
            let redColor = 255;
            if (lowMode) {
                redColor = redColor / 2;
            }
            decoratorOptions.backgroundColor = `rgba(${redColor}, 0, 0, 0.3)`;
        }
        else {
            let greenColor = 255;
            if (lowMode) {
                greenColor = greenColor / 2;
            }
            decoratorOptions.backgroundColor = `rgba(0, ${greenColor}, 0, 0.3)`;
        }
    }

    const decorationType = vscode.window.createTextEditorDecorationType(decoratorOptions);
    decoratorList.push(decorationType);
    editor.setDecorations(decorationType, [decorationOptions]);
}

/**
 * Open a file at a specific line
 * @param filePath Path to the file
 * @param lineNumber Line number
 * @param columnNumber Column number
 */
export async function openFileAtLine(filePath: string, lineNumber: number, columnNumber: number): Promise<void> {
    if (!check_if_path_exist(filePath)) {
        vscode.window.showWarningMessage(`File ${filePath} does not exist`);
        return;
    }

    const uri = vscode.Uri.file(filePath);
    const position = new vscode.Position(lineNumber - 1, columnNumber);
    const range = new vscode.Range(position, position);

    try {
        await vscode.window.showTextDocument(uri, {
            selection: range,
            viewColumn: vscode.ViewColumn.One
        });
    }
    catch (error: any) {
        const errorMsg = error.message;
        let msg = errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1);
        if (errorMsg.includes("binary")) {
            msg = "The file is encrypted, so it cannot be opened"
        }

        vscode.window.showWarningMessage(msg);
    }
}