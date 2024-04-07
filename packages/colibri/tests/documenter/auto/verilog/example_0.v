`include "my_incl.vh"
`include "my_inclsv.svh"

//! **Detailed port documentation:**
//!
//! **d**: <a name="id1"></a> Input data and a long explanation of the port
//! in multiple lines
//! in multiple lines
//! in multiple lines
//! in multiple lines
//! in multiple lines
//! in multiple lines
//! in multiple lines.
//!
//! **clk**:  <a name="id2"></a> input clk with looooooooooooooonnnnnnnggg description
//! 
//! **clear**: <a name="id3"></a> Input clear with 
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines
//! and absurd long description in multiple lines

module behav_counter( d, clk, clear, load, up_down, qd);

  // Port Declaration

  input   [7:0] d; //! [Description](#id1)
  input   clk; //! [Description](#id2)
  //! [Description](#id3)
  input   clear; 
  input   load;
  input   up_down;
  output  [7:0] qd;

  reg     [7:0] cnt;

  always @ (posedge clk)
  begin
    if (!clear)
      cnt <= 8'h00;
    else if (load)
      cnt <= d;
    else if (up_down)
      cnt <= cnt + 1;
    else
      cnt <= cnt - 1;
  end

  assign qd = cnt;

endmodule
