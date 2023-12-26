 # Helper proc
proc get_info_for_cell { cell_id } {

  set cell_name [get_cell_info -name $cell_id]
  set cell_location [get_cell_info -location $cell_id]
  set cell_names_db_id [get_cell_info -name_obj $cell_id]
  # Get the names DB ID of the cell, and its file location string
  set file_loc [get_name_info -info file_location $cell_names_db_id]
  # File location is of the form <file name>(<line num>)
  # Extract the file path and the line number separately
  regexp {(.*?)\((\d+)\)} $file_loc -> file_path line_num

  return [dict create "cell_name" $cell_name "cell_location" $cell_location "cell_file_path" $file_path "cell_file_line" $line_num]    
}

set csv_file_name [lindex $argv 0]
set project_path [lindex $argv 1]
set num_of_paths [lindex $argv 2]

#open result file for writing
set csv_file [open $csv_file_name w]

project_open -force -current_revision "$project_path"
qsta_utility::auto_CRU "create_timing_netlist"

################################################################################
# Main part of the script
################################################################################
# For now, ignore the clock paths with path_only
set critical_paths [get_timing_paths -npaths [expr {$num_of_paths}] -detail path_only]

# For printing out which path we're on
set on_path 1

# Walk through the timing path collection
foreach_in_collection path_id $critical_paths {

  set slack [get_path_info -slack $path_id]
  set logic_depth [get_path_info -num_logic_levels $path_id]

  set from_node [get_path_info -from $path_id]
  set to_node [get_path_info -to $path_id]
  set from_name [get_node_info -name $from_node]
  set to_name [get_node_info -name $to_node]
  
  puts $csv_file "Path ${on_path},${slack},${logic_depth}"
  
  # When we use -detail path_only, the arrival points are the data arrival path
  # from register to register
  set arrival_points [get_path_info -arrival_points $path_id]

  # Each cell has an input pin and an output pin, we only need to
  # print the file location once per cell.
  # We could potentially be even smarter and track the location of each element
  # and aggregate information per unique file location.
  # For example, an adder may have dozens of unique cells but they all map
  # from one line of rtl, like a <= b + c. It's arguably not helpful to print
  # each adder cell on its own line.
  # We'll pre-fill the prev cell to the starting cell of the path to make
  # all the accumulation work
  set prev_cell_id [get_node_info -cell $from_node]
  set incremental_delay 0
  
  # Walk through the arrival points
  foreach_in_collection point_id $arrival_points {

    # We will skip the launch edge time and the lumped clock path delay  
    set type [get_point_info -type $point_id]
    switch -exact -- $type {
      "launch" -
      "clknet" { continue }
    }
    
    set node [get_point_info -node $point_id]
    if { [catch { get_node_info -cell $node } this_cell_id] } {
      # Protect against something that's not a node
      continue
    }

    # Get the incremental delay of this part of the timing path
    set this_incremental_delay [get_point_info -incremental_delay $point_id]
   
    # Each cell has an input pin and an output pin, we only need to
    # print the file location once per cell.
    if { $this_cell_id eq $prev_cell_id } {
      # Still in the same cell, add this delay
      set incremental_delay [expr { $incremental_delay + $this_incremental_delay }]
    } else {
      # We're on a new cell this time.
      # Print what we had been accumulating
      set prev_cell_info_dict [get_info_for_cell $prev_cell_id]
      dict with prev_cell_info_dict {
        set output_line [list $cell_name $cell_location [format "%.3f" $incremental_delay] $cell_file_path $cell_file_line]    
      }
      puts $csv_file [join $output_line ","]


      # Zero out the incremental delay since we just printed the delay of
      # things associated since the last print
      set incremental_delay $this_incremental_delay
    }
    
    set prev_cell_id $this_cell_id
  }

  # Need to do this once more at the end of the path
  set prev_cell_info_dict [get_info_for_cell $prev_cell_id]
  dict with prev_cell_info_dict {
    set output_line [list $cell_name $cell_location [format "%.3f" $incremental_delay] $cell_file_path $cell_file_line]    
  }
  puts $csv_file [join $output_line ","]

  incr on_path
}