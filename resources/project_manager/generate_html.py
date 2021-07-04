#!/usr/bin/env python3

import yaml


def generate_html_button_tab(doc):
    html = '<div class="tab">\n'
    for tabname in doc:
        title = doc[tabname]['title']
        if (tabname == 'general'):
            html += f"  <button class='tablinks' onclick=\"open_tab(event, '{tabname}')\" id='default_open'>{title}</button>\n"
        else:
            html += f"  <button class='tablinks' onclick=\"open_tab(event, '{tabname}')\">{title}</button >\n"
    html += '</div>\n\n\n'
    return html


def generate_html_tabs(doc):
    html = ''
    for tabname in doc:
        html += generate_html_tab(doc[tabname], tabname, doc)
    return html


def generate_checkbox(option, name, tab_name):
    id_name = f"{tab_name}_{name}"
    description = option['description']
    html = f"  <label>{description}</label>\n"
    html += f"  <input class='radio-button' id='{id_name}' type='checkbox'>\n"
    html += "  <br><br>\n"
    return html


def generate_input(option, name, tab_name):
    id_name = f"{tab_name}_{name}"
    description = option['description']
    html = f"  <label>{description}</label>\n"
    html += f"  <input type='input' id='{id_name}' class='radio-button'>\n"
    html += "  <br><br>\n"
    return html


def generate_select(option, name, tab_name):
    id_name = f"{tab_name}_{name}"
    description = option['description']
    select_options = option['options']
    html = f"  <label>{description}</label>\n"
    html += "  <br>\n"
    html += f"  <select name='select' id='{id_name}'>\n"
    for op in select_options:
        select_option_desc = select_options[op]
        html += f"    <option value='{op}'>{select_option_desc}</option>\n"
    html += "  </select>\n"
    html += "  <br><br>\n"
    return html


def get_select_tool_options(doc):
    options = []
    for tabname in doc:
        tab_type = doc[tabname]['type']
        if (tab_type != 'none'):
            options.append(tabname)
    return options


def generate_select_tool(option, name, tab_name, doc):
    tools = get_select_tool_options(doc)
    id_name = f"{tab_name}_{name}"
    description = option['description']
    html = f"  <label>{description}</label>\n"
    html += "  <br>\n"
    html += f"  <select name='select' id='{id_name}'>\n"
    for op in tools:
        html += f"    <option value='{op}'>{op.capitalize()}</option>\n"
    html += "  </select>\n"
    html += "  <br><br>\n"
    return html


def generate_subtitle(option, name, tab_name, doc):
    description = option['title']
    html = f"  <h4>{description}</h4>\n"
    html += "  <br>\n"
    return html


def generate_html_tab(tab, tab_name, doc):
    tab_title = tab['title']
    tab_description = tab['description']

    html = f"<div id='{tab_name}' class='tabcontent'>\n"
    html += f"  <h3>{tab_title}</h3>\n"
    html += f"  <p><i>{tab_description}</i></p>\n"
    html += '  <hr></hr>'

    for option_name in tab:
        if (option_name != 'title' and option_name != 'description' and option_name != 'type'):
            option = tab[option_name]
            option_type = option['type']
            if (option_type == 'checkbox'):
                html += generate_checkbox(option, option_name, tab_name)
            elif (option_type == 'input' or option_type == 'input_comma' or option_type == 'input_integer'):
                html += generate_input(option, option_name, tab_name)
            elif (option_type == 'select'):
                html += generate_select(option, option_name, tab_name)
            elif (option_type == 'select_tool'):
                html += generate_select_tool(option, option_name, tab_name, doc)
            elif (option_type == 'subtitle'):
                html += generate_subtitle(option, option_name, tab_name, doc)

    html += '</div>\n\n'
    return html


def generate_script_switch_ab():
    html = """
  const vscode = acquireVsCodeApi();

  function open_tab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  // Get the element with id="default_open" and click on it
  document.getElementById("default_open").click();


  function send_config_and_close(){
    let config = get_config();

    vscode.postMessage({
        command: 'set_config',
        config : config
    });
  }

  function close_panel(){
    vscode.postMessage({
        command: 'close'
    });
  }
"""
    return html


def generate_get_config(doc):
    html = """
  function get_config(){
    let all_radios = document.getElementsByName('re');
    let selected_tool = '';
    for(i = 0; i < all_radios.length; i++){
      if(all_radios[i].checked === true){
        selected_tool = all_radios[i].getAttribute('tool');
      }
    }

    let config = {
      'selected_tool':selected_tool,
      'config':
      [\n"""
    for tabname in doc:
        html += f"        get_{tabname}_options(),\n"
    html += """
      ]
    }
    return config;
  }\n
"""

    for tabname in doc:
        html += f"  function get_{tabname}_options(){{\n"
        html += "    let options = {\n"
        html += f"""      '{tabname}': """ + '{\n'

        tab = doc[tabname]
        for option_name in tab:
            if (option_name != 'title' and option_name != 'description' != option_name != 'type'):
                option = tab[option_name]
                id_name = f"""{tabname}_{option_name}"""
                option_type = option['type']
                if (option_type == 'checkbox'):
                    html += f"""        '{option_name}': document.getElementById("{id_name}").checked,\n"""
                elif (option_type == 'input_comma'):
                    html += f"""        '{option_name}': document.getElementById("{id_name}").value.split(','),\n"""
                elif (option_type == 'subtitle'):
                    pass
                else:
                    html += f"""        '{option_name}': document.getElementById("{id_name}").value,\n"""

        html += "      }\n"
        html += "    };\n"
        html += "    return options;\n"
        html += "  }\n"

    return html


def generate_set_config(doc):
    html = """
  window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
          case 'set_config':
            set_config(message.config);
            break;
      }
  });
  function set_config(config){
    for (let i = 0; i < config.tool_config.length; i++) {
      let element = config.tool_config[i];
      let config_tool = '';
      let options;
      let installation_path = '';
      for(var attributename in element){
        config_tool = attributename;
        options = element[attributename];
        installation_path = element[attributename].installation_path;
      }
  """
    first = True
    for tabname in doc:
        if (first == True):
            html += f"      if (config_tool === '{tabname}'){{\n"
            html += f"        set_{tabname}_options(options, installation_path);\n"
            html += "      }\n"
            first = False
        else:
            html += f"      else if (config_tool === '{tabname}'){{\n"
            html += f"        set_{tabname}_options(options, installation_path);\n"
            html += "      }\n"
    html += """
    }
  }
"""
    return html


def generate_set_options(doc):
    html = ''
    for tabname in doc:
        html += f"  function set_{tabname}_options(options){{\n"
        tab = doc[tabname]
        for option_name in tab:
            if (option_name != 'title' and option_name != 'description' != option_name != 'type'):
                option = tab[option_name]
                id_name = f"""{tabname}_{option_name}"""
                option_type = option['type']
                if (option_type == "checkbox"):
                    html += f"    document.getElementById('{id_name}').checked = options.{option_name};\n"
                elif(option_type == "input_comma"):
                    html += f"    document.getElementById('{id_name}').value = options.{option_name}.join(',');\n"
                elif(option_type == "subtitle"):
                    pass
                else:
                    html += f"    document.getElementById('{id_name}').value = options.{option_name};\n"
        html += '  }\n'
    return html


def merge_config():
    data = data2 = ""

    # Reading data from file1
    with open('config_general.yml') as fp:
        data = fp.read()

    # Reading data from file2
    with open('config_tool.yml') as fp:
        data2 = fp.read()

    # Merging 2 files
    # To add the data of file2
    # from next line
    data += "\n"
    data += data2

    with open('config.yml', 'w') as fp:
        fp.write(data)


def main():
    merge_config()

    with open('config.yml', 'r') as f:
        doc = yaml.load(f, Loader=yaml.SafeLoader)
    with open('style.css', 'r') as f:
        style = f.read()

    html = f"""
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
{style}
</style>
</head>
<body>
<article class="markdown-body">
<br>
<h2>\nTerosHDL configuration</h2>
    """

    html += generate_html_button_tab(doc)
    html += generate_html_tabs(doc)
    html += '<button id="button_cancel" class="button" type="button" onclick="close_panel(event)">Close</button>'
    html += '<button id="button_apply" class="button" type="button" onclick="send_config_and_close(event)">Apply</button>'
    html += '<script>'
    html += generate_script_switch_ab()
    html += generate_get_config(doc)
    html += generate_set_config(doc)
    html += generate_set_options(doc)

    html += '  </script>\n  </body>\n  </html>'

    with open('config.html', 'w') as f:
        f.write(html)


if __name__ == "__main__":
    main()


def generate_html_tab(tab):
    print()
