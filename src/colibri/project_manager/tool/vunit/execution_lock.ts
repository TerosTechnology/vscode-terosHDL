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

const execution_queues = new Map<string, Promise<void>>();

/**
 * Run a task exclusively per key. Tasks with the same key are executed one
 * after another (in call order); tasks with different keys run in parallel.
 * VUnit executions must be serialized per run.py directory: concurrent
 * executions in the same folder share the "vunit_out" folder and collide.
 * @param key Lock key (e.g. the run.py directory)
 * @param task Task to execute
 * @returns Task result
 */
export async function with_execution_lock<T>(key: string, task: () => Promise<T>): Promise<T> {
    const previous = execution_queues.get(key) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    // The queue tail never rejects: the next task waits for this task gate
    // even if this task fails.
    const tail = previous.then(() => gate, () => gate);
    execution_queues.set(key, tail);
    await previous;
    try {
        return await task();
    }
    finally {
        release();
        if (execution_queues.get(key) === tail) {
            execution_queues.delete(key);
        }
    }
}
