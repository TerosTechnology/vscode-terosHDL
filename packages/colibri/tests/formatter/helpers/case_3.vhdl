library ieee;
use ieee.std_logic_1164.all;

ENTITY test_entity_name is
generic (
    a : integer;
    b : std_logic := '1';
    c, d : std_logic_vector(1 downto 0)
  );
port(
  e:             in std_logic; -- comment 0
  f: OUT std_logic; -- comment 1
  g:                   inout std_logic; -- comment 2
  h: in std_logic_vector(31 downto 0); -- comment 3
  i:             in std_logic_vector(31 downto 0) := "0010"; -- comment 4
  j,k : in std_logic := '1' -- comment 5
);
end test_entity_name;  

architecture e_arch of test_entity_name is
               signal m : integer;
  signal n,p : std_logic_vector(1 downto 0);

                              constant r : integer := 0;
  CONSTANT q,s : integer := 0;

  function counter(minutes : integer := 0; seconds : integer := 0) 
                       return integer is variable total_seconds : integer;
  begin
                     end function;

  begin 

label_0: process begin
end process; 

label_1: process (a, b) begin
g <= '0';
end process;

half_adder_inst : entity work.half_adder
  port map (
                 g => g,
    h => h,
                 i => i
            );

  process(a) is
  begin
      if rising_edge(a) then
          if b = '0' then
              f   <= d;
          else
              case a is

                  when a =>
                      f <= '1';
                      -- If 5 seconds have passed
                      if b then
                          f   <= 0;
                      end if;

                  when d =>
                      f   <= '1';
                      if c then
                          f <= 0;
                      end if;

              end case;

          end if;
      end if;
  end process;

end e_arch;