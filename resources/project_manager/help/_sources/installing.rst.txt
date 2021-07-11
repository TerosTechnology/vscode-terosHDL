.. _installing:

Installing
==========

All the tools are automatically managed by TerosHDL vscode plugin.
But there are some requisites you have to satisfy to enable the all the functionalities.
You can search for ``TerosHDL`` inside VSCode in the extensions tab or Launch VS Code Quick Open ``Ctrl+P``, paste the following command, and press enter:
``ext install teros-technology.teroshdl``

Requisites
----------

-  `Visual Studio Code`_
-  `Python3`_
-  `HDL simulator`_
-  `Vunit`_

Most features work without external Visual Studio Code dependencies but some special features require 
manually installed software by the user.

=====================    ================= 
 Feature                  Requisite        
=====================    =================
  Linter                  `HDL simulator`_             
  Dependencie viewer      `Python3`_             
  Project manager         `Vunit`_             
=====================    ================= 


Visual Studio Code
~~~~~~~~~~~~~~~~~~

:download:`Download VSCode <https://code.visualstudio.com/Download>` 

CLI Ubuntu installation example:

.. code-block:: console

    > dpkg -i vscode_downloaded_file.deb


Python3
~~~~~~~

Python3 must be installed in the machine to use the dependencies viewer.

Check how to :doc:`configure the python3 path <./configuration/general>`  if python3 issues appear. 

HDL simulator
~~~~~~~~~~~~~

Linter needs a simulator to work. The currently supported simulators are the following:

   ==========   ========
   Verilog/SV     VHDL     
   ==========   ========
   ModelSim     ModelSim 
    Vivado      Vivado   
    Icarus      GHDL     
   Verilator           
   ==========   ========

To configure the linter visit the :doc:`linter configuration section <./configuration/linters>` 

Vunit
~~~~~

It is necessary to use the project manager.
Install:

.. code-block:: console

    > pip install vunit_hdl