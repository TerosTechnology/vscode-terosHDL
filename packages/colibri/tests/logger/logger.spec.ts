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

import * as path_lib from "path";
import { Logger, LOG_MODE, T_SEVERITY } from "../../src/logger/logger";
import {remove_file, read_file_sync} from "../../src/utils/file_utils";

const output_path = path_lib.join(__dirname, "test.log");
remove_file(output_path);

describe("Logger", () => {
    it("should log to stdout info", () => {
        Logger.set_severity(T_SEVERITY.INFO);

        Logger.set_mode(LOG_MODE.STDOUT);

        const spy = jest.spyOn(console, "log");
        Logger.log("test");
        expect(spy).toHaveBeenCalledWith("[colibri2][info]: test");
        spy.mockRestore();
    });

    it("should log to stdout warning", () => {
        Logger.set_severity(T_SEVERITY.WARNING);

        const spy = jest.spyOn(console, "log");
        Logger.log("test", T_SEVERITY.WARNING);
        expect(spy).toHaveBeenCalledWith("[colibri2][warning]: test");
        spy.mockRestore();
    });

    it("should not log due to the severity", () => {
        Logger.set_severity(T_SEVERITY.WARNING);

        const spy = jest.spyOn(console, "log");
        Logger.log("test", T_SEVERITY.INFO);
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });

    it("should log to file", () => {
        const spy = jest.spyOn(console, "log");

        Logger.set_severity(T_SEVERITY.INFO);

        Logger.set_mode(LOG_MODE.FILE);

        Logger.set_output_path(output_path);
        Logger.log("test file 0", T_SEVERITY.ERROR);
        Logger.log("test file 1", T_SEVERITY.WARNING);
        expect(spy).not.toHaveBeenCalled();

        const result = read_file_sync(output_path);

        expect(result).toBe("[colibri2][error]: test file 0\n[colibri2][warning]: test file 1\n");

        spy.mockRestore();
    });
});