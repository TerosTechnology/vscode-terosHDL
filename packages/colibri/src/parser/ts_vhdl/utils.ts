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

export function remove_break_line(str: string) {
    const str_out = str.replace(/(\r\n|\n|\r)/gm, " ");
    return str_out;
}

export function remove_comments(str: string) {
    const str_split = str.split('\n');
    let str_not_comments = '';
    for (let i = 0; i < str_split.length; i++) {
        let element = str_split[i];
        element = element.trim();
        if (element[0] !== '-' && element[1] !== '-') {
            str_not_comments += element + '\n';
        }
    }
    return str_not_comments;
}

export function get_identifier_of_list(p: any) {
    const break_p = false;
    const identifiers = [];
    const cursor = p.walk();

    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === 'identifier') {
            identifiers.push(cursor.nodeText);
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return identifiers;
}