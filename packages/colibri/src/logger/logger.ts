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
import * as file_utils from '../utils/file_utils';

export enum LOG_MODE {
    FILE = "file",
    STDOUT = "stout",
    SILENT = "silent"
}

export enum T_SEVERITY {
    ERROR = 2,
    WARNING = 1,
    INFO = 0
}

export class Logger {
    static mode = LOG_MODE.STDOUT;
    static severity = T_SEVERITY.INFO;
    static output_path = "";

    static log(msg: string, severity = T_SEVERITY.INFO) {
        if (this.is_print(severity) === false) {
            return;
        }
        const msg_comlete = `[colibri2][${this.get_severty_name(severity)}]: ${msg}`;
        if (this.mode === LOG_MODE.STDOUT) {
            // eslint-disable-next-line no-console
            console.log(msg_comlete);
        }
        else if (this.mode === LOG_MODE.FILE) {
            file_utils.save_file_sync(this.output_path, msg_comlete, true);
            return;
        }
    }

    static get_severty_name(severity: T_SEVERITY) {
        if (severity === T_SEVERITY.ERROR) {
            return "error";
        }
        else if (severity === T_SEVERITY.WARNING) {
            return "warning";
        }
        else {
            return "info";
        }
    }

    static is_print(severity: T_SEVERITY) {
        if (severity >= this.severity) {
            return true;
        }
        return false;
    }

    static set_output_path(path: string) {
        file_utils.remove_file(path);
        this.output_path = path;
    }

    static set_mode(mode: LOG_MODE) {
        this.mode = mode;
    }

    static set_severity(severity: T_SEVERITY) {
        this.severity = severity;
    }
}