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

import * as utils from '../../src/project_manager/utils/json2yaml';

describe('utils: json2yaml', () => {
    it('should return a string', () => {
        const json = {
            "a": "test_a",
            "b": ["test_b1", "test_b2"],
            "d": true,
            "e": 80,
            "f": {
                "f1": "test_f1",
                "f2": ["test_f21", "test_f22"],
                "f3": {
                    "f31": "test_f31",
                    "f32": ["test_f32", "test_f33"],
                    "f33": 76,
                    "f34": true,
                    "f35": null,
                    "f36": {
                        "f361": "test_f361",
                        "f362": ["test_f362", "test_f363"],
                        "f363": 76,
                        "f364": true,
                        "f365": null,
                        "f37": {
                            "f371": "test_f361",
                            "f372": ["test_f362", "test_f363"],
                            "f373": 76,
                            "f374": true,
                            "f375": null,
                        }
                    }
                }
            },
            "g": [],
            "h": "%sample+"
        };
        const result_0 = utils.convert_to_yaml(json);
        const result_1 = utils.convert_to_yaml(JSON.stringify(json));

        // eslint-disable-next-line max-len
        const expected = 'a: test_a\nb: \n  - test_b1\n  - test_b2\nd: true\ne: 80\nf: \n  f1: test_f1\n  f2: \n    - test_f21\n    - test_f22\n  f3: \n    f31: test_f31\n    f32: \n      - test_f32\n      - test_f33\n    f33: 76\n    f34: true\n    f35: null\n    f36: \n      f361: test_f361\n      f362: \n        - test_f362\n        - test_f363\n      f363: 76\n      f364: true\n      f365: null\n      f37: \n        f371: test_f361\n        f372: \n          - test_f362\n          - test_f363\n        f373: 76\n        f374: true\n        f375: null\ng: \n  []\nh: "%sample+"';

        expect(result_0).toMatch(expected);
        expect(result_1).toMatch(expected);
    });
});