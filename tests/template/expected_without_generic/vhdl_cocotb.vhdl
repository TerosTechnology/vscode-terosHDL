//  The licenses for most software and other practical works are designed
//  to take away your freedom to share and change the works.  By contrast,
//  the GNU General Public License is intended to guarantee your freedom to
//  share and change all versions of a program--to make sure it remains free
//  software for all its users.  We, the Free Software Foundation, use the
//  GNU General Public License for most of our software; it applies also to
//  any other work released this way by its authors.  You can apply it to
//  your programs, too.
//  
//  




import cocotb
from cocotb.clock import Clock
from cocotb.triggers import Timer
from cocotb.regression import TestFactory

@cocotb.test()
async def run_test(dut):
  PERIOD = 10

  dut.g = 0
  dut.i = 0


  await Timer(20*PERIOD, units='ns')
  h = dut.h.value


  dut.g = 0
  dut.i = 0


  await Timer(20*PERIOD, units='ns')
  h = dut.h.value


# Register the test.
factory = TestFactory(run_test)
factory.generate_tests()