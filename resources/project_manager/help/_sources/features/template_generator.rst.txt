.. _template_generator:

Template generator
==================

With the template generator function you can generate code snippets from a module or entity.

Supported templates
-------------------

==========  ========= 
   Verilog   VHDL      
==========  =========
 Testbench  Testbench 
    cocotb  cocotb    
     VUnit  VUnit     
   Signals  Signals   
 Component  Component 
  Instance  Instance  
 Verilator            
==========  =========

Templates header
----------------

A header text can be added at the begining of the file.
The path of the file containing the header text can be configured in the extension settings.

Usage instructions
-------------------

1. Open a Verilog/VHDL file and push the template generation button.

.. image:: images/sample_templates_select.png

2. Select the desired template from the list.

.. image:: images/sample_templates_type.png

3. The template will be stored in the clipboard and ready to be pasted ``Ctrl+v`` anywhere.
