import json
import os

import jinja2
import yaml

command_path = os.path.join(os.path.dirname(__file__), "command.yml")
with open(command_path, encoding="UTF-8") as file:
    command_list = yaml.load(file, Loader=yaml.FullLoader)

language_path = os.path.join(os.path.dirname(__file__), "language.yml")
with open(language_path, encoding="UTF-8") as file:
    language_list = yaml.load(file, Loader=yaml.FullLoader)

script_path = os.path.join(os.path.dirname(__file__), "script.yml")
with open(script_path, encoding="UTF-8") as file:
    script_list = yaml.load(file, Loader=yaml.FullLoader)

template_path = os.path.join(os.path.dirname(__file__), "templates", "package.nj")
with open(template_path, encoding="UTF-8") as file:
    template_str = file.read()
    template = (
        jinja2.Environment(loader=jinja2.FileSystemLoader("./templates"))
        .from_string(template_str)
        .render(command_list=command_list, language_list=language_list, script_list=script_list)
    )

output_path = os.path.join(os.path.dirname(__file__), "..", "package.json")
with open(output_path, mode="w", encoding="UTF-8") as file:
    file.write(template)
