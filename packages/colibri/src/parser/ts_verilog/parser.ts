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
import * as utils from './utils';
import { Paser_fsm_verilog } from "./fsm";
import { Parser_base } from "../parser";
import { Hdl_element } from "../common";
import { Ts_base_parser } from "../ts_base_parser";
import * as elements_hdl from "./elements";
import { LANGUAGE } from "../../common/general";
import { Parser_interface } from "./parser_interface";
import * as common_hdl from "../common";
import * as Parser from "web-tree-sitter";

export class Verilog_parser extends Ts_base_parser implements Parser_base {
    comment_symbol = "";
    loaded = false;
    code = "";
    parser: any;
    tree: any;
    fsm_parser: any;

    constructor() {
        super();
    }

    async init() {
        try {
            if (this.loaded === false) {
                await Parser.init();
                this.parser = new Parser();
                const lang = await Parser.Language.load(path.join(__dirname, "..",
                    "parsers", "tree-sitter-verilog.wasm"));
                this.parser.setLanguage(lang);
                this.loaded = true;
                this.fsm_parser = new Paser_fsm_verilog(this.comment_symbol, this.parser);
            }
            // eslint-disable-next-line no-empty
        } catch (e) { }
    }

    async get_svg_sm(code: string, symbol: string) {
        return this.fsm_parser.get_svg_sm(code, symbol);
    }

    public get_all(code: string, comment_symbol: string): Hdl_element {
        code = code.replace(/\$clog2/g, 'clog2');

        this.comment_symbol = comment_symbol;
        let hdl_element = new Hdl_element(LANGUAGE.VERILOG, common_hdl.TYPE_HDL_ELEMENT.ENTITY);

        if (this.loaded === false) {
            return hdl_element;
        }

        try {
            const lines = this.fileLines(code);
            const tree = this.parser.parse(code);
            //comments
            const comments = utils.get_comments(tree.rootNode, lines);
            const module_header = utils.search_multiple_in_tree(tree.rootNode, 'module_header');

            if (module_header.length === 0) {
                hdl_element = new Hdl_element(LANGUAGE.VERILOG, common_hdl.TYPE_HDL_ELEMENT.PACKAGE);
                this.get_body_elements_and_declarations(hdl_element, tree, lines, comments, true);

                this.get_package_declaration(hdl_element, tree.rootNode, lines);
                const body_empty = hdl_element.is_empty();

                // Search interfaces
                if (hdl_element.name === '' || body_empty === true) {
                    const ts_verilog_parser_interface_i = new Parser_interface();
                    hdl_element = ts_verilog_parser_interface_i.get_interfaces(tree, lines, comments, comment_symbol);
                } else {
                    hdl_element.hdl_type = common_hdl.TYPE_HDL_ELEMENT.PACKAGE;
                }
                return hdl_element;
            } else {
                hdl_element = new Hdl_element(LANGUAGE.VERILOG, common_hdl.TYPE_HDL_ELEMENT.ENTITY);
                const arch_body = this.get_architecture_body(tree);
                this.get_entity_name(tree.rootNode, lines, hdl_element);
                this.get_body_elements_and_declarations(hdl_element, arch_body, lines, comments, false);

                return hdl_element;
            }
        } catch (error) {
            return hdl_element;
        }
    }

    //////////////////////////////////////////////////////////////////////////////
    get_body_elements_and_declarations(hdl_element: Hdl_element, arch_body: any, lines: any,
        general_comments: any, enable_package: boolean): void {

        let last_element_position = -1;
        //Elements array

        let process_array: common_hdl.Process_hdl[] = [];
        let types_array: common_hdl.Type_hdl[] = [];
        let signals_array: common_hdl.Signal_hdl[] = [];
        let constants_array: common_hdl.Constant_hdl[] = [];
        let functions_array: common_hdl.Function_hdl[] = [];
        let tasks_array: common_hdl.Task_hdl[] = [];
        let instantiations_array: common_hdl.Instantiation_hdl[] = [];
        let ports_array: common_hdl.Port_hdl[] = [];
        let generics_array: common_hdl.Port_hdl[] = [];

        const cursor = arch_body.walk();
        let comments = '';
        // Process
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'module_or_generate_item' || cursor.nodeType === 'package_item'
                || cursor.nodeType === 'package_declaration') {
                cursor.gotoFirstChild();

                do {
                    if (cursor.nodeType === 'package_or_generate_item_declaration') {
                        cursor.gotoFirstChild();

                        do {


                            if (cursor.nodeType === 'net_declaration'
                                || cursor.nodeType === 'data_declaration') {
                                last_element_position = cursor.startPosition.row;
                                let new_signals: common_hdl.Signal_hdl[] =
                                    elements_hdl.get_signals(cursor.currentNode(), lines, general_comments);

                                new_signals = utils.set_description_to_array(new_signals,
                                    comments, general_comments, this.comment_symbol);

                                signals_array = signals_array.concat(new_signals);

                                if (new_signals.length === 0 && enable_package === true
                                    || enable_package === undefined) {
                                    let new_types: common_hdl.Type_hdl[] =
                                        elements_hdl.get_types_pkg(cursor.currentNode(), lines);

                                    new_types = utils.set_description_to_array(new_types,
                                        comments, general_comments, this.comment_symbol);
                                    types_array = types_array.concat(new_types);
                                }
                                comments = '';
                            } else if (cursor.nodeType === 'function_identifier' ||
                                cursor.nodeType === 'function_declaration') {

                                last_element_position = cursor.startPosition.row;
                                let new_functions: common_hdl.Function_hdl[] =
                                    elements_hdl.get_functions(cursor.currentNode(), lines);

                                new_functions = utils.set_description_to_array(new_functions,
                                    comments, general_comments, this.comment_symbol);

                                functions_array = functions_array.concat(new_functions);
                                comments = '';

                            } else if (cursor.nodeType === 'task_identifier' ||
                                cursor.nodeType === 'task_declaration') {
                                last_element_position = cursor.startPosition.row;
                                let new_tasks: common_hdl.Task_hdl[] =
                                    elements_hdl.get_tasks(cursor.currentNode(), lines);

                                new_tasks = utils.set_description_to_array(new_tasks,
                                    comments, general_comments, this.comment_symbol);
                                
                                tasks_array = tasks_array.concat(new_tasks);
                                comments = '';

                            }
                            else if (cursor.nodeType === 'any_parameter_declaration') {
                                last_element_position = cursor.startPosition.row;
                                // let new_constants: common_hdl.Constant_hdl[] =
                                //     elements_hdl.get_constants(cursor.currentNode(), lines);

                                // new_constants = utils.set_description_to_array(new_constants,
                                //     comments, general_comments, this.comment_symbol);
                                // constants_array = constants_array.concat(new_constants);

                                // if (new_constants.length === 0) {
                                let new_generics: common_hdl.Port_hdl[] =
                                    elements_hdl.get_generics(cursor.currentNode(),
                                        lines, general_comments, 0, this.comment_symbol);

                                new_generics = utils.set_description_to_array(new_generics,
                                    comments, general_comments, this.comment_symbol);
                                generics_array = generics_array.concat(new_generics);
                                // }
                                // if (new_constants.length === 0 && enable_package === true) {
                                //     const new_item_generic = elements_hdl.get_generics(
                                //         cursor.currentNode(), lines, general_comments, 0, this.comment_symbol);

                                //     new_constants = [];
                                //     new_item_generic.forEach(element => {
                                //         const item: common_hdl.Constant_hdl = {
                                //             hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.CONSTANT,
                                //             info: element.info,
                                //             type: element.type,
                                //             default_value: element.default_value,
                                //         };
                                //         new_constants.push(item);
                                //     });

                                //     new_constants = utils.set_description_to_array(new_constants,
                                //         comments, general_comments, this.comment_symbol);
                                //     constants_array = constants_array.concat(new_constants);
                                // }

                                comments = '';
                            }
                            else if (cursor.nodeType === 'local_parameter_declaration'
                                || cursor.nodeType === 'parameter_declaration') {
                                last_element_position = cursor.startPosition.row;
                                let new_constants: common_hdl.Constant_hdl[] =
                                    elements_hdl.get_constants(cursor.currentNode(), lines);

                                new_constants = utils.set_description_to_array(new_constants,
                                    comments, general_comments, this.comment_symbol);
                                constants_array = constants_array.concat(new_constants);

                                // if (new_constants.length === 0) {
                                //     let new_generics: common_hdl.Port_hdl[] =
                                //         elements_hdl.get_generics(cursor.currentNode(),
                                //             lines, general_comments, 0, this.comment_symbol);

                                //     new_generics = utils.set_description_to_array(new_generics,
                                //         comments, general_comments, this.comment_symbol);
                                //     generics_array = generics_array.concat(new_generics);
                                // }
                                // if (new_constants.length === 0 && enable_package === true) {
                                //     const new_item_generic = elements_hdl.get_generics(
                                //         cursor.currentNode(), lines, general_comments, 0, this.comment_symbol);

                                //     new_constants = [];
                                //     new_item_generic.forEach(element => {
                                //         const item: common_hdl.Constant_hdl = {
                                //             hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.CONSTANT,
                                //             info: element.info,
                                //             type: element.type,
                                //             default_value: element.default_value,
                                //         };
                                //         new_constants.push(item);
                                //     });

                                //     new_constants = utils.set_description_to_array(new_constants,
                                //         comments, general_comments, this.comment_symbol);
                                //     constants_array = constants_array.concat(new_constants);
                                // }

                                comments = '';
                            } else if (cursor.nodeType === 'type_declaration') {
                                last_element_position = cursor.startPosition.row;
                                let new_types: common_hdl.Type_hdl[] =
                                    elements_hdl.get_types_pkg(cursor.currentNode(), lines);

                                new_types = utils.set_description_to_array(new_types,
                                    comments, general_comments, this.comment_symbol);
                                types_array = types_array.concat(new_types);
                                comments = '';
                            }
                            else {
                                comments = '';
                            }
                        }
                        while (cursor.gotoNextSibling() !== false);
                        cursor.gotoParent();

                    }
                    else if (cursor.nodeType === 'always_construct') {
                        last_element_position = cursor.startPosition.row;
                        let new_processes: common_hdl.Process_hdl[] =
                            elements_hdl.get_processes(cursor.currentNode(), lines);

                        new_processes = utils.set_description_to_array(new_processes,
                            comments, general_comments, this.comment_symbol);

                        process_array = process_array.concat(new_processes);
                        comments = '';
                    }
                    else if (cursor.nodeType === 'module_instantiation') {
                        last_element_position = cursor.startPosition.row;
                        let new_instantiations: common_hdl.Instantiation_hdl[] =
                            elements_hdl.get_instantiations(cursor.currentNode(), lines);

                        new_instantiations = utils.set_description_to_array(new_instantiations,
                            comments, general_comments, this.comment_symbol);
                        instantiations_array = instantiations_array.concat(new_instantiations);
                        comments = '';
                    }
                }
                while (cursor.gotoNextSibling() !== false);
                cursor.gotoParent();
            } else if (cursor.nodeType === 'module_ansi_header') {
                const new_ports: common_hdl.Port_hdl[] =
                    elements_hdl.get_ansi_ports(cursor.currentNode(), lines, general_comments, this.comment_symbol);
                ports_array = ports_array.concat(new_ports);

                const new_generics: common_hdl.Port_hdl[] = elements_hdl.get_ansi_generics(
                    cursor.currentNode(), lines, general_comments, this.comment_symbol);

                generics_array = generics_array.concat(new_generics);

                // const new_constants: common_hdl.Constant_hdl[] = elements_hdl.get_ansi_constants(
                //     cursor.currentNode(), lines, general_comments, this.comment_symbol);

                // constants_array = constants_array.concat(new_constants);
                comments = '';
            } else if (cursor.nodeType === 'port_declaration') {
                last_element_position = cursor.startPosition.row;
                let new_ports: common_hdl.Port_hdl[] =
                    elements_hdl.get_ports(cursor.currentNode(), lines, general_comments, this.comment_symbol);
                new_ports = utils.set_description_to_array_port(new_ports, comments, general_comments,
                    this.comment_symbol);
                ports_array = ports_array.concat(new_ports);
                comments = '';
                last_element_position = cursor.startPosition.row;
                let new_signals: common_hdl.Signal_hdl[] =
                    elements_hdl.get_types(cursor.currentNode(), lines);

                new_signals = utils.set_description_to_array(new_signals,
                    comments, general_comments, this.comment_symbol);
                signals_array = signals_array.concat(new_signals);
                comments = '';
            } else if (cursor.nodeType === 'parameter_declaration') {
                last_element_position = cursor.startPosition.row;
                let new_generics: common_hdl.Port_hdl[] = elements_hdl.get_generics(
                    cursor.currentNode(), lines, general_comments, 0, this.comment_symbol);

                new_generics = utils.set_description_to_array(new_generics,
                    comments, general_comments, this.comment_symbol);
                generics_array = generics_array.concat(new_generics);
                comments = '';
            } else if (cursor.nodeType === 'comment') {
                const comment_position = cursor.startPosition.row;
                if (last_element_position !== comment_position) {
                    comments += utils.get_comment_with_break(cursor.nodeText, this.comment_symbol);
                } else {
                    comments = '';
                }
            } else {
                comments = '';
            }
        }
        while (cursor.gotoNextSibling() !== false);

        process_array.forEach(element => {
            hdl_element.add_process(element);
        });

        signals_array.forEach(element => {
            hdl_element.add_signal(element);
        });

        instantiations_array.forEach(element => {
            hdl_element.add_instantiation(element);
        });

        ports_array.forEach(element => {
            hdl_element.add_port(element);
        });

        generics_array.forEach(element => {
            hdl_element.add_generic(element);
        });

        constants_array.forEach(element => {
            hdl_element.add_constant(element);
        });

        functions_array.forEach(element => {
            hdl_element.add_function(element);
        });

        tasks_array.forEach(element => {
            hdl_element.add_task(element);
        });

        types_array.forEach(element => {
            hdl_element.add_type(element);
        });
    }

    get_architecture_body(p: any) {
        let break_p = false;
        let arch_body = undefined;
        const cursor = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'module_declaration') {
                arch_body = cursor.currentNode();
                break_p = true;
            }
        }
        while (cursor.gotoNextSibling() === true && break_p === false);
        if (arch_body === undefined) {
            arch_body = p.walk().currentNode();
        }
        return arch_body;
    }

    get_libraries() {
        return [];
    }

    async get_only_entity_name(code: string) {
        if (this.loaded === false) {
            return undefined;
        }
        const tree = await this.parser.parse(code);
        const cursor = tree.walk();
        const arr = utils.search_multiple_in_tree(cursor.currentNode(), 'module_identifier');
        if (arr === undefined) {
            return '';
        } else {
            return arr[0].text;
        }
    }

    async get_entity_or_package_name(code: string) {
        const entity_name = await this.get_only_entity_name(code);
        return { name: entity_name, type: 'entity' };
    }

    get_entity_name(tree: any, lines: any, hdl_element: common_hdl.Hdl_element) {
        let element = tree;
        let arr = utils.search_multiple_in_tree(element, 'module_header');
        element = arr;
        arr = utils.search_multiple_in_tree(element[0], 'simple_identifier');
        const module_index = this.index(arr[0]);
        hdl_element.name = utils.extract_data(arr[0], lines);

        let description = "";
        const comments = utils.search_multiple_in_tree(tree, 'comment');
        for (let x = 0; x < comments.length; ++x) {
            if (comments[x].startPosition.row >= module_index[0]) {
                break;
            }
            const comment_str = utils.extract_data(comments[x], lines);
            description += this.get_comment(comment_str, false);
        }
        description += '\n';
        hdl_element.description = description;
    }

    get_package_declaration(hdl_element: Hdl_element, tree: any, lines: any): void {
        let pkg = utils.get_item_from_childs(tree, 'package_declaration');
        if (pkg === undefined) {
            return;
        }
        pkg = utils.search_multiple_in_tree(pkg, 'package_identifier');
        const module_index = this.index(pkg[0]);
        const name = utils.extract_data(pkg[0], lines);
        let description = "";
        const comments = utils.search_multiple_in_tree(tree, 'comment');
        for (let x = 0; x < comments.length; ++x) {
            if (comments[x].startPosition.row >= module_index[0]) { break; }
            const comment_str = utils.extract_data(comments[x], lines);
            description += utils.get_comment_with_break(comment_str, this.comment_symbol);
        }
        description += '\n';

        hdl_element.description = description;
        hdl_element.name = name;
    }

    index(node: any) {
        return [node.startPosition.row, node.startPosition.column];
    }

    fileLines(source: any) {
        const array = source.toString().split("\n");
        return array;
    }
}
