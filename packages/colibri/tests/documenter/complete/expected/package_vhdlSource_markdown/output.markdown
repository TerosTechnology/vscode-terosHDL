
# Package: test_package_name 
- **File**: package.vhdlSource

## Description

Package comments 
## Signals

| Name | Type                         | Description          |
| ---- | ---------------------------- | -------------------- |
| a    | integer                      | Signal description 0 |
| b    | std_logic_vector(1 downto 0) |                      |
| c    | std_logic_vector(1 downto 0) |                      |

## Constants

| Name | Type    | Value | Description                     |
| ---- | ------- | ----- | ------------------------------- |
| d    | integer | 8     | Constant description  multiline |
| e    | integer | 0     |                                 |
| f    | integer | 0     |                                 |

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
 Type Enum without descriptions

| Name | Description |
| ---- | ----------- |
| INIT |             |
| ENDS |             |


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
- counter <font id="function_arguments">(signal minutes: in integer;<br><span style="padding-left:20px"> signal seconds: out integer)</font> <font id="function_return">return ()</font>
  -  Description procedure