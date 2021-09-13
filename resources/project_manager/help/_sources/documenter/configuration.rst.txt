.. _configuration_documenter:

Configuration
=============

Special comment symbols
-----------------------

A special symbol can be configured to identify the coments to be extracted 
from the HDL file. The special symbol must follow the comment characters of
the language that is being used.


.. image:: images/config.png

You can use the special comment symbol to remove the license header or other
non useful comments.

.. code-block:: vhdl

    -- Other comment not included
    --! This is a description
    --! of the entity.
    entity counter is
    port (
        clk: in std_logic; --! Clock comment
        out_data: out std_logic --! Description **port comment**
    );
    end counter;


.. code-block:: verilog
    
    // This is a 
    // license header
    //! This is a description
    //! of the module.
    module flipflop (q,qbar,clk);
	    output reg q; //! Port 0
	    output qbar; //! Port 1
	    input clk; //! Clock