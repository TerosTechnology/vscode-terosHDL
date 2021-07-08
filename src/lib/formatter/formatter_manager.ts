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
import * as config_reader_lib from "../utils/config_reader";

export default class Formatter_manager {
    private lang: string = "";
    private formatter_name: string = "";
    private subscriptions: vscode.Disposable[] | undefined;
    private config_reader : config_reader_lib.Config_reader;

    constructor(language: string, config_reader) {
        this.config_reader = config_reader;
        this.lang = language;
        vscode.commands.registerCommand(`teroshdl.formatter.${language}.set_config`, () => this.config_formatter());
    }

    public async format(code) {
        this.config_formatter();
        const jsteros = require('jsteros');
        let formatter = new jsteros.Formatter.Formatter(this.formatter_name);
        if (formatter !== undefined) {
            if (formatter.update_params !== undefined) {
                formatter.update_params();
            }
            let options = await this.get_options();
            let formatted_code = await formatter.format_from_code(code, options);
            return formatted_code;
        }
        else {
            return code;
        }
    }

    config_formatter() {
        let formatter_name: string;
        formatter_name = this.config_reader.get_formatter_name(this.lang);
        formatter_name = formatter_name.toLowerCase();
        this.formatter_name = formatter_name;
    }

    async get_options() {
        let configuration = this.config_reader.get_formatter_config();

        let options;
        if (this.formatter_name === "vsg") {
        }
        else if (this.formatter_name === "standalone") {
            options = { 'settings': this.get_standalone_vhdl_config() };
        }
        else if (this.formatter_name === "verible") {
        }
        else if (this.formatter_name === "istyle") {
            let style = configuration.istyle_style;
            options = { 'style': this.get_istyle_style(), 'extra_args': this.get_istyle_extra_args() };
        }
        else if (this.formatter_name === "s3sv") {
            let python = await this.get_python_path();
            options = {
                "python3_path": python,
                "use_tabs": configuration.s3sv_use_tabs,
                "indent_size": configuration.s3sv_indentation_size,
                "one_bind_per_line": configuration.s3sv_one_bind_per_line,
                "one_decl_per_line": configuration.s3sv_one_declaration_per_line
            };
        }
        return options;
    }
    async get_python_path() {
        let python_path = this.config_reader.get_config_python_path();
        const jsteros = require('jsteros');
        let python = await jsteros.Nopy.get_python_exec(python_path);
        return python;
    }

    get_istyle_style() {
        let configuration = this.config_reader.get_formatter_config();
        const style_map: { [style: string]: string } = {
            "indent_only": "",
            "kernighan&ritchie": "kr",
            "gnu": "gnu",
            "ansi": "ansi"
        };
        let style = configuration.istyle_style;
        const map_style = style_map[style];
        if (map_style === '') {
            return '';
        }
        else if (map_style === undefined) {
            return "--style=ansi";
        } else {
            return `--style=${map_style}`;
        }
    }
    
    get_istyle_extra_args() {
        let extra_args = "";
        let configuration = this.config_reader.get_formatter_config();
        let number_of_spaces = configuration.istyle_indentation_size;
        extra_args = "-s" + number_of_spaces + " ";
        return extra_args;
    }
    
    get_standalone_vhdl_config() {
        let configuration = this.config_reader.get_formatter_config();
        let settings = {
            "RemoveComments": false,
            "RemoveAsserts": false,
            "CheckAlias": false,
            "AlignComments": configuration.vhdl_standalone_align_comments,
            "SignAlignSettings": {
                "isRegional": configuration.vhdl_standalone_align_generic_port,
                "isAll": configuration.vhdl_standalone_align_generic_port,
                "mode": 'local',
                "keyWords": [
                    "FUNCTION",
                    "IMPURE FUNCTION",
                    "GENERIC",
                    "PORT",
                    "PROCEDURE"
                ]
            },
            "KeywordCase": configuration.vhdl_standalone_keyword_case,
            "TypeNameCase": configuration.vhdl_standalone_name_case,
            "Indentation": configuration.vhdl_standalone_indentation,
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