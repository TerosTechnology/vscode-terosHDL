// This code only can be used for Quartus boards

import { e_config } from '../../../config/config_declaration';
import { QuartusProjectManager } from './quartusProjectManager';
import { get_toplevel_from_path } from '../../../utils/hdl_utils';
import events = require("events");

import * as path_lib from 'path';
import { createProject, getProjectInfo, getFilesFromProject, QuartusExecutionError } from './utils';

/**
 * Create a new Quartus project from directory.
 * @param config Configuration.
 * @param name Project name.
 * @param family FPGA family.
 * @param part FPGA part.
 * @param projectDirectory Project directory.
 * @returns Quartus project.
**/
export async function createNewProject(config: e_config, name: string, family: string, part: string,
    projectDirectory: string, emitterProject: events.EventEmitter)
    : Promise<QuartusProjectManager | undefined> {

    try {
        await createProject(config, name, family, part, projectDirectory);
        const projectPath = path_lib.join(projectDirectory, `${name}`);
        const project = new QuartusProjectManager(name, projectPath, name, emitterProject);
        return project;
    }
    catch (error) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
}

/**
 * Load an existing Quartus project from Quartus file path.
 * @param config Configuration.
 * @param project_path Quartus project path.
 * @returns Quartus project.
**/
export async function loadProject(config: e_config, project_path: string,
    emitterProject: events.EventEmitter): Promise<QuartusProjectManager> {
    try {
        const projectInfo = await getProjectInfo(config, project_path);
        const projectFiles = await getFilesFromProject(config, project_path, true);

        const quartusProject = new QuartusProjectManager(projectInfo.name, project_path, projectInfo.currentRevision,
            emitterProject);

        // Search for toplevel path for top level entity
        if (projectInfo.topEntity === "") {
            for (const file of projectFiles) {
                if (projectInfo.topEntity === get_toplevel_from_path(file.name)) {
                    quartusProject.add_toplevel_path(file.name);
                    break;
                }
            }
        }

        // Add all files to project
        quartusProject.add_file_from_array(projectFiles);

        return quartusProject;
    }
    catch (error) {
        throw new QuartusExecutionError("Error in Quartus execution");
    }
}
