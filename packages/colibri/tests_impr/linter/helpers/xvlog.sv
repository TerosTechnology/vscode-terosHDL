module vodelsim_v(y,a);
  output y;
  input a;s

  always_ff @(posedge clk or posedge reset)
  begin
    if (reset == 1'b1)
      count <= 0;
    else
      if (enable == 1'b1) count <= count + 1'b1;
  end
 
endmodule
