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

export const clock = 
`{% if clock_style == "inline" -%}
//{{ indent[1] }}always #5  clk = ! clk ;
{% else -%}
//{{ indent[1] }}initial begin
//{{ indent[2] }}begin
//{{ indent[3] }}$finish;
//{{ indent[2] }}end
//{{ indent[1] }}end
{% endif -%}`;

export const hdl_element_instance = 
`{{ name -}}
{% for generic_inst in generic -%}
{% if loop.first -%}
{{special_char_1}}# (
{% endif -%}
{% if loop.last -%}
{{ indent[2] }}.{{generic_inst['info']['name']}}({{generic_inst['info']['name']}})
{{ indent[1] }})
{% else -%}
{{ indent[2] }}.{{generic_inst['info']['name']}}({{generic_inst['info']['name']}}),
{% endif -%}
{% endfor -%}
{{indent[1]}}{{ name }}_inst (
{% for port_inst in port -%}
{% if loop.last -%}
{{ indent[2] }}.{{port_inst['info']['name']}}({{port_inst['info']['name']}})
{% else -%}
{{ indent[2] }}.{{port_inst['info']['name']}}({{port_inst['info']['name']}}),
{% endif -%}
{% endfor -%}
{{ indent[1] }});`;

export const hdl_element_component = "";

export const hdl_element_signal =
`{% for port_inst in port -%}
{% if port_inst['type'] == "" -%}
{{ indent[1] }}reg {{port_inst['info']['name']}};
{% else -%}
{{ indent[1] }}{% if port_inst['type'] != 'wire' and port_inst['type'] != 'reg' %}{{ port_inst['type'] | replaceWire }}{% else %}reg {% endif %} {{port_inst['info']['name']}};
{% endif -%}
{% endfor -%}`;

export const testbench_normal =
`{{ header }}
module {{ name }}_tb;

{{ indent[1] }}// Parameters
{% for generic_inst in generic -%}
{{ indent[1] }}localparam {{generic_inst['type']}} {{generic_inst['info']['name']}} = 0;
{% endfor %}
{{ indent[1] }}//Ports
{% for port_inst in port -%}
{% if port_inst['direction'] == "input" -%}
{{ indent[1] }}{% if port_inst['type'] != 'wire' and port_inst['type'] != 'reg' %}{{ port_inst['type'] | replaceWire }}{% else %}reg {% endif %} {{port_inst['info']['name']}};
{% else -%}
{{ indent[1] }}{% if port_inst['type'] != 'wire' and port_inst['type'] != 'reg' %}{{ port_inst['type'] }}{% else %}wire {% endif %} {{port_inst['info']['name']}};
{% endif -%}
{% endfor %}
{{ indent[1] }}{{ instance }}

{{ clock }}
endmodule`;

export const testbench_vunit = 
`{{ header }}
\`include "vunit_defines.svh"

module {{ name }}_tb;

{{ indent[1] }}// Parameters
{% for generic_inst in generic -%}
{{ indent[1] }}localparam {{generic_inst['type']}} {{generic_inst['info']['name']}} = 0;
{% endfor %}
{{ indent[1] }}//Ports
{% for port_inst in port -%}
{% if port_inst['direction'] == "input" -%}
{{ indent[1] }}{% if port_inst['type'] != 'wire' and port_inst['type'] != 'reg' %}{{ port_inst['type'] | replaceWire }}{% else %}reg {% endif %} {{port_inst['info']['name']}};
{% else -%}
{{ indent[1] }}{% if port_inst['type'] != 'wire' and port_inst['type'] != 'reg' %}{{ port_inst['type'] }}{% else %}wire {% endif %} {{port_inst['info']['name']}};
{% endif -%}
{% endfor %}
{{ indent[1] }}{{ instance }}

{{ indent[1] }}\`TEST_SUITE begin
{{ indent[2] }}// It is possible to create a basic test bench without any test cases
{{ indent[2] }}$display("Hello world");
{{ indent[1] }}end

{{ clock }}
endmodule`;

export const hdl_element_instance_vhdl_new = "";

