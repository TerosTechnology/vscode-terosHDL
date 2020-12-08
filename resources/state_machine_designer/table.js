// Copyright 2020 Carlos Alberto Ruiz Naranjo
//
// This file is part of magic-hdl-stm.
//
// magic-hdl-stm is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// magic-hdl-stm is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with magic-hdl-stm.  If not, see <https://www.gnu.org/licenses/>.

export class Table {
  constructor(table_dom) {
    this.table = table_dom;
    this.init_table();
  }
  add_stm_table(stm) {
    this.table.innerHTML = '';
    // Get all states name
    let state_names = '';
    for (let i = 0; i < stm.length; ++i) {
      state_names += stm[i].name + ',';
    }
    state_names = state_names.slice(0, -1);

    for (let i = 0; i < stm.length; ++i) {
      this.add_state_table(stm[i], state_names);
    }
  }

  clear() {
    this.table.innerHTML = '';
    this.init_table();
  }

  init_table() {
    let messages = ["Click rigth button anywhere to add a new state. Click rigth button in a state to add a new transition.",
      "Save the state machine to a JSON file, so you can load it in other time.",
      "Press Code to clipboard button to copy the state machine HDL code in your clipboard."
    ];
    for (let i = 0; i < 3; ++i) {
      let row = this.table.insertRow(-1);
      let cell = row.insertCell(0);
      cell.style.backgroundColor = '#e5e5e5';
      cell.innerHTML = messages[i];
    }
    // let row = this.table.insertRow(-1);
    // let cell = row.insertCell(0);
    // let img = document.createElement('img');
    // img.style = "width:100%;heigth:100%";
    // img.src = "../images/sample.gif";
    // cell.appendChild(img);

    this.table.hidden = false;
  }

  add_state_table(state, state_names) {
    this.add_state_name_table(state.name, state_names);
    this.add_outputs(state.name, state.outputs);
    for (let i = 0; i < state.transitions.length; ++i) {
      this.add_state_transition_table(state.name, state.transitions[i], state_names);
    }
  }

  add_state_name_table(name, states_name) {
    let row = this.table.insertRow(-1);
    let cell = row.insertCell(0);
    cell.style.backgroundColor = '#ffd78c';
    cell.innerHTML = name;
    cell.colSpan = '2';
    cell.stm_type = "state";
    cell.stm_state_name = name;
    cell.stm_states_name = states_name;
  }

  add_outputs(state_name, outputs) {
    const MAX_CELL = 3;
    const NUM_OUTPUTS = outputs.length;
    let row;
    for (let i = 0; i < NUM_OUTPUTS; ++i) {
      if (i % MAX_CELL === 0) {
        row = this.table.insertRow(-1);
      }
      let cell = row.insertCell(0);
      cell.style.backgroundColor = '#fffce3';
      cell.innerHTML = outputs[i];
      cell.colSpan = '1';
      cell.stm_type = "output";
      cell.stm_output_name = outputs[i];
      cell.stm_state_name = state_name;
    }
  }

  add_state_transition_table(state_name, transition, states_name) {
    let row = this.table.insertRow(-1);
    row.style.backgroundColor = '#f9f9f9';
    let cell_destination = row.insertCell();
    cell_destination.innerHTML = transition.destination;
    cell_destination.style.width = '50%';
    let cell_condition = row.insertCell();
    cell_condition.innerHTML = transition.condition;
    cell_condition.style.width = '50%';

    cell_destination.stm_type = "transition";
    cell_destination.stm_state_name = state_name;
    cell_destination.stm_states_name = states_name;
    cell_destination.destination = transition.destination;
    cell_destination.condition = transition.condition;

    cell_condition.stm_type = "transition";
    cell_condition.stm_state_name = state_name;
    cell_condition.stm_states_name = states_name;
    cell_condition.destination = transition.destination;
    cell_condition.condition = transition.condition;
  }
}