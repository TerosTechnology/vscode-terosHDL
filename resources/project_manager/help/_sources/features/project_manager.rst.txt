.. _project_manager:

Project manager
===============

Project manager provides TerosHDL integration with Vunit.


.. important:: Requirements

    - To use this functionality is necesary to have Python3 configured in TerosHDL on in the system path.
      More info in the :doc:`configuration section <../configuration/general>`
    - `Vunit`_ is required 


.. important:: Simulation support

    Project manager provides a graphical interface to Vunit projects.
    Therefore the supported simulators are the same supported by Vunit.


Usage instructions
------------------

1. Create or load a project.
2. Add a python Vunit file to the project.
3. Select a project among the loaded projects as the active project (lightning icon).
4. Select inside the project the Vunit file as the active file (yellow star).
5. Simulate all the test inside the Vunit file or specific test.

.. tip:: Code navigation
  
    A click on the Vunit file or on the ``go_to_code`` button of a test on the list opens the file.

.. image:: images/project_manager.gif


.. _Vunit: https://vunit.github.io/