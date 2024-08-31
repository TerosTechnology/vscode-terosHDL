
# Entity: test_entity_name 
- **File**: entity.vhdlSource
- **Author:**  Miguel de Cervantes
- **Version:**  1.0.1
- **Brief:**  Some description can be added here

## Diagram
![Diagram](test_entity_name.svg "Diagram")
## Description

This is an entity description 5 multiline.

 Example of multiline code snipet: 
``` C
int* versions = 0x0080000000 ;
int* major = 0x0090000000 ;
int* minor = 0x00A0000000 ;
int* patch = 0x00B0000000 ;
print_version();
```


Example of multiline code snipet: 
``` VHDL
function sum(a : integer := 0; b : integer := 0)
return integer is
variable result : integer;
begin
result <= a + b;
return result;
end function;
```


Example of description beakline

Example of Wavedrom image:



![alt text](wavedrom_Ev410.svg "title")

 

Example of bitfield:



![alt text](wavedrom_8f4E1.svg "title")

 


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

## Types

| Name            | Type                | Description       |
| --------------- | ------------------- | ----------------- |
| my_custom_type0 | range 0 to 1000     | my type comment 0 |
| my_custom_type1 | range -5 to 5       | my type comment 1 |
| my_custom_type2 | range -1000 to 5000 | my type comment 2 |

## Records


### *sample_record1*
 Sample record type 1

| Name       | Type                          | Description        |
| ---------- | ----------------------------- | ------------------ |
| single_bit | std_logic                     | Comment single_bit |
| byte_data  | std_logic_vector (7 downto 0) | comment byte_data  |


### *sample_record2*
 Sample record type 2

| Name       | Type                          | Description        |
| ---------- | ----------------------------- | ------------------ |
| valid      | std_logic                     | Comment valid      |
| byte_data1 | std_logic_vector (7 downto 0) | comment byte_data1 |
| byte_data2 | std_logic_vector (7 downto 0) | comment byte_data2 |
| byte_data3 | std_logic_vector (7 downto 0) | comment byte_data3 |


## Enums


### *state_0*
 Type
 description without state comments

| Name | Description |
| ---- | ----------- |
| INIT |             |
| S1   |             |
| S2   |             |
| S3   |             |


### *t_fsm1*
 My FSM...

| Name | Description     |
| ---- | --------------- |
| FSM1 | FSM1 comment... |
| FSM2 | FSM2 comment... |
| FSM3 | FSM3 comment... |


### *t_fsm2*
 My FSM 2...

| Name  | Description      |
| ----- | ---------------- |
| FSM_A | FSM_A comment... |
| FSM_B | FSM_B comment... |
| FSM_C | FSM_C comment... |


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