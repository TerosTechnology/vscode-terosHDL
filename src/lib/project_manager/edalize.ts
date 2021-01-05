import * as vscode from 'vscode';
const net = require('net');

export class Edalize {
  private output_channel;
  private client;

  constructor() {
    let PORT = 1337;

    this.output_channel = vscode.window.createOutputChannel('TerosHDL');
    this.client = new net.Socket();
    this.client.connect(PORT, '127.0.0.1');
  }

  simulate() {
    this.output_channel.clear();

    let element = this;
    this.client.on('data', function (data) {
      element.output_channel.append(data);
      element.output_channel.show();
    });
  }

}