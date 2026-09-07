library ieee;
use ieee.std_logic_1164.all;

entity traffic_light is
    port (
        clk   : in  std_logic;
        reset : in  std_logic;
        state : out std_logic_vector(1 downto 0)
    );
end entity;

architecture rtl of traffic_light is
    type t_state is (RED, GREEN, YELLOW);
    signal current_state : t_state;
begin
    process(clk, reset)
    begin
        if reset = '1' then
            current_state <= RED;
        elsif rising_edge(clk) then
            case current_state is
                when RED    => current_state <= GREEN;
                when GREEN  => current_state <= YELLOW;
                when YELLOW => current_state <= RED;
            end case;
        end if;
    end process;

    state <= "00" when current_state = RED    else
             "01" when current_state = GREEN  else
             "10";
end architecture;