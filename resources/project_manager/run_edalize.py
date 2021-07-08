import os
import shutil
import edalize
import json
import sys
from distutils.spawn import find_executable
from os.path import expanduser
import os
import platform

home_dir = expanduser("~")
work_root = os.path.join(home_dir, '.teroshdl', 'build')
print("")
print("************************************************************************************************")
print("---> Build directory: {}".format(work_root))

if (os.path.isdir(work_root) == True):
    shutil.rmtree(work_root)

edam_file = sys.argv[1]
simulator = sys.argv[2]
installation_path = sys.argv[3]

if (installation_path != ''):
    # Check if installation path exists
    check_dir = os.path.isdir(installation_path)
    if (check_dir == True):
        plt = platform.system()
        if (plt == "Windows"):
            os.environ['PATH'] += f";{installation_path}"
        else:
            os.environ['PATH'] += f":{installation_path}"

    else:
        print("---> Installation folder path: {} doesn't exists. It will search in the system path!!".format(installation_path))

if (simulator == 'modelsim'):
    vsim_path = find_executable("vsim")
    vsim_dir = os.path.dirname(vsim_path)
    os.environ["MODEL_TECH"] = vsim_dir

# Opening JSON file
f = open(edam_file,)

# returns JSON object as
# a dictionary
edam = json.load(f)
backend = edalize.get_edatool(simulator)(edam=edam,
                                         work_root=work_root)
os.makedirs(work_root)
backend.configure()
backend.build()
backend.run()
