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
    [e_taskType.TCLCONSOLE]: [],
    [e_taskType.CHANGEDEVICE]: [],
    [e_taskType.QUARTUS_RTL_ANALYZER]: [],
    [e_taskType.SETTINGS]: [],
    [e_taskType.OPENFOLDER]: [],
    [e_taskType.OPEN_WAVEFORM]: [],
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
    [e_taskType.SANDPIPER_TLVERILOGTOVERILOG]: [],
    [e_taskType.SANDPIPER_DIAGRAM_TAB]:[],
    [e_taskType.SANDPIPER_NAV_TLV_TAB]: [],
    [e_taskType.GHDL_RUN_ALL]: [],
    [e_taskType.GHDL_ANALYZE]: [],
    [e_taskType.GHDL_ELABORATE]: [],
    [e_taskType.GHDL_SIMULATE]: [],
    [e_taskType.GHDL_SYNTHESIZE]: [],
    [e_taskType.GHDL_CHECK_SYNTAX]: [],
    [e_taskType.GHDL_MAKEFILE]: [],
    [e_taskType.YOSYS_COMPILE_ALL]: [],
    [e_taskType.YOSYS_LOAD_FILES]: [],
    [e_taskType.YOSYS_ANALYZE]: [],
    [e_taskType.YOSYS_ELABORATE]: [],
    [e_taskType.YOSYS_SYNTHESIS]: [],
    [e_taskType.YOSYS_SHOW]: [],
    [e_taskType.YOSYS_RESOURCE_UTILIZATION]: [],
    [e_taskType.NVC_ANALYZE]: [],
    [e_taskType.NVC_ELABORATE]: [],
    [e_taskType.NVC_SIMULATE]: [],
    [e_taskType.NVC_RUN_ALL]: [],
    [e_taskType.NVC_SYNTHESIZE]: [],
    [e_taskType.NVC_CHECK_SYNTAX]: [],
    [e_taskType.NVC_MAKEFILE]: []
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
    projectDir: string, projectName: string, revisionName: string, family: string, emitter: ProjectEmitter,
    callback: (result: p_result) => void): ChildProcess {

    const binIP = path_lib.join(quartusDir, "quartus_ipgenerate");
    const binSyn = path_lib.join(quartusDir, "quartus_syn");
    const binFit = path_lib.join(quartusDir, "quartus_fit");
    const binSTA = path_lib.join(quartusDir, "quartus_sta");
    const binASM = path_lib.join(quartusDir, "quartus_asm");

    const hyperFlexArchitectures = ["agilex", "stratix 10"];

    const commandDeclaration: Record<e_taskType, string> = {
        [e_taskType.TCLCONSOLE]: "",
        [e_taskType.CHANGEDEVICE]: "",
        [e_taskType.OPEN_WAVEFORM]: "",
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
        [e_taskType.SANDPIPER_TLVERILOGTOVERILOG]: "",
        [e_taskType.SANDPIPER_DIAGRAM_TAB]:"",
        [e_taskType.SANDPIPER_NAV_TLV_TAB]: "",
        [e_taskType.GHDL_RUN_ALL]: "",
        [e_taskType.GHDL_ANALYZE]: "",
        [e_taskType.GHDL_ELABORATE]: "",
        [e_taskType.GHDL_SIMULATE]: "",
        [e_taskType.GHDL_SYNTHESIZE]: "",
        [e_taskType.GHDL_CHECK_SYNTAX]: "",
        [e_taskType.GHDL_MAKEFILE]: "",
        [e_taskType.YOSYS_COMPILE_ALL]: "",
        [e_taskType.YOSYS_LOAD_FILES]: "",
        [e_taskType.YOSYS_ANALYZE]: "",
        [e_taskType.YOSYS_ELABORATE]: "",
        [e_taskType.YOSYS_SYNTHESIS]: "",
        [e_taskType.YOSYS_SHOW]: "",
        [e_taskType.YOSYS_RESOURCE_UTILIZATION]: "",
        [e_taskType.NVC_ANALYZE]: "",
        [e_taskType.NVC_ELABORATE]: "",
        [e_taskType.NVC_SIMULATE]: "",
        [e_taskType.NVC_RUN_ALL]: "",
        [e_taskType.NVC_SYNTHESIZE]: "",
        [e_taskType.NVC_CHECK_SYNTAX]: "",
        [e_taskType.NVC_MAKEFILE]: ""
    };

    const cmdList: string[] = [];
    const dependencies = taskDependencies[taskType];

    // Add previous commands
    for (const dep of dependencies) {
        const taskState = taskManager.getTaskState(dep);
        if (taskState !== e_taskState.FINISHED) {
            let depCommand = commandDeclaration[dep];
            if (!hyperFlexArchitectures.includes(family.toLocaleLowerCase())){
                depCommand = depCommand.replace('--retime', '');
            }
            cmdList.push(depCommand);
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