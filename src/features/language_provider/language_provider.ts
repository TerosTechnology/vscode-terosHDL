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

import VerilogDocumentSymbolProvider from "./ctags/providers/DocumentSymbolProvider";
import VerilogHoverProvider from "./ctags/providers/HoverProvider";
import VerilogDefinitionProvider from "./ctags/providers/DefinitionProvider";
import VerilogCompletionItemProvider from "./ctags/providers/CompletionItemProvider";
import { CtagsManager } from "./ctags/ctags";
import { Logger } from "./ctags/Logger";

import * as vscode from 'vscode';
import { Multi_project_manager } from 'teroshdl2/out/project_manager/multi_project_manager';
import * as Output_channel_lib from '../../utils/output_channel';
import * as utils from '../../utils/utils';

export class Language_provider_manager {
    private output_channel: Output_channel_lib.Output_channel;
    private manager: Multi_project_manager;
    private ctagsManager: CtagsManager | undefined;


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, output_channel: Output_channel_lib.Output_channel,
        manager: Multi_project_manager) {
        
        this.context = context;
        this.manager = manager;
        this.output_channel = output_channel;

        const logger: Logger = new Logger();

        // Configure ctags
        this.ctagsManager = new CtagsManager(logger, context);
        this.ctagsManager.configure();

        // const doc_provider = new VerilogDocumentSymbolProvider(logger, context);

        // VHDL
        this.configure_vhdl();

        // Verilog/SV

        // TCL


    }

    private configure_vhdl(context: vscode.ExtensionContext){
        const vhdlSelector: vscode.DocumentSelector = { scheme: 'file', language: 'vhdl' };
        context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(vhdlSelector, docProvider));
    }

    private configure_verilog(logger: Logger, context: vscode.ExtensionContext){
        let verilogSelector: vscode.DocumentSelector = [
            { scheme: 'file', language: 'verilog' },
            { scheme: 'file', language: 'systemverilog' }
        ];
    }

    private configure_tcl(logger: Logger, context: vscode.ExtensionContext){
        let tcl_selector: vscode.DocumentSelector = { scheme: 'file', language: 'tcl' };

    }




}