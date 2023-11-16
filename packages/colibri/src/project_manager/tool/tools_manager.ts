// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
//
// This file is part of TerosHDL
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
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import { Cocotb } from "./cocotb/cocotb";
import { Edalize } from "./edalize/edalize";
import { Vunit } from "./vunit/vunit";
import { Osvvm } from "./osvvm/osvvm";
import { Raptor } from "./raptor/raptor";
import { t_project_definition } from "../project_definition";
import { t_test_declaration, t_test_result, e_clean_step } from "./common";
import { e_tools_general_select_tool } from "../../config/config_declaration";
import * as os from "os";
import * as path_lib from "path";

export class Tool_manager {
    private edalize: Edalize;
    private vunit: Vunit;
    private cocotb: Cocotb;
    private osvvm: Osvvm;
    private raptor: Raptor;
    private working_directory = "";

    constructor(working_directory: string | undefined) {
        this.edalize = new Edalize();
        this.vunit = new Vunit();
        this.cocotb = new Cocotb();
        this.osvvm = new Osvvm();
        this.raptor = new Raptor();
        this.set_working_directory(working_directory);
    }

    public set_working_directory(working_directory: string | undefined) {
        if (working_directory === undefined) {
            const homedir = os.homedir();
            this.working_directory = path_lib.join(homedir, '.teroshdl', 'build');
        }
        else {
            this.working_directory = working_directory;
        }
    }

    public async get_test_list(prj: t_project_definition): Promise<t_test_declaration[]> {
        const tool_name = prj.config_manager.get_tool_name();
        const tool_handler = this.get_tool_handler(tool_name);
        return await tool_handler.get_test_list(prj);
    }

    public run(prj: t_project_definition, test_list: t_test_declaration[],
        callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void) {

        const tool_name = prj.config_manager.get_config().tools.general.select_tool;
        const tool_handler = this.get_tool_handler(tool_name);
        return tool_handler.run(prj, test_list, this.working_directory, callback, callback_stream);
    }

    public clean(prj: t_project_definition, clean_mode: e_clean_step, callback_stream: (stream_c: any) => void) {
        const tool_name = prj.config_manager.get_config().tools.general.select_tool;
        const tool_handler = this.get_tool_handler(tool_name);
        return tool_handler.clean(prj, this.working_directory, clean_mode, callback_stream);
    }

    private get_tool_handler(tool_name: e_tools_general_select_tool): Edalize | Vunit | Cocotb | Osvvm | Raptor{
        if (this.vunit.get_supported_tools().includes(tool_name)) {
            return this.vunit;
        }
        else if (this.edalize.get_supported_tools().includes(tool_name)) {
            return this.edalize;
        }
        else if (this.cocotb.get_supported_tools().includes(tool_name)) {
            return this.cocotb;
        }
        else if (this.osvvm.get_supported_tools().includes(tool_name)) {
            return this.osvvm;
        }
        else if (this.raptor.get_supported_tools().includes(tool_name)) {
            return this.raptor;
        }
        return this.edalize;
    }
}






