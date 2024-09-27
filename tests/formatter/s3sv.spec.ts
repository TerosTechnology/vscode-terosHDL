// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import * as path_lib from 'path';
import { S3sv } from '../../src/colibri/formatter/s3sv';
import * as cfg from "../../src/colibri/config/config_declaration";
import { normalize_breakline_windows } from "../../src/colibri/utils/common_utils";
import { read_file_sync, save_file_sync,create_directory, remove_directory } from '../../src/colibri/utils/file_utils';

const C_OUTPUT_BASE_PATH = path_lib.join(__dirname, "out");
const C_EXPECTED_BASE_PATH = path_lib.join(__dirname, "helpers/expected");

function create_output() {
    remove_directory(C_OUTPUT_BASE_PATH);
    create_directory(C_OUTPUT_BASE_PATH, true);
    return C_OUTPUT_BASE_PATH;
}

describe('s3sv', () => {
    jest.setTimeout(1000000);

    beforeAll(() => {
        create_output();
    });

    it('format', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'sample.v');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_s3sv = {
            indentation_size: 4,
            use_tabs: false,
            one_bind_per_line: false,
            one_declaration_per_line: false
        };

        const formatter = new S3sv();
        const result = await formatter.format_from_code(code, config, "");

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'sample.v');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'sample.v'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });

});
