import { ChildProcess } from 'child_process';
import { p_result } from '../../../process/common';
import { t_project_definition } from '../../project_definition';
import * as file_utils from '../../../utils/file_utils';
import { e_tools_nextpnr_target_family } from '../../../config/config_declaration';
import { e_taskType } from '../common';
import { runNextpnrGui, runNextpnrPack, runNextpnrPnR } from './tasks';
import { LoggerBase } from '../../../logger/logger';

/** Dispatch nextpnr task types to their task implementations. */
export function runTaskNextpnr(
	taskType: e_taskType,
	projectDefinition: t_project_definition,
	toolLogger: LoggerBase,
	callback: (result: p_result) => void
): ChildProcess | undefined {
	if (!file_utils.check_if_path_exist(projectDefinition.project_disk_path)) {
		file_utils.create_directory(projectDefinition.project_disk_path);
	}
	const targetFamily = projectDefinition.config.tools.nextpnr.target_family;
	const stableTarget = targetFamily === e_tools_nextpnr_target_family.ice40 ||
		targetFamily === e_tools_nextpnr_target_family.ecp5;
	if (!stableTarget && (
		taskType === e_taskType.NEXTPNR_GUI ||
		taskType === e_taskType.NEXTPNR_PACK
	)) {
		const result: p_result = {
			command: '',
			stdout: '',
			stderr: `Unsupported nextpnr task type for target family ${targetFamily}: ${taskType}`,
			return_value: 1,
			successful: false
		};
		toolLogger.appendLine(`[nextpnr] Error: ${result.stderr}`);
		setTimeout(() => callback(result), 0);
		return undefined;
	}

	switch (taskType) {
		case e_taskType.NEXTPNR_PNR:
			return runNextpnrPnR(projectDefinition, toolLogger, callback);
		case e_taskType.NEXTPNR_PACK:
			return runNextpnrPack(projectDefinition, toolLogger, callback);
		case e_taskType.NEXTPNR_GUI:
			return runNextpnrGui(projectDefinition, toolLogger, callback);
		default: {
			const result: p_result = {
				command: '',
				stdout: '',
				stderr: `Unsupported nextpnr task type: ${taskType}`,
				return_value: 1,
				successful: false
			};
			toolLogger.appendLine(`[nextpnr] Error: ${result.stderr}`);
			setTimeout(() => callback(result), 0);
			return undefined;
		}
	}
}

export { runNextpnrPnR } from './tasks';
export { runNextpnrPack, runNextpnrGui } from './tasks';
export { buildNextpnrArgs } from './commandBuilder';
export { getBinary, getPackerBinary, executeCommand, executeBinary } from './executor';
export { getConstraintsFile, validateJsonFile } from './utils';
