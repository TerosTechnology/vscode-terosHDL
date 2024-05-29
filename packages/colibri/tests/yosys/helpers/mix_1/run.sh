export PATH="/home/carlos/Downloads/oss-cad-suite/bin:$PATH"
rm -rf ./*.o ./*.cf ./*.json

# # NOTE: if GHDL is built as a module, set MODULE to '-m ghdl' or '-m path/to/ghdl.so',
MODULE="-m ghdl"
yosys $MODULE -p 'read_verilog counter_logic.v; ghdl counter_top.vhd -e counter_top; proc; write_json output.json; stat'
