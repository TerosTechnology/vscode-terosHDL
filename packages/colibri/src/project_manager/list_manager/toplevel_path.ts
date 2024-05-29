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

import { t_action_result } from "../common";
import { Manager } from "./manager";
import * as file_utils from "../../utils/file_utils";

/** Toplevel path(s) for the project. */
export class Toplevel_path_manager extends Manager<string, undefined, string, undefined>{

    /** Toplevel path list */
    private toplevel_paths: string[] = [];

    clear() {
        this.toplevel_paths = [];
    }


    get(reference_path?: string): string[] {
        if (reference_path !== undefined){
            const new_files =  [...this.toplevel_paths];
            for (let i = 0; i < new_files.length; i++) {
                new_files[i] = file_utils.get_relative_path(new_files[i], reference_path);
                // Replaces double back slash generated when running on Windows
                new_files[i] = new_files[i].replace(/\\/g, '/');
            }
            return new_files;
        }
        return this.toplevel_paths;  
    }


    add(toplevel_path: string): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (toplevel_path === "") {
            result.successful = false;
            result.msg = "Toplevel path empty";
            return result;
        }
        if (this.check_if_exists(toplevel_path)) {
            result.successful = false;
            result.msg = "Toplevel path is duplicated";
            return result;
        }
        this.toplevel_paths.push(toplevel_path);
        return result;
    }

    delete(toplevel_path: string): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(toplevel_path) === false) {
            result.successful = false;
            result.msg = "Toplevel path doesn't exist";
            return result;
        }

        const new_list = [];
        for (let i = 0; i < this.toplevel_paths.length; i++) {
            const element = this.toplevel_paths[i];
            if (element !== toplevel_path) {
                new_list.push(element);
            }
        }
        this.toplevel_paths = new_list;
        return result;
    }

    private check_if_exists(toplevel_path: string) {
        for (let i = 0; i < this.toplevel_paths.length; i++) {
            const element = this.toplevel_paths[i];
            if (toplevel_path === element) {
                return true;
            }
        }
        return false;
    }
}