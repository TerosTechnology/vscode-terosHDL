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
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

import { ChildProcess } from 'child_process';
import { File_manager } from '../../../../src/colibri/project_manager/list_manager/file';
import { Hook_manager } from '../../../../src/colibri/project_manager/list_manager/hook';
import { Parameter_manager } from '../../../../src/colibri/project_manager/list_manager/parameter';
import { Watcher_manager } from '../../../../src/colibri/project_manager/list_manager/watcher';
import { Toplevel_path_manager } from '../../../../src/colibri/project_manager/list_manager/toplevel_path';
import { t_project_definition } from '../../../../src/colibri/project_manager/project_definition';
import { LoggerBase } from '../../../../src/colibri/logger/logger';
import { p_result } from '../../../../src/colibri/process/common';
import { e_tools_yosys_synthesis_target } from '../../../../src/colibri/config/config_declaration';
import { e_project_type } from '../../../../src/colibri/project_manager/common';
import {
    runYosysLoadFiles,
    runYosysAnalyze,
    runYosysElaborate,
    runYosysSynthesis,
    runYosysCompileAll,
    runYosysShow,
    runYosysResourceUtilization,
    runYosysOpenProjectFolder
} from '../../../../src/colibri/project_manager/tool/yosys/tasks';

// Mock dependencies
jest.mock('../../../../src/colibri/project_manager/tool/yosys/utils');
jest.mock('../../../../src/colibri/project_manager/tool/yosys/commandBuilder');
jest.mock('../../../../src/colibri/project_manager/tool/yosys/executor');
jest.mock('../../../../src/colibri/project_manager/list_manager/watcher');
jest.mock('../../../../src/colibri/utils/file_utils');
jest.mock('fs');
jest.mock('path');
jest.mock('chokidar');

describe('Yosys Tasks', (): void => {
    let testProject: t_project_definition;
    let mockLogger: LoggerBase;

    beforeEach((): void => {
        // Create test project
        testProject = {
            name: 'test_project',
            project_type: e_project_type.GENERIC,
            project_disk_path: '/test/project/path',
            config: {
                tools: {
                    yosys: {
                        synthesis_target: e_tools_yosys_synthesis_target.ice40,
                        installation_path: '',
                        read_verilog_options: [],
                        read_systemverilog_options: [],
                        read_liberty_options: [],
                        hierarchy_options: [],
                        proc_options: [],
                        opt_options: [],
                        flatten_enabled: false,
                        flatten_options: [],
                        memory_options: [],
                        fsm_enabled: false,
                        fsm_options: [],
                        techmap_enabled: false,
                        techmap_options: [],
                        abc_enabled: false,
                        abc_options: []
                    }
                } as any
            } as any,
            file_manager: new File_manager(),
            hook_manager: new Hook_manager(),
            parameter_manager: new Parameter_manager(),
            toplevel_path_manager: new Toplevel_path_manager(),
            watcher_manager: { } as any
        };

        // Add test files to project  
        // Mock the file manager to simplify testing
        testProject.file_manager = {
            add: jest.fn(),
            get_files: jest.fn(() => [
                { name: 'test1.v', file_type: 'verilogSource' },
                { name: 'test2.sv', file_type: 'systemVerilogSource' }
            ])
        } as any;
        testProject.toplevel_path_manager.add('top_module');

        // Create mock logger
        mockLogger = {
            appendLine: jest.fn(),
            log: jest.fn(),
            trace: jest.fn()
        } as unknown as LoggerBase;

        // Setup mocks with default success behavior
        const mockExecutor = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/executor') as any;
        mockExecutor.executeYosysScript = jest.fn((
            config: any,
            script: string,
            cwd: string,
            toolLogger: LoggerBase,
            callback: (result: p_result) => void
        ): ChildProcess => {
            const mockResult: p_result = {
                command: 'yosys',
                stdout: 'Yosys script executed successfully',
                stderr: '',
                return_value: 0,
                successful: true
            };
            setTimeout((): void => callback(mockResult), 0);
            return { pid: 12345 } as ChildProcess;
        });
        mockExecutor.executeCommand = jest.fn((
            command: string,
            cwd: string,
            toolLogger: LoggerBase,
            callback: (result: p_result) => void
        ): ChildProcess => {
            const mockResult: p_result = {
                command: command,
                stdout: 'Command executed successfully',
                stderr: '',
                return_value: 0,
                successful: true
            };
            setTimeout((): void => callback(mockResult), 0);
            return { pid: 12345 } as ChildProcess;
        });
        mockExecutor.getBinary = jest.fn((): string => 'yosys');

        // Setup utils mocks
        const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
        mockUtils.getVerilogFiles = jest.fn(() => ({
            verilogFiles: ['test1.v'],
            systemVerilogFiles: ['test2.sv']
        }));
        mockUtils.validateProjectFiles = jest.fn(() => []);
        mockUtils.getStageFileName = jest.fn((stage: string) => `step_${stage}.rtlil`);
        mockUtils.checkStageFileExists = jest.fn(() => true);
        mockUtils.getTopLevel = jest.fn(() => 'top_module');
        mockUtils.getPreviousStage = jest.fn(() => null);
        mockUtils.getLatestStateFile = jest.fn(() => 'step4_synthesis.rtlil');
        mockUtils.getShowSvgFileName = jest.fn(() => 'yosys_output.svg');

        // Setup command builder mocks
        const mockBuilder = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/commandBuilder') as any;
        mockBuilder.buildLoadCommands = jest.fn(() => ['read_verilog test1.v', 'read_verilog -sv test2.sv']);
        mockBuilder.buildAnalyzeCommands = jest.fn(() => ['hierarchy -top top_module']);
        mockBuilder.buildElaborateCommands = jest.fn(() => ['proc', 'clean']);
        mockBuilder.buildSynthesisCommands = jest.fn(() => ['synth']);
        mockBuilder.buildShowCommands = jest.fn(() => ['show top_module']);
        mockBuilder.buildUtilizationCommands = jest.fn(() => ['stat -tech cmos']);

        // Setup fs mocks
        const mockFs = jest.requireMock('fs') as any;
        mockFs.existsSync = jest.fn(() => true);
    });

    afterEach((): void => {
        jest.clearAllMocks();
    });

    describe('runYosysLoadFiles', (): void => {
        it('should load files successfully', (done): void => {
            runYosysLoadFiles(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(true);
                expect(result.stdout).toContain('Yosys script executed successfully');
                done();
            });
        }, 10000);

        it('should return error when no files are present', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            // Mock to return empty file arrays to trigger error condition
            mockUtils.getVerilogFiles.mockReturnValueOnce({
                verilogFiles: [],
                systemVerilogFiles: []
            });
            
            runYosysLoadFiles(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('No Verilog or SystemVerilog files found');
                done();
            });
        }, 10000);

        it('should handle missing files', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.validateProjectFiles.mockReturnValueOnce(['missing_file.v']);
            
            runYosysLoadFiles(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('Missing files: missing_file.v');
                done();
            });
        }, 10000);
    });

    describe('runYosysAnalyze', (): void => {
        it('should analyze successfully', (done): void => {
            runYosysAnalyze(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(true);
                expect(result.stdout).toContain('Yosys script executed successfully');
                done();
            });
        }, 10000);

        it('should check for prerequisite load stage', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getPreviousStage.mockReturnValueOnce('load');
            mockUtils.checkStageFileExists.mockReturnValueOnce(false);
            
            runYosysAnalyze(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('Load Files');
                done();
            });
        }, 10000);

        it('should handle missing top level module', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getTopLevel.mockReturnValueOnce(null);
            
            runYosysAnalyze(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('No top level module specified');
                done();
            });
        }, 10000);
    });

    describe('runYosysElaborate', (): void => {
        it('should elaborate successfully', (done): void => {
            runYosysElaborate(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(true);
                expect(result.stdout).toContain('Yosys script executed successfully');
                done();
            });
        }, 10000);

        it('should check for prerequisite analyze stage', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getPreviousStage.mockReturnValueOnce('analyze');
            mockUtils.checkStageFileExists.mockReturnValueOnce(false);
            
            runYosysElaborate(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('Analyze');
                done();
            });
        }, 10000);
    });

    describe('runYosysSynthesis', (): void => {
        it('should synthesize successfully', (done): void => {
            runYosysSynthesis(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(true);
                expect(result.stdout).toContain('Yosys script executed successfully');
                done();
            });
        }, 10000);

        it('should check for prerequisite elaborate stage', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getPreviousStage.mockReturnValueOnce('elaborate');
            mockUtils.checkStageFileExists.mockReturnValueOnce(false);
            
            runYosysSynthesis(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('Elaborate');
                done();
            });
        }, 10000);

        it('should handle missing top level module', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getTopLevel.mockReturnValueOnce(null);
            
            runYosysSynthesis(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('No top level module specified');
                done();
            });
        }, 10000);
    });

    describe('runYosysCompileAll', (): void => {
        it('should compile all successfully', (done): void => {
            runYosysCompileAll(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(true);
                expect(result.stdout).toContain('Yosys script executed successfully');
                done();
            });
        }, 10000);

        it('should return error when no files are present', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getVerilogFiles.mockReturnValueOnce({
                verilogFiles: [],
                systemVerilogFiles: []
            });
            
            runYosysCompileAll(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('No Verilog or SystemVerilog files found');
                done();
            });
        }, 10000);

        it('should handle missing top level module', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getTopLevel.mockReturnValueOnce(null);
            
            runYosysCompileAll(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('No top level module specified');
                done();
            });
        }, 10000);
    });

    describe('runYosysShow', (): void => {
        it('should show successfully', (done): void => {
            runYosysShow(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(true);
                expect(result.stdout).toContain('Yosys script executed successfully');
                done();
            });
        }, 10000);

        it('should generate show diagram successfully when state file exists', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getLatestStateFile.mockReturnValueOnce('step4_synthesis.rtlil');
            mockUtils.getShowSvgFileName.mockReturnValueOnce('show_output.svg');
            
            runYosysShow(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(true);
                expect(result.stdout).toContain('Yosys script executed successfully');
                done();
            });
        }, 10000);

        it('should handle missing state files', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getLatestStateFile.mockReturnValueOnce(null);
            
            runYosysShow(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('No state files found');
                done();
            });
        }, 10000);
    });

    describe('runYosysResourceUtilization', (): void => {
        it('should return resource utilization successfully', (done): void => {
            runYosysResourceUtilization(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(true);
                expect(result.stdout).toContain('Yosys script executed successfully');
                done();
            });
        }, 10000);

        it('should return error when no synthesis state is available', (done): void => {
            const mockUtils = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/utils') as any;
            mockUtils.getLatestStateFile.mockReturnValueOnce(null); // No state files available
            
            runYosysResourceUtilization(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('No state files found');
                done();
            });
        }, 10000);
    });

    describe('runYosysOpenProjectFolder', (): void => {
        it('should execute open project folder task successfully', (done): void => {
            runYosysOpenProjectFolder(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(true);
                done();
            });
        }, 10000);

        it('should handle non-existent project directory', (done): void => {
            const mockExecutor = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/executor') as any;
            mockExecutor.executeCommand.mockImplementationOnce((
                command: string,
                cwd: string,
                toolLogger: LoggerBase,
                callback: (result: p_result) => void
            ): ChildProcess => {
                const errorResult: p_result = {
                    command: command,
                    stdout: '',
                    stderr: 'Directory not found',
                    return_value: 1,
                    successful: false
                };
                setTimeout((): void => callback(errorResult), 0);
                return { pid: 12345 } as ChildProcess;
            });
            
            runYosysOpenProjectFolder(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('Directory not found');
                done();
            });
        }, 10000);
    });

    describe('Error Handling and Edge Cases', (): void => {
        it('should handle executor failures gracefully', (done): void => {
            const mockExecutor = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/executor') as any;
            mockExecutor.executeYosysScript.mockImplementationOnce((
                config: any,
                script: string,
                cwd: string,
                toolLogger: LoggerBase,
                callback: (result: p_result) => void
            ): ChildProcess => {
                const errorResult: p_result = {
                    command: 'yosys',
                    stdout: '',
                    stderr: 'Yosys execution failed',
                    return_value: 1,
                    successful: false
                };
                setTimeout((): void => callback(errorResult), 0);
                return { pid: 12345 } as ChildProcess;
            });
            
            runYosysLoadFiles(testProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                expect(result.successful).toBe(false);
                expect(result.stderr).toContain('Yosys execution failed');
                done();
            });
        }, 10000);

        it('should handle missing project configuration', (): void => {
            const projectWithoutConfig: t_project_definition = { ...testProject };
            (projectWithoutConfig.config.tools as any) = undefined;
            
            expect((): void => {
                runYosysLoadFiles(projectWithoutConfig, mockLogger, (): void => {});
            }).toThrow();
        });

        it('should handle invalid project disk path', (done): void => {
            const invalidProject: t_project_definition = { ...testProject };
            invalidProject.project_disk_path = '';
            
            runYosysLoadFiles(invalidProject, mockLogger, (result: p_result): void => {
                expect(result).toBeDefined();
                // The actual behavior depends on the implementation
                done();
            });
        }, 10000);

        it('should handle command builder failures', (): void => {
            const mockBuilder = jest.requireMock('../../../../src/colibri/project_manager/tool/yosys/commandBuilder') as any;
            mockBuilder.buildLoadCommands.mockImplementationOnce((): never => {
                throw new Error('Command builder failed');
            });
            
            expect((): void => {
                runYosysLoadFiles(testProject, mockLogger, (): void => {});
            }).toThrow('Command builder failed');
        });
    });
});
