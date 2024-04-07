
# Package: test_pkg 
- **File**: package.systemVerilogSource

## Constants

| Name | Type | Value | Description |
| ---- | ---- | ----- | ----------- |
| a    |      | 8     |             |
| b    |      | 9     |             |
| c    |      | 10    |             |

## Types

| Name    | Type                                                                                                                                                                                      | Description |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| op_list | enum {<br><span style="padding-left:20px">ADD,<br><span style="padding-left:20px"> SUB}                                                                                                   |             |
| port_t  | struct {<br><span style="padding-left:20px">logic [4:0] a,<br><span style="padding-left:20px"> b;<br><span style="padding-left:20px"> logic [9:0] m;<br><span style="padding-left:20px">} |             |

## Functions
- sum <font id="function_arguments">(input [7:0] a,<br><span style="padding-left:20px"> b;<br><span style="padding-left:20px">)</font> <font id="function_return">return ([7:0])</font>
