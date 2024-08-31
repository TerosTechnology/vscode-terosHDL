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

import * as path from 'path';
import { Paser_fsm_vhdl } from "./fsm";
import { Parser_base } from "../parser";
import { Hdl_element } from "../common";
import { Ts_base_parser } from "../ts_base_parser";
import * as elements_hdl from "./elements";
import { LANGUAGE } from "../../common/general";
import * as common_hdl from "../common";
import * as Parser from "web-tree-sitter";

export class Vhdl_parser extends Ts_base_parser implements Parser_base {
    comment_symbol = "";
    loaded = false;
    code = "";
    parser: any;
    tree: any;
    fsm_parser: any;

    constructor() {
        super();
    }

    public async init() {
        try {
            if (this.loaded !== true) {
                await Parser.init();
                this.parser = new Parser();
                const lang = await Parser.Language.load(path.join(__dirname, "..", "parsers", "tree-sitter-vhdl.wasm"));
                this.parser.setLanguage(lang);
                this.loaded = true;
                this.fsm_parser = new Paser_fsm_vhdl(this.comment_symbol, this.parser);
            }
        }
        // eslint-disable-next-line no-empty
        catch (e) { }
    }

    async get_svg_sm(code: string, symbol: string) {
        return this.fsm_parser.get_svg_sm(code, symbol);
    }

    public get_all(code: string, comment_symbol: string): Hdl_element {
        this.comment_symbol = comment_symbol;
        let hdl_element = new Hdl_element(LANGUAGE.VHDL, common_hdl.TYPE_HDL_ELEMENT.ENTITY);

        if (this.loaded === false) {
            hdl_element.error_state = true;
            return hdl_element;
        }

        const check: boolean = this.get_entity_file(code, hdl_element);

        if (check === false) {
            hdl_element = new Hdl_element(LANGUAGE.VHDL, common_hdl.TYPE_HDL_ELEMENT.PACKAGE);
            this.get_package_file(code, hdl_element);
        }
        return hdl_element;
    }

    //**************************************************************************
    //**************************************************************************
    // Common
    //**************************************************************************
    //**************************************************************************
    private parse(code: string) {
        if (this.code !== code) {
            this.tree = this.parser.parse(code);
            this.code = code;
        }
        return this.tree;
    }

    private get_entity_file(code: string, hdl_element: Hdl_element): boolean {
        try {
            this.get_entity_declaration(code, hdl_element);
            this.get_architecture_body_elements(code, hdl_element);
            this.get_declaration_elements('arch', code, hdl_element);
            if (hdl_element.name !== '') {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) { return false; }
    }

    //**************************************************************************
    //**************************************************************************
    // Entity
    //**************************************************************************
    //**************************************************************************
    private get_entity_declaration(code: string, hdl_element: Hdl_element) {
        const tree = this.parse(code);
        let entity_name = '';

        const description = this.get_entity_declaration_description(code);

        const break_p = false;
        const cursor = tree.walk();

        type Entity_declaration = {
            generics: common_hdl.Port_hdl[];
            ports: common_hdl.Port_hdl[];
        }

        let result: Entity_declaration = {
            generics: [],
            ports: []
        };

        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'design_unit') {
                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'entity_declaration') {
                        cursor.gotoFirstChild();
                        do {
                            if (cursor.nodeType === 'identifier') {
                                entity_name = cursor.nodeText;
                            }
                            else if (cursor.nodeType === 'entity_header') {
                                result = elements_hdl.get_generics_and_ports(cursor.currentNode(), this.comment_symbol);
                            }
                        }
                        while (cursor.gotoNextSibling() === true && break_p === false);
                    }
                }
                while (cursor.gotoNextSibling() === true && break_p === false);
            }
        }
        while (cursor.gotoNextSibling() === true && break_p === false);

        hdl_element.name = entity_name;
        hdl_element.description = description;

        result.generics.forEach(element => {
            hdl_element.add_generic(element);
        });
        result.ports.forEach(element => {
            hdl_element.add_port(element);
        });
    }

    private get_entity_declaration_description(code: string) {
        const tree = this.parse(code);

        let entity_description = '';

        const break_p = false;
        const cursor = tree.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'design_unit') {
                cursor.gotoFirstChild();
                do {
                    // eslint-disable-next-line no-empty
                    if (cursor.nodeType === 'entity_declaration') { }
                    else if (cursor.nodeType === 'comment') {
                        entity_description += this.get_comment(cursor.nodeText, false);
                    }
                }
                while (cursor.gotoNextSibling() === true && break_p === false);
            }
            else if (cursor.nodeType === 'comment') {
                entity_description += this.get_comment(cursor.nodeText, false);
            }
            else {
                entity_description = '';
            }
        }
        while (cursor.gotoNextSibling() === true && break_p === false);
        return entity_description;
    }

    //**************************************************************************
    //**************************************************************************
    // Body
    //**************************************************************************
    //**************************************************************************
    private get_architecture_body_elements(code: string, hdl_element: Hdl_element) {
        try {
            const arch_body = this.get_architecture_body(code);
            const cursor = arch_body.declaration.walk();
            let comments = arch_body.comment;

            cursor.gotoFirstChild();
            do {
                if (cursor.nodeType === 'component_instantiation_statement') {
                    const elements: common_hdl.Instantiation_hdl[] =
                        elements_hdl.get_instantiation(cursor.currentNode());
                    for (let i = 0; i < elements.length; ++i) {
                        elements[i].info.description = comments;
                        hdl_element.add_instantiation(elements[i]);
                    }
                    comments = '';
                }
                else if (cursor.nodeType === 'process_statement') {
                    const elements: common_hdl.Process_hdl[] = elements_hdl.get_process(cursor.currentNode());
                    for (let i = 0; i < elements.length; ++i) {
                        elements[i].info.description = comments.replace(/fsm_extract/g, '');
                        hdl_element.add_process(elements[i]);
                    }
                    comments = '';
                }
                else if (cursor.nodeType === 'comment') {
                    comments += this.get_comment(cursor.nodeText);
                }
                else {
                    comments = '';
                }
            }
            while (cursor.gotoNextSibling() !== false);
        }
        // eslint-disable-next-line no-empty
        catch (e) { }
    }

    private get_architecture_body(code: string) {
        const tree = this.parse(code);

        let description = "";
        let break_p = false;
        let counter = 0;
        let arch_body = undefined;
        const cursor = tree.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'design_unit') {
                counter += 1;
                if (counter === 2) {
                    cursor.gotoFirstChild();
                    do {
                        if (cursor.nodeType === 'architecture_body') {
                            cursor.gotoFirstChild();
                            do {
                                if (cursor.nodeType === 'concurrent_statement_part') {
                                    arch_body = cursor.currentNode();
                                    break_p = true;
                                }
                                else if (cursor.nodeType === 'comment') {
                                    description += this.get_comment(cursor.nodeText);
                                }
                                else {
                                    description = "";
                                }
                            }
                            while (cursor.gotoNextSibling() === true && break_p === false);
                        }
                    }
                    while (cursor.gotoNextSibling() === true && break_p === false);
                }
            }
        }
        while (cursor.gotoNextSibling() === true && break_p === false);
        return { "declaration": arch_body, "comment": description };
    }

    //**************************************************************************
    //**************************************************************************
    // Architecture
    //**************************************************************************
    //**************************************************************************
    private get_declaration_elements(type: string, code: string, hdl_element: Hdl_element) {
        let top_declaration;
        if (type === 'arch') {
            top_declaration = this.get_architecture_declaration(code);
        }
        else {
            top_declaration = this.get_package_top_declaration(code);
        }
        const types_array: common_hdl.Type_hdl[] = [];
        const signals_array: common_hdl.Signal_hdl[] = [];
        const constants_array: common_hdl.Constant_hdl[] = [];
        const functions_array: common_hdl.Function_hdl[] = [];

        if (top_declaration.declaration === undefined) {
            return;
        }

        const cursor = top_declaration.declaration.walk();
        let comments = top_declaration.comment_init;

        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'full_type_declaration') {
                const elements: common_hdl.Type_hdl[] = elements_hdl.get_full_type_declaration(cursor.currentNode());
                for (let i = 0; i < elements.length; ++i) {
                    elements[i].info.description = comments;
                    if (top_declaration.comment_end_line === elements[0].info.position.line 
                        && top_declaration.comment_end !== ""){
                            elements[i].info.description = top_declaration.comment_end;
                    }
                    types_array.push(elements[i]);
                }
                comments = '';
            }
            else if (cursor.nodeType === 'signal_declaration') {
                const elements: common_hdl.Signal_hdl[] = elements_hdl.get_signal_declaration(cursor.currentNode());
                for (let i = 0; i < elements.length; ++i) {
                    elements[i].info.description = comments;
                    if (top_declaration.comment_end_line === elements[0].info.position.line 
                        && top_declaration.comment_end !== ""){
                            elements[i].info.description = top_declaration.comment_end;
                    }                    signals_array.push(elements[i]);
                }
                comments = '';
            }
            else if (cursor.nodeType === 'function_body' || cursor.nodeType === 'subprogram_body'
                || cursor.nodeType === 'function_declaration'
                || cursor.nodeType === 'subprogram_declaration' || cursor.nodeType === 'procedure_declaration') {
                const elements: common_hdl.Function_hdl[] = elements_hdl.get_function_body(cursor.currentNode());
                for (let i = 0; i < elements.length; ++i) {
                    elements[i].info.description = comments;
                    if (top_declaration.comment_end_line === elements[0].info.position.line 
                        && top_declaration.comment_end !== ""){
                            elements[i].info.description = top_declaration.comment_end;
                    }                    functions_array.push(elements[i]);
                }
                comments = '';
            }
            else if (cursor.nodeType === 'constant_declaration') {
                const elements: common_hdl.Constant_hdl[] = elements_hdl.get_constant_declaration(cursor.currentNode());
                for (let i = 0; i < elements.length; ++i) {
                    elements[i].info.description = comments;
                    if (top_declaration.comment_end_line === elements[0].info.position.line 
                        && top_declaration.comment_end !== ""){
                            elements[i].info.description = top_declaration.comment_end;
                    }                    constants_array.push(elements[i]);
                }
                comments = '';
            }
            else if (cursor.nodeType === 'comment') {
                let txt_comment = cursor.nodeText.slice(2);
                if (txt_comment.charAt(txt_comment.length - 1) === '\n'
                    || txt_comment.charAt(txt_comment.length - 1) === '\r') {
                    txt_comment = txt_comment.slice(0, -1);
                }

                const comment_line = cursor.startPosition.row;
                if (txt_comment[0] === this.comment_symbol || this.comment_symbol === '') {
                    if (this.comment_symbol !== '') {
                        txt_comment = txt_comment.slice(1);
                    }

                    let check = false;
                    //Types
                    for (let i = 0; i < types_array.length; ++i) {
                        if (comment_line === types_array[i].info.position.line) {
                            types_array[i].info.description = txt_comment;
                            check = true;
                        }
                    }
                    //Signals
                    for (let i = 0; i < signals_array.length; ++i) {
                        if (comment_line === signals_array[i].info.position.line) {
                            signals_array[i].info.description = txt_comment;
                            check = true;
                        }
                    }
                    //Constants
                    for (let i = 0; i < constants_array.length; ++i) {
                        if (comment_line === constants_array[i].info.position.line) {
                            constants_array[i].info.description = txt_comment;
                            check = true;
                        }
                    }
                    //Functions
                    for (let i = 0; i < functions_array.length; ++i) {
                        if (comment_line === functions_array[i].info.position.line) {
                            functions_array[i].info.description = txt_comment;
                            check = true;
                        }
                    }
                    if (check === false) {
                        comments += txt_comment + "\n";
                    }
                }
                else {
                    comments = '';
                }
            }
            else {
                comments = '';
            }
        }
        while (cursor.gotoNextSibling() !== false);

        types_array.forEach(element => {
            hdl_element.add_type(element);
        });

        signals_array.forEach(element => {
            hdl_element.add_signal(element);
        });

        constants_array.forEach(element => {
            hdl_element.add_constant(element);
        });

        functions_array.forEach(element => {
            hdl_element.add_function(element);
        });
    }

    private get_architecture_declaration(code: string) {
        const tree = this.parse(code);

        let comment_init = "";
        let comment_end_line = 0;

        let is_init = true;

        let description = "";
        let break_p = false;
        let counter = 0;
        let arch_declaration = undefined;
        const cursor = tree.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'design_unit') {
                counter += 1;
                if (counter === 2) {
                    cursor.gotoFirstChild();
                    do {
                        if (cursor.nodeType === 'architecture_body') {
                            cursor.gotoFirstChild();
                            do {
                                if (cursor.nodeType === 'declarative_part') {
                                    if (break_p === false){
                                        arch_declaration = cursor.currentNode();
                                    }
                                    break_p = true;
                                }
                                else if (cursor.nodeType === 'comment') {
                                    description += this.get_comment(cursor.nodeText);
                                    comment_end_line = cursor.startPosition.row;
                                }

                                if (cursor.nodeType !== 'comment') {
                                    if (is_init === true && break_p === true){
                                        comment_init = description;
                                        is_init = false;
                                        description = "";
                                    }
                                }
                            }
                            while (cursor.gotoNextSibling() === true);
                        }
                    }
                    while (cursor.gotoNextSibling() === true && break_p === false);
                }
            }
        }
        while (cursor.gotoNextSibling() === true && break_p === false);
        return { "declaration": arch_declaration, "comment": description, "comment_init": comment_init, 
            "comment_end": description, "comment_end_line": comment_end_line};
    }

    //**************************************************************************
    //**************************************************************************
    // Package
    //**************************************************************************
    //**************************************************************************
    get_package_file(code: string, hdl_element: Hdl_element) {
        try {
            this.get_package_declaration(code, hdl_element);
            this.get_declaration_elements('package', code, hdl_element);
            return true;
        }
        catch (e) { return false; }
    }

    get_package_declaration(code: string, hdl_element: Hdl_element) {
        const tree = this.parse(code);

        let description = '';
        let name = '';

        let break_p = false;
        const cursor = tree.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'design_unit') {
                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'package_declaration') {
                        cursor.gotoFirstChild();
                        do {
                            if (cursor.nodeType === 'identifier') {
                                name = cursor.nodeText;
                                break_p = true;
                            }
                        }
                        while (cursor.gotoNextSibling() === true && break_p === false);
                    }
                    else if (cursor.nodeType === 'comment') {
                        description += this.get_comment(cursor.nodeText, false);
                    }
                    else {
                        // description = '';
                    }
                }
                while (cursor.gotoNextSibling() === true && break_p === false);
            }
            else if (cursor.nodeType === 'package_declaration') {
                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'identifier') {
                        name = cursor.nodeText;
                        break_p = true;
                    }
                }
                while (cursor.gotoNextSibling() === true && break_p === false);
            }
            else if (cursor.nodeType === 'comment') {
                description += this.get_comment(cursor.nodeText, false);
            }
            else {
                // description = '';
            }
        }
        while (cursor.gotoNextSibling() === true && break_p === false);

        hdl_element.name = name;
        hdl_element.description = description;
    }

    get_package_top_declaration(code: string) {
        const tree = this.parse(code);

        let comment_init = "";
        let comment_end_line = 0;

        let is_init = true;

        let declaration = undefined;
        let description = "";

        let break_p = false;
        const cursor = tree.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'design_unit') {
                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'package_declaration') {
                        cursor.gotoFirstChild();
                        do {
                            if (cursor.nodeType === 'declarative_part') {
                                declaration = cursor.currentNode();
                                break_p = true;
                            }
                            else if (cursor.nodeType === 'comment') {
                                description += this.get_comment(cursor.nodeText);
                                comment_end_line = cursor.startPosition.row;
                            }

                            if (cursor.nodeType !== 'comment') {
                                if (is_init === true && break_p === true){
                                    comment_init = description;
                                    is_init = false;
                                    description = "";
                                }
                            }
                        }
                        while (cursor.gotoNextSibling() === true);
                    }
                }
                while (cursor.gotoNextSibling() === true && break_p === false);
            }
            else if (cursor.nodeType === 'package_declaration') {
                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'declarative_part') {
                        if (break_p === false){
                            declaration = cursor.currentNode();
                        }
                        break_p = true;
                    }
                    else if (cursor.nodeType === 'comment') {
                        description += this.get_comment(cursor.nodeText);
                        comment_end_line = cursor.startPosition.row;
                    }

                    if (cursor.nodeType !== 'comment') {
                        if (is_init === true && break_p === true){
                            comment_init = description;
                            is_init = false;
                            description = "";
                        }
                    }
                }
                while (cursor.gotoNextSibling() === true);
            }
        }
        while (cursor.gotoNextSibling() === true && break_p === false);
        return { "declaration": declaration, "comment": description, "comment_init": comment_init, 
        "comment_end": description, comment_end_line: comment_end_line };
    }
}

