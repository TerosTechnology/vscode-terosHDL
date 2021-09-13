.. _start_linter:

Getting started
===============

The linter will show the errors in your code.

.. image:: images/linter.png

VHDL
----

TerosHDL use a standalone linter for VHDL by default (RustHDL). You don't need to configure anything for use it. 
This will take into account all the files added to the active project. If the file is not in the active project, 
it will show the errors without taking into account other files. 

.. image:: images/linter2.png

You also can use external linters:

.. csv-table:: Supported linters
    :header: "External tool"
    :widths: auto
    :align: center

    "GHDL"
    "ModelSim"
    "Vivado (Xsim)"

Verilog/SV
----------

You also can use external linters:

.. csv-table:: Supported linters
    :header: "External tool"
    :widths: auto
    :align: center

    "Icarus"
    "ModelSim"
    "Vivado (Xsim)"
    "Verilator"
