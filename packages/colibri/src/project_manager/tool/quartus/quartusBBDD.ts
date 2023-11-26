// This code only can be used for Quartus boards
import { Database } from 'sqlite3';
import { TaskStateManager } from '../taskState';
import { e_taskState, e_taskType } from '../common';
import { check_if_path_exist } from '../../../utils/file_utils';

const taskNameInBBDD: Record<string, e_taskType> = {
    "Full Compilation": e_taskType.QUARTUS_COMPILEDESIGN,
    "IP Generation Tool": e_taskType.QUARTUS_IPGENERATION,
    "Analysis & Synthesis": e_taskType.QUARTUS_ANALYSISSYNTHESIS,
    "Analysis & Elaboration": e_taskType.QUARTUS_ANALYSISELABORATION,
    "Synthesis": e_taskType.QUARTUS_SYNTHESIS,
    "none1": e_taskType.QUARTUS_EARLYTIMINGANALYSIS,
    "Fitter": e_taskType.QUARTUS_FITTER,
    "Fitter (Implement)": e_taskType.QUARTUS_FITTERIMPLEMENT,
    "Plan": e_taskType.QUARTUS_PLAN,
    "Place": e_taskType.QUARTUS_PLACE,
    "Route": e_taskType.QUARTUS_ROUTE,
    "Fitter (Finalize)": e_taskType.QUARTUS_FITTERFINALIZE,
    "none3": e_taskType.QUARTUS_TIMING,
};

/**
 * Open the database and return the object
 * @param bbddPath Path to the database
 * @returns Promise with the database object
 */
function openDatabase(bbddPath: string) {
    return new Promise((resolve, reject) => {
        const db = new Database(bbddPath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}

/**
 * Close the database
 * @param db Database object
 */
async function closeDatabase(db: Database) {
    try {
        await new Promise<void>((resolve, reject) => {
            db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    } catch (error) { /* empty */ }
}

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
 * Set the status of the tasks
 * @param taskManager Task manager
 * @param bbddPath Path to the database
*/
export async function setStatus(taskManager: TaskStateManager, bbddPath: string): Promise<void> {
    if (!check_if_path_exist(bbddPath)) {
        cleanAll(taskManager);
    }

    const db = <Database>await openDatabase(bbddPath);
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM status', (err, rows) => {
                if (err) {
                    cleanAll(taskManager);
                    reject(err);
                }
                else { resolve(rows); }
            });
        });

        const taskToClean = Object.values(e_taskType);

        if (rows) {
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
                    if (taskToClean.includes(taskType)) {
                        taskToClean.splice(taskToClean.indexOf(taskType), 1);
                    }
                    taskManager.updateTask(taskType, status, percent, success, elapsed_time);
                }
            }
        }
        else {
            cleanAll(taskManager);
        }
        await closeDatabase(db);
    } catch (error) {
        cleanAll(taskManager);
    }
}