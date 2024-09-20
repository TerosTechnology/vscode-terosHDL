LIBRARY ieee;
USE ieee.std_logic_1164.ALL;

ENTITY my_ent_generic_port IS
  GENERIC (
    PORT_COUNT    : NATURAL;
    port_COUNT    : NATURAL;
    generic_COUNT : NATURAL;
    ENTITY_COUNT  : NATURAL;
    GENERIC_COUNT : NATURAL);
  PORT (
    port_ena            : IN bit_vector(PORT_COUNT - 1 DOWNTO 0);
    ENTITY_signal       : IN bit_vector(port_COUNT - 1 DOWNTO 0);
    GENERIC_signal      : IN bit_vector(generic_COUNT - 1 DOWNTO 0);
    generic_signal      : IN bit_vector(GENERIC_COUNT - 1 DOWNTO 0);
    architecture_signal : IN bit_vector(architecture_COUNT - 1 DOWNTO 0);
    end_signal          : IN STD_LOGIC);
END ENTITY;

ARCHITECTURE e_arch OF my_ent IS

BEGIN

END e_arch;
