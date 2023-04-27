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

import { Parser_fsm_base } from "../fsm_base_parser";
import * as path from "path";
import * as Parser from "web-tree-sitter";

export class Paser_fsm_vhdl extends Parser_fsm_base {
    private parser: any;
    private loaded_wasm = false;

    constructor(comment_symbol: any, parser: any) {
        super();
        this.set_symbol(comment_symbol);
        if (parser !== undefined) {
            this.parser = parser;
            this.loaded_wasm = true;
        }
    }

    async init() {
        if (this.loaded_wasm !== true) {
            try {
                await Parser.init();
                this.parser = new Parser();
                const lang = await Parser.Language.load(path.join(__dirname, "..", "parsers", "tree-sitter-vhdl.wasm"));
                this.parser.setLanguage(lang);
                this.loaded_wasm = true;
                // eslint-disable-next-line no-empty
            } catch (e) { }
        }
    }

    set_comment_symbol(comment_symbol: any) {
        this.set_symbol(comment_symbol);
    }

    async get_svg_sm(code: any, comment_symbol: any) {
        this.set_comment_symbol(comment_symbol);

        let process;
        let tree;
        try {
            tree = this.parser.parse(code);
            process = this.get_process(tree);
        } catch (e) {
            return { 'svg': [], 'stm': [] };
        }
        const stm = [];
        const svg = [];
        for (let i = 0; i < process.length; ++i) {
            let states;
            try {
                states = this.get_process_info(process[i]);
            } catch (e) {
                states = undefined;
            }
            if (states !== undefined) {
                for (let j = 0; j < states.length; ++j) {
                    if (this.check_stm(states[j]) === true) {
                        stm.push(states[j]);
                        const svg_tmp = this.json_to_svg(states[j]);
                        const stm_tmp = {
                            'image': svg_tmp,
                            'description': states[j].description
                        };
                        svg.push(stm_tmp);
                    }
                }
            }
        }
        return { 'svg': svg, 'structure': stm };
    }

    get_process(tree: any) {
        const process_array = [];
        const arch_body = this.get_architecture_body(tree);
        const cursor = arch_body.walk();
        let comments = '';
        // Process
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'process_statement') {
                const process = {
                    'code': cursor.currentNode(),
                    'comments': comments
                };
                process_array.push(process);
                comments = '';
            } else if (cursor.nodeType === 'comment') {
                comments += this.get_comment(cursor.nodeText);
            } else {
                comments = '';
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return process_array;
    }

    get_architecture_body(p: any) {
        const cursor = p.walk();
        let item = this.get_item_multiple_from_childs(cursor.currentNode(), 'design_unit');
        if (item.length === 2) {
            item = this.get_item_from_childs(item[1], 'architecture_body');
            item = this.get_item_from_childs(item, 'concurrent_statement_part');
            return item;
        } else {
            return undefined;
        }
    }

    get_process_info(proc: any) {
        const stms = [];

        const p = proc.code;
        const name = this.get_process_label(p);
        const case_statements = this.get_case_process(p);
        for (let i = 0; i < case_statements.length; ++i) {
            const description = proc.comments;
            const init: any = [];
            const p_info = {
                'description': description.replace(/fsm_extract/g, ''),
                'name': '',
                'state_variable_name': '',
                'states': init
            };
            p_info.name = name;
            if (case_statements !== undefined && case_statements.length !== 0) {
                p_info.state_variable_name = this.get_state_variable_name(case_statements[i]);
                p_info.states = this.get_states(case_statements[i], p_info.state_variable_name);
                const check = this.check_empty_states_transitions(p_info.states);
                if (check === true) {
                    const result = this.force_case_stm(case_statements[i]);
                    p_info.state_variable_name = result.variable_name;
                    p_info.states = result.states;
                }
                stms.push(p_info);
            }
        }
        return stms;
    }

    force_case_stm(p: any) {
        const state_names = this.get_state_names_from_case(p).map(v => v.toLowerCase());
        const state_name_candidate = this.search_state_variable_candidates(p, state_names);
        const states = this.get_states(p, state_name_candidate);
        return { 'variable_name': state_name_candidate, 'states': states };
    }

    search_state_variable_candidates(p: any, state_names: any) {
        const candidates = [];
        const signals = this.search_multiple_in_tree(p, 'simple_waveform_assignment');
        for (let i = 0; i < signals.length; ++i) {
            const rigth = this.get_item_from_childs(signals[i], 'waveforms');
            if (rigth !== undefined) {
                const rigth_text = rigth.text.toLowerCase();
                const left = this.get_left_simple_waveform_assignment(signals[i]);
                if (state_names.includes(rigth_text) === true) {
                    candidates.push(left);
                }
            }
        }

        const variables = this.search_multiple_in_tree(p, 'simple_variable_assignment');
        for (let i = 0; i < variables.length; ++i) {
            let rigth = this.get_item_from_childs(variables[i], 'waveforms');
            if (rigth === undefined) {
                rigth = this.get_item_from_childs_last(variables[i], 'simple_name');
            }
            if (rigth !== undefined) {
                const rigth_text = rigth.text.toLowerCase();
                const left = this.get_left_simple_waveform_assignment(variables[i]);
                if (state_names.includes(rigth_text) === true) {
                    candidates.push(left);
                }
            }
        }
        const unique = this.mode(candidates);
        return unique;
    }

    mode(array: any) {
        if (array.length === 0) {
            return null;
        }
        const mode_map = [];
        let max_el = array[0],
            max_count = 1;
        for (let i = 0; i < array.length; i++) {
            const el = array[i];
            if (mode_map[el] == null) {
                mode_map[el] = 1;
            } else {
                mode_map[el]++;
            }
            if (mode_map[el] > max_count) {
                max_el = el;
                max_count = mode_map[el];
            }
        }
        return max_el;
    }

    get_state_names_from_case(p: any) {
        const state_names = [];
        const cursor = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'case_statement_alternative') {
                const result = this.get_state_name(cursor.currentNode());
                const name = result.state_name;
                state_names.push(name);
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return state_names;
    }

    get_states(p: any, state_variable_name: any) {
        const case_state = [];
        const cursor = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'case_statement_alternative') {
                const init: any = [];
                const state = {
                    'name': '',
                    'transitions': init,
                    'start_position': init,
                    'end_position': init
                };
                const result = this.get_state_name(cursor.currentNode());
                const name = result.state_name;
                if (name !== undefined && name.toLocaleLowerCase() !== 'others') {
                    state.name = result.state_name;
                    state.start_position = result.start_position;
                    state.end_position = result.end_position;
                    state.transitions = this.get_transitions(cursor.currentNode(), state_variable_name);

                    case_state.push(state);
                }
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return case_state;
    }

    get_transitions(p: any, state_variable_name: any) {
        let transitions = [];
        const cursor = p.walk();
        let last = 0;
        let last_transitions: any = [];
        //if transitions
        let if_transitions: any = [];
        //assign transitions
        let assign_transitions: any = [];

        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'sequence_of_statements') {
                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'if_statement') {
                        const tmp_transitions = this.get_if_transitions(
                            cursor.currentNode(), state_variable_name, undefined);
                        if_transitions = if_transitions.concat(tmp_transitions);
                        last = 0;
                    } else if (cursor.nodeType === 'simple_waveform_assignment') {
                        const tmp_transitions = this.get_assignament_transitions(
                            cursor.currentNode(), state_variable_name);
                        if (tmp_transitions.length !== 0 && tmp_transitions !== undefined) {
                            assign_transitions = tmp_transitions;
                            last_transitions = tmp_transitions;
                            last = 1;
                        }
                    } else if (cursor.nodeType === 'simple_variable_assignment') {
                        const tmp_transitions = this.get_assignament_variable_transitions(
                            cursor.currentNode(), state_variable_name);
                        if (tmp_transitions.length !== 0 && tmp_transitions !== undefined) {
                            assign_transitions = tmp_transitions;
                            last_transitions = tmp_transitions;
                            last = 1;
                        }
                    } else if (cursor.nodeType === 'case_statement') {
                        const tmp_transitions = this.get_case_transitions(
                            cursor.currentNode(), state_variable_name, undefined);
                        if_transitions = if_transitions.concat(tmp_transitions);
                        last = 0;
                    }
                }
                while (cursor.gotoNextSibling() !== false);
            }
        }
        while (cursor.gotoNextSibling() !== false);
        if (last === 1) {
            transitions = last_transitions;
        } else {
            transitions = if_transitions.concat(assign_transitions);
        }
        return transitions;
    }

    get_if_transitions(p: any, state_variable_name: any, metacondition: any): any {
        let transitions: any = [];
        const cursor = p.walk();
        let else_conditions = '';
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'elsif' || cursor.nodeType === 'if') {
                const if_condition = this.get_condition(cursor.currentNode(), undefined);
                if (if_condition !== undefined) {
                    else_conditions += `not (${if_condition.condition})\n`;
                }
                const transition = this.get_transition(
                    cursor.currentNode(), state_variable_name, metacondition, undefined);
                if (transition !== undefined) {
                    transitions = transitions.concat(transition);
                }
            } else if (cursor.nodeType === 'else') {
                if (metacondition !== undefined) {
                    else_conditions = metacondition + '\n' + else_conditions;
                }
                const transition = this.get_transition(
                    cursor.currentNode(), state_variable_name, else_conditions, undefined);
                if (transition !== undefined) {
                    transitions = transitions.concat(transition);
                }
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return transitions;
    }

    get_case_transitions(p: any, state_variable_name: any, metacondition: any) {
        let transitions: any = [];
        const cursor = p.walk();
        let else_conditions = '';
        const case_switch = this.get_item_from_childs(cursor.currentNode(), 'simple_name').text;
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'case_statement_alternative') {
                const choice = this.get_item_from_childs(cursor.currentNode(), 'choices');
                const choice_txt = choice.text;
                let if_condition = `${case_switch} = ${choice_txt}`;
                if (choice_txt.toLocaleLowerCase() === 'others') {
                    if_condition = else_conditions;
                } else if (if_condition !== undefined) {
                    else_conditions += `not (${if_condition})\n`;
                }
                const transition = this.get_transition(cursor.currentNode(),
                    state_variable_name, metacondition, if_condition);
                if (transition !== undefined) {
                    transitions = transitions.concat(transition);
                }
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return transitions;
    }

    get_assignament_transitions(p: any, state_variable_name: any) {
        const transitions = [];

        const tmp_destination = this.check_get_simple_waveform_assignment(p, state_variable_name);
        if (tmp_destination !== undefined) {
            const s_position = p.startPosition;
            const e_position = p.endPosition;
            const start_position = [s_position.row, e_position.column - 1];
            const end_position = [e_position.row, e_position.column];

            const destination = tmp_destination;
            const transition = {
                'condition': '',
                'destination': destination,
                'start_position': start_position,
                'end_position': end_position
            };
            transitions.push(transition);
        }
        return transitions;
    }

    get_assignament_variable_transitions(p: any, state_variable_name: any) {
        const transitions = [];

        const tmp_destination = this.check_get_simple_variable_assignment(p, state_variable_name);
        if (tmp_destination !== undefined) {
            const s_position = p.startPosition;
            const e_position = p.endPosition;
            const start_position = [s_position.row, e_position.column - 1];
            const end_position = [e_position.row, e_position.column];

            const destination = tmp_destination;
            const transition = {
                'condition': '',
                'destination': destination,
                'start_position': start_position,
                'end_position': end_position
            };
            transitions.push(transition);
        }
        return transitions;
    }

    get_transition(p: any, state_variable_name: any, metacondition: any, choice: any) {
        const result = this.get_condition(p, choice);
        const condition = result.condition;
        const start_position = result.start_position;
        const end_position = result.end_position;
        const transitions = this.get_transitions_in_if(p, state_variable_name,
            condition, start_position, end_position, metacondition);
        return transitions;
    }

    get_transitions_in_if(p: any, state_variable_name: any, condition: any, start_position: any,
        end_position: any, metacondition: any) {
        let last = 0;
        let last_transitions: any = [];
        //if transitions
        let if_transitions = [];
        //assign transitions
        let assign_transitions: any = [];
        let transitions = [];
        let destination = undefined;
        const cursor = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'sequence_of_statements') {
                cursor.gotoFirstChild();
                do {
                    if (cursor.nodeType === 'simple_waveform_assignment') {
                        const tmp_destination = this.check_get_simple_waveform_assignment(
                            cursor.currentNode(), state_variable_name);
                        if (tmp_destination !== undefined) {
                            destination = tmp_destination;
                            if (condition !== undefined && destination !== undefined) {
                                const transition = {
                                    'condition': '',
                                    'destination': '',
                                    'start_position': start_position,
                                    'end_position': end_position
                                };
                                if (metacondition !== undefined && metacondition !== '') {
                                    condition += `\n${metacondition}`;
                                    const current_conditions = condition.split('\n');
                                    const unique = current_conditions.filter(this.only_unique);
                                    let condition_tmp = '';
                                    for (let i = 0; i < unique.length - 1; ++i) {
                                        condition_tmp += unique[i] + '\n';
                                    }
                                    condition_tmp += unique[unique.length - 1] + '\n';
                                    condition = condition_tmp;
                                }
                                transition.condition = condition;
                                transition.destination = destination;
                                last = 1;
                                assign_transitions = [transition];
                                last_transitions = [transition];
                            }
                        }
                    } else if (cursor.nodeType === 'simple_variable_assignment') {
                        const tmp_destination = this.check_get_simple_variable_assignment(
                            cursor.currentNode(), state_variable_name);
                        if (tmp_destination !== undefined) {
                            destination = tmp_destination;
                            if (condition !== undefined && destination !== undefined) {
                                const transition = {
                                    'condition': '',
                                    'destination': '',
                                    'start_position': start_position,
                                    'end_position': end_position
                                };
                                if (metacondition !== undefined && metacondition !== '') {
                                    condition += `\n${metacondition}`;
                                    const current_conditions = condition.split('\n');
                                    const unique = current_conditions.filter(this.only_unique);
                                    let condition_tmp = '';
                                    for (let i = 0; i < unique.length - 1; ++i) {
                                        condition_tmp += unique[i] + '\n';
                                    }
                                    condition_tmp += unique[unique.length - 1] + '\n';
                                    condition = condition_tmp;
                                }
                                transition.condition = condition;
                                transition.destination = destination;
                                last = 1;
                                assign_transitions = [transition];
                                last_transitions = [transition];
                            }
                        }
                    } else if (cursor.nodeType === 'if_statement') {
                        if (metacondition !== undefined && metacondition !== '') {
                            condition += condition + '\n' + metacondition;
                        }
                        last = 0;
                        if_transitions = this.get_if_transitions(cursor.currentNode(), state_variable_name, condition);
                    } else if (cursor.nodeType === 'case_statement') {
                        if (metacondition !== undefined && metacondition !== '') {
                            condition += condition + '\n' + metacondition;
                        }
                        last = 0;
                        if_transitions = this.get_case_transitions(cursor.currentNode(),
                            state_variable_name, condition);
                    }
                }
                while (cursor.gotoNextSibling() !== false);
            }
        }
        while (cursor.gotoNextSibling() !== false);
        if (last !== 0) {
            transitions = last_transitions;
        } else {
            transitions = if_transitions.concat(assign_transitions);
        }
        return transitions;
    }

    check_get_simple_waveform_assignment(p: any, state_variable_name: any) {
        let destination = undefined;
        if (state_variable_name === undefined) {
            return destination;
        }
        if (this.get_left_simple_waveform_assignment(p).toLowerCase() === state_variable_name.toLowerCase()) {
            destination = this.get_rigth_simple_waveform_assignment(p);
        }
        return destination;
    }

    check_get_simple_variable_assignment(p: any, state_variable_name: any) {
        let destination = undefined;
        if (state_variable_name === undefined) {
            return destination;
        }
        if (this.get_left_simple_waveform_assignment(p).toLowerCase() === state_variable_name.toLowerCase()) {
            destination = this.get_rigth_simple_variable_assignment(p);
        }
        return destination;
    }

    get_left_simple_waveform_assignment(p: any) {
        let left = 'undefined';
        const cursor = p.walk();
        let break_p = false;
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'simple_name') {
                left = cursor.nodeText;
                break_p = true;
            } else if (cursor.nodeType === 'selected_name') {
                left = cursor.nodeText.split('.');
                left = left[left.length - 1];
                break_p = true;
            }
        }
        while (cursor.gotoNextSibling() !== false && break_p === false);
        return left;
    }

    get_rigth_simple_waveform_assignment(p: any) {
        let rigth = undefined;
        const cursor = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'waveforms') {
                rigth = cursor.nodeText.split(/(\s)/)[0].trim();
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return rigth;
    }

    get_rigth_simple_variable_assignment(p: any) {
        let rigth = undefined;
        const cursor = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'simple_name') {
                rigth = cursor.nodeText.split(/(\s)/)[0].trim();
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return rigth;
    }

    get_condition(p: any, choice: any) {
        let condition = '';
        const cursor = p.walk();
        let start_position = [];
        let end_position = [];
        let s_position = cursor.startPosition;
        let e_position = cursor.endPosition;
        start_position = [s_position.row, s_position.column];
        end_position = [e_position.row, e_position.column];

        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'relation' || cursor.nodeType === 'logical_expression' ||
                cursor.nodeType === 'parenthesized_expression' || cursor.nodeType === 'conditional_expression') {
                if (cursor.nodeType === 'conditional_expression') {
                    const ch = this.get_item_from_childs(cursor.currentNode(), 'parenthesized_expression');
                    if (ch !== undefined) {
                        condition = this.get_relation_of_parenthesized_expression(ch);
                    }
                    else {
                        const simple_name = this.get_item_from_childs(cursor.currentNode(), 'simple_name');
                        condition = simple_name.text;
                    }
                } else {
                    condition = this.get_relation_of_parenthesized_expression(cursor.currentNode());
                }
                s_position = cursor.startPosition;
                e_position = cursor.endPosition;
                start_position = [s_position.row, s_position.column];
                end_position = [e_position.row, e_position.column];
            } else if (cursor.nodeType === 'choices') {
                condition = choice;
                s_position = cursor.startPosition;
                e_position = cursor.endPosition;
                start_position = [s_position.row, s_position.column];
                end_position = [e_position.row, e_position.column];
            }
            if (cursor.nodeType === 'else') {
                s_position = cursor.startPosition;
                e_position = cursor.endPosition;
                start_position = [s_position.row, s_position.column];
                end_position = [e_position.row, e_position.column];
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return {
            'condition': condition,
            'start_position': start_position,
            'end_position': end_position
        };
    }

    get_relation_of_parenthesized_expression(p: any) {
        let relation = undefined;
        const cursor = p.walk();
        let break_p = false;
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'relation' || cursor.nodeType === 'logical_expression') {
                relation = cursor.nodeText;
                break_p = true;
            }
        }
        while (cursor.gotoNextSibling() !== false && break_p === false);
        if (relation === undefined) {
            relation = p.text;
        }
        return relation;
    }

    get_state_name(p: any) {
        let state_name = undefined;
        let start_position: any = [];
        let end_position: any = [];
        const cursor = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'choices') {
                const s_position = cursor.startPosition;
                const e_position = cursor.endPosition;
                start_position = [s_position.row, s_position.column];
                end_position = [e_position.row, e_position.column];
                state_name = cursor.nodeText;
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return { 'state_name': state_name, 'start_position': start_position, 'end_position': end_position };
    }


    get_state_variable_name(p: any) {
        let state_variable_name = undefined;
        const cursor = p.walk();
        cursor.gotoFirstChild();
        do {
            if (cursor.nodeType === 'simple_name' || cursor.nodeType === 'expression') {
                state_variable_name = cursor.nodeText;
            } else if (cursor.nodeType === 'parenthesized_expression') {
                state_variable_name = cursor.nodeText.replace('(', '').replace(')', '');
            }
        }
        while (cursor.gotoNextSibling() !== false);
        return state_variable_name;
    }

    get_case_process(p: any) {
        const case_statement = this.search_multiple_in_tree(p, 'case_statement');
        return case_statement;
    }


    get_process_label(p: any) {
        let label = '';
        const cursor = p.walk();
        //Process label
        cursor.gotoFirstChild();
        if (cursor.nodeType === 'label') {
            cursor.gotoFirstChild();
            label = cursor.nodeText;
        }
        return label;
    }
}
