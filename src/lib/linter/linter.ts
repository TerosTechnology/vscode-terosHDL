/* eslint-disable @typescript-eslint/class-name-casing */
// import { Disposable, workspace, TextDocument, window, QuickPickItem, ProgressLocation} from "vscode";
import * as jsteros from 'jsteros';
import * as vscode from 'vscode';
import * as vsg_action_provider from './vsg_action_provider';

export default class Lint_manager {
    private subscriptions: vscode.Disposable[] | undefined;
    private uri_collections: vscode.Uri[] = [];
    private linter;
    private linter_type: string = "";
    private linter_name: string | undefined;
    private linter_enable;
    //Configuration
    private linter_path: string = "";
    private linter_arguments: string = "";
    private enable_custom_exec: boolean = false;
    private custom_exec: string = "";

    // private linter_options : {'custom_bin' : string | undefined,
    //                           'custom_arguments' : string | undefined,
    //                           'custom_path' : string | undefined};
    private lang: string;
    protected diagnostic_collection: vscode.DiagnosticCollection;

    constructor(language: string, linter_type: string, context: vscode.ExtensionContext) {
        this.lang = language;
        this.linter_type = linter_type;
        this.diagnostic_collection = vscode.languages.createDiagnosticCollection();
        vscode.workspace.onDidOpenTextDocument(this.lint, this, this.subscriptions);
        vscode.workspace.onDidSaveTextDocument(this.lint, this, this.subscriptions);
        vscode.workspace.onDidCloseTextDocument(this.remove_file_diagnostics, this, this.subscriptions);

        vscode.workspace.onDidChangeConfiguration(this.config_linter, this, this.subscriptions);
        this.config_linter();
        this.lint(<vscode.TextDocument>vscode.window.activeTextEditor?.document);

        if (language === "vhdl" && linter_type === "linter_style") {
            context.subscriptions.push(
                vscode.languages.registerCodeActionsProvider('vhdl', new vsg_action_provider.Vsg_action_provider(), {
                    providedCodeActionKinds: vsg_action_provider.Vsg_action_provider.providedCodeActionKinds
                })
            );
        }
    }

    config_linter() {
        //todo: use doc!! .git error
        let normalized_lang = this.lang;
        if (this.lang === "systemverilog") {
            normalized_lang = "verilog";
        }
        let linter_name: string;
        linter_name = <string>vscode.workspace.getConfiguration(`teroshdl.${this.linter_type}.` + normalized_lang).get("linter.a");
        linter_name = linter_name.toLowerCase();
        this.linter_name = linter_name;

        if (this.linter_type === "linter") {
            //Enable custom binary exec
            let custom_call_enable = <boolean>vscode.workspace.getConfiguration(
                `teroshdl.${this.linter_type}.` + normalized_lang + ".linter." + linter_name + ".xcall").get("enable");
            let custom_call_bin = <string>vscode.workspace.getConfiguration(
                `teroshdl.${this.linter_type}.` + normalized_lang + ".linter." + linter_name + ".xcall").get("bin");
            this.custom_exec = custom_call_bin;
            this.enable_custom_exec = custom_call_enable;
            //Custom linter path
            let linter_path = <string>vscode.workspace.getConfiguration(
                `teroshdl.${this.linter_type}.` + normalized_lang + ".linter." + linter_name).get("path");
            this.linter_path = linter_path;
            //Custom arguments
            let linter_arguments = <string>vscode.workspace.getConfiguration(
                `teroshdl.${this.linter_type}.` + normalized_lang + ".linter." + linter_name).get("arguments");
            this.linter_arguments = linter_arguments;
        }
        this.linter_enable = true;
        if (linter_name === 'none') {
            this.linter_enable = false;
            this.remove_all();
        }
        if (this.linter_enable === true) {
            this.linter = new jsteros.Linter.Linter(linter_name, this.lang);
            this.refresh_lint();
        }
        else {
            this.linter = undefined;
            return;
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
        for (let i = 0; i < this.uri_collections.length; ++i) {
            // this.remove_file_diagnostics();
            this.lint_from_uri(this.uri_collections[i]);
        }
    }

    get_config() {
        let options;
        if (this.enable_custom_exec === true) {
            options = {
                'custom_bin': this.custom_exec,
                'custom_arguments': this.linter_arguments
            };
        }
        else if (this.linter_path !== "") {
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

    async lint(doc: vscode.TextDocument) {
        //todo: use doc!! .git error check sheme
        // if (vscode.window.activeTextEditor === undefined){
        //     return;
        // }
        // let document = vscode.window.activeTextEditor.document;
        if (doc === undefined) {
            return;
        }
        let language_id: string = doc.languageId;
        if (this.linter === undefined || (language_id !== this.lang)) {
            return;
        }
        // let current_path = vscode.window.activeTextEditor?.document.uri.fsPath;
        let current_path = doc.uri.fsPath;
        //Save the uri linted
        this.add_uri_to_collections(doc.uri);

        console.log(`[terosHDL] Linting ${current_path}`);
        let errors = await this.linter.lint_from_file(current_path, this.get_config());
        let diagnostics: vscode.Diagnostic[] = [];
        for (var i = 0; i < errors.length; ++i) {
            const line = errors[i]['location']['position'][0];
            let col = errors[i]['location']['position'][1];
            let code = "";
            if (errors[i].code !== undefined) {
                code = errors[i].code;
            }
            else {
                code = errors[i].severity;
            }
            diagnostics.push({
                severity: this.get_severity(errors[i]['severity']),
                range: new vscode.Range((+line), (+col), (+line), Number.MAX_VALUE),
                message: errors[i]['description'],
                code: code,
                source: `TerosHDL:${this.linter_name}`
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

        let errors = await this.linter.lint_from_file(current_path, this.get_config());
        let diagnostics: vscode.Diagnostic[] = [];
        if (empty === true) {
            this.diagnostic_collection.set(uri, diagnostics);
            return;
        }

        for (var i = 0; i < errors.length; ++i) {
            const line = errors[i]['location']['position'][0];
            let col = errors[i]['location']['position'][1];
            let code = "";
            if (errors[i].code !== undefined) {
                code = errors[i].code;
            }
            else {
                code = errors[i].severity;
            }
            diagnostics.push({
                severity: this.get_severity(errors[i]['severity']),
                range: new vscode.Range((+line), (+col), (+line), Number.MAX_VALUE),
                message: errors[i]['description'],
                code: code,
                source: `TerosHDL:${this.linter_name}`
            });
        }
        this.diagnostic_collection.set(uri, diagnostics);
    }

}