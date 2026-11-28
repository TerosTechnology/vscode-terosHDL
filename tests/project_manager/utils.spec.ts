// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
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

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { createRandomFolderFromBasePath, get_edam_json } from '../../src/colibri/project_manager/utils/utils';
import * as file_utils from '../../src/colibri/utils/file_utils';

describe('Project Manager Utils', () => {
    let tempDir: string;

    beforeEach(() => {
        // Create a temporary directory for testing
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teroshdl-test-'));
    });

    afterEach(() => {
        // Clean up temporary directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    describe('createRandomFolderFromBasePath', () => {
        test('should create a folder with the expected format', () => {
            const baseName = 'testproject'; // Use simple name without underscores
            const result = createRandomFolderFromBasePath(baseName, tempDir);

            // Verify the folder was created
            expect(fs.existsSync(result)).toBe(true);
            expect(fs.statSync(result).isDirectory()).toBe(true);

            // Verify the folder name format: baseName_YYYYMMDDHHMMSS_randomhex
            const folderName = path.basename(result);
            
            // The format should be: baseName_timestamp_randomhex
            expect(folderName).toMatch(new RegExp(`^${baseName}_\\d{14}_[a-f0-9]{16}$`));
            
            // Extract the parts by finding the last two underscores
            const lastUnderscoreIndex = folderName.lastIndexOf('_');
            const secondLastUnderscoreIndex = folderName.lastIndexOf('_', lastUnderscoreIndex - 1);
            
            const extractedBaseName = folderName.substring(0, secondLastUnderscoreIndex);
            const timestamp = folderName.substring(secondLastUnderscoreIndex + 1, lastUnderscoreIndex);
            const randomHex = folderName.substring(lastUnderscoreIndex + 1);
            
            expect(extractedBaseName).toBe(baseName);
            expect(timestamp).toMatch(/^\d{14}$/); // 14 digit timestamp
            expect(randomHex).toMatch(/^[a-f0-9]{16}$/); // 16 character hex string from 8 random bytes
        });

        test('should create folders with different names on subsequent calls', () => {
            const baseName = 'testproject';
            
            const result1 = createRandomFolderFromBasePath(baseName, tempDir);
            // Small delay to ensure different timestamp or random hex
            const result2 = createRandomFolderFromBasePath(baseName, tempDir);

            expect(result1).not.toBe(result2);
            expect(fs.existsSync(result1)).toBe(true);
            expect(fs.existsSync(result2)).toBe(true);
        });

        test('should handle different base names', () => {
            const baseNames = ['project1', 'myproject', 'testfolder', 'simple'];
            
            baseNames.forEach(baseName => {
                const result = createRandomFolderFromBasePath(baseName, tempDir);
                const folderName = path.basename(result);
                
                expect(folderName).toMatch(new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_\\d{14}_[a-f0-9]{16}$`));
                expect(fs.existsSync(result)).toBe(true);
            });
        });

        test('should create folders in the specified base path', () => {
            const baseName = 'testproject';
            const subDir = path.join(tempDir, 'subdir');
            fs.mkdirSync(subDir);

            const result = createRandomFolderFromBasePath(baseName, subDir);
            
            expect(path.dirname(result)).toBe(subDir);
            expect(fs.existsSync(result)).toBe(true);
        });

        test('should create nested directories if base path does not exist', () => {
            const baseName = 'testproject';
            const nestedPath = path.join(tempDir, 'nested', 'deep', 'path');

            const result = createRandomFolderFromBasePath(baseName, nestedPath);
            
            expect(fs.existsSync(result)).toBe(true);
            expect(fs.existsSync(nestedPath)).toBe(true);
        });

        test('should return absolute path', () => {
            const baseName = 'testproject';
            const result = createRandomFolderFromBasePath(baseName, tempDir);
            
            expect(path.isAbsolute(result)).toBe(true);
        });

        test('should handle empty base name', () => {
            const baseName = '';
            const result = createRandomFolderFromBasePath(baseName, tempDir);
            
            const folderName = path.basename(result);
            expect(folderName).toMatch(/^_\d{14}_[a-f0-9]{16}$/);
            expect(fs.existsSync(result)).toBe(true);
        });

        test('should use current timestamp format correctly', () => {
            const baseName = 'timestamptest';
            const beforeTime = new Date();
            
            const result = createRandomFolderFromBasePath(baseName, tempDir);
            
            const afterTime = new Date();
            const folderName = path.basename(result);
            
            // Extract timestamp from the format: baseName_timestamp_randomhex
            const lastUnderscoreIndex = folderName.lastIndexOf('_');
            const secondLastUnderscoreIndex = folderName.lastIndexOf('_', lastUnderscoreIndex - 1);
            const timestampPart = folderName.substring(secondLastUnderscoreIndex + 1, lastUnderscoreIndex);
            
            // Verify timestamp format is 14 digits
            expect(timestampPart).toMatch(/^\d{14}$/);
            
            // Parse the timestamp: YYYYMMDDHHMMSS
            const year = parseInt(timestampPart.substring(0, 4));
            const month = parseInt(timestampPart.substring(4, 6));
            const day = parseInt(timestampPart.substring(6, 8));
            const hour = parseInt(timestampPart.substring(8, 10));
            const minute = parseInt(timestampPart.substring(10, 12));
            const second = parseInt(timestampPart.substring(12, 14));
            
            // Verify the timestamp components are valid
            expect(year).toBeGreaterThanOrEqual(2020); // reasonable year
            expect(year).toBeLessThanOrEqual(2050);
            expect(month).toBeGreaterThanOrEqual(1);
            expect(month).toBeLessThanOrEqual(12);
            expect(day).toBeGreaterThanOrEqual(1);
            expect(day).toBeLessThanOrEqual(31);
            expect(hour).toBeGreaterThanOrEqual(0);
            expect(hour).toBeLessThanOrEqual(23);
            expect(minute).toBeGreaterThanOrEqual(0);
            expect(minute).toBeLessThanOrEqual(59);
            expect(second).toBeGreaterThanOrEqual(0);
            expect(second).toBeLessThanOrEqual(59);
        });
    });

    describe('get_edam_json', () => {
        const createFile = (name: string) => ({
            name,
            is_include_file: false,
            include_path: '',
            logical_name: 'work',
            is_manual: false,
            file_type: 'vhdl',
            file_version: undefined,
            source_type: 'NONE',
        });

        const visualFiles = [
            createFile('file1.vhd'),
            createFile('file2.vhd'),
        ];

        const compileFiles = [
            createFile('file2.vhd'),
            createFile('file1.vhd'),
        ];

        const createProject = () => ({
            name: 'test_project',
            project_disk_path: '',
            project_type: '',
            config: {
                tools: {
                    general: {
                        select_tool: 'ghdl',
                    },
                    ghdl: {
                        installation_path: '',
                    },
                },
            },
            file_manager: {
                get: jest.fn().mockReturnValue(visualFiles),
                get_compile_order: jest.fn().mockReturnValue(compileFiles),
            },
            toplevel_path_manager: {
                get: jest.fn().mockReturnValue([]),
            },
            hook_manager: {
                get: jest.fn().mockReturnValue([]),
            },
            watcher_manager: {
                get: jest.fn().mockReturnValue([]),
            },
        });

        test('uses visual order by default', () => {
            const project = createProject();

            const result = get_edam_json(project as any, []);

            expect(result.files).toBe(visualFiles);
            expect(project.file_manager.get).toHaveBeenCalledWith(undefined);
            expect(project.file_manager.get_compile_order).not.toHaveBeenCalled();
        });

        test('uses compilation order when enabled', () => {
            const project = createProject();

            const result = get_edam_json(project as any, [], undefined, false, true);

            expect(result.files).toBe(compileFiles);
            expect(project.file_manager.get_compile_order).toHaveBeenCalledTimes(1);
            expect(project.file_manager.get).not.toHaveBeenCalled();
        });

        test('uses visual order when reference path is provided', () => {
            const project = createProject();
            const referencePath = '/tmp/reference';

            get_edam_json(project as any, [], referencePath, false, true);

            expect(project.file_manager.get).toHaveBeenCalledWith(referencePath);
            expect(project.file_manager.get_compile_order).not.toHaveBeenCalled();
        });
    });
});
