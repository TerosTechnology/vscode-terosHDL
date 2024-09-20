// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import { e_event } from 'colibri/project_manager/projectEmitter';

export enum e_viewType {
    ACTIONS,
    DEPENDENCY,
    IP_CATALOG,
    PROJECT,
    OUTPUT,
    RUNS,
    SOURCE,
    TASKS,
    WATCHERS,
    TIMING,
}

export const REFRESHLIST: Record<e_viewType, e_event[]> = {
    [e_viewType.ACTIONS]: [
    ],
    [e_viewType.TIMING]: [
    ],
    [e_viewType.DEPENDENCY]: [
        e_event.PROJECT_CHANGED,
        e_event.GLOBAL_REFRESH,
        e_event.SELECT_PROJECT,
        e_event.REMOVE_PROJECT,
        e_event.ADD_LIBRARY,
        e_event.DELETE_LIBRARY,
        e_event.ADD_SOURCE,
        e_event.DELETE_SOURCE,
        e_event.SELECT_TOPLEVEL,
        e_event.SAVE_SETTINGS,
    ],
    [e_viewType.IP_CATALOG]: [
        e_event.GLOBAL_REFRESH,
        e_event.SELECT_PROJECT,
        e_event.REMOVE_PROJECT,
        e_event.SAVE_SETTINGS,
    ],
    [e_viewType.OUTPUT]: [
        e_event.GLOBAL_REFRESH,
        e_event.SELECT_PROJECT,
        e_event.REMOVE_PROJECT,
        e_event.EXEC_RUN,
        e_event.FINISH_RUN,
    ],
    [e_viewType.PROJECT]: [
        e_event.GLOBAL_REFRESH,
        e_event.ADD_PROJECT,
        e_event.REMOVE_PROJECT,
        e_event.RENAME_PROJECT,
        e_event.SELECT_PROJECT,
    ],
    [e_viewType.RUNS]: [
        e_event.PROJECT_CHANGED,
        e_event.GLOBAL_REFRESH,
        e_event.SELECT_PROJECT,
        e_event.SELECT_TOPLEVEL_TESTBENCH,
        e_event.REMOVE_PROJECT,
        e_event.SELECT_TOPLEVEL,
        e_event.EXEC_RUN,
        e_event.FINISH_RUN,
        e_event.SAVE_SETTINGS,
    ],
    [e_viewType.SOURCE]: [
        e_event.PROJECT_CHANGED,
        e_event.GLOBAL_REFRESH,
        e_event.SELECT_PROJECT,
        e_event.REMOVE_PROJECT,
        e_event.ADD_LIBRARY,
        e_event.DELETE_LIBRARY,
        e_event.ADD_SOURCE,
        e_event.DELETE_SOURCE,
        e_event.SELECT_TOPLEVEL,
    ],
    [e_viewType.TASKS]: [
        e_event.GLOBAL_REFRESH,
        e_event.SELECT_PROJECT,
        e_event.REMOVE_PROJECT,
        e_event.UPDATE_TASK,
        e_event.SAVE_SETTINGS,
    ],
    [e_viewType.WATCHERS]: [
        e_event.PROJECT_CHANGED,
        e_event.GLOBAL_REFRESH,
        e_event.SELECT_PROJECT,
        e_event.REMOVE_PROJECT,
        e_event.ADD_WATCHER,
        e_event.REMOVE_WATCHER,
        e_event.SAVE_SETTINGS,
    ],
};
