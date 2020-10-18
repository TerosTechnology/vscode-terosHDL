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


export function line_index_to_character_index(line_number: number, character_number: number, txt: string): number {
    let txt_split = txt.split('\n');
    let character_index: number = 0;
    for (let i = 0; i < line_number; ++i) {
        character_index += txt_split[i].length + 1;
    }
    character_index += character_number;
    return character_index;
}


export function replace_range(s: string, start: number, end: number, substitute: string): string {
    let sub_string_0: string = s.substring(0, start);
    let sub_string_1: string = s.substring(end, s.length);
    return s.substring(0, start) + substitute + s.substring(end);
}