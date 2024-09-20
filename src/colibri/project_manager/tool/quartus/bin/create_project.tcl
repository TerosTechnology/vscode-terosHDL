set csv [lindex $argv 0]
set name [lindex $argv 1]
set family [lindex $argv 2]
set part [lindex $argv 3]

project_new -family $family -part $part -overwrite $name