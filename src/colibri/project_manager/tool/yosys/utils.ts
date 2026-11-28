import { t_project_definition } from '../../project_definition';
import { LANGUAGE } from '../../../common/general';
import { get_toplevel_from_path } from '../../../utils/hdl_utils';
import { e_tools_yosys } from '../../../config/config_declaration';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Utility functions for Yosys project management
 */

export interface FileTypeGroup {
    verilogFiles: string[];
    systemVerilogFiles: string[];
}

/**
 * Helper function to get the top level module name from project definition
 * @param projectDefinition Project definition containing top level configuration
 * @returns Top level module name or null if not found
 */
export function getTopLevel(projectDefinition: t_project_definition): string | null {
    const topLevels = projectDefinition.toplevel_path_manager.get();
    
    if (topLevels.length === 0) {
        return null;
    }

    const module_name = get_toplevel_from_path(topLevels[0]);
    return module_name ? module_name : null;
}

/**
 * Get Verilog and SystemVerilog files from project definition
 * @param projectDefinition Project definition containing files
 * @returns Object with arrays of Verilog and SystemVerilog files
 */
export function getVerilogFiles(projectDefinition: t_project_definition): FileTypeGroup {
    const files = projectDefinition.file_manager.get_compile_order();
    const verilogFiles: string[] = [];
    const systemVerilogFiles: string[] = [];

    files.forEach((file) => {
        const relativePath = getRelativeFilePath(projectDefinition, file.name);
        
        if (file.file_type === LANGUAGE.VERILOG) {
            verilogFiles.push(relativePath);
        } else if (file.file_type === LANGUAGE.SYSTEMVERILOG) {
            systemVerilogFiles.push(relativePath);
        }
    });

    return { verilogFiles, systemVerilogFiles };
}

/**
 * Get the relative file path for a file from project root
 * @param projectDefinition Project definition
 * @param fileName Full path to the file
 * @returns Relative path from project root
 */
export function getRelativeFilePath(projectDefinition: t_project_definition, fileName: string): string {
    const relativePath = path.relative(projectDefinition.project_disk_path, fileName);
    return relativePath.startsWith('..') ? fileName : relativePath;
}

/**
 * Check if a stage's RTLIL file exists
 * @param projectPath Project directory path
 * @param stageName Stage name (load, analyze, elaborate)
 * @returns true if the stage file exists
 */
export function checkStageFileExists(projectPath: string, stageName: string): boolean {
    const stageFile = getStageFileName(stageName);
    const fullPath = path.join(projectPath, stageFile);
    return fs.existsSync(fullPath);
}

/**
 * Get the file name for a specific stage
 * @param stageName Stage name (load, analyze, elaborate, synthesis)
 * @returns File name for the stage
 */
export function getStageFileName(stageName: string): string {
    switch (stageName) {
        case 'load':
            return 'step1_raw.rtlil';
        case 'analyze':
            return 'step2_hierarchy.rtlil';
        case 'elaborate':
            return 'step3_elaborated.rtlil';
        case 'synthesis':
            return 'step4_synthesis.rtlil';
        default:
            return `step_${stageName}.rtlil`;
    }
}

/**
 * Get the previous stage name for dependency checking
 * @param stageName Current stage name
 * @returns Previous stage name or null if it's the first stage
 */
export function getPreviousStage(stageName: string): string | null {
    switch (stageName) {
        case 'analyze':
            return 'load';
        case 'elaborate':
            return 'analyze';
        case 'synthesis':
            return 'elaborate';
        default:
            return null;
    }
}

/**
 * Clean up intermediate files from previous runs
 * @param projectPath Project directory path
 */
export function cleanupIntermediateFiles(projectPath: string): void {
    const stageFiles = [
        'step1_raw.rtlil',
        'step2_hierarchy.rtlil', 
        'step3_elaborated.rtlil',
        'step4_synthesis.rtlil'
    ];

    stageFiles.forEach((file) => {
        const fullPath = path.join(projectPath, file);
        if (fs.existsSync(fullPath)) {        try {
            fs.unlinkSync(fullPath);
        } catch (error) {
            // Ignore errors when cleaning up intermediate files
            // Files may not exist or be locked by other processes
        }
        }
    });
}

/**
 * Validate that all required files exist for the project
 * @param projectDefinition Project definition
 * @returns Array of missing files or empty array if all files exist
 */
export function validateProjectFiles(projectDefinition: t_project_definition): string[] {
    const missingFiles: string[] = [];
    const files = projectDefinition.file_manager.get();

    files.forEach((file) => {
        if (!fs.existsSync(file.name)) {
            missingFiles.push(file.name);
        }
    });

    return missingFiles;
}

/**
 * Find the latest available state file in order of preference: synthesis, elaborate, analyze, load
 * @param projectPath Project directory path
 * @returns The filename of the latest state file, or null if none found
 */
export function getLatestStateFile(projectPath: string): string | null {
    const stages = ['synthesis', 'elaborate', 'analyze', 'load'];
    
    for (const stage of stages) {
        if (checkStageFileExists(projectPath, stage)) {
            return getStageFileName(stage);
        }
    }
    
    return null;
}

/**
 * Get the SVG filename for the Show task output
 * @returns SVG filename
 */
export function getShowSvgFileName(): string {
    return 'show_output.svg';
}

/**
 * Get the full path to the SVG file
 * @param projectPath Project directory path
 * @returns Full path to SVG file
 */
export function getShowSvgFilePath(projectPath: string): string {
    return path.join(projectPath, getShowSvgFileName());
}
