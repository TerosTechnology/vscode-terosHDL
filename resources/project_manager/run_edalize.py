import os
import shutil
import edalize
import json
import sys

if (os.path.isdir('./build') == True):
    shutil.rmtree('./build')

work_root = 'build'
edam_file = sys.argv[1]
simulator = sys.argv[2]

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
