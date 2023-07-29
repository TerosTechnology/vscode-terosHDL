library ieee;
use ieee.std_logic_1164.all;

entity sample_3 is
    port (
        --! Description 0
        port_0_no : in std_logic;
        port_1_no : in std_logic; --! Description 1
        port_2_no : in std_logic; --! Description 2
        --! @virtualbus virtualbus_0
        --! Description 0_v0
        port_0_v0 : in std_logic;
        port_1_v0 : in std_logic; --! Description 1_v0
        --! @end
        --! Description 3
        port_3_no : in std_logic;
        port_4_no : in std_logic; --! Description 4
        --! @virtualbus virtualbus_1 Description of **virtual bus 1** 
        port_0_v1 : in std_logic; --! Description 0_v1
        port_1_v1 : in std_logic; --! @end Description 1_v1
        port_5_no : in std_logic; --! Description 5
        --! Description 6
        port_6_no : in std_logic;
        --! @virtualbus virtualbus_2 @dir in
        port_0_v2 : in std_logic;
        port_2_v2 : in std_logic;
        --! @virtualbus virtualbus_3 @dir out Description of **virtual bus 3** 
        port_0_v3 : in std_logic;
        port_1_v3 : in std_logic;
         --! @end 
        port_7_no : in std_logic; --! Description 7
        --! @virtualbus virtualbus_4 @notable Description of **virtual bus 4** 
        port_0_v4 : in std_logic; --! Description 0_v4
        --! Description 0_v4
        port_1_v4 : in std_logic
         --! @end 
    );
end sample_3;

architecture arch of sample_3 is
begin

end arch;