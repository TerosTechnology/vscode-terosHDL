import { p_result } from 'colibri/process/common';
import { ChildProcess } from 'child_process';
import { t_project_definition } from 'colibri/project_manager/project_definition';
import { buildGhdlArgs } from './commandBuilder';
import { executeGhdlCommand, executeCommand, buildChainedCommand, getBinary, quoteArgs } from './executor';
import { getTopLevel, getVhdlFiles, groupFilesByLibrary, getRelativeFilePath } from './utils';
import * as fs from 'fs';
import * as path from 'path';
import { isMapIterator } from 'util/types';

/**
 * Individual GHDL task implementations
 */

/**
 * Create a standard error result for common error conditions
 * @param command Command name for the result
 * @param errorMessage Error message
 * @returns Error result object
 */
function createErrorResult(command: string, errorMessage: string): p_result {
    return {
        command: command,
        stdout: '',
        stderr: errorMessage,
        return_value: 1,
        successful: false
    };
}

/**
 * Executes GHDL analyze task for VHDL files
 * @param projectDefinition Project definition containing files and configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runGhdlAnalyze(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const vhdlFiles = getVhdlFiles(projectDefinition);
    const config = projectDefinition.config.tools.ghdl;

    if (vhdlFiles.length === 0) {
        const result = createErrorResult('ghdl analyze', 'No VHDL files found in project');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Group files by logical library
    const libraryGroups = groupFilesByLibrary(projectDefinition, config);
    let v : string[];
    for (const [key, val] of libraryGroups.entries()) {
        if (key === 'work') {
            // set work library at end of map - for analyze mode
            v = libraryGroups.get (key);
            libraryGroups.delete (key);
            libraryGroups.set (key, v);
            break;
        }
    }

    // Build command chain for each library
    const commandSpecs: Array<{ command: string; args: string[] }> = [];
    
    for (const [library, filePaths] of libraryGroups) {
        // Build base arguments from configuration
        const { baseArgs } = buildGhdlArgs(config, 'analyze');
        const args = [...baseArgs, `--work=${library}`, ...filePaths];
        commandSpecs.push({ command: '-a', args });
    }

    // Execute all library commands in sequence
    const command = buildChainedCommand(config, commandSpecs);
    return executeCommand(command, projectDefinition.project_disk_path, callback);
}

/**
 * Executes GHDL elaborate task for the top level entity
 * @param projectDefinition Project definition containing top level configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runGhdlElaborate(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.ghdl;

    if (topLevel === null) {
        const result = createErrorResult('ghdl elaborate', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Build arguments from configuration
    const { baseArgs } = buildGhdlArgs(config, 'elaborate');
    const args = ['-e', ...baseArgs, topLevel];

    return executeGhdlCommand(config, args, projectDefinition.project_disk_path, callback);
}

/**
 * Executes GHDL simulate task for the top level entity
 * @param projectDefinition Project definition containing top level configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runGhdlSimulate(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.ghdl;

    if (topLevel === null) {
        const result = createErrorResult('ghdl simulate', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Clean up existing waveform files before simulation
    cleanupWaveformFiles(projectDefinition.project_disk_path);

    // Build arguments from configuration
    const { baseArgs, runArgs } = buildGhdlArgs(config, 'run');
    const args = ['-r', ...baseArgs, ...runArgs, topLevel, `--vcd=${topLevel}.vcd`, `--ieee-asserts=disable` ];

    return executeGhdlCommand(config, args, projectDefinition.project_disk_path, callback);
}

/**
 * Executes GHDL synthesis task for the top level entity
 * @param projectDefinition Project definition containing top level configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runGhdlSynthesize(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.ghdl;

    if (topLevel === null) {
        const result = createErrorResult('ghdl synthesize', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Build arguments from configuration
    const { baseArgs } = buildGhdlArgs(config, 'synth');
    const args = ['--synth', ...baseArgs, topLevel];

    return executeGhdlCommand(config, args, projectDefinition.project_disk_path, callback);
}

/**
 * Executes GHDL check syntax task for VHDL files
 * This task analyzes files but does not generate code, only checks syntax
 * @param projectDefinition Project definition containing files and configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runGhdlCheckSyntax(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const vhdlFiles = getVhdlFiles(projectDefinition);
    const config = projectDefinition.config.tools.ghdl;

    if (vhdlFiles.length === 0) {
        const result = createErrorResult('ghdl check syntax', 'No VHDL files found in project');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Build arguments for syntax check (ghdl -s)
    const { baseArgs } = buildGhdlArgs(config, 'analyze');
    const syntaxCheckArgs = ['-s', ...baseArgs, ...config.check_syntax_options];

    // Group files by logical library for proper syntax checking
    const libraryGroups = groupFilesByLibrary(projectDefinition, config);

    // Build command specs for each library
    const commandSpecs: Array<{ command: string; args: string[] }> = [];

    for (const [library, files] of libraryGroups) {
        const libraryArgs = library !== 'work' ? [`--work=${library}`] : [];
        const fullArgs = [...syntaxCheckArgs, ...libraryArgs, ...files];
        
        commandSpecs.push({
            command: '-s',
            args: fullArgs.slice(1) // Remove the '-s' as it's already the command
        });
    }

    // Build complete command chain for syntax checking
    const ghdlExecutable = getBinary(config);
    
    const syntaxCheckCommands = commandSpecs.map((spec) => {
        const quotedArgs = quoteArgs([spec.command, ...spec.args]);
        return `${ghdlExecutable} ${quotedArgs.join(' ')}`;
    });

    // Join all syntax check commands
    const command = syntaxCheckCommands.join(' && ');

    return executeCommand(command, projectDefinition.project_disk_path, callback);
}

/**
 * Generates Makefile for the GHDL project
 * @param projectDefinition Project definition containing files and configuration
 * @param callback Callback function to handle the result  
 * @returns ChildProcess instance
 */
export function runGhdlMakefile(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.ghdl;

    if (topLevel === null) {
        const result = createErrorResult('ghdl makefile', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Build arguments from configuration
    const { baseArgs } = buildGhdlArgs(config, 'elaborate');
    const args = ['--gen-makefile', ...baseArgs, topLevel];

    return executeGhdlCommand(config, args, projectDefinition.project_disk_path, callback);
}

/**
 * Executes complete GHDL flow: analyze, elaborate, and simulate
 * @param projectDefinition Project definition containing files and configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runGhdlAll(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const vhdlFiles = getVhdlFiles(projectDefinition);
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.ghdl;

    if (vhdlFiles.length === 0) {
        const result = createErrorResult('ghdl run all', 'No VHDL files found in project');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    if (topLevel === null) {
        const result = createErrorResult('ghdl run all', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Group files by logical library
    const libraryGroups = groupFilesByLibrary(projectDefinition, config);

    // Build analyze commands for each library
    const analyzeCommandSpecs: Array<{ command: string; args: string[] }> = [];
    
    for (const [library, filePaths] of libraryGroups) {
        const { baseArgs } = buildGhdlArgs(config, 'analyze');
        const args = [...baseArgs, `--work=${library}`, ...filePaths];
        analyzeCommandSpecs.push({ command: '-a', args });
    }

    // Build elaborate command
    const { baseArgs: elaborateBaseArgs } = buildGhdlArgs(config, 'elaborate');
    const elaborateArgs = [...elaborateBaseArgs, topLevel];
    
    // Build simulate command
    const { baseArgs: runBaseArgs, runArgs: simRunArgs } = buildGhdlArgs(config, 'run');
    const runArgs = [...runBaseArgs, topLevel, ...simRunArgs];

    // Clean up existing waveform files before simulation
    cleanupWaveformFiles(projectDefinition.project_disk_path);

    // Build complete command chain
    const ghdlExecutable = getBinary(config);
    
    const analyzeCommands = analyzeCommandSpecs.map((spec) => {
        const quotedArgs = quoteArgs([spec.command, ...spec.args]);
        return `${ghdlExecutable} ${quotedArgs.join(' ')}`;
    });

    const elaborateCmd = `${ghdlExecutable} ${quoteArgs(['-e', ...elaborateArgs]).join(' ')}`;
    const simulateCmd = `${ghdlExecutable} ${quoteArgs(['-r', ...runArgs]).join(' ')}`;

    // Build complete command chain: analyze all libraries + elaborate + simulate
    const command = `${analyzeCommands.join(' && ')} && ${elaborateCmd} && ${simulateCmd}`;

    return executeCommand(command, projectDefinition.project_disk_path, callback);
}

/**
 * Remove existing waveform files with basename "wave" before simulation
 * @param workingDirectory Directory where to look for waveform files
 */
function cleanupWaveformFiles(workingDirectory: string): void {
    try {
        if (!fs.existsSync(workingDirectory)) {
            return;
        }

        const files = fs.readdirSync(workingDirectory);
        const waveBasename = "wave";
        
        for (const file of files) {
            // Check if file starts with "wave" basename (wave.ghw, wave.vcd, etc.)
            const fileBasename = path.basename(file, path.extname(file));
            if (fileBasename === waveBasename) {
                const filePath = path.join(workingDirectory, file);
                try {
                    fs.unlinkSync(filePath);
                    // File removed successfully
                } catch (error) {
                    // Failed to remove file, continue with others
                }
            }
        }
    } catch (error) {
        // Failed to cleanup waveform files, continue execution
    }
}
