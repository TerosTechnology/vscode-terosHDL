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

import { PACKAGE_MAP, Pyodide} from '../../src/process/pyodide';

const pyodide = new Pyodide();

describe('Pyodide', () => {
    jest.setTimeout(1000000);

    it('should be able to import Python modules and run code', async () => {
        const package_list = Object.values(PACKAGE_MAP);

        const result = await pyodide.exec_python_code('2+2', package_list);

        expect(result.successful).toBe(true);
        expect(result.return_value).toBe(4);
    });

    it('should be able to run code with arguments', async () => {
        const locals = {
            a: 7,
            b: 3,
        };

        const code = `
def add(a, b):
    return a + b
add(a, b)
`;
        const result = await pyodide.exec_python_code(code, [], locals);

        expect(result.successful).toBe(true);
        expect(result.return_value).toBe(locals.a + locals.b);
    });

    it('should be error to import Python bad modules', async () => {
        const result = await pyodide.exec_python_code('2+2', ["asdfasdfasd"]);
        expect(result.successful).toBe(false);
    });

    it('should be error to run Python code', async () => {
        const result = await pyodide.exec_python_code('asdfasdfasd', []);
        expect(result.successful).toBe(false);
    });

});


