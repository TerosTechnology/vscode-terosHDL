import { e_iconType, e_reportType, e_taskExecutionType, e_taskState, e_taskType, t_taskRep } from "../common";

export const taskList: t_taskRep[] = [
    {
        "name": e_taskType.QUARTUS_COMPILEDESIGN,
        "label": "Run during full compilation",
        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
        "state": e_taskState.IDLE,
        "children": [
            {
                "name": e_taskType.QUARTUS_IPGENERATION,
                "label": "Run during full compilation",
                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                "state": e_taskState.IDLE,
                "duration": undefined,
            },
            {
                "name": e_taskType.QUARTUS_ANALYSISSYNTHESIS,
                "label": "Run during full compilation",
                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                "reports": [e_reportType.REPORT,],
                "duration": undefined,
                "state": e_taskState.IDLE,
                "children": [
                    {
                        "name": e_taskType.QUARTUS_ANALYSISELABORATION,
                        "label": "Run during full compilation",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "reports": [e_reportType.REPORT,],
                        "duration": undefined,
                        "state": e_taskState.IDLE
                    },
                    {
                        "name": e_taskType.QUARTUS_SYNTHESIS,
                        "label": "Run during full compilation",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "reports": [
                            e_reportType.REPORT, e_reportType.TIMINGANALYZER,
                            e_reportType.TECHNOLOGYMAPVIEWER,
                        ],
                        "state": e_taskState.IDLE,
                        "duration": undefined,
                    },
                ]
            },
            {
                "name": e_taskType.QUARTUS_EARLYTIMINGANALYSIS,
                "label": "Not run during full compilation",
                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                "reports": [e_reportType.REPORT, e_reportType.TIMINGANALYZER,],
                "icon": e_iconType.TIME,
                "duration": undefined,
                "state": e_taskState.IDLE
            },
            {
                "name": e_taskType.QUARTUS_FITTER,
                "label": "Run during full compilation",
                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                "reports": [e_reportType.REPORT,],
                "duration": undefined,
                "state": e_taskState.IDLE,
                "children": [
                    {
                        "name": e_taskType.QUARTUS_FITTERIMPLEMENT,
                        "label": "Run during full compilation",
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "state": e_taskState.IDLE,
                        "duration": undefined,
                        "children": [
                            {
                                "name": e_taskType.QUARTUS_PLAN,
                                "label": "Run during full compilation",
                                "duration": undefined,
                                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                                "reports": [
                                    e_reportType.REPORT, e_reportType.TIMINGANALYZER,
                                    e_reportType.TECHNOLOGYMAPVIEWER
                                ],
                                "state": e_taskState.IDLE
                            },
                            {
                                "name": e_taskType.QUARTUS_PLACE,
                                "label": "Run during full compilation",
                                "duration": undefined,
                                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                                "reports": [
                                    e_reportType.REPORT, e_reportType.TIMINGANALYZER,
                                    e_reportType.TECHNOLOGYMAPVIEWER
                                ],
                                "state": e_taskState.IDLE,
                            },
                            {
                                "name": e_taskType.QUARTUS_ROUTE,
                                "label": "Run during full compilation",
                                "duration": undefined,
                                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                                "reports": [
                                    e_reportType.REPORT, e_reportType.TIMINGANALYZER,
                                    e_reportType.TECHNOLOGYMAPVIEWER
                                ],
                                "state": e_taskState.IDLE,
                            },
                        ]
                    },
                    {
                        "name": e_taskType.QUARTUS_FITTERFINALIZE,
                        "label": "Run during full compilation",
                        "duration": undefined,
                        "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                        "reports": [e_reportType.REPORT, e_reportType.TIMINGANALYZER,],
                        "state": e_taskState.IDLE,
                    },
                ]
            },
            {
                "name": e_taskType.QUARTUS_TIMING,
                "label": "Run during full compilation",
                "duration": undefined,
                "executionType": e_taskExecutionType.COMPLEXCOMMAND,
                "reports": [e_reportType.REPORT, e_reportType.TIMINGANALYZER,],
                "icon": e_iconType.TIME,
                "state": e_taskState.IDLE,
            },
        ]
    },
];