library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library src_lib;
--
library vunit_lib;
context vunit_lib.vunit_context;

entity test_entity_name_tb is
  generic (
    runner_cfg : string
  );
end;

architecture bench of test_entity_name_tb is
  -- Clock period
  constant clk_period : time := 5 ns;
  -- Generics
  constant a : integer := 0;
  constant b : unsigned := (others => '0');
  constant c : signed := (others => '0');
  constant d : std_logic := '1';
  constant e : std_logic_vector := "10001";
  constant f : std_logic_vector(5 downto 0) := (others => '0');
  -- Ports
  signal g : std_logic;
  signal h : std_logic;
  signal i : std_logic;
begin

  test_entity_name_inst : entity work.test_entity_name
  generic map (
    a => a,
    b => b,
    c => c,
    d => d,
    e => e,
    f => f
  )
  port map (
    g => g,
    h => h,
    i => i
  );

  main : process
  begin
    test_runner_setup(runner, runner_cfg);
    while test_suite loop
      if run("test_alive") then
        info("Hello world test_alive");
        wait for 100 * clk_period;
        test_runner_cleanup(runner);
        
      elsif run("test_0") then
        info("Hello world test_0");
        wait for 100 * clk_period;
        test_runner_cleanup(runner);
      end if;
    end loop;
  end process main;

--   clk_process : process
--   begin
--     clk <= '1';
--     wait for clk_period/2;
--     clk <= '0';
--     wait for clk_period/2;
--   end process clk_process;

end;