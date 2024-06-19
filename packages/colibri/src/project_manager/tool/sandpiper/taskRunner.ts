/* eslint-disable max-len */
// This code only can be used for Quartus boards

import { ChildProcess } from "child_process";
import { p_result } from "../../../process/common";
import { e_taskType } from "../common";
import { ProjectEmitter } from "../../projectEmitter";
import { TaskStateManager } from "../taskState";


export function runTask(_taskType: e_taskType, _taskManager: TaskStateManager, _projectDir: string, 
    _projectName: string, _emitter: ProjectEmitter, _callback: (result: p_result) => void): ChildProcess {

    return {} as ChildProcess;
}