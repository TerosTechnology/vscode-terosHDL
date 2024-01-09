set project_path [lindex $argv 0]
set rtl_type [lindex $argv 1]

load [file join $::quartus(binpath) resr_tmwq] tmwq
project_open -force -current_revision $project_path
tmwq_open_rtl_analyzer dms_path::user_runs::default_run::$rtl_type