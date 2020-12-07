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

/* eslint-disable @typescript-eslint/class-name-casing */
import { Stm } from "../out/src/stm_manager";
import svgPanZoom from "svg-pan-zoom/src/svg-pan-zoom.js";

export class Contexmenu {
  constructor(stm_table) {
    this.stm = new Stm();
    this.stm_table = stm_table;


    // this.clickable = document.getElementById('table');
    this.clickable = document;
    this.menu_state = document.getElementById('menu_state');
    this.out_click = document.getElementById('out-click');

    this.out_click.addEventListener('click', () => {
      this.hidden_menu();
    });

    this.clickable.addEventListener('contextmenu', e => {
      e.preventDefault();
      //Menu state
      let menu;
      let parameters = {
        state_name: "",
        states_name: "",
        type: "",
        destination: "",
        condition: "",
        output: ""
      };
      parameters.state_name = e.target.stm_state_name;
      if (e.target.stm_states_name !== undefined) {
        parameters.states_name = e.target.stm_states_name.split(',');
      }
      parameters.type = e.target.stm_type;
      parameters.destination = e.target.destination;
      parameters.condition = e.target.condition;
      parameters.output = e.target.stm_output_name;

      let state_name = e.target.stm_state_name;
      if (e.target.stm_type === 'state') {
        menu = menu_state;
        this.configure_menu_state(parameters);
      }
      else if (e.target.stm_type === 'transition') {
        menu = menu_state;
        let destination = e.target.destination;
        let condition = e.target.condition;
        this.configure_menu_state(parameters);
      }
      else if (e.target.stm_type === 'output') {
        menu = menu_state;
        let output = e.target.stm_output_name;
        this.configure_menu_state(parameters);
      }
      else {
        menu = menu_state;
        parameters.type = "others";
        this.configure_menu_state(parameters);
      }
      menu.style.top = `${e.clientY}px`;
      menu.style.left = `${e.clientX}px`;
      menu.classList.add('show');
      this.out_click.style.display = "block";
    });
    document.getElementById('save-as-json').addEventListener('click', () => {
      let stm = this.stm.get_object();
      const a = document.createElement('a');
      const blob = new Blob([JSON.stringify(stm)]);
      a.href = URL.createObjectURL(blob);
      a.download = 'stm.json';
      a.click();
    });

    this.load_file = document.getElementById('inp');
    let element = this;
    document.getElementById('inp').onchange = function (e) {
      var file = e.target.files[0];
      if (!file) { return; }
      let reader = new FileReader();
      let stm = this.stm;
      reader.onload = function (e) {
        let data = JSON.parse(e.target.result);
        element.stm.load_json(data);
        let table_array = element.stm.get_object();
        element.stm_table.add_stm_table(table_array);
        let svg = element.stm.get_svg();
        update_graph(svg);
      };
      reader.readAsText(file);
    };

    document.getElementById('clear').addEventListener('click', () => {
      element.stm.clear();
      let table_array = element.stm.get_object();
      // element.stm_table.add_stm_table(table_array);
      element.stm_table.clear();
      let svg = element.stm.get_svg();
      update_graph(svg);
    });

    document.getElementById('code-clipboard').addEventListener('click', () => {
      var copyhelper = document.createElement("textarea");
      copyhelper.className = 'copyhelper';
      document.body.appendChild(copyhelper);
      let language = document.getElementById('config_0').value;
      let type = document.getElementById('config_1').value;
      let reset_enable = document.getElementById('reset_enable').value;
      let reset_signal = document.getElementById('reset_signal').value;
      let reset_state = document.getElementById('reset_state').value;

      if (reset_enable === false) {
        reset_signal = '';
      }

      let hdl_code = element.stm.get_hdl_code(language, type, reset_signal, reset_state);
      copyhelper.value = hdl_code;
      copyhelper.select();
      document.execCommand("copy");
      document.body.removeChild(copyhelper);
    });


    document.getElementById('load-json').addEventListener('click', () => {
      document.getElementById('inp').click();
    });
    this.insert_output = new Insert_output(this.stm, this.stm_table);
    this.edit_output = new Edit_output(this.stm, this.stm_table);
    this.insert_state = new Insert_state(this.stm, this.stm_table);
    this.insert_transition = new Insert_transition(this.stm, this.stm_table);
    this.edit_transition = new Edit_transition(this.stm, this.stm_table);
  }

  configure_menu_state(parameters) {
    let state_name = parameters.state_name;
    let type = parameters.type;
    let destination = parameters.destination;
    let condition = parameters.condition;
    let output = parameters.output;
    let states_name = parameters.states_name;

    let element = this;
    menu_state.innerHTML = '';

    let li_0 = document.createElement("li");
    li_0.setAttribute("class", "menu-item");
    li_0.appendChild(document.createTextNode("Add new state"));
    menu_state.appendChild(li_0);
    li_0.addEventListener('click', function () {
      element.menu_add_state();
    });

    if (type !== "others") {
      let li_3 = document.createElement("li");
      li_3.setAttribute("class", "menu-item");
      li_3.appendChild(document.createTextNode("Remove state"));
      menu_state.appendChild(li_3);
      li_3.addEventListener('click', function () {
        element.menu_remove_state(state_name);
      });

      let li_2 = document.createElement("li");
      li_2.setAttribute("class", "menu-item");
      li_2.appendChild(document.createTextNode("Add transition"));
      menu_state.appendChild(li_2);
      li_2.addEventListener('click', function () {
        element.menu_add_transition(state_name, states_name);
      });
    }

    if (type === "transition") {
      let li_1 = document.createElement("li");
      li_1.setAttribute("class", "menu-item");
      li_1.appendChild(document.createTextNode("Remove transition"));
      menu_state.appendChild(li_1);
      li_1.addEventListener('click', function () {
        element.menu_remove_transition(state_name, destination, condition);
      });

      let li_6 = document.createElement("li");
      li_6.setAttribute("class", "menu-item");
      li_6.appendChild(document.createTextNode("Edit transition"));
      menu_state.appendChild(li_6);
      li_6.addEventListener('click', function () {
        element.menu_edit_transition(state_name, destination, condition, states_name);
      });
    }

    if (type === "state" || type === "output") {
      let li_4 = document.createElement("li");
      li_4.setAttribute("class", "menu-item");
      li_4.appendChild(document.createTextNode("Add output"));
      menu_state.appendChild(li_4);
      li_4.addEventListener('click', function () {
        element.menu_add_output(state_name);
      });
    }
    if (type === "output") {
      let li_5 = document.createElement("li");
      li_5.setAttribute("class", "menu-item");
      li_5.appendChild(document.createTextNode("Remove output"));
      menu_state.appendChild(li_5);
      li_5.addEventListener('click', function () {
        element.menu_remove_output(state_name, output);
      });

      let li_8 = document.createElement("li");
      li_8.setAttribute("class", "menu-item");
      li_8.appendChild(document.createTextNode("Edit output"));
      menu_state.appendChild(li_8);
      li_8.addEventListener('click', function () {
        element.menu_edit_output(state_name, output);
      });
    }
  }

  hidden_menu() {
    this.menu_state.classList.remove('show');
    this.out_click.style.display = "none";
  }

  menu_add_state() {
    this.hidden_menu();
    this.insert_state.show();
  }
  menu_remove_state(state_name) {
    this.hidden_menu();
    this.insert_state.remove_state(state_name);
  }
  menu_remove_transition(state_name, destination, condition) {
    this.hidden_menu();
    this.insert_transition.remove_transition(state_name, destination, condition);
  }
  menu_add_transition(state_name, states_name) {
    this.hidden_menu();
    this.insert_transition.set_state(state_name);
    this.insert_transition.set_states(states_name);
    this.insert_transition.show();
  }
  menu_edit_transition(state_name, destination, condition, states_name) {
    this.hidden_menu();
    this.edit_transition.set_state(state_name);
    this.edit_transition.set_states(states_name);
    this.edit_transition.set_transition(destination, condition);
    this.edit_transition.show();
  }
  menu_add_output(state_name) {
    this.hidden_menu();
    this.insert_output.set_state(state_name);
    this.insert_output.show();
  }
  menu_remove_output(state_name, output) {
    this.hidden_menu();
    this.insert_output.remove_output(state_name, output);
  }
  menu_edit_output(state_name, output) {
    this.hidden_menu();
    this.edit_output.set_state(state_name);
    this.edit_output.set_output(output);
    this.edit_output.show();
  }
  cancel_button_event() {
    this.hidden_insert();
  }

  insert_button_event() {
    this.hidden_insert();
  }

  hidden_insert() {
    this.insert_state.hidden();
  }
}


class Insert_state {
  constructor(stm_table, table) {
    this.stm_table = stm_table;
    this.table_manager = table;
    this.table = document.getElementById('table');
    this.div = document.getElementById('i_state');
    this.insert_button = document.getElementById('i_state_insert');
    this.cancel_button = document.getElementById('i_state_cancel');
    this.state_name_box = document.getElementById('i_state_name');
    this.state;
    this.first = true;
    this.lastEmbed = undefined;
    let element = this;
    this.insert_button.addEventListener('click', () => {
      this.insert_button_event(element);
    });
    this.cancel_button.addEventListener('click', () => {
      this.cancel_button_event(element);
    });
  }
  insert_button_event() {
    let state_name = this.state_name_box.value;
    this.stm_table.add_state(state_name);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    update_graph(svg);
    this.hidden();
  }
  cancel_button_event() {
    this.hidden();
  }

  remove_state(state_name) {
    this.stm_table.remove_state(state_name);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    update_graph(svg);
    this.hidden();
  }

  hidden() {
    this.div.hidden = true;
    this.table.hidden = false;
  }
  show() {
    this.div.hidden = false;
    this.table.hidden = true;
  }
}

class Insert_output {
  constructor(stm_table, table) {
    this.stm_table = stm_table;
    this.table_manager = table;
    this.table = document.getElementById('table');
    this.div = document.getElementById('i_output');
    this.insert_button = document.getElementById('i_output_insert');
    this.cancel_button = document.getElementById('i_output_cancel');
    this.output_name_box = document.getElementById('i_output_name');
    this.state_name;
    let element = this;
    this.insert_button.addEventListener('click', () => {
      this.insert_button_event(element);
    });
    this.cancel_button.addEventListener('click', () => {
      this.cancel_button_event(element);
    });
  }
  set_state(state_name) {
    this.state_name = state_name;
  }
  insert_button_event() {
    let output_name = this.output_name_box.value;
    this.stm_table.add_output(this.state_name, output_name);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    update_graph(svg);
    this.hidden();
  }
  cancel_button_event() {
    this.hidden();
  }

  remove_output(state_name, output) {
    this.stm_table.remove_output(state_name, output);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    update_graph(svg);
    this.hidden();
  }

  hidden() {
    this.div.hidden = true;
    this.table.hidden = false;
  }
  show() {
    this.div.hidden = false;
    this.table.hidden = true;
  }
}

class Edit_output {
  constructor(stm_table, table) {
    this.stm_table = stm_table;
    this.table_manager = table;
    this.table = document.getElementById('table');
    this.div = document.getElementById('e_output');
    this.insert_button = document.getElementById('e_output_insert');
    this.cancel_button = document.getElementById('e_output_cancel');
    this.output_box = document.getElementById('e_output_output');
    this.state_name = '';

    let element = this;
    this.insert_button.addEventListener('click', () => {
      this.insert_button_event(element);
    });
    this.cancel_button.addEventListener('click', () => {
      this.cancel_button_event(element);
    });
  }
  insert_button_event() {
    let state_name = this.state_name;
    let old_output = this.output;
    let new_output = this.output_box.value;

    this.stm_table.edit_output(state_name, old_output, new_output);

    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    update_graph(svg);
    this.hidden();
  }

  cancel_button_event() {
    this.hidden();
  }
  hidden() {
    this.div.hidden = true;
    this.table.hidden = false;
  }
  set_state(state_name) {
    this.state_name = state_name;
  }
  set_output(output) {
    this.output = output;
  }
  show() {
    this.output_box.value = this.output;
    this.div.hidden = false;
    this.table.hidden = true;
  }
}

class Insert_transition {
  constructor(stm_table, table) {
    this.stm_table = stm_table;
    this.table_manager = table;
    this.table = document.getElementById('table');
    this.div = document.getElementById('i_tran');
    this.insert_button = document.getElementById('i_tran_insert');
    this.cancel_button = document.getElementById('i_tran_cancel');
    this.destination_box = document.getElementById('i_tran_dest');
    this.condition_box = document.getElementById('i_tran_cond');
    this.state_name = '';

    let element = this;
    this.insert_button.addEventListener('click', () => {
      this.insert_button_event(element);
    });
    this.cancel_button.addEventListener('click', () => {
      this.cancel_button_event(element);
    });
  }

  set_states(states) {
    this.destination_box.innerHTML = '';
    for (const x in states) {
      let option = document.createElement("option");
      option.text = states[x];
      this.destination_box.add(option);
    }
  }

  insert_button_event() {
    let state_name = this.state_name;
    let destination = this.destination_box.value;
    let condition = this.condition_box.value;
    this.stm_table.add_condition(state_name, destination, condition);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    update_graph(svg);
    this.hidden();
  }

  remove_transition(state_name, destination, condition) {
    this.stm_table.remove_transition(state_name, destination, condition);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    update_graph(svg);
    this.hidden();
  }

  cancel_button_event() {
    this.hidden();
  }

  hidden() {
    this.div.hidden = true;
    this.table.hidden = false;
  }
  set_state(state_name) {
    this.state_name = state_name;
  }
  show() {
    this.div.hidden = false;
    this.table.hidden = true;
  }
}

class Edit_transition {
  constructor(stm_table, table) {
    this.stm_table = stm_table;
    this.table_manager = table;
    this.table = document.getElementById('table');
    this.div = document.getElementById('e_tran');
    this.insert_button = document.getElementById('e_tran_insert');
    this.cancel_button = document.getElementById('e_tran_cancel');
    this.destination_box = document.getElementById('e_tran_dest');
    this.condition_box = document.getElementById('e_tran_cond');
    this.state_name = '';
    this.destination = '';
    this.condition = '';

    let element = this;
    this.insert_button.addEventListener('click', () => {
      this.insert_button_event(element);
    });
    this.cancel_button.addEventListener('click', () => {
      this.cancel_button_event(element);
    });
  }
  insert_button_event() {
    let state_name = this.state_name;
    let old_destination = this.destination;
    let old_condition = this.condition;

    let new_destination = this.destination_box.value;
    let new_condition = this.condition_box.value;

    this.stm_table.edit_transition(state_name, old_destination, old_condition, new_destination, new_condition);

    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    update_graph(svg);
    this.hidden();
  }

  cancel_button_event() {
    this.hidden();
  }

  hidden() {
    this.div.hidden = true;
    this.table.hidden = false;
  }
  set_state(state_name) {
    this.state_name = state_name;
  }
  set_states(states) {
    this.destination_box.innerHTML = '';
    for (const x in states) {
      let option = document.createElement("option");
      option.text = states[x];
      this.destination_box.add(option);
    }
  }
  set_transition(destination, condition) {
    this.destination = destination;
    this.condition = condition;
  }
  show() {
    this.destination_box.value = this.destination;
    this.condition_box.value = this.condition;
    this.div.hidden = false;
    this.table.hidden = true;
  }
}

let graph = undefined;
function update_graph(svg) {
  if (graph !== undefined) {
    svgPanZoom(graph).destroy();
    document.getElementById('container').removeChild(graph);
  }
  let embed = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  embed.setAttribute('style', 'width: 100%; height: 720px;');
  embed.setAttribute('type', 'image/svg+xml');
  embed.innerHTML = svg;
  document.getElementById('container').appendChild(embed);

  let pan_zoom = svgPanZoom(embed, pan_config);
  pan_zoom.zoom(0.5);
  pan_zoom.center();
  pan_zoom.resize();
  graph = embed;
}


let pan_config = {
  zoomEnabled: true,
  controlIconsEnabled: true,
  fit: true,
  center: true,
};

