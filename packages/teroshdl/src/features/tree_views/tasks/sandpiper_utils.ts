// packages/teroshdl/src/features/tree_views/tasks/sandpiper_utils.ts

import { t_Multi_project_manager } from '../../../type_declaration';
import * as vscode from 'vscode';
import * as teroshdl2 from 'teroshdl2';
import * as fs from 'fs';
import * as path from 'path';

export async function runSandpiperConversion(
    project: t_Multi_project_manager,
    emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter
) {
    try {
              const selectedProject = project.get_selected_project();
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showWarningMessage('No active editor found. Please open a file to run the conversion.');
            return;
        }
        
        const currentFileContent = editor.document.getText();
        const currentFileName = path.basename(editor.document.fileName);

        if (!currentFileName.toLowerCase().endsWith('.tlv')) {
            vscode.window.showWarningMessage('Selected file is not a TL-Verilog file. Please select a .tlv file.');
            return;
        }

       
        vscode.window.showInformationMessage('Starting Sandpiper TL-Verilog to Verilog conversion...');

        await teroshdl2.project_manager.quartus.runTLVerilogToVerilogConversion(
            selectedProject.get_config(),
            selectedProject.projectDiskPath,
            emitterProject,
            currentFileContent,
            currentFileName
        );

        vscode.window.showInformationMessage('Sandpiper TL-Verilog to Verilog conversion completed.');
    } catch (error) {
        vscode.window.showErrorMessage(`Error during Sandpiper conversion: ${error}`);
    }
}

export async function runSandpiperDiagramGeneration(
    project: t_Multi_project_manager,
    emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter
) {
    try {
        const selectedProject = project.get_selected_project();
        vscode.window.showInformationMessage('Starting Sandpiper diagram generation...');

        const svgFilePath = await teroshdl2.project_manager.quartus.generateSandpiperDiagram(
            selectedProject.projectDiskPath,
            emitterProject
        );

        showSvgInWebview(svgFilePath);

        vscode.window.showInformationMessage('Sandpiper diagram generation completed.');
    } catch (error) {
        vscode.window.showErrorMessage(`Error during Sandpiper diagram generation: ${error}`);
    }
}

function showSvgInWebview(svgFilePath: string) {
    const panel = vscode.window.createWebviewPanel('svgViewer', 'TL-Verilog SVG Viewer', vscode.ViewColumn.Two, {
        enableScripts: true,
        retainContextWhenHidden: true
    });

    const svg = fs.readFileSync(svgFilePath, 'utf8');
    const webviewContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TL-Verilog SVG Viewer</title>
        </head>
        <body>
            ${svg}
        </body>
        </html>
    `;

    panel.webview.html = webviewContent;
}

export async function runNavTlvGeneration(
    project: t_Multi_project_manager,
    emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter
) {
    try {
        const selectedProject = project.get_selected_project();
        vscode.window.showInformationMessage('Starting Nav TLV generation...');

        const htmlFilePath = await teroshdl2.project_manager.quartus.generateNavTlvHtml(
            selectedProject.projectDiskPath,
            emitterProject
        );

        showHtmlInWebview(htmlFilePath);

        vscode.window.showInformationMessage('Nav TLV generation completed.');
    } catch (error) {
        vscode.window.showErrorMessage(`Error during Nav TLV generation: ${error}`);
    }
}

function showHtmlInWebview(htmlFilePath: string) {
    const panel = vscode.window.createWebviewPanel('navTlvViewer', 'Nav TLV Viewer', vscode.ViewColumn.Two, {
        enableScripts: true,
        retainContextWhenHidden: true
    });

    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    panel.webview.html = htmlContent;
}
