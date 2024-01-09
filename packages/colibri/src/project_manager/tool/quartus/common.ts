// This code only can be used for Quartus boards

import { e_iconType, e_reportType, e_taskExecutionType, e_taskState, e_taskType, t_taskRep } from "../common";

export enum e_rtlType {
    ELABORATED = "elaborated",
    INSTRUMENTED = "instrumented",
    CONSTRAINED = "constrained",
    SWEPT = "swept",
}

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
            "name": e_taskType.CHANGEDEVICE,
            "label": "Device",
            "executionType": e_taskExecutionType.SIMPLECOMMAND,
        },
        {
            "name": e_taskType.QUARTUS_RTL_ANALYZER,
            "label": "",
            "success": undefined,
            "elapsed_time": undefined,
            "percent": undefined,
            "executionType": e_taskExecutionType.SIMPLECOMMAND,
            "reports": [],
            "icon": e_iconType.LENS,
            "status": e_taskState.IDLE,
        },
        {
            "name": e_taskType.QUARTUS_COMPILEDESIGN,
            "label": "Run during full compilation",
            "executionType": e_taskExecutionType.COMPLEXCOMMAND,
            "status": e_taskState.IDLE,
            "children": [
                {
                    "name": e_taskType.QUARTUS_IPGENERATION,
                    "label": "Run during full compilation",
                    "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                    "status": e_taskState.IDLE,
                    "success": undefined,
                    "elapsed_time": undefined,
                    "percent": undefined,
                    "reports": [
                        e_reportType.REPORTDB,
                    ]
                },
                {
                    "name": e_taskType.QUARTUS_ANALYSISSYNTHESIS,
                    "label": "Run during full compilation",
                    "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                    "reports": [
                        e_reportType.REPORTDB,
                        e_reportType.REPORT,
                    ],
                    "success": undefined,
                    "elapsed_time": undefined,
                    "percent": undefined,
                    "status": e_taskState.IDLE,
                    "children": [
                        {
                            "name": e_taskType.QUARTUS_ANALYSISELABORATION,
                            "label": "Run during full compilation",
                            "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                            "reports": [
                                e_reportType.REPORTDB,
                                e_reportType.REPORT,
                            ],
                            "success": undefined,
                            "elapsed_time": undefined,
                            "percent": undefined,
                            "status": e_taskState.IDLE
                        },
                        {
                            "name": e_taskType.QUARTUS_SYNTHESIS,
                            "label": "Run during full compilation",
                            "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                            "reports": [
                                e_reportType.REPORTDB,
                                e_reportType.REPORT,
                                e_reportType.TIMINGANALYZER,
                                // e_reportType.TECHNOLOGYMAPVIEWER,
                            ],
                            "status": e_taskState.IDLE,
                            "success": undefined,
                            "elapsed_time": undefined,
                            "percent": undefined,
                        },
                    ]
                },
                {
                    "name": e_taskType.QUARTUS_EARLYTIMINGANALYSIS,
                    "label": "Not run during full compilation",
                    "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                    "reports": [
                        e_reportType.REPORT,
                        e_reportType.REPORTDB,
                        e_reportType.TIMINGANALYZER,
                    ],
                    "icon": e_iconType.TIME,
                    "success": undefined,
                    "elapsed_time": undefined,
                    "percent": undefined,
                    "status": e_taskState.IDLE
                },
                {
                    "name": e_taskType.QUARTUS_FITTER,
                    "label": "Run during full compilation",
                    "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                    "reports": [
                        e_reportType.REPORTDB,
                        e_reportType.REPORT,
                    ],
                    "success": undefined,
                    "elapsed_time": undefined,
                    "percent": undefined,
                    "status": e_taskState.IDLE,
                    "children": [
                        {
                            "name": e_taskType.QUARTUS_FITTERIMPLEMENT,
                            "label": "Run during full compilation",
                            "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                            "status": e_taskState.IDLE,
                            "success": undefined,
                            "elapsed_time": undefined,
                            "percent": undefined,
                            "children": [
                                {
                                    "name": e_taskType.QUARTUS_PLAN,
                                    "label": "Run during full compilation",
                                    "success": undefined,
                                    "elapsed_time": undefined,
                                    "percent": undefined,
                                    "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                                    "reports": [
                                        e_reportType.REPORTDB,
                                        e_reportType.REPORT, e_reportType.TIMINGANALYZER,
                                        // e_reportType.TECHNOLOGYMAPVIEWER
                                    ],
                                    "status": e_taskState.IDLE
                                },
                                {
                                    "name": e_taskType.QUARTUS_PLACE,
                                    "label": "Run during full compilation",
                                    "success": undefined,
                                    "elapsed_time": undefined,
                                    "percent": undefined,
                                    "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                                    "reports": [
                                        e_reportType.REPORTDB,
                                        e_reportType.REPORT, e_reportType.TIMINGANALYZER,
                                        // e_reportType.TECHNOLOGYMAPVIEWER
                                    ],
                                    "status": e_taskState.IDLE,
                                },
                                {
                                    "name": e_taskType.QUARTUS_ROUTE,
                                    "label": "Run during full compilation",
                                    "success": undefined,
                                    "elapsed_time": undefined,
                                    "percent": undefined,
                                    "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                                    "reports": [
                                        e_reportType.REPORTDB,
                                        e_reportType.REPORT, e_reportType.TIMINGANALYZER,
                                        // e_reportType.TECHNOLOGYMAPVIEWER
                                    ],
                                    "status": e_taskState.IDLE,
                                },
                            ]
                        },
                        {
                            "name": e_taskType.QUARTUS_FITTERFINALIZE,
                            "label": "Run during full compilation",
                            "success": undefined,
                            "elapsed_time": undefined,
                            "percent": undefined,
                            "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                            "reports": [
                                e_reportType.REPORTDB,
                                e_reportType.REPORT, e_reportType.TIMINGANALYZER,
                            ],
                            "status": e_taskState.IDLE,
                        },
                    ]
                },
                {
                    "name": e_taskType.QUARTUS_TIMING,
                    "label": "Run during full compilation",
                    "success": undefined,
                    "elapsed_time": undefined,
                    "percent": undefined,
                    "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                    "reports": [
                        e_reportType.REPORTDB,
                        e_reportType.REPORT, e_reportType.TIMINGANALYZER,],
                    "icon": e_iconType.TIME,
                    "status": e_taskState.IDLE,
                },
                {
                    "name": e_taskType.QUARTUS_ASSEMBLER,
                    "label": "Run during full compilation",
                    "success": undefined,
                    "elapsed_time": undefined,
                    "percent": undefined,
                    "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                    "reports": [
                        e_reportType.REPORTDB,
                        e_reportType.REPORT,
                    ],
                    "status": e_taskState.IDLE,
                },
            ]
        },
    ];
    return taskList;
}