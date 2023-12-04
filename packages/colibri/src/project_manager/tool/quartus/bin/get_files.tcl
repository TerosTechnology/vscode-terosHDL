#quartus_sh -t quartus.tcl <path to qpf or qsf file> <pah to csv file>
## Return: library,path

set csv_file_name [lindex $argv 0]
set project_path [lindex $argv 1]

#open Quartus project
project_open -current_revision $project_path

#open result file for writing
set csv_file [open $csv_file_name w]

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