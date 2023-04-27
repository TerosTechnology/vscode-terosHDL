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

prj = sys.argv[1]
f = open(prj,)
json_prj = json.load(f)

project_sources = json_prj
project = pj.Project()
libraries = []

for i in range(0, len(project_sources)):
    file_name = project_sources[i]['name']
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

try:
    files, dependencies = get_direct_dependencies(project)
except:
    pass

nodes = []
complete_nodes = []
for i in range(0, len(files)):
    complete_nodes.append(files[i].name)
    name = ntpath.basename(files[i].name)
    nodes.append(name)

# Add nodes
diagram = """
digraph {
    node [color="#069302" fillcolor=lightgray fontname=helvetica shape=component splines=line style="filled,rounded"]
"""
for i in range(0, len(nodes)):
    diagram += '    "' + \
        str(complete_nodes[i]) + '" [label="' + str(nodes[i]) + '"]\n'

# Add edge node
for i in range(0, len(dependencies)):
    for j in range(0, len(dependencies[i])):
        if (str(complete_nodes[i]) != str(dependencies[i][j])):
            diagram += '    "' + \
                str(complete_nodes[i]) + '" -> "' + \
                str(dependencies[i][j]) + '"\n'
diagram += '}'
print(diagram)
exit(0)
