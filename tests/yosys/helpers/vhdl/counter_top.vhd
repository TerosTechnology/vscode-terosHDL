library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

library mylib;

entity counter_top is
    port (
        clk     : in std_logic;
        reset   : in std_logic;
        enable  : in std_logic;
        count_out : out std_logic_vector(7 downto 0)
    );
end counter_top;

architecture structural of counter_top is
    signal internal_count : std_logic_vector(7 downto 0);
begin
    -- Instantiate the counter logic
    counter_logic_inst : entity mylib.counter_logic
        port map (
          clk => clk,
          reset => reset,
          enable => enable,
          count => internal_count
        );

    -- Output assignment
    count_out <= internal_count;

end structural;
