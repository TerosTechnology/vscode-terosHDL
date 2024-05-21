library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity counter_logic is
    port (
        clk     : in std_logic;
        reset   : in std_logic;
        enable  : in std_logic;
        count   : out std_logic_vector(7 downto 0)
    );
end counter_logic;

architecture behavioral of counter_logic is
    signal r0_count : unsigned(7 downto 0) := (others => '0');
begin
    process(clk, reset)
    begin
        if reset = '1' then
            r0_count <= (others => '0');
        elsif rising_edge(clk) then
            if enable = '1' then
                r0_count <= r0_count + 1;
            end if;
        end if;
    end process;

    count <= std_logic_vector(r0_count);
end behavioral;
