/* eslint-disable max-len */
// This code only can be used for Quartus boards

import { ChildProcess } from "child_process";
import { Process } from "../../../process/process";
import { p_result } from "../../../process/common";
import { e_taskState, e_taskType } from "../common";
import * as path_lib from "path";
import { ProjectEmitter, e_event } from "../../projectEmitter";
import { TaskStateManager } from "../taskState";

const taskDependencies: Record<e_taskType, e_taskType[]> = {
    [e_taskType.CHANGEDEVICE]: [],
    [e_taskType.QUARTUS_RTL_ANALYZER]: [],
    [e_taskType.SETTINGS]: [],
    [e_taskType.OPENFOLDER]: [],
    [e_taskType.QUARTUS_COMPILEDESIGN]: [
        e_taskType.QUARTUS_IPGENERATION,
        e_taskType.QUARTUS_ANALYSISELABORATION,
        e_taskType.QUARTUS_SYNTHESIS,
        e_taskType.QUARTUS_PLAN,
        e_taskType.QUARTUS_PLACE,
        e_taskType.QUARTUS_ROUTE,
        e_taskType.QUARTUS_FITTERFINALIZE,
        e_taskType.QUARTUS_TIMING,
        e_taskType.QUARTUS_ASSEMBLER,
    ],
    [e_taskType.QUARTUS_IPGENERATION]: [
    ],
    [e_taskType.QUARTUS_ANALYSISSYNTHESIS]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
        ],
    [e_taskType.QUARTUS_ANALYSISELABORATION]:
        [
            e_taskType.QUARTUS_IPGENERATION,
        ],
    [e_taskType.QUARTUS_SYNTHESIS]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
        ],
    [e_taskType.QUARTUS_EARLYTIMINGANALYSIS]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
        ],
    [e_taskType.QUARTUS_FITTER]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
            e_taskType.QUARTUS_PLAN,
            e_taskType.QUARTUS_PLACE,
            e_taskType.QUARTUS_ROUTE,
        ],
    [e_taskType.QUARTUS_FITTERIMPLEMENT]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
            e_taskType.QUARTUS_PLAN,
            e_taskType.QUARTUS_PLACE,
            e_taskType.QUARTUS_ROUTE,
            e_taskType.QUARTUS_FITTERFINALIZE,
        ],
    [e_taskType.QUARTUS_PLAN]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
        ],
    [e_taskType.QUARTUS_PLACE]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
            e_taskType.QUARTUS_PLAN,
        ],
    [e_taskType.QUARTUS_ROUTE]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
            e_taskType.QUARTUS_PLAN,
            e_taskType.QUARTUS_PLACE,
        ],
    [e_taskType.QUARTUS_FITTERFINALIZE]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
            e_taskType.QUARTUS_PLAN,
            e_taskType.QUARTUS_PLACE,
            e_taskType.QUARTUS_ROUTE,
        ],
    [e_taskType.QUARTUS_TIMING]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
            e_taskType.QUARTUS_PLAN,
            e_taskType.QUARTUS_PLACE,
            e_taskType.QUARTUS_ROUTE,
            e_taskType.QUARTUS_FITTERFINALIZE,
        ],
    [e_taskType.QUARTUS_ASSEMBLER]:
        [
            e_taskType.QUARTUS_IPGENERATION,
            e_taskType.QUARTUS_ANALYSISELABORATION,
            e_taskType.QUARTUS_SYNTHESIS,
            e_taskType.QUARTUS_PLAN,
            e_taskType.QUARTUS_PLACE,
            e_taskType.QUARTUS_ROUTE,
            e_taskType.QUARTUS_FITTERFINALIZE,
        ],
};

function executeCommandList(projectName: string, commands: string[], cwd: string, emitter: ProjectEmitter,
    callback: (result: p_result) => void): ChildProcess {

    const concatCommands = commands.join(" && ");

    const opt_exec = { cwd: cwd };
    const p = new Process();

    const exec_i = p.exec(concatCommands, opt_exec, (result: p_result) => {
        emitter.emitEvent(projectName, e_event.FINISH_TASK);
        callback(result);
    });
    return exec_i;
}

export function runTask(taskType: e_taskType, taskManager: TaskStateManager, quartusDir: string,
    projectDir: string, projectName: string, revisionName: string, emitter: ProjectEmitter,
    callback: (result: p_result) => void): ChildProcess {

    const binIP = path_lib.join(quartusDir, "quartus_ipgenerate");
    const binSyn = path_lib.join(quartusDir, "quartus_syn");
    const binFit = path_lib.join(quartusDir, "quartus_fit");
    const binSTA = path_lib.join(quartusDir, "quartus_sta");
    const binASM = path_lib.join(quartusDir, "quartus_asm");

    const commandDeclaration: Record<e_taskType, string> = {
        [e_taskType.CHANGEDEVICE]: "",
        [e_taskType.QUARTUS_RTL_ANALYZER]:
            "",

        [e_taskType.SETTINGS]:
            "",

        [e_taskType.OPENFOLDER]:
            "",

        [e_taskType.QUARTUS_COMPILEDESIGN]:
            "",

        [e_taskType.QUARTUS_IPGENERATION]:
            `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,

        [e_taskType.QUARTUS_ANALYSISSYNTHESIS]:
            "",

        [e_taskType.QUARTUS_ANALYSISELABORATION]:
            `${binSyn} --dni --read_settings_files=on --write_settings_files=off --analysis_and_elaboration ${projectName} -c ${revisionName}`,

        [e_taskType.QUARTUS_SYNTHESIS]:
            `${binSyn} --dni --read_settings_files=on --write_settings_files=off --synthesis ${projectName} -c ${revisionName}`,

        [e_taskType.QUARTUS_EARLYTIMINGANALYSIS]:
            `${binSTA} ${projectName} -c ${revisionName} --post_syn`,

        [e_taskType.QUARTUS_FITTER]:
            "",

        [e_taskType.QUARTUS_FITTERIMPLEMENT]:
            "",

        [e_taskType.QUARTUS_PLAN]:
            `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan`,

        [e_taskType.QUARTUS_PLACE]:
            `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --place`,

        [e_taskType.QUARTUS_ROUTE]:
            `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --route`,

        [e_taskType.QUARTUS_FITTERFINALIZE]:
            `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --retime --finalize`,

        [e_taskType.QUARTUS_TIMING]:
            `${binSTA} ${projectName} -c ${revisionName} --mode=finalize`,

        [e_taskType.QUARTUS_ASSEMBLER]:
            `${binASM} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,

    };

    const cmdList: string[] = [];
    const dependencies = taskDependencies[taskType];

    // Add previous commands
    for (const dep of dependencies) {
        const taskState = taskManager.getTaskState(dep);
        if (taskState !== e_taskState.FINISHED) {
            cmdList.push(commandDeclaration[dep]);
        }
    }

    // Add current command
    const commandToRun = commandDeclaration[taskType];
    if (commandToRun !== "") {
        cmdList.push(commandToRun);
    }

    if (cmdList.length === 0) {
        return {} as ChildProcess;
    }

    return executeCommandList(projectName, cmdList, projectDir, emitter, callback);
}