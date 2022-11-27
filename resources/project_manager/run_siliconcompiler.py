import json
import os
import sys

import siliconcompiler


def save_credentials(tool_options):
    server_enable = tool_options["server_enable"]
    server_address = tool_options["server_address"]
    server_username = tool_options["server_username"]
    server_password = tool_options["server_password"]

    print(
        "****************************************************************************************************************************************"
    )
    if server_enable is True:

        print(f"-------> Remote address {server_address}")
        print(f"-------> Remote username {server_username}")
        # print(f"-------> Remote password {server_password}")

        home_dir = os.path.expanduser("~")
        cretentials_path = os.path.join(home_dir, ".sc", "credentials")
        json_credentials = {"address": server_address, "username": server_username, "password": server_password}

        with open(cretentials_path, "w") as outfile:
            json.dump(json_credentials, outfile)
    else:
        print(f"-------> Remote server isn't enabled.")

    print(
        "****************************************************************************************************************************************"
    )
    return server_enable


edam_file = sys.argv[1]
simulator = sys.argv[2]
installation_path = sys.argv[3]
gui = sys.argv[4]
developer_mode = sys.argv[5]
waveform_viewer = sys.argv[6]

# Opening JSON file
f = open(
    edam_file,
)
# returns JSON object as
# a dictionary
edam = json.load(f)

toplevel = edam["toplevel"]
all_files = edam["files"]

tool_options = edam["tool_options"]["siliconcompiler"]

# Set credentials
server_enable = save_credentials(tool_options)

########################################################################################################################
# SiliconCompiler
########################################################################################################################
chip = siliconcompiler.Chip()

# Output directory
# home_dir = os.path.expanduser("~")
# work_root = os.path.join(home_dir, '.teroshdl', 'build')
# chip.set('dir',work_root)

# set top module
chip.set("design", toplevel)

for file_inst in all_files:
    filename = file_inst["name"]
    _, file_extension = os.path.splitext(filename)
    if file_extension == ".sdc":
        chip.set("constraint", filename)
    else:
        chip.set("source", filename)

chip.set("remote", server_enable)

# Load predefined target
target = tool_options["target"]
chip.target(target)
# Run compilation
chip.run()
# Print results summary
chip.summary()

# Show layout file
if gui == "gui":
    chip.show()
