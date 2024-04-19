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

import * as utils_hdl from "./utils";
import * as common_hdl from "../common";

//******************************************************************************
//******************************************************************************
// Process
//******************************************************************************
//******************************************************************************
export function get_processes(tree: any, lines: any): common_hdl.Process_hdl[] {
    const items = [];
    const element = tree;
    const start_line = element.startPosition.row;

    const inputs = utils_hdl.search_multiple_in_tree(element, 'always_construct');
    for (let x = 0; x < inputs.length; ++x) {
        const arr1 = get_deep_process(inputs[x]);
        const element: common_hdl.Process_hdl = {
            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PROCESS,
            info: {
                position: {
                    line: start_line,
                    column: 0
                },
                name: get_process_label(arr1),
                description: ""
            },
            type: get_always_type_list(inputs[x], lines),
            sens_list: get_always_sens_list(inputs[x], lines)
        };
        items.push(element);
    }
    return items;
}

function get_process_label(p: any) {
    let label_txt = '';
    const label = utils_hdl.get_item_from_childs(p, "simple_identifier");
    if (label === undefined) {
        label_txt = 'unnamed';
    } else {
        label_txt = label.text;
    }
    return label_txt;
}

function get_always_sens_list(always: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(always, 'event_control');
    if (arr.length === 0) {
        return '';
    }
    const always_name = utils_hdl.extract_data(arr[0], lines);
    return always_name;
}

function get_always_type_list(always: any, lines: any): string {
    let type = '';
    const arr = utils_hdl.search_multiple_in_tree(always, 'always_keyword');
    if (arr.length !== 0) {
        type = utils_hdl.extract_data(arr[0], lines);
    }
    return type;
}

function get_deep_process(p: any) {
    const statement = utils_hdl.get_item_from_childs(p, 'statement');
    const statement_item = utils_hdl.get_item_from_childs(statement, 'statement_item');
    const procedural_timing_control_statement =
        utils_hdl.get_item_from_childs(statement_item, 'procedural_timing_control_statement');

    if (procedural_timing_control_statement !== undefined) {
        const statement_or_null = utils_hdl.get_item_from_childs(procedural_timing_control_statement,
            'statement_or_null');

        const statement_2 = utils_hdl.get_item_from_childs(statement_or_null, 'statement');
        const statement_item_2 = utils_hdl.get_item_from_childs(statement_2, 'statement_item');
        const seq_block = utils_hdl.get_item_from_childs(statement_item_2, 'seq_block');
        return seq_block;
    } else {
        const seq_block = utils_hdl.get_item_from_childs(statement_item, 'seq_block');
        return seq_block;
    }
}


//******************************************************************************
//******************************************************************************
// Type
//******************************************************************************
//******************************************************************************
export function get_types_pkg(tree: any, lines: any): common_hdl.Type_hdl[] {
    const items = [];
    let inputs = [];
    const start_line = tree.startPosition.row;

    const arr = utils_hdl.search_multiple_in_tree(tree, 'type_declaration'); //port_declaration
    inputs = arr;
    for (let x = 0; x < inputs.length; ++x) {
        const type = get_type_type_pkg(inputs[x]);
        const arr_types = get_type_name_pkg(inputs[x], lines);
        const split_arr_types = arr_types.split(',');
        for (let s = 0; s < split_arr_types.length; ++s) {
            const name_type = split_arr_types[s];
            const item: common_hdl.Type_hdl = {
                hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.TYPE,
                info: {
                    position: {
                        line: start_line,
                        column: 0
                    },
                    name: name_type.trim(),
                    description: ""
                },
                type: type.trim(),
                logic: []
            };
            if (type !== '') {
                items.push(item);
            }
        }
    }
    return items;
}

function get_type_type_pkg(input: any) {
    const arr = utils_hdl.search_multiple_in_tree(input, 'data_type');
    if (arr.length === 0) {
        return "undefined";
    }
    const name = arr[0].text.replace(/\/\/(.+)/gi, '');
    return name;
}

function get_type_name_pkg(input: any, _lines: any) {
    const arr = utils_hdl.get_item_from_childs(input, 'simple_identifier');
    if (arr === undefined) {
        return "undefined";
    }
    return arr.text;
}

//******************************************************************************
//******************************************************************************
// Signal
//******************************************************************************
//******************************************************************************
export function get_signals(tree: any, lines: any, comments: any): common_hdl.Signal_hdl[] {
    const items: any = [];
    let inputs = [];
    let inputs2 = [];
    const start_line = tree.startPosition.row;
    //Inputs
    const arr = utils_hdl.search_multiple_in_tree(tree, 'net_declaration');
    const arr2 = utils_hdl.search_multiple_in_tree(tree, 'data_declaration');
    inputs = arr;
    inputs2 = arr2;

    get_signal_array(inputs, comments, items, lines, 'list_of_net_decl_assignments',
        'net_type', 'packed_dimension', start_line);

    get_signal_array(inputs2, comments, items, lines, 'list_of_variable_decl_assignments',
        'data_type_or_implicit1', 0, start_line);
    return items;
}

function get_signal_array(inputs: any, _comments: any, items: any, lines: any, _name_command: any,
    type_command: any, type_dim: any, start_line: any) {

    for (let x = 0; x < inputs.length; ++x) {
        const arr_signals = get_signal_name(inputs[x], lines);
        if (arr_signals !== 'undefined') {
            let signal_type = get_signal_type(inputs[x], lines, type_command);
            const signal_type_dim = get_signal_type(inputs[x], lines, type_dim);
            if (signal_type_dim !== 'undefined') {
                if (signal_type !== signal_type_dim) {
                    signal_type = signal_type + ' ' + signal_type_dim;
                }
            }
            for (let s = 0; s < arr_signals.length; ++s) {
                const name_signal = arr_signals[s];
                const item: common_hdl.Signal_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.SIGNAL,
                    info: {
                        position: {
                            line: start_line,
                            column: 0
                        },
                        name: name_signal.trim(),
                        description: ""
                    },
                    type: signal_type
                };
                if (signal_type !== 'undefined') {
                    items.push(item);
                }
            }
        }
    }
    return items;
}

function get_signal_type(input: any, lines: any, command: any) {
    let arr = utils_hdl.search_multiple_in_tree(input, command);
    if (arr.length === 0) {
        arr = utils_hdl.search_multiple_in_tree(input, 'net_type_identifier');
    }
    if (arr.length === 0) {
        const name = "undefined";
        return name;
    }
    const always_name = utils_hdl.extract_data(arr[0], lines);
    return always_name;
}

function get_signal_name(input: any, lines: any) {
    let arr = utils_hdl.search_multiple_in_tree(input, 'variable_decl_assignment');
    if (arr.length === 0) {
        arr = utils_hdl.search_multiple_in_tree(input, 'net_decl_assignment');
    }
    const names: any[] = [];
    let name;
    if (arr.length === 0) {
        name = "undefined";
    } else {
        for (let i = 0; i < arr.length; ++i) {
            const input_name = utils_hdl.extract_data(arr[i], lines);
            names.push(input_name);
        }
    }
    const arr2 = utils_hdl.search_multiple_in_tree(input, 'variable_identifier');
    if (arr2.length === 0 && name === "undefined") {
        name = "undefined";
        return name;
    }
    for (let i = 0; i < arr2.length; ++i) {
        const input_name = utils_hdl.extract_data(arr2[i], lines);
        names.push(input_name);
    }
    return names;
}

//******************************************************************************
//******************************************************************************
// Type
//******************************************************************************
//******************************************************************************
export function get_types(tree: any, lines: any): common_hdl.Signal_hdl[] {
    const items: common_hdl.Signal_hdl[] = [];
    const start_line = tree.startPosition.row;

    const inputs = utils_hdl.search_multiple_in_tree(tree, 'interface_port_declaration'); //port_declaration
    for (let x = 0; x < inputs.length; ++x) {
        const arr_types = get_type_name(inputs[x], lines);
        const split_arr_types = arr_types.split(',');
        for (let s = 0; s < split_arr_types.length; ++s) {
            const name_type = split_arr_types[s];
            const item: common_hdl.Signal_hdl = {
                hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.SIGNAL,
                info: {
                    position: {
                        line: start_line,
                        column: 0
                    },
                    name: name_type.trim(),
                    description: ""
                },
                type: get_type_type(inputs[x], lines),
            };
            items.push(item);
        }
    }
    return items;
}

function get_type_name(input: any, lines: any) {
    const arr = utils_hdl.search_multiple_in_tree(input, 'list_of_interface_identifiers');
    if (arr.length === 0) {
        return "undefined";
    }
    const input_name = utils_hdl.extract_data(arr[0], lines);
    return input_name;
}

function get_type_type(input: any, lines: any) {
    const arr = utils_hdl.search_multiple_in_tree(input, 'interface_identifier');
    if (arr.length === 0) {
        return "undefined";
    }
    const always_name = utils_hdl.extract_data(arr[0], lines);
    return always_name;
}

//******************************************************************************
//******************************************************************************
// Function
//******************************************************************************
//******************************************************************************
export function get_functions(tree: any, lines: any): common_hdl.Function_hdl[] {
    const items = [];
    const start_line = tree.startPosition.row;

    const inputs = utils_hdl.search_multiple_in_tree(tree, 'function_body_declaration');
    for (let x = 0; x < inputs.length; ++x) {
        const element: common_hdl.Function_hdl = {
            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.FUNCTION,
            info: {
                position: {
                    line: start_line,
                    column: 0
                },
                name: get_function_name(inputs[x], lines),
                description: ""
            },
            type: "",
            arguments: get_function_arguments(inputs[x], lines),
            return: get_function_return(inputs[x], lines)
        };

        items.push(element);
    }
    return items;
}


export function get_tasks(tree: any, lines: any): common_hdl.Task_hdl[] {
    const items = [];
    const start_line = tree.startPosition.row;

    const inputs = utils_hdl.search_multiple_in_tree(tree, 'task_body_declaration');
    for (let x = 0; x < inputs.length; ++x) {
        const element: common_hdl.Task_hdl = {
            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.TASK,
            info: {
                position: {
                    line: start_line,
                    column: 0
                },
                name: get_task_name(inputs[x], lines),
                description: ""
            },
            type: "",
            arguments: get_task_arguments(inputs[x], lines)
        };

        items.push(element);
    }
    return items;
}


function get_function_name(input: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(input, 'function_identifier');
    if (arr.length === 0) {
        return "undefined";
    }
    const input_name = utils_hdl.extract_data(arr[0], lines);
    return input_name;
}

function get_task_name(input: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(input, 'task_identifier');
    if (arr.length === 0) {
        return "undefined";
    }
    const input_name = utils_hdl.extract_data(arr[0], lines);
    return input_name;
}



function get_function_arguments(input: any, lines: any): string {
    const arr_0 = utils_hdl.search_multiple_in_tree(input, 'tf_port_list');
    let input_name = '(';
    console.log('input:'+ input)
    console.log('lines:'+ lines)
    if (arr_0.length != 0) {
        const arr_1 = utils_hdl.search_multiple_in_tree(input, 'tf_port_item1');

        for (let i = 0; i < arr_1.length; i++) {
        
            input_name = input_name + utils_hdl.extract_data(arr_1[i], lines) + ', ';
        }
        
    } else {
        input_name = input_name + utils_hdl.extract_data(arr_0[0], lines);
    }

    input_name = input_name + ')';
    return input_name;
}

function get_task_arguments(input: any, lines: any): string {
    const arr_0 = utils_hdl.search_multiple_in_tree(input, 'tf_port_list');
    let input_name = '(';
    console.log('input:'+ input)
    console.log('lines:'+ lines)
    if (arr_0.length != 0) {
        const arr_1 = utils_hdl.search_multiple_in_tree(input, 'tf_port_item1');

        for (let i = 0; i < arr_1.length; i++) {
        
            input_name = input_name + utils_hdl.extract_data(arr_1[i], lines) + ', ';
        }
        
    } else {
        input_name = input_name + utils_hdl.extract_data(arr_0[0], lines);
    }

    input_name = input_name + ')';
    return input_name;
}


function get_function_return(input: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(input, 'function_data_type_or_implicit1');
    if (arr.length === 0) {
        return "";
    }
    const input_name = 'return (' + utils_hdl.extract_data(arr[0], lines) + ')';
    return input_name;
}

//******************************************************************************
//******************************************************************************
// Constant
//******************************************************************************
//******************************************************************************
export function get_constants(tree: any, lines: any): common_hdl.Constant_hdl[] {
    const items = [];
    const start_line = tree.startPosition.row;

    const inputs = utils_hdl.search_multiple_in_tree(tree, 'list_of_param_assignments');
    for (let x = 0; x < inputs.length; ++x) {
        const arr2 = utils_hdl.search_multiple_in_tree(inputs[x], 'param_assignment');
        for (let x2 = 0; x2 < arr2.length; ++x2) {
            const item: common_hdl.Constant_hdl = {
                hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.CONSTANT,
                info: {
                    position: {
                        line: start_line,
                        column: 0
                    },
                    name: get_constant_name(arr2[x2], lines),
                    description: ""
                },
                type: get_constant_type(inputs[x], lines),
                default_value: get_constant_default(arr2[x2], lines),
            };
            items.push(item);
        }
    }
    return items;
}

function get_constant_name(input: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(input, 'parameter_identifier');
    if (arr.length === 0) {
        return "undefined";
    }
    const input_name = utils_hdl.extract_data(arr[0], lines);
    return input_name;
}

function get_constant_type(input: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(input, 'data_type_or_implicit1');
    if (arr.length === 0) {
        return "";
    }
    const input_name = utils_hdl.extract_data(arr[0], lines);
    return input_name;
}

function get_constant_default(input: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(input, 'constant_param_expression');
    if (arr.length === 0) {
        return "";
    }
    const input_name = utils_hdl.extract_data(arr[0], lines);
    return input_name;
}

export function get_ansi_constants(p: any, lines: any, general_comments: any,
    comment_symbol: string): common_hdl.Constant_hdl[] {

    let last_element_position = -1;
    const constants_types = ['parameter_port_declaration'];
    let last_comments = '';

    let constants: common_hdl.Constant_hdl[] = [];
    let comments = '';

    const constants_list = utils_hdl.get_item_from_childs(p, 'parameter_port_list');
    if (constants_list === undefined) {
        return constants;
    }

    const cursor = constants_list.walk();
    cursor.gotoFirstChild();
    do {
        if (constants_types.includes(cursor.nodeType) === true) {
            if (last_element_position === cursor.startPosition.row) {
                comments = last_comments;
            } else {
                last_comments = comments;
            }
            last_element_position = cursor.startPosition.row;

            let new_constants = get_constants(cursor.currentNode(), lines);
            new_constants = utils_hdl.set_description_to_array(new_constants, comments,
                general_comments, comment_symbol);

            constants = constants.concat(new_constants);
            comments = '';
        } else if (cursor.nodeType === 'comment') {
            const comment_position = cursor.startPosition.row;
            if (last_element_position !== comment_position) {
                comments += utils_hdl.get_comment_with_break(cursor.nodeText, comment_symbol);
            } else {
                comments = '';
            }
        } else {
            comments = '';
        }
    }
    while (cursor.gotoNextSibling() !== false);
    return constants;
}


//******************************************************************************
//******************************************************************************
// Instantiation
//******************************************************************************
//******************************************************************************
export function get_instantiations(tree: any, lines: any): common_hdl.Instantiation_hdl[] {
    const items: common_hdl.Instantiation_hdl[] = [];
    const start_line = tree.startPosition.row;
    const inputs = utils_hdl.search_multiple_in_tree(tree, 'module_instantiation');
    for (let x = 0; x < inputs.length; ++x) {
        const item: common_hdl.Instantiation_hdl = {
            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.INSTANTIATION,
            info: {
                position: {
                    line: start_line,
                    column: 0
                },
                name: get_instantiation_name(inputs[x], lines),
                description: ""
            },
            type: get_instantiation_type(inputs[x], lines)
        };
        items.push(item);
    }
    return items;
}

function get_instantiation_name(always: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(always, 'name_of_instance');
    if (arr.length === 0) {
        return "undefined";
    }
    const always_name = utils_hdl.extract_data(arr[0], lines);
    return always_name;
}

function get_instantiation_type(always: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(always, 'simple_identifier');
    if (arr.length === 0) {
        return "undefined";
    }
    const always_name = utils_hdl.extract_data(arr[0], lines);
    return always_name;
}

//******************************************************************************
//******************************************************************************
// Port
//******************************************************************************
//******************************************************************************
export function get_ansi_ports(p: any, lines: any, general_comments: any,
    comment_symbol: string): common_hdl.Port_hdl[] {

    let last_comments = '';
    let last_element_position = -1;
    const ports_types = ['input_declaration', 'output_declaration', 'ansi_port_declaration',
        'inout_declaration'
    ];

    let ports: common_hdl.Port_hdl[] = [];
    let comments = '';

    const ports_list = utils_hdl.get_item_from_childs(p, 'list_of_port_declarations');
    if (ports_list === undefined) {
        return ports;
    }

    const cursor = ports_list.walk();
    cursor.gotoFirstChild();
    do {
        if (ports_types.includes(cursor.nodeType) === true) {
            if (last_element_position === cursor.startPosition.row) {
                comments = last_comments;
            } else {
                last_comments = comments;
            }
            last_element_position = cursor.startPosition.row;

            let new_ports = get_ports(cursor.currentNode(), lines, general_comments, comment_symbol);
            new_ports = utils_hdl.set_description_to_array_port(new_ports, comments, general_comments, comment_symbol);
            ports = ports.concat(new_ports);
            comments = '';
        } else if (cursor.nodeType === 'comment') {
            const comment_position = cursor.startPosition.row;
            if (last_element_position !== comment_position) {
                comments += utils_hdl.get_comment_with_break(cursor.nodeText, comment_symbol);
            } else {
                comments = '';
            }
        } else {
            comments = '';
        }
    }
    while (cursor.gotoNextSibling() !== false);
    return ports;
}

export function get_ports(tree: any, lines: any, comments: any, comment_symbol: string): common_hdl.Port_hdl[] {
    let items: common_hdl.Port_hdl[] = [];
    //Inputs
    items = add_port(tree, 'input_declaration', 'getPortName',
        'input', 'getPortType', false, items, comments, lines, comment_symbol);
    //Outputs
    items = add_port(tree, 'output_declaration', 'getPortName',
        'output', 'getPortType', false, items, comments, lines, comment_symbol);
    //ansi_port_declaration
    items = add_port(tree, 'ansi_port_declaration', 'getPortNameAnsi',
        'getPortKind', 'getPortType', true, items, comments, lines, comment_symbol);
    //inouts
    items = add_port(tree, 'inout_declaration', 'getPortName', "inout",
        'getPortType', false, items, comments, lines, comment_symbol);
    return items;
}

function add_port(element: any, key: any, name: any, direction: any, type: any, ansi: any, items: any,
    comments: any, lines: any, comment_symbol: string) {

    let last_direction;
    let directionVar = undefined;
    const start_line = element.startPosition.row;
    const inputs = utils_hdl.search_multiple_in_tree(element, key);
    for (let x = 0; x < inputs.length; ++x) {
        let port_name = "";
        switch (name) {
            case 'getPortName':
                port_name = get_port_name(inputs[x], lines);
                break;
            case 'getPortNameAnsi':
                port_name = get_port_name_ansi(inputs[x], lines);
                break;
            default:
                name = get_port_name(inputs[x], lines);
        }
        const port_name_list = port_name.split(',');
        directionVar = get_port_kind(inputs[x], lines);
        if (directionVar !== undefined) {
            last_direction = directionVar;
        }
        let typeVar;
        switch (type) {
            case 'getPortType':
                typeVar = get_port_type(inputs[x], lines);
                break;
            default:
                typeVar = get_port_type(inputs[x], lines);
        }

        let subtype = '';
        if (typeVar === 'modport') {
            subtype = get_port_subtype(inputs[x]);
        }

        const port_ref = utils_hdl.search_multiple_in_tree(element, 'port_reference');
        const comment_str = comments[inputs[x].startPosition.row];
        let comment = "";
        for (let i = 0; i < port_name_list.length; i++) {
            if (comment_str === undefined) {
                for (let z = 0; z < port_ref.length; z++) {
                    const port_ref_name = utils_hdl.extract_data(port_ref[z], lines);
                    if (port_ref_name === port_name_list[i].trim()) {
                        const pre_comment = comments[port_ref[z].startPosition.row];
                        if (pre_comment !== undefined) {
                            comment = utils_hdl.get_comment_with_break(pre_comment, comment_symbol);
                        }
                    }
                }
            }
            const comment_check = utils_hdl.get_comment_with_break(comment_str, comment_symbol);
            if (comment_check !== '') {
                comment = comment_check;
            }
            if (directionVar === undefined) {
                directionVar = last_direction;
            }

            if (typeVar === 'modport') {
                direction = 'input';
                directionVar = 'input';
            }

            const item: common_hdl.Port_hdl = {
                hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: start_line,
                        column: 0
                    },
                    name: port_name_list[i],
                    description: comment
                },
                type: typeVar,
                subtype: subtype,
                inline_comment: "",
                over_comment: "",
                direction: ((ansi === true) ? directionVar : direction),
                default_value: ""
            };
            if (port_name.trim() !== ""){
                items.push(item);
            }
        }
    }
    return items;
}

function get_port_type(port: any, lines: any) {
    //Interface
    const interface_port = utils_hdl.search_multiple_in_tree(port, 'interface_port_header');
    if (interface_port.length === 1) {
        return "modport";
    }

    let arr = utils_hdl.search_multiple_in_tree(port, 'net_port_type1');
    if (arr[0] === undefined) {
        arr = utils_hdl.search_multiple_in_tree(port, 'packed_dimension');
    }
    if (arr[0] === undefined) {
        return "";
    }
    const port_type = utils_hdl.extract_data(arr[0], lines);
    return port_type;
}


function get_port_name(port: any, lines: any): string {
    let arr = utils_hdl.search_multiple_in_tree(port, 'list_of_port_identifiers');
    let port_name = "";
    if (arr.length === 0) {
        arr = utils_hdl.search_multiple_in_tree(port, 'list_of_variable_identifiers');
    }
    if (arr.length === 0) {
        arr = utils_hdl.search_multiple_in_tree(port, 'port_identifier');
    }
    for (let x = 0; x < arr.length; ++x) {
        if (x === 0) {
            port_name = utils_hdl.extract_data(arr[x], lines);
        } else {
            port_name = port_name + ',' + utils_hdl.extract_data(arr[x], lines);
        }
    }
    return port_name;
}

function get_port_name_ansi(port: any, lines: any): string {
    let arr = utils_hdl.search_multiple_in_tree(port, 'port_identifier');
    if (arr.length === 0) {
        arr = utils_hdl.search_multiple_in_tree(port, 'simple_identifier');
        const port_name = utils_hdl.extract_data(arr[0], lines);
        return port_name;
    } else {
        const port_name = utils_hdl.extract_data(arr[0], lines);
        const split_port_name = port_name.split(',');
        for (let x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
    return '';
}

function get_port_subtype(port: any): string {
    const interface_port = utils_hdl.search_multiple_in_tree(port, 'interface_port_header');
    if (interface_port.length === 1) {
        return interface_port[0].text;
    }
    return '';
}

function get_port_kind(port: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(port, 'port_direction');
    if (arr[0] === undefined) {
        return "";
    }
    const port_type = utils_hdl.extract_data(arr[0], lines);
    return port_type;
}


//******************************************************************************
//******************************************************************************
// Generic
//******************************************************************************
//******************************************************************************
export function get_generics(tree: any, lines: any, comments: any, ansi: any, comment_symbol: string) {
    const items: common_hdl.Port_hdl[] = [];
    let inputs = [];
    let arr = [];
    //Inputs
    if (ansi === 0) {
        arr = utils_hdl.search_multiple_in_tree(tree, 'parameter_declaration');
    } else {
        arr = utils_hdl.search_multiple_in_tree(tree, 'parameter_declaration');
    }

    if (arr.length === 0) {
        arr = utils_hdl.search_multiple_in_tree(tree, 'parameter_port_declaration');
    }

    inputs = arr;
    for (let x = 0; x < inputs.length; ++x) {
        let comment = "";
        const pre_comment = comments[inputs[x].startPosition.row];
        if (pre_comment !== undefined) {
            comment = utils_hdl.get_comment_with_break(pre_comment, comment_symbol);
        }

        try {
            const item: common_hdl.Port_hdl = {
                hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
                info: {
                    position: {
                        line: inputs[x].startPosition.row,
                        column: 0
                    },
                    name: get_generic_name(inputs[x], lines),
                    description: comment
                },
                type: get_generic_kind(inputs[x], lines),
                subtype: "",
                direction: "",
                inline_comment: "",
                over_comment: "",
                default_value: get_generic_default(inputs[x], lines),
            };
            items.push(item);
        }
        catch (error) { /* empty */ }
    }
    return items;
}

function get_generic_name(port: any, lines: any): string {
    let arr = utils_hdl.search_multiple_in_tree(port, 'parameter_identifier');
    if (arr.length === 1) {
        arr = utils_hdl.search_multiple_in_tree(port, 'simple_identifier');
        const port_name = utils_hdl.extract_data(arr[0], lines);
        return port_name;
    } else {
        const port_name = utils_hdl.extract_data(arr[0], lines);
        const split_port_name = port_name.split(',');
        for (let x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
    return "";
}

function get_generic_default(input: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(input, 'constant_param_expression');
    const arr_error = utils_hdl.search_multiple_in_tree(input, 'ERROR');
    if (arr.length === 0) {
        return "undefined";
    }

    let input_error = "";
    for (const err of arr_error) {
        input_error += err.text + " ";
    }

    const input_value = utils_hdl.extract_data(arr[0], lines);
    return input_error + input_value;
}

function get_generic_kind(port: any, lines: any): string {
    const arr = utils_hdl.search_multiple_in_tree(port, 'data_type_or_implicit1');
    if (arr.length === 0) {
        return "";
    } else {
        const port_name = utils_hdl.extract_data(arr[0], lines);
        const split_port_name = port_name.split(',');
        for (let x = 0; x < split_port_name.length; ++x) { return port_name; }
    }
    return "";
}


export function get_ansi_generics(p: any, lines: any, general_comments: any,
    comment_symbol: string): common_hdl.Port_hdl[] {

    let last_element_position = -1;
    const generics_types = ['parameter_port_declaration'];
    let last_comments = '';

    let generics: common_hdl.Port_hdl[] = [];
    let comments = '';

    const generics_list = utils_hdl.get_item_from_childs(p, 'parameter_port_list');
    if (generics_list === undefined) {
        return generics;
    }

    const cursor = generics_list.walk();
    cursor.gotoFirstChild();
    do {
        if (generics_types.includes(cursor.nodeType) === true) {
            if (last_element_position === cursor.startPosition.row) {
                comments = last_comments;
            } else {
                last_comments = comments;
            }
            last_element_position = cursor.startPosition.row;

            let new_generics = get_generics(cursor.currentNode(), lines, general_comments, 1, comment_symbol);
            new_generics = utils_hdl.set_description_to_array(new_generics, comments, general_comments, comment_symbol);
            generics = generics.concat(new_generics);
            comments = '';
        } else if (cursor.nodeType === 'comment') {
            const comment_position = cursor.startPosition.row;
            if (last_element_position !== comment_position) {
                comments += utils_hdl.get_comment_with_break(cursor.nodeText, comment_symbol);
            } else {
                comments = '';
            }
        } else {
            comments = '';
        }
    }
    while (cursor.gotoNextSibling() !== false);
    return generics;
}