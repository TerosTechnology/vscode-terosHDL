#quartus_sh -t quartus.tcl <path to qpf or qsf file>
## return: prj_name, revision, top_level_entity

set project_path [lindex $argv 0]
set csv_file_name [lindex $argv 1]

#open Quartus project
project_open -current_revision $project_path

#open result file for writing
set csv_file [open $csv_file_name w]

proc get_prj_info {csv_file} {
    set prj_name [get_current_project]
    set prj_revision [get_current_revision]
    set top_level_entity [get_global_assignment -name TOP_LEVEL_ENTITY]

    puts $csv_file [join [ list $prj_name $prj_revision $top_level_entity] "," ]

    set revision_list [get_project_revisions]
    puts $csv_file [join [ $revision_list ] "," ]
}

get_prj_info $csv_file