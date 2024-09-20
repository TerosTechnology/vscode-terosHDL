// This code only can be used for Quartus boards

import { e_taskExecutionType, t_taskRep, e_taskType } from "../common";

export function getDefaultTaskList(): t_taskRep[] {
    const taskList: t_taskRep[] = [
        {
            "name": e_taskType.OPENFOLDER,
            "label": "Open Project Folder",
            "executionType": e_taskExecutionType.OPENFOLDER,
        },
        {
            "name": e_taskType.SETTINGS,
            "label": "Settings",
            "executionType": e_taskExecutionType.OPENSETTINGS,
        },
        {
            "name": e_taskType.SANDPIPER_TLVERILOGTOVERILOG,
            "label": "Convert TL-Verilog to Verilog",
            "executionType": e_taskExecutionType.SIMPLECOMMAND,
        },
        {
            "name": e_taskType.SANDPIPER_DIAGRAM_TAB,
            "label": "Open Diagram Tab",
            "executionType": e_taskExecutionType.SIMPLECOMMAND,
        },
        {
            "name": e_taskType.SANDPIPER_NAV_TLV_TAB,
            "label": "Open NAV TLV Tab",
            "executionType": e_taskExecutionType.SIMPLECOMMAND,
        },
    ];
    return taskList;
}