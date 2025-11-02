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

import * as vscode from 'vscode';
import { BinaryCheck } from 'colibri/toolChecker/utils';
import {
    e_config,
    e_tools_general_execution_mode,
    e_tools_general_select_tool,
    e_tools_general_waveform_viewer
} from 'colibri/config/config_declaration';
import { appendMsg, buildTitle, INTROICON, replaceByResult } from './utils';
import { checkBinary } from 'colibri/toolChecker/utils';

const HELP = 'https://terostechnology.github.io/terosHDLdoc/docs/external_tools/';

export async function checkExternalToolManager(currentConfig: e_config) {
    const selectedTool = currentConfig.tools.general.select_tool;
    const executionMode = currentConfig.tools.general.execution_mode;
    const waveformViewer = currentConfig.tools.general.waveform_viewer;
    const installationPath = currentConfig.tools[selectedTool].installation_path;
    let isOk = true;

    let msg = '';

    msg += buildTitle('Checking External Tool Configuration', HELP);

    // Build a custom map for specified extern tools' version check argument
    const customVersionArgs: Record<string, string> = {
        vivado: '-version',
        icarus: '-V'
        // Add more tools and their custom arguments here
        // "tool-name-example": "--example-arg"
    };

    // Check external tool
    msg += `${INTROICON} Selected external tool: ${selectedTool.toLocaleUpperCase()}. Installation path: "${installationPath}"\n`;
    // Default to '--version' if no custom argument is specified
    const versionArgument = customVersionArgs[selectedTool] || '--version';

    let binaryName: string | string[] =
        selectedTool === e_tools_general_select_tool.rivierapro ? ['rivierapro', 'riviera'] : selectedTool;
    binaryName = binaryName === e_tools_general_select_tool.icarus ? 'iverilog' : binaryName;

    let result = await checkBinary(selectedTool, installationPath, binaryName, [versionArgument]);
    msg = appendMsg(result, msg, selectedTool.toLocaleUpperCase());
    msg += '\n';
    if (!result.successfulConfig) {
        isOk = false;
    }

    // Check execution mode
    let extraMsg = '';
    if (executionMode === e_tools_general_execution_mode.cmd) {
        extraMsg = 'The tool will be executend in the command line.';
    } else if (executionMode === e_tools_general_execution_mode.gui) {
        extraMsg = 'Afther the execution, the tool GUI will be opened if it is available.';
    }
    msg += `${INTROICON} Execution mode: ${executionMode.toLocaleUpperCase()}. ${extraMsg}\n`;
    msg += '\n';

    // Check waveform viewer
    extraMsg = '';
    if (waveformViewer === e_tools_general_waveform_viewer.gtkwave) {
        extraMsg =
            'GTKWave waveform viewer will be opened after the simulation. Make sure that the GTKWave is correctly configured.';
    } else if (waveformViewer === e_tools_general_waveform_viewer.tool) {
        extraMsg = 'Built-in tool waveform viewer will be opened after the simulation if it is available.';
    } else if (waveformViewer === e_tools_general_waveform_viewer.vaporView) {
        extraMsg =
            'VaporView waveform viewer will be opened after the simulation. Make sure the extension is available.';
    } else if (waveformViewer === e_tools_general_waveform_viewer.surfer) {
        extraMsg =
            'Surfer waveform viewer will be opened after the simulation. Make sure Surfer is correctly configured.';
    }
    msg += `${INTROICON} Waveform viewer: ${waveformViewer.toLocaleUpperCase()}. ${extraMsg}\n`;
    // Check GTKwave or Surfer
    if (waveformViewer === e_tools_general_waveform_viewer.gtkwave) {
        const gtkwavePath = currentConfig.tools.general.gtkwave_installation_path;
        result = await checkBinary('GTKWave', gtkwavePath, 'gtkwave', ['--version']);
        msg = appendMsg(result, msg, 'Wavefrom Viewer');
        if (!result.successfulConfig) {
            isOk = false;
        }
    } else if (waveformViewer === e_tools_general_waveform_viewer.surfer) {
        const surferPath = currentConfig.tools.general.surfer_installation_path;
        result = await checkBinary('Surfer', surferPath, 'surfer', ['--version']);
        msg = appendMsg(result, msg, 'Wavefrom Viewer');
        if (!result.successfulConfig) {
            isOk = false;
        }
    } else if (waveformViewer == e_tools_general_waveform_viewer.vaporView) {
        const extension = await vscode.extensions.getExtension('lramseyer.vaporview');
        let configOk: boolean = false;
        // Mock a BinaryCheck result for the extension.
        let messageList = [`🔎 Searching for the VaporView extension in vscode`];
        if (extension) {
            messageList.push(`✅ VaporView extension found in vscode`);
            if (extension.isActive) {
                configOk = true;
                messageList.push(`✅ VaporView extension enabled in vscode`);
            }
            else {
                messageList.push(`❌ VaporView extension not enabled in vscode`);
            }
        } else {
            messageList.push(`❌ VaporView extension not installed in vscode`);
        }
        const result: BinaryCheck = {
            displayName: "Surfer",
            binaryPath: "N/A",
            messageList: messageList,
            successfulFind: extension !== undefined,
            successfulConfig: configOk,
        };
        // Add results
        msg = appendMsg(result, msg, 'Wavefrom Viewer');
        isOk = configOk;
    }

    msg += '\n';

    return replaceByResult(msg, isOk);
}
