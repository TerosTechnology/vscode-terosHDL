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
import * as fs from "fs";
import * as path_lib from "path";
import { execSync } from "child_process";

import { Project_manager } from '../../src/colibri/project_manager/project_manager';
import { ProjectEmitter, e_event } from "../../src/colibri/project_manager/projectEmitter";
import { GlobalConfigManager } from "../../src/colibri/config/config_manager";
import * as cfg from '../../src/colibri/config/config_declaration';
import { get_files_from_vunit } from "../../src/colibri/project_manager/prj_loaders/vunit_loader";

// Regression test: reloading a project with a VUnit watcher whose run.py
// fails (e.g. a missing external library) must not wipe the automatic source
// files from the file list (the "files" panel went blank in this scenario).

const C_TIMEOUT_MS = 30000;

function isVunitAvailable(): boolean {
    for (const python of ["python3", "python"]) {
        try {
            execSync(`${python} -c "import vunit"`, { stdio: "ignore" });
            return true;
        }
        catch (error) { /* try the next python */ }
    }
    return false;
}

const testIfVunit = isVunitAvailable() ? test : test.skip;

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createFixture(): { dir: string, run_py: string, vhd_file: string } {
    const dir = fs.mkdtempSync(path_lib.join(os.tmpdir(), "teroshdl_vunit_watcher_reload_"));
    // run.py that fails like a VUnit script with a missing external library
    const run_py = path_lib.join(dir, "run.py");
    fs.writeFileSync(run_py, 'raise ValueError("External library /does/not/exist does not exist")\n');
    const vhd_file = path_lib.join(dir, "dummy_tb.vhd");
    fs.writeFileSync(vhd_file, "entity dummy_tb is\nend entity;\n");
    return { dir, run_py, vhd_file };
}

function waitForWatcherFinished(emitter: ProjectEmitter, projectName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Timeout waiting for the watcher reload to finish"));
        }, C_TIMEOUT_MS);
        emitter.addProjectListener(async (name: string, eventType: e_event) => {
            if (name === projectName && eventType === e_event.WATCHER_FINISHED) {
                clearTimeout(timeout);
                resolve();
            }
        });
    });
}

describe('VUnit watcher reload', () => {

    beforeEach(() => {
        GlobalConfigManager.newInstance("");
        const config = cfg.get_default_config();
        config.tools.general.select_tool = cfg.e_tools_general_select_tool.vunit;
        GlobalConfigManager.getInstance().set_config(config);
    });

    test('broken run.py fails to export the file list', async () => {
        const fixture = createFixture();
        const config = GlobalConfigManager.getInstance().get_config();

        const result = await get_files_from_vunit(config, fixture.run_py, false);

        expect(result.successful).toBe(false);
        expect(result.file_list).toEqual([]);
        expect(result.msg).toContain("Error processing run.py");
    }, C_TIMEOUT_MS);

    test('failed watcher reload keeps the automatic source files', async () => {
        const fixture = createFixture();

        // Project file as saved by multi_project_manager.save(): the source
        // files loaded from the VUnit watcher are automatic (is_manual false)
        const saved: any = {
            name: "prj_vunit_watcher_reload",
            project_disk_path: fixture.dir,
            project_type: "generic",
            toplevel: "",
            files: [{
                name: fixture.vhd_file,
                is_include_file: false,
                include_path: "",
                logical_name: "lib",
                is_manual: false,
                file_type: "vhdlSource",
                file_version: "2008",
                source_type: "none",
            }],
            hooks: [],
            watchers: [{ path: fixture.run_py, watcher_type: "vunit" }],
        };

        const emitter = new ProjectEmitter();
        emitter.enable();
        const finished = waitForWatcherFinished(emitter, saved.name);

        // Simulate the project load on extension activation: the VUnit watcher
        // is registered and the watcher callback reloads the source files
        const prj = await Project_manager.fromJson(saved, "", emitter, "");
        await finished;

        const files = prj.get_project_definition().file_manager.get();
        const file = files.find(f => f.name === fixture.vhd_file && f.logical_name === "lib");
        expect(file).toBeDefined();
        expect(file?.is_manual).toBe(false);
    }, C_TIMEOUT_MS);

    testIfVunit('successful watcher reload replaces the automatic source files', async () => {
        const fixture = createFixture();

        // A working run.py (only needs python + vunit)
        fs.writeFileSync(fixture.run_py, [
            'from pathlib import Path',
            'from vunit import VUnit',
            '',
            'ROOT = Path(__file__).parent',
            '',
            'vu = VUnit.from_argv()',
            'vu.add_vhdl_builtins()',
            '',
            'lib = vu.add_library("lib")',
            'lib.add_source_files(ROOT / "dummy_tb.vhd")',
            '',
            'vu.main()',
            '',
        ].join("\n"));

        const saved: any = {
            name: "prj_vunit_watcher_reload_ok",
            project_disk_path: fixture.dir,
            project_type: "generic",
            toplevel: "",
            files: [{
                name: path_lib.join(fixture.dir, "stale_file.vhd"),
                is_include_file: false,
                include_path: "",
                logical_name: "lib",
                is_manual: false,
                file_type: "vhdlSource",
                file_version: "2008",
                source_type: "none",
            }],
            hooks: [],
            watchers: [{ path: fixture.run_py, watcher_type: "vunit" }],
        };

        const emitter = new ProjectEmitter();
        emitter.enable();
        const finished = waitForWatcherFinished(emitter, saved.name);

        const prj = await Project_manager.fromJson(saved, "", emitter, "");
        await finished;

        const files = prj.get_project_definition().file_manager.get();
        // The stale file is gone and the file exported by run.py is loaded
        expect(files.some(f => f.name === path_lib.join(fixture.dir, "stale_file.vhd"))).toBe(false);
        expect(files.some(f => f.name === fixture.vhd_file && f.logical_name === "lib")).toBe(true);
    }, C_TIMEOUT_MS);
});
