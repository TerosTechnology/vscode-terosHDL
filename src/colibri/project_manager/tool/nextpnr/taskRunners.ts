import { ChildProcess } from 'child_process';
import { p_result } from '../../../process/common';
import { t_project_definition } from '../../project_definition';
import * as file_utils from '../../../utils/file_utils';
import { e_taskType } from '../common';
import { runNextpnrGui, runNextpnrPnR } from './tasks';

/** Dispatch nextpnr task types to their task implementations. */
export function runTaskNextpnr(
	taskType: e_taskType,
	projectDefinition: t_project_definition,
	callback: (result: p_result) => void
): ChildProcess | undefined {
	if (!file_utils.check_if_path_exist(projectDefinition.project_disk_path)) {
		file_utils.create_directory(projectDefinition.project_disk_path);
	}

	switch (taskType) {
		case e_taskType.NEXTPNR_PNR:
			return runNextpnrPnR(projectDefinition, callback);

		case e_taskType.NEXTPNR_GUI:
			return runNextpnrGui(projectDefinition, callback);

		default: {
			const result: p_result = {
				command: '',
				stdout: '',
				stderr: `Unsupported nextpnr task type: ${taskType}`,
				return_value: 1,
				successful: false
			};
			setTimeout(() => callback(result), 0);
			return undefined;
		}
	}
}

export { runNextpnrPnR, runNextpnrGui } from './tasks';
export { buildNextpnrArgs, NextpnrCommandType } from './commandBuilder';
export { getBinary, executeCommand } from './executor';
export { getConstraintsFile, validateJsonFile } from './utils';
