// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.
import * as vscode from 'vscode';
import * as jsteros from 'jsteros';

const LANGUAGES = {
    "source.verilog": jsteros.General.LANGUAGES.VERILOG,
    "source.vhdl": jsteros.General.LANGUAGES.VHDL
};
export async function get_template() {
    if (!vscode.window.activeTextEditor) {
        return; // no editor
    }
    let document = vscode.window.activeTextEditor.document;
    let language_id : string = document.languageId;

    const TYPES_VHDL_INFO : string[] = ["cocotb", "VUnit testbench", "VHDL testbench", "Copy as component", "Copy as signal", "Copy as instance","Copy as instance_vhdl_>93"];
    const TYPES_VHDL      : string[] = ["cocotb", "tb", "tb", "component", "component", "component", "component"];
    const SUBTYPES_VHDL   : string[] = ["cocotb", "vunit", "normal", "component", "signals", "instance", "instance_vhdl_2008"];

    const TYPES_VERILOG_INFO : string[] = ["cocotb", "Verilator", "VUnit testbench", "Verilog testbench", "Copy as signal", "Copy as instance"];
    const TYPES_VERILOG      : string[] = ["cocotb", "verilator", "tb", "tb", "component", "component"];
    const SUBTYPES_VERILOG   : string[] = ["cocotb", "verilator", "vunit", "normal", "signals", "instance"];

    let type : string = "";
    let subtype : string = "";
    if(language_id === "vhdl"){
        let picker_value = await vscode.window.showQuickPick(TYPES_VHDL_INFO, 
                                                { placeHolder: 'Select the template type.' });
        for (let i = 0; i < TYPES_VHDL_INFO.length; i++) {
            if (picker_value === TYPES_VHDL_INFO[i]){
                type = TYPES_VHDL[i];
                subtype = SUBTYPES_VHDL[i];
                break;
            }            
        }
    }
    else if (language_id === "verilog"){
        let picker_value = await vscode.window.showQuickPick(TYPES_VERILOG_INFO, 
                                                { placeHolder: 'Select the template type.' });
        for (let i = 0; i < TYPES_VERILOG_INFO.length; i++) {
            if (picker_value === TYPES_VERILOG_INFO[i]){
                type = TYPES_VERILOG[i];
                subtype = SUBTYPES_VERILOG[i];
                break;
            }            
        }
    }
    else{
        return;
    }

    let options = {
        "type": subtype
      };
    let code : string = document.getText();

    let templates_cl = new jsteros.Templates.Templates_factory();
    let template = await templates_cl.get_template(type,language_id);
    let template_str : string = await template.generate(code,options);

    //Error
    if (template_str === undefined){
        vscode.window.showErrorMessage('Select a valid file.!');
        console.log("Error parser template.");
    }
    else{
        vscode.window.showInformationMessage('Template copied to clipboard!\n');
        vscode.env.clipboard.writeText(template_str);
    }
}