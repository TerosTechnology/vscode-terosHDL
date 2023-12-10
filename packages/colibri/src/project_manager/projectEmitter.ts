// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri
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

import events = require("events");

export enum e_event {
    GLOBAL_REFRESH = "global_refresh",
    // Project
    ADD_PROJECT = "add_project",
    REMOVE_PROJECT = "remove_project",
    RENAME_PROJECT = "rename_project",
    SELECT_PROJECT = "select_project",
    // Sources
    ADD_LIBRARY = "add_library",
    DELETE_LIBRARY = "delete_library",
    ADD_SOURCE = "add_source",
    DELETE_SOURCE = "delete_source",
    SELECT_TOPLEVEL = "select_toplevel",
    // Watchers
    ADD_WATCHER = "add_watcher",
    REMOVE_WATCHER = "remove_watcher",
    WATCHER_LOADING = "watcher_loading",
    WATCHER_FINISHED = "watcher_finished",
    // Runs
    EXEC_RUN = "exec_run",
    FINISH_RUN = "finish_run",
    // Tasks
    UPDATE_TASK = "update_task",
    FINISH_TASK = "finish_task",
    // Settings
    SAVE_SETTINGS = "save_settings",
    // Common
    STDOUT_INFO = "stdout_info",
    STDOUT_ERROR = "stdout_error",
    STDOUT_WARNING = "stdout_warning",
}

export class ProjectEmitter {
    private eventEmitter : events.EventEmitter = new events.EventEmitter();
    private isEnable = false;

    public emitEvent(projectName: string | undefined, eventType: e_event): boolean {
        if (!this.isEnable) {
            return false;
        }
        this.eventEmitter.emit("projectEvent", projectName, eventType);
        return true;
    }

    public emitEventLog(log: string, eventType: e_event): boolean {
        return this.emitEvent(log, eventType);
    }

    public addProjectListener(listener: (projectName: string, eventType: e_event) => Promise<void>): void {
        this.eventEmitter.addListener("projectEvent" , listener);
    }

    public enable(): void {
        this.isEnable = true;
    }

    public disable(): void {
        this.isEnable = false;
    }
}
