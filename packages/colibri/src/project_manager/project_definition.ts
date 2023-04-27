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

import { File_manager } from "./list_manager/file";
import { Hook_manager } from "./list_manager/hook";
import { Parameter_manager } from "./list_manager/parameter";
import { Toplevel_path_manager } from "./list_manager/toplevel_path";
import { Config_manager } from "../config/config_manager";
import { Watcher_manager } from "./list_manager/watcher";

export type t_project_definition = {
    name: string;
    file_manager: File_manager,
    hook_manager: Hook_manager,
    parameter_manager: Parameter_manager,
    toplevel_path_manager: Toplevel_path_manager,
    watcher_manager: Watcher_manager
    config_manager: Config_manager
}