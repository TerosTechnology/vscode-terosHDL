library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity myent is
generic (
    a : integer;
    b : unsigned;
    c : signed;
    d : std_logic;
    e : std_logic_vector;
    f : std_logic_vector(5 downto 0)
  );
port(
  g : in std_logic;
  h : out std_logic;
  i : inout std_logic
);
end myent;  

architecture e_arch of myent is
begin 

end e_arch;