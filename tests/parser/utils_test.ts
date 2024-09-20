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

import { equal } from "assert";
import * as common from "../../src/colibri/parser/common";

export function check_generic(actual: common.Port_hdl, expected: common.Port_hdl) {
    equal(actual.info.name, expected.info.name);
    equal(actual.direction, expected.direction);
    equal(actual.type, expected.type);
    // equal(actual.default_value, expected.default_value);
}

export function check_logic(actual: common.Logic_hdl, expected: common.Logic_hdl) {
    equal(actual.info.name, expected.info.name);
    equal(actual.type, expected.type);
}

export function check_custom(actual: common.Custom_hdl, expected: common.Custom_hdl) {
    equal(actual.info.name, expected.info.name);
    equal(actual.type, expected.type);
}

export function check_port(actual: common.Port_hdl, expected: common.Port_hdl) {
    equal(actual.info.name, expected.info.name);
    equal(actual.direction, expected.direction);
    equal(actual.type, expected.type);
    equal(actual.default_value, expected.default_value);
}

export function check_modport(actual: common.Modport_hdl, expected: common.Modport_hdl) {
    equal(actual.info.name, expected.info.name);
    const expected_ports = expected.ports;
    for (let i = 0; i < expected_ports.length; i++) {
        check_port(actual.ports[i], expected_ports[i]);
    }
}

