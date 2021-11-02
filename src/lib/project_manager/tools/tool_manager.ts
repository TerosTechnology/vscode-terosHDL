// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of TerosHDL.
//
// TerosHDL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// TerosHDL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import * as Vunit from "./vunit";
import * as Cocotb from "./cocotb";
import * as Edalize from "./edalize";
import * as Osvvm from "./osvvm";

export class Tool_manager {
    private vunit : Vunit.Vunit;
    private cocotb : Cocotb.Cocotb;
    private edalize : Edalize.Edalize;
    private osvvm : Osvvm.Osvvm;
    private edam_project_manager;
    private config_file;

    constructor(context, output_channel, config_file, config_reader, edam_project_manager){
        this.edam_project_manager = edam_project_manager;
        this.vunit = new Vunit.Vunit(context, output_channel, edam_project_manager, config_file);
        this.osvvm = new Osvvm.Osvvm(context, output_channel, edam_project_manager, config_file);
        this.cocotb = new Cocotb.Cocotb(context, output_channel, edam_project_manager);
        this.edalize = new Edalize.Edalize(context, output_channel, config_reader, config_file, edam_project_manager);
        this.config_file = config_file;
    }

    clear(){
        this.osvvm.clear();
        this.edalize.clear();
    }

    stop(){
        this.vunit.stop_test();
        this.cocotb.stop_test();
        this.edalize.stop_test();
        this.osvvm.stop_test();
    }

    async get_test_list(){
        let tool = this.get_tool();
        let test_list = tool.get_test_list();
        return test_list;
    }

    async run(testname, gui: boolean){
        let tool = this.get_tool();
        let result = await tool.run(testname, gui);
        return result;
    }

    get_tool(){
        let tool_configuration = this.config_file.get_config_of_selected_tool();
        if ('vunit' in tool_configuration) {
            return this.vunit;
        }
        else if ('cocotb' in tool_configuration) {
            return this.cocotb;
        }
        else if ('osvvm' in tool_configuration) {
            return this.osvvm;
        }
        else {
            return this.edalize;
        }
    }


}