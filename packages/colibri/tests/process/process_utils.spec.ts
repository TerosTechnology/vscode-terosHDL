// Copyright 2023 
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

import * as utils from "../../src/process/utils";
import { OS, e_sentence } from "../../src/process/common";
import * as os from "os";
import * as path_lib from "path";

const platform_declaration = [
    {
        platform: 'linux',
        os: OS.LINUX,
        export: 'export',
        more: ';',
        folder_sep: '/',
        switch: '',
    },
    {
        platform: 'win32',
        os: OS.WINDOWS,
        export: 'set',
        more: '&&',
        folder_sep: '\\',
        switch: '/D',
    },
    {
        platform: 'darwin',
        os: OS.MAC,
        export: 'export',
        more: ';',
        folder_sep: '/',
        switch: '',
    },
];

describe("Process utils", () => {
    let originalPlatformValue: string;

    beforeEach(() => {
        originalPlatformValue = process.platform;
    });

    afterEach(() => {
        Object.defineProperty(process, 'platform', {
            value: originalPlatformValue,
        });
    });


    platform_declaration.forEach(p => {
        it(`Check ${p.platform} platform things`, () => {
            // Set platform
            Object.defineProperty(process, 'platform', {
                value: p.platform,
            });

            // Check os
            expect(utils.get_os()).toBe(p.os);

            // Check export
            expect(utils.get_sentence_os(e_sentence.EXPORT)).toBe(p.export);

            // Check more commands
            expect(utils.get_sentence_os(e_sentence.MORE)).toBe(p.more);

            // Check folder separator
            expect(utils.get_sentence_os(e_sentence.FOLDER_SEP)).toBe(p.folder_sep);

            // Check folder separator
            expect(utils.get_sentence_os(e_sentence.SWITCH)).toBe(p.switch);
        });
    });

    it("get_home_directory", () => {
        const expected = path_lib.join('home', 'quijote');

        const spy = jest.spyOn(os, 'homedir');
        spy.mockReturnValue(expected);

        const result = utils.get_home_directory();

        expect(result).toBe(expected);
        spy.mockRestore();
    });

    it("get_random_folder_in_home_directory", () => {
        const fake_homedir = path_lib.join('home', 'quijote');

        const spy = jest.spyOn(os, 'homedir');
        spy.mockReturnValue(fake_homedir);

        const result = utils.get_random_folder_in_home_directory();

        expect(true).toBe(result.startsWith(fake_homedir));
        spy.mockRestore();
    });    
});