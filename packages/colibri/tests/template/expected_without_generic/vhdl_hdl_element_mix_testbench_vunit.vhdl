`include "vunit_defines.svh"

module test_entity_name_tb;

  // Parameters

  //Ports
  reg reg g;
  wire reg;
  wire reg;

  test_entity_name
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