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

import { t_watcher, t_action_result } from "../common";
import { Manager } from "./manager";
import * as chokidar from "chokidar";
import * as file_utils from "../../utils/file_utils";
import { ProjectEmitter, e_event } from "../projectEmitter";
import { Logger } from "../../logger/logger";

export class Watcher_manager extends Manager<t_watcher, undefined, string, string> {
    private watchers: t_watcher[] = [];
    private watcher_manager: chokidar.FSWatcher;
    private watcher_callback_update: (path: string) => void | Promise<void>;
    private update_promise: Promise<void> = Promise.resolve();

    constructor(
        watcher_callback_update: (path: string) => void | Promise<void>,
        private emitter: ProjectEmitter | undefined
    ) {
        super();
        this.watcher_callback_update = watcher_callback_update;
        this.watcher_manager = chokidar.watch([], {
            usePolling: true, interval: 2000, ignoreInitial: true
        });
        this.watcher_manager.on('change', path => this.request_refresh(path));
        this.watcher_manager.on('unlink', path => this.request_refresh(path));
        this.watcher_manager.on('add', path => this.request_refresh(path));
    }

    public refresh(path = ""): Promise<void> {
        const update = this.update_promise.then(() => this.watcher_callback_update(path));
        this.update_promise = update.then(() => undefined, () => undefined);
        return update;
    }

    private request_refresh(path: string): void {
        void this.refresh(path).catch((error: unknown) => {
            const message = `Error updating watchers: ${String(error)}`;
            if (!this.emitter?.emitEventLog(message, e_event.STDOUT_ERROR)) {
                Logger.logger.error(message);
            }
        });
    }

    clear(): void{
        this.watchers.forEach(watcher_inst => {
            this.watcher_manager.unwatch(watcher_inst.path);
        });
        this.watchers = [];
    }

    get(reference_path?: string): t_watcher[] {
        if (reference_path !== undefined) {
            return this.watchers.map(watcher => ({
                ...watcher,
                path: file_utils.get_relative_path(watcher.path, reference_path)
            }));
        }
        return this.watchers;
    }

    add(watcher: t_watcher): t_action_result {
        const result = this.add_without_update(watcher);
        if (result.successful) {
            this.request_refresh(watcher.path);
        }
        return result;
    }

    add_without_update(watcher: t_watcher): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(watcher.path)) {
            result.successful = false;
            result.msg = "The watcher is duplicated";
            return result;
        }
        this.watchers.push(watcher);
        this.watcher_manager.add(watcher.path);
        return result;
    }

    delete(watcher_path: string): t_action_result {
        const result: t_action_result = {
            result: "",
            successful: true,
            msg: ""
        };
        if (this.check_if_exists(watcher_path) === false) {
            result.successful = false;
            result.msg = "Watcher doesn't exist";
            return result;
        }

        const new_watchers: t_watcher[] = [];
        this.watchers.forEach(watcher_inst => {
            if (watcher_inst.path !== watcher_path) {
                new_watchers.push(watcher_inst);
            }
            else {
                this.watcher_manager.unwatch(watcher_path);
            }
        });
        this.watchers = new_watchers;
        this.request_refresh(watcher_path);
        return result;
    }

    private check_if_exists(path: string): boolean {
        for (let i = 0; i < this.watchers.length; i++) {
            const watcher = this.watchers[i];
            if (watcher.path === path) {
                return true;
            }
        }
        return false;
    }
}