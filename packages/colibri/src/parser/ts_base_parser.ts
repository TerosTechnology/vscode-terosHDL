// Copyright 2022 
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com ]
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

export class Ts_base_parser {
    comment_symbol = "";

    protected get_comment(comment: string, multiline_delete = true) {
        let break_line = '\n';
        if (multiline_delete === true) {
            break_line = '';
        }

        if (comment === undefined) {
            return '';
        }
        const txt_comment = comment.slice(2);
        if (this.comment_symbol === '') {
            return txt_comment + break_line;
        }
        else if (txt_comment[0] === this.comment_symbol) {
            return txt_comment.slice(1) + break_line;
        }
        return '';
    }

}