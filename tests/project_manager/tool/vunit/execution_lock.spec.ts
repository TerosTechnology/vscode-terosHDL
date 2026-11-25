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

import { with_execution_lock } from '../../../../src/colibri/project_manager/tool/vunit/execution_lock';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('vunit execution_lock', () => {

    test('tasks with the same key run sequentially in call order', async () => {
        const order: string[] = [];
        const task = (name: string, delay: number) => with_execution_lock("key", async () => {
            order.push(`start_${name}`);
            await sleep(delay);
            order.push(`end_${name}`);
        });

        await Promise.all([task("a", 30), task("b", 10), task("c", 0)]);

        expect(order).toEqual(["start_a", "end_a", "start_b", "end_b", "start_c", "end_c"]);
    });

    test('tasks with different keys run in parallel', async () => {
        const order: string[] = [];
        const task = (key: string, name: string) => with_execution_lock(key, async () => {
            order.push(`start_${name}`);
            await sleep(30);
            order.push(`end_${name}`);
        });

        await Promise.all([task("key1", "a"), task("key2", "b")]);

        expect(order).toEqual(["start_a", "start_b", "end_a", "end_b"]);
    });

    test('a failing task releases the lock and propagates the error', async () => {
        const order: string[] = [];
        const failing = with_execution_lock("key", async () => {
            order.push("failing");
            throw new Error("boom");
        });
        const after = with_execution_lock("key", async () => {
            order.push("after");
        });

        await expect(failing).rejects.toThrow("boom");
        await after;

        expect(order).toEqual(["failing", "after"]);
    });

    test('task result is returned', async () => {
        const result = await with_execution_lock("key", async () => 42);
        expect(result).toBe(42);
    });
});
