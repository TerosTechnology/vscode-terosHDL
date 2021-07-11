.. _stm_viewer:

State machine viewer
====================

This function can be used to extract diagrams of finite state machines from VHDL or Verilog files.

Usage instructions
------------------

1. Open a VHDL/verilog file.

2. Open the command palette ``Ctrl+Shift+P`` and select ``State machine viewer``
or click on the stm_viewer button.

.. image:: images/state_machine_viewer_select.png

3. The state machines of the opened file will apear on another view. If the design has more than one 
state machines it may be necesary to do some scrolling to visualize all the diagrams. You can navigate in the states and
go to the code.

.. image:: images/state_machine_viewer_machine.gif

4. It is possible to export the diagrams as an SVG file.

