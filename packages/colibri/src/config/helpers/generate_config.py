import json
import os

import jinja2
import yaml

AUXILIAR_FIELDS = ["description", "title"]


def get_type_declaration(field):
    new_field = {}
    for key in field:
        if key not in AUXILIAR_FIELDS:
            type_declaration = {
                "value": field[key]["value"],
                "type": field[key]["type"],
            }
            if "options" in field[key]:
                options = field[key]["options"]
                type_declaration["options"] = options
            new_field[key] = type_declaration
    return new_field


def remove_auxiliar_fields(field):
    for fl in AUXILIAR_FIELDS:
        field.pop(fl, None)
    return field


def remove_auxiliar_fields_deep(field):
    new_field = {}
    for key in field:
        if key not in AUXILIAR_FIELDS:
            new_field[key] = field[key]["value"]
    return new_field


def set_general_config(type_declaration, skeleton, page_name):
    type = "general"
    page_config = skeleton[page_name][type]

    page_path = os.path.join(os.path.dirname(__file__), page_config)
    with open(page_path) as file:
        page_config = yaml.load(file, Loader=yaml.FullLoader)
        page_config_type = get_type_declaration(page_config)
        page_config = remove_auxiliar_fields_deep(page_config)
        skeleton[page_name][type] = page_config
        type_declaration[page_name][type] = page_config_type
    return skeleton, type_declaration


def set_secondary_config(type_declaration, skeleton, page_name):
    type = "secondary"
    if type in skeleton[page_name]:
        secondary_page = skeleton[page_name][type]
        for secondary_page_name in secondary_page:
            secondary_page_path = os.path.join(os.path.dirname(__file__), secondary_page[secondary_page_name]["page"])
            with open(secondary_page_path) as file:
                secondary_page_config = yaml.load(file, Loader=yaml.FullLoader)
                secondary_page_config_type = get_type_declaration(secondary_page_config)
                secondary_page_config = remove_auxiliar_fields_deep(secondary_page_config)
                skeleton[page_name][secondary_page_name] = secondary_page_config
                type_declaration[page_name][secondary_page_name] = secondary_page_config_type
        skeleton[page_name].pop("secondary", None)
        type_declaration[page_name].pop("secondary", None)
    return skeleton, type_declaration


################################################################################
#  Read skeleton
################################################################################
skeleton_path = os.path.join(os.path.dirname(__file__), "skeleton.yml")
with open(skeleton_path) as file:
    skeleton = yaml.load(file, Loader=yaml.FullLoader)

type_declaration = {}
for page_name in skeleton:
    skeleton[page_name] = remove_auxiliar_fields(skeleton[page_name])
    type_declaration[page_name] = skeleton[page_name].copy()
    # Main config in page
    skeleton, type_declaration = set_general_config(type_declaration, skeleton, page_name)
    # Secondary config in page
    skeleton, type_declaration = set_secondary_config(type_declaration, skeleton, page_name)

################################################################################
#  Write Template
################################################################################
field_decorator = ["description"]

decorator = json.dumps(field_decorator)
json_str = json.dumps(skeleton, indent=4, default=str)
template_path = os.path.join(os.path.dirname(__file__), "config_declaration.nj")
with open(template_path) as file:
    template_str = file.read()
    template = jinja2.Template(template_str).render(
        default_config=json_str, decorator=decorator, type_declaration=type_declaration
    )

output_path = os.path.join(os.path.dirname(__file__), "..", "config_declaration.ts")
with open(output_path, mode="w") as file:
    file.write(template)
