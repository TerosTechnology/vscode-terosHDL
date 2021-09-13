.. _start_netlist:

Getting started
===============

It shows the schematic of your Verilog/SV module.

.. important::

    It only parse the current file, if it depends of other modules it will fail. Only a small subset of SystemVerilog is supported.


.. code-block:: verilog

  module jsrflipflop(q,qbar,clk,rst,sr);
    output reg q;
    output qbar;
    input clk, rst;
    input [1:0] sr;
  
    assign qbar = ~q;
  
    always @(posedge clk)
    begin
    	if (rst)
    	  q <= 0;
    	else
    	  case(sr)
    		  2'b00: q <= q;
    		  2'b01: q <= 0;
    		  2'b10: q <= 1;
    		  2'b11: q <= 1'bx;
    	  endcase
    end
  endmodule


.. image:: images/netlist.gif

