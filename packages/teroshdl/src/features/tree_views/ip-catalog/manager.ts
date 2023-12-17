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

import * as vscode from "vscode";
import * as element from "./element";
import { t_Multi_project_manager } from '../../../type_declaration';
import * as events from "events";
import * as shelljs from 'shelljs';
import { Logger } from "../../../logger";
import { BaseView } from "../baseView";
import { e_viewType } from "../common";

export class IpCatalogManager extends BaseView{
    private tree: element.IpCatalogProvider;
    private project_manager: t_Multi_project_manager;
    private logger: Logger;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(context: vscode.ExtensionContext, manager: t_Multi_project_manager, logger: Logger) {

        super(e_viewType.IP_CATALOG);

        this.project_manager = manager;
        this.logger = logger;
        this.tree = new element.IpCatalogProvider(manager);

        this.set_commands();
        context.subscriptions.push(vscode.window.registerTreeDataProvider(element.IpCatalogProvider.getViewID(),
            this.tree as element.BaseTreeDataProvider<element.CatalogElement>));
    }

    set_commands() {
        vscode.commands.registerCommand("teroshdl.quartus.add_ip", () => this.add_ip());
        vscode.commands.registerCommand("teroshdl.quartus.create_ip", (element) => this.create_ip(element));
    }

    async create_ip(element: element.CatalogElement) {
        const cmd = element.elementDefinition.command;
        this.logger.info(`Creating IP: ${cmd}`);
        this.logger.show();
        if (cmd !== undefined) {
            shelljs.exec(cmd, { async: true });
        }
    }

    async add_ip() {
        // Get the current cursor position
        const editor = vscode.window.activeTextEditor;
        if (editor === undefined) {
            vscode.window.showWarningMessage(
                `You need to open a file to add an IP.`
            );
            return;
        }
        const position = editor.selection.active;
        const uri = editor.document.uri;
        const path = uri.path;
        const line = position.line;
        const column = position.character;


        vscode.window.showInformationMessage(
            `Choose the IP in the IP Catalog view. After that, the template will be added the current cursor position.`
        );
        this.refresh_tree();
    }

    refresh_tree() {
        this.tree.refresh();
    }
}


