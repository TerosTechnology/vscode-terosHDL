import json
import os

import jinja2

# Opening JSON file
f = open('report.json')
  
# returns JSON object as 
# a dictionary
data = json.load(f)

css_0 = "./sidebar/bootstrap.min.css"
css_1 = "./sidebar/sidebars.css"
js_0 =  "./sidebar/bootstrap.bundle.min.js"

template_path = os.path.join(os.path.dirname(__file__), "report_webview.html.nj")
with open(template_path) as file:
    template_str = file.read()
    template = jinja2.Template(template_str).render(
        data=data,
        css_0=css_0,
        css_1=css_1,
    )


output_path = os.path.join(os.path.dirname(__file__), "report.html")
with open(output_path, mode="w") as file:
    file.write(template)