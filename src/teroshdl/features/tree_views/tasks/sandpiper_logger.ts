import { e_event, ProjectEmitter } from "colibri/project_manager/projectEmitter";
import { toolLogger } from "../../../logger";

export function sandpiperLogger(emitterProject: ProjectEmitter) {
    emitterProject.addProjectListener(async (log: string, type: e_event) => {
        switch (type) {
            case e_event.STDOUT_INFO:
                toolLogger.appendLine(`INFO: ${log}`);
                break;
            case e_event.STDOUT_WARNING:
                toolLogger.appendLine(`WARNING: ${log}`);
                break;
            case e_event.STDOUT_ERROR:
                toolLogger.appendLine(`ERROR: ${log}`);
                break;
            default:
                toolLogger.appendLine(log);
        }
    });
}