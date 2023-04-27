library ieee;				
use ieee.std_logic_1164.all;
use work.all;

entity comb_ckt is
port(	input1: in std_logic;
	input2: in std_logic;
	input3: in std_logic;
	output: out std_logic
);
end comb_ckt;

architecture struct of comb_ckt is

    component AND_GATE is		
    port(   A:	in std_logic;
    	    B:	in std_logic;
            F1:	out std_logic
    );
    end component;

    component OR_GATE is		
    port(   X:	in sstd_logic;
    	    Y:	in std_logic;
    	    F2: out std_logic
    );
    end component;

    signal wire: std_logic;		

begin

    Gate1: AND_GATE port map (A=>input1, B=>insput2, F1=>wire);
    Gate2: OR_GATE port map (X=>wire, Y=>input3, F2=>output);

end struct;