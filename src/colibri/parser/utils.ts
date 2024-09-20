import * as path from "path";

export function getVerilogWasmPath() : string{
    return path.join(__dirname, "parsers", "tree-sitter-verilog.wasm");
}

export function getVhdlWasm() : string{
    return path.join(__dirname, "parsers", "tree-sitter-vhdl.wasm");
}