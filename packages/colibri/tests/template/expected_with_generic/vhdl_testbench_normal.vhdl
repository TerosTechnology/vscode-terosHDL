--  The licenses for most software and other practical works are designed
--  to take away your freedom to share and change the works.  By contrast,
--  the GNU General Public License is intended to guarantee your freedom to
--  share and change all versions of a program--to make sure it remains free
--  software for all its users.  We, the Free Software Foundation, use the
--  GNU General Public License for most of our software; it applies also to
--  any other work released this way by its authors.  You can apply it to
--  your programs, too.
--  
--  




library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity test_entity_name_tb is
end;

architecture bench of test_entity_name_tb is
  -- Clock period
  constant clk_period : time := 5 ns;
  -- Generics
  constant b : unsigned := (others => '0');
  constant c : signed := (others => '0');
  constant d : std_logic := '1';
  constant e : std_logic_vector := "10001";
  constant f : std_logic_vector(5 downto 0) := (others => '0');
  constant gg : integer := 0;
  constant hg : string := "";
  constant ig : boolean := false;
  constant jg : std_logic_vector := (others => '0');
  constant kg : std_logic := '0';
  -- Ports
  signal g : std_logic;
  signal h : std_logic;
  signal i : std_logic;
begin

  test_entity_name_inst : entity work.test_entity_name
  generic map (
    b => b,
    c => c,
    d => d,
    e => e,
    f => f,
    gg => gg,
    hg => hg,
    ig => ig,
    jg => jg,
    kg => kg
  )
  port map (
    g => g,
    h => h,
    i => i
  );
-- clk_process : process
-- begin
-- clk <= '1';
-- wait for clk_period/2;
-- clk <= '0';
-- wait for clk_period/2;
-- end process clk_process;

end;