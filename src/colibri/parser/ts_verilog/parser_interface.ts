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

import * as elements_hdl from "./elements";
import * as utils from './utils';
import { LANGUAGE } from "../../common/general";
import * as common_hdl from "../common";

export type Interface_items = {
    modport: common_hdl.Modport_hdl[];
    logic: common_hdl.Logic_hdl[];
    custom: common_hdl.Custom_hdl[];
};


export class Parser_interface {

    get_interfaces(tree: any, lines: any, general_comments: any, comment_symbol: string): common_hdl.Hdl_element {
        const interface_array: common_hdl.Hdl_element[] = [];
        let type_array: common_hdl.Type_hdl[] = [];

        let last_element_position = -1;
        const generics_types = ['interface_declaration'];
        let comments = '';
        let comments_description = '';
        let ansi_header = false;

        const cursor = tree.walk();
        cursor.gotoFirstChild();
        do {
            if (generics_types.includes(cursor.nodeType) === true) {

                const interface_i = new common_hdl.Hdl_element(LANGUAGE.VERILOG, common_hdl.TYPE_HDL_ELEMENT.INTERFACE);
                let parameters: common_hdl.Port_hdl[] = [];
                let ports: common_hdl.Port_hdl[] = [];
                let modport_array: common_hdl.Modport_hdl[] = [];
                let logic_array: common_hdl.Logic_hdl[] = [];
                let custom_array: common_hdl.Custom_hdl[] = [];
                let interface_name = '';

                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'interface_nonansi_header') {
                        interface_name = this.get_interface_name(cursor.currentNode());
                        comments = '';
                    } else if (cursor.nodeType === 'interface_ansi_header') {
                        ansi_header = true;
                        interface_name = this.get_interface_name_ansi(cursor.currentNode());
                        parameters = elements_hdl.get_ansi_generics(cursor.currentNode(), lines, general_comments,
                            comment_symbol);
                        ports = elements_hdl.get_ansi_ports(cursor.currentNode(), lines, general_comments,
                            comment_symbol);

                    } else if (cursor.nodeType === 'interface_item' || cursor.nodeType === 'non_port_interface_item'
                        || cursor.nodeType === 'interface_or_generate_item'
                        || cursor.nodeType === 'modport_declaration') {
                        last_element_position = cursor.startPosition.row;

                        const new_interface_items = this.get_interface_items(cursor.currentNode(),
                            general_comments, ansi_header, comment_symbol);

                        let new_modport = new_interface_items.modport;
                        new_modport = utils.set_description_to_array(new_modport,
                            comments, general_comments, comment_symbol);
                        modport_array = modport_array.concat(new_modport);

                        let new_logic = new_interface_items.logic;
                        new_logic = utils.set_description_to_array(new_logic,
                            comments, general_comments, comment_symbol);
                        logic_array = logic_array.concat(new_logic);

                        let new_custom = new_interface_items.custom;
                        new_custom = utils.set_description_to_array(new_custom,
                            comments, general_comments, comment_symbol);
                        custom_array = custom_array.concat(new_custom);

                        comments = '';
                    } else if (cursor.nodeType === 'comment') {
                        const comment_position = cursor.startPosition.row;
                        if (last_element_position !== comment_position) {
                            comments += utils.get_comment_with_break(cursor.nodeText, comment_symbol);
                        } else {
                            comments = '';
                        }
                    } else {
                        comments = '';
                    }
                }
                while (cursor.gotoNextSibling() !== false);
                cursor.gotoParent();

                interface_i.name = interface_name;
                interface_i.description = comments_description;

                modport_array.forEach(element => {
                    interface_i.add_modport(element);
                });

                logic_array.forEach(element => {
                    interface_i.add_logic(element);
                });

                custom_array.forEach(element => {
                    interface_i.add_custom(element);
                });

                ports.forEach(element => {
                    interface_i.add_port(element);
                });

                parameters.forEach(element => {
                    interface_i.add_generic(element);
                });

                interface_array.push(interface_i);
                comments_description = '';
            }
            else if (cursor.nodeType === 'package_or_generate_item_declaration') {
                const new_type = this.get_types(cursor.currentNode());

                const data_types = this.get_data_from_type(cursor.currentNode(), general_comments, comment_symbol);
                for (const type_inst of new_type) {
                    type_inst.info.description = comments_description;
                    type_inst.logic = data_types;
                }

                type_array = type_array.concat(new_type);
                comments_description = '';
            }
            else if (cursor.nodeType === 'comment') {
                comments_description += utils.get_comment_with_break(cursor.nodeText, comment_symbol);
            }
        }
        while (cursor.gotoNextSibling() !== false);

        const interface_declaration = new common_hdl.Hdl_element(LANGUAGE.VERILOG,
            common_hdl.TYPE_HDL_ELEMENT.INTERFACE_DECLARATION);

        interface_array.forEach(element => {
            interface_declaration.add_interface(element);
        });

        type_array.forEach(element => {
            interface_declaration.add_type(element);
        });

        return interface_declaration;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Name
    ////////////////////////////////////////////////////////////////////////////
    get_interface_name(tree: any) {
        let interface_name = '';
        const interface_name_search = utils.search_multiple_in_tree(tree, 'interface_identifier');
        if (interface_name_search.length !== 0) {
            interface_name = interface_name_search[0].text;
        }
        return interface_name;
    }

    get_interface_name_ansi(tree: any): string {
        let interface_name = '';
        const interface_name_search = utils.search_multiple_in_tree(tree, 'interface_identifier');
        if (interface_name_search.length !== 0) {
            interface_name = interface_name_search[0].text;
        }
        return interface_name;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Interface
    ////////////////////////////////////////////////////////////////////////////
    get_interface_items(tree: any, general_comments: any, ansi_header: any, comment_symbol: string): Interface_items {
        let child;

        let modport_array: common_hdl.Modport_hdl[] = [];
        let logic_array: common_hdl.Logic_hdl[] = [];
        let custom_array: common_hdl.Custom_hdl[] = [];
        const interface_items: Interface_items = {
            modport: [],
            logic: [],
            custom: []
        };

        if (ansi_header === false) {
            child = utils.search_multiple_in_tree(tree, 'non_port_interface_item');
            if (child.length !== 1) {
                return interface_items;
            }
        }
        else {
            child = [tree];
        }

        const child_modport = utils.search_multiple_in_tree(child[0], 'modport_declaration');
        const child_other = utils.search_multiple_in_tree(child[0], 'interface_or_generate_item');

        if (child_modport.length === 1) {
            const new_modport = this.get_modport_interface_items(child_modport[0], general_comments, comment_symbol);
            modport_array = modport_array.concat(new_modport);
        }
        else if (child_other.length === 1) {
            const new_logic = this.get_other_interface_items(child_other[0]);
            const new_custom = this.get_other_interface_items2(child_other[0]);

            logic_array = logic_array.concat(new_logic);
            custom_array = custom_array.concat(new_custom);



            // if (new_custom.length >= 0) {
            //     if (new_custom[0].hdl_element_type === common_hdl.Logic_hdl) {
            //         logic_array = logic_array.concat(new_custom);
            //     }
            //     else {
            //         custom_array = custom_array.concat(new_custom);
            //     }
            // }
        }
        else {
            interface_items.modport = modport_array;
            interface_items.logic = logic_array;
            interface_items.custom = custom_array;
            return interface_items;
        }

        interface_items.modport = modport_array;
        interface_items.logic = logic_array;
        interface_items.custom = custom_array;
        return interface_items;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Custom
    ////////////////////////////////////////////////////////////////////////////
    get_other_interface_items(tree: any): common_hdl.Logic_hdl[] {
        const items: common_hdl.Logic_hdl[] = [];
        const data_declaration = utils.search_multiple_in_tree(tree, 'data_declaration');

        if (data_declaration.length === 1) {
            const item_name = utils.search_multiple_in_tree(data_declaration[0], 'list_of_variable_decl_assignments');
            const item_type = utils.search_multiple_in_tree(data_declaration[0], 'data_type_or_implicit1');
            if (item_name.length === 1 && item_type.length === 1) {
                const item_names = item_name[0].text.split(',');
                for (const name_inst of item_names) {
                    const start_line = item_name[0].startPosition.row;
                    if (name_inst.includes('logic')) {
                        const custom_item: common_hdl.Logic_hdl = {
                            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.LOGIC,
                            info: {
                                position: {
                                    line: start_line,
                                    column: 0
                                },
                                name: name_inst,
                                description: ""
                            },
                            type: item_type[0].text
                        };
                        items.push(custom_item);
                    }
                }
            }
            return items;
        }

        const net_declaration = utils.search_multiple_in_tree(tree, 'net_declaration');
        if (net_declaration.length === 1) {
            const item_name = utils.search_multiple_in_tree(net_declaration[0], 'list_of_net_decl_assignments');
            const item_type = utils.get_item_from_childs(data_declaration[0], 'simple_identifier');
            if (item_name.length === 1 && item_type !== undefined) {
                const item_names = item_name[0].text.split(',');
                for (const name_inst of item_names) {
                    const start_line = item_name[0].startPosition.row;

                    if (name_inst.includes('logic')) {
                        const custom_item: common_hdl.Logic_hdl = {
                            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.LOGIC,
                            info: {
                                position: {
                                    line: start_line,
                                    column: 0
                                },
                                name: name_inst,
                                description: ""
                            },
                            type: item_type.text
                        };
                        items.push(custom_item);
                    }
                }
            }
        }
        return items;
    }

    get_other_interface_items2(tree: any): common_hdl.Custom_hdl[] {
        const items: common_hdl.Custom_hdl[] = [];
        const data_declaration = utils.search_multiple_in_tree(tree, 'data_declaration');

        if (data_declaration.length === 1) {
            const item_name = utils.search_multiple_in_tree(data_declaration[0], 'list_of_variable_decl_assignments');
            const item_type = utils.get_item_from_childs(data_declaration[0], 'simple_identifier');
            if (item_name.length === 1 && item_type !== undefined) {
                const item_names = item_name[0].text.split(',');
                for (const name_inst of item_names) {
                    const start_line = item_name[0].startPosition.row;
                    if (name_inst.includes('logic') === false) {
                        const custom_item: common_hdl.Custom_hdl = {
                            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.CUSTOM,
                            info: {
                                position: {
                                    line: start_line,
                                    column: 0
                                },
                                name: name_inst,
                                description: ""
                            },
                            type: item_type.text
                        };
                        items.push(custom_item);
                    }
                }
            }
            return items;
        }

        const net_declaration = utils.search_multiple_in_tree(tree, 'net_declaration');
        if (net_declaration.length === 1) {
            const item_name = utils.search_multiple_in_tree(net_declaration[0], 'list_of_net_decl_assignments');
            const item_type = utils.get_item_from_childs(net_declaration[0], 'simple_identifier');
            if (item_name.length === 1 && item_type !== undefined) {
                const item_names = item_name[0].text.split(',');
                for (const name_inst of item_names) {
                    const start_line = item_name[0].startPosition.row;

                    if (name_inst.includes('logic') === false) {
                        const custom_item: common_hdl.Custom_hdl = {
                            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.CUSTOM,
                            info: {
                                position: {
                                    line: start_line,
                                    column: 0
                                },
                                name: name_inst,
                                description: ""
                            },
                            type: item_type.text
                        };
                        items.push(custom_item);
                    }
                }
            }
        }
        return items;
    }

    get_custom_interface_items(tree: any): common_hdl.Custom_hdl[] {
        const items: any = [];
        const data_declaration = utils.search_multiple_in_tree(tree, 'net_declaration');
        if (data_declaration.length === 1) {
            const type = utils.search_multiple_in_tree(tree, 'net_type_identifier');
            const name = utils.search_multiple_in_tree(tree, 'list_of_net_decl_assignments');
            if (type.length !== 1 || name.length !== 1) {
                return [];
            }

            const type_str = type[0].text;
            const item_name = name[0].text;
            const item_names = item_name.split(',');
            for (const element of item_names) {
                const start_line = name[0].startPosition.row;
                const custom_item: common_hdl.Custom_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.CUSTOM,
                    info: {
                        position: {
                            line: start_line,
                            column: 0
                        },
                        name: element,
                        description: ""
                    },
                    type: type_str
                };
                items.push(custom_item);
            }
        }
        return items;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Logic
    ////////////////////////////////////////////////////////////////////////////
    get_logic_interface_items(tree: any): common_hdl.Logic_hdl[] {
        const items: common_hdl.Logic_hdl[] = [];
        const data_declaration = utils.search_multiple_in_tree(tree, 'net_declaration');
        if (data_declaration.length === 1) {
            const type = utils.search_multiple_in_tree(tree, 'net_type_identifier');
            const name = utils.search_multiple_in_tree(tree, 'list_of_net_decl_assignments');
            if (type.length !== 1 || name.length !== 1) {
                return [];
            }

            const type_str = type[0].text;
            const item_name = name[0].text;
            const item_names = item_name.split(',');
            for (const element of item_names) {
                const start_line = name[0].startPosition.row;
                const logic_item: common_hdl.Logic_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.LOGIC,
                    info: {
                        position: {
                            line: start_line,
                            column: 0
                        },
                        name: element,
                        description: ""
                    },
                    type: type_str
                };
                items.push(logic_item);
            }
        }
        return items;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Modport
    ////////////////////////////////////////////////////////////////////////////
    get_modport_interface_items(tree: any, general_comments: common_hdl.Modport_hdl[], comment_symbol: string) {
        let modport_identifier = '';
        const last_element_position = -1;
        let comments = '';

        let port_array: common_hdl.Port_hdl[] = [];
        const modport_item = utils.search_multiple_in_tree(tree, 'modport_item');
        if (modport_item.length !== 1) {
            return [];
        }
        const child = modport_item[0];

        const cursor = child.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === "modport_identifier") {
                modport_identifier = cursor.nodeText;
            } else if (cursor.nodeType === 'modport_ports_declaration') {
                let new_ports = this.get_morport_ports(cursor.currentNode());
                new_ports = utils.set_description_to_array(new_ports,
                    comments, general_comments, comment_symbol);
                port_array = port_array.concat(new_ports);

                comments = '';

            } else if (cursor.nodeType === 'comment') {
                const comment_position = cursor.startPosition.row;
                if (last_element_position !== comment_position) {
                    comments += utils.get_comment_with_break(cursor.nodeText, comment_symbol);
                } else {
                    comments = '';
                }
            } else {
                comments = '';
            }
        }
        while (cursor.gotoNextSibling() !== false);

        const start_line = child.startPosition.row;
        const modport: common_hdl.Modport_hdl = {
            hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.MODPORT,
            info: {
                position: {
                    line: start_line,
                    column: 0
                },
                name: modport_identifier.trim(),
                description: ""
            },
            ports: port_array
        };

        return [modport];
    }

    get_morport_ports(tree: any): common_hdl.Port_hdl[] {
        const ports: common_hdl.Port_hdl[] = [];
        const data_declaration = utils.search_multiple_in_tree(tree, "modport_simple_ports_declaration");
        if (data_declaration.length === 1) {
            const child = data_declaration[0];

            const direction_item = utils.search_multiple_in_tree(tree, "port_direction");
            const identifier_item = utils.search_multiple_in_tree(tree, "modport_simple_port");

            if (direction_item.length === 1 && identifier_item.length === 1) {
                const item_name = identifier_item[0].text;
                const item_names = item_name.split(',');
                for (let i = 0; i < item_names.length; i++) {
                    const element = item_names[i];
                    const start_line = child.startPosition.row;

                    const port_i: common_hdl.Port_hdl = {
                        hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
                        info: {
                            position: {
                                line: start_line,
                                column: 0
                            },
                            name: element,
                            description: ""
                        },
                        type: '',
                        inline_comment: "",
                        over_comment: "",
                        subtype: "",
                        direction: direction_item[0].text,
                        default_value: ''
                    };
                    ports.push(port_i);
                }
            }
            else {
                return ports;
            }
        }
        return ports;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Type
    ////////////////////////////////////////////////////////////////////////////
    get_types(tree: any): common_hdl.Type_hdl[] {
        const items = [];
        const data_declaration = utils.search_multiple_in_tree(tree, 'type_declaration');
        if (data_declaration.length === 1) {
            const data_declaration_inst = data_declaration[0];

            const typedef = utils.search_multiple_in_tree(data_declaration_inst, 'typedef');
            const type = utils.search_multiple_in_tree(data_declaration_inst, 'data_type');
            const name = utils.get_item_from_childs(data_declaration_inst, 'simple_identifier');

            if (typedef.length === 1 && type.length === 1 && name !== undefined) {
                const type_item: common_hdl.Type_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.TYPE,
                    info: {
                        position: {
                            line: name.startPosition.row,
                            column: 0
                        },
                        name: name.text,
                        description: ""
                    },
                    type: type[0].text,
                    inline_comment: "",
                    is_enum: false,
                    is_record: false,
                    enum_elements: [],
                    record_elements: [],
                    logic: []
                };

                items.push(type_item);
            }
        }
        return items;
    }

    get_get_logic_from_type(tree: any): common_hdl.Logic_hdl[] {
        const items = [];
        const item_name = utils.search_multiple_in_tree(tree, 'list_of_variable_decl_assignments');
        const item_type = utils.search_multiple_in_tree(tree, 'data_type_or_void');
        if (item_name.length === 1 && item_type.length === 1) {
            const item_names = item_name[0].text.split(',');
            for (const name_inst of item_names) {
                const start_line = item_name[0].startPosition.row;
                const logic_item: common_hdl.Logic_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.LOGIC,
                    info: {
                        position: {
                            line: start_line,
                            column: 0
                        },
                        name: name_inst,
                        description: ""
                    },
                    type: item_type[0].text
                };
                items.push(logic_item);
            }
        }
        return items;
    }

    get_data_from_type(tree_type: any, general_comments: any, comment_symbol: string) {
        let datas: any = [];

        const search_0 = utils.search_multiple_in_tree(tree_type, 'data_declaration');
        if (search_0.length !== 1) {
            return datas;
        }
        const search_1 = utils.search_multiple_in_tree(search_0[0], 'type_declaration');
        if (search_1.length !== 1) {
            return datas;
        }
        const search_2 = utils.search_multiple_in_tree(search_1[0], 'data_type');
        if (search_2.length !== 1) {
            return datas;
        }

        const node_search = search_2[0];
        // struct_union_member'
        let comments = '';
        const last_element_position = -1;

        const cursor = node_search.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'struct_union_member') {
                let new_logic = this.get_get_logic_from_type(cursor.currentNode());
                new_logic = utils.set_description_to_array(new_logic, comments, general_comments, comment_symbol);
                datas = datas.concat(new_logic);
                comments = '';
            } else if (cursor.nodeType === 'comment') {
                const comment_position = cursor.startPosition.row;
                if (last_element_position !== comment_position) {
                    comments += utils.get_comment_with_break(cursor.nodeText, comment_symbol);
                } else {
                    comments = '';
                }
            } else {
                comments = '';
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return datas;
    }


}

