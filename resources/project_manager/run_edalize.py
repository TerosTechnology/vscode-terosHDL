# import os
import shutil
import edalize
import json
import sys
from distutils.spawn import find_executable
from os.path import expanduser
import os
import platform
import subprocess

home_dir = expanduser("~")
work_root = os.path.join(home_dir, '.teroshdl', 'build')
makefile_path = os.path.join(work_root, 'Makefile')
print("")
print("************************************************************************************************")
print("---> Build directory: {}".format(work_root))

try:
    if (os.path.isdir(work_root) == True):
        shutil.rmtree(work_root)
except Exception as e:
    pass

edam_file = sys.argv[1]
simulator = sys.argv[2]
installation_path = sys.argv[3]
gui = sys.argv[4]
developer_mode = sys.argv[5]
waveform_viewer = sys.argv[6]

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
    if (vsim_path == None):
        print('---> Error ModelSim path is not configured!')
        exit(-1)
    vsim_dir = os.path.dirname(vsim_path).replace("\\", "/")
    os.environ["MODEL_TECH"] = vsim_dir
    print(vsim_dir)

# Opening JSON file
f = open(edam_file,)

# returns JSON object as
# a dictionary
edam = json.load(f)
backend = edalize.get_edatool(simulator)(edam=edam,
                                         work_root=work_root)
os.makedirs(work_root)

build_gui_tools = ['vivado', 'trellis', 'apicula', 'icestorm', 'nextpnr']
simulator_gui_tools = ['modelsim', 'xsim', 'isum', 'spyglass', 'xcelium', 'trellis']


try:
    backend.configure()
    if (gui == 'gui' and (simulator in build_gui_tools)):
        p = subprocess.Popen(['make', 'build-gui'], cwd=work_root)
        p.wait()
    elif (gui == 'gui' and (simulator in simulator_gui_tools)):
        if (simulator == 'modelsim' and waveform_viewer != 'tool'):
            run_gui_external = "\
run-gui-external: work $(VPI_MODULES)\n\
	$(VSIM) -do \"vcd file waveform.vcd;vcd add -r *;run -all;quit -code [expr [coverage attribute -name TESTSTATUS -concise] >= 2 ? [coverage attribute -name TESTSTATUS -concise] : 0]; exit\" -c $(addprefix -pli ,$(VPI_MODULES)) $(EXTRA_OPTIONS) $(TOPLEVEL)\
"
            make_file = open(makefile_path, "a")
            make_file.write(run_gui_external)
            make_file.close()
            p = subprocess.Popen(['make', 'run-gui-external'], cwd=work_root)
            p.wait()
        else:
            p = subprocess.Popen(['make', 'run-gui'], cwd=work_root)
            p.wait()
    else:
        backend.build()
        backend.run()

except Exception as e:
    if (developer_mode == "true"):
        print('Error: ' + str(e))
    exit(-1)
