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

import * as path_lib from "path";
import { Process } from "../../src/process/process";

describe("Process", () => {

    ////////////////////////////////////////////////////////////////////////////
    // exec_wait
    ////////////////////////////////////////////////////////////////////////////
    it(`Local: exec_wait`, async () => {
        let cmd = "";
        if (process.platform === 'win32') {
            cmd = "ls";
        }else{
            cmd = "ls -l";
        }

        const p = new Process();
        const result = await p.exec_wait(cmd, undefined);
        expect(result.command).toBe(cmd);
        expect(result.return_value).toBe(0);
        expect(result.stderr).toBe("");
        if (process.platform === 'win32') {
            expect(result.stdout).toContain("Directory");
        }else{
            expect(result.stdout).toContain("total");
        }
        expect(result.successful).toBeTruthy();
    });

    it(`Local: exec_wait error`, async () => {
        const cmd = "asdf";

        const p = new Process();
        const result = await p.exec_wait(cmd);
        expect(result.command).toBe(cmd);
        expect(result.return_value).toBe(-1);
        if (process.platform !== 'win32') {
            expect(result.stderr).toBe("/bin/sh: 1: asdf: not found");
        }
        expect(result.stdout).toBe("");
        expect(result.successful).not.toBeTruthy();
    });

    it(`Local: exec_wait with cwd`, async () => {
        let cmd = "";
        if (process.platform === 'win32') {
            cmd = "ls";
        }else{
            cmd = "ls -l";
        }
        const p = new Process();
        const folder_test = path_lib.join(__dirname, "sample_folder");
        const result = await p.exec_wait(cmd, { cwd: folder_test });

        expect(result.command).toBe(cmd);
        expect(result.return_value).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toContain("hi");
        expect(result.successful).toBeTruthy();
    });

    it(`Local: success exec with timeout`, async () => {
        let cmd = "";
        if (process.platform === 'win32') {
            cmd = "ls";
        }else{
            cmd = "ls -l";
        }
        const p = new Process();
        const folder_test = path_lib.join(__dirname, "sample_folder");
        const result = await p.exec_wait(cmd, { cwd: folder_test, timeout: 3 });

        expect(result.command).toBe(cmd);
        expect(result.return_value).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toContain("hi");
        expect(result.successful).toBeTruthy();
    });

    it(`Local: failed exec with timeout`, async () => {
        const cmd = "sleep 2";

        const p = new Process();
        const result = await p.exec_wait(cmd, { cwd: __dirname, timeout: 0.1 });
        expect(result.command).toBe(cmd);
        expect(result.return_value).toBe(-1);
        expect(result.stderr).toBe("Timeout reached");
        expect(result.stdout).toBe("");
        expect(result.successful).not.toBeTruthy();
    });

    ////////////////////////////////////////////////////////////////////////////
    // exec
    ////////////////////////////////////////////////////////////////////////////
    it(`Local: exec`, () => {
        let cmd = "";
        if (process.platform === 'win32') {
            cmd = "dir";
        }else{
            cmd = "ls -l";
        }
        const p = new Process();
        p.exec(cmd, undefined, (result) => {
            expect(result.command).toBe(cmd);
            expect(result.return_value).toBe(0);
            expect(result.stderr).toBe("");
            if (process.platform === 'win32') {
                expect(result.stdout).toContain("Directory");
            }else{
                expect(result.stdout).toContain("total");
            }
            expect(result.successful).toBeTruthy();
        });
    });

    it(`Local: exec error`, () => {
        const cmd = "asdf";

        const p = new Process();
        p.exec(cmd, undefined, (result) => {
            expect(result.command).toBe(cmd);
            expect(result.return_value).toBe(-1);
            if (process.platform !== 'win32') {
                expect(result.stderr).toBe("/bin/sh: 1: asdf: not found");
            }
            expect(result.stdout).toBe("");
            expect(result.successful).not.toBeTruthy();
        });
    });

    it(`Local: exec with cmd`, () => {
        let cmd = "";
        if (process.platform === 'win32') {
            cmd = "ls";
        }else{
            cmd = "ls -l";
        }
        const p = new Process();
        const folder_test = path_lib.join(__dirname, "sample_folder");

        p.exec(cmd, { cwd: folder_test, timeout: 0 }, (result) => {
            expect(result.command).toBe(cmd);
            expect(result.return_value).toBe(0);
            expect(result.stderr).toBe("");
            expect(result.stdout).toContain("hi");
            expect(result.successful).toBeTruthy();
        });
    });

});
