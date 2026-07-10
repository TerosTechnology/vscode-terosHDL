import { t_project_definition } from 'colibri/project_manager/project_definition';
import { LANGUAGE } from 'colibri/common/general';
import { get_toplevel_from_path } from 'colibri/utils/hdl_utils';
import { e_tools_nvc } from 'colibri/config/config_declaration';
import * as path from 'path';

/**
 * Utility functions for nvc project management
 */

export interface FileLibraryGroup {
    library: string;
    files: string[];
}

/**
 * Helper function to get the top level entity name from project definition
 * @param projectDefinition Project definition containing top level configuration
 * @returns Top level entity name or null if not found
 */
export function getTopLevel(projectDefinition: t_project_definition): string | null {
    const topLevels = projectDefinition.toplevel_path_manager.get();
    
    if (topLevels.length === 0) {
        return null;
    }

    const entity_name = get_toplevel_from_path(topLevels[0]);
    return entity_name ? entity_name : null;
}

/**
 * Get VHDL files from project definition
 * @param projectDefinition Project definition containing files
 * @returns Array of VHDL files
 */
export function getVhdlFiles(projectDefinition: t_project_definition): Array<{ name: string; logical_name?: string }> {
    const files = projectDefinition.file_manager.get();
    return files.filter((file) => file.file_type === LANGUAGE.VHDL);
}

/**
 * Group VHDL files by logical library
 * @param projectDefinition Project definition containing files
 * @param config nvc configuration
 * @returns Map of library names to file arrays
 */
export function groupFilesByLibrary(
    projectDefinition: t_project_definition, 
    config: e_tools_nvc
): Map<string, string[]> {
    const vhdlFiles = getVhdlFiles(projectDefinition);
    const libraryGroups = new Map<string, string[]>();

    vhdlFiles.forEach((file) => {
        const library = file.logical_name || config.work_library || 'work';
        const relativePath = path.relative(projectDefinition.project_disk_path, file.name);
        const filePath = relativePath.startsWith('..') ? file.name : relativePath;

        if (!libraryGroups.has(library)) {
            libraryGroups.set(library, []);
        }
        libraryGroups.get(library)!.push(filePath);
    });

    return libraryGroups;
}