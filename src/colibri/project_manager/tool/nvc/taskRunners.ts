import { p_result } from 'colibri/process/common';
import { e_taskType } from '../common';
import { ChildProcess } from 'child_process';
import { t_project_definition } from 'colibri/project_manager/project_definition';
import {
    runnvcAnalyze,
    runnvcElaborate,
    runnvcSimulate,
    runnvcAll,
    runnvcSynthesize,
    runnvcCheckSyntax,
    runnvcMakefile
} from './tasks';
import * as file_utils from 'colibri/utils/file_utils';

/**
 * Main entry point for nvc task execution
 */

/**
 * Main function to run nvc tasks based on task type
 * @param taskType Type of nvc task to execute
 * @param projectDefinition Project definition containing files and configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runTasknvc(
    taskType: e_taskType,
    projectDefinition: t_project_definition,
    callback: (result: p_result) => void
): ChildProcess {
    if (!file_utils.check_if_path_exist(projectDefinition.project_disk_path)) {
        file_utils.create_directory(projectDefinition.project_disk_path);
    }

    switch (taskType) {
        case e_taskType.NVC_ANALYZE:
            return runnvcAnalyze(projectDefinition, callback);

        case e_taskType.NVC_ELABORATE:
            return runnvcElaborate(projectDefinition, callback);

        case e_taskType.NVC_SIMULATE:
            return runnvcSimulate(projectDefinition, callback);

        case e_taskType.NVC_RUN_ALL:
            return runnvcAll(projectDefinition, callback);

        case e_taskType.NVC_SYNTHESIZE:
            return runnvcSynthesize(projectDefinition, callback);

        case e_taskType.NVC_CHECK_SYNTAX:
            return runnvcCheckSyntax(projectDefinition, callback);

        case e_taskType.NVC_MAKEFILE:
            return runnvcMakefile(projectDefinition, callback);

        default:
            const result: p_result = {
                command: '',
                stdout: '',
                stderr: `Unsupported nvc task type: ${taskType}`,
                return_value: 1,
                successful: false
            };
            setTimeout(() => callback(result), 0);
            return {} as ChildProcess;
    }
}

// Re-export utilities for external use if needed
export { buildnvcArgs, nvcCommandType, nvcCommandArgs } from './commandBuilder';
export { getBinary, executenvcCommand, executeCommand } from './executor';
export { getTopLevel, getVhdlFiles, groupFilesByLibrary } from './utils';
