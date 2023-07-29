//! mymodule design
module test_entity_name 
#(
    parameter a=8,
    parameter b=9,
    parameter c=10, d=11
)
(
    //! Description 0
    input port_0_no,
    input port_1_no, //! Description 1
    input port_2_no, //! Description 2
    //! @virtualbus virtualbus_0
    //! Description 0_v0
    input port_0_v0,
    input port_1_v0, //! Description 1_v0
    //! @end
    //! Description 3
    input port_3_no,
    input port_4_no, //! Description 4
    //! @virtualbus virtualbus_1 Description of **virtual bus 1** 
    input port_0_v1, //! Description 0_v1
    input port_1_v1, //! @end Description 1_v1
    input port_5_no, //! Description 5
    //! Description 6
    input port_6_no,
    //! @virtualbus virtualbus_2 @dir in
    input port_0_v2,
    input port_2_v2,
    //! @virtualbus virtualbus_3 @dir out Description of **virtual bus 3** 
    input port_0_v3,
    input port_1_v3,
     //! @end 
    input port_7_no, //! Description 7
    //! @virtualbus virtualbus_4 @notable Description of **virtual bus 4** 
    input port_0_v4, //! Description 0_v4
    //! Description 0_v4
    input port_1_v4
     //! @end 
);

endmodule