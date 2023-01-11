/* eslint-disable @typescript-eslint/class-name-casing */
// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of teroshdl
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
// along with teroshdl. If not, see <https://www.gnu.org/licenses/>.
import * as teroshdl2 from "teroshdl2";

export class Run_output_manager{
    private result_list : teroshdl2.project_manager.tool_common.t_test_result[] = [];
    private artifact_list : teroshdl2.project_manager.tool_common.e_artifact_type[] = [];

    public set_results(result_list : teroshdl2.project_manager.tool_common.t_test_result[]){
        this.result_list = result_list;
    }

    public get_results() : teroshdl2.project_manager.tool_common.t_test_result[] {
        return this.result_list;
    }

    public set_artifacts(artifact_list : teroshdl2.project_manager.tool_common.e_artifact_type[]){
        this.artifact_list = artifact_list;
    }

    public get_artifacts() : teroshdl2.project_manager.tool_common.e_artifact_type[]{
        return this.artifact_list;
    }

    public clear(){
        this.result_list = [];
        this.artifact_list = [];
    }
}