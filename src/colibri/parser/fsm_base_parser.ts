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

export class Parser_fsm_base {
    comment_symbol = "";

    check_empty_states_transitions(states: any) {
        let check = true;
        for (let i = 0; i < states.length; ++i) {
            if (states[i].transitions.length !== 0) {
                check = false;
            }
        }
        return check;
    }

    check_stm(stm: any) {
        const check = false;
        const states = stm.states;
        for (let i = 0; i < states.length; ++i) {
            const transitions = states[i].transitions;
            if (transitions.length > 0) {
                return true;
            }
        }
        return check;
    }

    json_to_svg(stm_json: any) {
        const stmcat = this.get_smcat(stm_json);
        const smcat = require("state-machine-cat");
        let svg;
        try {
            svg = smcat.render(stmcat, { outputType: "svg" });
        }
        // eslint-disable-next-line no-empty
        catch (e) { }
        return svg;
    }

    get_smcat(stm_json: any) {
        let sm_states = '';
        let sm_transitions = '';

        const states = stm_json.states;
        let state_names = [];
        for (let i = 0; i < states.length; ++i) {
            if (states[i].transitions.length === 0) {
                state_names.push(states[i].name);
            }
        }
        const emptys: any = [];
        for (let i = 0; i < state_names.length; ++i) {
            let empty = true;
            for (let j = 0; j < states.length; ++j) {
                for (let m = 0; m < states[j].transitions.length; ++m) {
                    if (states[j].transitions[m].destination === state_names[i]) {
                        empty = false;
                    }
                }
            }
            if (empty === true) {
                emptys.push(state_names[i]);
            }
        }

        const gosth: any = [];
        state_names = [];
        for (let i = 0; i < states.length; ++i) {
            state_names.push(states[i].name);
        }
        for (let j = 0; j < states.length; ++j) {
            for (let m = 0; m < states[j].transitions.length; ++m) {
                if (state_names.includes(states[j].transitions[m].destination) === false) {
                    const element = { 'name': states[j].transitions[m].destination, 'transitions': [] };
                    stm_json.states.push(element);
                    gosth.push(states[j].transitions[m].destination);
                }
            }
        }
        const num_states = stm_json.states.length;
        stm_json.states.forEach(function (i_state: any, i: any) {
            const transitions = i_state.transitions;
            const state_name = i_state.name;
            if (emptys.includes(state_name) === true || gosth.includes(state_name) === true) {
                sm_states += `${state_name} [color="red" type=regular]`;
            }
            else {
                sm_states += `${state_name} [type=regular]`;
            }
            if (i !== num_states - 1) {
                sm_states += ',';
            }
            else {
                sm_states += ';\n';
            }
            if (gosth.includes(state_name) !== true) {
                transitions.forEach(function (i_transition: any) {
                    if (gosth.includes(i_transition.destination) === true) {
                        sm_transitions +=
                            `${state_name} => ${i_transition.destination} [color="red"] : ${i_transition.condition};\n`;
                    }
                    else {
                        sm_transitions += `${state_name} => ${i_transition.destination} : ${i_transition.condition};\n`;
                    }
                });
            }
        });
        const str_stm = stm_json.state_variable_name + "{\n" + sm_states + sm_transitions + "\n};";
        return str_stm;
    }

    only_unique(value: any, index: any, self: any) {
        return self.indexOf(value) === index;
    }

    get_comment(comment: any) {
        if (comment === undefined) {
            return '';
        }
        const txt_comment = comment.slice(2);
        if (this.comment_symbol === '') {
            return txt_comment + '\n';
        }
        else if (txt_comment[0] === this.comment_symbol) {
            return txt_comment.slice(1).trim() + '\n';
        }
        return '';
    }

    set_symbol(symbol: any) {
        if (symbol === undefined) {
            this.comment_symbol = '';
        }
        else {
            this.comment_symbol = symbol;
        }
    }

    get_item_from_childs(p: any, type: string) {
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

    search_multiple_in_tree(element: any, matching_title: string) {
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

    get_item_multiple_from_childs(p: any, type: any) {
        if (p === undefined) {
            return [];
        }
        const items: any = [];
        const cursor: any = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === type) {
                const item = cursor.currentNode();
                items.push(item);
            }
        }
        while (cursor.gotoNextSibling() === true);
        return items;
    }

    get_item_from_childs_last(p: any, type: any) {
        if (p === undefined) {
            return undefined;
        }
        let item = undefined;
        const cursor = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === type) {
                item = cursor.currentNode();
            }
        }
        while (cursor.gotoNextSibling() === true);
        return item;
    }
}
