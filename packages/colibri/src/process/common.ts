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

/** Proccess type */
export enum TYPE_PROCESS {
    REMOTE = "remote",
    LOCAL = "local"
}

/** Remote process configuration */
export type p_remote_configuration = {
    host: string;
    user: string;
    pass: string;
}

/** Result of process execution */
export type p_result = {
    command: string;
    stdout: string;
    stderr: string;
    return_value: number;
    successful: boolean;
}

/** Proccess options */
export type p_options = {
    cwd: string;
}

/** Operative system name */
export enum OS {
    LINUX = "linux",
    WINDOWS = "win32",
    MAC = "darwin"
}

/** OS sentence */
export enum e_sentence {
    EXPORT = "export",
    MORE = "more",
    SWITCH = "switch",
    FOLDER_SEP = "folder_sep",
}