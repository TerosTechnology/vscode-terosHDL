import {OutputChannel, workspace, window} from 'vscode'

const logChannel: OutputChannel = window.createOutputChannel("Verilog");

export enum Log_Severity {
    Info,
    Warn,
    Error,
    Command
}

export class Logger {

    isEnabled: boolean = false;

    constructor() {
        // Register for any changes to logging
        workspace.onDidChangeConfiguration(() => {
            this.CheckIfEnabled();
        })
        this.CheckIfEnabled();
    }

    CheckIfEnabled() {
        this.isEnabled = true;
    }

    log(msg: string, severity:Log_Severity = Log_Severity.Info) {
        if(this.isEnabled) {
            if(severity == Log_Severity.Command)
                logChannel.appendLine("> " + msg)
            else
                logChannel.appendLine("[" + Log_Severity[severity] + "] " + msg)
        }
    }

}