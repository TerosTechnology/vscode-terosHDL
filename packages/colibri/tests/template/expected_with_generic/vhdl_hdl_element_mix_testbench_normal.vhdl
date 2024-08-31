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




module test_entity_name_tb;

  // Parameters
  localparam  b = 0;
  localparam  c = 0;
  localparam  d = 0;
  localparam  e = 0;
  localparam  f = 0;
  localparam  gg = 0;
  localparam  hg = 0;
  localparam  ig = 0;
  localparam  jg = 0;
  localparam  kg = 0;

  //Ports
  reg g;
  wire h;
  wire i;

  test_entity_name # (
    .b(b),
    .c(c),
    .d(d),
    .e(e),
    .f(f),
    .gg(gg),
    .hg(hg),
    .ig(ig),
    .jg(jg),
    .kg(kg)
  )
  test_entity_name_inst (
    .g(g),
    .h(h),
    .i(i)
  );

//initial begin
//begin
//$finish;
//end
//end

endmodule