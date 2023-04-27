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
--! cordic sincos
use work.cordic_engines_pkg.all;

--! Implementation of cordic.
entity cordic_top is
  generic (
    g_MODE : integer := 1
  );
  port (
    clk        : in  std_logic; --! Clock.
    dv_in      : in  std_logic; --! Data valid in.
    data_0_in  : in  std_logic_vector (19 downto 0); --! Data 0 in.
    data_1_in  : in  std_logic_vector (19 downto 0); --! Data 1 in.
    data_0_out : out std_logic_vector (19 downto 0); --! Data 0 out.
    data_1_out : out std_logic_vector (19 downto 0); --! Data 1 out.
    dv_out     : out std_logic --! Data valid out.
  );
end cordic_top;

architecture rtl of cordic_top is
begin

  sincos : if g_MODE = 1 generate
    cordic_sincos_engine_i : cordic_sincos_engine
    port map (
      clk     => clk,
      dv_in   => dv_in,
      data_in => data_0_in,
      sin_out => data_0_out,
      cos_out => data_1_out,
      dv_out  => dv_out
    );
  end generate sincos;

  arctgmag : if g_MODE = 2 generate
    cordic_arctgmag_engine_i : cordic_arctg_mag_engine
    port map (
      clk     => clk,
      dv_in   => dv_in,
      x_in    => data_0_in,
      y_in    => data_1_in,
      arctg_out => data_0_out,
      mag_out   => data_1_out,
      dv_out    => dv_out
    );
  end generate arctgmag;

end rtl;
