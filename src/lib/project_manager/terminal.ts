import * as vscode from 'vscode';


export class Terminal {
  terminal;

  constructor(context: vscode.ExtensionContext) {
    const writeEmitter = new vscode.EventEmitter<string>();
    const pty: vscode.Pseudoterminal = {
      onDidWrite: writeEmitter.event,
      open: () => { },
      close: () => { },
      handleInput: data => writeEmitter.fire(data === '\r' ? '\r\n' : data)
    };
    let terminal = vscode.window.createTerminal({ name: 'TerosHDL console', pty });
    terminal.sendText("hola");
    terminal.show(true);
  }

  open() {
    this.terminal.show();
  }
}