// packages/teroshdl/src/features/tree_views/tasks/sandpiper_utils.ts

import { t_Multi_project_manager } from '../../../type_declaration';
import * as vscode from 'vscode';
import * as teroshdl2 from 'teroshdl2';
import * as fs from 'fs';
import * as path from 'path';
import { sandpiperLogger } from './sandpiper_logger';

export async function runSandpiperConversion(
    project: t_Multi_project_manager,
    emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter
) {
    try {
        sandpiperLogger(emitterProject); 
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
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showWarningMessage('No active editor found. Please open a file to generate the diagram.');
            return;
        }
        
        const currentFileContent = editor.document.getText();
        const currentFileName = path.basename(editor.document.fileName);

        if (!currentFileName.toLowerCase().endsWith('.tlv')) {
            vscode.window.showWarningMessage('Selected file is not a TL-Verilog file. Please select a .tlv file.');
            return;
        }

        vscode.window.showInformationMessage('Starting Sandpiper diagram generation...');

        // First, run the task
        await new Promise<void>((resolve, reject) => {
            selectedProject.runTask(
                teroshdl2.project_manager.tool_common.e_taskType.SANDPIPER_DIAGRAM_TAB,
                (result) => {
                    if (result.successful) {
                        resolve();
                    } else {
                        reject(new Error(result.stderr));
                    }
                }
            );
        });

        // Then, call the backend function to generate the diagram
        const svgFilePath = await teroshdl2.project_manager.quartus.generateSandpiperDiagram(
            selectedProject.get_config(),
            selectedProject.projectDiskPath,
            emitterProject,
            currentFileContent,
            currentFileName
        );

        showSvgInWebview(svgFilePath);
        vscode.window.showInformationMessage('Sandpiper diagram generated and displayed.');
    } catch (error) {
        vscode.window.showErrorMessage(`Error during Sandpiper diagram generation: ${error}`);
    }
}

function showSvgInWebview(svgFilePath: string) {
    const panel = vscode.window.createWebviewPanel(
        'sandpiperDiagram',
        'Sandpiper Diagram Viewer',
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    const svg = fs.readFileSync(svgFilePath, 'utf8');
    const webviewContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sandpiper Diagram Viewer</title>
            <style>
                body { 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    margin: 0; 
                    background-color: #f0f0f0;
                }
                svg { 
                    max-width: 100%; 
                    max-height: 100%; 
                    border: 1px solid #ccc; 
                    background-color: white;
                }
            </style>
        </head>
        <body>
            ${svg}
        </body>
        </html>
    `;

    panel.webview.html = webviewContent;
}
export async function runSandpiperNavTlvGeneration(
    project: t_Multi_project_manager,
    emitterProject: teroshdl2.project_manager.projectEmitter.ProjectEmitter
) {
    try {
        const selectedProject = project.get_selected_project();
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showWarningMessage('No active editor found. Please open a file to generate NavTLV.');
            return;
        }
        
        const currentFileContent = editor.document.getText();
        const currentFileName = path.basename(editor.document.fileName);

        if (!currentFileName.toLowerCase().endsWith('.tlv')) {
            vscode.window.showWarningMessage('Selected file is not a TL-Verilog file. Please select a .tlv file.');
            return;
        }

        vscode.window.showInformationMessage('Starting Sandpiper NavTLV generation...');

        // Run the task
        await new Promise<void>((resolve, reject) => {
            selectedProject.runTask(
                teroshdl2.project_manager.tool_common.e_taskType.SANDPIPER_NAV_TLV_TAB,
                (result) => {
                    if (result.successful) {
                        resolve();
                    } else {
                        reject(new Error(result.stderr));
                    }
                }
            );
        });

        // Generate NavTLV
        const navTlvHtml = await teroshdl2.project_manager.quartus.generateNavTlv(
            selectedProject.get_config(),
            selectedProject.projectDiskPath,
            emitterProject,
            currentFileContent,
            currentFileName
        );

        showNavTlvInWebview(navTlvHtml);
        vscode.window.showInformationMessage('NavTLV generated and displayed.');
    } catch (error) {
        vscode.window.showErrorMessage(`Error during NavTLV generation: ${error}`);
    }
}

function showNavTlvInWebview(navTlvHtml: string) {
    const panel = vscode.window.createWebviewPanel(
        'navTlvViewer',
        'Nav TLV Viewer',
        vscode.ViewColumn.Two,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    const modifiedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nav TLV Viewer</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background-color: white;
                    margin: 0;
                    padding: 20px;
                }
                .nav-tlv-content { 
                    white-space: pre; 
                    font-family: monospace; 
                    background-color: white;
                }
            </style>
        </head>
        <body>
            <div class="nav-tlv-content">${navTlvHtml}</div>
            <script>
                // You can add any necessary JavaScript here
            </script>
        </body>
        </html>
    `;

    panel.webview.html = modifiedHtml;
}

