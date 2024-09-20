export PATH="/home/carlos/Downloads/oss-cad-suite/bin:$PATH"
rm -rf ./*.o ./*.cf ./*.json

yosys -p 'read_verilog counter_top.v mylib/counter_logic.v; hierarchy -top counter_top; proc; write_json output.json; stat'
