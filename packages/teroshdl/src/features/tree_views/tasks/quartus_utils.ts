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

import { t_Multi_project_manager } from "../../../type_declaration";
import * as vscode from "vscode";
import * as teroshdl2 from 'teroshdl2';

export async function openRTLAnalyzer(project: t_Multi_project_manager,
    emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter) {
        
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

        let rtlTypeEnum = teroshdl2.project_manager.quartusCommon.e_rtlType.ELABORATED;
        if (pickerType === rtlType[0]) {
            rtlTypeEnum = teroshdl2.project_manager.quartusCommon.e_rtlType.ELABORATED;
        }
        else if (pickerType === rtlType[1]) {
            rtlTypeEnum = teroshdl2.project_manager.quartusCommon.e_rtlType.INSTRUMENTED;
        }
        else if (pickerType === rtlType[2]) {
            rtlTypeEnum = teroshdl2.project_manager.quartusCommon.e_rtlType.CONSTRAINED;
        }
        else if (pickerType === rtlType[3]) {
            rtlTypeEnum = teroshdl2.project_manager.quartusCommon.e_rtlType.SWEPT;
        }

        await teroshdl2.project_manager.quartus.openRTLAnalyzer(
            selectedProject.get_config(),
            selectedProject.projectDiskPath,
            emitterProject,
            rtlTypeEnum
        );
    }
    catch (error) { }
}