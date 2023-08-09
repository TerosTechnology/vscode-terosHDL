// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

import * as path_lib from 'path';
import * as fs from 'fs';
const showdown = require('showdown');
import * as common_hdl from "../parser/common";
import * as common_documenter from "./common";
import * as markdown_table from "./markdown_table";
import * as translator_lib from "./translator";
import * as doxygen from "./doxygen_parser";
import * as Diagram from "./diagram";
import * as utils from "./utils";
import * as common_utils from "../utils/common_utils";
import { Section_creator_interface } from "./section_creator_interface";
import { t_documenter_options } from "../config/auxiliar_config";
import * as cfg from "../config/config_declaration";

export class Creator extends Section_creator_interface {
    private converter;

    constructor() {
        super();
        this.converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        this.converter.setFlavor('github');
    }

    ////////////////////////////////////////////////////////////////////////////
    // Common
    ////////////////////////////////////////////////////////////////////////////
    get_elements_with_description(elements: any) {
        const elements_i = [];
        for (let i = 0; i < elements.length; ++i) {
            const description = elements[i].info.description.replace(/ /g, '').replace(/\n/g, '');
            if (description !== '') {
                elements_i.push(elements[i]);
            }
        }
        return elements_i;
    }

    remove_break_line(description: string): string {
        return description.replace(/\r/g, ' ').replace(/\n/g, ' ');
    }

    transform(markdown_str: string, output_type: common_documenter.doc_output_type): string {
        if (output_type === common_documenter.doc_output_type.HTML) {
            return this.converter.makeHtml(markdown_str);
        }
        else {
            return markdown_str;
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // Title section
    ////////////////////////////////////////////////////////////////////////////
    get_title_section(hdl_element: common_hdl.Hdl_element, configuration: t_documenter_options,
        output_type: common_documenter.doc_output_type)
        : string {

        let markdown_title = "";
        const translator = new translator_lib.Translator(configuration.language);
        if (hdl_element.hdl_type === common_hdl.TYPE_HDL_ELEMENT.PACKAGE) {
            markdown_title = `\n# ${translator.get_str('Package')}: ${hdl_element.name} \n`;
        }
        else if (hdl_element.hdl_type === common_hdl.TYPE_HDL_ELEMENT.ENTITY) {
            markdown_title = `\n# ${translator.get_str('Entity')}: ${hdl_element.name} \n`;
        }
        return this.transform(markdown_title, output_type);
    }
    ////////////////////////////////////////////////////////////////////////////
    // Input section
    ////////////////////////////////////////////////////////////////////////////
    get_input_section(input_path: string, configuration: t_documenter_options,
        output_type: common_documenter.doc_output_type): string {
        const translator = new translator_lib.Translator(configuration.language);
        let section = "";
        if (input_path !== "") {
            const filename = path_lib.basename(input_path);
            const input_section = `- **${translator.get_str('File')}**: ${filename}\n`;
            section += this.transform(input_section, output_type);
        }
        return section;
    }
    ////////////////////////////////////////////////////////////////////////////
    // Description
    ////////////////////////////////////////////////////////////////////////////
    get_description_section(hdl_element: common_hdl.Hdl_element, configuration: t_documenter_options,
        svg_path_dir: string, output_type: common_documenter.doc_output_type) {

        if (hdl_element.description.trim() === '') {
            return '';
        }
        const translator = new translator_lib.Translator(configuration.language);
        // Description
        const description = this.get_description(hdl_element.description, svg_path_dir,
            hdl_element.name, output_type);
        // Generate section
        const section_header = this.transform(`\n## ${translator.get_str('Description')}\n\n`, output_type);
        return section_header + description;
    }

    get_description(description: string, svg_path_dir: string,
        image_basename: string, output_type: common_documenter.doc_output_type) {

        description = description.replace("\n\n #", "\n\n#");
        description = description.replace("\n #", "\n#");
        description = description.trim();

        // Remove doxygen
        const doxygen_description = doxygen.parse_doxygen(description);
        // Parse wavedrom
        let wavedrom_description_norm = this.parse_wavedrom(doxygen_description.text, svg_path_dir,
            image_basename, output_type);
        // Normalize
        if (output_type === common_documenter.doc_output_type.HTML) {
            wavedrom_description_norm = utils.normalize_description(wavedrom_description_norm);
        }
        return wavedrom_description_norm;
    }

    parse_wavedrom(description: string,
        svg_path_dir: string, svg_prefix_name: string, output_type: common_documenter.doc_output_type): string {

        if (svg_prefix_name === '') {
            svg_prefix_name = 'x';
        }

        // Parse wavedrom
        const wavedrom_description = this.get_wavedrom_svg(description);
        let wavedrom_description_norm = wavedrom_description.description;
        wavedrom_description_norm = this.transform(wavedrom_description_norm, output_type);
        for (let i = 0; i < wavedrom_description.wavedrom.length; ++i) {
            const random_id = common_utils.makeid(4);
            if (output_type === common_documenter.doc_output_type.MARKDOWN) {
                const file_name = `wavedrom_${random_id}${i}.svg`;
                const img = `![alt text](${file_name} "title")`;
                const path_img = path_lib.join(svg_path_dir, file_name);
                fs.writeFileSync(path_img, wavedrom_description.wavedrom[i]);
                wavedrom_description_norm = wavedrom_description_norm.replace(
                    "$cholosimeone$" + i, '\n\n' + img + '\n\n');
            }
            else {
                wavedrom_description_norm = wavedrom_description_norm.replace(
                    "$cholosimeone$" + i, '\n\n' + wavedrom_description.wavedrom[i] + '\n\n');
            }
        }
        return wavedrom_description_norm;
    }

    get_wavedrom_svg(description: string) {
        const json5 = require('json5');

        //Search json candidates
        const json_candidates = this.get_json_candidates(description);
        const svg_diagrams = [];

        const wavedrom = require('wavedrom');
        const render = require('bit-field/lib/render');
        const onml = require('onml');

        let counter = 0;
        for (let i = 0; i < json_candidates.length; ++i) {
            try {
                const json = json5.parse(json_candidates[i]);
                const diagram = wavedrom.renderAny(0, json, wavedrom.waveSkin);
                const diagram_svg = onml.s(diagram);
                svg_diagrams.push(diagram_svg);
                description = description.replace(json_candidates[i], "\n" + "$cholosimeone$" + counter + " \n");
                ++counter;
            }
            catch (error) {
                try {
                    const json = json5.parse(json_candidates[i]);
                    const options = {
                        hspace: 888
                    };
                    const jsonml = render(json, options);
                    const diagram_svg = onml.stringify(jsonml);

                    svg_diagrams.push(diagram_svg);
                    description = description.replace(json_candidates[i], "\n" + "$cholosimeone$" + counter + " \n");
                    ++counter;
                }
                // eslint-disable-next-line no-console
                catch (error) { console.log(""); }
            }
        }
        return { description: description, wavedrom: svg_diagrams };
    }

    get_json_candidates(text: string) {
        const json: any = [];
        let i = 0;
        let brackets = 0;
        let character_number_begin = 0;
        while (i < text.length) {
            if (text[i] === '{') {
                character_number_begin = i;
                ++brackets;
                ++i;
                while (i < text.length) {
                    if (text[i] === '{') {
                        ++brackets;
                        ++i;
                    }
                    else if (text[i] === '}') {
                        --brackets;
                        if (brackets === 0) {
                            json.push(text.slice(character_number_begin, i + 1));
                            break;
                        }
                        ++i;
                    }
                    else {
                        ++i;
                    }
                }
            }
            else {
                ++i;
            }
        }
        return json;
    }
    ////////////////////////////////////////////////////////////////////////////
    // Diagram section
    ////////////////////////////////////////////////////////////////////////////
    get_diagram_section(hdl_element: common_hdl.Hdl_element,
        configuration: t_documenter_options, dir_svg: string,
        output_type: common_documenter.doc_output_type): string {

        const path_svg = path_lib.join(dir_svg, hdl_element.name + '.svg');
        const translator = new translator_lib.Translator(configuration.language);
        let section = "";
        if (hdl_element.hdl_type === common_hdl.TYPE_HDL_ELEMENT.ENTITY) {
            const markdown_section_title = `\n## ${translator.get_str('Diagram')}\n`;
            section += this.transform(markdown_section_title, output_type);
            // eslint-disable-next-line max-len
            const svg_diagram = (this.get_diagram_svg_from_code_tree(hdl_element) + "\n").replace(/\*/g, "\\*").replace(/S`/g, "\\`");
            if (output_type === common_documenter.doc_output_type.HTML) {
                section += svg_diagram;
            }
            else {
                fs.writeFileSync(path_svg, svg_diagram);
                const basename = path_lib.basename(path_svg);
                section += `![${translator.get_str('Diagram')}](${basename} "${translator.get_str('Diagram')}")`;
            }
        }
        return section;
    }

    save_svg_from_code_tree(hdl_element: common_hdl.Hdl_element, path_svg: string) {
        const svg_diagram_str = this.get_diagram_svg_from_code_tree(hdl_element);
        fs.writeFileSync(path_svg, svg_diagram_str);
    }

    get_diagram_svg_from_code_tree(hdl_element: common_hdl.Hdl_element): string {
        const opt: Diagram.Diagram_options = {
            blackandwhite: false
        };
        const svg_diagram_str = Diagram.diagram_generator(hdl_element, opt);
        return svg_diagram_str;
    }
    ////////////////////////////////////////////////////////////////////////////
    // Info section
    ////////////////////////////////////////////////////////////////////////////
    get_info_section(hdl_element: common_hdl.Hdl_element, configuration: t_documenter_options,
        output_type: common_documenter.doc_output_type) {
        const translator = new translator_lib.Translator(configuration.language);
        const description = hdl_element.description;
        const doxygen_elements = doxygen.parse_doxygen(description);

        let markdown_doc = "";
        doxygen_elements.element_list.forEach(element => {
            if (element.field !== 'custom_section_begin' && element.field !== 'custom_section_end') {
                const field_cap = element.field[0].toUpperCase() + element.field.slice(1);
                markdown_doc += `- **${translator.get_str(field_cap)}:** ${element.description.replace('\n', '')}\n`;
            }
        });
        return this.transform(markdown_doc, output_type);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Port section
    ////////////////////////////////////////////////////////////////////////////
    get_in_out_section(hdl_element: common_hdl.Hdl_element,
        configuration: t_documenter_options, output_type: common_documenter.doc_output_type): string {

        const translator = new translator_lib.Translator(configuration.language);
        const generics = hdl_element.get_generic_array();
        const port_list_complete = doxygen.get_virtual_bus(hdl_element.get_port_array());

        const port_list = port_list_complete.port_list;
        const v_bus_list = port_list_complete.v_port_list;

        const virtual_buses_to_show: common_hdl.Virtual_bus_hdl[] = [];
        v_bus_list.forEach(element => {
            if (element.notable === false) {
                virtual_buses_to_show.push(element);
            }
        });

        if (generics.length === 0 && port_list.length === 0) {
            return '';
        }
        let md = "";
        if (generics.length !== 0) {
            md += `\n## ${translator.get_str('Generics')}\n\n`;
            md += this.get_doc_generics(generics, translator);
        }
        if (port_list.length !== 0) {
            md += `\n## ${translator.get_str('Ports')}\n\n`;
            md += this.get_doc_ports(port_list, v_bus_list, translator);
        }

        if (virtual_buses_to_show.length > 0) {
            md += `\n### ${translator.get_str('Virtual Buses')}\n\n`;
            for (let i = 0; i < virtual_buses_to_show.length; i++) {
                const element = virtual_buses_to_show[i];
                md += "#### " + element.info.name + "\n\n";
                md += this.get_doc_ports(element.port_list, [], translator);
            }
        }
        return this.transform(md, output_type);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Signal and constant section
    ////////////////////////////////////////////////////////////////////////////
    get_signal_constant_section(hdl_element: common_hdl.Hdl_element,
        configuration: t_documenter_options, output_type: common_documenter.doc_output_type): string {

        const translator = new translator_lib.Translator(configuration.language);
        let signals = hdl_element.get_signal_array();
        let constants = hdl_element.get_constant_array();
        let types = hdl_element.get_type_array();

        let md = "";

        if (configuration.signal_visibility === cfg.e_documentation_general_signals.only_commented) {
            signals = this.get_elements_with_description(signals);
        }
        if (configuration.constant_visibility === cfg.e_documentation_general_constants.only_commented) {
            constants = this.get_elements_with_description(constants);
        }
        if (configuration.type_visibility === cfg.e_documentation_general_types.only_commented) {
            types = this.get_elements_with_description(types);
        }

        if ((signals.length !== 0 && configuration.signal_visibility !== cfg.e_documentation_general_signals.none) ||
            (constants.length !== 0 && configuration.constant_visibility !== cfg.e_documentation_general_constants.none)
            || (types.length !== 0 && configuration.type_visibility !== cfg.e_documentation_general_types.none)) {
            //Tables
            if (signals.length !== 0 && configuration.signal_visibility !== cfg.e_documentation_general_signals.none) {
                md += `\n## ${translator.get_str('Signals')}\n\n`;
                md += this.get_doc_signals(signals, translator);
            }
            if (constants.length !== 0 && configuration.constant_visibility !==
                cfg.e_documentation_general_constants.none) {

                md += `\n## ${translator.get_str('Constants')}\n\n`;
                md += this.get_doc_constants(constants, translator);
            }
            if (types.length !== 0 && configuration.type_visibility !== cfg.e_documentation_general_types.none) {
                md += `\n## ${translator.get_str('Types')}\n\n`;
                md += this.get_doc_types(types, translator);
            }
        }
        return this.transform(md, output_type);
    }

    ////////////////////////////////////////////////////////////////////////////
    // Process section
    ////////////////////////////////////////////////////////////////////////////
    get_process_section(hdl_element: common_hdl.Hdl_element,
        configuration: t_documenter_options, output_type: common_documenter.doc_output_type): string {

        const translator = new translator_lib.Translator(configuration.language);
        let process = hdl_element.get_process_array();
        if (configuration.process_visibility === 'none') {
            return '';
        }
        if (configuration.process_visibility === cfg.e_documentation_general_process.only_commented) {
            process = this.get_elements_with_description(process);
        }
        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        let md = "";
        let html = "";
        if (process.length !== 0) {
            //Title
            md += `\n## ${translator.get_str('Processes')}\n`;
            html += converter.makeHtml(`## ${translator.get_str('Processes')}\n\n`);
            for (let i = 0; i < process.length; ++i) {
                const name = process[i].info.name;
                const section = `- ${name}: ( ${process[i].sens_list} )\n`;
                md += section;
                html += converter.makeHtml(section);
                if (process[i].type !== '' && process[i].type !== undefined) {
                    const type_str = `**${translator.get_str('Type')}:** ${process[i].type}\n`;
                    md += '  - ' + type_str;
                    html += '<div id="descriptions">' + converter.makeHtml(type_str) + '</div>';
                }
                const description = process[i].info.description.replace('\n', '');
                if (description !== '') {
                    const norm_description = utils.normalize_description(process[i].info.description);
                    const description_element = `**${translator.get_str('Description')}**\n ${norm_description}\n`;
                    md += '  - ' + description_element;
                    html += '<div id="descriptions">' + converter.makeHtml(description_element) + '</div>';
                }
            }
        }
        if (output_type === common_documenter.doc_output_type.HTML) {
            return html;
        }
        return md;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Function section
    ////////////////////////////////////////////////////////////////////////////
    get_function_section(hdl_element: common_hdl.Hdl_element,
        configuration: t_documenter_options, output_type: common_documenter.doc_output_type): string {

        const translator = new translator_lib.Translator(configuration.language);
        let functions = hdl_element.get_function_array();
        if (configuration.function_visibility === cfg.e_documentation_general_functions.none) {
            return '';
        }
        if (configuration.function_visibility === cfg.e_documentation_general_functions.only_commented) {
            functions = this.get_elements_with_description(functions);
        }
        let md = "";
        let html = "";
        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        if (functions.length !== 0) {
            //Title
            md += `\n## ${translator.get_str('Functions')}\n`;
            html += converter.makeHtml(`## ${translator.get_str('Functions')}\n\n`);
            for (let i = 0; i < functions.length; ++i) {
                if (functions[i].info.name !== '') {
                    let arguments_str = functions[i].arguments;
                    if (arguments_str === '') {
                        arguments_str = '()';
                    }
                    let return_str = functions[i].return.replace('return', translator.get_str('return'));
                    if (return_str === '') {
                        return_str = `${translator.get_str('return')} ()`;
                    }
                    // eslint-disable-next-line max-len
                    const name = functions[i].info.name;
                    arguments_str = arguments_str
                        .replace(/;/g, ';<br><span style="padding-left:20px">')
                        .replace(/,/g, ',<br><span style="padding-left:20px">');
                    // eslint-disable-next-line max-len
                    const section = `- ${name} <font id="function_arguments">${arguments_str}</font> <font id="function_return">${return_str}</font>\n`;
                    md += section;
                    html += converter.makeHtml(section);

                    const description = functions[i].info.description.replace('\n', '');
                    if (description !== '') {
                        const description_element = `**${translator.get_str('Description')}**\n ${description}\n`;
                        md += '  - ' + description;
                        html += '<div id="descriptions">' + converter.makeHtml(description_element) + '</div>';
                    }
                }
            }
        }
        if (output_type === common_documenter.doc_output_type.HTML) {
            return html;
        }
        return md;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Instantiation section
    ////////////////////////////////////////////////////////////////////////////
    get_instantiation_section(hdl_element: common_hdl.Hdl_element,
        configuration: t_documenter_options, output_type: common_documenter.doc_output_type): string {

        const translator = new translator_lib.Translator(configuration.language);
        const instantiations = hdl_element.get_instantiation_array();
        let md = "";
        let html = "";
        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        if (instantiations.length !== 0) {
            //Title
            const title = `\n## ${translator.get_str('Instantiations')}\n\n`;
            md += title;
            html += converter.makeHtml(title);

            for (let i = 0; i < instantiations.length; ++i) {
                const name = instantiations[i].info.name;
                const section = `- ${name}: ${instantiations[i].type}\n`;
                md += section;
                html += converter.makeHtml(section);

                const description = instantiations[i].info.description.replace('\n', '');
                if (description !== '') {
                    const description_e = `**${translator.get_str('Description')}**\n ${description}\n`;
                    md += '  - ' + description;
                    html += '<div id="descriptions">' + converter.makeHtml(description_e) + '</div>';
                }
            }
        }
        if (output_type === common_documenter.doc_output_type.HTML) {
            return html;
        }
        return md;
    }
    ////////////////////////////////////////////////////////////////////////////
    // FSM section
    ////////////////////////////////////////////////////////////////////////////
    get_fsm_section(fsm_list: any, hdl_element: common_hdl.Hdl_element,
        configuration: t_documenter_options, svg_output_dir: string,
        output_type: common_documenter.doc_output_type): string {

        const translator = new translator_lib.Translator(configuration.language);
        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        let section = "";
        if (configuration.enable_fsm === false || fsm_list.length === 0) {
            return section;
        }

        if (output_type === common_documenter.doc_output_type.HTML) {
            section += converter.makeHtml(`## ${translator.get_str('State machines')}\n\n`);
            section += '<div>';
            for (let i = 0; i < fsm_list.length; ++i) {
                if (fsm_list[i].description !== '') {
                    section += converter.makeHtml('- ' + fsm_list[i].description);
                }
                section += `<div id="state_machine">${fsm_list[i].image}</div>`;
            }
            section += '</div>';
        }
        else {
            section += `\n## ${translator.get_str('State machines')}\n\n`;
            const entity_name = hdl_element.name;
            for (let i = 0; i < fsm_list.length; ++i) {
                const file_name = `fsm_${entity_name}_${i}${i}.svg`;
                const fsm_path = path_lib.join(svg_output_dir, file_name);
                if (fsm_list[i].description !== '') {
                    section += '- ' + fsm_list[i].description;
                }
                fs.writeFileSync(fsm_path, fsm_list[i].image);
                section += `![Diagram_state_machine_${i}]( ${file_name} "Diagram")`;
            }
        }
        return section;
    }

    save_fsm(fsm_list: any, hdl_element: common_hdl.Hdl_element, svg_output_dir: string) {
        const entity_name = hdl_element.name;
        for (let i = 0; i < fsm_list.length; ++i) {
            const fsm_path = path_lib.join(svg_output_dir, `fsm_${entity_name}_${i}${i}.svg`);
            fs.writeFileSync(fsm_path, fsm_list[i].image);
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // Custom section
    ////////////////////////////////////////////////////////////////////////////
    get_custom_section(position: string, hdl_element: common_hdl.Hdl_element,
        input_path: string, output_type: common_documenter.doc_output_type) {

        let directory_base = '';
        if (input_path !== '') {
            directory_base = path_lib.dirname(input_path);
        }

        //Get doxygen labels
        const doxygen_list = doxygen.parse_doxygen(hdl_element.description).element_list;
        let field_description = "";
        doxygen_list.forEach(element_doxygen => {
            if (element_doxygen.field === position) {
                field_description = element_doxygen.description;
            }
        });
        if (field_description === '') {
            return '';
        }

        // Read custom section
        let file_path = '';
        const base_path = field_description.trim();
        if (path_lib.isAbsolute(base_path)) {
            file_path = base_path;
        }
        else {
            file_path = path_lib.join(directory_base, base_path);
        }

        if (fs.existsSync(file_path) === false) {
            return '';
        }

        let result = fs.readFileSync(file_path, { encoding: 'utf8', flag: 'r' });
        if (output_type === common_documenter.doc_output_type.HTML) {
            const showdown_highlight = require("showdown-highlight");
            const converter = new showdown.Converter({
                tables: true, ghCodeBlocks: true,
                extensions: [showdown_highlight({
                    // Whether to add the classes to the <pre> tag
                    pre: true
                })]
            });

            converter.setFlavor('github');
            result = converter.makeHtml(result);
        }
        if (result !== '') {
            result = '\n' + result + '\n';
        }
        return result;
    }

    ////////////////////////////////////////////////////////////////////////////
    // Elements
    ////////////////////////////////////////////////////////////////////////////
    get_doc_ports(ports: common_hdl.Port_hdl[], v_bus_list: common_hdl.Virtual_bus_hdl[],
        translator: translator_lib.Translator) {

        const table = [];
        table.push([
            translator.get_str("Port name"),
            translator.get_str("Direction"),
            translator.get_str("Type"),
            translator.get_str("Description")
        ]);

        for (let i = 0; i < ports.length; ++i) {
            const description = utils.normalize_description(ports[i].info.description);
            let direction = ports[i]['direction'];
            if (direction === undefined) {
                direction = '';
            } else if (ports[i]['type'] === 'modport' || ports[i]['type'] === 'interface') {
                direction = '';
            }
            direction = direction.replace(/\r/g, ' ').replace(/\n/g, ' ');

            let type = ports[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' ');
            if (ports[i]['type'] === "virtual_bus") {
                type = translator.get_str('virtual bus');
            } else if (ports[i]['type'] === 'modport' || ports[i]['type'] === 'interface') {
                type = ports[i]['subtype'];
            }
            table.push([
                this.remove_break_line(ports[i].info.name),
                direction,
                type,
                description
            ]);
        }
        for (let i = 0; i < v_bus_list.length; ++i) {
            table.push([
                this.remove_break_line(v_bus_list[i].info.name),
                v_bus_list[i].direction,
                'Virtual bus',
                v_bus_list[i].info.description
            ]);
        }
        const text = markdown_table.get_table(table, undefined) + '\n';
        return text;
    }

    get_doc_generics(generics: common_hdl.Port_hdl[], translator: translator_lib.Translator) {
        const table = [];
        table.push([translator.get_str("Generic name"), translator.get_str("Type"),
        translator.get_str("Value"), translator.get_str("Description")
        ]);
        for (let i = 0; i < generics.length; ++i) {
            const description = utils.normalize_description(generics[i].info.description);
            const name = this.remove_break_line(generics[i].info.name);
            const type = this.remove_break_line(generics[i].type);
            const default_value = this.remove_break_line(generics[i].default_value);
            table.push([
                name,
                type,
                default_value,
                description
            ]);
        }
        const text = markdown_table.get_table(table, undefined) + '\n';
        return text;
    }

    get_doc_signals(signals: common_hdl.Signal_hdl[], translator: translator_lib.Translator) {
        const table = [];
        table.push([translator.get_str("Name"), translator.get_str("Type"), translator.get_str("Description")]);
        for (let i = 0; i < signals.length; ++i) {
            let description = signals[i].info.description;
            description = utils.normalize_description(description);

            table.push([
                signals[i].info.name,
                signals[i].type.replace(/\r/g, ' ').replace(/\n/g, ' ')
                    .replace(/;/g, ';<br><span style="padding-left:20px">')
                    .replace(/,/g, ',<br><span style="padding-left:20px">')
                    .replace(/{/g, '{<br><span style="padding-left:20px">'),
                description
            ]);
        }
        const text = markdown_table.get_table(table, undefined) + '\n';
        return text;
    }

    get_doc_constants(constants: common_hdl.Constant_hdl[], translator: translator_lib.Translator) {
        const table = [];
        table.push([translator.get_str("Name"), translator.get_str("Type"), translator.get_str("Value"),
            translator.get_str("Description")
        ]);

        for (let i = 0; i < constants.length; ++i) {
            const description = utils.normalize_description(constants[i].info.description);
            table.push(
                [constants[i].info.name,
                constants[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' ')
                    .replace(/;/g, ';<br><span style="padding-left:20px">')
                    .replace(/,/g, ',<br><span style="padding-left:20px">')
                    .replace(/{/g, '{<br><span style="padding-left:20px">'),
                constants[i]['default_value'].replace(/\r/g, ' ').replace(/\n/g, ' ')
                    .replace(/;/g, ';<br><span style="padding-left:20px">')
                    .replace(/,/g, ',<br><span style="padding-left:20px">')
                    .replace(/{/g, '{<br><span style="padding-left:20px">'),
                    description
                ]);
        }
        const text = markdown_table.get_table(table, undefined) + '\n';
        return text;
    }

    get_doc_types(tpyes: common_hdl.Type_hdl[], translator: translator_lib.Translator) {
        const table = [];
        table.push([translator.get_str("Name"), translator.get_str("Type"), translator.get_str("Description")]);
        for (let i = 0; i < tpyes.length; ++i) {
            const description = utils.normalize_description(tpyes[i].info.description);
            table.push(
                [tpyes[i].info.name,
                tpyes[i]['type'].replace(/\r/g, ' ').replace(/\n/g, ' ')
                    .replace(/;/g, ';<br><span style="padding-left:20px">')
                    .replace(/,/g, ',<br><span style="padding-left:20px">')
                    .replace(/{/g, '{<br><span style="padding-left:20px">'),
                    description
                ]);
        }
        const text = markdown_table.get_table(table, undefined) + '\n';
        return text;
    }
}