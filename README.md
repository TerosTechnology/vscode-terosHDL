**Index**

1. [Introduction](#id1)
2. [Thanks](#id2)
3. [Go to definition](#id3)
4. [Hover](#id4)
5. [Template generator](#id5)
6. [Documenter](#id6)
7. [Errors checking](#id7)
8. [Style checking](#id8)
9. [Formatting](#id9)
10. [Dependencies viewer](#id10)
11. [Hover to evaluate binary, hexadecimal and octal values](#id11)
12. [Future work](#id12)

# 1. Introduction <a name="id1"></a>

Our philosophy is: think in hardware, develop hardware, take advantage of software tools.

The goal of TerosHDL is make the FPGA development easier and reliable. It is a powerful open source IDE.

# 2. Thanks <a name="id2"></a>

- Verilog HDL/SystemVerilog (https://marketplace.visualstudio.com/items?itemName=mshr-h.VerilogHDL)
- VUnit (https://vunit.github.io/)
- VSG (https://github.com/jeremiah-c-leary/vhdl-style-guide)

# 3. Go to definition <a name="id3"></a>

You can jump to the definition with Ctrl+Click.

![alt text](./resources/images/readme/goto.png "title")

# 4. Hover <a name="id4"></a>

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

You can configure what symbol will be used to extract the comments in the HDL file. In the following example is used the symbol "!":

```
--! This is a description
--! of the entity.
entity counter is
  port (
    clk: in std_logic; --! Clock comment
    out_data: out std_logic --! Description port comment
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

**THIS FEATURE IS EXPERIMENTAL. PLEASE, OPEN AN ISSUE IF YOU HAVE A BUG**

TerosHDL supports WaveJSON format in the module description, a format that describes Digital Timing Diagrams:

https://wavedrom.com/tutorial.html

![alt text](./resources/images/readme/wavedrom_example.png "title")


# 7. Errors checking <a name="id7"></a>

## Supported linters

|   Verilog | VHDL     |
| --------: | -------- |
|  ModelSim | ModelSim |
|    Vivado | Vivado   |
|    Icarus | GHDL     |
| Verilator |          |

## Configuration

# 8. Style checking <a name="id8"></a>

## Supported linters

| Verilog | VHDL |
| ------: | ---- |
| Verible | VSG  |

## Configuration

# 9. Formatting <a name="id9"></a>

## Supported formatters

| Verilog | VHDL       |
| ------: | ---------- |
|  iStyle | Standalone |

## Configuration

# 10. Dependencies viewer <a name="id10"></a>

## Usage Instructions

1. Open the command palette: `Ctrl+Shift+P` and select **_Open dependencies viewer_**
   ![alt text](./resources/images/readme/sample_dependencies_select.png "title")
2. Add a HDL files to the viewer (you can mix verilog and VHDL).
   ![alt text](./resources/images/readme/sample_dependencies_add.png "title")
3. TerosHDL will generate the dependencies graph:
   ![alt text](./resources/images/readme/sample_dependencies_viewer.png "title")
4. You can reset your viewer:
   ![alt text](./resources/images/readme/sample_dependencies_clear.png "title")
5. You can generate the indexed markdown documentation for all the files.
   ![alt text](./resources/images/readme/sample_dependencies_documentation.png "title")


# 11. Hover to evaluate binary, hexadecimal and octal values <a name="id11"></a>

![alt text](./resources/images/readme/hover_binary_vhdl.png "title")

![alt text](./resources/images/readme/hover_hexadecimal_verilog.png "title")


# 12. Future work
