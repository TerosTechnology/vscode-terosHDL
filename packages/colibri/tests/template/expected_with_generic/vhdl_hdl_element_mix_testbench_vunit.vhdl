`include "vunit_defines.svh"

module test_entity_name_tb;

  // Parameters
  localparam  a = 0;
  localparam  b = 0;
  localparam  c = 0;
  localparam  d = 0;
  localparam  e = 0;
  localparam  f = 0;

  //Ports
  reg reg g;
  wire reg;
  wire reg;

  test_entity_name
  # (
    .a(a),
    .b(b),
    .c(c),
    .d(d),
    .e(e),
    .f(f)
  )
  test_entity_name_inst (
    .g(g),
    .h(h),
    .i(i)
  );

  `TEST_SUITE begin
    // It is possible to create a basic test bench without any test cases
    $display("Hello world");
  end

//  initial begin
//    begin
//      $finish;
//    end
//  end

endmodule