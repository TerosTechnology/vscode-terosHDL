// Copyright 2025
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
    getTopLevel, 
    getVhdlFiles, 
    groupFilesByLibrary, 
    getRelativeFilePath 
} from '../../../../src/colibri/project_manager/tool/ghdl/utils';
import { 
    e_tools_ghdl,
    e_tools_ghdl_vhdl_standard,
    e_tools_ghdl_debug_level,
    e_tools_ghdl_ieee_library,
    e_tools_ghdl_assert_level,
    e_tools_ghdl_waveform_format,
    e_tools_ghdl_backtrace_severity,
    e_tools_ghdl_ieee_asserts,
    e_tools_ghdl_asserts_policy,
    e_tools_ghdl_disp_tree
} from '../../../../src/colibri/config/config_declaration';
import { t_project_definition } from '../../../../src/colibri/project_manager/project_definition';
import { LANGUAGE } from '../../../../src/colibri/common/general';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Mock the hdl_utils module since it might have external dependencies
jest.mock('../../../../src/colibri/utils/hdl_utils', () => ({
    get_toplevel_from_path: jest.fn()
}));

import * as hdl_utils from '../../../../src/colibri/utils/hdl_utils';

describe('GHDL Utils', () => {
    let defaultConfig: e_tools_ghdl;
    let tempDir: string;
    let mockProjectDefinition: t_project_definition;

    beforeEach(() => {
        // Create a temporary directory for testing
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teroshdl-ghdl-utils-test-'));

        // Create a minimal default configuration
        defaultConfig = {
            installation_path: '',
            vhdl_standard: e_tools_ghdl_vhdl_standard.vhdl08,
            verbose: false,
            debug_level: e_tools_ghdl_debug_level.none,
            ieee_library: e_tools_ghdl_ieee_library.standard,
            library_paths: [],
            assert_level: e_tools_ghdl_assert_level.error,
            relaxed_rules: false,
            relaxed_parsing: false,
            psl_enabled: false,
            unicode_support: false,
            bind_checks: true,
            vital_checks: false,
            warnings_as_errors: false,
            suppress_warnings: [],
            resolution_limit: '',
            analyze_options: [],
            elaborate_options: [],
            run_options: [],
            synthesis_options: [],
            check_syntax_options: [],
            extra_flags: [],
            work_library: 'work',
            waveform_enabled: false,
            waveform_format: e_tools_ghdl_waveform_format.ghw,
            waveform_options: [],
            simulation_time: '',
            stack_size: '',
            stop_delta_cycles: 0,
            display_time: false,
            unbuffered_output: false,
            max_stack_alloc: 0,
            backtrace_severity: e_tools_ghdl_backtrace_severity.error,
            ieee_asserts: e_tools_ghdl_ieee_asserts.enable,
            asserts_policy: e_tools_ghdl_asserts_policy.enable,
            sdf_file: '',
            vpi_modules: [],
            vhpi_modules: [],
            vpi_trace_file: '',
            vhpi_trace_file: '',
            psl_report_file: '',
            psl_report_uncovered: false,
            disp_tree: e_tools_ghdl_disp_tree.none,
            wave_start_time: '',
            vcd_4states: false,
            vcd_nodate: false,
            read_wave_opt: '',
            write_wave_opt: '',
            no_run: false
        };

        // Create a mock project definition
        mockProjectDefinition = {
            project_disk_path: tempDir,
            toplevel_path_manager: {
                get: jest.fn().mockReturnValue([])
            },
            file_manager: {
                get: jest.fn().mockReturnValue([]),
                get_compile_order: jest.fn().mockReturnValue([])
            }
        } as any;
    });

    afterEach(() => {
        // Clean up temporary directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        jest.clearAllMocks();
    });

    describe('getTopLevel', () => {
        test('should return null when no top level paths are configured', () => {
            (mockProjectDefinition.toplevel_path_manager.get as jest.Mock).mockReturnValue([]);
            
            const result: string | null = getTopLevel(mockProjectDefinition);
            expect(result).toBeNull();
        });

        test('should return null when top level path exists but entity name extraction fails', () => {
            (mockProjectDefinition.toplevel_path_manager.get as jest.Mock).mockReturnValue(['/path/to/testbench.vhd']);
            (hdl_utils.get_toplevel_from_path as jest.Mock).mockReturnValue(null);
            
            const result: string | null = getTopLevel(mockProjectDefinition);
            expect(result).toBeNull();
        });

        test('should return entity name when extraction succeeds', () => {
            const testPath = '/path/to/testbench.vhd';
            const expectedEntity = 'testbench';
            
            (mockProjectDefinition.toplevel_path_manager.get as jest.Mock).mockReturnValue([testPath]);
            (hdl_utils.get_toplevel_from_path as jest.Mock).mockReturnValue(expectedEntity);
            
            const result: string | null = getTopLevel(mockProjectDefinition);
            expect(result).toBe(expectedEntity);
            expect(hdl_utils.get_toplevel_from_path).toHaveBeenCalledWith(testPath);
        });

        test('should use first top level path when multiple are configured', () => {
            const testPaths = ['/path/to/testbench1.vhd', '/path/to/testbench2.vhd'];
            const expectedEntity = 'testbench1';
            
            (mockProjectDefinition.toplevel_path_manager.get as jest.Mock).mockReturnValue(testPaths);
            (hdl_utils.get_toplevel_from_path as jest.Mock).mockReturnValue(expectedEntity);
            
            const result: string | null = getTopLevel(mockProjectDefinition);
            expect(result).toBe(expectedEntity);
            expect(hdl_utils.get_toplevel_from_path).toHaveBeenCalledWith(testPaths[0]);
        });
    });

    describe('getVhdlFiles', () => {
        test('should return empty array when no files are configured', () => {
            (mockProjectDefinition.file_manager.get_compile_order as jest.Mock).mockReturnValue([]);
            
            const result = getVhdlFiles(mockProjectDefinition);
            expect(result).toEqual([]);
        });

        test('should filter VHDL files from mixed file types', () => {
            const allFiles = [
                { name: 'test1.vhd', file_type: LANGUAGE.VHDL, logical_name: 'work' },
                { name: 'test2.v', file_type: LANGUAGE.VERILOG, logical_name: 'work' },
                { name: 'test3.vhdl', file_type: LANGUAGE.VHDL, logical_name: 'mylib' },
                { name: 'test4.sv', file_type: LANGUAGE.SYSTEMVERILOG, logical_name: 'work' }
            ];
            
            (mockProjectDefinition.file_manager.get_compile_order as jest.Mock).mockReturnValue(allFiles);
            
            const result = getVhdlFiles(mockProjectDefinition);
            expect(result).toHaveLength(2);
            expect(result).toEqual([
                { name: 'test1.vhd', file_type: LANGUAGE.VHDL, logical_name: 'work' },
                { name: 'test3.vhdl', file_type: LANGUAGE.VHDL, logical_name: 'mylib' }
            ]);
        });

        test('should return all VHDL files when only VHDL files exist', () => {
            const vhdlFiles = [
                { name: 'entity1.vhd', file_type: LANGUAGE.VHDL, logical_name: 'work' },
                { name: 'entity2.vhdl', file_type: LANGUAGE.VHDL, logical_name: 'testlib' },
                { name: 'package1.vhd', file_type: LANGUAGE.VHDL }
            ];
            
            (mockProjectDefinition.file_manager.get_compile_order as jest.Mock).mockReturnValue(vhdlFiles);
            
            const result = getVhdlFiles(mockProjectDefinition);
            expect(result).toEqual(vhdlFiles);
        });
    });

    describe('groupFilesByLibrary', () => {
        test('should group files by logical_name when specified', () => {
            const vhdlFiles = [
                { name: 'work1.vhd', file_type: LANGUAGE.VHDL, logical_name: 'work' },
                { name: 'lib1.vhd', file_type: LANGUAGE.VHDL, logical_name: 'mylib' },
                { name: 'work2.vhd', file_type: LANGUAGE.VHDL, logical_name: 'work' },
                { name: 'lib2.vhd', file_type: LANGUAGE.VHDL, logical_name: 'mylib' }
            ];
            
            (mockProjectDefinition.file_manager.get_compile_order as jest.Mock).mockReturnValue(vhdlFiles);
            
            const result: Map<string, string[]> = groupFilesByLibrary(mockProjectDefinition, defaultConfig);
            
            expect(result.size).toBe(2);
            expect(result.get('work')).toEqual(['work1.vhd', 'work2.vhd']);
            expect(result.get('mylib')).toEqual(['lib1.vhd', 'lib2.vhd']);
        });

        test('should use config work_library when logical_name is not specified', () => {
            const vhdlFiles = [
                { name: 'test1.vhd', file_type: LANGUAGE.VHDL },
                { name: 'test2.vhd', file_type: LANGUAGE.VHDL }
            ];
            const config = { ...defaultConfig, work_library: 'custom_work' };
            
            (mockProjectDefinition.file_manager.get_compile_order as jest.Mock).mockReturnValue(vhdlFiles);
            
            const result: Map<string, string[]> = groupFilesByLibrary(mockProjectDefinition, config);
            
            expect(result.size).toBe(1);
            expect(result.get('custom_work')).toEqual(['test1.vhd', 'test2.vhd']);
        });

        test('should default to work library when neither logical_name nor work_library is specified', () => {
            const vhdlFiles = [
                { name: 'test1.vhd', file_type: LANGUAGE.VHDL },
                { name: 'test2.vhd', file_type: LANGUAGE.VHDL }
            ];
            const config = { ...defaultConfig, work_library: '' };
            
            (mockProjectDefinition.file_manager.get_compile_order as jest.Mock).mockReturnValue(vhdlFiles);
            
            const result: Map<string, string[]> = groupFilesByLibrary(mockProjectDefinition, config);
            
            expect(result.size).toBe(1);
            expect(result.get('work')).toEqual(['test1.vhd', 'test2.vhd']);
        });

        test('should handle absolute paths correctly', () => {
            const absolutePath = path.join(tempDir, 'subdir', 'test.vhd');
            const vhdlFiles = [
                { name: absolutePath, file_type: LANGUAGE.VHDL, logical_name: 'work' }
            ];
            
            (mockProjectDefinition.file_manager.get_compile_order as jest.Mock).mockReturnValue(vhdlFiles);
            
            const result: Map<string, string[]> = groupFilesByLibrary(mockProjectDefinition, defaultConfig);
            
            expect(result.size).toBe(1);
            expect(result.get('work')).toEqual([path.join('subdir', 'test.vhd')]);
        });

        test('should handle files outside project directory', () => {
            const outsidePath = '/completely/different/path/test.vhd';
            const vhdlFiles = [
                { name: outsidePath, file_type: LANGUAGE.VHDL, logical_name: 'work' }
            ];
            
            (mockProjectDefinition.file_manager.get_compile_order as jest.Mock).mockReturnValue(vhdlFiles);
            
            const result: Map<string, string[]> = groupFilesByLibrary(mockProjectDefinition, defaultConfig);
            
            expect(result.size).toBe(1);
            expect(result.get('work')).toEqual([outsidePath]);
        });

        test('should return empty map when no VHDL files exist', () => {
            (mockProjectDefinition.file_manager.get_compile_order as jest.Mock).mockReturnValue([]);
            
            const result: Map<string, string[]> = groupFilesByLibrary(mockProjectDefinition, defaultConfig);
            
            expect(result.size).toBe(0);
        });
    });

    describe('getRelativeFilePath', () => {
        test('should return relative path for files within project directory', () => {
            const fileName = path.join(tempDir, 'subdir', 'test.vhd');
            
            const result: string = getRelativeFilePath(mockProjectDefinition, fileName);
            expect(result).toBe(path.join('subdir', 'test.vhd'));
        });

        test('should return absolute path for files outside project directory', () => {
            const fileName = '/completely/different/path/test.vhd';
            
            const result: string = getRelativeFilePath(mockProjectDefinition, fileName);
            expect(result).toBe(fileName);
        });

        test('should handle file in project root', () => {
            const fileName = path.join(tempDir, 'test.vhd');
            
            const result: string = getRelativeFilePath(mockProjectDefinition, fileName);
            expect(result).toBe('test.vhd');
        });

        test('should handle same path as project directory', () => {
            const result: string = getRelativeFilePath(mockProjectDefinition, tempDir);
            expect(result).toBe(''); // When getting relative path of directory to itself, it returns empty string
        });
    });
});
