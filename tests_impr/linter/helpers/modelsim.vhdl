library ieee;
use ieee.std_logic_1164.all;

entity modelsim is
  port (
    a : in std_logic;
    b : in std_logic;
    c : out std_logic
  );

end modelsim;

architecture modelsim_arch of modelsim is
  constant cnt_SAMPLE : integer;
  signal s_sample     : std_logic_vector := 8;
begin

end modelsim_arch;