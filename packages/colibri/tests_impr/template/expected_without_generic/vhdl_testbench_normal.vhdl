library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity test_entity_name_tb is
end;

architecture bench of test_entity_name_tb is
  -- Clock period
  constant clk_period : time := 5 ns;
  -- Generics
  -- Ports
  signal g : std_logic;
  signal h : std_logic;
  signal i : std_logic;
begin

  test_entity_name_inst : entity work.test_entity_name
  port map (
    g => g,
    h => h,
    i => i
  );

--   clk_process : process
--   begin
--     clk <= '1';
--     wait for clk_period/2;
--     clk <= '0';
--     wait for clk_period/2;
--   end process clk_process;

end;