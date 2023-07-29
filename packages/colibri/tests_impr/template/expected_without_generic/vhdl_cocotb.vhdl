import cocotb
from cocotb.clock import Clock
from cocotb.triggers import Timer
from cocotb.regression import TestFactory

@cocotb.test()
async def run_test(dut):
  PERIOD = 10

  dut.g = 0
  dut.h = 0
  dut.i = 0
  await Timer(20*PERIOD, units='ns')

  dut.g = 1
  dut.h = 1
  dut.i = 1
  await Timer(20*PERIOD, units='ns')

# Register the test.
factory = TestFactory(run_test)
factory.generate_tests()
    