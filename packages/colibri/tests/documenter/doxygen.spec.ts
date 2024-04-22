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

import { equal } from "assert";
import { parse_doxygen } from "../../src/documenter/doxygen_parser";

const test_vector = `
En un lugar de la mancha 
de cuyo nombre no quiero acordarme

no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero,
@title El ingenioso hidalgo don Quijote de la Mancha
@author Miguel de Cervantes Saavedra
no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero,
adarga antigua, rocín flaco y galgo corredor.
`;

describe('Test Doxygen.', function () {
    it("Testing all", function () {
        const result = parse_doxygen(test_vector);
        equal(result.element_list[0].description.trim(), 'El ingenioso hidalgo don Quijote de la Mancha');
        equal(result.element_list[0].field, 'title');

        equal(result.element_list[1].description.trim(), 'Miguel de Cervantes Saavedra');
        equal(result.element_list[1].field, 'author');
    });
});