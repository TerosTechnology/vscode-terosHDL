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

import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import { ProjectEmitter } from 'colibri/project_manager/projectEmitter';
import { e_rtlType } from 'colibri/project_manager/tool/quartus/common';
import * as QuartusUtils from 'colibri/project_manager/tool/quartus/utils';
import * as vscode from "vscode";

export async function openRTLAnalyzer(project: Multi_project_manager,
    emitterProject: ProjectEmitter) {
        
    try {
        const selectedProject = project.get_selected_project();

        const rtlType = [
            "RTL Analyzer (Elaborated)",
            "RTL Analyzer (Instrumented)",
            "RTL Analyzer (Constrained)",
            "RTL Analyzer (Swept)",
        ];

        // Select RTL
        const pickerType = await vscode.window.showQuickPick(rtlType, {
            placeHolder: "Select RTL Checkpoint",
        });
        if (pickerType === undefined) {
            return;
        }

        let rtlTypeEnum = e_rtlType.ELABORATED;
        if (pickerType === rtlType[0]) {
            rtlTypeEnum = e_rtlType.ELABORATED;
        }
        else if (pickerType === rtlType[1]) {
            rtlTypeEnum = e_rtlType.INSTRUMENTED;
        }
        else if (pickerType === rtlType[2]) {
            rtlTypeEnum = e_rtlType.CONSTRAINED;
        }
        else if (pickerType === rtlType[3]) {
            rtlTypeEnum = e_rtlType.SWEPT;
        }

        await QuartusUtils.openRTLAnalyzer(
            selectedProject.get_config(),
            selectedProject.projectDiskPath,
            emitterProject,
            rtlTypeEnum
        );
    }
    catch (error) { }
}