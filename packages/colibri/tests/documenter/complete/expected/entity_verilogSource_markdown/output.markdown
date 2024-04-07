
# Entity: test_entity_name 
- **File**: entity.verilogSource
- **Author:**  Miguel de Cervantes
- **Version:**  1.0.1
- **Brief:**  Some description can be added here

## Diagram
![Diagram](test_entity_name.svg "Diagram")
## Description

This is an entity description.
also in multi-lines

Example of description beakline

Example of Wavedrom
image:



![alt text](wavedrom_586m0.svg "title")

 

Example of bitfield:



![alt text](wavedrom_sCZ01.svg "title")

 


## Generics

| Generic name | Type | Value | Description             |
| ------------ | ---- | ----- | ----------------------- |
| a            |      | 8     | Inline comment          |
| b            |      | 9     | Over comment  multiline |
| c            |      | 10    |                         |
| d            |      | 11    |                         |

## Ports

| Port name      | Direction | Type                        | Description    |
| -------------- | --------- | --------------------------- | -------------- |
| smc_client_tts |           | slot_mem_bcast_if.smc_bcast | Comment 00     |
| smc_pk         |           | slot_if.smc                 | Comment 11     |
| smc_rt         |           | slot_dc_if.smc_dc           |                |
| e              | input     |                             | port comment   |
| f              | output    |                             | port comment 1 |
| g              | input     |                             |                |
| h              | input     | wire                        |                |
| i              | input     | [7:0]                       |                |
| j              |           |                             |                |
| k              | input     | wire [9:0]                  |                |
| l              | output    | wire [9:0]                  |                |

## Signals

| Name | Type      | Description     |
| ---- | --------- | --------------- |
| m    | wire      | comment in wire |
| n    | wire      |                 |
| p    | wire      |                 |
| q    | reg [1:0] |                 |

## Constants

| Name | Type | Value | Description |
| ---- | ---- | ----- | ----------- |
| r    |      | 2     |             |

## Functions
- sum <font id="function_arguments">(input [7:0] a,<br><span style="padding-left:20px"> b;<br><span style="padding-left:20px">)</font> <font id="function_return">return ([7:0])</font>
  -  function comment multiline

## Processes
- label_0: ( @(posedge a) )
  - **Type:** always
  - **Description**
  always comment  multiline 
- unnamed: (  )
  - **Type:** always_comb
- label_1: (  )
  - **Type:** always_ff
- unnamed: (  )
  - **Type:** always_latch
- unnamed: ( @(posedge clk) )
  - **Type:** always
  - **Description**
  Example of   state machine 

## Instantiations

- test_entity_name_dut: test_entity_name
  - instance description
## State machines

- Example of
state machine![Diagram_state_machine_0]( fsm_test_entity_name_00.svg "Diagram")