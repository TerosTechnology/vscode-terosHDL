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

import {
    t_stage_script, t_file, t_file_reduced, t_script, t_parameter,
    e_script_stage, t_action_result, t_watcher
} from "../common";

export abstract class Manager
    <A extends t_watcher | t_file_reduced | t_script | string | t_parameter, B extends undefined | e_script_stage,
        C extends t_watcher | t_file_reduced | t_script | string | t_parameter,
        D extends undefined | e_script_stage | string | t_file[]
    > {

    public abstract add(element_0: A, element_1: B): t_action_result;
    public abstract delete(element_0: C, element_1: D): t_action_result;
    public abstract get(reference_path?: string): t_watcher[] | t_stage_script | t_parameter[] | string[] | t_file[];
    public abstract clear(): void;
}