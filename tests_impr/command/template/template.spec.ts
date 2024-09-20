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


import { expect, test } from '@oclif/test';
import * as path_lib from 'path';
import * as test_utils from '../../common_utils';
import * as file_utils from '../../../src/utils/file_utils';

const C_OUTPUT_BASE_PATH = path_lib.join(__dirname, 'out');
test_utils.setup_folder(C_OUTPUT_BASE_PATH);

const C_EXPECTED_BASE_PATH = path_lib.join(__dirname, 'expected');
const C_VHDL_SAMPLE = path_lib.join(__dirname, 'helpers', 'sample_0.vhd');

type t_config = {
    input: string;
    output: string;
    mode: string;
    indent: string;
    clock: string;
    instance: string;

};

function get_command(config: t_config) {
    const cmd = [
        'teroshdl:template',
        '--input', config.input,
        '--output', config.output,
        '--mode', config.mode,
        '--indent', config.indent,
        '--clock', config.clock,
        '--instance', config.instance,
    ];
    return cmd;
}

describe.skip('teroshdl:template', () => {
    const expected_path = path_lib.join(C_EXPECTED_BASE_PATH, 'expected_0.vhd');
    const current_path = path_lib.join(C_OUTPUT_BASE_PATH, 'sample_0.vhd');

    const config: t_config = {
        input: C_VHDL_SAMPLE,
        output: current_path,
        mode: 'testbench',
        indent: '    ',
        clock: 'inline',
        instance: 'separate'
    };

    test
        .stdout()
        .command(get_command(config))
        .it('Check template', _ctx => {
            jest.setTimeout(5000);
            const content_expected = file_utils.read_file_sync(expected_path);
            const content_current = file_utils.read_file_sync(current_path);
            expect(content_current).to.equal(content_expected);
        });
});