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

import * as python from "../../src/process/python";
import { equal } from "assert";
import { get_os } from "../../src/process/utils";
import * as common from "../../src/process/common";

function check_python_system_path(current_path: string) {
    const os = process.platform;
    let expected_list: string[] = [];
    if (os === 'darwin') {
        expected_list = ['/usr/local/bin/python3'];
    }
    else if (os === 'win32') {
        expected_list = ["C:\\hostedtoolcache\\windows\\Python\\3.9.13\\x64\\python.exe",
            "C:\\hostedtoolcache\\windows\\Python\\3.9.13\\x64\\python3.exe"];
    }
    else {
        expected_list = ['/usr/bin/python', '/usr/bin/python3'];
    }

    if (expected_list.includes(current_path) === false) {
        equal(current_path, expected_list[0]);
    }
}

describe('Test Python utils', function () {

    it(`Check get_python3_path in system path`, async function () {
        const opt: python.python_options = {
            path: ""
        };
        const result = await python.get_python_path(opt);
        check_python_system_path(result.python_path);
        equal(result.successful, true);
    });

    it(`Check get_python3_path in custom path`, async function () {
        jest.setTimeout(5000);
        const opt: python.python_options = {
            path: "/usr/bin/python3"
        };
        const system_os = get_os();
        if (system_os === common.OS.MAC) {
            opt.path = "/usr/local/opt/python@3.9/bin/python3.9";
        }
        else if (system_os === common.OS.WINDOWS) {
            opt.path = "C:\\hostedtoolcache\\windows\\Python\\3.9.13\\x64\\python3.exe";
        }
        const result = await python.get_python_path(opt);
        check_python_system_path(result.python_path);
        equal(result.successful, true);
    });

    it(`Check get_python3_path in a bad custom path `, async function () {
        const opt: python.python_options = {
            path: "/usr/bin/python999"
        };
        const result = await python.get_python_path(opt);
        check_python_system_path(result.python_path);
        equal(result.successful, true);
    });

    // it(`Check python3 package and true`, async function () {
    //     const package_name = 'time';
    //     const opt: python.python_options = {
    //         path: "/usr/bin/python"
    //     };
    //     const result_path = await python.get_python_path(opt);
    //     const result = await python.check_python_package(result_path.python_path, package_name);
    //     equal(result, true);
    // });

    // it(`Check python3 package and false`, async function () {
    //     const package_name = 'time1234';
    //     const opt: python.python_options = {
    //         path: "/usr/bin/python"
    //     };
    //     const result_path = await python.get_python_path(opt);
    //     const result = await python.check_python_package(result_path.python_path, package_name);
    //     equal(result, false);
    // });

    it(`Check python3 package list and true`, async function () {
        const package_name = ['time', 'os'];
        const opt: python.python_options = {
            path: "/usr/bin/python"
        };
        const result_path = await python.get_python_path(opt);
        const result = await python.check_python_package_list(result_path.python_path, package_name);
        equal(result, true);
    });

    it(`Check python3 package list and false`, async function () {
        const package_name = ['time', 'os123'];
        const opt: python.python_options = {
            path: "/usr/bin/python"
        };
        const result_path = await python.get_python_path(opt);
        const result = await python.check_python_package_list(result_path.python_path, package_name);
        equal(result, false);
    });

});