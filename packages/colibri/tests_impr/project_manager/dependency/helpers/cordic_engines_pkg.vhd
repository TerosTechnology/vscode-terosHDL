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

--! Package declarations.
package cordic_engines_pkg is

  component cordic_sincos_engine is
  port (
    clk     : in  std_logic;
    dv_in   : in  std_logic;
    data_in : in  std_logic_vector (19 downto 0);
    cos_out : out std_logic_vector (19 downto 0);
    sin_out : out std_logic_vector (19 downto 0);
    dv_out  : out std_logic
  );
  end component;

  component cordic_arctg_mag_engine is
  port (
    clk       : in  std_logic;
    dv_in     : in  std_logic;
    x_in      : in  std_logic_vector (19 downto 0);
    y_in      : in  std_logic_vector (19 downto 0);
    arctg_out : out std_logic_vector (19 downto 0);
    mag_out   : out std_logic_vector (19 downto 0);
    dv_out    : out std_logic --! data valid output
  );
  end component;


end package;
