module counter_top(
    input wire clk,
    input wire reset,
    input wire enable,
    output wire [7:0] count_out
);

// Interface wires
wire [7:0] count_vhdl;

// Instantiate the VHDL counter
counter_logic counter(
    .clk(clk),
    .reset(reset),
    .enable(enable),
    .count(count_vhdl)
);

// Connect VHDL output to Verilog output
assign count_out = count_vhdl;

endmodule
