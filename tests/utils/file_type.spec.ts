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

import {LANGUAGE, VERILOG_LANG_VERSION, VHDL_LANG_VERSION} from '../../src/colibri/common/general';
import {get_file_type} from '../../src/colibri/project_manager/utils/utils';
import * as file_utils from '../../src/colibri/utils/file_utils';

describe("file type", () => {

    it('get language from filepath', () => {
        expect(file_utils.get_language_from_filepath('file.v')).toBe(LANGUAGE.VERILOG);
        expect(file_utils.get_language_from_filepath('file.sv')).toBe(LANGUAGE.SYSTEMVERILOG);
        expect(file_utils.get_language_from_filepath('file.vhd')).toBe(LANGUAGE.VHDL);
        expect(file_utils.get_language_from_filepath('file.vhdl')).toBe(LANGUAGE.VHDL);
        expect(file_utils.get_language_from_filepath('file.VHDL')).toBe(LANGUAGE.VHDL);
        expect(file_utils.get_language_from_filepath('file.txt')).toBe(LANGUAGE.NONE);
        expect(file_utils.get_language_from_filepath('file.py')).toBe(LANGUAGE.PYTHON);
    });

    it('get_default_version_for_language', () => {
        expect(file_utils.get_default_version_for_language(LANGUAGE.VHDL)).toBe(VHDL_LANG_VERSION.v2008);
        expect(file_utils.get_default_version_for_language(LANGUAGE.VERILOG)).toBe(VERILOG_LANG_VERSION.v2000);
        expect(file_utils.get_default_version_for_language(LANGUAGE.SYSTEMVERILOG)).toBe(undefined);
        expect(file_utils.get_default_version_for_language(LANGUAGE.PYTHON)).toBe(undefined);
    });

    it('get file type', () => {
        expect(get_file_type('file.vhd')).toBe("vhdlSource-2008");
        expect(get_file_type('file.py')).toBe("python");
    });
});