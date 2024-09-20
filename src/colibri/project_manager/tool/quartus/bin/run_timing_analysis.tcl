set project_path [lindex $argv 0]
set project_revision [lindex $argv 1]
set mode [lindex $argv 2]

project_open -force "$project_path" -revision "$project_revision"
qsta_utility::auto_CRU "create_timing_netlist -snapshot $mode"
qsta_utility::auto_report_setup