library ieee;
use ieee.std_logic_1164.all;

--! Package
--! comments
package test_package_name is
    signal a : integer; --! Signal description 0
    signal b,c : std_logic_vector(1 downto 0);
  
    --! Constant description
    --! multiline
    constant d : integer := 8;
    constant e,f : integer := 0;
  
    type state_0 is (INIT, ENDS);

    --! Description procedure
    procedure counter(signal minutes: in integer; signal seconds: out integer);
  end package test_package_name;
   
  package body test_package_name is
  end package body test_package_name;