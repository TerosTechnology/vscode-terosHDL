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

export const cocotb = 
`{{ header }}
import cocotb
from cocotb.clock import Clock
from cocotb.triggers import Timer
from cocotb.regression import TestFactory

@cocotb.test()
async def run_test(dut):
{{ indent[1] }}PERIOD = 10

{% for port_inst in port -%}
{% if port_inst['direction'] == "input" or port_inst['direction'] == "in" or port_inst['direction'] == "inout" -%}
{{ indent[1] }}dut.{{port_inst['info']['name']}} = 0
{% endif -%}
{% endfor -%}{{ special_char_2 | safe}}
{{ indent[1] }}await Timer(20*PERIOD, units='ns')
{% for port_inst in port -%}
{% if port_inst['direction'] == "output" or port_inst['direction'] == "out" -%}
{{ indent[1] }}{{port_inst['info']['name']}} = dut.{{port_inst['info']['name']}}.value
{% endif -%}
{% endfor -%}{{ special_char_2 | safe}}
{% for port_inst in port -%}
{% if port_inst['direction'] == "input" or port_inst['direction'] == "in" or port_inst['direction'] == "inout" -%}
{{ indent[1] }}dut.{{port_inst['info']['name']}} = 0
{% endif -%}
{% endfor -%}{{ special_char_2 | safe}}
{{ indent[1] }}await Timer(20*PERIOD, units='ns')
{% for port_inst in port -%}
{% if port_inst['direction'] == "output" or port_inst['direction'] == "out" -%}
{{ indent[1] }}{{port_inst['info']['name']}} = dut.{{port_inst['info']['name']}}.value
{% endif -%}
{% endfor -%}{{ special_char_2 | safe}}
# Register the test.
factory = TestFactory(run_test)
factory.generate_tests()`;

export const header = 
`{% if header != "" -%}
{{ header }}

{% endif -%}`;