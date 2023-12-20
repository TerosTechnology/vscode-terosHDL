set csv_file_name [lindex $argv 0]
set project_path [lindex $argv 1]

#open result file for writing
set csv_file [open $csv_file_name w]

project_open -force -current_revision "$project_path"
qsta_utility::auto_CRU "create_timing_netlist"

# For now, ignore the clock paths with path_only
set critical_paths [get_timing_paths -npaths 10 -detail path_only]

set on_path 1

# Walk through the 10 paths
foreach_in_collection path_id $critical_paths {

  puts $csv_file "Path ${on_path}"
  # When we use -detail path_only, the arrival points are the data arrival path
  # from register to register
  set arrival_points [get_path_info -arrival_points $path_id]

  set prev_cell_id ""
  
  # Walk through the arrival points
  foreach_in_collection point_id $arrival_points {
  
    set node [get_point_info -node $point_id]
    if { [catch { get_node_info -cell $node } this_cell_id] } {
      # This isn't a node - it could be something like the tco of the register
      continue
    }
    
    # Each cell has an input pin and an output pin, we only want to
    # print the file location once per cell.
    if { $this_cell_id eq $prev_cell_id } { continue }

    set prev_cell_id $this_cell_id
    
    # Get the names DB ID of the cell, and its file location string
    set cell_name [get_cell_info -name $this_cell_id]
    set cell_names_db_id [get_cell_info -name_obj $this_cell_id]
    set file_loc [get_name_info -info file_location $cell_names_db_id]
    
    regexp {(.*?)\((\d+)\)} $file_loc -> file_path line_num
    
    set output_line [list $cell_name $file_path $line_num]    
    puts $csv_file [join $output_line ","]
  }

  incr on_path
}