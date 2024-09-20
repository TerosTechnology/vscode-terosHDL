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

import { t_parameter, e_parameter_data_type, e_parameter_type } from '../../src/colibri/project_manager/common';
import {Parameter_manager} from '../../src/colibri/project_manager/list_manager/parameter';

describe('list_manager: parameters', () => {
    let parameters_manager: Parameter_manager;

    beforeEach(() => {
        parameters_manager = new Parameter_manager();
    });
    
    it('adding a parameter and clearing', () => {
        const parameter_0 : t_parameter = {
            datatype: e_parameter_data_type.FILE,
            default: 'asdf',
            description: 'ff',
            paramtype: e_parameter_type.CMDLINEARG
        };

        const parameter_1 : t_parameter = {
            datatype: e_parameter_data_type.STR,
            default: 'aa',
            description: 'asff',
            paramtype: e_parameter_type.GENERIC
        };

        const result_0 = parameters_manager.add(parameter_0);
        expect(result_0.successful).toBe(true);
        
        const result_1 = parameters_manager.add(parameter_1);
        expect(result_1.successful).toBe(true);

        const result_2 = parameters_manager.add(parameter_1);
        expect(result_2.successful).toBe(false);
        
        expect(parameters_manager.get()[0]).toEqual(expect.objectContaining(parameter_0));
        expect(parameters_manager.get()[1]).toEqual(expect.objectContaining(parameter_1));

        parameters_manager.clear();

        expect(parameters_manager.get().length).toBe(0);
    });

    it('deleting a parameter', () => {
        const parameter_0 : t_parameter = {
            datatype: e_parameter_data_type.FILE,
            default: 'asdf',
            description: 'ff',
            paramtype: e_parameter_type.CMDLINEARG
        };

        const parameter_1 : t_parameter = {
            datatype: e_parameter_data_type.STR,
            default: 'aa',
            description: 'asff',
            paramtype: e_parameter_type.GENERIC
        };

        // Add 0
        const result_0 = parameters_manager.add(parameter_0);
        expect(result_0.successful).toBe(true);
        
        // Add 1
        const result_1 = parameters_manager.add(parameter_1);
        expect(result_1.successful).toBe(true);

        // Check size is 2
        expect(parameters_manager.get().length).toBe(2);

        // Delete 1
        const result_2 = parameters_manager.delete(parameter_1);
        expect(result_2.successful).toBe(true);
        expect(parameters_manager.get()[0]).toEqual(expect.objectContaining(parameter_0));

        // Delete 1 again, fail
        const result_3 = parameters_manager.delete(parameter_1);
        expect(result_3.successful).toBe(false);
        expect(parameters_manager.get()[0]).toEqual(expect.objectContaining(parameter_0));

        // Delete 0
        const result_4 = parameters_manager.delete(parameter_0);
        expect(result_4.successful).toBe(true);
        expect(parameters_manager.get().length).toBe(0);
    });

});