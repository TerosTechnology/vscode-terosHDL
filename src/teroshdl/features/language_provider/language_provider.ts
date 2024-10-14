// Copyright 2020 Teros Technology
//
// Carlos Alberto Ruiz Naranjo
//
// This file is part of Teros Technology.
//
// Teros Technology is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Teros Technology is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Teros Technology.  If not, see <https://www.gnu.org/licenses/>.

import VerilogDocumentSymbolProvider from './ctags/providers/DocumentSymbolProvider';
import VerilogHoverProvider from './ctags/providers/HoverProvider';
import VerilogDefinitionProvider from './ctags/providers/DefinitionProvider';
import VerilogCompletionItemProvider from './ctags/providers/CompletionItemProvider';
import { CtagsManager } from './ctags/ctags';
import { Logger } from './ctags/Logger';

import * as vscode from 'vscode';
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as rusthdl_lib from './lsp/rust_hdl';
import * as utils from '../utils/utils';

export type e_provider = {
    completion: any;
    doc: any;
    hover: any;
    def: any;
};
export class LanguageProviderManager {
    private manager: Multi_project_manager;
    private ctagsManager: CtagsManager | undefined;

    private provider_list: e_provider;
    private context: vscode.ExtensionContext;

    private rusthdl: rusthdl_lib.Rusthdl_lsp | undefined;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: Multi_project_manager) {
        this.context = context;
        this.manager = manager;

        // Configure ctags
        const logger: Logger = new Logger();

        this.ctagsManager = new CtagsManager(logger, this.context);
        this.ctagsManager.configure();

        const comp_item_provider = new VerilogCompletionItemProvider(logger);
        const doc_provider = new VerilogDocumentSymbolProvider(logger, this.context);
        const hover_provider = new VerilogHoverProvider(logger);
        const def_provider = new VerilogDefinitionProvider(logger);

        const provider_list: e_provider = {
            completion: comp_item_provider,
            doc: doc_provider,
            hover: hover_provider,
            def: def_provider
        };
        this.provider_list = provider_list;
    }

    public async configure() {
        // VHDL
        this.configure_vhdl();

        // Verilog/SV
        this.configure_verilog();

        // TCL
        this.configure_tcl();

        this.context.subscriptions.push(
            vscode.workspace.onDidSaveTextDocument((doc) => {
                this.provider_list.doc.onSave(doc);
            })
        );
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // TCL
    /////////////////////////////////////////////////////////////////////////////////////////
    private configure_tcl() {
        const tcl_selector: vscode.DocumentSelector = { scheme: 'file', language: 'tcl' };
        this.context.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(tcl_selector, this.provider_list.completion, '.', '(', '=')
        );
        this.context.subscriptions.push(
            vscode.languages.registerDocumentSymbolProvider(tcl_selector, this.provider_list.doc)
        );
        this.context.subscriptions.push(vscode.languages.registerHoverProvider(tcl_selector, this.provider_list.doc));
        this.context.subscriptions.push(
            vscode.languages.registerDefinitionProvider(tcl_selector, this.provider_list.doc)
        );
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // VHDL
    /////////////////////////////////////////////////////////////////////////////////////////
    private async configure_vhdl() {
        const vhdlSelector: vscode.DocumentSelector = { scheme: 'file', language: 'vhdl' };
        this.context.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(vhdlSelector, this.provider_list.completion, '.', '(', '=')
        );
        // Symbol provider
        this.context.subscriptions.push(
            vscode.languages.registerDocumentSymbolProvider(vhdlSelector, this.provider_list.doc)
        );

        // Language server
        let is_alive = false;

        const config = utils.getConfig(this.manager);

        const enable_vhdl_provider = config.general.general.go_to_definition_vhdl;
        if (enable_vhdl_provider === true) {
            this.rusthdl = new rusthdl_lib.Rusthdl_lsp(this.context, this.manager);
            is_alive = await this.rusthdl.run_rusthdl();
        } else {
            this.context.subscriptions.push(vscode.commands.registerCommand('teroshdl.vhdlls.restart', async () => {}));
        }

        if (is_alive === false && enable_vhdl_provider === true) {
            this.context.subscriptions.push(
                vscode.languages.registerHoverProvider(vhdlSelector, this.provider_list.hover)
            );
            this.context.subscriptions.push(
                vscode.languages.registerDefinitionProvider(vhdlSelector, this.provider_list.def)
            );
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////
    // Verilog
    /////////////////////////////////////////////////////////////////////////////////////////
    private configure_verilog() {
        let verilogSelector: vscode.DocumentSelector = [
            { scheme: 'file', language: 'verilog' },
            { scheme: 'file', language: 'systemverilog' }
        ];
        // Completion
        this.context.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                verilogSelector,
                this.provider_list.completion,
                '.',
                '(',
                '='
            )
        );
        // Symbol
        this.context.subscriptions.push(
            vscode.languages.registerDocumentSymbolProvider(verilogSelector, this.provider_list.doc)
        );

        const config = utils.getConfig(this.manager);
        const enable_verilog_provider = config.general.general.go_to_definition_verilog;
        if (enable_verilog_provider === true) {
            this.context.subscriptions.push(
                vscode.languages.registerHoverProvider(verilogSelector, this.provider_list.hover)
            );
            this.context.subscriptions.push(
                vscode.languages.registerDefinitionProvider(verilogSelector, this.provider_list.def)
            );
        }
    }

    public async deactivate() {
        if (this.rusthdl !== undefined) {
            await this.rusthdl.deactivate();
        }
    }
}
