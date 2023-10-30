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

import { extensions, workspace, window, Uri } from 'vscode';
import { posix } from 'path';

// export const CONFIG_FILE_NAME = 'teros-hdl.config.json';
export const USER_CONFIG_FILE_NAME = 'user.teros-hdl.config.json';
export const TEROS_HDL_EXT_ID = 'teros-technology.teroshdl';

type teros_hdl_config = {
  accents: Record<string, string>;
  accentsProperties: Record<string, { alpha: number; value: null }>;
  changelog?: { lastversion?: string };
};

type PackageJSON = {
  version: string;
  contributes: {
    themes: Array<{
      label: string;
    }>;
  };
};

type InstallationType = {
  firstInstall: boolean;
  update: boolean;
};

export interface IExtensionManager {
  init: () => Promise<void>;
  get_package_json: () => PackageJSON;
  get_config: () => teros_hdl_config;
  get_installation_type: () => Record<string, unknown>;
}

export class ExtensionManager implements IExtensionManager {
  installationType!: InstallationType;
  private readonly userConfigFileUri: Uri;
  private configJSON!: teros_hdl_config;

  constructor() {
    let extension_path = <string>extensions.getExtension(TEROS_HDL_EXT_ID)?.extensionPath;
    const extensionFolderUri = Uri.file(extension_path);
    this.userConfigFileUri = extensionFolderUri.with({ path: posix.join(extensionFolderUri.path, USER_CONFIG_FILE_NAME) });
  }

  get_package_json(): PackageJSON {
    return extensions.getExtension(TEROS_HDL_EXT_ID)?.packageJSON;
  }

  get_config(): teros_hdl_config {
    return this.configJSON;
  }

  get_installation_type(): InstallationType {
    return this.installationType;
  }

  async init(): Promise<void> {
    try {
      const packageJSON = this.get_package_json();
      const userConfig = await this.get_user_config();
      let update = userConfig && this.is_version_update(userConfig);
      this.installationType = {
        update: <boolean>update,
        firstInstall: !userConfig
      };

      const userConfigUpdate = { ...this.configJSON, changelog: { lastversion: packageJSON.version } };
      await workspace.fs.writeFile(
        this.userConfigFileUri,
        Buffer.from(JSON.stringify(userConfigUpdate), 'utf-8')
      );
    } catch (error) {
      this.configJSON = { accentsProperties: {}, accents: {} };
    }
  }

  private is_version_update(userConfig: teros_hdl_config): boolean {
    const splitVersion = (input: string): { major: number; minor: number; patch: number } => {
      const [major, minor, patch] = input.split('.').map(i => parseInt(i, 10));
      return { major, minor, patch };
    };

    const packageJSON = this.get_package_json();

    const versionCurrent = splitVersion(packageJSON.version);
    let version = <string>userConfig.changelog?.lastversion;
    const versionOld = splitVersion(version);

    const update = (
      versionCurrent.major > versionOld.major ||
      versionCurrent.minor > versionOld.minor ||
      versionCurrent.patch > versionOld.patch
    );

    return update;
  }

  private async get_user_config(): Promise<teros_hdl_config | undefined> {
    try {
      const configBuffer = await workspace.fs.readFile(this.userConfigFileUri);
      const configContent = Buffer.from(configBuffer).toString('utf8');
      return JSON.parse(configContent) as teros_hdl_config;
    } catch { }
  }
}