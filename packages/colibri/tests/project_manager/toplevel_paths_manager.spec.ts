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

import { Toplevel_path_manager } from '../../src/project_manager/list_manager/toplevel_path';

describe('list_manager: parameters', () => {
    let toplevel_path_manager: Toplevel_path_manager;

    beforeEach(() => {
        toplevel_path_manager = new Toplevel_path_manager();
    });

    it('adding a toplevelpath and clearing', () => {
        const toplevel_path_0 = 'toplevel0';
        const toplevel_path_1 = 'toplevel1';

        const result_0 = toplevel_path_manager.add(toplevel_path_0);
        expect(result_0.successful).toBe(true);

        const result_1 = toplevel_path_manager.add(toplevel_path_1);
        expect(result_1.successful).toBe(true);


        const result_2 = toplevel_path_manager.add(toplevel_path_1);
        expect(result_2.successful).toBe(false);

        const result_3 = toplevel_path_manager.add("");
        expect(result_3.successful).toBe(false);

        expect(toplevel_path_manager.get()[0]).toEqual(toplevel_path_0);
        expect(toplevel_path_manager.get()[1]).toEqual(toplevel_path_1);

        toplevel_path_manager.clear();

        expect(toplevel_path_manager.get().length).toBe(0);
    });

    it('deleting a toplevelpath', () => {
        const toplevel_path_0 = 'toplevel0';
        const toplevel_path_1 = 'toplevel1';

        toplevel_path_manager.add(toplevel_path_0);
        toplevel_path_manager.add(toplevel_path_1);

        expect(toplevel_path_manager.get().length).toBe(2);

        // Delete 1
        const result_0 = toplevel_path_manager.delete(toplevel_path_1);
        expect(result_0.successful).toBe(true);
        expect(toplevel_path_manager.get()[0]).toEqual(toplevel_path_0);

        // Delete 1 again, fail
        const result_1 = toplevel_path_manager.delete(toplevel_path_1);
        expect(result_1.successful).toBe(false);
        expect(toplevel_path_manager.get()[0]).toEqual(toplevel_path_0);

        // Delete 0
        const result_2 = toplevel_path_manager.delete(toplevel_path_0);
        expect(result_2.successful).toBe(true);
        expect(toplevel_path_manager.get().length).toBe(0);
    });

});