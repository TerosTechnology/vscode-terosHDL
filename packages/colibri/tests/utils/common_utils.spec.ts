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
import * as common_utils from '../../src/utils/common_utils';
import * as general from '../../src/common/general';

describe('Common Utils', () => {
    it('makeid', () => {
        expect(common_utils.makeid(5)).toMatch(/[A-Za-z0-9]{5}/);
    });

    it('get_home_directory', () => {
        expect(common_utils.get_home_directory()).toMatch(/\/home\/[a-z]+/);
    });

    it('get_hdl_language', () => {
        expect(common_utils.get_hdl_language('file.v')).toBe(general.HDL_LANG.VERILOG);
        expect(common_utils.get_hdl_language('file.sv')).toBe(general.HDL_LANG.SYSTEMVERILOG);
        expect(common_utils.get_hdl_language('file.vhd')).toBe(general.HDL_LANG.VHDL);
        expect(common_utils.get_hdl_language('file.vhdl')).toBe(general.HDL_LANG.VHDL);
        expect(common_utils.get_hdl_language('file.VHDL')).toBe(general.HDL_LANG.VHDL);
        expect(common_utils.get_hdl_language('file.txt')).toBe(general.HDL_LANG.NONE);
    });
});



