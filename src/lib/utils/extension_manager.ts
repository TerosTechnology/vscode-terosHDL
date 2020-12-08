import { extensions, workspace, window, Uri } from 'vscode';
import { posix } from 'path';
import { CONFIG_FILE_NAME, USER_CONFIG_FILE_NAME, TEROS_HDL_EXT_ID } from './envs';

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
  update_config: (config: Partial<teros_hdl_config>) => Promise<void>;
}

class Extension_manager implements IExtensionManager {
  installationType: InstallationType;
  private readonly configFileUri: Uri;
  private readonly userConfigFileUri: Uri;
  private configJSON: teros_hdl_config;

  constructor() {
    const extensionFolderUri = Uri.file(extensions.getExtension(TEROS_HDL_EXT_ID).extensionPath);
    this.configFileUri = extensionFolderUri.with({ path: posix.join(extensionFolderUri.path, CONFIG_FILE_NAME) });
    this.userConfigFileUri = extensionFolderUri.with({ path: posix.join(extensionFolderUri.path, USER_CONFIG_FILE_NAME) });
  }

  get_package_json(): PackageJSON {
    return extensions.getExtension(TEROS_HDL_EXT_ID).packageJSON;
  }

  get_config(): teros_hdl_config {
    return this.configJSON;
  }

  get_installation_type(): InstallationType {
    return this.installationType;
  }

  async update_config(config: Partial<teros_hdl_config>): Promise<void> {
    const newConfig = { ...this.configJSON, ...config };
    await workspace.fs.writeFile(this.configFileUri, Buffer.from(JSON.stringify(newConfig), 'utf-8'));
  }

  async init(): Promise<void> {
    try {
      const packageJSON = this.get_package_json();
      const userConfig = await this.get_user_config();
      this.installationType = {
        update: userConfig && this.is_version_update(userConfig),
        firstInstall: !userConfig
      };

      const configBuffer = await workspace.fs.readFile(this.configFileUri);
      const configContent = Buffer.from(configBuffer).toString('utf8');

      this.configJSON = JSON.parse(configContent) as teros_hdl_config;

      const userConfigUpdate = { ...this.configJSON, changelog: { lastversion: packageJSON.version } };
      await workspace.fs.writeFile(
        this.userConfigFileUri,
        Buffer.from(JSON.stringify(userConfigUpdate), 'utf-8')
      );
    } catch (error) {
      this.configJSON = { accentsProperties: {}, accents: {} };
      await window
        .showErrorMessage(`TerosHDL: there was an error while loading the configuration. Please retry or open an issue: ${String(error)}`);
    }
  }

  private is_version_update(userConfig: teros_hdl_config): boolean {
    const splitVersion = (input: string): { major: number; minor: number; patch: number } => {
      const [major, minor, patch] = input.split('.').map(i => parseInt(i, 10));
      return { major, minor, patch };
    };

    const packageJSON = this.get_package_json();

    const versionCurrent = splitVersion(packageJSON.version);
    const versionOld = splitVersion(userConfig.changelog.lastversion);

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

export const extensionManager = new Extension_manager();