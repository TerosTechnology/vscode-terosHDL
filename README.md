**Index**

1. [Introduction](#id1)
2. [Thanks](#id2)
3. [Go to definition](#id3)
4. [Hover and structure](#id4)
5. [Template generator](#id5)
6. [Documenter](#id6)
7. [Errors checking](#id7)
8. [Style checking](#id8)
9. [Formatting](#id9)
10. [State machine viewer](#id10)
11. [State machine designer](#id11)
12. [Dependencies viewer](#id12)
13. [Hover to evaluate binary, hexadecimal and octal values](#id13)
14. [Code snippets and grammar](#id14)
15. [Beta Verilog/SV netlist viewer](#id15)
16. [Project manager (currently only VUnit supported](#id16)
16. [Future work](#id17)
17. [Similar projects](#id18)

# 1. Introduction <a name="id1"></a>

Our philosophy is: think in hardware, develop hardware, take advantage of software tools.

The goal of TerosHDL is make the FPGA development easier and reliable. It is a powerful open source IDE.

**Please, visit the documentation web for a full IDE description**: (https://terostechnology.github.io/terosHDLdoc/)

# 2. Thanks <a name="id2"></a>

- Verilog HDL/SystemVerilog (https://marketplace.visualstudio.com/items?itemName=mshr-h.VerilogHDL)
- VUnit (https://vunit.github.io/)
- VSG (https://github.com/jeremiah-c-leary/vhdl-style-guide)
- Wavedrom (https://github.com/wavedrom/wavedrom)
- VHDL formatter (https://github.com/g2384/VHDLFormatter)
- Yosys (http://www.clifford.at/yosys/)

# 3. Go to definition <a name="id3"></a>

You can jump to the definition with Ctrl+Click.

![alt text](./resources/images/readme/goto.png "title")

# 4. Hover and structure <a name="id4"></a>

If you hover over a symbol, a preview of the declaration will appear.

![alt text](resources/images/readme/hover.png "title")

# 5. Template generator <a name="id5"></a>

## Supported templates

|   Verilog | VHDL      |
| --------: | --------- |
| Testbench | Testbench |
|    cocotb | cocotb    |
|     VUnit | VUnit     |
|   Signals | Signals   |
| Component | Component |
|  Instance | Instance  |
| Verilator |           |

## Usage Instructions

1. Open a VHDL/Verilog file.
2. Select the template icon.
   ![alt text](./resources/images/readme/sample_templates_select.png "title")
3. Choose a template type.

# 6. Documenter <a name="id6"></a>

## Special comment symbols

You can configure what symbol will be used to extract the comments in the HDL file. It supports MarkDown style. In the following example is used the symbol "!":

```
--! This is a description
--! of the entity.
entity counter is
  port (
    clk: in std_logic; --! Clock comment
    out_data: out std_logic --! Description **port comment**
  );
end counter;
```

## Usage Instructions

1. Open a VHDL/Verilog file.
2. Select the documenter icon.
   ![alt text](./resources/images/readme/sample_documenter_select.png "title")
3. TerosHDL will show the generated documentation.
   ![alt text](./resources/images/readme/sample_documenter_viewer.png "title")
4. Export your documentation to PDF, Markdown, HTML or SVG diagram.
5. Edit your VHDL/Verilog file and save it. The preview will show automatically.

## Wavedrom support

TerosHDL supports WaveJSON format in the module description, a format that describes Digital Timing Diagrams:

https://wavedrom.com/tutorial.html

![alt text](./resources/images/readme/wavedrom_example.png "title")

## Bitfield

https://observablehq.com/collection/@drom/bitfield

![alt text](./resources/images/readme/bitfield_example.png "title")


# 7. Errors checking <a name="id7"></a>

## Supported linters

You need to install manually the simulators.

|   Verilog | VHDL     |
| --------: | -------- |
|  ModelSim | ModelSim |
|    Vivado | Vivado   |
|    Icarus | GHDL     |
| Verilator |          |

## Configuration

One of the above tools has to be installed to enable linter functionalities in a language. If the tool can not be find in the system path it has to be configured in the plugin config:

Configuration example for verilog:

![alt text](./resources/images/readme/linter_config.png "title")

# 8. Style checking <a name="id8"></a>

## Supported linters

This is an experimental feature. You need to install Verible (https://github.com/google/verible)

| Verilog | VHDL |
| ------: | :--: |
| Verible |  --  |

## Configuration

# 9. Formatting <a name="id9"></a>

## Supported formatters

| Verilog | VHDL       |
| ------: | ---------- |
|  iStyle | Standalone |

## Configuration


# 10. State machine viewer <a name="id10"></a>

## Usage Instructions

1. Open the command palette: `Ctrl+Shift+P` and select **_State machine viewer_**
   ![alt text](./resources/images/readme/state_machine_viewer_select.png "title")
2. Your state machines will show in the window.
   ![alt text](./resources/images/readme/state_machine_viewer_machine.png "title")

# 11. State machine designer <a name="id11"></a>

## Usage Instructions

1. Open the command palette: `Ctrl+Shift+P` and select **_State machine designer_**
   ![alt text](./resources/images/readme/state_machine_designer_select.png "title")
2. Follow the instructions and design your state machine!
   ![alt text](./resources/images/readme/state_machine_designer_machine.gif "title")

# 12. Dependencies viewer <a name="id12"></a>

1. Install Python3.
2. Go go TerosHDL configuration and add the Python3 binary path.

## Usage Instructions

1. Open the command palette: `Ctrl+Shift+P` and select **_Open dependencies viewer_**
   ![alt text](./resources/images/readme/sample_dependencies_select.png "title")
2. Add a HDL files to the viewer (you can mix verilog and VHDL).
   ![alt text](./resources/images/readme/sample_dependencies_add.png "title")
3. TerosHDL will generate the dependencies graph:
   ![alt text](./resources/images/readme/sample_dependencies_viewer.png "title")
4. You can reset your viewer:
   ![alt text](./resources/images/readme/sample_dependencies_clear.png "title")
5. You can generate the indexed Markdown documentation for all the files.
   ![alt text](./resources/images/readme/sample_dependencies_documentation_md.png "title")
6. And the indexed HTML documentation.
   ![alt text](./resources/images/readme/sample_dependencies_documentation_html.png "title")
7. Result in HTML format:
   ![alt text](./resources/images/readme/project_doc.gif "title")


# 13. Hover to evaluate binary, hexadecimal and octal values <a name="id13"></a>

![alt text](./resources/images/readme/hover_binary_vhdl.png "title")

![alt text](./resources/images/readme/hover_hexadecimal_verilog.png "title")

# 14. Code snippets and grammar <a name="id14"></a>

| Language        | Grammar       | Code snippets |
| ------:         | ----------    | ------------- |
|  Verilog        | &#x2714;      | &#x2714;      |
|  System Verilog | &#x2714;      | &#x2714;      |
|  VHDL           | &#x2714;      | &#x2714;      |
|  XDC/SDC        | &#x2714;      | &#x2714;      |
|  ucf            | &#x2714;      | &#x2718;      |

![alt text](./resources/images/readme/code_snippets.gif "title")


# 15. Beta Verilog/SV netlist viewer <a name="id15"></a>

![alt text](./resources/images/readme/netlist.gif "title")


# 16. Project manager (currently only VUnit supported <a name="id16"></a>

For a full description visit the documentation web.

![alt text](./resources/images/readme/project_manager.gif "title")


# 17. Future work <a name="id17"></a>

- Finite State Machine graph.
- Project manager.
- File tree view.
- Integrate [triel](https://github.com/TerosTechnology/triel) backend

# 18. Similar projects <a name="id18"></a>

- Hardware Integrated Development Environment ([hide](https://github.com/drom/atom-hide))
- [APIO-ide](https://github.com/FPGAwars/apio-ide)
