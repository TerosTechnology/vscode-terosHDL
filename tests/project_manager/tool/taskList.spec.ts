import { e_tools_general_select_tool } from '../../../src/colibri/config/config_declaration';
import { e_taskExecutionType, e_taskState, e_taskType } from '../../../src/colibri/project_manager/tool/common';
import { getTaskList } from '../../../src/colibri/project_manager/tool/utils';

describe('getTaskList', () => {
    it('provides nextpnr P&R and GUI tasks in the task tree', () => {
        expect(getTaskList(e_tools_general_select_tool.nextpnr)).toEqual([
            {
                name: e_taskType.OPENFOLDER,
                label: 'Open Project Folder',
                executionType: e_taskExecutionType.OPENFOLDER
            },
            {
                name: e_taskType.NEXTPNR_PNR,
                label: 'Place and Route',
                executionType: e_taskExecutionType.COMPLEXCOMMAND,
                status: e_taskState.IDLE
            },
            {
                name: e_taskType.NEXTPNR_GUI,
                label: 'GUI',
                executionType: e_taskExecutionType.COMPLEXCOMMAND,
                status: e_taskState.IDLE
            }
        ]);
    });
});