import * as vscode from 'vscode';
import { ProjectEmitter } from 'teroshdl2/out/project_manager/projectEmitter';
import { e_event } from 'teroshdl2/out/project_manager/projectEmitter';

const outputChannel = vscode.window.createOutputChannel('TL-Verilog Logs');

export function sandpiperLogger(emitterProject: ProjectEmitter) {
    emitterProject.addProjectListener(async (log: string, type: e_event) => {
        switch (type) {
            case e_event.STDOUT_INFO:
                outputChannel.appendLine(`INFO: ${log}`);
                break;
            case e_event.STDOUT_WARNING:
                outputChannel.appendLine(`WARNING: ${log}`);
                break;
            case e_event.STDOUT_ERROR:
                outputChannel.appendLine(`ERROR: ${log}`);
                break;
            default:
                outputChannel.appendLine(log);
        }
    });
}