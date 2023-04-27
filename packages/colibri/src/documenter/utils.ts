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

import * as common_documenter from "./common";
import * as translator_lib from "./translator";
import * as md from "./markdown_table";
const showdown = require('showdown');

export function normalize_description(description: string): string {
    let desc_inst = description.replace(/\n\s*\n/g, '<br> ');
    desc_inst = desc_inst.replace(/\n/g, ' ');
    desc_inst = desc_inst.replace(/<br \/>/g, ' ');
    return desc_inst;
}

export function get_table_with_title(items: any, title: string, header: string[], keys: string[],
    translator: translator_lib.Translator,
    output_type: common_documenter.doc_output_type) {

    const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
    converter.setFlavor('github');

    let doc_markdown = '';
    let doc_html = '';

    if (items.length === 0) {
        return '';
    }

    // Title
    let doc_raw = `## ${translator.get_str(title)}\n\n`;
    doc_markdown += doc_raw;
    doc_html += converter.makeHtml(doc_raw);

    // Parameters
    const table = [];
    table.push(header);

    for (const item of items) {
        const value_to_table = [];
        for (const key of keys) {
            if (key === 'name') {
                value_to_table.push(item.info.name);
            }
            else if (key === 'description') {
                value_to_table.push(item.info.description);
            }
            else {
                value_to_table.push(item[key]);
            }
        }

        table.push(value_to_table);
        doc_raw = md.get_table(table, undefined) + '\n';

    }
    doc_markdown += doc_raw;
    doc_html += converter.makeHtml(doc_raw);
    if (output_type === common_documenter.doc_output_type.MARKDOWN) {
        return doc_markdown;
    }
    else {
        return doc_html;
    }
}