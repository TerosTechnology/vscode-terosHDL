
# Entity: test_entity_name 
- **File**: entity.vhdl
- **Author:** Miguel de Cervantes @version 1.0.1 
@brief Some description can be added here also in multi-lines Example of description beakline Example of Wavedrom image:	 { signal: [   { name: "pclk", wave: 'p.......' },   { name: "Pclk", wave: 'P.......' },   { name: "nclk", wave: 'n.......' },   { name: "Nclk", wave: 'N.......' },   {},   { name: 'clk0', wave: 'phnlPHNL' },   { name: 'clk1', wave: 'xhlhLHl.' },   { name: 'clk2', wave: 'hpHplnLn' },   { name: 'clk3', wave: 'nhNhplPl' },   { name: 'clk4', wave: 'xlh.L.Hx' }, ]} Example of bitfield:   {reg: [   {bits: 7, name: 'opcode', attr: 'OP-IMM'},   {bits: 5, name: 'rd', attr: 'dest'},   {bits: 3, name: 'func3', attr: ['ADDI', 'SLTI', 'SLTIU', 'ANDI', 'ORI', 'XORI'], type: 4},   {bits: 5, name: 'rs1', attr: 'src'},   {bits: 12, name: 'imm[11:0]', attr: 'I-immediate[11:0]', type: 3} ]}

## Diagram
![Diagram](test_entity_name.svg "Diagram")
## Description

 This is an entity description multiline.  
## Generics

| Generic name | Type                         | Value | Description                          |
| ------------ | ---------------------------- | ----- | ------------------------------------ |
| a            | integer                      |       | Comment inline                       |
| b            | std_logic                    | '1'   | Comment  multiline with **markdown** |
| c            | std_logic_vector(1 downto 0) | "10"  |                                      |
| d            | std_logic_vector(1 downto 0) | "10"  |                                      |
| e            | std_logic                    |       | inline comment                       |

## Ports

| Port name | Direction | Type                          | Description                |
| --------- | --------- | ----------------------------- | -------------------------- |
| ee        | in        | std_logic                     | Over comment in ```port``` |
| h         | in        | std_logic_vector(31 downto 0) |                            |
| i         | in        | std_logic_vector(31 downto 0) |                            |
| p         | in        | std_logic                     |                            |
| q         | out       | std_logic                     | Inline comment             |
| r         | in        | std_logic                     |                            |
| s         | out       | std_logic                     | Preference inline          |
| f         | out       | std_logic                     |                            |
| ff        | out       | std_logic                     |                            |
| g         | inout     | std_logic                     |                            |
| j         | in        | std_logic                     |                            |
| l         | out       | std_logic                     |                            |
| m         | in        | std_logic                     |                            |
| n         | in        | std_logic                     | Description 3              |
| o         | out       | std_logic                     |                            |

## Signals

| Name | Type                         | Description    |
| ---- | ---------------------------- | -------------- |
| az   | integer                      | Comment over   |
| bz   | std_logic_vector(1 downto 0) | Comment inline |
| cz   | std_logic_vector(1 downto 0) | Comment inline |

## Constants

| Name | Type    | Value | Description                     |
| ---- | ------- | ----- | ------------------------------- |
| dz   | integer | 9     | Comment over  multiline         |
| ez   | integer | 0     | Comment inline for **constant** |
| fz   | integer | 0     | Comment inline for **constant** |

## Types

| Name    | Type   | Description       |
| ------- | ------ | ----------------- |
| state_0 | (INIT) | Type  description |

## Functions
- counter <font id="function_arguments">(minutes : integer := 0;<br><span style="padding-left:20px"> seconds : integer := 0)</font> <font id="function_return">return integer</font>
  -  Function description

## Processes
- label_0: (  )
  - **Description**
  Comment multiline
- label_1: ( a, b )
- unnamed: (  )
  - **Description**
  Comment multiline with **markdown**

## Instantiations

- uut_0: half_adder
  -  Instantation with label- unnamed: half_adder
  -  Instantiation without label