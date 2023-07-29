-- Copyright 2018 Carlos Alberto Ruiz Naranjo
-- carlosruiznaranjo@gmail.com
--
-- This file is part of cordicHDL.
--
-- cordicHDL is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- cordicHDL is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with cordicHDL.  If not, see <https://www.gnu.org/licenses/>.

--! Standard library.
library ieee;
--! Logic elements.
use ieee.std_logic_1164.all;
--! arithmetic functions.
use ieee.numeric_std.all;

--! Sine and cosine cordic.
entity cordic_sincos_engine is
  port (
    clk     : in  std_logic; --! Clock.
    dv_in   : in  std_logic; --! Data valid input.
    data_in : in  std_logic_vector (19 downto 0); --! Angle in radians Q2.17 format [-pi,pi]
    cos_out : out std_logic_vector (19 downto 0); --! Cosine.
    sin_out : out std_logic_vector (19 downto 0); --! Sine.
    dv_out  : out std_logic --! Data valid output.
  );
end cordic_sincos_engine;

architecture rtl of cordic_sincos_engine is
  constant c_SIZE_INPUT : integer := 20;
  constant c_SIZE_INT   : integer :=  2;
  constant c_SIZE_DECIM : integer := 17;
  constant c_PI_HALF      : signed(c_SIZE_INPUT-1 downto 0) := "00110010010000111111";
  constant c_PI_HALF_NEG  : signed(c_SIZE_INPUT-1 downto 0) := "11001101101111000001";
  constant c_PI           : signed(c_SIZE_INPUT-1 downto 0) := "01100100100001111110";
  constant c_PI_NEG       : signed(c_SIZE_INPUT-1 downto 0) := "10011011011110000010";
  --
  constant X_INIT     : signed(c_SIZE_INPUT-1 downto 0) := "00100000000000000000"; -- 1
  constant Y_INIT     : signed(c_SIZE_INPUT-1 downto 0) := "00000000000000000000"; -- 0
  constant X_BIS_INIT : signed(c_SIZE_INPUT-1 downto 0) := "00100000000000000000"; -- 1
  constant Y_BIS_INIT : signed(c_SIZE_INPUT-1 downto 0) := "00000000000000000000"; -- 0
  --
  constant c_NUM_STAGES : integer := 16;
  -- r0: reg inputs
  signal r0_data_in : std_logic_vector(c_SIZE_INPUT-1 downto 0);
  signal r0_dv      : std_logic := '0';
  -- r1: adapter
  signal r1_signCos : std_logic;
  signal r1_input   : signed(c_SIZE_INPUT-1 downto 0);
  signal r1_dv      : std_logic := '0';
  -- r2: cordic 0
  type typea_input is array (0 to c_NUM_STAGES-1) of signed(c_SIZE_INPUT-1 downto 0);
  signal r2_input     : typea_input;
  signal r2_x         : typea_input;
  signal r2b_x_bis    : typea_input;
  signal r2_y         : typea_input;
  signal r2b_y_bis    : typea_input;
  signal r2_a         : typea_input;
  signal r2_signCos   : std_logic_vector(c_SIZE_INPUT-1 downto 0);
  signal r2_shift_dv : std_logic_vector(c_SIZE_INPUT-1 downto 0) := (OTHERS => '0');
  -- Q0.17
  type typea_inputa is array (0 to c_NUM_STAGES-1) of signed(c_SIZE_INPUT-c_SIZE_INT-1 downto 0);
  constant r2_ang     : typea_inputa := (
    "011001001000011111","001110110101100011","000111110101101101","000011111110101011",
    "000001111111110101","000000111111111110","000000011111111111","000000001111111111",
    "000000000111111111","000000000011111111","000000000001111111","000000000000111111",
    "000000000000011111","000000000000001111","000000000000000111","000000000000000011"
  );
  -- To ensure 1 DSP by mult: 20x18
  constant c_CORRECTION  : signed(c_SIZE_INPUT-c_SIZE_INT-1 downto 0) := "010011011011101001"; -- 0.607252935103
  -- r3: cordic 2
  signal r3_sin : signed(2*c_SIZE_INPUT-c_SIZE_INT-1 downto 0);
  signal r3_cos : signed(2*c_SIZE_INPUT-c_SIZE_INT-1 downto 0);
  signal r3b_sin : signed(c_SIZE_INPUT-1 downto 0);
  signal r3b_cos : signed(c_SIZE_INPUT-1 downto 0);
  signal r3_signCos : std_logic;
  signal r3_dv      : std_logic := '0';
  -- r4: adapter
  signal r4_sin : signed(c_SIZE_INPUT-1 downto 0);
  signal r4_cos : signed(c_SIZE_INPUT-1 downto 0);
  signal r4_dv  : std_logic;
begin
  -- r0: reg inputs
  r0_reg_input : process(clk)
  begin
    if rising_edge(clk) then
      r0_data_in <= data_in;
      r0_dv      <= dv_in;
    end if;
  end process;

  -- ###########################################################################
  -- ############################  ADAPTER INPUT ###############################
  -- ###########################################################################
  -- r1: adapter
  r1_adapter_input : process(clk)
  begin
    if rising_edge(clk) then
      if (signed(r0_data_in) > c_PI_HALF) then
        r1_signCos <= '1';
        r1_input   <= c_PI - signed(r0_data_in);
      elsif (signed(r0_data_in) < c_PI_HALF_NEG) then
        r1_signCos <= '1';
        r1_input   <= c_PI_NEG - signed(r0_data_in);
      else
        r1_signCos <= '0';
        r1_input   <= signed(r0_data_in);
      end if;
      r1_dv <= r0_dv;
    end if;
  end process;
  -- ###########################################################################
  -- ############################  CORDIC ######################################
  -- ###########################################################################
  r2_shift : process(clk)
  begin
    if rising_edge(clk) then
      r2_shift_dv(c_NUM_STAGES-1 downto 1) <= r2_shift_dv(c_NUM_STAGES-2 downto 0);
      r2_shift_dv(0) <= r1_dv;
    end if;
  end process;

  r2_start_cordic : process(clk)
  begin
    if rising_edge(clk) then
      -- inital state
      r2_x(0) <= X_INIT;
      r2_y(0) <= Y_INIT;
      r2b_x_bis(0)  <= X_BIS_INIT;
      r2b_y_bis(0)  <= Y_BIS_INIT;
      r2_a(0)       <= (OTHERS => '0');
      r2_input(0)   <= r1_input;
      r2_signCos(0) <= r1_signCos;
    end if;
  end process;

  gen_cordic_engine : for i in 1 to c_NUM_STAGES-1 generate
    r2_cordic : process(clk)
    begin
      if rising_edge(clk) then
        if (r2_a(i-1) < r2_input(i-1)) then
          r2_x(i) <= r2_x(i-1) - r2b_y_bis(i-1);
          r2_y(i) <= r2_y(i-1) + r2b_x_bis(i-1);
          r2_a(i) <= r2_a(i-1) + r2_ang(i-1);
        else
          r2_x(i) <= r2_x(i-1) + r2b_y_bis(i-1);
          r2_y(i) <= r2_y(i-1) - r2b_x_bis(i-1);
          r2_a(i) <= r2_a(i-1) - r2_ang(i-1);
        end if;
        r2_input(i)   <= r2_input(i-1);
        r2_signCos(i) <= r2_signCos(i-1);
      end if;
    end process;
    r2b_x_bis(i) <= shift_right(r2_x(i),i);
    r2b_y_bis(i) <= shift_right(r2_y(i),i);
  end generate gen_cordic_engine;

  r3_cordic_correction : process(clk)
  begin
    if rising_edge(clk) then
      r3_cos <= r2_x(c_NUM_STAGES-1)*c_CORRECTION;
      r3_sin <= r2_y(c_NUM_STAGES-1)*c_CORRECTION;
      r3_signCos <= r2_signCos(c_NUM_STAGES-1);
      r3_dv      <= r2_shift_dv(c_NUM_STAGES-1);
    end if;
  end process;
  r3b_sin <= r3_sin(2*c_SIZE_INPUT-2-1) & r3_sin(c_SIZE_INT+2*c_SIZE_DECIM-1 downto c_SIZE_DECIM);
  r3b_cos <= r3_cos(2*c_SIZE_INPUT-2-1) & r3_cos(c_SIZE_INT+2*c_SIZE_DECIM-1 downto c_SIZE_DECIM);
  -- ###########################################################################
  -- ############################  ADAPTER OUTPUT ##############################
  -- ###########################################################################
  r4_adapter_output : process(clk)
  begin
    if rising_edge(clk) then
      if (r3_signCos = '1') then
        r4_cos <= -r3b_cos;
      else
        r4_cos <= r3b_cos;
      end if;
      r4_sin <= r3b_sin;
      r4_dv  <= r3_dv  ;
    end if;
  end process;
  cos_out <= std_logic_vector(r4_cos);
  sin_out <= std_logic_vector(r4_sin);
  dv_out  <= r4_dv;

end rtl;
