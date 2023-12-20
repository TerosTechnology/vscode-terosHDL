#quartus_sh -t quartus.tcl <path to qpf or qsf file>
## return: prj_name, revision, top_level_entity

set csv_file_name [lindex $argv 0]
set project_path [lindex $argv 1]

#open Quartus project
project_open -force -current_revision $project_path

#open result file for writing
set csv_file [open $csv_file_name w]

proc get_prj_info {csv_file} {
    # General info
    set prj_name [get_current_project]
    set prj_revision [get_current_revision]
    set top_level_entity [get_global_assignment -name TOP_LEVEL_ENTITY]
    set family [get_global_assignment -name FAMILY]
    set part [get_global_assignment -name DEVICE]
    set optimization_mode [get_global_assignment -name OPTIMIZATION_MODE]
    set allow_register_retiming [get_global_assignment -name ALLOW_REGISTER_RETIMING]

    # Testbench files
    set eda_test_bench_file ""
    set collection [get_all_global_assignments -name EDA_TEST_BENCH_FILE -section_id testbenchSet]
    foreach_in_collection file_inst $collection {
        set filename [lindex $file_inst 2]
        set eda_test_bench_file_inst [resolve_file_path $filename]
        if {[string length $eda_test_bench_file] > 0} {
            set eda_test_bench_file "${eda_test_bench_file},$eda_test_bench_file_inst"
        } else {
            set eda_test_bench_file $eda_test_bench_file_inst
        }
    }
    puts $eda_test_bench_file

    # Testbench top module
    set eda_test_bench_top_module ""
    set collection [get_all_global_assignments -name EDA_TEST_BENCH_TOP_MODULE -section_id testbenchSet]
    foreach_in_collection file_inst $collection {
        set eda_test_bench_top_module [lindex $file_inst 2]
    }

    puts $csv_file [join [ list $prj_name $prj_revision $top_level_entity $family $part $optimization_mode $allow_register_retiming $eda_test_bench_top_module] "," ]

    set revision_list [get_project_revisions]
    puts $csv_file [join [ list $revision_list ] "," ]

    puts $csv_file $eda_test_bench_file
}

get_prj_info $csv_file

#procedure for write all files in Quartus collection to a csv line
proc process_files {csv_file collection} {
    foreach_in_collection hdl_file $collection {
        set filename [get_assignment_info $hdl_file -value]
        set path [resolve_file_path $filename]
        set library [get_assignment_info $hdl_file -library]
        set library [expr {[string length $library]>0 ? $library : ""}]

        puts $csv_file [join [ list $library $path] "," ]
    }
}

process_files $csv_file [get_all_assignments -name VHDL_FILE -type global]
process_files $csv_file [get_all_assignments -name VERILOG_FILE -type global]
process_files $csv_file [get_all_assignments -name SYSTEMVERILOG_FILE -type global]
process_files $csv_file [get_all_assignments -name SDC_FILE -type global]
process_files $csv_file [get_all_assignments -name QIP_FILE -type global]
process_files $csv_file [get_all_assignments -name IP_FILE -type global]
process_files $csv_file [get_all_assignments -name QSYS_FILE -type global]