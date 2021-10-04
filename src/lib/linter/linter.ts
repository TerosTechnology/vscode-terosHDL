/* eslint-disable @typescript-eslint/class-name-casing */
// import { Disposable, workspace, TextDocument, window, QuickPickItem, ProgressLocation} from "vscode";
import * as vscode from 'vscode';
import * as vsg_action_provider from './vsg_action_provider';
import * as config_reader_lib from "../utils/config_reader";

export default class Lint_manager {
    private init: boolean = false;
    private subscriptions: vscode.Disposable[] | undefined;
    private uri_collections: vscode.Uri[] = [];
    private linter_type: string = "";
    private linter_name: string | undefined;
    private linter_enable;
    //Configuration
    private linter_path: string = "";
    private linter_arguments: string = "";
    private config_reader: config_reader_lib.Config_reader;

    private lang: string;
    protected diagnostic_collection: vscode.DiagnosticCollection;

    constructor(language: string, linter_type: string, context: vscode.ExtensionContext, config_reader) {
        this.config_reader = config_reader;
        this.lang = language;
        this.linter_type = linter_type;
        this.diagnostic_collection = vscode.languages.createDiagnosticCollection();

        this.set_config_linter();

        vscode.commands.registerCommand(`teroshdl.linter.${linter_type}.${language}.set_config`, () => this.config_linter());
        if (language === "vhdl" && linter_type === "linter_style") {
            context.subscriptions.push(
                vscode.languages.registerCodeActionsProvider('vhdl', new vsg_action_provider.Vsg_action_provider(), {
                    providedCodeActionKinds: vsg_action_provider.Vsg_action_provider.providedCodeActionKinds
                })
            );
        }
        this.lint_active_document();
    }

    set_config_linter() {
        let normalized_lang = this.lang;
        if (this.lang === "systemverilog") {
            normalized_lang = "verilog";
        }
        let linter_name = this.config_reader.get_linter_name(normalized_lang, this.linter_type).toLowerCase();
        this.linter_name = linter_name;

        if (linter_name !== 'none') {
            let linter_config = this.config_reader.get_linter_config(normalized_lang, this.linter_type);
            let linter_path = linter_config.installation_path;
            this.linter_path = linter_path;
            this.linter_arguments = '';

            let arguments_v;
            if (linter_name === 'xvhdl') {
                arguments_v = linter_config.linter_options_xvhdl;
            }
            else if (linter_name === 'xvlog') {
                arguments_v = linter_config.linter_options_xvlog;
            }
            else {
                arguments_v = linter_config.linter_options;
            }
            if (arguments_v !== undefined) {
                for (let i = 0; i < arguments_v.length; i++) {
                    const element = arguments_v[i];
                    this.linter_arguments += ' ' + element;
                }
            }
        }
        else {
            this.linter_enable = false;
        }
    }

    config_linter() {
        this.set_config_linter();
        if (this.linter_name === 'none') {
            this.linter_enable = false;
            this.refresh_lint();
        }
        else {
            this.refresh_lint();
        }
    }

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

    refresh_lint() {
        try {
            for (let i = 0; i < this.uri_collections.length; ++i) {
                this.lint_from_uri(this.uri_collections[i]);
            }
        }
        catch (e) { console.log(e); }
    }

    get_config() {
        let options;
        if (this.linter_path !== "") {
            options = {
                'custom_path': this.linter_path,
                'custom_arguments': this.linter_arguments
            };
        }
        else {
            options = { 'custom_arguments': this.linter_arguments };
        }
        return options;
    }

    lint_active_document() {
        let open_files = vscode.workspace.textDocuments;

        for (let i = 0; i < open_files.length; i++) {
            const document = open_files[i];
            this.lint(document);
        }
    }

    async lint(doc: vscode.TextDocument) {
        if (this.linter_name === 'none') {
            return;
        }
        if (doc === undefined) {
            return;
        }
        let language_id: string = doc.languageId;
        if (language_id !== this.lang) {
            return;
        }
        let current_path = doc.uri.fsPath;
        if (this.init === false) {
            this.init = true;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        //Save the uri linted
        this.add_uri_to_collections(doc.uri);

        console.log(`[terosHDL] Linting ${current_path}`);
        let errors = await this.get_errors(current_path);

        let diagnostics: vscode.Diagnostic[] = [];
        for (var i = 0; i < errors.length; ++i) {
            const line = errors[i]['location']['position'][0];
            let col = errors[i]['location']['position'][1];
            let code = "";
            if (errors[i]['code'] !== undefined) {
                code = errors[i]['code'];
            }
            else {
                code = errors[i]['severity'];
            }
            diagnostics.push({
                severity: this.get_severity(errors[i]['severity']),
                range: new vscode.Range((+line), (+col), (+line), Number.MAX_VALUE),
                message: errors[i]['description'],
                code: code,
                source: `TerosHDL: ${this.linter_name}`
            });
        }
        this.diagnostic_collection.set(doc.uri, diagnostics);
    }

    get_severity(sev) {
        if (sev === "error") {
            return vscode.DiagnosticSeverity.Error;
        }
        else if (sev === "warning") {
            return vscode.DiagnosticSeverity.Warning;
        }
        else {
            return vscode.DiagnosticSeverity.Error;
        }
    }

    async lint_from_uri(uri: vscode.Uri, empty: boolean = false) {
        let current_path = uri.fsPath;

        let errors = await this.get_errors(current_path);
        let diagnostics: vscode.Diagnostic[] = [];
        if (empty === true) {
            this.diagnostic_collection.set(uri, diagnostics);
            return;
        }

        for (var i = 0; i < errors.length; ++i) {
            const line = errors[i]['location']['position'][0];
            let col = errors[i]['location']['position'][1];
            let code = "";
            if (errors[i]['code'] !== undefined) {
                code = errors[i]['code'];
            }
            else {
                code = errors[i]['severity'];
            }
            diagnostics.push({
                severity: this.get_severity(errors[i]['severity']),
                range: new vscode.Range((+line), (+col), (+line), Number.MAX_VALUE),
                message: errors[i]['description'],
                code: code,
                source: `TerosHDL: ${this.linter_name}`
            });
        }
        this.diagnostic_collection.set(uri, diagnostics);
    }

    async get_errors(current_path) {
        try {
            let errors = [];
            if (this.linter_name !== 'none') {
                const teroshdl = await require('teroshdl');
                let linter = await new teroshdl.Linter.Linter(this.linter_name, this.lang);
                errors = await linter.lint_from_file(current_path, this.get_config(), undefined);
            }
            return errors;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

}