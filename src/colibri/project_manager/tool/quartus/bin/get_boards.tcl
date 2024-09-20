#quartus_sh -t quartus.tcl <pah to csv file>

set csv_file_name [lindex $argv 0]

#open result file for writing
set csv_file [open $csv_file_name w]

proc get_boards {csv_file} {
    load_package ::quartus::device
    set family_list [get_family_list]

    foreach family $family_list {
        set part_list [get_part_list -family "$family"]
        set boards [linsert $part_list 0 "$family"]
        puts $csv_file [join $boards "," ]
    }

}

get_boards $csv_file