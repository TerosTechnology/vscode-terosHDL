# Copyright 2021
# Carlos Alberto Ruiz Naranjo, Ismael Pérez Rojo,
# Alfredo Enrique Sáez Pérez de la Lastra
#
# This file is part of TerosHDL.
#
# TerosHDL is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# TerosHDL is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

# pylint: disable=too-many-lines

import ntpath
import json
from pathlib import Path
import os
import os.path

import vunit.project as pj
from vunit.vhdl_standard import VHDL

def get_direct_dependencies(project):
    dependency_graph = project.create_dependency_graph(True)
    files = project.get_source_files_in_order()
    dependencies = []
    for i in range(0, len(files)):
        dependency_local = []
        dependency = dependency_graph.get_direct_dependencies(files[i])
        for dep in dependency:
            dependency_local.append(str(dep.name))
        dependencies.append(dependency_local)
    return files, dependencies


project = pj.Project()
libraries = []

for i in range(0, len(project_sources)):
    file_name = project_sources[i]['name_map']
    if os.path.exists(file_name):
        file_library = 'src_lib_teroshdl'

        if 'logical_name' in project_sources[i]:
            file_library = project_sources[i]['logical_name']

        if file_library in libraries:
            pass
        else:
            project.add_library(file_library, "work_path")
            libraries.append(file_library)

        suffix = Path(file_name).suffix
        if (suffix == ".v" or suffix == ".vh" or suffix == ".vl"):
            filetype = "verilog"
        elif (suffix == ".sv" or suffix == ".svh"):
            filetype = "systemverilog"
        else:
            filetype = "vhdl"
        project.add_source_file(
            file_name, file_library, file_type=filetype, vhdl_standard=VHDL.STD_2008)
    else:
        exit(-1)
try:
    files, dependencies = get_direct_dependencies(project)
except:
    pass

nodes = []
complete_nodes = []
for i in range(0, len(files)):
    complete_nodes.append(files[i].name)
    name = ntpath.basename(files[i].name)
    if (len(files[i].design_units) >= 1):
        name = files[i].design_units[0].name
    nodes.append(name)

total_dependencies = []
for i in range(0, len(nodes)):
    # Get dependencies name from name_map
    dependencies_current = dependencies[i]
    new_dependencies = []
    for j in range(0, len(dependencies_current)):
        for k in range(0, len(project_sources)):
            if (dependencies_current[j] == project_sources[k]["name_map"]):
                new_dependencies.append(project_sources[k]["name"])

    # Get dependencies name from name_map
    filename = complete_nodes[i]
    for k in range(0, len(project_sources)):
        if filename == project_sources[k]["name_map"]:
            filename = project_sources[k]["name"]
    
    inst_mod = {'filename': filename, 'entity': nodes[i], 'dependencies': new_dependencies}
    total_dependencies.append(inst_mod)

json_files_array = json.dumps(total_dependencies)
json_files_array = str(json_files_array)
json_files_array
