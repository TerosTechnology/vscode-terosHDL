-- no comment
library ieee;
use ieee.std_logic_1164.all;

--! Example multi
--! description
entity sample_0 is 
    port (
        --! Comment 0
        --! multiline with **bold**
        port_0 : in std_logic;
        port_1 : out std_logic; --! Comment 1
        --! Comment 2
        port_2 : in std_logic_vector(2 downto 0); --! Also inline
        port_3 : out std_logic;
        port_4, port_5, port_6 : in std_logic --! Comment 4 ```with some code```
    );
end sample_0;

architecture arch of sample_0 is  
  constant period : time := 20 ns;
begin


end arch;