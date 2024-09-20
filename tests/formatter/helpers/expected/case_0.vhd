library ieee;
use ieee.std_logic_1164.all;

entity my_ent_generic_port is
  generic (
    PORT_COUNT    : natural;
    port_COUNT    : natural;
    generic_COUNT : natural;
    ENTITY_COUNT  : natural;
    GENERIC_COUNT : natural);
  port (
    port_ena            : in bit_vector(PORT_COUNT - 1 downto 0);
    ENTITY_signal       : in bit_vector(ENTITY_COUNT - 1 downto 0);
    GENERIC_signal      : in bit_vector(GENERIC_COUNT - 1 downto 0);
    generic_signal      : in bit_vector(GENERIC_COUNT - 1 downto 0);
    architecture_signal : in bit_vector(architecture_COUNT - 1 downto 0);
    end_signal          : in std_logic);
end entity;

architecture e_arch of my_ent is

begin

end e_arch;
