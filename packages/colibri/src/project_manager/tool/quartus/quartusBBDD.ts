// This code only can be used for Quartus boards
import { Database } from 'sqlite3';
import { TaskStateManager } from '../taskState';
import { e_taskState, e_taskType } from '../common';

const taskNameInBBDD: Record<string, e_taskType> = {
    "Full Compilation": e_taskType.QUARTUS_COMPILEDESIGN,
    "IP Generation Tool": e_taskType.QUARTUS_IPGENERATION,
    "Analysis & Synthesis": e_taskType.QUARTUS_ANALYSISSYNTHESIS,
    "Analysis & Elaboration": e_taskType.QUARTUS_ANALYSISELABORATION,
    "Synthesis": e_taskType.QUARTUS_SYNTHESIS,
    "none1": e_taskType.QUARTUS_EARLYTIMINGANALYSIS,
    "Fitter": e_taskType.QUARTUS_FITTER,
    "none2": e_taskType.QUARTUS_FITTERIMPLEMENT,
    "Plan": e_taskType.QUARTUS_PLAN,
    "Place": e_taskType.QUARTUS_PLACE,
    "Route": e_taskType.QUARTUS_ROUTE,
    "Fitter (Finalize)": e_taskType.QUARTUS_FITTERFINALIZE,
    "none3": e_taskType.QUARTUS_TIMING,
};

export function setStatus(taskManager: TaskStateManager, bbddPath: string): void {
    const db = new Database(bbddPath, (err) => {
        if (err) {
            taskManager.cleanAll();
        }
    });

    // Ejecuta una consulta
    db.serialize(() => {
        db.each('SELECT * FROM status', (err, row: any) => {
            if (err) {
                taskManager.cleanAll();
            } else {
                const status = row.status === "done" ? e_taskState.FINISHED : e_taskState.RUNNING;
                const percent = parseInt(row.percent);
                const success = row.success === 1;
                const elapsed_time = parseInt(row.elapsed_time);

                const name = row.name;
                if (name in taskNameInBBDD) {
                    const taskType = taskNameInBBDD[name];
                    taskManager.updateTask(taskType, status, percent, success, elapsed_time);
                }
            }
        });
    });

    // Cierra la base de datos
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conexión a la base de datos cerrada');
    });
}