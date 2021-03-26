// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
// Julien Faucher
//
// This file is part of Colibri.
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
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.


/* eslint-disable @typescript-eslint/class-name-casing */
import * as vscode from 'vscode';

export default class Formatter_manager {
    private lang: string = "";
    private formatter_name: string = "";
    private subscriptions: vscode.Disposable[] | undefined;

    constructor(language: string) {
        this.lang = language;
        vscode.workspace.onDidChangeConfiguration(this.config_formatter, this, this.subscriptions);
    }

    public async format(code) {
        this.config_formatter();
        const jsteros = require('jsteros');
        let formatter = new jsteros.Formatter.Formatter(this.formatter_name);
        if (formatter !== undefined) {
            if (formatter.update_params !== undefined ) {
                formatter.update_params();
            }
            let options = this.get_options();
            let formatted_code = await formatter.format_from_code(code, options);
            return formatted_code;
        }
        else {
            return code;
        }
    }

    config_formatter() {
        let formatter_name: string;
        formatter_name = <string>vscode.workspace.getConfiguration(`teroshdl.formatter.${this.lang}`).get("engine");
        formatter_name = formatter_name.toLowerCase();
        this.formatter_name = formatter_name;
    }

    get_options() {
        let options;
        if (this.formatter_name === "vsg") {
        }
        else if (this.formatter_name === "standalone") {
            options = { 'settings': get_standalone_vhdl_config() };
        }
        else if (this.formatter_name === "verible") {
        }
        else if (this.formatter_name === "istyle") {
            let style = <string>vscode.workspace
                .getConfiguration("teroshdl.formatter.verilog.istyle").get("style");
            options = { 'style': get_istyle_style(), 'extra_args': get_istyle_extra_args() };
        }
        else if (this.formatter_name === "s3sv") {

        }
        return options;
    }
}

function get_istyle_style() {
    const style_map: { [style: string]: string } = {
        "Indent only": "",
        "Kernighan&Ritchie": "kr",
        "GNU": "gnu",
        "ANSI": "ansi"
    };
    let style = <string>vscode.workspace.getConfiguration("teroshdl.formatter.verilog.istyle").get("style");
    const map_style = style_map[style];
    if (map_style !== undefined) {
        return "--style=ansi";
    } else {
        return map_style;
    }
}

function get_istyle_extra_args() {
    let extra_args = "";
    let number_of_spaces = <integer>vscode.workspace.getConfiguration("teroshdl.formatter.verilog").get("indentSize");
    extra_args = "-s" + number_of_spaces + " ";
    return extra_args;
}

function get_standalone_vhdl_config() {
    let configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('teroshdl.formatter.vhdl.type.standalone');
    let settings = {
        "RemoveComments": false,
        "RemoveAsserts": false,
        "CheckAlias": false,
        "AlignComments": configuration.get('align-comments'),
        "SignAlignSettings": {
            "isRegional": true,
            "isAll": true,
            "mode": 'local',
            "keyWords": [
                "FUNCTION",
                "IMPURE FUNCTION",
                "GENERIC",
                "PORT",
                "PROCEDURE"
            ]
        },
        "KeywordCase": configuration.get('keyword-case'),
        "TypeNameCase": configuration.get('type-name-case'),
        "Indentation": configuration.get('indentation'),
        "NewLineSettings": {
            "newLineAfter": [
                ";",
                "then"
            ],
            "noNewLineAfter": []
        },
        "EndOfLine": "\n"
    };
    return settings;
}

export const getDocumentRange = (document: vscode.TextDocument): vscode.Range => {
    const lastLineId = document.lineCount - 1;
    return new vscode.Range(
        0,
        0,
        lastLineId,
        document.lineAt(lastLineId).text.length
    );
};