.. _command_line_documenter:

Command line
============

There is a documenter command line version (https://github.com/TerosTechnology/colibri). It's very useful to use it in your continuous integration workflow.

Installation
------------

.. code-block:: console

    > npm install -g teroshdl


Input format
------------

The avaiable input formats of the CL TerosHDL documenter are:
    * Individual HDL file.
    * Directory: with the --recursive argument it will include the HDL files in the directory and subdirectories.
    * EDAM
    * CSV: a list of files with the library name. E.g:

.. code-block:: bash

    library_0, ../rtl/module_0.vhd
    library_1, ../rtl/module_1.vhd
    library_2, ../rtl/module_2.vhd

Ussage
------

In this example TerosHDL CL will generate the documentation for all HDL files in the directory surf and subdirectories. 
The output path is ./sample and the output format HTML. It will include:

    * Finite state machines (--fsm).
    * Dependency graph (--dep).
    * Constants and types (-c all).
    * Only commented signals (-s only_commented).
    * Process/always (-p all).
    * Only commented functions (--functions only_commented).


.. code-block:: console

    > teroshdl-hdl-documenter -i ./surf/ --recursive -o html --dep --fsm -s only_commented -c all -p all --functions only_commented --outpath ./sample

Examples
--------