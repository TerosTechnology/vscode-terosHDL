library ieee;
use ieee.std_logic_1164.all;

--! This is an entity description 5
--! multiline.
--! @author Miguel de Cervantes
--! @version 1.0.1
--! @brief Some description can be added here
--!
--! Example of description beakline
--!
--! Example of Wavedrom
--! image:	
--! { signal: [
--!   { name: "pclk", wave: 'p.......' },
--!   { name: "Pclk", wave: 'P.......' },
--!   { name: "nclk", wave: 'n.......' },
--!   { name: "Nclk", wave: 'N.......' },
--!   {},
--!   { name: 'clk0', wave: 'phnlPHNL' },
--!   { name: 'clk1', wave: 'xhlhLHl.' },
--!   { name: 'clk2', wave: 'hpHplnLn' },
--!   { name: 'clk3', wave: 'nhNhplPl' },
--!   { name: 'clk4', wave: 'xlh.L.Hx' },
--! ]}
--! Example of bitfield:
--!   {reg: [
--!   {bits: 7, name: 'opcode', attr: 'OP-IMM'},
--!   {bits: 5, name: 'rd', attr: 'dest'},
--!   {bits: 3, name: 'func3', attr: ['ADDI', 'SLTI', 'SLTIU', 'ANDI', 'ORI', 'XORI'], type: 4},
--!   {bits: 5, name: 'rs1', attr: 'src'},
--!   {bits: 12, name: 'imm[11:0]', attr: 'I-immediate[11:0]', type: 3}
--! ]}

entity test_entity_name is
    generic (
        --! Comment inline
        a : integer;
        --! Comment
        --! multiline with **markdown**
        b : std_logic := '1';
        -- No comment
        c, d : std_logic_vector(1 downto 0) := "10";
        --! Comment multiline
        --! with
        e : std_logic --! inline comment
    );
    port (
        --! Over comment in ```port```
        ee : in std_logic;
        --! @virtualbus v_bus_0  @dir out @keepports  Description of virtual bus 0
        f : out std_logic;
        ff : out std_logic;
        g : inout std_logic; --! @end
        h : in std_logic_vector(31 downto 0);
        i : in std_logic_vector(31 downto 0) := "0010";
        --! @virtualbus v_bus_1  @keepports  Description of virtual bus 1
        j : in std_logic := '1';
        l : out std_logic;
        m : in std_logic;
        --! @virtualbus v_bus_2  Description of virtual bus 2
        n : in std_logic; --! Description 3
        o : out std_logic; --! @end
        p : in std_logic;
        q : out std_logic; --! Inline comment
        r : in std_logic;
        --! Over comment
        s : out std_logic --! Preference inline
    );
end test_entity_name;

architecture e_arch of test_entity_name is
    --! Comment over
    signal az : integer;
    signal bz, cz : std_logic_vector(1 downto 0); --! Comment inline

    --! Comment over
    --! multiline
    constant dz : integer := 9;
    constant ez, fz : integer := 0; --! Comment inline for **constant**

    --! Function
    --! description
    function counter(minutes : integer := 0; seconds : integer := 0)
        return integer is variable total_seconds : integer;
    begin
    end function;

    --! Type
    --! description
    type state_0 is (INIT);

begin

    --! Comment multiline
    label_0 : process begin
    end process;

    -- No comment
    label_1 : process (a, b) begin
    end process;

    --! Comment
    --! multiline with **markdown**
    process begin
    end process;

    --! Instantation
    --! with label
    uut_0 : half_adder port map(a => a, b => b);

    --! Instantiation without label
    half_adder port map(a => a, b => b);
end e_arch;
