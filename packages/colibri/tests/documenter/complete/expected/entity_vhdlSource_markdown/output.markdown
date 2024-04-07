
# Entity: test_entity_name 
- **File**: entity.vhdlSource
- **Author:**  Miguel de Cervantes
- **Version:**  1.0.1
- **Brief:**  Some description can be added here

## Diagram
![Diagram](test_entity_name.svg "Diagram")
## Description

This is an entity description 5
multiline.

Example of description beakline

Example of Wavedrom
image:



![alt text](wavedrom_lH1q0.svg "title")

 

Example of bitfield:



![alt text](wavedrom_uQCk1.svg "title")

 


## Generics

| Generic name | Type                         | Value | Description                          |
| ------------ | ---------------------------- | ----- | ------------------------------------ |
| a            | integer                      |       | Comment inline                       |
| b            | std_logic                    | '1'   | Comment  multiline with **markdown** |
| c            | std_logic_vector(1 downto 0) | "10"  |                                      |
| d            | std_logic_vector(1 downto 0) | "10"  |                                      |
| e            | std_logic                    |       | inline comment                       |

## Ports

| Port name | Direction | Type                          | Description                              |
| --------- | --------- | ----------------------------- | ---------------------------------------- |
| ee        | in        | std_logic                     | Over comment in ```port```               |
| h         | in        | std_logic_vector(31 downto 0) |                                          |
| i         | in        | std_logic_vector(31 downto 0) |                                          |
| p         | in        | std_logic                     |                                          |
| q         | out       | std_logic                     | Inline comment                           |
| r         | in        | std_logic                     |                                          |
| s         | out       | std_logic                     | Preference inline                        |
| v_bus_0   | out       | Virtual bus                   | @keepports  Description of virtual bus 0 |
| v_bus_1   | in        | Virtual bus                   | @keepports  Description of virtual bus 1 |

### Virtual Buses

#### v_bus_0

| Port name | Direction | Type      | Description |
| --------- | --------- | --------- | ----------- |
| f         | out       | std_logic |             |
| ff        | out       | std_logic |             |
| g         | inout     | std_logic |             |
#### v_bus_1

| Port name | Direction | Type      | Description   |
| --------- | --------- | --------- | ------------- |
| j         | in        | std_logic |               |
| l         | out       | std_logic |               |
| m         | in        | std_logic |               |
| n         | in        | std_logic | Description 3 |
| o         | out       | std_logic |               |

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

## Enums


### *state_0*
 Type
 description

| Name | Description |
| ---- | ----------- |
| INIT |             |


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
  Comment multiline with **markdown**

## Instantiations

- uut_0: half_adder
  -  Instantation with label- unnamed: half_adder
  -  Instantiation without label