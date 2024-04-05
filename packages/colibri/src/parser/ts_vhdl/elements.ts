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
export function get_process(p: any): common_hdl.Process_hdl[] {
    let name = '';
    let sens_list = '';

    const break_p = false;
    const cursor = p.walk();
    const line = cursor.startPosition.row;
    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'label') {
            name = cursor.nodeText.replace(':', '').trim();
        }
        else if (cursor.nodeType === 'sensitivity_list') {
            sens_list = cursor.nodeText.trim();
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    if (name === '') {
        name = 'unnamed';
    }

    const element: common_hdl.Process_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PROCESS,
        info: {
            position: {
                line: line,
                column: 0
            },
            name: name,
            description: ""
        },
        type: "",
        sens_list: sens_list
    };

    return [element];
}

//******************************************************************************
//******************************************************************************
// Type
//******************************************************************************
//******************************************************************************
export function get_full_type_declaration(p: any): common_hdl.Type_hdl[] {
    let name = "";
    let type = "";
    //let type_elemet : common_hdl.Type_hdl;
    let record_array : common_hdl.Record_hdl[] = [];
    let enum_array : common_hdl.Enum_hdl[] = [];
    let is_record = false;
    let is_enum = false;
    const break_p = false;
    const cursor = p.walk();
    const line = cursor.startPosition.row;
    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'identifier') {
            name = cursor.nodeText;
        }
        else if (cursor.nodeType === 'enumeration_type_definition') {
            enum_array = get_enum_elements(cursor.currentNode(), ''); 
            is_enum = true;
        }
        else if (cursor.nodeType === 'unbounded_array_definition') {
            const type_definition = cursor.nodeText;
            type = utils_hdl.remove_break_line(utils_hdl.remove_comments(type_definition));
        }        
        else if (cursor.nodeType === 'numeric_type_definition') {
            const type_definition = cursor.nodeText;
            type = utils_hdl.remove_break_line(utils_hdl.remove_comments(type_definition));
        }
        else if (cursor.nodeType === 'record_type_definition') {
            record_array = get_record_elements(cursor.currentNode(), ''); 
            is_record = true;
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);

    const element: common_hdl.Type_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.TYPE,
        info: {
            position: {
                line: line,
                column: 0
            },
            name: name,
            description: ""
        },
        type: type.trim(),
        inline_comment: "",
        is_enum: is_enum,
        is_record: is_record,
        record_elements: record_array,
        enum_elements: enum_array,
        logic: []
    };
    return [element];
}

//******************************************************************************
//******************************************************************************
// Signal
//******************************************************************************
//******************************************************************************
export function get_signal_declaration(p: any): common_hdl.Signal_hdl[] {
    const elements: common_hdl.Signal_hdl[] = [];
    const break_p = false;
    const cursor = p.walk();
    const line = cursor.startPosition.row;
    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'identifier_list') {
            const names = cursor.nodeText.split(',');
            for (let i = 0; i < names.length; ++i) {
                const element: common_hdl.Signal_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.SIGNAL,
                    info: {
                        position: {
                            line: line,
                            column: 0
                        },
                        name: names[i],
                        description: ""
                    },
                    type: ""
                };
                elements.push(element);
            }
        }
        else if (cursor.nodeType === 'subtype_indication') {
            for (let i = 0; i < elements.length; ++i) {
                elements[i].type = cursor.nodeText;
            }
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return elements;
}

//******************************************************************************
//******************************************************************************
// Function
//******************************************************************************
//******************************************************************************
export function get_function_body(p: any): common_hdl.Function_hdl[] {
    const element: common_hdl.Function_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.FUNCTION,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "",
            description: ""
        },
        type: "",
        arguments: "",
        return: ""
    };

    const break_p = false;
    const cursor = p.walk();
    element.info.position.line = cursor.startPosition.row;
    cursor.gotoFirstChild();
    // do {
    //     if (cursor.nodeType === 'pure_function_specification' || cursor.nodeType === 'procedure_specification') {
    //         cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'identifier') {
            element.info.name = cursor.nodeText;
        }
        else if (cursor.nodeType === 'procedure_parameter_clause' ||
            cursor.nodeType === 'function_parameter_clause') {
            const return_arguments = cursor.nodeText;
            element.arguments = utils_hdl.remove_break_line(utils_hdl.remove_comments(return_arguments)).trim();
        }
        else if (cursor.nodeType === 'return') {
            const return_definitions = cursor.nodeText;
            element.return = utils_hdl.remove_break_line(utils_hdl.remove_comments(return_definitions)).trim();
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    // }
    // }
    // while (cursor.gotoNextSibling() === true && break_p === false);
    return [element];
}

//******************************************************************************
//******************************************************************************
// Constant
//******************************************************************************
//******************************************************************************
export function get_constant_declaration(p: any): common_hdl.Constant_hdl[] {
    const elements: common_hdl.Constant_hdl[] = [];
    const break_p = false;
    const cursor = p.walk();
    const line = cursor.startPosition.row;
    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'identifier_list') {
            const names = cursor.nodeText.split(',');
            for (let i = 0; i < names.length; ++i) {
                const element: common_hdl.Constant_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.CONSTANT,
                    info: {
                        position: {
                            line: line,
                            column: 0
                        },
                        name: names[i].trim(),
                        description: ""
                    },
                    type: "",
                    default_value: ""
                };
                elements.push(element);
            }
        }
        else if (cursor.nodeType === 'subtype_indication') {
            for (let i = 0; i < elements.length; ++i) {
                elements[i].type = cursor.nodeText;
            }
        }
        else if (cursor.nodeType === 'default_expression') {
            let normalized_value = cursor.nodeText;
            normalized_value = normalized_value.trim().replace(':=', '');
            normalized_value = normalized_value.trim().replace(': =', '');
            for (let i = 0; i < elements.length; ++i) {
                elements[i].default_value = normalized_value.trim();
            }
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return elements;
}

//******************************************************************************
//******************************************************************************
// Instantiation
//******************************************************************************
//******************************************************************************
export function get_instantiation(p: any): common_hdl.Instantiation_hdl[] {
    let name = '';
    const element: common_hdl.Instantiation_hdl = {
        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.INSTANTIATION,
        info: {
            position: {
                line: 0,
                column: 0
            },
            name: "",
            description: ""
        },
        type: ""
    };

    const break_p = false;
    const cursor = p.walk();
    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'label') {
            name = cursor.nodeText.replace(':', '').trim();
        }
        else if (cursor.nodeType === 'component_instantiation') {
            element.type = cursor.nodeText;
        }
        else if (cursor.nodeType === 'entity_instantiation') {
            const regex = /entity+[ \t]/gi;
            element.type = cursor.nodeText.replace(regex, '');
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    if (name === '') {
        element.info.name = 'unnamed';
    }
    else {
        element.info.name = name;
    }
    return [element];
}

//******************************************************************************
//******************************************************************************
// Generic and ports
//******************************************************************************
//******************************************************************************
export function get_generics_and_ports(p: any, comment_symbol: string) {
    let generics: common_hdl.Port_hdl[] = [];
    let ports: common_hdl.Port_hdl[] = [];
    const break_p = false;
    const cursor = p.walk();
    cursor.gotoFirstChild();

    do {
        if (cursor.nodeType === 'generic_clause') {
            generics = get_generics_or_ports(cursor.currentNode(), comment_symbol);
        }
        else if (cursor.nodeType === 'port_clause') {
            ports = get_generics_or_ports(cursor.currentNode(), comment_symbol);
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return { 'generics': generics, 'ports': ports };
}

export function get_generics_or_ports(p: any, comment_symbol: string): common_hdl.Port_hdl[] {
    const break_p = false;
    const elements_array: common_hdl.Port_hdl[] = [];

    const cursor = p.walk();
    let comments = '';

    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'constant_interface_declaration') {
            const elements: common_hdl.Port_hdl[] = get_port_generic_element(cursor.currentNode());
            for (let i = 0; i < elements.length; ++i) {
                elements[i].info.description = comments.trimStart();
                elements[i].over_comment = comments.trimStart();
                elements_array.push(elements[i]);
            }
            comments = '';
        }
        else if (cursor.nodeType === 'signal_interface_declaration') {
            const elements: common_hdl.Port_hdl[] = get_port_generic_element(cursor.currentNode());
            for (let i = 0; i < elements.length; ++i) {
                elements[i].info.description = comments.trimStart();
                elements[i].over_comment = comments.trimStart();
                elements_array.push(elements[i]);
            }
            comments = '';
        }
        else if (cursor.nodeType === 'comment') {
            let txt_comment = cursor.nodeText.slice(2);
            const comment_line = cursor.startPosition.row;
            if (txt_comment[0] === comment_symbol || comment_symbol === '') {
                if (txt_comment.charAt(txt_comment.length - 1) === '\n'
                    || txt_comment.charAt(txt_comment.length - 1) === '\r') {
                    txt_comment = txt_comment.slice(0, -1);
                }
                let check = false;
                //Constants
                for (let i = 0; i < elements_array.length; ++i) {
                    if (comment_line === elements_array[i].info.position.line) {
                        if (comment_symbol === '') {
                            elements_array[i].info.description = txt_comment.trimStart();
                            elements_array[i].inline_comment = txt_comment.trimStart();
                        }
                        else {4
                            elements_array[i].info.description = txt_comment.slice(1).trimStart();
                            elements_array[i].inline_comment = txt_comment.slice(1).trimStart();
                        }
                        check = true;
                    }
                }
                if (check === false) {
                    comments += txt_comment.slice(1) + "\n";
                }
            }
        }
        else {
            comments = '';
        }
    } while (cursor.gotoNextSibling() === true && break_p === false);
    return elements_array;
}

function get_port_generic_element(p: any): common_hdl.Port_hdl[] {
    const break_p = false;
    let line = undefined;
    const elements_array = [];
    const cursor = p.walk();
    let identifiers = [];
    let type = '';
    let direction = '';
    let default_value = '';

    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'identifier_list') {
            identifiers = utils_hdl.get_identifier_of_list(cursor.currentNode());
            line = cursor.startPosition.row;
        }
        else if (cursor.nodeType === 'subtype_indication') {
            type = cursor.nodeText;
        }
        else if (cursor.nodeType === 'mode') {
            direction = cursor.nodeText;
        }
        else if (cursor.nodeType === 'default_expression') {
            let normalized_value = cursor.nodeText;
            normalized_value = normalized_value.replace(':=', '');
            normalized_value = normalized_value.replace(': =', '');
            default_value = normalized_value.trim();
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);

    if (direction === undefined) {
        direction = '';
    }
    for (let i = 0; i < identifiers.length; ++i) {
        const element: common_hdl.Port_hdl = {
            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
            info: {
                position: {
                    line: line,
                    column: 0
                },
                name: identifiers[i],
                description: ""
            },
            type: type,
            subtype: "",
            inline_comment: "",
            over_comment: "",
            direction: direction.toLocaleLowerCase(),
            default_value: default_value
        };
        elements_array.push(element);
    }
    return elements_array;
}

export function get_record_elements(p: any, comment_symbol: string): common_hdl.Record_hdl[] {
    const break_p = false;
    const elements_array: common_hdl.Record_hdl[] = [];
    const identifiers = [];
    const inline_comment = [];
    let txt_comment = "";
    let has_comment = true;
    const type = [];
    let line = undefined;
    const cursor = p.walk();

    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'element_declaration') {
            //if last identifier doesnt have comment, push empty string to avoid comment shifting.
            if(!has_comment){
                inline_comment.push("");
            }
            has_comment = false;
            const full_element = cursor.nodeText;
            const splitted_element = full_element.split(':');
            splitted_element[0] = splitted_element[0].replace(' ','');
            splitted_element[1] = splitted_element[1].replace(';','');
            splitted_element[1] = splitted_element[1].replace(' ','');
            identifiers.push(splitted_element[0]);
            type.push(splitted_element[1]);
            line = cursor.startPosition.row;
        }
        else if (cursor.nodeType === 'comment') {
            txt_comment = cursor.nodeText.slice(2);
            if (txt_comment[0] === comment_symbol || comment_symbol === '') {
                if (txt_comment.charAt(txt_comment.length - 1) === '\n'
                    || txt_comment.charAt(txt_comment.length - 1) === '\r') {
                    txt_comment = txt_comment.slice(0, -1);
                }
                if(txt_comment){
                    txt_comment = txt_comment.replace('!', ''); //TODO: BUG?
                }
                inline_comment.push(txt_comment.trimStart());
            }
            has_comment = true;
        }
    } while (cursor.gotoNextSibling() === true && break_p === false);

    for (let i = 0; i < identifiers.length; ++i) {
        const element: common_hdl.Record_hdl = {
            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.RECORD,
            info: {
                position: {
                    line: line,
                    column: 0
                },
                name: identifiers[i],
                description: inline_comment[i]
            },
            type: type[i],
            inline_comment: inline_comment[i]
        };
        elements_array.push(element);
    }

    return elements_array;
}

export function get_enum_elements(p: any, comment_symbol: string): common_hdl.Enum_hdl[] {
    const break_p = false;
    const elements_array: common_hdl.Enum_hdl[] = [];
    const identifiers = [];
    const inline_comment = [];
    let has_comment = true;
    let line = undefined;
    const cursor = p.walk();

    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'identifier') {
            //if last identifier doesnt have comment, push empty string to avoid comment shifting.
            if(!has_comment){
                inline_comment.push("");
            }
            has_comment = false;
            const full_element = cursor.nodeText;
            //const splitted_element = full_element.split(':');
            //splitted_element[0] = splitted_element[0].replace(' ','');
            //splitted_element[1] = splitted_element[1].replace(';','');
            //splitted_element[1] = splitted_element[1].replace(' ','');
            identifiers.push(full_element);
            //type.push(splitted_element[1]);
            line = cursor.startPosition.row;
        }
        else if (cursor.nodeType === 'comment') {
            let txt_comment = cursor.nodeText.slice(2);
            if (txt_comment[0] === comment_symbol || comment_symbol === '') {
                if (txt_comment.charAt(txt_comment.length - 1) === '\n'
                    || txt_comment.charAt(txt_comment.length - 1) === '\r') {
                    txt_comment = txt_comment.slice(0, -1);
                }
                txt_comment = txt_comment.replace('!', '');
                inline_comment.push(txt_comment.trimStart());
            }
            has_comment = true;
        }
    } while (cursor.gotoNextSibling() === true && break_p === false);

    for (let i = 0; i < identifiers.length; ++i) {
        const element: common_hdl.Enum_hdl = {
            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.ENUM,
            info: {
                position: {
                    line: line,
                    column: 0
                },
                name: identifiers[i],
                description: inline_comment[i]
            },
            type: "",
            inline_comment: inline_comment[i]
        };
        elements_array.push(element);
    }

    return elements_array;
}