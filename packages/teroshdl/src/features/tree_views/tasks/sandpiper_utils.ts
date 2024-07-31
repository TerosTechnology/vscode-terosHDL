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

        await teroshdl2.project_manager.sandpiper.runTLVerilogToVerilogConversion(
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
        const svgFilePath = await teroshdl2.project_manager.sandpiper.generateSandpiperDiagram(
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
            retainContextWhenHidden: true
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
                margin: 0; 
                padding: 0;
                height: 100vh;
                display: flex;
                flex-direction: column;
                background-color: #f0f0f0;
            }
            .controls-container {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 1000;
            }
            .zoom-controls {
                display: flex;
                flex-direction: column;
                background-color: white;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .zoom-button {
                padding: 5px 10px;
                font-size: 18px;
                cursor: pointer;
                border: none;
                background-color: transparent;
            }
            .zoom-button:hover {
                background-color: #f0f0f0;
            }
            .zoom-reset {
                border-top: 1px solid #ccc;
                font-size: 14px;
            }
            .svg-container {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
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
        <div class="controls-container">
            <div class="zoom-controls">
                <button class="zoom-button" onclick="zoomIn()">+</button>
                <button class="zoom-button" onclick="zoomOut()">-</button>
                <button class="zoom-button zoom-reset" onclick="resetZoom()">RESET</button>
            </div>
        </div>
        <div class="svg-container" id="svg-container">
            ${svg}
        </div>
    
        <script>
        //@ts-nocheck
        let currentZoom = 1;
        const svgContainer = document.getElementById('svg-container');
        const svg = svgContainer.querySelector('svg');
    
        function zoomIn() {
            currentZoom *= 1.2;
            updateZoom();
        }
    
        function zoomOut() {
            currentZoom /= 1.2;
            updateZoom();
        }
    
        function resetZoom() {
            currentZoom = 1;
            updateZoom();
        }
    
        function updateZoom() {
            svg.style.transform = \`scale(\${currentZoom})\`;
        }
        </script>
    </body>
    </html>
    ` as const;

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
        const navTlvHtml = await teroshdl2.project_manager.sandpiper.generateNavTlv(
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
    const panel = vscode.window.createWebviewPanel('navTlvViewer', 'Nav TLV Viewer', vscode.ViewColumn.Two, {
        enableScripts: true,
        retainContextWhenHidden: true
    });

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
