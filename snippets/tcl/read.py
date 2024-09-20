# Copyright 2023
# Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
#
# This file is part of teroshdl
#
# Colibri is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Colibri is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with teroshdl. If not, see <https://www.gnu.org/licenses/>.

import json
import os

import jinja2


def giveme_body(body_str):
    body_str = l[2:].replace("\n", "")
    body_str = body_str.replace("[<", "${0:").replace(">]", "}")
    body_str = body_str.replace("[", "${0:").replace("]", "}")
    body_str = body_str.replace("<", "${0:").replace(">", "}")
    return body_str


with open("osvvm_doc.txt", encoding="UTF-8") as f:
    lines = f.readlines()

commands = []

body = ""
description = ""
for i, n in enumerate(lines):
    l = lines[i]

    if i == 0:
        body = giveme_body(l)
        description = ""
    elif l[0] == "-":
        new_info = {
            "cmd": body.split(" ", maxsplit=1)[0],
            "body": body,
            "description": description,
        }
        commands.append(new_info)
        body = giveme_body(l)
        description = ""
    else:
        description = description + l[4:].strip()

str_out = ""
for cmd in commands:
    cmd_inst = cmd["cmd"]
    body = cmd["body"]
    description = cmd["description"]
    cmd_str = f"""
    "osvvm_{cmd_inst}": {{
        "prefix": "osvvm_{cmd_inst}",
        "body": [
            "{body}"
        ],
        "description": "{description}"
    }},"""
    str_out += cmd_str

str_out = str_out[:-1] + "\n}"

template_path = os.path.join(os.path.dirname(__file__), "tcl.nj")
with open(template_path, encoding="UTF-8") as file:
    template_str = file.read() + str_out

output_path = os.path.join(os.path.dirname(__file__), "tcl.json")
with open(output_path, "w", encoding="UTF-8") as file:
    file.write(template_str)
