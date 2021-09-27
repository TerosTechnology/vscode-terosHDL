/* eslint-disable @typescript-eslint/class-name-casing */
// import { Disposable, workspace, TextDocument, window, QuickPickItem, ProgressLocation} from "vscode";
import * as vscode from 'vscode';

export default class Vsg_manager {
    private subscriptions: vscode.Disposable[] | undefined;
    private uri_collections: vscode.Uri[] = [];
    private linter;
    private linter_name: string | undefined;
    private linter_enable;
    //Configuration
    private linter_path: string = "";
    private linter_arguments: string = "";
    private enable_custom_exec: boolean = false;
    private custom_exec: string = "";

    private lang: string;
    protected diagnostic_collection: vscode.DiagnosticCollection;

    constructor(language: string) {
        this.lang = language;
        this.diagnostic_collection = vscode.languages.createDiagnosticCollection();
        vscode.workspace.onDidOpenTextDocument(this.lint, this, this.subscriptions);
        vscode.workspace.onDidSaveTextDocument(this.lint, this, this.subscriptions);
        vscode.workspace.onDidCloseTextDocument(this.remove_file_diagnostics, this, this.subscriptions);

        vscode.workspace.onDidChangeConfiguration(this.config_linter, this, this.subscriptions);
        this.config_linter();
        this.lint(<vscode.TextDocument>vscode.window.activeTextEditor?.document);
    }

    config_linter() {
        const teroshdl = require('teroshdl');
        this.linter = new teroshdl.Vsg.Vsg();
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
        if (this.linter === null || (language_id !== this.lang)) {
            return;
        }
        // let current_path = vscode.window.activeTextEditor?.document.uri.fsPath;
        let current_path = doc.uri.fsPath;
        //Save the uri linted
        this.add_uri_to_collections(doc.uri);

        let errors = await this.linter.check_style_from_code(doc.getText());
        let diagnostics: vscode.Diagnostic[] = [];
        for (var i = 0; i < errors.length; ++i) {
            const line = errors[i]['location']['position'][0];
            let col = errors[i]['location']['position'][1];
            if (col === 0) {
                col = 1;
            }
            diagnostics.push({
                severity: vscode.DiagnosticSeverity.Warning,
                range: new vscode.Range((+line), (+col), (+line), Number.MAX_VALUE),
                message: errors[i]['description'],
                code: this.linter_name,
                source: 'TerosHDL'
            });
        }
        this.diagnostic_collection.set(doc.uri, diagnostics);
    }
}