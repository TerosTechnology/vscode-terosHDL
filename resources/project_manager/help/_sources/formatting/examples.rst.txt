.. _examples_formatting:

Examples
=============

.. code-block:: vhdl
    
  -- This file is public domain, it can be freely copied without restrictions.
  -- SPDX-License-Identifier: CC0-1.0
  library ieee;
    use ieee.std_logic_1164.all;
                    use ieee.numeric_std.all;
  
  entity adder is
    generic (
      DATA_WIDTH : positive := 4);
    port (
                        A : in    unsigned(DATA_WIDTH-1 downto 0);
      B : in    unsigned(DATA_WIDTH-1 downto 0);
                                                  X : out   unsigned(DATA_WIDTH downto 0));
  end entity adder;
  
  architecture rtl of adder is
  begin
  
                                add_proc : process (A, B) is
    begin
                                                   X <= resize(A, X'length) + B;
               end process add_proc;
  
  end architecture rtl;


.. image:: images/format.gif
