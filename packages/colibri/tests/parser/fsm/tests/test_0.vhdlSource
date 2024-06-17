library ieee;
use ieee.std_logic_1164.all;

entity test_0 is
    port (
        clk : in std_logic
    );
end test_0;

architecture rtl of test_0 is
    type fsm_state is (s0, s1, s2, s3);
    signal state : fsm_state := s0;
    signal m0, m1, m2, m3, m4 : std_logic;
    signal o0, o1, o2, o3, o4 : std_logic;
begin
    process (clk)
    begin
        if rising_edge(clk) then
            case state is
                when s0 =>
                    if (m0 = '1') then
                        state <= s1;
                    end if;
                    if (m1 = '0') then
                        state <= s2;
                    else
                        state <= s3;
                    end if;
                when s1 =>
                    if (m2 = '1') then
                        state <= s1;
                    end if;
                    if (m3 = '0') then
                        state <= s0;
                    end if;
                when s2 =>
                    if (m1 = '1') then
                        if (m2 = '0') then
                            state <= s1;
                        else
                            state <= s3;
                        end if;
                    end if;
                    if (m3 = '1') then
                        state <= s2;
                    else
                        state <= s3;
                    end if;
            end case;
        end if;
    end process;

end rtl;