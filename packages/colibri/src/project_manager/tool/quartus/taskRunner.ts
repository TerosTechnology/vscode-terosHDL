/* eslint-disable max-len */
// This code only can be used for Quartus boards

import { ChildProcess } from "child_process";
import { Process } from "../../../process/process";
import { p_result } from "../../../process/common";
import { e_taskType } from "../common";
import * as path_lib from "path";
import { EventEmitter } from "stream";

function executeCommandList(commands: string[], cwd: string, emitter: EventEmitter,
    callback: (result: p_result) => void): ChildProcess {

    const concatCommands = commands.join(" && ");

    const opt_exec = { cwd: cwd };
    const p = new Process();

    const exec_i = p.exec(concatCommands, opt_exec, (result: p_result) => {
        emitter.emit("taskFinished");
        callback(result);
    });
    return exec_i;
}

export function runTask(taskType: e_taskType, quartusDir: string, 
    projectDir: string, projectName: string, revisionName: string, emitter: EventEmitter,
    callback: (result: p_result) => void): ChildProcess {

    const binIP = path_lib.join(quartusDir, "quartus_ipgenerate");
    const binSyn = path_lib.join(quartusDir, "quartus_syn");
    const binFit = path_lib.join(quartusDir, "quartus_fit");
    const binSTA = path_lib.join(quartusDir, "quartus_sta");

    const commandDeclaration: Record<e_taskType, string[]> = {
        [e_taskType.QUARTUS_COMPILEDESIGN]: [
            `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
            `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
            `${binSTA} ${projectName} -c ${revisionName} --mode=finalize`,
        ],
        [e_taskType.QUARTUS_IPGENERATION]: [
            `${binIP} --dni ${projectName} -c ${revisionName} --run_default_mode_op`,
        ],
        [e_taskType.QUARTUS_ANALYSISSYNTHESIS]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`
            ],
        [e_taskType.QUARTUS_ANALYSISELABORATION]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off --analysis_and_elaboration ${projectName} -c ${revisionName}`,
            ],
        [e_taskType.QUARTUS_SYNTHESIS]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off --analysis_and_elaboration ${projectName} -c ${revisionName}`,
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off --synthesis ${projectName} -c ${revisionName}`
            ],
        [e_taskType.QUARTUS_EARLYTIMINGANALYSIS]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan --place`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --route`,
            ],
        [e_taskType.QUARTUS_FITTER]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
            ],
        [e_taskType.QUARTUS_FITTERIMPLEMENT]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan --place --route`,
            ],
        [e_taskType.QUARTUS_PLAN]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan`,
            ],
        [e_taskType.QUARTUS_PLACE]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan --place`,
            ],
        [e_taskType.QUARTUS_ROUTE]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName} --plan --place --route`,
            ],
        [e_taskType.QUARTUS_FITTERFINALIZE]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
            ],
        [e_taskType.QUARTUS_TIMING]:
            [
                `${binSyn} --dni --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binFit} --read_settings_files=on --write_settings_files=off ${projectName} -c ${revisionName}`,
                `${binSTA} ${projectName} -c ${revisionName} --mode=finalize`,
            ],
    };
    const commandToRun = commandDeclaration[taskType];
    if (commandToRun.length === 0) {
        return {} as ChildProcess;
    }
    return executeCommandList(commandDeclaration[taskType], projectDir, emitter, callback);
}