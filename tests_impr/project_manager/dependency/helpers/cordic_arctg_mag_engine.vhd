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

--! Implementation of arctg-magnitude cordic
entity cordic_arctg_mag_engine is
  port (
    clk     : in  std_logic; --! Clock.
    dv_in   : in  std_logic; --! Data valid input.
    x_in    : in  std_logic_vector (19 downto 0);   --! x in Q2.17 format [0,1]
    y_in    : in  std_logic_vector (19 downto 0);   --! y in Q2.17 format [0,1]
    arctg_out : out std_logic_vector (19 downto 0); --! arctan(y/x)
    mag_out   : out std_logic_vector (19 downto 0); --! magnitude sqrt(x*x+y*y)
    dv_out  : out std_logic --! Data valid output.
  );
end cordic_arctg_mag_engine;

architecture rtl of cordic_arctg_mag_engine is
  constant c_SIZE_INPUT : integer := 20;
  constant c_SIZE_INT   : integer :=  2;
  constant c_SIZE_DECIM : integer := 17;
  --
  constant c_Z_INIT     : signed(c_SIZE_INPUT-1 downto 0) := "00000000000000000000"; -- 1
  --
  constant c_NUM_STAGES : integer := 16;
  -- r0: reg inputs
  signal r0_x  : signed(c_SIZE_INPUT-1 downto 0);
  signal r0_y  : signed(c_SIZE_INPUT-1 downto 0);
  signal r0_dv : std_logic := '0';
  -- r1: cordic 0
  type typea_input is array (0 to c_NUM_STAGES-1) of signed(c_SIZE_INPUT-1 downto 0);
  signal r1_x_input   : typea_input;
  signal r1_y_input   : typea_input;
  signal r1_x         : typea_input;
  signal r1b_x_bis    : typea_input;
  signal r1_y         : typea_input;
  signal r1b_y_bis    : typea_input;
  signal r1_z         : typea_input;
  signal r1_shift_dv : std_logic_vector(c_SIZE_INPUT-1 downto 0) := (OTHERS => '0');
  -- Q0.17
  type typea_inputa is array (0 to c_NUM_STAGES-1) of signed(c_SIZE_INPUT-c_SIZE_INT-1 downto 0);
  constant r1_ang     : typea_inputa := (
    "011001001000011111","001110110101100011","000111110101101101","000011111110101011",
    "000001111111110101","000000111111111110","000000011111111111","000000001111111111",
    "000000000111111111","000000000011111111","000000000001111111","000000000000111111",
    "000000000000011111","000000000000001111","000000000000000111","000000000000000011"
  );
  -- To ensure 1 DSP by mult: 20x18
  constant c_CORRECTION  : signed(c_SIZE_INPUT-c_SIZE_INT-1 downto 0) := "010011011011101001"; -- 0.607252935103
  -- r2: cordic 2
  signal r2_arctg  : signed(c_SIZE_INPUT-1 downto 0);
  signal r2_mag    : signed(2*c_SIZE_INPUT-c_SIZE_INT-1 downto 0);
  signal r2b_mag   : signed(c_SIZE_INPUT-1 downto 0);
  signal r2_dv     : std_logic := '0';

begin
  -- r0: reg inputs
  r0_reg_input : process(clk)
  begin
    if rising_edge(clk) then
      r0_x  <= signed(x_in);
      r0_y  <= signed(y_in);
      r0_dv <= dv_in;
    end if;
  end process;

  -- ###########################################################################
  -- ############################  CORDIC ######################################
  -- ###########################################################################
  r1_shift : process(clk)
  begin
    if rising_edge(clk) then
      r1_shift_dv(c_NUM_STAGES-1 downto 1) <= r1_shift_dv(c_NUM_STAGES-2 downto 0);
      r1_shift_dv(0) <= r0_dv;
    end if;
  end process;

  r1_start_cordic : process(clk)
  begin
    if rising_edge(clk) then
      -- inital state
      r1_x(0) <= r0_x;
      r1_y(0) <= r0_y;
      r1_z(0) <= c_Z_INIT;
      r1b_x_bis(0)  <= r0_x;
      r1b_y_bis(0)  <= r0_y;
      --
      r1_x(0)   <= r0_x;
      r1_y(0)   <= r0_y;
    end if;
  end process;

  gen_cordic_engine : for i in 1 to c_NUM_STAGES-1 generate
    r1_cordic : process(clk)
    begin
      if rising_edge(clk) then
        if (r1_y(i-1) > 0) then
          r1_x(i) <= r1_x(i-1) + r1b_y_bis(i-1);
          r1_y(i) <= r1_y(i-1) - r1b_x_bis(i-1);
          r1_z(i) <= r1_z(i-1) + r1_ang(i-1);
        else
          r1_x(i) <= r1_x(i-1) - r1b_y_bis(i-1);
          r1_y(i) <= r1_y(i-1) + r1b_x_bis(i-1);
          r1_z(i) <= r1_z(i-1) - r1_ang(i-1);
        end if;
        r1_x_input(i)   <= r1_x_input(i-1);
        r1_y_input(i)   <= r1_y_input(i-1);
      end if;
    end process;
    r1b_x_bis(i) <= shift_right(r1_x(i),i);
    r1b_y_bis(i) <= shift_right(r1_y(i),i);
  end generate gen_cordic_engine;
  -- ###########################################################################
  -- ############################ CORRECTION ###################################
  -- ###########################################################################
  r2_cordic_correction : process(clk)
  begin
    if rising_edge(clk) then
      r2_arctg <= r1_z(c_NUM_STAGES-1);
      r2_mag   <= r1_x(c_NUM_STAGES-1)*c_CORRECTION;
      r2_dv    <= r1_shift_dv(c_NUM_STAGES-1);
    end if;
  end process;
  r2b_mag <= r2_mag(2*c_SIZE_INPUT-2-1) & r2_mag(c_SIZE_INT+2*c_SIZE_DECIM-1 downto c_SIZE_DECIM);
  --
  arctg_out <= std_logic_vector(r2_arctg);
  mag_out   <= std_logic_vector(r2b_mag) ;
  dv_out    <= r2_dv;

end rtl;
