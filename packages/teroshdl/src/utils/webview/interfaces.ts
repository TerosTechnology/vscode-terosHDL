// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
//
// This file is part of TerosHDL
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

export interface IChangeType {
  children: Array<{
    text: string;
  }>;
}
export interface IPost {
  title: string;
  version: string;
  fixed: IChangeType[];
  new: IChangeType[];
  breaking: IChangeType[];
}
export interface IPostNormalized {
  title: string;
  version: string;
  fixed: string[];
  new: string[];
  breaking: string[];
}
export interface ISettingsChangedMessage {
  type: 'settingsChanged';
  config: Record<string, unknown>;
}

export interface ISaveSettingsMessage {
  type: 'saveSettings';
  changes: {
    [key: string]: any;
  };
  removes: string[];
  scope: 'user' | 'workspace';
  uri: string;
}

export type Message = ISaveSettingsMessage | ISettingsChangedMessage;
export type Invalidates = 'all' | 'config' | undefined;

export interface IBootstrap {
  config: Record<string, unknown>;
}

export interface ISettingsBootstrap extends IBootstrap {
  scope: 'user' | 'workspace';
  scopes: Array<['user' | 'workspace', string]>;
  defaults: Record<string, unknown>;
}

declare global {
  interface Window {
    bootstrap: IBootstrap | ISettingsBootstrap | Record<string, unknown>;
  }
}