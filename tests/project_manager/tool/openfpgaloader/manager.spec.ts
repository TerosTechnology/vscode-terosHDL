import * as vscode from 'vscode';

import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';

import { detectDevices } from 'colibri/project_manager/tool/openfpgaloader/deviceDetector';
import { listBoards } from 'colibri/project_manager/tool/openfpgaloader/boardDetector';
import { loadBitstreamStream } from 'colibri/project_manager/tool/openfpgaloader/bitstreamLoader';

import { OpenFPGALoaderManager } from '../../../../src/teroshdl/features/openfpgaloader/manager';

jest.mock('vscode', () => {
    const commandHandlers = new Map<string, (...args: unknown[]) => unknown>();
    const progressReport = jest.fn();

    return {
        commands: {
            registerCommand: jest.fn((command: string, callback: (...args: unknown[]) => unknown) => {
                commandHandlers.set(command, callback);
                return { dispose: jest.fn() };
            })
        },
        ProgressLocation: {
            Notification: 15
        },
        window: {
            showQuickPick: jest.fn(),
            showOpenDialog: jest.fn(),
            showErrorMessage: jest.fn(),
            showWarningMessage: jest.fn(),
            showInformationMessage: jest.fn(),
            withProgress: jest.fn(
                (_options: unknown, task: (progress: { report: jest.Mock }) => Promise<unknown>) =>
                    task({ report: progressReport })
            )
        },
        commandHandlers,
        progressReport
    };
}, { virtual: true });

jest.mock('colibri/project_manager/tool/openfpgaloader/deviceDetector', () => ({
    detectDevices: jest.fn()
}));

jest.mock('colibri/project_manager/tool/openfpgaloader/boardDetector', () => ({
    listBoards: jest.fn()
}));

jest.mock('colibri/project_manager/tool/openfpgaloader/bitstreamLoader', () => ({
    loadBitstreamStream: jest.fn()
}));

jest.mock('../../../../src/teroshdl/logger', () => ({
    toolLogger: {
        append: jest.fn(),
        appendLine: jest.fn(),
        show: jest.fn()
    }
}));

type VscodeMock = {
    commands: {
        registerCommand: jest.Mock;
    };
    ProgressLocation: {
        Notification: number;
    };
    window: {
        showQuickPick: jest.Mock;
        showOpenDialog: jest.Mock;
        showErrorMessage: jest.Mock;
        showWarningMessage: jest.Mock;
        showInformationMessage: jest.Mock;
        withProgress: jest.Mock;
    };
    commandHandlers: Map<string, (...args: unknown[]) => unknown>;
    progressReport: jest.Mock;
};

const vscodeMock = jest.requireMock('vscode') as VscodeMock;

const mockedDetectDevices = detectDevices as jest.MockedFunction<typeof detectDevices>;
const mockedListBoards = listBoards as jest.MockedFunction<typeof listBoards>;
const mockedLoadBitstreamStream = loadBitstreamStream as jest.MockedFunction<typeof loadBitstreamStream>;
const mockChildProcess = {} as NonNullable<ReturnType<typeof loadBitstreamStream>>;

const COMMAND_DETECT = 'teroshdl.devices.detect';
const COMMAND_LOAD = 'teroshdl.devices.load_bitstream';
const SELECTED_DEVICE_KEY = 'openfpgaloader.selectedDevice';

const config = {
    installation_path: ''
};

const project = {
    get_config: jest.fn(() => ({
        tools: {
            openfpgaloader: config
        }
    })),
    projectDiskPath: '/workspace/project'
};

const projectManager = {
    get_selected_project: jest.fn(() => project)
};

const mockedGetSelectedProject = projectManager.get_selected_project;

const globalStateValues = new Map<string, unknown>();

const globalState = {
    get: jest.fn((key: string) => globalStateValues.get(key)),
    update: jest.fn(async (key: string, value: unknown) => {
        globalStateValues.set(key, value);
    })
};

const context = {
    subscriptions: [],
    globalState
};

const selectedDevice = {
    family: 'Xilinx',
    model: 'xc7a35t',
    projectPath: '/workspace/project'
};

const selectedBoard = {
    name: 'arty',
    cable: 'digilent'
};

async function executeCommand(command: string): Promise<void> {
    const callback = vscodeMock.commandHandlers.get(command);

    if (!callback) {
        throw new Error(`Command not registered: ${command}`);
    }

    await callback();
}

function createManager(): OpenFPGALoaderManager {
    return new OpenFPGALoaderManager(
        context as unknown as vscode.ExtensionContext,
        projectManager as unknown as Multi_project_manager
    );
}

function registerCommandMock(): void {
    vscodeMock.commands.registerCommand.mockImplementation(
        (command: string, callback: (...args: unknown[]) => unknown) => {
            vscodeMock.commandHandlers.set(command, callback);
            return { dispose: jest.fn() };
        }
    );
}

describe('OpenFPGALoaderManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        vscodeMock.commandHandlers.clear();
        globalStateValues.clear();
        context.subscriptions.length = 0;

        registerCommandMock();

        mockedLoadBitstreamStream.mockImplementation(
            (_config, _boardId, _bitstreamPath, _options, onOutput, callback, onProgress) => {
                onOutput('Programming started.\n');
                onProgress?.(50);
                onProgress?.(100);

                callback({
                    successful: true,
                    msg: 'Programming completed successfully.'
                });
                return mockChildProcess;
            }
        );
    });

    describe('command registration', () => {
        it('registers the detect and load bitstream commands', () => {
            createManager();

            expect(vscodeMock.commands.registerCommand).toHaveBeenCalledTimes(2);
            expect(vscodeMock.commands.registerCommand).toHaveBeenCalledWith(
                COMMAND_DETECT,
                expect.any(Function)
            );
            expect(vscodeMock.commands.registerCommand).toHaveBeenCalledWith(
                COMMAND_LOAD,
                expect.any(Function)
            );
            expect(context.subscriptions).toHaveLength(2);
        });
    });

    describe('detect', () => {
        it('detects devices and stores the selected device', async () => {
            createManager();

            mockedDetectDevices.mockResolvedValueOnce({
                board_list: [
                    {
                        family: 'Xilinx',
                        part_list: ['xc7a35t']
                    }
                ],
                successful: true,
                msg: ''
            });

            vscodeMock.window.showQuickPick.mockResolvedValueOnce({
                label: 'Xilinx — xc7a35t',
                family: selectedDevice.family,
                model: selectedDevice.model
            });

            await executeCommand(COMMAND_DETECT);

            expect(mockedDetectDevices).toHaveBeenCalledWith(
                config,
                project.projectDiskPath
            );
            expect(vscodeMock.window.showQuickPick).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        label: 'Xilinx — xc7a35t',
                        family: 'Xilinx',
                        model: 'xc7a35t'
                    })
                ]),
                expect.any(Object)
            );
            expect(globalState.update).toHaveBeenCalledWith(
                SELECTED_DEVICE_KEY,
                selectedDevice
            );
        });

        it('shows an information message when no devices are found', async () => {
            createManager();

            mockedDetectDevices.mockResolvedValueOnce({
                board_list: [],
                successful: true,
                msg: ''
            });

            await executeCommand(COMMAND_DETECT);

            expect(vscodeMock.window.showInformationMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: no devices were found.'
            );
            expect(vscodeMock.window.showQuickPick).not.toHaveBeenCalled();
            expect(globalState.update).not.toHaveBeenCalled();
        });

        it('shows an error when device detection fails', async () => {
            createManager();

            mockedDetectDevices.mockResolvedValueOnce({
                board_list: [],
                successful: false,
                msg: 'OpenFPGALoader not found'
            });

            await executeCommand(COMMAND_DETECT);

            expect(vscodeMock.window.showErrorMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: OpenFPGALoader not found'
            );
            expect(vscodeMock.window.showQuickPick).not.toHaveBeenCalled();
        });

        it('does not store a device when the QuickPick is cancelled', async () => {
            createManager();

            mockedDetectDevices.mockResolvedValueOnce({
                board_list: [
                    {
                        family: 'Xilinx',
                        part_list: ['xc7a35t']
                    }
                ],
                successful: true,
                msg: ''
            });

            vscodeMock.window.showQuickPick.mockResolvedValueOnce(undefined);

            await executeCommand(COMMAND_DETECT);

            expect(globalState.update).not.toHaveBeenCalled();
        });
    });

    describe('bitstream loading', () => {
        it('stops before board selection when no device has been detected', async () => {
            createManager();

            await executeCommand(COMMAND_LOAD);

            expect(vscodeMock.window.showWarningMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: first detect a device before loading a bitstream.'
            );
            expect(mockedListBoards).not.toHaveBeenCalled();
            expect(mockedLoadBitstreamStream).not.toHaveBeenCalled();
        });

        it('does not load a bitstream when the selected device belongs to another project', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, {
                ...selectedDevice,
                projectPath: '/workspace/another-project'
            });

            await executeCommand(COMMAND_LOAD);

            expect(vscodeMock.window.showWarningMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: the selected device belongs to another project. Detect a device again before loading a bitstream.'
            );

            expect(mockedListBoards).not.toHaveBeenCalled();
            expect(vscodeMock.window.showQuickPick).not.toHaveBeenCalled();
            expect(vscodeMock.window.showOpenDialog).not.toHaveBeenCalled();
            expect(mockedLoadBitstreamStream).not.toHaveBeenCalled();
        });

        it('shows an error when listing supported boards fails', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, selectedDevice);

            mockedListBoards.mockResolvedValueOnce({
                board_list: [],
                successful: false,
                msg: 'Unable to list boards'
            });

            await executeCommand(COMMAND_LOAD);

            expect(mockedListBoards).toHaveBeenCalledWith(
                config,
                project.projectDiskPath
            );
            expect(vscodeMock.window.showErrorMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: Unable to list boards'
            );
            expect(mockedLoadBitstreamStream).not.toHaveBeenCalled();
        });

        it('shows a warning when no supported boards are found', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, selectedDevice);

            mockedListBoards.mockResolvedValueOnce({
                board_list: [],
                successful: true,
                msg: ''
            });

            await executeCommand(COMMAND_LOAD);

            expect(vscodeMock.window.showWarningMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: no supported boards were found.'
            );
            expect(vscodeMock.window.showQuickPick).not.toHaveBeenCalled();
        });

        it('loads the bitstream using the selected board name', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, selectedDevice);

            mockedListBoards.mockResolvedValueOnce({
                board_list: [selectedBoard],
                successful: true,
                msg: ''
            });

            vscodeMock.window.showQuickPick.mockResolvedValueOnce({
                label: selectedBoard.name,
                description: 'Cable: digilent',
                board: selectedBoard
            });

            vscodeMock.window.showOpenDialog.mockResolvedValueOnce([
                {
                    fsPath: '/workspace/project/design.bit'
                }
            ]);

            mockedLoadBitstreamStream.mockImplementationOnce(
                (_config, _boardId, _bitstreamPath, _options, onOutput, callback, onProgress) => {
                    onOutput('Programming started.\n');
                    onProgress?.(25);
                    onProgress?.(75);
                    onProgress?.(100);

                    callback({
                        successful: true,
                        msg: 'Programming completed successfully.'
                    });
                    return mockChildProcess;
                }
            );

            await executeCommand(COMMAND_LOAD);

            expect(vscodeMock.window.withProgress).toHaveBeenCalledWith(
                expect.objectContaining({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Loading bitstream to arty',
                    cancellable: false
                }),
                expect.any(Function)
            );
            expect(vscodeMock.progressReport).toHaveBeenCalledWith({ message: '25%' });
            expect(vscodeMock.progressReport).toHaveBeenCalledWith({ message: '75%' });
            expect(vscodeMock.progressReport).toHaveBeenCalledWith({ message: '100%' });
            expect(mockedLoadBitstreamStream).toHaveBeenCalledWith(
                config,
                'arty',
                '/workspace/project/design.bit',
                {
                    cable: 'digilent',
                    verify: true,
                    reset: false
                },
                expect.any(Function),
                expect.any(Function),
                expect.any(Function)
            );

            expect(vscodeMock.window.showInformationMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: bitstream loaded to arty'
            );
        });

        it('shows the detected FPGA alongside the selected supported board', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, selectedDevice);

            mockedListBoards.mockResolvedValueOnce({
                board_list: [selectedBoard],
                successful: true,
                msg: ''
            });
            vscodeMock.window.showQuickPick.mockResolvedValueOnce(undefined);

            await executeCommand(COMMAND_LOAD);

            expect(vscodeMock.window.showQuickPick).toHaveBeenCalledWith(
                [
                    expect.objectContaining({
                        label: selectedBoard.name,
                        detail: 'Detected FPGA: Xilinx — xc7a35t'
                    })
                ],
                expect.objectContaining({
                    placeHolder: 'Select the board you want to program'
                })
            );
            expect(mockedLoadBitstreamStream).not.toHaveBeenCalled();
        });

        it('does not open the file dialog when board selection is cancelled', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, selectedDevice);

            mockedListBoards.mockResolvedValueOnce({
                board_list: [selectedBoard],
                successful: true,
                msg: ''
            });

            vscodeMock.window.showQuickPick.mockResolvedValueOnce(undefined);

            await executeCommand(COMMAND_LOAD);

            expect(vscodeMock.window.showOpenDialog).not.toHaveBeenCalled();
            expect(mockedLoadBitstreamStream).not.toHaveBeenCalled();
        });

        it('does not load a bitstream when file selection is cancelled', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, selectedDevice);

            mockedListBoards.mockResolvedValueOnce({
                board_list: [selectedBoard],
                successful: true,
                msg: ''
            });

            vscodeMock.window.showQuickPick.mockResolvedValueOnce({
                label: selectedBoard.name,
                description: 'Cable: digilent',
                board: selectedBoard
            });

            vscodeMock.window.showOpenDialog.mockResolvedValueOnce(undefined);

            await executeCommand(COMMAND_LOAD);

            expect(mockedLoadBitstreamStream).not.toHaveBeenCalled();
        });

        it('rejects unsupported bitstream file extensions', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, selectedDevice);

            mockedListBoards.mockResolvedValueOnce({
                board_list: [selectedBoard],
                successful: true,
                msg: ''
            });

            vscodeMock.window.showQuickPick.mockResolvedValueOnce({
                label: selectedBoard.name,
                description: 'Cable: digilent',
                board: selectedBoard
            });

            vscodeMock.window.showOpenDialog.mockResolvedValueOnce([
                {
                    fsPath: '/workspace/project/design.txt'
                }
            ]);

            await executeCommand(COMMAND_LOAD);

            expect(vscodeMock.window.showErrorMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: unsupported bitstream file extension.'
            );
            expect(mockedLoadBitstreamStream).not.toHaveBeenCalled();
        });

        it('shows an error when bitstream loading fails', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, selectedDevice);

            mockedListBoards.mockResolvedValueOnce({
                board_list: [selectedBoard],
                successful: true,
                msg: ''
            });

            vscodeMock.window.showQuickPick.mockResolvedValueOnce({
                label: selectedBoard.name,
                description: 'Cable: digilent',
                board: selectedBoard
            });

            vscodeMock.window.showOpenDialog.mockResolvedValueOnce([
                {
                    fsPath: '/workspace/project/design.bit'
                }
            ]);

            mockedLoadBitstreamStream.mockImplementationOnce(
                (_config, _boardId, _bitstreamPath, _options, _onOutput, callback) => {
                    callback({
                        successful: false,
                        msg: 'Programming failed'
                    });
                    return mockChildProcess;
                }
            );

            await executeCommand(COMMAND_LOAD);

            expect(vscodeMock.window.showErrorMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: Programming failed'
            );
        });

        it('surfaces an FPGA and board incompatibility reported by OpenFPGALoader', async () => {
            createManager();

            globalStateValues.set(SELECTED_DEVICE_KEY, selectedDevice);

            mockedListBoards.mockResolvedValueOnce({
                board_list: [selectedBoard],
                successful: true,
                msg: ''
            });

            vscodeMock.window.showQuickPick.mockResolvedValueOnce({
                label: selectedBoard.name,
                description: 'Cable: digilent',
                detail: 'Detected FPGA: Xilinx — xc7a35t',
                board: selectedBoard
            });

            vscodeMock.window.showOpenDialog.mockResolvedValueOnce([
                {
                    fsPath: '/workspace/project/design.bit'
                }
            ]);

            mockedLoadBitstreamStream.mockImplementationOnce(
                (_config, _boardId, _bitstreamPath, _options, _onOutput, callback) => {
                    callback({
                        successful: false,
                        msg: 'FPGA ID mismatch: detected device is incompatible with board arty'
                    });
                    return mockChildProcess;
                }
            );

            await executeCommand(COMMAND_LOAD);

            expect(mockedLoadBitstreamStream).toHaveBeenCalledWith(
                config,
                selectedBoard.name,
                '/workspace/project/design.bit',
                {
                    cable: 'digilent',
                    verify: true,
                    reset: false
                },
                expect.any(Function),
                expect.any(Function),
                expect.any(Function)
            );

            expect(vscodeMock.window.showErrorMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: FPGA ID mismatch: detected device is incompatible with board arty'
            );
            expect(vscodeMock.window.showInformationMessage).not.toHaveBeenCalledWith(
                'OpenFPGALoader: bitstream loaded to arty'
            );
        });
    });

    describe('project validation', () => {
        it('shows a warning when detect is called without a selected project', async () => {
            createManager();

            mockedGetSelectedProject.mockImplementationOnce(() => {
                throw Object.assign(new Error('No project selected'), {
                    name: 'ProjectOperationError'
                });
            });

            await executeCommand(COMMAND_DETECT);

            expect(vscodeMock.window.showWarningMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: you must first select a project.'
            );
            expect(mockedDetectDevices).not.toHaveBeenCalled();
        });

        it('shows a warning when load bitstream is called without a selected project', async () => {
            createManager();

            mockedGetSelectedProject.mockImplementationOnce(() => {
                throw Object.assign(new Error('No project selected'), {
                    name: 'ProjectOperationError'
                });
            });

            await executeCommand(COMMAND_LOAD);

            expect(vscodeMock.window.showWarningMessage).toHaveBeenCalledWith(
                'OpenFPGALoader: you must first select a project.'
            );
            expect(mockedListBoards).not.toHaveBeenCalled();
            expect(mockedLoadBitstreamStream).not.toHaveBeenCalled();
        });
    });
});
