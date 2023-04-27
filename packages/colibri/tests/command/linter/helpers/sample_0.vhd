library ieee;
use ieee.std_logic_1164.all;


entity XOR_ent is
port(	x: in std_logic;
	y: in std_logic;
	F: out std_logic
);
end XOR_ent;  

architecture behv2 of XOR_ent is 
    constant cnt_s;
begin 

    F <= x xor y; s

end behv2;
