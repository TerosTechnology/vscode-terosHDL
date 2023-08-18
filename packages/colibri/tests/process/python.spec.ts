// Copyright 2023
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

import * as python from "../../src/process/python";
import * as path_lib from "path";
import * as utils  from "../../src/process/utils";
import { OS } from "../../src/process/common";

describe("Python", () => {
    it(`normalize_python_script`, () => {
        const script = "/my/path/test.py";
        const result = python.normalize_python_script(script);
        expect(result).toBe(`"${script}"`);
    });

    it(`get_python_path simulate windows`, async () => {
        const spy = jest.spyOn(utils, "get_os");

        spy.mockReturnValue(OS.WINDOWS);

        const opt = { path: "" };
        const result = await python.get_python_path(opt);
        expect(result).toBeTruthy();
        expect(result.python_path).toContain("python");
    });

    it(`get_python_path simulate linux`, async () => {
        const spy = jest.spyOn(utils, "get_os");

        spy.mockReturnValue(OS.LINUX);

        const opt = { path: "" };
        const result = await python.get_python_path(opt);
        expect(result).toBeTruthy();
        expect(result.python_path).toContain("python");
    });

    it(`get_python_path`, async () => {
        const opt = { path: "" };
        const result = await python.get_python_path(opt);

        // Check false pkg
        let pkg_list = ["time", "asdf"];
        let result_check_pkg = await python.check_python_package_list(result.python_path, pkg_list);

        expect(result_check_pkg).not.toBeTruthy();

        // Check true pkg
        pkg_list = ["time", "os"];
        result_check_pkg = await python.check_python_package_list(result.python_path, pkg_list);

        expect(result_check_pkg).toBeTruthy();

    });

    it(`exec_python_script`, async () => {
        const opt = { path: "" };
        const result = await python.get_python_path(opt);

        const script = path_lib.join(__dirname, "helpers", "my_ok.py");
        const result_script = await python.exec_python_script(result.python_path, script, "", "");

        expect(result_script.successful).toBeTruthy();
        expect(result_script.stdout).toBe("hello\nworld");

    });

    it(`exec_python_script_async`, async () => {

        function callback_stream(_result: any) {
            // expect(result.stdout).toBe("hello\nworld");
        }

        async function execute_python_script(python_path: string, python_script: string) : Promise<any>{
            return new Promise((resolve, _reject) => {
                python.exec_python_script_async(python_path, python_script, "", "", "", (result) => {
                    resolve(result);
                }, (result) => {
                    callback_stream(result);
                });
            });
        }

        const opt = { path: "" };
        const result = await python.get_python_path(opt);

        const script = path_lib.join(__dirname, "helpers", "my_ok.py");

        const result_script = await execute_python_script(result.python_path, script);
        expect(result_script.successful).toBeTruthy();
        expect(result_script.stdout).toBe("hello\nworld");
    });
});
