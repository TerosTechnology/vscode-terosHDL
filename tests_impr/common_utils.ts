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
import * as file_utils from '../../back_colibri/src/utils/file_utils';

export function normalize_breakline_windows(txt: string): string {
    if (process.platform === 'win32') {
        return txt.replace(/\n/g, '').replace(/\r/g, '');
    }
    else {
        return txt;
    }
}
/**
 * Delete and create the directory
 * @param  {string} path_dir Path directory
 */
export function setup_folder(path_dir: string) {
    file_utils.remove_directory(path_dir);
    file_utils.create_directory(path_dir);
}

