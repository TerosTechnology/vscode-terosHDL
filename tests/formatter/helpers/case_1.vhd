library ieee;
use ieee.std_logic_1164.all;

entity my_ent is
    generic (PORT_COUNT : natural);
    port(port_ena : in bit_vector(PORT_COUNT-1 downto 0));
  end entity;

architecture e_arch of my_ent is

begin

end e_arch;
