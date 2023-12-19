/* eslint-disable max-len */
// This code only can be used for Quartus boards

import { ChildProcess } from "child_process";
import { Process } from "../../../process/process";
import { p_result } from "../../../process/common";
import { e_taskType } from "../common";
import * as path_lib from "path";
import { ProjectEmitter, e_event } from "../../projectEmitter";

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

export function runTask(taskType: e_taskType, quartusDir: string,
    projectDir: string, projectName: string, revisionName: string, emitter: ProjectEmitter,
    callback: (result: p_result) => void): ChildProcess {

    const binIP = path_lib.join(quartusDir, "quartus_ipgenerate");
    const binSyn = path_lib.join(quartusDir, "quartus_syn");
    const binFit = path_lib.join(quartusDir, "quartus_fit");
    const binSTA = path_lib.join(quartusDir, "quartus_sta");

    const commandDeclaration: Record<e_taskType, string[]> = {
        [e_taskType.CHANGEDEVICE]: [],
        [e_taskType.QUARTUS_RTL_ANALYZER]: [],
        [e_taskType.SETTINGS]: [],
        [e_taskType.OPENFOLDER]: [],
        [e_taskType.QUARTUS_COMPILEDESIGN]: [
            `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
            `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
            `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
            `${binSTA} ${projectName} -c ${revisionName} --mode=finalize`,
        ],
        [e_taskType.QUARTUS_IPGENERATION]: [
            `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
        ],
        [e_taskType.QUARTUS_ANALYSISSYNTHESIS]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`
            ],
        [e_taskType.QUARTUS_ANALYSISELABORATION]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off --analysis_and_elaboration ${projectName} -c ${revisionName}`,
            ],
        [e_taskType.QUARTUS_SYNTHESIS]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off --analysis_and_elaboration ${projectName} -c ${revisionName}`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off --synthesis ${projectName} -c ${revisionName}`
            ],
        [e_taskType.QUARTUS_EARLYTIMINGANALYSIS]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binSTA} ${projectName} -c ${revisionName} --post_syn`,
            ],
        [e_taskType.QUARTUS_FITTER]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
            ],
        [e_taskType.QUARTUS_FITTERIMPLEMENT]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan --place --route`,
            ],
        [e_taskType.QUARTUS_PLAN]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan`,
            ],
        [e_taskType.QUARTUS_PLACE]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan --place`,
            ],
        [e_taskType.QUARTUS_ROUTE]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan --place --route`,
            ],
        [e_taskType.QUARTUS_FITTERFINALIZE]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
            ],
        [e_taskType.QUARTUS_TIMING]:
            [
                `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binSTA} ${projectName} -c ${revisionName} --mode=finalize`,
            ],
    };
    const commandToRun = commandDeclaration[taskType];
    if (commandToRun.length === 0) {
        return {} as ChildProcess;
    }
    return executeCommandList(projectName, commandDeclaration[taskType], projectDir, emitter, callback);
}