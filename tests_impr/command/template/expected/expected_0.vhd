library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity XOR_ent_tb is
end;

architecture bench of XOR_ent_tb is
    -- Clock period
    constant clk_period : time := 5 ns;
    -- Generics
    -- Ports
    signal x : std_logic;
    signal y : std_logic;
    signal F : std_logic;

    component XOR_ent
    port (
        x : std_logic;
        y : std_logic;
        F : std_logic
    );
end component;

begin

    XOR_ent_inst : XOR_ent
    port map (
        x => x,
        y => y,
        F => F
    );

--     clk <= not clk after clk_period/2;

end;