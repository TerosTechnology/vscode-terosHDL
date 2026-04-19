import { p_result } from 'colibri/process/common';
import { ChildProcess } from 'child_process';
import { t_project_definition } from 'colibri/project_manager/project_definition';
import { buildnvcArgs } from './commandBuilder';
import { executenvcCommand, executeCommand, buildChainedCommand, getBinary, quoteArgs } from './executor';
import { getTopLevel, getVhdlFiles, groupFilesByLibrary, getRelativeFilePath } from './utils';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Individual nvc task implementations
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
 * Executes nvc analyze task for VHDL files
 * @param projectDefinition Project definition containing files and configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runnvcAnalyze(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const vhdlFiles = getVhdlFiles(projectDefinition);
    const config = projectDefinition.config.tools.nvc;

    if (vhdlFiles.length === 0) {
        const result = createErrorResult('nvc analyze', 'No VHDL files found in project');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Group files by logical library
    const libraryGroups = groupFilesByLibrary(projectDefinition, config);

    // Build command chain for each library
    const commandSpecs: Array<{ command: string; args: string[] }> = [];
    
    for (const [library, filePaths] of libraryGroups) {
        // Build base arguments from configuration
        const { baseArgs } = buildnvcArgs(config, 'analyze');
        // Global flags (--std, --work) must come before the command (-a) per NVC spec.
        const analyzeBaseArgs = baseArgs.filter((arg) => !arg.startsWith('--work='));
        const args = [...analyzeBaseArgs, `--work=${library}`, '-a', ...filePaths];
        commandSpecs.push({ command: '', args });
    };

    // Execute all library commands in sequence
    const command = buildChainedCommand(config, commandSpecs);
    return executeCommand(command, projectDefinition.project_disk_path, callback);
}

/**
 * Executes nvc elaborate task for the top level entity
 * @param projectDefinition Project definition containing top level configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runnvcElaborate(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.nvc;

    if (topLevel === null) {
        const result = createErrorResult('nvc elaborate', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Build arguments from configuration
    const { baseArgs } = buildnvcArgs(config, 'elaborate');
    const args = [...baseArgs, '-e', topLevel];

    return executenvcCommand(config, args, projectDefinition.project_disk_path, callback);
}

/**
 * Executes nvc simulate task for the top level entity
 * @param projectDefinition Project definition containing top level configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runnvcSimulate(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.nvc;

    if (topLevel === null) {
        const result = createErrorResult('nvc simulate', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Clean up existing waveform files before simulation
    cleanupWaveformFiles(projectDefinition.project_disk_path);

    // Build arguments from configuration
    const { baseArgs, runArgs } = buildnvcArgs(config, 'run');
    const args = [...baseArgs, '-r', topLevel, ...runArgs];

    return executenvcCommand(config, args, projectDefinition.project_disk_path, callback);
}

/**
 * Executes nvc synthesis task for the top level entity
 * @param projectDefinition Project definition containing top level configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runnvcSynthesize(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.nvc;

    if (topLevel === null) {
        const result = createErrorResult('nvc synthesize', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Build arguments from configuration
    const { baseArgs } = buildnvcArgs(config, 'synth');
    const args = ['--synth', ...baseArgs, topLevel];

    return executenvcCommand(config, args, projectDefinition.project_disk_path, callback);
}

/**
 * Executes nvc check syntax task for VHDL files
 * This task analyzes files without saving compiled units, providing a fast syntax/type check
 * @param projectDefinition Project definition containing files and configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runnvcCheckSyntax(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const vhdlFiles = getVhdlFiles(projectDefinition);
    const config = projectDefinition.config.tools.nvc;

    if (vhdlFiles.length === 0) {
        const result = createErrorResult('nvc check syntax', 'No VHDL files found in project');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Build arguments for syntax check using documented analysis flow.
    // --no-save avoids persisting analyzed units while still reporting syntax/type errors.
    const { baseArgs } = buildnvcArgs(config, 'analyze');
    const syntaxBaseArgs = baseArgs.filter((arg) => !arg.startsWith('--work='));

    // Group files by logical library for proper syntax checking
    const libraryGroups = groupFilesByLibrary(projectDefinition, config);

    // Build command specs for each library
    const commandSpecs: Array<{ command: string; args: string[] }> = [];

    for (const [library, files] of libraryGroups) {
        // Global flags (--std, --work) go before -a per NVC spec.
        const fullArgs = [
            ...syntaxBaseArgs,
            `--work=${library}`,
            '-a',
            '--no-save',
            ...config.check_syntax_options,
            ...files
        ];
        commandSpecs.push({ command: '', args: fullArgs });
    }

    // Build complete command chain for syntax checking
    const command = buildChainedCommand(config, commandSpecs);

    return executeCommand(command, projectDefinition.project_disk_path, callback);
}

/**
 * Generates Makefile for the nvc project
 * @param projectDefinition Project definition containing files and configuration
 * @param callback Callback function to handle the result  
 * @returns ChildProcess instance
 */
export function runnvcMakefile(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.nvc;

    if (topLevel === null) {
        const result = createErrorResult('nvc makefile', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Build arguments from configuration
    const { baseArgs } = buildnvcArgs(config, 'elaborate');
    const args = ['--gen-makefile', ...baseArgs, topLevel];

    return executenvcCommand(config, args, projectDefinition.project_disk_path, callback);
}

/**
 * Executes complete nvc flow: analyze, elaborate, and simulate
 * @param projectDefinition Project definition containing files and configuration
 * @param callback Callback function to handle the result
 * @returns ChildProcess instance
 */
export function runnvcAll(
    projectDefinition: t_project_definition, 
    callback: (result: p_result) => void
): ChildProcess {
    const vhdlFiles = getVhdlFiles(projectDefinition);
    const topLevel = getTopLevel(projectDefinition);
    const config = projectDefinition.config.tools.nvc;

    if (vhdlFiles.length === 0) {
        const result = createErrorResult('nvc run all', 'No VHDL files found in project');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    if (topLevel === null) {
        const result = createErrorResult('nvc run all', 'No top level entity specified');
        setTimeout(() => callback(result), 0);
        return {} as ChildProcess;
    }

    // Group files by logical library
    const libraryGroups = groupFilesByLibrary(projectDefinition, config);

    // Build analyze commands for each library
    const analyzeCommandSpecs: Array<{ command: string; args: string[] }> = [];
    
    for (const [library, filePaths] of libraryGroups) {
        const { baseArgs } = buildnvcArgs(config, 'analyze');
        // Global flags (--std, --work) must come before the command (-a) per NVC spec.
        const analyzeBaseArgs = baseArgs.filter((arg) => !arg.startsWith('--work='));
        const args = [...analyzeBaseArgs, `--work=${library}`, '-a', ...filePaths];
        analyzeCommandSpecs.push({ command: '', args });
    }

    // Build elaborate command
    const { baseArgs: elaborateBaseArgs } = buildnvcArgs(config, 'elaborate');
    const elaborateArgs = [...elaborateBaseArgs, '-e', topLevel];
    
    // Build simulate command
    const { baseArgs: runBaseArgs, runArgs: simRunArgs } = buildnvcArgs(config, 'run');
    const simulateArgs = [...runBaseArgs, '-r', topLevel, ...simRunArgs];

    // Clean up existing waveform files before simulation
    cleanupWaveformFiles(projectDefinition.project_disk_path);

    // Build complete command chain using buildChainedCommand for analyze commands
    const nvcExecutable = getBinary(config);
    
    const analyzeCommand = buildChainedCommand(config, analyzeCommandSpecs);
    const elaborateCmd = `${nvcExecutable} ${quoteArgs(elaborateArgs).join(' ')}`;
    const simulateCmd = `${nvcExecutable} ${quoteArgs(simulateArgs).join(' ')}`;

    // Build complete command chain: analyze all libraries + elaborate + simulate
    const command = `${analyzeCommand} && ${elaborateCmd} && ${simulateCmd}`;

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
