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

import * as vscode from 'vscode';
import * as os from 'os';
import * as path_lib from 'path';
import { Project_manager } from './project/manager';
import { Source_manager } from './source/manager';
import { TreeDependencyManager } from './dependency/manager';
import { Runs_manager } from './runs/manager';
import { Tasks_manager } from './tasks/manager';
import { IpCatalogManager } from './ip-catalog/manager';
import { Actions_manager } from './actions/manager';
import { Run_output_manager } from './run_output';
import { Watcher_manager } from './watchers/manager';
import { Output_manager } from './output/manager';
import { debugLogger } from '../../logger';
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import { Schematic_manager } from '../schematic';
import { Dependency_manager } from '../dependency';
import { LogView } from '../views/logs';
import { TimingReportView } from '../views/timing/timing_report';
import { e_event, ProjectEmitter } from 'colibri/project_manager/projectEmitter';
import * as utils from '../utils/utils';
import * as file_utils from 'colibri/utils/file_utils';

let run_output: Run_output_manager = new Run_output_manager();
let multi_manager: Multi_project_manager;
let viewList: any[] = [];

export class Tree_view_manager {
    private statusbar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

    constructor(
        context: vscode.ExtensionContext,
        manager: Multi_project_manager,
        emitterProject: ProjectEmitter,
        schematic_manager: Schematic_manager,
        dependency_manager: Dependency_manager,
        logView: LogView,
        timingReportView: TimingReportView,
        private rustHDLFilePath: string,
        private veribleLSFilePath: string
    ) {
        context.subscriptions.push(this.statusbar);
        multi_manager = manager;

        viewList = [
            new Project_manager(context, manager, emitterProject, run_output),
            new Source_manager(context, manager),
            new TreeDependencyManager(context, manager, schematic_manager, dependency_manager),
            new Runs_manager(context, manager, run_output, emitterProject),
            new Tasks_manager(context, manager, logView, emitterProject, timingReportView),
            new IpCatalogManager(context, manager),
            new Actions_manager(context),
            new Watcher_manager(context, manager),
            new Output_manager(context, manager, run_output)
        ];

        emitterProject.addProjectListener(this.runRefresh);
        emitterProject.addProjectListener(
            (projectName: string, eventType: e_event) => this.refreshToml(projectName, eventType)
        );

        emitterProject.enable();
        emitterProject.emitEvent('', e_event.GLOBAL_REFRESH);
    }

    private async runRefresh(projectName: string, eventType: e_event): Promise<void> {
        if (eventType === e_event.STDOUT_INFO) {
            debugLogger.info(projectName);
            return;
        }
        if (eventType === e_event.STDOUT_WARNING) {
            debugLogger.warn(projectName);
            debugLogger.show();
            return;
        }
        if (eventType === e_event.STDOUT_ERROR) {
            debugLogger.error(projectName);
            debugLogger.show();
            return;
        }

        if (eventType === e_event.SAVE_SETTINGS) {
            vscode.commands.executeCommand('teroshdl.configuration.refresh');
        }

        for (const view of viewList) {
            if (view.getRefreshEventList().includes(eventType)) {
                await view.refresh_tree();
            }
        }
        multi_manager.save();
    }

    private async refreshToml(projectName: string, eventType: e_event): Promise<void> {
        const refuseRefreshEventList = [
            e_event.EXEC_RUN,
            e_event.FINISH_RUN,
            e_event.UPDATE_TASK,
            e_event.STDOUT_INFO,
            e_event.STDOUT_WARNING,
            e_event.STDOUT_ERROR,
            e_event.ADD_PROJECT
        ];

        const allowedRefreshEventList = [e_event.SELECT_PROJECT, e_event.SAVE_SETTINGS];

        if (refuseRefreshEventList.includes(eventType)) {
            return;
        }

        try {
            const selectedProject = multi_manager.get_selected_project().get_name();
            if (projectName === '' || selectedProject === projectName || allowedRefreshEventList.includes(eventType)) {
                forceRefresh(this.rustHDLFilePath, this.veribleLSFilePath);
            }
        } catch (error) {
            return;
        }
    }
}

export function forceRefresh(rustHDLFilePath: string, veribleLSFilePath: string): void {
    if (!multi_manager) {
        return;
    }

    try {
        const config = utils.getConfig(multi_manager);
        const hdlVersion = config.linter.vhdlls.standard.replace('v', '');

        const ignoreVunit = config.linter.vhdlls.ignoreVunit;
        const vunitPath = config.linter.vhdlls.vunitPath;
        const ignorePaths = config.linter.vhdlls.ignorePaths;
        const thirdPartyPaths = config.linter.vhdlls.thirdPartyPaths;
        const libraries = [...config.linter.vhdlls.libraries];

        // Migrate the legacy unisimPath setting (a single path string) to the
        // generic libraries table.
        const legacy_unisim_path = (config as any).linter?.vhdlls?.unisimPath;
        if (typeof legacy_unisim_path === "string" && legacy_unisim_path !== "") {
            libraries.push({ name: "UNISIM", path: legacy_unisim_path });
        }

        const oldPathList = [
            path_lib.join(os.homedir(), '.vhdl_ls.toml'),
            path_lib.join(os.homedir(), '.verible-teroshdl.filelist')
        ];

        for (const oldPath of oldPathList) {
            if (file_utils.check_if_path_exist(oldPath)) {
                file_utils.remove_file(oldPath);
            }
        }

        multi_manager.get_selected_project().save_toml(rustHDLFilePath, hdlVersion, ignoreVunit, vunitPath,
            libraries, ignorePaths, thirdPartyPaths);

        multi_manager
            .get_selected_project()
            .saveFileList(veribleLSFilePath, hdlVersion, ignoreVunit, vunitPath);

        vscode.commands.executeCommand('teroshdl.vhdlls.restart');
        vscode.commands.executeCommand('teroshdl.verible.restart');
    } catch (error) {
        return;
    }
}
