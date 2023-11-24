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

    updateTask(taskType: e_taskType, status: e_taskState, percent: number, success: boolean, elapsed_time: number) {
        const task = this.findTaskByName(this.taskList, taskType);
        if (task) {
            task.status = status;
            task.percent = percent;
            task.success = success;
            task.elapsed_time = elapsed_time;
        }
    }


    // private updateTaskState(tasks: t_taskRep[], nameList: e_taskType[] | undefined, newState: e_taskState): void {
    //     tasks.forEach(task => {
    //         if ((nameList === undefined || nameList.includes(task.name))
    //             && task.executionType !== e_taskExecutionType.DISPLAYGROUP) {

    //             task.status = newState;
    //         }

    //         if (task.children && task.children.length > 0) {
    //             this.updateTaskState(task.children, nameList, newState);
    //         }
    //     });
    // }

    public cleanAll(): t_taskRep[] {
        // this.setTaskDurationByName(this.taskList, undefined, undefined);
        // this.updateTaskState(this.taskList, undefined, e_taskState.IDLE);
        // this.setTaskDurationByName(this.taskList, undefined, undefined);
        return this.getTaskList();
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

    // private setTaskDurationByName(tasks: t_taskRep[], name: e_taskType | undefined,
    //     duration: number | undefined) {

    //     tasks.forEach(task => {
    //         if (name === undefined || task.name === name) {
    //             task.duration = duration;
    //         }

    //         if (task.children && task.children.length > 0) {
    //             this.setTaskDurationByName(task.children, name, duration);
    //         }
    //     });
    // }

    // public getTaskState(nameTask: e_taskType): e_taskState | null {
    //     return this.findTaskStateByName(this.taskList, nameTask);
    // }

    // public setDuration(nameTask: e_taskType, duration: number): t_taskRep[] {
    //     this.setTaskDurationByName(this.taskList, nameTask, duration);
    //     return this.getTaskList();
    // }

    // public setRunning(nameTask: e_taskType): t_taskRep[] {
    //     const nameTaskList = ListOfTasksRun[nameTask];
    //     this.cleanAll();
    //     this.updateTaskState(this.taskList, nameTaskList, e_taskState.RUNNING);
    //     return this.getTaskList();
    // }

    // public setFailed(nameTask: e_taskType, duration: number | undefined): t_taskRep[] {
    //     const nameTaskList = ListOfTasksRun[nameTask];
    //     this.setTaskDurationByName(this.taskList, nameTask, duration);
    //     this.updateTaskState(this.taskList, nameTaskList, e_taskState.FAILED);
    //     return this.getTaskList();
    // }

    // public setFinished(nameTask: e_taskType, duration: number | undefined): t_taskRep[] {
    //     const nameTaskList = ListOfTasksRun[nameTask];
    //     this.setTaskDurationByName(this.taskList, nameTask, duration);
    //     this.updateTaskState(this.taskList, nameTaskList, e_taskState.FINISHED);
    //     return this.getTaskList();
    // }

    public getTaskList(): t_taskRep[] {
        return this.taskList;
    }
}