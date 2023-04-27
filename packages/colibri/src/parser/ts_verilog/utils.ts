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

export function search_multiple_in_tree(element: any, matching_title: string) {
    const arr_match: any[] = [];
    function recursive_searchTree(element: any, matching_title: string): any {
        const type = element.type;
        if (type === matching_title) {
            arr_match.push(element);
        } else if (element !== undefined) {
            let result = undefined;
            for (let i = 0; result === undefined && i < element.childCount; i++) {
                result = recursive_searchTree(element.child(i), matching_title);
            }
            return result;
        }
        return undefined;
    }
    recursive_searchTree(element, matching_title);
    return arr_match;
}

export function get_item_from_childs(p: any, type: string) {
    if (p === undefined) {
        return undefined;
    }
    let item = undefined;
    const cursor = p.walk();
    let break_p = false;
    cursor.gotoFirstChild();
    do {
        if (cursor.nodeType === type) {
            item = cursor.currentNode();
            break_p = true;
        }
    }
    while (cursor.gotoNextSibling() === true && break_p === false);
    return item;
}

export function extract_data(node: any, lines: string[]) {
    return lines[node.startPosition.row].substr(node.startPosition.column,
        node.endPosition.column - node.startPosition.column);
}

export function set_description_to_array(arr: any, txt: string, general_comments: any, comment_symbol: string) {
    for (let i = 0; i < arr.length; ++i) {
        const position = arr[i].info.position.line;
        const comment_candidate = general_comments[position];
        if (comment_candidate !== undefined) {
            const result = check_comment(comment_candidate, comment_symbol);
            if (result.check === true) {
                arr[i].info.description = result.comment;
            }
        }
        if (arr[i].info.description === '') {
            arr[i].info.description = txt;
        }
    }
    return arr;
}

export function set_description_to_array_port(arr: any, txt: string, general_comments: any, comment_symbol: string) {
    for (let i = 0; i < arr.length; ++i) {
        const position = arr[i].info.position.line;
        const comment_candidate = general_comments[position];
        if (comment_candidate !== undefined) {
            const result = check_comment(comment_candidate, comment_symbol);
            if (result.check === true) {
                arr[i].info.description = result.comment;
                arr[i].inline_comment = result.comment;
            }
        }
        if (arr[i].info.description === '') {
            arr[i].info.description = txt;
        }
        arr[i].over_comment = txt;
    }
    return arr;
}

function check_comment(comment: string, comment_symbol: string) {
    let check = false;
    let result = '';
    comment = comment.slice(2);
    if (comment_symbol === '') {
        result = comment.trim() + '\n';
        check = true;
    } else if (comment[0] === comment_symbol) {
        result = comment.slice(1).trim() + '\n';
        check = true;
    }
    return { check: check, comment: result };
}

export function get_comment_with_break(comment: any, comment_symbol: string) {
    if (comment === undefined) {
        return '';
    }
    const txt_comment = comment.slice(2);
    if (comment_symbol === '') {
        return txt_comment + '\n';
    }
    else if (txt_comment[0] === comment_symbol) {
        return txt_comment.slice(1) + '\n';
    }
    return '';
}

export function get_comments(tree: any, lines: any) {
    const item = [];
    const inputs = search_multiple_in_tree(tree, 'comment');
    for (let x = 0; x < inputs.length; ++x) {
        item[inputs[x].startPosition.row] = extract_data(inputs[x], lines);
    }
    return item;
}