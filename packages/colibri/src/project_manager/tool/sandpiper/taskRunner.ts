import { ChildProcess, spawn } from "child_process";
import { p_result } from "../../../process/common";
import { e_taskType } from "../common";
import { ProjectEmitter } from "../../projectEmitter";
import { TaskStateManager } from "../taskState";

export function runTask(
  taskType: e_taskType,
  _taskManager: TaskStateManager,
  projectDir: string,
  _projectName: string,
  _emitter: ProjectEmitter,
  callback: (result: p_result) => void
): ChildProcess {
  _taskManager.setCurrentTask(taskType);

  let command: string;
  let args: string[];

  switch (taskType) {
    case e_taskType.SANDPIPER_TLVERILOGTOVERILOG:
      command = "echo";
      args = ["Sandpiper TL-Verilog to Verilog conversion initiated"];
      break;
    case e_taskType.SANDPIPER_DIAGRAM_TAB:
      command = "echo";
      args = ["Sandpiper diagram generation initiated"];
      break;
    case e_taskType.SANDPIPER_NAV_TLV_TAB:
      command = "echo";
      args = ["Sandpiper NavTLV generation initiated"];
      break;
    default:
      command = "echo";
      args = ["Unrecognized task type"];
  }
  const childProcess = spawn(command, args, { cwd: projectDir });

  childProcess.on("close", (code) => {
    const result: p_result = {
      command: `${command} ${args.join(" ")}`,
      stdout: code === 0 ? `${taskType} process completed.` : "",
      stderr: code !== 0 ? `Error occurred during ${taskType}.` : "",
      return_value: code ?? 0,
      successful: code === 0,
    };
    callback(result);
  });

  return childProcess;
}
