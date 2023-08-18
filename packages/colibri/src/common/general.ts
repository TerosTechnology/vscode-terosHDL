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

/** HDL language */
export enum HDL_LANG {
    VHDL = "vhdl",
    VERILOG = "verilog",
    SYSTEMVERILOG = "systemverilog",
    CPP = "cpp",
    NONE = "none"
}

/** Language */
export enum LANG {
    VHDL = "vhdl",
    VERILOG = "verilog",
    SYSTEMVERILOG = "systemverilog",
    CPP = "cpp",
    PYTHON = "python"
}

/** HDL extensions */
export const HDL_EXTENSIONS = {
    VHDL: ['.vhd', '.vho', '.vhdl'],
    VERILOG: ['.v', '.vh', '.vl'],
    SYSTEMVERILOG: ['.sv', '.svh']
};

/** Other extensions */
export const OTHER_EXTENSIONS = {
    CPP: ['.cpp', '.cc', '.cp', '.CPP'],
};