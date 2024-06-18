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

export enum LOG_MODE {
    FILE = "file",
    STDOUT = "stout",
    SILENT = "silent"
}

export enum T_SEVERITY {
    ERROR = 3,
    WARNING = 2,
    INFO = 1,
    DEBUG = 0,
}

export abstract class LoggerBase {
    abstract error(msg: string): void;
    abstract warn(msg: string): void;
    abstract log(msg: string): void;
    abstract debug(msg: string): void;
    abstract trace(msg: string): void;
}

class LoggerConsole extends LoggerBase {
    private severity = T_SEVERITY.DEBUG;

    error(msg: string) {
        this._log(msg, T_SEVERITY.ERROR);
    }

    warn(msg: string) {
        this._log(msg, T_SEVERITY.WARNING);
    }

    log(msg: string) {
        this._log(msg, T_SEVERITY.INFO);
    }

    debug(msg: string) {
        this._log(msg, T_SEVERITY.DEBUG);
    }

    trace(msg: string) {
        this._log(msg, T_SEVERITY.DEBUG);
    }

    private is_print(severity: T_SEVERITY) {
        if (severity >= this.severity) {
            return true;
        }
        return false;
    }

    private getSevertyName(severity: T_SEVERITY) {
        if (severity === T_SEVERITY.INFO) {
            return "info";
        }
        else if (severity === T_SEVERITY.WARNING) {
            return "warning";
        }
        else if (severity === T_SEVERITY.ERROR) {
            return "error";
        }
        else {
            return "debug";
        }
    }

    private  _log(msg: string, severity = T_SEVERITY.INFO) {
        if (this.is_print(severity) === false) {
            return;
        }
        const msg_comlete = `[colibri2][${this.getSevertyName(severity)}]: ${msg}`;
        // eslint-disable-next-line no-console
        console.log(msg_comlete);
    }
}

export class Logger {
    static logger: LoggerBase = new LoggerConsole();

    static log(msg: string) {
        this.logger.log(msg);
    }

    static setLogger(logger: LoggerBase) {
        this.logger = logger;
    }
}