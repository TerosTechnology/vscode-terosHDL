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
import * as console_printer from 'console-table-printer';
import * as cli_color from 'cli-color';

export function print_table(table_title: string, column_title: string[], column_color: string[], rows: string[][]) {
    if (column_title.length !== rows[0].length) {
        return;
    }
    const columns: any[] = [];
    column_title.forEach(function callback(title_inst, index) {
        columns.push(
            {
                name: title_inst,
                alignment: "left",
                color: column_color[index]
            },
        );
    });

    const p = new console_printer.Table({
        title: table_title,
        columns: columns,
    });

    const rows_pretty: any[] = [];
    rows.forEach(row_inst => {
        const element: any = {};
        for (let index = 0; index < column_title.length; index++) {
            element[column_title[index]] = row_inst[index];
        }
        rows_pretty.push(element);
    });
    p.addRows(rows_pretty);
    p.printTable();
}


export enum T_LOG_LEVEL {
    ERROR = 'error',
    WARN = 'warn',
    NOTICE = 'notice'
}

export function print_msg(msg: string, log_level: T_LOG_LEVEL) {
    let color = cli_color.blue;
    if (log_level === T_LOG_LEVEL.ERROR) {
        color = cli_color.red.bold;
    }
    else if (log_level === T_LOG_LEVEL.WARN) {
        color = cli_color.yellow;
    }
    // eslint-disable-next-line no-console
    console.log(color(msg));
}