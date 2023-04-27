# vivado -mode batch -source vivado.tcl -tclargs vivado.xpr out.csv

set prj_path [lindex $argv 0]
set output_csv_path [lindex $argv 1]

open_project -read_only -quiet $prj_path

set source_files [get_files -filter {(FILE_TYPE == VHDL || FILE_TYPE == "VHDL 2008" || FILE_TYPE == VERILOG || FILE_TYPE == SYSTEMVERILOG) && USED_IN_SIMULATION == 1 } ]
set csv_file [open $output_csv_path w]
foreach source_file $source_files {
	puts  $csv_file [ concat  [ get_property LIBRARY $source_file ] "," $source_file ]
}

close_project