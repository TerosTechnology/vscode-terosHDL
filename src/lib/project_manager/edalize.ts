// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of TerosHDL.
//
// TerosHDL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// TerosHDL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

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