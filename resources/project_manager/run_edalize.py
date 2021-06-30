import os
import shutil
import edalize
import json
import sys
from distutils.spawn import find_executable
from os.path import expanduser

home_dir = expanduser("~")
work_root = os.path.join(home_dir, '.teroshdl', 'build')
print("")
print("************************************************************************************************")
print("---> Build directory: {}".format(work_root))

if (os.path.isdir(work_root) == True):
    shutil.rmtree(work_root)

edam_file = sys.argv[1]
simulator = sys.argv[2]

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
