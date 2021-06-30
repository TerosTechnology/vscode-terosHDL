// MIT License

// Copyright (c) 2018 fusesoc

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

`timescale 1ns/1ns
module blinky_tb;

   parameter clk_freq_hz = 50_000;
   parameter pulses = 5;
   localparam clk_half_period = 1000_000_000/clk_freq_hz/2;

   reg clk = 1'b1;

   always #clk_half_period clk <= !clk;


   wire led;

   vlog_tb_utils vtu();

   blinky
     #(.clk_freq_hz (clk_freq_hz))
   dut
     (.clk (clk),
      .q   (led));

   integer i;
   time last_edge = 0;

   initial begin
      @(posedge clk);
      @(led);
      last_edge = $time;
      for (i=0; i<pulses;i=i+1) begin
	 @(led);
	 if (($time-last_edge) != 1_000_000_000) begin
	    $display("Error! Length of pulse was %0d ns", $time-last_edge);
	    $finish;
	 end else
	   $display("Pulse %0d/%0d OK!", i+1, pulses);
	 last_edge = $time;
      end
      $display("Testbench finished OK");
      $finish;
   end

endmodule