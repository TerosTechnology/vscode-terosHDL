-- half_adder.vhd

library ieee;
use ieee.std_logic_1164.all;

entity half_adder is 
  port (a, b : in std_logic;
        sum, carry : inout std_logic
    );
end half_adder;

architecture arch of half_adder is
begin
  sum <= a xor b;
  carry <= a and b;
end arch;