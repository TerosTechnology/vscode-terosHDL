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

import { checkServerRuns } from '../../src/teroshdl/features/language_provider/lsp/server_check';

jest.mock('child_process', () => ({ execFile: jest.fn() }));
import { execFile } from 'child_process';

type ExecCallback = (err: Error | null, stdout: string, stderr: string) => void;

function execReplies(err: Error | null, stdout: string, stderr: string) {
    (execFile as unknown as jest.Mock).mockImplementation(
        (_file: string, _args: string[], cb: ExecCallback) => cb(err, stdout, stderr)
    );
}

describe('checkServerRuns', () => {
    beforeEach(() => (execFile as unknown as jest.Mock).mockReset());

    it('accepts a clean version line on stdout', async () => {
        execReplies(null, 'vhdl_ls 0.88.0\n', '');
        await expect(checkServerRuns('/x/vhdl_ls', 'vhdl_ls')).resolves.toBe(true);
    });

    it('accepts stdout version even when stderr has noise', async () => {
        execReplies(null, 'vhdl_ls 0.88.0\n', 'warning: something harmless\n');
        await expect(checkServerRuns('/x/vhdl_ls', 'vhdl_ls')).resolves.toBe(true);
    });

    it('rejects when the binary fails to run', async () => {
        execReplies(new Error('spawn ENOENT'), '', '');
        await expect(checkServerRuns('/x/vhdl_ls', 'vhdl_ls')).resolves.toBe(false);
    });

    it('rejects a non-zero exit even if stdout names the binary', async () => {
        execReplies(new Error('Command failed: exit code 1'), 'vhdl_ls 0.88.0\n', '');
        await expect(checkServerRuns('/x/vhdl_ls', 'vhdl_ls')).resolves.toBe(false);
    });

    it('rejects when stdout is not from the expected binary', async () => {
        execReplies(null, 'something else 1.0\n', '');
        await expect(checkServerRuns('/x/vhdl_ls', 'vhdl_ls')).resolves.toBe(false);
    });

    it('passes the path as an argument, not through a shell', async () => {
        execReplies(null, 'vhdl_ls 0.88.0\n', '');
        await checkServerRuns('/path with space/vhdl_ls', 'vhdl_ls');
        const [file, args] = (execFile as unknown as jest.Mock).mock.calls[0];
        expect(file).toBe('/path with space/vhdl_ls');
        expect(args).toEqual(['--version']);
    });
});
