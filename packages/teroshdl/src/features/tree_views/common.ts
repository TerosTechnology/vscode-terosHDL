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

import * as teroshdl2 from 'teroshdl2';

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
}

export const REFRESHLIST: Record<e_viewType, teroshdl2.project_manager.projectEmitter.e_event[]> = {
    [e_viewType.ACTIONS]: [
    ],
    [e_viewType.DEPENDENCY]: [
        teroshdl2.project_manager.projectEmitter.e_event.PROJECT_CHANGED,
        teroshdl2.project_manager.projectEmitter.e_event.GLOBAL_REFRESH,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.REMOVE_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.ADD_LIBRARY,
        teroshdl2.project_manager.projectEmitter.e_event.DELETE_LIBRARY,
        teroshdl2.project_manager.projectEmitter.e_event.ADD_SOURCE,
        teroshdl2.project_manager.projectEmitter.e_event.DELETE_SOURCE,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_TOPLEVEL,
        teroshdl2.project_manager.projectEmitter.e_event.SAVE_SETTINGS,
    ],
    [e_viewType.IP_CATALOG]: [
        teroshdl2.project_manager.projectEmitter.e_event.GLOBAL_REFRESH,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.REMOVE_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.SAVE_SETTINGS,
    ],
    [e_viewType.OUTPUT]: [
        teroshdl2.project_manager.projectEmitter.e_event.GLOBAL_REFRESH,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.REMOVE_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.EXEC_RUN,
        teroshdl2.project_manager.projectEmitter.e_event.FINISH_RUN,
    ],
    [e_viewType.PROJECT]: [
        teroshdl2.project_manager.projectEmitter.e_event.GLOBAL_REFRESH,
        teroshdl2.project_manager.projectEmitter.e_event.ADD_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.REMOVE_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.RENAME_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_PROJECT,
    ],
    [e_viewType.RUNS]: [
        teroshdl2.project_manager.projectEmitter.e_event.PROJECT_CHANGED,
        teroshdl2.project_manager.projectEmitter.e_event.GLOBAL_REFRESH,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_TOPLEVEL_TESTBENCH,
        teroshdl2.project_manager.projectEmitter.e_event.REMOVE_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_TOPLEVEL,
        teroshdl2.project_manager.projectEmitter.e_event.EXEC_RUN,
        teroshdl2.project_manager.projectEmitter.e_event.FINISH_RUN,
        teroshdl2.project_manager.projectEmitter.e_event.SAVE_SETTINGS,
    ],
    [e_viewType.SOURCE]: [
        teroshdl2.project_manager.projectEmitter.e_event.PROJECT_CHANGED,
        teroshdl2.project_manager.projectEmitter.e_event.GLOBAL_REFRESH,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.REMOVE_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.ADD_LIBRARY,
        teroshdl2.project_manager.projectEmitter.e_event.DELETE_LIBRARY,
        teroshdl2.project_manager.projectEmitter.e_event.ADD_SOURCE,
        teroshdl2.project_manager.projectEmitter.e_event.DELETE_SOURCE,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_TOPLEVEL,
    ],
    [e_viewType.TASKS]: [
        teroshdl2.project_manager.projectEmitter.e_event.GLOBAL_REFRESH,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.REMOVE_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.UPDATE_TASK,
        teroshdl2.project_manager.projectEmitter.e_event.SAVE_SETTINGS,
    ],
    [e_viewType.WATCHERS]: [
        teroshdl2.project_manager.projectEmitter.e_event.PROJECT_CHANGED,
        teroshdl2.project_manager.projectEmitter.e_event.GLOBAL_REFRESH,
        teroshdl2.project_manager.projectEmitter.e_event.SELECT_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.REMOVE_PROJECT,
        teroshdl2.project_manager.projectEmitter.e_event.ADD_WATCHER,
        teroshdl2.project_manager.projectEmitter.e_event.REMOVE_WATCHER,
        teroshdl2.project_manager.projectEmitter.e_event.SAVE_SETTINGS,
    ],
};
