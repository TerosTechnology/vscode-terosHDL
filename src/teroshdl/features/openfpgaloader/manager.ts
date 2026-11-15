import * as vscode from 'vscode';

import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import { t_loader_action_result } from 'colibri/project_manager/tool/common';
import { detectDevices } from 'colibri/project_manager/tool/openfpgaloader/deviceDetector';
import { listBoards, t_openfpgaloader_board } from 'colibri/project_manager/tool/openfpgaloader/boardDetector';
import { loadBitstreamStream } from 'colibri/project_manager/tool/openfpgaloader/bitstreamLoader';

import { toolLogger } from '../../logger';

const SELECTED_DEVICE_KEY = 'openfpgaloader.selectedDevice';

type SelectedDevice = {
    family: string;
    model: string;
    projectPath: string;
};

type DeviceQuickPickItem = vscode.QuickPickItem & {
    family: string;
    model: string;
};

type BoardQuickPickItem = vscode.QuickPickItem & {
    board: t_openfpgaloader_board;
};

export class OpenFPGALoaderManager {
    constructor(
        private context: vscode.ExtensionContext,
        private manager: Multi_project_manager
    ) {
        this.registerCommands();
    }

    private registerCommands(): void {
        const detectCommand = vscode.commands.registerCommand(
            'teroshdl.devices.detect',
            () => this.detect()
        );

        const loadBitstreamCommand = vscode.commands.registerCommand(
            'teroshdl.devices.load_bitstream',
            () => this.loadBitstream()
        );

        this.context.subscriptions.push(
            detectCommand,
            loadBitstreamCommand
        );
    }

    private async detect(): Promise<void> {
        try {
            const project = this.manager.get_selected_project();

            const config = project.get_config().tools.openfpgaloader;
            const cwd = project.projectDiskPath;

            toolLogger.appendLine('OpenFPGALoader: detecting devices...');
            toolLogger.show();

            const result = await detectDevices(config, cwd);

            if (!result.successful) {
                toolLogger.appendLine(`Error: ${result.msg}`);
                vscode.window.showErrorMessage(`OpenFPGALoader: ${result.msg}`);
                return;
            }

            if (result.board_list.length === 0) {
                vscode.window.showInformationMessage(
                    'OpenFPGALoader: no devices were found.'
                );
                return;
            }

            const items: DeviceQuickPickItem[] = [];

            for (const board of result.board_list) {
                for (const model of board.part_list) {
                    items.push({
                        label: `${board.family} — ${model}`,
                        description: 'Detected device',
                        family: board.family,
                        model
                    });
                }
            }

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select the detected device'
            });

            if (!selected) {
                return;
            }

            const device: SelectedDevice = {
                family: selected.family,
                model: selected.model,
                projectPath: project.projectDiskPath
            };

            await this.context.globalState.update(
                SELECTED_DEVICE_KEY,
                device
            );

            vscode.window.showInformationMessage(
                `Device selected: ${selected.family} — ${selected.model}`
            );

            toolLogger.appendLine(
                `Device selected: ${selected.family} — ${selected.model}`
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            if (error instanceof Error && error.name === 'ProjectOperationError') {
                vscode.window.showWarningMessage(
                    'OpenFPGALoader: you must first select a project.'
                );
                return;
            }

            toolLogger.appendLine(`Error: ${message}`);
            vscode.window.showErrorMessage(`OpenFPGALoader: ${message}`);
        }
    }

    private async loadBitstream(): Promise<void> {
        try {
            const project = this.manager.get_selected_project();
            const config = project.get_config().tools.openfpgaloader;
            const cwd = project.projectDiskPath;

            const selectedDevice = this.context.globalState.get<SelectedDevice>(
                SELECTED_DEVICE_KEY
            );

            if (!selectedDevice) {
                vscode.window.showWarningMessage(
                    'OpenFPGALoader: first detect a device before loading a bitstream.'
                );
                return;
            }

            if (selectedDevice.projectPath !== project.projectDiskPath) {
                vscode.window.showWarningMessage(
                    'OpenFPGALoader: the selected device belongs to another project.' +
                    ' Detect a device again before loading a bitstream.'
                );
                return;
            }

            toolLogger.appendLine('OpenFPGALoader: checking supported boards...');
            toolLogger.show();

            const boardsResult = await listBoards(config, cwd);

            if (!boardsResult.successful) {
                toolLogger.appendLine(`Error: ${boardsResult.msg}`);
                vscode.window.showErrorMessage(
                    `OpenFPGALoader: ${boardsResult.msg}`
                );
                return;
            }

            if (boardsResult.board_list.length === 0) {
                vscode.window.showWarningMessage(
                    'OpenFPGALoader: no supported boards were found.'
                );
                return;
            }

            const boardItems: BoardQuickPickItem[] = boardsResult.board_list.map(
                board => ({
                    label: board.name,
                    description: `Cable: ${board.cable || 'Not specified'}`,
                    detail: `Detected FPGA: ${selectedDevice.family} — ${selectedDevice.model}`,
                    board
                })
            );

            const selectedBoard = await vscode.window.showQuickPick(
                boardItems,
                {
                    placeHolder: 'Select the board you want to program'
                }
            );

            if (!selectedBoard) {
                return;
            }

            const bitstream = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                openLabel: 'Select bitstream',
                filters: {
                    Bitstream: ['bit', 'bin', 'svf']
                }
            });

            if (!bitstream || bitstream.length === 0) {
                return;
            }

            const filePath = bitstream[0].fsPath;
            const extension = filePath.split('.').pop()?.toLowerCase();

            if (!extension || !['bit', 'bin', 'svf'].includes(extension)) {
                vscode.window.showErrorMessage(
                    'OpenFPGALoader: unsupported bitstream file extension.'
                );
                return;
            }

            toolLogger.appendLine(
                `OpenFPGALoader: loading ${filePath} into ${selectedBoard.board.name}...`
            );

            const result = await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: `Loading bitstream to ${selectedBoard.board.name}`,
                    cancellable: false
                },
                (progress) => {
                    return new Promise<t_loader_action_result>((resolve) => {
                        loadBitstreamStream(
                            config,
                            selectedBoard.board.name,
                            filePath,
                            {
                                cable: selectedBoard.board.cable || undefined,
                                verify: true,
                                reset: false
                            },
                            (output) => {
                                toolLogger.append(output);
                            },
                            (loadResult) => {
                                resolve(loadResult);
                            },
                            (percent) => {
                                progress.report({
                                    message: `${percent}%`
                                });
                            }
                        );
                    });
                }
            );

            if (!result.successful) {
                toolLogger.appendLine(`Error: ${result.msg}`);
                vscode.window.showErrorMessage(
                    `OpenFPGALoader: ${result.msg}`
                );
                return;
            }

            toolLogger.appendLine(
                `Bitstream loaded successfully to ${selectedBoard.board.name}.`
            );

            vscode.window.showInformationMessage(
                `OpenFPGALoader: bitstream loaded to ${selectedBoard.board.name}`
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            if (error instanceof Error && error.name === 'ProjectOperationError') {
                vscode.window.showWarningMessage(
                    'OpenFPGALoader: you must first select a project.'
                );
                return;
            }

            toolLogger.appendLine(`Error: ${message}`);
            vscode.window.showErrorMessage(`OpenFPGALoader: ${message}`);
        }
    }
}