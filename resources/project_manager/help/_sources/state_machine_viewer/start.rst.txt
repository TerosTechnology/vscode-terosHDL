.. _start_state_machine_viewer:

Getting started
================

It parses your HDL code and shows state machine states and transitions. It allows navegate between transtions and states:


.. image:: images/fsm.gif


General rules
---------------

Your code must follow the following general rules (they are common for VHDL and Verilog/SV):

- State selection with ``case``

.. code-block:: verilog

  always @(clk)
  begin
    case (State)
  
    ...
    ...
    
    endcase
  end


- Transitions with ``if/else`` 

.. code-block:: verilog

  always @(clk)
  begin
    case (State)
  
      if (Lever == DOWN)
        State = GODN;
      else
        State = FLYUP;
      end
    
    endcase
  end

- You can use a ``if/else`` with multiple levels, but an ``if/else`` transitions can't contain a ``case`` statement.

.. code-block:: verilog

  always @(clk)
  begin
    case (State)
  
      if (Lever == DOWN)
        if (button == up)
          State = GODN;
      else
        State = FLYUP;
      end
    
    endcase
  end

