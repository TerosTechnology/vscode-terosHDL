import {
    e_tools_general_select_tool,
    e_tools_nextpnr_target_family
} from '../../../src/colibri/config/config_declaration';
import { e_taskExecutionType, e_taskState, e_taskType } from '../../../src/colibri/project_manager/tool/common';
import { getTaskList } from '../../../src/colibri/project_manager/tool/utils';

describe('getTaskList', () => {
    it('provides a grouped set of nextpnr tasks for stable iCE40', () => {
        expect(getTaskList(
            e_tools_general_select_tool.nextpnr,
            e_tools_nextpnr_target_family.ice40
        )).toEqual([
            {
                name: e_taskType.OPENFOLDER,
                label: 'Open Project Folder',
                executionType: e_taskExecutionType.OPENFOLDER
            },
            {
                name: e_taskType.NEXTPNR_PNR_GROUP,
                label: 'Place & Route',
                executionType: e_taskExecutionType.DISPLAYGROUP,
                children: [
                    {
                        name: e_taskType.NEXTPNR_PNR,
                        label: 'Run Place & Route',
                        executionType: e_taskExecutionType.COMPLEXCOMMAND,
                        icon: 'run',
                        status: e_taskState.IDLE
                    },
                    {
                        name: e_taskType.NEXTPNR_GUI,
                        label: 'Open GUI',
                        executionType: e_taskExecutionType.COMPLEXCOMMAND,
                        icon: 'chip',
                        status: e_taskState.IDLE
                    },
                    {
                        name: e_taskType.NEXTPNR_REPORT,
                        label: 'Utilization & Timing',
                        executionType: e_taskExecutionType.COMPLEXCOMMAND,
                        icon: 'report',
                        status: e_taskState.IDLE
                    }
                ]
            }
        ]);
    });

    it('provides the same grouped task tree for stable ECP5', () => {
        const tasks = getTaskList(
            e_tools_general_select_tool.nextpnr,
            e_tools_nextpnr_target_family.ecp5
        );

        expect(tasks.map(task => task.name)).toEqual([
            e_taskType.OPENFOLDER,
            e_taskType.NEXTPNR_PNR_GROUP
        ]);
        expect(tasks[1].executionType).toBe(e_taskExecutionType.DISPLAYGROUP);
        expect(tasks[1].children?.map(task => task.name)).toEqual([
            e_taskType.NEXTPNR_PNR,
            e_taskType.NEXTPNR_GUI,
            e_taskType.NEXTPNR_REPORT
        ]);
    });

    it.each([
        undefined,
        e_tools_nextpnr_target_family.generic
    ])('provides a flat tree for generic or undefined target (%s)', (targetFamily) => {
        expect(getTaskList(e_tools_general_select_tool.nextpnr, targetFamily)).toEqual([
            {
                name: e_taskType.OPENFOLDER,
                label: 'Open Project Folder',
                executionType: e_taskExecutionType.OPENFOLDER
            },
            {
                name: e_taskType.NEXTPNR_PNR,
                label: 'Run Place & Route',
                executionType: e_taskExecutionType.COMPLEXCOMMAND,
                status: e_taskState.IDLE
            }
        ]);
    });

    it('ignores target family for other tools', () => {
        expect(getTaskList(
            e_tools_general_select_tool.nvc,
            e_tools_nextpnr_target_family.ice40
        )).toEqual(getTaskList(e_tools_general_select_tool.nvc));
    });
});