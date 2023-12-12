// This code only can be used for Quartus boards
import { TaskStateManager } from '../taskState';
import { e_taskState, e_taskType } from '../common';
import { check_if_path_exist } from '../../../utils/file_utils';
import { openDatabase, closeDatabase, execQuery } from '../../utils/utils';

const taskNameInBBDD: Record<string, e_taskType> = {
    "Full Compilation": e_taskType.QUARTUS_COMPILEDESIGN,
    "IP Generation Tool": e_taskType.QUARTUS_IPGENERATION,
    "Analysis & Synthesis": e_taskType.QUARTUS_ANALYSISSYNTHESIS,
    "Analysis & Elaboration": e_taskType.QUARTUS_ANALYSISELABORATION,
    "Synthesis": e_taskType.QUARTUS_SYNTHESIS,
    "Early Timing Analysis": e_taskType.QUARTUS_EARLYTIMINGANALYSIS,
    "Fitter": e_taskType.QUARTUS_FITTER,
    "Fitter (Implement)": e_taskType.QUARTUS_FITTERIMPLEMENT,
    "Plan": e_taskType.QUARTUS_PLAN,
    "Place": e_taskType.QUARTUS_PLACE,
    "Route": e_taskType.QUARTUS_ROUTE,
    "Fitter (Finalize)": e_taskType.QUARTUS_FITTERFINALIZE,
    "Timing Analysis (Finalize)": e_taskType.QUARTUS_TIMING,
};

/**
 * Clean all the tasks
 * @param taskManager Task manager
 */
function cleanAll(taskManager: TaskStateManager) {
    const taskToClean = Object.values(e_taskType);
    for (const task of taskToClean) {
        taskManager.updateTask(task, e_taskState.IDLE, undefined, undefined, undefined);
    }
}

/**
 * Clean list of tasks
 * @param taskManager Task manager
 */
function cleanList(taskManager: TaskStateManager, taskToClean: e_taskType[]) {
    for (const task of taskToClean) {
        taskManager.updateTask(task, e_taskState.IDLE, undefined, undefined, undefined);
    }
}

/**
 * Set the status of the tasks
 * @param taskManager Task manager
 * @param bbddPath Path to the database
*/
export async function setStatus(taskManager: TaskStateManager, bbddPath: string,
    deleteRunning: boolean): Promise<void> {
    if (!check_if_path_exist(bbddPath)) {
        cleanAll(taskManager);
        return;
    }

    const db = await openDatabase(bbddPath);
    try {
        const rows: any[] = await execQuery(db, 'SELECT * FROM status');
        const taskToClean = Object.values(e_taskType);

        if (rows.length > 0) {
            for (const row of <any[]>rows) {
                let status = row.status === "done" ? e_taskState.FINISHED : e_taskState.RUNNING;
                const percent = parseInt(row.percent);
                const success = row.success === 1;
                const elapsed_time = parseInt(row.elapsed_time);

                if (row.status === "done" && row.success === 0) {
                    status = e_taskState.FAILED;
                }

                const name = row.name;
                if (name in taskNameInBBDD) {
                    const taskType = taskNameInBBDD[name];

                    if (row.status === "running" && parseInt(row.percent) > 0
                        && parseInt(row.errors) === 0 && parseInt(row.success) === 0) {
                        taskManager.setCurrentTask(taskNameInBBDD[row.name]);
                    }

                    if (!deleteRunning || row.status !== "running") {
                        if (taskToClean.includes(taskType)) {
                            taskToClean.splice(taskToClean.indexOf(taskType), 1);
                        }
                        taskManager.updateTask(taskType, status, percent, success, elapsed_time);
                    }
                }
            }
            cleanList(taskManager, taskToClean);
        }
        else {
            cleanAll(taskManager);
        }
        await closeDatabase(db);
    } catch (error) {
        cleanAll(taskManager);
    }
}