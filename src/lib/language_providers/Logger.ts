// The MIT License (MIT)

// Copyright (c) 2016 Masahiro H

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
        });
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