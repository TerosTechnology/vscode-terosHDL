import json
import os

import jinja2
import yaml

################################################################################
#  Read skeleton
################################################################################
skeleton_path = os.path.join(os.path.dirname(__file__), "skeleton.yml")
with open(skeleton_path) as file:
    skeleton = yaml.load(file, Loader=yaml.FullLoader)

for page_name in skeleton:
    skeleton[page_name]["pages"] = {}
    # Add general page
    general_page_path = os.path.join(os.path.dirname(__file__), skeleton[page_name]["general"])
    with open(general_page_path) as file:
        skeleton[page_name]["pages"]["general"] = yaml.load(file, Loader=yaml.FullLoader)
        skeleton[page_name]["pages"]["general"]["title"] = "General"
        skeleton[page_name]["pages"]["general"]["description"] = ""

    # Add secundary pages
    type = "secondary"
    if type in skeleton[page_name]:
        secondary_page = skeleton[page_name][type]
        for secondary_page_name in secondary_page:
            secondary_page_path = os.path.join(os.path.dirname(__file__), secondary_page[secondary_page_name]["page"])
            with open(secondary_page_path) as file:
                secondary_page_config = yaml.load(file, Loader=yaml.FullLoader)
                skeleton[page_name]["pages"][secondary_page_name] = secondary_page_config
                skeleton[page_name]["pages"][secondary_page_name]["title"] = skeleton[page_name]["secondary"][
                    secondary_page_name
                ]["title"]
                skeleton[page_name]["pages"][secondary_page_name]["description"] = skeleton[page_name]["secondary"][
                    secondary_page_name
                ]["description"]

########################################################################################################################
# Web config HTML
########################################################################################################################
css_codicons = "{{css_codicons}}"
csp_source = "{{cspSource}}"
template_path = os.path.join(os.path.dirname(__file__), "web_config.nj")
with open(template_path) as file:
    template_str = file.read()
    template_html = (
        jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))
        .from_string(template_str)
        .render(type_declaration=skeleton, css_codicons=css_codicons, cspSource=csp_source)
    )
output_path = os.path.join(os.path.dirname(__file__), "..", "web_config.html")
with open(output_path, mode="w", encoding="UTF-8") as file:
    file.write(template_html)

########################################################################################################################
# Web config constant
########################################################################################################################
# No need to replace anything since we're using template variables directly

template_path = os.path.join(os.path.dirname(__file__), "web_ts.nj")
with open(template_path) as file:
    template_str = file.read()
    template = (
        jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__))).from_string(template_str).render(web=template_html)
    )

output_path = os.path.join(os.path.dirname(__file__), "..", "config_web.ts")
with open(output_path, mode="w", encoding="utf-8") as file:
    file.write(template)
