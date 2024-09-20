// Copyright 2022
// Carlos Alberto Ruiz Naranjo[carlosruiznaranjo@gmail.com]

// This file is part of colibri2

// Colibri is free software: you can redistribute it and / or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

// Colibri is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with colibri2.If not, see < https://www.gnu.org/licenses/>.

import { expect, test } from '@oclif/test';
import * as path_lib from 'path';
import * as test_utils from '../../common_utils';
import * as file_utils from '../../../src/utils/file_utils';
import * as cfg from '../../../src/config/config_declaration';

const C_OUTPUT_BASE_PATH = path_lib.join(__dirname, 'out');
test_utils.setup_folder(C_OUTPUT_BASE_PATH);

const C_EXPECTED_BASE_PATH = path_lib.join(__dirname, 'expected');
const C_INPUT_BASE = path_lib.join(__dirname, 'helpers');

type t_config = {
    input: string;
    html: string;
    html_detailed: string;
    junit: string;
    json_format: string;
    compact: string;
    linter: string;
    linter_arguments: string;
    linter_path: string;
};

function get_command(config: t_config) {
    const cmd = [
        'teroshdl:linter',
        '--input', config.input,
        '--html', config.html,
        '--html-detailed', config.html_detailed,
        '--junit', config.junit,
        '--json-format', config.json_format,
        '--compact', config.compact,
        '--linter', config.linter,
        '--linter-arguments', config.linter_arguments,
        '--linter-path', config.linter_path
    ];
    return cmd;
}

describe('teroshdl:linter', () => {
    const expected_path = path_lib.join(C_EXPECTED_BASE_PATH, 'report_detailed.html');
    const current_path_html = path_lib.join(C_OUTPUT_BASE_PATH, 'report.html');
    const current_path_html_detailed = path_lib.join(C_OUTPUT_BASE_PATH, 'report_detailed.html');
    const current_path_junit = path_lib.join(C_OUTPUT_BASE_PATH, 'report.xml');
    const current_path_json = path_lib.join(C_OUTPUT_BASE_PATH, 'report.json');
    const current_path_compact = path_lib.join(C_OUTPUT_BASE_PATH, 'report.txt');

    const config: t_config = {
        input: path_lib.join(C_INPUT_BASE, "*.vhd"),
        html: current_path_html,
        html_detailed: current_path_html_detailed,
        junit: current_path_junit,
        json_format: current_path_json,
        compact: current_path_compact,
        linter: cfg.e_linter_general_linter_vhdl.ghdl,
        linter_arguments: '',
        linter_path: ''
    };

    test
        .stdout()
        .skip()
        .command(get_command(config))
        .it('Check linter', _ctx => {
            const content_expected = file_utils.read_file_sync(expected_path);
            const content_current = file_utils.read_file_sync(current_path_html_detailed);
            expect(content_current).to.equal(content_expected);
        });
});