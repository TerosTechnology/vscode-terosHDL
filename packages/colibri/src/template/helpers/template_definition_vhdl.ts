export const clock =
`{% if clock_style == "inline" -%}
-- {{ indent[1] }}clk <= not clk after clk_period/2;
{% else -%}
-- {{ indent[1] }}clk_process : process
-- {{ indent[1] }}begin
-- {{ indent[2] }}clk <= '1';
-- {{ indent[2] }}wait for clk_period/2;
-- {{ indent[2] }}clk <= '0';
-- {{ indent[2] }}wait for clk_period/2;
-- {{ indent[1] }}end process clk_process;
{% endif -%}`;

export const hdl_element_component =
`component {{ name }}
{% for generic_inst in generic -%}
{% if loop.first -%}
{{ indent[1] }}generic (
{% endif -%}
{% if loop.last -%}
{{ indent[2] }}{{generic_inst['info']['name']}} : {{generic_inst['type']}}
{{ indent[1] }});
{% else -%}
{{ indent[2] }}{{generic_inst['info']['name']}} : {{generic_inst['type']}};
{% endif -%}
{% endfor -%}
{{ indent[1] }}port (
{% for port_inst in port -%}
{% if loop.last -%}
{{ indent[2] }}{{port_inst['info']['name']}} : {{port_inst['direction']}} {{port_inst['type']}}
{% else -%}
{{ indent[2] }}{{port_inst['info']['name']}} : {{port_inst['direction']}} {{port_inst['type']}};
{% endif -%}
{% endfor -%}
{{ indent[1] }});
end component;`;

export const hdl_element_instance = 
`{% if instance_style == "separate" -%}
{{ name }}_inst : {{ name }}
{% for generic_inst in generic -%}
{% if loop.first -%}
{{ indent[1] }}generic map (
{% endif -%}
{% if loop.last -%}
{{ indent[2] }}{{generic_inst['info']['name']}} ={{ special_char_0 | safe }} {{generic_inst['info']['name']}}
{{ indent[1] }})
{% else -%}
{{ indent[2] }}{{generic_inst['info']['name']}} ={{ special_char_0 | safe }} {{generic_inst['info']['name']}},
{% endif -%}
{% endfor -%}
{{ indent[1] }}port map (
{% for port_inst in port -%}
{% if loop.last -%}
{{ indent[2] }}{{port_inst['info']['name']}} ={{ special_char_0 | safe }} {{port_inst['info']['name']}}
{% else -%}
{{ indent[2] }}{{port_inst['info']['name']}} ={{ special_char_0 | safe }} {{port_inst['info']['name']}},
{% endif -%}
{% endfor -%}
{{ indent[1] }});
{% else -%}
{{ name }}_inst : entity work.{{ name }}
{% for generic_inst in generic -%}
{% if loop.first -%}
{{ indent[1] }}generic map (
{% endif -%}
{% if loop.last -%}
{{ indent[2] }}{{generic_inst['info']['name']}} ={{ special_char_0 | safe }} {{generic_inst['info']['name']}}
{{ indent[1] }})
{% else -%}
{{ indent[2] }}{{generic_inst['info']['name']}} ={{ special_char_0 | safe }} {{generic_inst['info']['name']}},
{% endif -%}
{% endfor -%}
{{ indent[1] }}port map (
{% for port_inst in port -%}
{% if loop.last -%}
{{ indent[2] }}{{port_inst['info']['name']}} ={{ special_char_0 | safe }} {{port_inst['info']['name']}}
{% else -%}
{{ indent[2] }}{{port_inst['info']['name']}} ={{ special_char_0 | safe }} {{port_inst['info']['name']}},
{% endif -%}
{% endfor -%}
{{ indent[1] }});
{% endif -%}`;

export const hdl_element_signal =
`{% for element in generic -%}
{% if element['default_value'] != "" -%}
{{ indent[1] }}constant {{element['info']['name']}} : {{element['type']}} := {{element['default_value']|safe}};
{% else -%}
{{ indent[1] }}constant {{element['info']['name']}} : {{element['type']}};
{% endif -%}
{% endfor -%}

{% for element in port -%}
{{ indent[1] }}signal {{element['info']['name']}} : {{element['type']}};
{% endfor -%}`;

export const testbench_normal = 
`{{ header }}
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity {{ name }}_tb is
end;

architecture bench of {{ name }}_tb is
{{ indent[1] }}-- Clock period
{{ indent[1] }}constant clk_period : time := 5 ns;
{{ indent[1] }}-- Generics
{% for element in generic -%}
{% if element['default_value'] != "" -%}
{{ indent[1] }}constant {{element['info']['name']}} : {{element['type']}} := {{element['default_value']|safe}};
{% else -%}
{{ indent[1] }}constant {{element['info']['name']}} : {{element['type']}};
{% endif -%}
{% endfor -%}
{{ indent[1] }}-- Ports
{% for port_inst in port -%}
{{ indent[1] }}signal {{port_inst['info']['name']}} : {{port_inst['type']}};
{% endfor -%}
{% if instance_style == "separate" %}
{{ indent[1] }}{{ component }}
{% endif -%}
begin

{{ indent[1] }}{{ instance }}
{{ clock }}
end;`;

export const testbench_vunit = 
`{{ header }}
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library src_lib;
--
library vunit_lib;
context vunit_lib.vunit_context;

entity {{ name }}_tb is
{{ indent[1] }}generic (
{{ indent[2] }}runner_cfg : string
{{ indent[1] }});
end;

architecture bench of {{ name }}_tb is
{{ indent[1] }}-- Clock period
{{ indent[1] }}constant clk_period : time := 5 ns;
{{ indent[1] }}-- Generics
{% for element in generic -%}
{% if element['default_value'] != "" -%}
{{ indent[1] }}constant {{element['info']['name']}} : {{element['type']}} := {{element['default_value']|safe}};
{% else -%}
{{ indent[1] }}constant {{element['info']['name']}} : {{element['type']}};
{% endif -%}
{% endfor -%}
{{ indent[1] }}-- Ports
{% for port_inst in port -%}
{{ indent[1] }}signal {{port_inst['info']['name']}} : {{port_inst['type']}};
{% endfor -%}
{% if instance_style == "separate" %}
{{ indent[1] }}{{ component }}
{% endif -%}
begin

{{ indent[1] }}{{ instance }}
{{ indent[1] }}main : process
{{ indent[1] }}begin
{{ indent[2] }}test_runner_setup(runner, runner_cfg);
{{ indent[2] }}while test_suite loop
{{ indent[3] }}if run("test_alive") then
{{ indent[4] }}info("Hello world test_alive");
{{ indent[4] }}wait for 100 * clk_period;
{{ indent[4] }}test_runner_cleanup(runner);
        
{{ indent[3] }}elsif run("test_0") then
{{ indent[4] }}info("Hello world test_0");
{{ indent[4] }}wait for 100 * clk_period;
{{ indent[4] }}test_runner_cleanup(runner);
{{ indent[3] }}end if;
{{ indent[2] }}end loop;
{{ indent[1] }}end process main;

{{ clock }}
end;`;

export const hdl_element_instance_vhdl_new =
`{{ name }}_inst : entity work.{{ name }}
{% for generic_inst in generic -%}
{% if loop.first -%}
{{ indent[1] }}generic map (
{% endif -%}
{% if loop.last -%}
{{ indent[2] }}{{generic_inst['info']['name']}} ={{ special_char_0 | safe }} {{generic_inst['info']['name']}}
{{ indent[1] }})
{% else -%}
{{ indent[2] }}{{generic_inst['info']['name']}} ={{ special_char_0 | safe }} {{generic_inst['info']['name']}},
{% endif -%}
{% endfor -%}
{{ indent[1] }}port map (
{% for port_inst in port -%}
{% if loop.last -%}
{{ indent[2] }}{{port_inst['info']['name']}} ={{ special_char_0 | safe }} {{port_inst['info']['name']}}
{% else -%}
{{ indent[2] }}{{port_inst['info']['name']}} ={{ special_char_0 | safe }} {{port_inst['info']['name']}},
{% endif -%}
{% endfor -%}
{{ indent[1] }});`;