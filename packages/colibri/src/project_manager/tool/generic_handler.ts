// Copyright 2022
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
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
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

import { t_test_declaration, t_test_result } from "./common";
import { e_tools_general_select_tool } from "../../config/config_declaration";
import { t_project_definition } from "../project_definition";
import * as file_utils from "../../utils/file_utils";
import * as os from "os";
import * as path_lib from "path";


export abstract class Generic_tool_handler {
    private supported_tools: e_tools_general_select_tool[];
    working_directory: string;

    constructor(supported_tools: e_tools_general_select_tool[]) {
        this.supported_tools = supported_tools;
        const homedir = os.homedir();
        this.working_directory = path_lib.join(homedir, '.teroshdl', 'build');
    }

    public abstract run(prj: t_project_definition, test_list: t_test_declaration[],
        working_directory: string, callback: (result: t_test_result[]) => void,
        callback_stream: (stream_c: any) => void): void;

    // public abstract stop(): void;
    public abstract get_test_list(prj: t_project_definition):
        t_test_declaration[] | Promise<t_test_declaration[]>;

    public get_supported_tools(): e_tools_general_select_tool[] {
        return this.supported_tools;
    }

    public set_working_directory(working_directory: string) {
        this.working_directory = working_directory;
    }

    public save_config_summary(path_f: string, test_result_list: t_test_result[]) {
        try {
            file_utils.save_file_sync(path_f, JSON.stringify(test_result_list, null, 4));
            // eslint-disable-next-line no-empty
        } catch (error) { }
    }

    // public clean_working_directory() {

    // }
}