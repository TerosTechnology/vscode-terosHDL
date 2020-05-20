// MIT License

// Copyright (c) 2019 Isaac True

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as child from 'child_process';
import * as temp from 'temp';
import * as fs from 'fs';
import * as vscode from 'vscode';

const style_map: { [style: string]: string } = {
    "Indent only": "",
	"Kernighan&Ritchie": "kr",
	"GNU": "gnu",
    "ANSI": "ansi"
};

export function format_verilog(code: string, context: vscode.ExtensionContext) {
    const istyle_path = context.asAbsolutePath("resources/bin/istyle/iStyle");
	const istyle_extra_args = get_extra_args();
	var args: string[] = [
		"-n", // Do not create a .orig file
	];
	const style = get_formatting_style_arg();
	if (style.length !== 0) {
		args.push(style);
	}
	if (istyle_extra_args.length !== 0) {
		args = args.concat(istyle_extra_args.split(" "));
	}
	var tempfile: string = create_temp_file_of_code(code);
	args.push(tempfile);
    child.execFileSync(istyle_path, args, {});
    let formatted_code = fs.readFileSync(tempfile, { encoding: "utf8" });
    return formatted_code;
}

function get_formatting_style_arg(): string {    
    const style = <string>vscode.workspace.getConfiguration("teroshdl.formatting.verilog").get("style");
    const map_style = style_map[style];
	if (map_style !== undefined && map_style.length !== 0) {
        return "--style=ansi";
	} else {
		return "";
	}
}

function get_extra_args(): string {    
    const style = <string>vscode.workspace.getConfiguration("teroshdl.formatting.verilog").get("spaces");
    let args = "-s" + style;
    return args;    
}

function create_temp_file_of_code(content: string) {
	const temp_file = temp.openSync();
	if (temp_file === undefined) {
		throw "Unable to create temporary file";
	}
	fs.writeSync(temp_file.fd, content);
	fs.closeSync(temp_file.fd);
	return temp_file.path;
}