// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of teroshdl
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
import * as opn from 'open';
import * as vscode from 'vscode';
import * as shelljs from 'shelljs';
import {Base_webview} from './web';

export function open_file(args: vscode.Uri){
    opn(`${'file://'}${args.fsPath}`);
}

export function open_waveform(args: vscode.Uri){
    const file_path = args.fsPath;
    let command = `gtkwave ${file_path}`;
    shelljs.exec(command, { async: true });
}

export function open_webview(args: string, webview: Base_webview){
    webview.create_webview(args)
}