import { e_tools_general_select_tool } from 'colibri/config/config_declaration';
import { e_iconType, e_taskExecutionType, e_taskState, e_taskType, t_taskRep } from './common';

export function getTaskList(toolName: e_tools_general_select_tool): t_taskRep[] {
    if (toolName === e_tools_general_select_tool.ghdl) {
        return [
            {
                name: e_taskType.OPENFOLDER,
                label: 'Open Project Folder',
                executionType: e_taskExecutionType.OPENFOLDER
            },
            {
                name: e_taskType.OPEN_WAVEFORM,
                label: 'Open Waveform',
                executionType: e_taskExecutionType.SIMPLECOMMAND,
                icon: e_iconType.WAVEFORM},
            {
                name: e_taskType.GHDL_CHECK_SYNTAX,
                label: 'GHDL Check Syntax',
                executionType: e_taskExecutionType.COMPLEXCOMMAND,
                status: e_taskState.IDLE
            },
            {
                "name": e_taskType.GHDL_RUN_ALL,
                "label": "GHDL Run All",
                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                "status": e_taskState.IDLE,
                "children": [
                    {
                        "name": e_taskType.GHDL_ANALYZE,
                        "label": "GHDL Analyze",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "status": e_taskState.IDLE
                    },
                    {
                        "name": e_taskType.GHDL_ELABORATE,
                        "label": "GHDL Elaborate",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "status": e_taskState.IDLE
                    },
                    {
                        "name": e_taskType.GHDL_SIMULATE,
                        "label": "GHDL Simulate",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "status": e_taskState.IDLE
                    }
                ]
            }
        ];
    } else if (toolName === e_tools_general_select_tool.yosys) {
        return [
            {
                name: e_taskType.OPENFOLDER,
                label: 'Open Project Folder',
                executionType: e_taskExecutionType.OPENFOLDER
            },
            {
                name: e_taskType.YOSYS_SHOW,
                label: 'Show Schematic',
                executionType: e_taskExecutionType.COMPLEXCOMMAND,
                status: e_taskState.IDLE
            },
            {
                name: e_taskType.YOSYS_RESOURCE_UTILIZATION,
                label: 'Resource Utilization',
                executionType: e_taskExecutionType.COMPLEXCOMMAND,
                status: e_taskState.IDLE
            },
            {
                "name": e_taskType.YOSYS_COMPILE_ALL,
                "label": "Compile All",
                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                "status": e_taskState.IDLE,
                "children": [
                    {
                        "name": e_taskType.YOSYS_LOAD_FILES,
                        "label": "Load Files",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "status": e_taskState.IDLE
                    },
                    {
                        "name": e_taskType.YOSYS_ANALYZE,
                        "label": "Analyze",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "status": e_taskState.IDLE
                    },
                    {
                        "name": e_taskType.YOSYS_ELABORATE,
                        "label": "Elaborate",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "status": e_taskState.IDLE
                    },
                    {
                        "name": e_taskType.YOSYS_SYNTHESIS,
                        "label": "Synthesis",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "status": e_taskState.IDLE
                    }
                ]
            }
        ];
    } else if (toolName === e_tools_general_select_tool.osvvm) {
        return [
            {
                name: e_taskType.OPENFOLDER,
                label: 'Open Project Folder',
                executionType: e_taskExecutionType.OPENFOLDER
            },
            {
                name: e_taskType.OPEN_WAVEFORM,
                label: 'Open Waveform',
                executionType: e_taskExecutionType.SIMPLECOMMAND,
                icon: e_iconType.WAVEFORM
            },
            {
                name: e_taskType.NVC_RUN_ALL,
                label: 'NVC Run All',
                executionType: e_taskExecutionType.COMPLEXCOMMAND,
                status: e_taskState.IDLE,
                children: [
                    {
                        name: e_taskType.NVC_ANALYZE,
                        label: 'NVC Analyze',
                        executionType: e_taskExecutionType.COMPLEXCOMMAND,
                        status: e_taskState.IDLE
                    },
                    {
                        name: e_taskType.NVC_ELABORATE,
                        label: 'NVC Elaborate',
                        executionType: e_taskExecutionType.COMPLEXCOMMAND,
                        status: e_taskState.IDLE
                    },
                    {
                        name: e_taskType.NVC_SIMULATE,
                        label: 'NVC Simulate',
                        executionType: e_taskExecutionType.COMPLEXCOMMAND,
                        status: e_taskState.IDLE
                    }
                ]
            }
        ];
    }
    return [];
}
