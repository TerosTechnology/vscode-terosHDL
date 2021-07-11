.. _dependencies_viewer:

Dependencies viewer
===================

The dependencies viewer can create a dependencie graph of the given files.
Aditionally it's possible to export the documentation of all the provided files 
along with the dependencies graph and an index linking all the generated documentaion files.


.. important:: Requirements!

    To be able to use this functionality is necesary to have Python3 configured in TerosHDL
    More info in the :doc:`configuration section <../configuration/general>`


Usage instructions
------------------

1. Open the command palette ``Ctrl+Shift+P`` and select ``Open dependencies viewer``

.. image:: images/sample_dependencies_select.png

2. Add a HDL files to the viewer (you can mix verilog and VHDL).

.. image:: images/sample_dependencies_add.png

3. TerosHDL will generate the dependencies graph:

.. image:: images/sample_dependencies_viewer.png

4. You can reset your viewer:

.. image:: images/sample_dependencies_clear.png

5. You can generate the indexed Markdown documentation for all the files.

.. image:: images/sample_dependencies_documentation_md.png

6. And the indexed HTML documentation.

.. image:: images/sample_dependencies_documentation_html.png

7. Result in HTML format:

.. image:: images/project_doc.gif


