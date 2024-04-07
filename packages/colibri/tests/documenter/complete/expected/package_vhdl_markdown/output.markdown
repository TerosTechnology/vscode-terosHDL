
# Package: test_package_name 
- **File**: package.vhdl

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

| Name    | Type                                             | Description |
| ------- | ------------------------------------------------ | ----------- |
| state_0 | (INIT,<br><span style="padding-left:20px"> ENDS) |             |

## Functions
- counter <font id="function_arguments">(signal minutes: in integer;<br><span style="padding-left:20px"> signal seconds: out integer)</font> <font id="function_return">return ()</font>
  -  Description procedure