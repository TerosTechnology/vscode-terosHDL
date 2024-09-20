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

import os
import json
from pathlib import Path
import sys
import os.path

import vunit.project as pj
from vunit.vhdl_standard import VHDL
import sys


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

        suffix = Path(file_name).suffix.lower()
        if (suffix == ".v" or suffix == ".vh" or suffix == ".vl"):
            filetype = "verilog"
        elif (suffix == ".sv" or suffix == ".svh"):
            filetype = "systemverilog"
        else:
            filetype = "vhdl"
        project.add_source_file(
            file_name, file_library, file_type=filetype, vhdl_standard=VHDL.STD_2008)

files_array = []
try:
    files_in_compile_order = project.get_dependencies_in_compile_order()
    for i in range(0, len(files_in_compile_order)):
        library_name = ''
        if ( files_in_compile_order[i].library.name != 'src_lib_teroshdl'):
            library_name = files_in_compile_order[i].library.name

        true_name = files_in_compile_order[i].name
        for j in range(0, len(project_sources)):
            if project_sources[j]['name_map'] == true_name:
                true_name = project_sources[j]['name']

        file_order = {'name': true_name, 'logical_name': library_name}
        files_array.append(file_order)
except:
    pass

json_files_array = json.dumps(files_array)
json_files_array = str(json_files_array)
json_files_array



