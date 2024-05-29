module counter_top(
    input wire clk,
    input wire reset,
    input wire enable,
    output wire [7:0] count_out
);

// Instantiate the counter logic
counter_logic counter(
    .clk(clk),
    .reset(reset),
    .enable(enable),
    .count(count_out)
);

endmodule
