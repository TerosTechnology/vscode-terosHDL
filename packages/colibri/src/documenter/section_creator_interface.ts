// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com ]
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

const showdown = require('showdown');
import * as translator_lib from "./translator";
import * as common_hdl from "../parser/common";
import * as common_documenter from "./common";
import * as utils from "./utils";
import * as markdown_table from "./markdown_table";
import { t_documenter_options } from "../config/auxiliar_config";

export class Section_creator_interface {


    get_interface_section(hdl_element: common_hdl.Hdl_element,
        configuration: t_documenter_options, output_type: common_documenter.doc_output_type): string {
        let section = "";

        if (hdl_element.hdl_type !== common_hdl.TYPE_HDL_ELEMENT.INTERFACE_DECLARATION) {
            return section;
        }

        const interface_list = hdl_element.get_interface_array();
        interface_list.forEach(element => {
            section += this.get_interface(element, configuration, output_type);
        });
        return section;
    }

    get_interface(interface_inst: common_hdl.Hdl_element,
        configuration: t_documenter_options, output_type: common_documenter.doc_output_type) {

        const translator = new translator_lib.Translator(configuration.language);
        let doc = '';
        let doc_raw = '';

        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        // Title
        doc_raw = `# ${translator.get_str('Interface')}: ${interface_inst['name']}\n\n`;
        if (output_type === common_documenter.doc_output_type.MARKDOWN) {
            doc += doc_raw;
        }
        else {
            doc += converter.makeHtml(doc_raw);
        }

        // Description
        const description = utils.normalize_description(interface_inst.description);
        doc_raw = `${description}\n\n`;
        if (output_type === common_documenter.doc_output_type.MARKDOWN) {
            doc = doc_raw;
        }
        else {
            doc += converter.makeHtml(doc_raw);
        }

        // Ports
        doc += this.get_ports_interface(interface_inst.get_port_array(), translator, output_type);

        // Parameters
        doc += this.get_parameters_interface(interface_inst.get_generic_array(), translator, output_type);

        // Logics
        doc += this.get_logics(interface_inst.get_logic_array(), translator, output_type);

        // Modports
        doc += this.get_modports(interface_inst.get_modport_array(), translator, output_type);

        // // Others
        // doc += this.get_others(interface_inst['others']);

        return doc;
    }

    get_parameters_interface(items: common_hdl.Port_hdl[], translator: translator_lib.Translator,
        output_type: common_documenter.doc_output_type) {
        const title = "Parameters";

        const header = [
            translator.get_str("Name"),
            translator.get_str("Default value"),
            translator.get_str("Description")
        ];

        const keys = ['name', 'default_value', 'description'];

        return utils.get_table_with_title(items, title, header, keys, translator, output_type);
    }

    get_ports_interface(items: common_hdl.Port_hdl[], translator: translator_lib.Translator,
        output_type: common_documenter.doc_output_type) {
        const title = "Ports";

        const header = [
            translator.get_str("Port name"),
            translator.get_str("Direction"),
            translator.get_str("Type"),
            translator.get_str("Description")
        ];

        const keys = ['name', 'direction', 'type', 'description'];

        return utils.get_table_with_title(items, title, header, keys, translator, output_type);
    }


    get_types_data_interface(items: any, translator: translator_lib.Translator,
        output_type: common_documenter.doc_output_type) {
        const title = "Signals";

        const header = [
            translator.get_str("Name"),
            translator.get_str("Type"),
            translator.get_str("Description")
        ];

        const keys = ['name', 'type', 'description'];

        return utils.get_table_with_title(items, title, header, keys, translator, output_type);
    }

    get_logics(items: common_hdl.Logic_hdl[], translator: translator_lib.Translator,
        output_type: common_documenter.doc_output_type) {
        const title = "Signals";

        const header = [
            translator.get_str("Name"),
            translator.get_str("Type"),
            translator.get_str("Description")
        ];

        const keys = ['name', 'type', 'description'];

        return utils.get_table_with_title(items, title, header, keys, translator, output_type);
    }

    get_others(items: any, translator: translator_lib.Translator, output_type: common_documenter.doc_output_type) {
        const title = "Others";

        const header = [
            translator.get_str("Name"),
            translator.get_str("Type"),
            translator.get_str("Description")
        ];

        const keys = ['name', 'kind', 'description'];

        return utils.get_table_with_title(items, title, header, keys, translator, output_type);
    }

    get_modports(modports: common_hdl.Modport_hdl[], translator: translator_lib.Translator,
        output_type: common_documenter.doc_output_type) {

        const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
        converter.setFlavor('github');

        let doc_markdown = '';
        let doc_html = '';

        if (modports.length === 0) {
            return '';
        }

        // Title
        let doc_raw = `## Modports\n\n`;
        doc_markdown += doc_raw;
        doc_html += converter.makeHtml(doc_raw);

        // Modports
        for (const modport of modports) {
            // Name
            doc_raw = `- ${translator.get_str("Name")}: **${modport.info.name}**\n\n`;
            doc_markdown += doc_raw;
            doc_html += converter.makeHtml(doc_raw);

            // Description
            const description = utils.normalize_description(modport.info.description);
            doc_raw = `${description}\n\n`;
            doc_markdown += doc_raw;
            doc_html += converter.makeHtml(doc_raw);

            //Table
            const modport_items = modport.ports;
            const table = [];
            table.push([translator.get_str("Port name"), translator.get_str("Direction"),
            translator.get_str("Description")]);
            for (const modport_item of modport_items) {
                const modport_item_name = modport_item.info.name;
                const modport_item_direction = modport_item.direction;
                const modport_description = modport_item.info.description;

                table.push([modport_item_name, modport_item_direction, modport_description]);
            }
            doc_raw = markdown_table.get_table(table, undefined) + '\n';

            doc_markdown += doc_raw;
            doc_html += converter.makeHtml(doc_raw);
        }
        if (output_type === common_documenter.doc_output_type.MARKDOWN) {
            return doc_markdown;
        }
        else {
            return doc_html;
        }
    }
}