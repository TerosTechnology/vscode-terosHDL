import { p_result } from 'colibri/process/common';
import { ChildProcess } from 'child_process';
import { t_project_definition } from 'colibri/project_manager/project_definition';
import { buildnvcArgs } from './commandBuilder';
import { executenvcCommand, executeCommand, buildChainedCommand } from './executor';
import { getTopLevel, getVhdlFiles, groupFilesByLibrary } from './utils';
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
        const args = ['-L', projectDefinition.project_disk_path, ...analyzeBaseArgs, `--work=${library}`, '-a', ...filePaths];
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
    const args = ['-L', projectDefinition.project_disk_path, ...baseArgs, '-e', topLevel];

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

    // Build arguments from configuration
    const { baseArgs, runArgs } = buildnvcArgs(config, 'run');
    const args = ['-L', projectDefinition.project_disk_path, ...baseArgs, '-r', topLevel, ...runArgs];

    // Clean up previous waveform output only for the exact target file.
    cleanupWaveformFile(projectDefinition.project_disk_path, runArgs);

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
    const args = ['-L', projectDefinition.project_disk_path, '--synth', ...baseArgs, topLevel];

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
            '-L', projectDefinition.project_disk_path,
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
    const args = ['-L', projectDefinition.project_disk_path, '--gen-makefile', ...baseArgs, topLevel];

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
        const args = ['-L', projectDefinition.project_disk_path, ...analyzeBaseArgs, `--work=${library}`, '-a', ...filePaths];
        analyzeCommandSpecs.push({ command: '', args });
    }

    // Build elaborate command
    const { baseArgs: elaborateBaseArgs } = buildnvcArgs(config, 'elaborate');
    const elaborateArgs = ['-L', projectDefinition.project_disk_path, ...elaborateBaseArgs, '-e', topLevel];

    // Build simulate command
    const { baseArgs: runBaseArgs, runArgs: simRunArgs } = buildnvcArgs(config, 'run');
    const simulateArgs = ['-L', projectDefinition.project_disk_path, ...runBaseArgs, '-r', topLevel, ...simRunArgs];

    // Clean up previous waveform output only for the exact target file.
    cleanupWaveformFile(projectDefinition.project_disk_path, simulateArgs);

    // Build complete command chain: analyze all libraries + elaborate + simulate
    const commandSpecs: Array<{ command: string; args: string[] }> = [
        ...analyzeCommandSpecs,
        { command: '', args: elaborateArgs },
        { command: '', args: simulateArgs }
    ];
    const command = buildChainedCommand(config, commandSpecs);

    return executeCommand(command, projectDefinition.project_disk_path, callback);
}

/**
 * Remove previous waveform output for the exact --wave target used by NVC.
 * @param workingDirectory Directory where relative waveform files are resolved
 * @param runArgs Simulation run arguments that may include --wave=FILE
 */
function cleanupWaveformFile(workingDirectory: string, runArgs: string[]): void {
    try {
        const waveArg = runArgs.find((arg) => arg.startsWith('--wave='));
        if (!waveArg) {
            return;
        }

        const waveformTarget = waveArg.substring('--wave='.length).trim();
        if (waveformTarget === '') {
            return;
        }

        const waveformPath = path.isAbsolute(waveformTarget)
            ? waveformTarget
            : path.join(workingDirectory, waveformTarget);

        if (fs.existsSync(waveformPath) && fs.statSync(waveformPath).isFile()) {
            fs.unlinkSync(waveformPath);
        }
    } catch {
        // Failed to cleanup waveform file, continue execution
    }
}