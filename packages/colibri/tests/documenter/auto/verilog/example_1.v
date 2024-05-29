//! mymodule design
module test_entity_name 
#(
    parameter a=8,
    parameter b=9,
    parameter c=10, d=11
)
(
    input e,
    output f,
    input reg g,
    input wire h,
    input reg [7:0] i, j,
    input wire [9:0] k,
    output wire [9:0] l
);  

function [7:0] sum;  
    input [7:0] a, b;  
    begin  
        sum = a + b;  
    end  
endfunction

wire m;
wire n, p;
reg [$clog2(clk_freq_hz)] q;

//! Description localparam 0
localparam r = 2;

localparam r_0 = 5; //! Description localparam 1

always @(posedge a) begin : label_0
end

always_comb begin
end

always_ff begin : label_1
end

always_latch begin
end

//! Instantiation description
test_entity_name_0
#(
  .a(a ),
  .b(b ),
  .c(c ),
  .d (d )
)
test_entity_name_dut_0 (
  .e (e ),
  .f (f ),
  .g (g ),
  .h (h ),
  .i (i ),
  .j (j ),
  .k (k ),
  .l  ( l)
);

test_entity_name_1
test_entity_name_dut_1 (
  .e (e ),
  .f (f ),
  .g (g ),
  .h (h ),
  .i (i ),
  .j (j ),
  .k (k ),
  .l  ( l)
);

test_entity_name_2
#(
  .a(a ),
  .b(b ),
  .c(c ),
  .d (d )
)
test_entity_name_dut_2();

endmodule