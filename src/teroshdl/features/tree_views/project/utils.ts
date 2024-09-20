// Copyright 2024
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
import { ProjectEmitter } from "colibri/project_manager/projectEmitter";
import * as utils from "../utils";
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import {SandpiperProjectManager} from "colibri/project_manager/tool/sandpiper/sandpiperProjectManager";

export async function createProjectSandpiper(
    multiProjectManager: Multi_project_manager,
    emitterProject: ProjectEmitter) {

    // Working directory
    const projectDirectory = await
    utils.get_from_open_dialog("What is the working directory for this project?", true, false, false, "Choose", {});
    if (projectDirectory.length !== 1) {
        return undefined;
    }

    // Project name
    const projectName = await utils.get_from_input_box("What is the name of this project?", "Project name");
    if (projectName === undefined) {
        return undefined;
    }

    // Create project
    const project = new SandpiperProjectManager(
        projectName, emitterProject, projectDirectory[0]
    );
    
    // Add project to multi project manager
    multiProjectManager.add_project(project);
}