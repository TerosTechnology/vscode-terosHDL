// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
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
import { Multi_project_manager } from '../../colibri/project_manager/multi_project_manager';
import * as utils from './utils/utils';
import { LANGUAGE } from '../../colibri/common/general';
import * as linterManager from '../../colibri/linter/linter';
import { l_options, LINTER_ERROR_SEVERITY } from '../../colibri/linter/common';
import { e_linter_general_linter_verilog, e_linter_general_linter_vhdl, e_linter_general_lstyle_verilog, e_linter_general_lstyle_vhdl } from '../../colibri/config/config_declaration';
import { get_language_from_extension } from '../../colibri/utils/file_utils';

enum LINTER_MODE {
    STYLE = "style",
    ERRORS = "errors",
}

class Linter {
    protected diagnostic_collection = vscode.languages.createDiagnosticCollection();
    private uri_collections: vscode.Uri[] = [];

    public mode: LINTER_MODE;
    private manager: Multi_project_manager;
    public lang: LANGUAGE;
    public linter = new linterManager.Linter();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(mode: LINTER_MODE, lang: LANGUAGE, manager: Multi_project_manager) {
        this.manager = manager;
        this.mode = mode;
        this.lang = lang;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Configuration
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public get_linter_name() {
        const config = utils.getConfig(this.manager);
        if (this.lang === LANGUAGE.VHDL && this.mode === LINTER_MODE.ERRORS) {
            return config.linter.general.linter_vhdl;
        }
        else if ((this.lang === LANGUAGE.VERILOG
            || this.lang === LANGUAGE.SYSTEMVERILOG)
            && this.mode === LINTER_MODE.ERRORS) {
            return config.linter.general.linter_verilog;
        }
        else if (this.lang === LANGUAGE.VHDL && this.mode === LINTER_MODE.STYLE) {
            return config.linter.general.lstyle_vhdl;
        }
        else {
            return config.linter.general.lstyle_verilog;
        }
    }

    public get_options(lang: LANGUAGE): l_options {
        let path = "";
        let argument = "";
        const linter_name = this.get_linter_name();
        const config = utils.getConfig(this.manager);

        if (linter_name === e_linter_general_linter_vhdl.ghdl){
            path = config.tools.ghdl.installation_path;
            argument = config.linter.ghdl.arguments;
        }
        else if (linter_name === e_linter_general_linter_vhdl.modelsim &&
                lang === LANGUAGE.VHDL){
            path = config.tools.modelsim.installation_path;
            argument = config.linter.modelsim.vhdl_arguments;
        }
        else if (linter_name === e_linter_general_linter_vhdl.vivado &&
                lang === LANGUAGE.VHDL){
            path = config.tools.vivado.installation_path;
            argument = config.linter.vivado.vhdl_arguments;
        }
        else if (linter_name === e_linter_general_linter_verilog.icarus){
            path = config.tools.icarus.installation_path;
            argument = config.linter.icarus.arguments;
        }
        else if (linter_name === e_linter_general_linter_verilog.modelsim &&
                lang !== LANGUAGE.VHDL){
            path = config.tools.modelsim.installation_path;
            argument = config.linter.modelsim.verilog_arguments;
        }
        else if (linter_name === e_linter_general_linter_verilog.verilator){
            path = config.tools.verilator.installation_path;
            argument = config.linter.verilator.arguments;
        }
        else if (linter_name === e_linter_general_linter_verilog.vivado &&
                lang !== LANGUAGE.VHDL){
            path = config.tools.vivado.installation_path;
            argument = config.linter.vivado.verilog_arguments;
        }
        else if (linter_name === e_linter_general_lstyle_vhdl.vsg){
            argument = config.linter.vsg.arguments;
        }
        else if (linter_name === e_linter_general_lstyle_verilog.verible){
            path = config.tools.verible.installation_path;
            argument = config.linter.verible.arguments;
        }

        const options: l_options = {
            path: path,
            argument: argument
        };
        return options;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Lint
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    refresh_lint() {
        try {
            for (let i = 0; i < this.uri_collections.length; ++i) {
                this.lint_from_uri(this.uri_collections[i]);
            }
        }
        catch (e) { console.log(e); }
    }

    public check_lang(document_lang:LANGUAGE) :boolean{
        if (document_lang === this.lang){
            return true;
        }
        else if(document_lang === LANGUAGE.SYSTEMVERILOG 
            && this.lang === LANGUAGE.VERILOG){
            return true;
        }
        return false;
    }

    public async lint(doc: vscode.TextDocument) {
        const linter_name = this.get_linter_name();

        if (linter_name === 'none' || linter_name === 'disabled') {
            return;
        }
        if (doc === undefined) {
            return;
        }

        const lang = utils.get_document_lang(doc);
        if (this.check_lang(lang) === false) {
            return;
        }
        let current_path = doc.uri.fsPath;
        
        //Save the uri linted
        this.add_uri_to_collections(doc.uri);

        console.log(`[terosHDL] Linting ${current_path}`);

        let errors = await this.linter.lint_from_file(linter_name, current_path, this.get_options(lang),);

        let diagnostics: vscode.Diagnostic[] = [];
        for (var i = 0; i < errors.length; ++i) {
            const line = errors[i].location.position[0];
            let col = errors[i].location.position[1];
            let code = "";
            if (errors[i].code !== undefined) {
                code = errors[i].code;
            }
            else {
                code = errors[i].severity;
            }
            diagnostics.push({
                severity: this.get_severity(errors[i].severity),
                range: new vscode.Range((+line), (+col), (+line), Number.MAX_VALUE),
                message: errors[i]['description'],
                code: code,
                source: `TerosHDL: ${linter_name}`
            });
        }
        this.diagnostic_collection.set(doc.uri, diagnostics);
    }

    async lint_from_uri(uri: vscode.Uri, empty: boolean = false) {
        let current_path = uri.fsPath;
        const linter_name = this.get_linter_name();

        const lang = get_language_from_extension(current_path);

        let errors = await this.linter.lint_from_file(linter_name, current_path, this.get_options(lang));
        let diagnostics: vscode.Diagnostic[] = [];
        if (empty === true 
            || linter_name === e_linter_general_linter_vhdl.none
            || linter_name === e_linter_general_linter_vhdl.disabled
        ) {
            this.diagnostic_collection.set(uri, diagnostics);
            return;
        }

        for (var i = 0; i < errors.length; ++i) {
            const line = errors[i].location.position[0];
            let col = errors[i].location.position[1];
            let code = "";
            if (errors[i].code !== undefined) {
                code = errors[i].code;
            }
            else {
                code = errors[i].severity;
            }
            diagnostics.push({
                severity: this.get_severity(errors[i].severity),
                range: new vscode.Range((+line), (+col), (+line), Number.MAX_VALUE),
                message: errors[i]['description'],
                code: code,
                source: `TerosHDL: ${linter_name}`
            });
        }
        this.diagnostic_collection.set(uri, diagnostics);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Severity
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    get_severity(sev) {
        if (sev === LINTER_ERROR_SEVERITY.ERROR) {
            return vscode.DiagnosticSeverity.Error;
        }
        else if (sev === LINTER_ERROR_SEVERITY.WARNING) {
            return vscode.DiagnosticSeverity.Warning;
        }
        else if (sev === LINTER_ERROR_SEVERITY.INFO) {
            return vscode.DiagnosticSeverity.Information;
        }
        else {
            return vscode.DiagnosticSeverity.Error;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Diagnostics files
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public remove_file_diagnostics(doc: vscode.TextDocument) {
        this.diagnostic_collection.delete(doc.uri);
        for (let i = 0; i < this.uri_collections.length; ++i) {
            if (doc.uri === this.uri_collections[i]) {
                this.uri_collections.splice(i, 1);
                break;
            }
        }
    }

    add_uri_to_collections(uri: vscode.Uri) {
        for (let i = 0; i < this.uri_collections.length; ++i) {
            if (uri === this.uri_collections[i]) {
                return;
            }
        }
        this.uri_collections.push(uri);
    }

    remove_all() {
        for (let i = 0; i < this.uri_collections.length; ++i) {
            this.lint_from_uri(this.uri_collections[i], true);
        }
    }
}

export class Linter_manager {
    protected manager: Multi_project_manager;
    private linter_list: Linter[] = [];
    public vhdlErrorLinter: Linter;
    public verilogErrorLinter: Linter;
    public vhdlStyleLinter: Linter;
    public verilogStyleLinter: Linter;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager) {

        this.manager = manager;

        vscode.commands.registerCommand(`teroshdl.linter.refresh`, () => this.refresh_lint());
        vscode.commands.registerCommand(`teroshdl.config.change_config`, () => this.refresh_lint());

        vscode.workspace.onDidOpenTextDocument((e) => this.lint(e));
        vscode.workspace.onDidSaveTextDocument((e) => this.lint(e));
        vscode.workspace.onDidCloseTextDocument((e) => this.remove_file_diagnostics(e));

        this.vhdlErrorLinter = new Linter(LINTER_MODE.ERRORS, LANGUAGE.VHDL, manager);
        this.verilogErrorLinter = new Linter(LINTER_MODE.ERRORS, LANGUAGE.VERILOG, manager);
        this.vhdlStyleLinter = new Linter(LINTER_MODE.STYLE, LANGUAGE.VHDL, manager);
        this.verilogStyleLinter = new Linter(LINTER_MODE.STYLE, LANGUAGE.VERILOG, manager);

        this.linter_list.push(this.vhdlErrorLinter);
        this.linter_list.push(this.verilogErrorLinter);
        this.linter_list.push(this.vhdlStyleLinter);
        this.linter_list.push(this.verilogStyleLinter);

        this.lint_active_document();

        // this.linter_list.forEach(linter_inst => {
        //     linter_inst.refresh_lint();
        // });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Diagnostics files
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private remove_file_diagnostics(doc: vscode.TextDocument) {
        this.linter_list.forEach(linter => {
            linter.remove_file_diagnostics(doc);
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Lint
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async lint(doc: vscode.TextDocument) {
        this.linter_list.forEach(linter => {
            linter.lint(doc);
        }); 
    }

    async refresh_lint() {
        this.linter_list.forEach(linter => {
            linter.refresh_lint();
        }); 
    }

    lint_active_document() {
        let open_files = vscode.workspace.textDocuments;

        for (let i = 0; i < open_files.length; i++) {
            const document = open_files[i];
            this.lint(document);
        }
    }
}
