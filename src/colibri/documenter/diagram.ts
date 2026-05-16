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
import * as doxygen from "./doxygen_parser";

// Input definition text
const INPUT_LABEL_LIST = ['in', 'input'];
// Output, Inout and buffer definition text
const OUTPUT_LABEL_LIST = ['out', 'output', 'inout', 'buffer'];

/**
 * Type to selects the black and white image
 */
export type Diagram_options = {
    blackandwhite: boolean;
};

/**
 * This function generates the image of the ports and generics
 * 
 * @param structure Structure with the HDL code
 * @param opt Option to select the black and white image
 *      - True: black and white image
 *      - False: colored image
 * @returns string with the generated svg image
 * 
 * @note Inout ports are drawing as an output ports
 */
export function diagram_generator(structure: common_hdl.Hdl_element, opt: Diagram_options): string {
    // Definition of the SVG elements
    const window = require('svgdom');
    const SVG = require('svg.js')(window);
    const document = window.document;

    // Define the canvas to draw
    const canvas = SVG(document.documentElement);
    // Clear the SVG element
    canvas.clear();

    // Definitions

    // Border color
    let border = 'black';
    // Generic box color
    let genBox = '#b6e4ec';
    // Ports box color
    let portBox = '#fdfd96';

    // Location of the position to draw
    let locx = 200;
    let locy = 0;
    let width = 100;
    let high = 100;
    let total_high = 100;

    // Constant values to draw
    const SIZE = 20;
    const FONT = 'Helvetica';
    const OFFSET = 20;
    const TEXT_OFFSET = 7;
    const TEXT_SPACE = 15;
    const TEXT_SPACE_PIN = TEXT_SPACE / 3;
    const SEPARATOR = 10;
    const BOX_WIDTH = 2;
    const CORNER_RADIUS = 12;

    // Constant with the field value
    const NAME_FIELD = 0;
    const TYPE_FIELD = 1;

    
    // Black and white image
    if (opt.blackandwhite) {
        border = 'black';
        genBox = 'white';
        portBox = 'white';
    }

    // Get the generics
    let generics = get_generics(structure, NAME_FIELD, TYPE_FIELD);
    // Get the input ports
    let in_ports = get_ports_in(structure, NAME_FIELD, TYPE_FIELD);
    // Get the output ports
    let out_ports = get_ports_out(structure, NAME_FIELD, TYPE_FIELD);
    // Get the location in X-axis
    locx = (SIZE / 2) * max_string(generics, in_ports, [0, 0], TYPE_FIELD) + 2 * OFFSET;
    // Get the width of the generics, input ports and output ports.
    width = (SIZE / 2) * (max_string(generics, in_ports, [0, 0], NAME_FIELD)
        + max_string([0, 0], [0, 0], out_ports, NAME_FIELD));

    // If there are no generics and input ports, or no output port increments the
    // width to see more space in the empty side.
    if ((generics[NAME_FIELD].length === 0
        && in_ports[NAME_FIELD].length === 0)
        || out_ports[NAME_FIELD].length === 0) {
        width = width * 1.5;
    }


    let min_x = 0;
    let max_x = 0;
    let max_leght_text_x = 0;
    let max_lenght_text_out_type = 0;


    //  parameters to draw an arrow
    // const arrow = canvas.marker(10, 10, function (add) {
    //     add.path('M 0 0 L 4 2 L 0 4 z')
    //         .fill('black');
    // }).attr({
    //     orient: 'auto-start-reverse'
    // });




    // generic square and text
    high = SIZE * generics[NAME_FIELD].length;
    total_high = high + OFFSET / 2;


    if (generics[NAME_FIELD].length > 0) {
        // Draw the generics square
        canvas
            .rect(width, high + OFFSET)
            .fill(genBox)
            .stroke({
                color: border,
                width: BOX_WIDTH
            })
            // This offset the box 1 px to improve the represention, because
            // drawing losses 1 px in the resolution in a line of 2 px in the top part
            // of the image
            .move(locx, locy + 1)   
            .radius(CORNER_RADIUS);

        // write generics text
        for (let i = 0; i < generics[NAME_FIELD].length; i++) {
            locy = SIZE * i + OFFSET / 2;

            // Draw the type name in the generic side (outside the square)
            let textleft = canvas
                .text(generics[TYPE_FIELD][i])
                .move(locx - TEXT_SPACE - TEXT_SPACE_PIN, locy - TEXT_OFFSET)
                .font({
                    family: FONT,
                    size: SIZE,
                    anchor: 'end'
                });

            // Draw the name of the generic (inside the square)
            textleft = canvas
                .text(generics[NAME_FIELD][i])
                .move(locx + TEXT_SPACE, locy - TEXT_OFFSET)
                .font({
                    family: FONT,
                    size: SIZE,
                    anchor: 'start'
                });


            const max_local = generics[NAME_FIELD][i].length + generics[TYPE_FIELD][i].length;
            max_leght_text_x = Math.max(max_leght_text_x, max_local);
            max_x = max_leght_text_x;
            min_x = Math.min(min_x, textleft['node'].getAttribute('x'));


            // Draw the line of the generics
            draw_line(canvas, locx, TEXT_SPACE, locy, SIZE, "input");

        }
    }



    // ports square
    locy = high + OFFSET / 2 + SEPARATOR;
    high = SIZE * Math.max(in_ports[NAME_FIELD].length, out_ports[NAME_FIELD].length);
    total_high = total_high + high + OFFSET / 2;

    // If there are at least one port, draw the ports square
    if (in_ports[NAME_FIELD].length > 0 || out_ports[NAME_FIELD].length > 0) {

        // draw the ports square
        canvas
            .rect(width, high + OFFSET)
            .fill(portBox)
            .stroke({
                color: border,
                width: BOX_WIDTH
            })
            .move(locx, locy + 5)
            .radius(CORNER_RADIUS);


        // If there are input ports, draw the ports
        if (in_ports[NAME_FIELD].length > 0) {

            //write ports
            for (let i = 0; i < in_ports[NAME_FIELD].length; i++) {
                locy = SIZE * generics[NAME_FIELD].length + OFFSET + SIZE * i + SEPARATOR;

                // Draw the type ports (outside the square)
                let textleft = canvas
                    .text(in_ports[TYPE_FIELD][i])
                    .move(locx - TEXT_SPACE - TEXT_SPACE_PIN, locy - TEXT_OFFSET)
                    .font({ family: FONT, size: SIZE, anchor: 'end' });

                // Draw the name port (inside the square)
                textleft = canvas
                    .text(in_ports[NAME_FIELD][i])
                    .move(locx + TEXT_SPACE, locy - TEXT_OFFSET)
                    .font({ family: FONT, size: SIZE, anchor: 'start' });


                const max_local = in_ports[TYPE_FIELD][i].length;
                max_leght_text_x = Math.max(max_leght_text_x, max_local);
                min_x = Math.min(min_x, textleft['node'].getAttribute('x'));


                // Draw the line of the input ports
                draw_line(canvas, locx, TEXT_SPACE, locy, SIZE, "input");

            }
        }


        max_x = width;
        max_lenght_text_out_type = Math.max(max_leght_text_x + OFFSET, OFFSET);

        // If there are output ports, draw the ports
        if (out_ports[NAME_FIELD].length > 0) {
            max_x = 0;
            max_lenght_text_out_type = 0;
            for (let i = 0; i < out_ports[NAME_FIELD].length; i++) {
                locy = SIZE * generics[NAME_FIELD].length + OFFSET + SIZE * i + SEPARATOR;

                // Draw the type ports (outside the square)
                let textright = canvas
                    .text(out_ports[TYPE_FIELD][i])
                    .move(locx + width + TEXT_SPACE + TEXT_SPACE_PIN, locy - TEXT_OFFSET)
                    .font({ family: FONT, size: SIZE, anchor: 'start' });

                // Draw the name port (inside the square)
                textright = canvas
                    .text(out_ports[NAME_FIELD][i])
                    .move(locx + width - TEXT_SPACE, locy - TEXT_OFFSET)
                    .font({ family: FONT, size: SIZE, anchor: 'end' });


                const max_local = out_ports[TYPE_FIELD][i].length;
                max_lenght_text_out_type = Math.max(max_lenght_text_out_type, max_local);
                max_x = Math.max(max_x, textright['node'].getAttribute('x'));


                // Draw the line of the output ports
                draw_line(canvas, locx + width, TEXT_SPACE, locy, SIZE, "output");

            }
        }
    }

    const total_width = max_x + (SIZE / 2) * max_lenght_text_out_type + 2 * OFFSET;
    canvas.viewbox(0, 0, total_width, 2 * OFFSET + total_high);

    if (in_ports[NAME_FIELD].length > 0 || out_ports[NAME_FIELD].length > 0 || generics[NAME_FIELD].length > 0) {
        // There are some port or generics, returns the drawing
        return canvas.svg();

    } else {
        // Else return an empty value
        return '';
    }
}

/**
 * This function draws the lines for the generics, input, output ports.
 * 
 * @param canvas Canvas to draw the arrow
 * @param locx position in X axis
 * @param text_space text space
 * @param locy position in Y axis
 * @param size size of the text
 * @param type where to draw the line
 *      - "output": rigth side
 *      - "input": left side
 */
function draw_line(canvas, locx, text_space, locy, size, type) {

    // line object to draw the line
    const arrow_line = canvas
        .line(locx - text_space, 0, locx, 0)
        .stroke({
            color: 'black',
            width: 2.5,
            linecap: 'rec'
        });

    if (type === "input") {
        // if the type is "input" draw in the left
        arrow_line.move(locx - text_space, locy + size * 2 / 4);

    } else if (type === "output") {
        // if the type is "output" draw in the right
        arrow_line.move(locx, locy + size * 2 / 4);
    }


}

// function draw_arrow(canvas, locx, text_space, locy, size, type, arrow) {
// const arrow_line =  draw_line(canvas, locx, text_space, locy, size, arrow, "output");

// arrow.ref(3, 2);

// if (type === "input") {

//     arrow_line.marker('end', arrow);
// } else if (type === "output") {

//     arrow_line.marker('start', arrow);
// }
// }


/**
 * This function replaces the character '`' for '\`'
 * 
 * @param input string to normalize the 
 * @returns normalized string
 */
function nomalize_str(input: string): string {
    return input.replace(/`/g, '\\`');
}


/**
 * This function returns the generics of the code.
 * 
 * @param structure Structure with the HDL code
 * @param generic_name_field Field number with the name
 * @param generic_type_field Field number with the type
 * @returns String with the generic:
 *      - 0: generic name
 *      - 1: generic type
 */
function get_generics(structure: common_hdl.Hdl_element, generic_name_field: number, generic_type_field: number) {
    const generic_str: any = [[], []];
    // Get the generics
    const generic_list = structure.get_generic_array();
    // Check the generics
    for (let i = 0; i < generic_list.length; i++) {
        // normalize the generics name
        generic_str[generic_name_field][i] = '   ' + nomalize_str(generic_list[i].info.name) + ' ';
        // normalize the generics type
        generic_str[generic_type_field][i] = '   ' + nomalize_str(generic_list[i].type) + ' ';
    }
    // String with the generics
    return generic_str;
}


/**
 * This function return the ports of the code.
 * 
 * @param structure Structure with the HDL code
 * @returns String with the ports and virtual_bus port
 */
function get_ports(structure: common_hdl.Hdl_element) {

    // Define the string with the ports
    let complete_list: any[] = [];
    // Get the ports in the code
    const port_list = structure.get_port_array();

    // Split the port list in ports outside the @virtualbus and @vitualbus ports
    const port_list_vbus = doxygen.get_virtual_bus(port_list);

    // Add normal ports (not part of virtual buses)
    complete_list = port_list_vbus.port_list;

    // Process virtual buses
    for (const virtual_bus of port_list_vbus.v_port_list) {
        if (virtual_bus.keepports) {
            // If @keepports is enabled, expand virtual bus to show individual ports
            complete_list = complete_list.concat(virtual_bus.port_list);
        } else {
            // If @keepports is not enabled, show virtual bus as single entity
            complete_list.push(virtual_bus);
        }
    }
    // Return the ports and vrtual_bus
    return complete_list;
}


/**
 * This function returns the input ports.
 * @param structure Structure with the HDL code
 * @param input_port_name_field Field number with the name
 * @param input_port_type_field Field number with the type
 * @returns String with the input ports:
 *      - 0: port name
 *      - 1: port type
 */
function get_ports_in(structure: common_hdl.Hdl_element,
    input_port_name_field: number, input_port_type_field: number) {

    // Define the input string
    const str_in: any = [[], []];
    // initialize the input index
    let input_index = 0;

    // Get the ports (input and output)
    const port_list = get_ports(structure);
    // Check all the ports
    for (let i = 0; i < port_list.length; i++) {
        // if the port is an input
        if (INPUT_LABEL_LIST.includes(port_list[i].direction)) {
            // normalize the ports name
            str_in[input_port_name_field][input_index] = '   ' + nomalize_str(port_list[i].info.name) + ' ';
            // normalize the ports type
            str_in[input_port_type_field][input_index] = '   ' + nomalize_str(port_list[i].type) + ' ';

            // If there are an input port, increment the index
            input_index++;
        }
    }
    // Return the input string
    return str_in;
}

/**
 * This function returns the output ports.
 * @param structure Structure with the HDL code
 * @param output_port_name_field Field number with the name
 * @param output_port_type_field Field number with the type
 * @returns String with the otuput ports:
 *      - 0: port name
 *      - 1: port type
 */
function get_ports_out(structure: common_hdl.Hdl_element,
    output_port_name_field: number, output_port_type_field: number) {

    // Define the output string
    const str_out: any = [[], []];
    // initialize the output index
    let output_index = 0;

    // Get the ports (input and output)
    const port_list = get_ports(structure);
    // Check all the ports
    for (let i = 0; i < port_list.length; i++) {
        if (OUTPUT_LABEL_LIST.includes(port_list[i].direction)) {
            // normalize the ports name
            str_out[output_port_name_field][output_index] = '   ' + nomalize_str(port_list[i].info.name) + ' ';
            // normalize the ports type
            str_out[output_port_type_field][output_index] = '   ' + nomalize_str(port_list[i].type) + ' ';

            // If there are an output port, increment the index
            output_index++;
        }
    }
    // Return the output string
    return str_out;
}


/**
 * This function returns the max value of the desired field.
 * 
 * @param generics String of the generics
 * @param in_ports String of the input ports
 * @param output_ports Strign of the output ports
 * @param field Field to calculate the maximum
 * @returns Maximum value
 */
function max_string(generics: any, in_ports: any, output_ports: any, field: number) {
    // Definition of the least value of the maximum
    let max = 2;

    // Generic maximum
    for (let i = 0; i < generics[field].length; i++) {
        max = Math.max(max, generics[field][i].length);
    }


    // Ports
    max = max / 1.5;

    // Input ports maximum
    for (let i = 0; i < in_ports[field].length; i++) {
        max = Math.max(max, in_ports[field][i].length);
    }
    // Output port maximum
    for (let i = 0; i < output_ports[field].length; i++) {
        max = Math.max(max, output_ports[field][i].length);
    }

    // Return the maximum
    return max;
}
