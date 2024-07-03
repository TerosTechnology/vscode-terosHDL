// packages/colibri/src/project_manager/tool/sandpiper/taskRunner.ts

import { ChildProcess, spawn } from "child_process";
import { p_result } from "../../../process/common";
import { e_taskType } from "../common";
import { ProjectEmitter } from "../../projectEmitter";
import { TaskStateManager } from "../taskState";

export function runTask(taskType: e_taskType, _taskManager: TaskStateManager, projectDir: string, 
    _projectName: string, _emitter: ProjectEmitter, callback: (result: p_result) => void): ChildProcess {

    if (taskType === e_taskType.SANDPIPER_TLVERILOGTOVERILOG) {
        const command = "echo";
        const args = ["Sandpiper TL-Verilog to Verilog conversion initiated"];

        const childProcess = spawn(command, args, { cwd: projectDir });

        childProcess.on('close', (code) => {
            const result: p_result = {
                command: `${command} ${args.join(' ')}`,
                stdout: "Sandpiper conversion process completed.",
                stderr: code !== 0 ? "Error occurred during Sandpiper conversion." : "",
                return_value: code ?? 0,
                successful: code === 0
            };
            callback(result);
        });

        return childProcess;
    }

    return {} as ChildProcess;
}