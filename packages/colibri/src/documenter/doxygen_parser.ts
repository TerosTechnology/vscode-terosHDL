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

import * as common_hdl from "../parser/common";

export const DOXYGEN_FIELD_ARRAY = ['author', 'version', 'project', 'copyright', 'brief', 'details',
    'custom_section_begin', 'custom_section_end', 'file', 'title', 'date'];

export type Doxygen_element = {
    field: string;
    description: string;
}

export function parse_doxygen(text: string) {
    // Always remove carriage return
    // text_s = text.replace(/\r/gm, "");
    let text_s_new = "";
    let doxygen_element_list: Doxygen_element[] = [];

    text = text.replace(/\r/gm, "");

    const text_s = text.split('\n');

    text_s.forEach(function (line: string) {
        let is_doxy = false;
        for (let i = 0; i < DOXYGEN_FIELD_ARRAY.length; i++) {
            const field = DOXYGEN_FIELD_ARRAY[i];
            const result = parse_element(field, line);
            doxygen_element_list = doxygen_element_list.concat(result.element_list);
            text = result.text;
            if (result.element_list.length !== 0) {
                is_doxy = true;
                break;
            }
        }
        if (is_doxy === false) {
            if (line.trim() === '') {
                text_s_new += `${line.trim()}\n`;
            }
            else {
                text_s_new += `${line.trim()}\n`;
            }
        }
    });
    return { 'text': text_s_new, 'element_list': doxygen_element_list };
}

export function parse_virtualbus_init(description: string) {
    const result = {
        is_in: false,
        name: '',
        direction: 'in',
        notable: false,
        description: '',
        to_delete: ''
    };

    const description_sp = description.split('\n');
    for (let i = 0; i < description_sp.length; i++) {
        const text = description_sp[i].trim();
        result.to_delete = description_sp[i];

        //Notable ports
        const notable_element = is_notable(text);
        let corpus = text;
        if (notable_element.is_in === true) {
            result.notable = true;
            corpus = notable_element.text;
        }
        //Port name
        const virtual_port_element = parse_element('virtualbus', corpus);
        if (virtual_port_element.element_list.length === 0) {
            return result;
        }
        corpus = virtual_port_element.element_list[0].description.trim();
        let element_0 = get_first_element(corpus);
        result.name = element_0.name;
        result.is_in = true;
        corpus = element_0.text.trim();

        // Direction
        const direction_port_element = parse_element('dir', corpus);
        if (direction_port_element.element_list.length === 0) {
            result.description = corpus.trim();
            return result;
        }
        corpus = direction_port_element.element_list[0].description.trim();
        element_0 = get_first_element(corpus);
        result.direction = element_0.name;
        result.description = element_0.text.trim();
        if (result.is_in === true) {
            return result;
        }
    }
    return result;
}

function is_notable(text: string) {
    const regex = /@notable/gms;
    const element_parser = text.match(regex);
    const result = {
        text: text,
        is_in: false
    };
    if (element_parser !== null) {
        result.is_in = true;
        result.text = text.replace(regex, '');
    }
    return result;
}

function get_first_element(text: string) {
    let corpus_split = text.split(' ');
    const name = corpus_split[0];
    corpus_split = corpus_split.splice(1);
    const corpus_serial = corpus_split.join(' ');
    return { name: name, text: corpus_serial };
}

export function parse_virtualbus_end(text: string) {
    const result = {
        is_in: false,
        text: ""
    };
    const regex = /@end/gms;
    const element = text.match(regex);
    if (element !== null) {
        result.is_in = true;
        result.text = text.replace(regex, '');
    }
    return result;
}

export function get_virtual_bus(port_list: common_hdl.Port_hdl[]) {
    enum state_e {
        INIT = 0,
        WAIT_FOR_BUS = 1,
        WAIT_FOR_END = 2,
        ERROR = 2
    }

    const normal_port_list: common_hdl.Port_hdl[] = [];
    const virtual_bus_list: common_hdl.Virtual_bus_hdl[] = [];

    let state: state_e = state_e.WAIT_FOR_BUS;

    let virtual_bus: common_hdl.Virtual_bus_hdl;
    let double_check = false;

    const number_of_ports = port_list.length;
    port_list.forEach(function callback(port_i, index) {
        const port_description = port_i.info.description.trim();
        const port_description_over = port_i.over_comment.trim();

        // Search virtual bus
        if (state === state_e.WAIT_FOR_BUS) {
            let virtual_port = parse_virtualbus_init(port_description);
            if (virtual_port.is_in === false) {
                virtual_port = parse_virtualbus_init(port_description_over);
            }
            if (virtual_port.is_in === true) {
                // Create virtual bus
                const virtual_port_instance: common_hdl.Virtual_bus_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.VIRTUAL_BUS,
                    info: {
                        position: {
                            line: 0,
                            column: 0
                        },
                        name: virtual_port.name,
                        description: virtual_port.description
                    },
                    direction: virtual_port.direction,
                    notable: virtual_port.notable,
                    port_list: [],
                    type: "virtual_bus"
                };
                const clean_port: common_hdl.Port_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
                    info: {
                        position: port_i.info.position,
                        name: port_i.info.name,
                        description: port_description.replace(virtual_port.to_delete, '')
                    },
                    inline_comment: "",
                    over_comment: "",
                    direction: port_i.direction,
                    default_value: port_i.default_value,
                    type: port_i.type,
                    subtype: port_i.subtype
                };
                virtual_port_instance.port_list.push(clean_port);
                virtual_bus = virtual_port_instance;
                state = state_e.WAIT_FOR_END;
            }
            else {
                normal_port_list.push(port_i);
            }
        }
        // Search end of virtual bus
        else if (state === state_e.WAIT_FOR_END) {
            // Search end in current port
            let virtual_port_end = parse_virtualbus_end(port_description);
            const virtual_port_init = parse_virtualbus_init(port_description);
            // Search end in next port
            if (index < number_of_ports - 1 && virtual_port_end.is_in === false) {
                virtual_port_end = parse_virtualbus_end(port_list[index + 1].over_comment);
                if (virtual_port_end.is_in === true) {
                    port_list[index + 1].info.description = port_list[index + 1].info.description.replace('@end', '');
                }
            }
            else if (index === number_of_ports - 1 && virtual_port_end.is_in === false) {
                virtual_port_end.is_in = true;
            }

            double_check = false;
            // New virtual bus
            if (virtual_port_init.is_in === true) {
                state = state_e.WAIT_FOR_BUS;
                virtual_bus_list.push(virtual_bus);
                double_check = true;
            }
            else if (virtual_port_end.is_in === true) {
                const clean_port: common_hdl.Port_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
                    info: {
                        position: port_i.info.position,
                        name: port_i.info.name,
                        description: port_i.info.description.replace('@end', '')
                    },
                    inline_comment: "",
                    over_comment: "",
                    direction: port_i.direction,
                    default_value: port_i.default_value,
                    type: port_i.type,
                    subtype: port_i.subtype
                };
                virtual_bus.port_list.push(clean_port);
                virtual_bus_list.push(virtual_bus);
                state = state_e.WAIT_FOR_BUS;
            }
            else {
                virtual_bus.port_list.push(port_i);
            }
        }

        if (double_check === true) {
            const virtual_port = parse_virtualbus_init(port_description);
            if (virtual_port.is_in === true) {
                // Create virtual bus
                const virtual_port_instance: common_hdl.Virtual_bus_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.VIRTUAL_BUS,
                    info: {
                        position: {
                            line: 0,
                            column: 0
                        },
                        name: virtual_port.name,
                        description: virtual_port.description
                    },
                    direction: virtual_port.direction,
                    notable: virtual_port.notable,
                    port_list: [],
                    type: "virtual_bus"
                };
                const clean_port: common_hdl.Port_hdl = {
                    hdl_element_type: common_hdl.TYPE_HDL_ELEMENT.PORT,
                    info: {
                        position: port_i.info.position,
                        name: port_i.info.name,
                        description: ""
                    },
                    inline_comment: "",
                    over_comment: "",
                    direction: port_i.direction,
                    default_value: port_i.default_value,
                    type: port_i.type,
                    subtype: port_i.subtype
                };
                virtual_port_instance.port_list.push(clean_port);
                virtual_bus = virtual_port_instance;
                state = state_e.WAIT_FOR_END;
            }
            else {
                normal_port_list.push(port_i);
            }
        }
    });
    return { port_list: normal_port_list, v_port_list: virtual_bus_list };
}

function parse_element(field: string, text: string) {
    const regex_field = new RegExp(`^s*[@]${field}\\s.*`, 'gms');
    const doxygen_element_list: Doxygen_element[] = [];

    text = text.trim();

    const element_parser = text.match(regex_field);
    if (element_parser !== null) {

        const doxygen_element: Doxygen_element = {
            field: "",
            description: ""
        };

        doxygen_element.field = field;
        doxygen_element.description = text.replace(`@${field}`, '');
        doxygen_element_list.push(doxygen_element);
    }
    return { 'text': text, 'element_list': doxygen_element_list };
}