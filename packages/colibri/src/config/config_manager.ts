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

import {
    get_default_config, e_config, get_config_from_json
} from './config_declaration';
import { WEB_CONFIG } from "./config_web";
import { read_file_sync, save_file_sync } from "../utils/file_utils";

export class ConfigManager {
    private config: e_config;

    constructor(config: e_config) {
        this.config = config;
    }

    public set_config(config: e_config) {
        this.config = config;
    }

    public get_config(): e_config {
        return this.config;
    }
}

export class GlobalConfigManager extends ConfigManager {
    private static instance: GlobalConfigManager;

    public static newInstance(sync_file_path: string) {
        GlobalConfigManager.instance = new GlobalConfigManager(sync_file_path, get_default_config());
        return GlobalConfigManager.getInstance();
    }

    public static getInstance(): GlobalConfigManager {
        if (!GlobalConfigManager.instance) {
            throw Error("You need to create the GlobalConfigManager instance first using newInstance method.");
        }
        return GlobalConfigManager.instance;
    }

    public static get_html(): string {
        return WEB_CONFIG;
    }

    private sync_file_path = "";

    private constructor(sync_file_path: string, config: e_config) {
        super(config);
        this.sync_file_path = sync_file_path;
    }

    public load() {
        const file_content = read_file_sync(this.sync_file_path);
        const config_saved = JSON.parse(file_content);
        this.set_config(get_config_from_json(config_saved));
    }

    public save() {
        const config_string = JSON.stringify(this.get_config(), null, 4);
        save_file_sync(this.sync_file_path, config_string);
    }

}

