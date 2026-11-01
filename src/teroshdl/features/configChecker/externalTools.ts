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

import {
    e_config,
    e_tools_general_execution_mode,
    e_tools_general_select_tool,
    e_tools_general_waveform_viewer,
    e_tools_nextpnr_target_family
} from 'colibri/config/config_declaration';
import { appendMsg, buildTitle, INTROICON, replaceByResult } from './utils';
import { BinaryCheck, checkBinary } from 'colibri/toolChecker/utils';
import { OS } from 'colibri/process/common';
import { get_os } from 'colibri/process/utils';
import * as file_utils from 'colibri/utils/file_utils';
import * as fs from 'fs';
import * as path_lib from 'path';

const HELP = 'https://terostechnology.github.io/terosHDLdoc/docs/external_tools/';

async function checkBinaryWithVersionFallback(
    displayName: string,
    installationPath: string,
    binaryName: string
): Promise<BinaryCheck> {
    const versionArgCandidates: string[][] = [
        ['--version'],
        ['-V'],
        []
    ];
    let lastResult: BinaryCheck | undefined;
    for (const versionArgs of versionArgCandidates) {
        lastResult = await checkBinary(displayName, installationPath, binaryName, versionArgs);
        if (lastResult.successfulConfig) {
            return lastResult;
        }
    }

    const configuredInstallationPath = installationPath?.trim() ?? '';
    if (configuredInstallationPath !== '') {
        const binaryNames = get_os() === OS.WINDOWS ? [`${binaryName}.exe`, binaryName] : [binaryName];
        for (const candidate of binaryNames) {
            const fullPath = path_lib.join(configuredInstallationPath, candidate);
            if (file_utils.check_if_path_exist(fullPath)) {
                return {
                    displayName,
                    binaryPath: fullPath,
                    messageList: [
                        `🔎 Searching for the binary ${displayName} at "${fullPath}"`,
                        `✅ ${displayName} found at "${fullPath}" (version query not supported by this binary).`
                    ],
                    successfulFind: true,
                    successfulConfig: true
                };
            }
        }
    }

    return lastResult ?? {
        displayName,
        binaryPath: '',
        messageList: [`❌ ${displayName} not found`],
        successfulFind: false,
        successfulConfig: false
    };
}

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
        icarus: '-V',
        vcs: '-full64 -id',
        nvc: '--version',
        // Add more tools and their custom arguments here
        // "tool-name-example": "--example-arg"
    };

    // Check external tool
    msg += `${INTROICON} Selected external tool: ${selectedTool.toLocaleUpperCase()}. Installation path: "${installationPath}"\n`;
    let result: any;

    if (selectedTool === e_tools_general_select_tool.osvvm) {
        const osvv_pro_path = path_lib.join(installationPath, 'OsvvmLibraries.pro');
        const scripts_path = path_lib.join(installationPath, 'Scripts');
        const tclsh = currentConfig.tools.osvvm.tclsh_binary || 'tclsh';

        if (!fs.existsSync(osvv_pro_path)) {
            msg += `${INTROICON} ❌ OSVVM installation path invalid: cannot find OsvvmLibraries.pro at "${osvv_pro_path}"\n`;
            msg += `${INTROICON} Please set the path to the OSVVM root containing OsvvmLibraries.pro and Scripts/.\n`; 
            isOk = false;
        } else if (!fs.existsSync(scripts_path)) {
            msg += `${INTROICON} ❌ OSVVM installation path invalid: cannot find Scripts folder at "${scripts_path}"\n`;
            msg += `${INTROICON} Please set the path to the OSVVM root containing OsvvmLibraries.pro and Scripts/.\n`;
            isOk = false;
        } else {
            msg += `${INTROICON} ✅ OSVVM installation path looks valid. Found OsvvmLibraries.pro and Scripts/\n`;
            const tcl_result = await checkBinary('tclsh', '', tclsh, ['--version']);
            msg = appendMsg(tcl_result, msg, 'Tclsh');
            if (!tcl_result.successfulConfig) {
                isOk = false;
            }
        }
    } else if (selectedTool === e_tools_general_select_tool.nextpnr) {
        const targetFamily = currentConfig.tools.nextpnr.target_family;
        const binaryByFamily: Record<e_tools_nextpnr_target_family, string> = {
            [e_tools_nextpnr_target_family.ice40]: 'nextpnr-ice40',
            [e_tools_nextpnr_target_family.ecp5]: 'nextpnr-ecp5',
            [e_tools_nextpnr_target_family.generic]: 'nextpnr-generic',
        };
        const binaryName = binaryByFamily[targetFamily];

        if (!binaryName) {
            msg += `${INTROICON} ❌ Unsupported nextpnr target family: ${targetFamily}\n`;
            isOk = false;
        } else {
            result = await checkBinary('nextpnr', installationPath, binaryName, ['--version']);
            msg = appendMsg(result, msg, `nextpnr (${targetFamily})`);
            msg += '\n';
            if (!result.successfulConfig) {
                isOk = false;
            }

            if (targetFamily === e_tools_nextpnr_target_family.ice40 ||
                targetFamily === e_tools_nextpnr_target_family.ecp5) {
                const packerByFamily: Record<Exclude<e_tools_nextpnr_target_family,
                    e_tools_nextpnr_target_family.generic>, string> = {
                    [e_tools_nextpnr_target_family.ice40]: 'icepack',
                    [e_tools_nextpnr_target_family.ecp5]: 'ecppack',
                };
                const packerInstallationPath = currentConfig.tools.nextpnr.packer_installation_path?.trim() ||
                    installationPath;
                const packerBinary = packerByFamily[targetFamily];

                result = await checkBinaryWithVersionFallback(
                    'nextpnr packer',
                    packerInstallationPath,
                    packerBinary
                );
                msg = appendMsg(result, msg, `nextpnr packer (${targetFamily})`);
                msg += '\n';
                if (!result.successfulConfig) {
                    isOk = false;
                }
            }
        }
    } else if (selectedTool === e_tools_general_select_tool.nvc) {
        let result = await checkBinary('nvc', installationPath, 'nvc', ['--version']);
        msg = appendMsg(result, msg, 'NVC');
        msg += '\n';
        if (!result.successfulConfig) {
            isOk = false;
        }
    } else {
        // Default to '--version' if no custom argument is specified
        const versionArgument = customVersionArgs[selectedTool] || '--version';

        let binaryName : string | string[] =
            selectedTool === e_tools_general_select_tool.rivierapro ? ['rivierapro', 'riviera'] : selectedTool;
        binaryName = binaryName === e_tools_general_select_tool.icarus ? 'iverilog' : binaryName;

        let result = await checkBinary(selectedTool, installationPath, binaryName, [versionArgument]);
        msg = appendMsg(result, msg, selectedTool.toLocaleUpperCase());
        msg += '\n';
        if (!result.successfulConfig) {
            isOk = false;
        }
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
    }
    msg += `${INTROICON} Waveform viewer: ${waveformViewer.toLocaleUpperCase()}. ${extraMsg}\n`;
    // Check GTKwave
    if (waveformViewer === e_tools_general_waveform_viewer.gtkwave) {
        const gtkwavePath = currentConfig.tools.general.gtkwave_installation_path;
        result = await checkBinary('GTKWave', gtkwavePath, 'gtkwave', ['--version']);
        msg = appendMsg(result, msg, 'Wavefrom Viewer');
        if (!result.successfulConfig) {
            isOk = false;
        }
    }

    msg += '\n';

    return replaceByResult(msg, isOk);
}
