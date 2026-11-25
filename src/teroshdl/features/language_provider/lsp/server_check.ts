// Copyright 2026 Alex Cooke
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

import { execFile } from 'child_process';

/** Runs `<binPath> --version` and resolves true when it exits cleanly and reports as `binaryName`. */
export function checkServerRuns(binPath: string, binaryName: string): Promise<boolean> {
    // eslint-disable-next-line no-console
    console.log(`[${binaryName}][info] Checking language server: ${binPath} --version`);
    return new Promise((resolve) => {
        execFile(binPath, ['--version'], (err, stdout, stderr) => {
            if (stderr !== '') {
                // eslint-disable-next-line no-console
                console.log(`[${binaryName}][info] ${stderr}`);
            }
            resolve(err === null && stdout.trim().startsWith(binaryName));
        });
    });
}
