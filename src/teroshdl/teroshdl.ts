// Copyright 2024
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
import * as path_lib from 'path';

import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';

import { LanguageProviderManager } from './features/language_provider/language_provider';
import { Template_manager } from './features/templates';
import { Documenter_manager } from './features/documenter';
import { State_machine_manager } from './features/state_machine';
import { Schematic_manager } from './features/schematic';
import { Linter_manager } from './features/linter';
import { Formatter_manager } from './features/formatter';
import { Completions_manager } from './features/completions/completions';
import { Number_hover_manager } from './features/number_hover';
import { Stutter_mode_manager } from './features/stutter_mode';
import { Config_manager } from './features/config';
import { Tree_view_manager } from './features/tree_views/manager';
import { Comander } from './features/comander/run';
import { Dependency_manager } from './features/dependency';
import { ConfigurationFileWebview } from './features/views/configurationFile';
import { debugLogger } from './logger';
import { LogView, getLogView } from './features/views/logs';
import { TimingReportView, getTimingReportView } from './features/views/timing/timing_report';
import { getPathDetailsView } from './features/views/timing/path_details';
import { ProjectEmitter } from 'colibri/project_manager/projectEmitter';
import { get_home_directory } from 'colibri/process/utils';
import { GlobalConfigManager } from 'colibri/config/config_manager';

const CONFIG_FILENAME = '.teroshdl2_config.json';
const PRJ_FILENAME = '.teroshdl2_prj.json';

export class Teroshdl {
    private context: vscode.ExtensionContext;
    private manager: Multi_project_manager;
    private emitterProject = new ProjectEmitter();
    private logView: LogView;
    private timingView: TimingReportView;
    private languageProviderManager: LanguageProviderManager;

    constructor(context: vscode.ExtensionContext) {
        const homedir = get_home_directory();
        const file_config_path = path_lib.join(homedir, CONFIG_FILENAME);
        const file_prj_path = path_lib.join(homedir, PRJ_FILENAME);

        this.manager = new Multi_project_manager(this.emitterProject, file_prj_path);

        this.logView = getLogView(context);
        this.timingView = getTimingReportView(context, this.manager, getPathDetailsView(context, this.manager));

        GlobalConfigManager.newInstance(file_config_path);
        this.context = context;
    }

    public async init_teroshdl() {
        await this.init_multi_project_manager();

        this.init_language_provider();
        debugLogger.info('activated language provider');

        this.init_template_manager();
        debugLogger.info('activated template manager');

        this.init_documenter();
        debugLogger.info('activated documenter');

        this.init_state_machine();
        debugLogger.info('activated state machine');

        const schematic = this.init_schematic();
        debugLogger.info('activated schematic');

        this.init_linter();
        debugLogger.info('activated linter');

        this.init_formatter();
        debugLogger.info('activated formatter');

        this.init_completions();
        debugLogger.info('activated completions');

        this.init_number_hover();
        debugLogger.debug('activated hover');

        this.init_shutter_mode();
        debugLogger.info('activated shutter mode');

        this.init_config();
        debugLogger.info('activated config viewer');

        const dependency = this.init_dependency();
        this.init_tree_views(schematic, dependency);
        debugLogger.info('activated views');

        this.init_comander();
        debugLogger.info('activated comander');
    }

    private async init_multi_project_manager() {
        try {
            GlobalConfigManager.getInstance().load();
            await this.manager.load(this.emitterProject);
        } catch (error) {
            debugLogger.warn('There have been errors loading project list from disk.');
        }
    }

    private init_language_provider() {
        this.languageProviderManager = new LanguageProviderManager(this.context, this.manager);
        this.languageProviderManager.configure();
    }

    private init_template_manager() {
        new Template_manager(this.context, this.manager);
    }

    private init_documenter() {
        new Documenter_manager(this.context, this.manager);
    }

    private init_state_machine() {
        new State_machine_manager(this.context, this.manager);
    }

    private init_schematic() {
        return new Schematic_manager(this.context, this.manager, false);
    }

    private init_dependency() {
        return new Dependency_manager(this.context, this.manager);
    }

    private init_linter() {
        new Linter_manager(this.context, this.manager);
    }

    private init_formatter() {
        new Formatter_manager(this.context, this.manager);
    }

    private init_completions() {
        new Completions_manager(this.context);
    }

    private init_number_hover() {
        new Number_hover_manager(this.context);
    }

    private init_shutter_mode() {
        new Stutter_mode_manager(this.context, this.manager);
    }

    private init_config() {
        new Config_manager(this.context, this.manager, this.emitterProject);
    }

    private init_tree_views(schematic_manager: Schematic_manager, dependency_manager: Dependency_manager) {
        new ConfigurationFileWebview(this.context, this.manager);
        new Tree_view_manager(
            this.context,
            this.manager,
            this.emitterProject,
            schematic_manager,
            dependency_manager,
            this.logView,
            this.timingView
        );
    }

    private init_comander() {
        new Comander(this.context, this.manager).init();
    }

    public async deactivate() {
        await this.languageProviderManager.deactivate();
    }
}
