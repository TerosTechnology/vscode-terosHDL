// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Alfreso Saez Perez de la Lastra [alfredosaezperez@gmail.com]
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

import { e_taskState, e_taskType, t_taskRep } from "./common";

export class TaskStateManager {

    private taskList: t_taskRep[] = [];

    constructor(taskList: t_taskRep[]) {
        this.taskList = taskList;
    }

    updateTask(taskType: e_taskType, status: e_taskState, percent: number| undefined, success: boolean | undefined, 
        elapsed_time: number | undefined) {
        const task = this.findTaskByName(this.taskList, taskType);
        if (task) {
            task.status = status;
            task.percent = percent;
            task.success = success;
            task.elapsed_time = elapsed_time;
        }
    }

    private findTaskByName(tasks: t_taskRep[], name: e_taskType): t_taskRep | null {
        for (const task of tasks) {
            if (task.name === name) {
                return task;
            }

            if (task.children && task.children.length > 0) {
                const childState = this.findTaskByName(task.children, name);
                if (childState !== null) {
                    return childState;
                }
            }
        }
        return null;
    }

    public getTaskList(): t_taskRep[] {
        return this.taskList;
    }

    public getTaskState(nameTask: e_taskType): e_taskState | undefined{
        const task = this.findTaskByName(this.taskList, nameTask);
        if (task) {
            return task.status;
        }
        return undefined;
    }
}