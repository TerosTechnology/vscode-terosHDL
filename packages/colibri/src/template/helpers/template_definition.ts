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