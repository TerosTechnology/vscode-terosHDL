// packages/teroshdl/src/features/tree_views/tasks/sandpiper_utils.ts

import { t_Multi_project_manager } from "../../../type_declaration";
import * as vscode from "vscode";
import * as teroshdl2 from 'teroshdl2';

export async function runSandpiperConversion(project: t_Multi_project_manager,
    emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter) {
    
    try {
        const selectedProject = project.get_selected_project();

        vscode.window.showInformationMessage("Starting Sandpiper TL-Verilog to Verilog conversion...");

        await teroshdl2.project_manager.quartus.runTLVerilogToVerilogConversion(
            selectedProject.get_config(),
            selectedProject.projectDiskPath,
            emitterProject
        );

        vscode.window.showInformationMessage("Sandpiper TL-Verilog to Verilog conversion completed.");
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error during Sandpiper conversion: ${error}`);
    }
}