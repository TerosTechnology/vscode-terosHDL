export PATH="/home/carlos/Downloads/oss-cad-suite/bin:$PATH"
rm -rf ./*.o ./*.cf ./*.json

# # NOTE: if GHDL is built as a module, set MODULE to '-m ghdl' or '-m path/to/ghdl.so',
MODULE="-m ghdl"
yosys $MODULE -p 'ghdl --std=08 -fsynopsys counter_logic.vhd -e counter_logic; read_verilog counter_top.v; hierarchy -top counter_top; proc; write_json output.json; show counter_top'
