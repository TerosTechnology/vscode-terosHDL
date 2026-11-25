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

import * as os from "os";
import * as path_lib from "path";

import { Project_manager } from '../../src/colibri/project_manager/project_manager';
import { ProjectEmitter } from "../../src/colibri/project_manager/projectEmitter";
import { GlobalConfigManager } from "../../src/colibri/config/config_manager";
import * as cfg from '../../src/colibri/config/config_declaration';

const PROJECT_DISK_PATH = path_lib.join(os.tmpdir(), "teroshdl_project_config_diff_test");

function set_global_simulator(simulator_name: cfg.e_tools_vunit_simulator_name) {
    const global_config = cfg.get_default_config();
    global_config.tools.vunit.simulator_name = simulator_name;
    GlobalConfigManager.getInstance().set_config(global_config);
}

async function create_vunit_project(name: string, simulator_name?: cfg.e_tools_vunit_simulator_name)
    : Promise<Project_manager> {
    const prj = new Project_manager(name, PROJECT_DISK_PATH, new ProjectEmitter(), undefined);
    const config = cfg.get_default_config();
    config.tools.general.select_tool = cfg.e_tools_general_select_tool.vunit;
    if (simulator_name !== undefined) {
        config.tools.vunit.simulator_name = simulator_name;
    }
    await prj.set_config(config);
    return prj;
}

// Simulate multiProjectManager.save(): capture the project file content
function save_project(prj: Project_manager): any {
    return JSON.parse(JSON.stringify(prj.get_edam_json()));
}

// Simulate the project load on extension activation
async function reload_project(saved: any): Promise<Project_manager> {
    return await Project_manager.fromJson(saved, "", new ProjectEmitter(), undefined);
}

describe('project configuration diff', () => {

    beforeEach(() => {
        GlobalConfigManager.newInstance("");
    });

    test('saved project contains the configuration diff with only the overridden settings', async () => {
        set_global_simulator(cfg.e_tools_vunit_simulator_name.ghdl);
        const prj = await create_vunit_project("prj_diff_format");
        const saved = save_project(prj);

        // Merged configuration contains the effective value
        expect(saved.configuration.tools.vunit.simulator_name).toBe("ghdl");
        // The diff only contains the settings overridden from the global configuration
        expect(saved.configuration_diff).toBeDefined();
        expect(saved.configuration_diff.tools.general.select_tool).toBe("vunit");
        expect(saved.configuration_diff.tools.vunit.simulator_name).toBeUndefined();
    });

    test('global configuration change is not stored as project override after reload', async () => {
        // Project saved while the global simulator is ghdl
        set_global_simulator(cfg.e_tools_vunit_simulator_name.ghdl);
        const prj = await create_vunit_project("prj_global_change");
        const saved = save_project(prj);

        // User changes the global simulator to nvc and restarts the extension
        set_global_simulator(cfg.e_tools_vunit_simulator_name.nvc);
        const reloaded = await reload_project(saved);

        // The project inherits the new global value
        expect(reloaded.get_config().tools.general.select_tool).toBe("vunit");
        expect(reloaded.get_config().tools.vunit.simulator_name).toBe("nvc");
    });

    test('explicit project override is kept after global configuration change and reload', async () => {
        set_global_simulator(cfg.e_tools_vunit_simulator_name.ghdl);
        const prj = await create_vunit_project("prj_explicit_override",
            cfg.e_tools_vunit_simulator_name.modelsim);
        const saved = save_project(prj);

        set_global_simulator(cfg.e_tools_vunit_simulator_name.nvc);
        const reloaded = await reload_project(saved);

        // The explicit project override wins over the global configuration
        expect(reloaded.get_config().tools.vunit.simulator_name).toBe("modelsim");
    });

    test('project without configuration diff (legacy format) heals stale inherited values', async () => {
        // Project saved while the global simulator is ghdl: the stored merged
        // configuration contains the inherited ghdl value.
        set_global_simulator(cfg.e_tools_vunit_simulator_name.ghdl);
        const prj = await create_vunit_project("prj_legacy");
        const saved = save_project(prj);
        delete saved.configuration_diff;

        // The user changes the global simulator to nvc
        set_global_simulator(cfg.e_tools_vunit_simulator_name.nvc);
        const reloaded = await reload_project(saved);

        // select_tool = vunit is a real project override and is kept
        expect(reloaded.get_config().tools.general.select_tool).toBe("vunit");
        // simulator_name = ghdl was only inherited from the old global
        // configuration (it equals the built-in default): it is not stored as
        // a project override, so the project inherits the new global value.
        expect(reloaded.get_config().tools.vunit.simulator_name).toBe("nvc");
    });
});
