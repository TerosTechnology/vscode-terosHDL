#quartus_sh -t quartus.tcl <pah to csv file> <path to qpf or qsf file>
## Return: library,path

set csv_file_name [lindex $argv 0]
set project_path [lindex $argv 1]

#open Quartus project
project_open -force -current_revision $project_path

proc process_files {collection} {
    foreach_in_collection hdl_file $collection {
        set filename [get_assignment_info $hdl_file -value]
        set path [resolve_file_path $filename]
        set library [get_assignment_info $hdl_file -library]
        set library [expr {[string length $library]>0 ? $library : ""}]

{% for file in file_list %}
        if {$library == "{{ file["logical"] }}" && $path == "{{ file["name"] }}"} {
            puts "$library,$path"
            set_global_assignment -remove -name {{ file["type"] }} $filename
        }
{% endfor %}

    }
}

process_files [get_all_assignments -name VHDL_FILE -type global]
process_files [get_all_assignments -name VERILOG_FILE -type global]
process_files [get_all_assignments -name SYSTEMVERILOG_FILE -type global]
process_files [get_all_assignments -name SDC_FILE -type global]
process_files [get_all_assignments -name QIP_FILE -type global]