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

import { Process } from "../../src/process/process";
import { create_temp_file } from "../../src/process/utils";
import * as common from "../../src/process/common";
import { deepEqual, equal } from "assert";

describe('Test local process', function () {

    it(`Check exec successful`, async function () {
        const process_i = new Process();
        const command = 'echo "hello world!"';
        const result = <common.p_result>await process_i.exec_wait(command);


        const expected_result: common.p_result = {
            command: command,
            stdout: 'hello world!',
            stderr: '',
            return_value: 0,
            successful: true
        };
        const os = process.platform;
        if (os === 'win32') {
            expected_result.stdout = "\"hello world!\"";
        }
        deepEqual(result, expected_result);
    });

    it(`Check exec not successful`, async function () {
        const process_i = new Process();
        const command = 'asdf';
        const result = <common.p_result>await process_i.exec_wait(command);


        const expected_result: common.p_result = {
            command: command,
            stdout: '',
            stderr: '/bin/sh: 1: asdf: not found',
            return_value: -1,
            successful: false
        };
        const os = process.platform;
        if (os === 'darwin' || os === 'win32') {
            expected_result.stderr = '';
            result.stderr = '';
        }
        deepEqual(result, expected_result);
    });
});

describe('Test utils', function () {
    it(`Check create temporal file`, async function () {
        const expected_text = "sample of text";
        const tmp_file_path = await create_temp_file(expected_text);

        const fs = require('fs');
        const current_text = fs.readFileSync(tmp_file_path);

        equal(current_text, expected_text);
    });
});