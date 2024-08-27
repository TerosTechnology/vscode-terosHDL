import * as teroshdl2 from 'teroshdl2';
import { toolLogger } from "../../../logger";

export function sandpiperLogger(emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter) {
    emitterProject.addProjectListener(async (log: string, type: teroshdl2.project_manager.projectEmitter.e_event) => {
        switch (type) {
            case teroshdl2.project_manager.projectEmitter.e_event.STDOUT_INFO:
                toolLogger.appendLine(`INFO: ${log}`);
                break;
            case teroshdl2.project_manager.projectEmitter.e_event.STDOUT_WARNING:
                toolLogger.appendLine(`WARNING: ${log}`);
                break;
            case teroshdl2.project_manager.projectEmitter.e_event.STDOUT_ERROR:
                toolLogger.appendLine(`ERROR: ${log}`);
                break;
            default:
                toolLogger.appendLine(log);
        }
    });
}