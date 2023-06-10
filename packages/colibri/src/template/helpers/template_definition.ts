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
{{ indent[1] }}dut.{{port_inst['info']['name']}} = 0
{% endfor -%}

{{ indent[1] }}await Timer(20*PERIOD, units='ns')

{% for port_inst in port -%}
{{ indent[1] }}dut.{{port_inst['info']['name']}} = 1
{% endfor -%}

{{ indent[1] }}await Timer(20*PERIOD, units='ns')

# Register the test.
factory = TestFactory(run_test)
factory.generate_tests()`;

export const header = 
`{% if header != "" -%}
{{ header }}

{% endif -%}`;