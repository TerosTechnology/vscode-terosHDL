import { ChildProcess } from 'child_process';
import * as path from 'path';
import { p_result } from '../../../process/common';
import { t_project_definition } from '../../project_definition';
import {
	e_tools_nextpnr_target_family,
	e_tools_yosys_synthesis_target
} from '../../../config/config_declaration';
import { buildNextpnrArgs } from './commandBuilder';
import { executeCommand } from './executor';
import { getConstraintsFile, validateJsonFile } from './utils';
import { LoggerBase } from '../../../logger/logger';
import * as fs from 'fs';

function createErrorResult(command: string, errorMessage: string): p_result {
	return {
		command,
		stdout: '',
		stderr: errorMessage,
		return_value: 1,
		successful: false
	};
}

function reportError(
	command: string,
	errorMessage: string,
	callback: (result: p_result) => void,
	toolLogger?: LoggerBase
): ChildProcess {
	toolLogger?.appendLine(`[nextpnr] Error: ${errorMessage}`);
	setTimeout(() => callback(createErrorResult(command, errorMessage)), 0);
	return {} as ChildProcess;
}

function resolveJsonInput(projectDefinition: t_project_definition): string {
	const nextpnrConfig = projectDefinition.config.tools.nextpnr;
	const yosysConfig = projectDefinition.config.tools.yosys;
	let configuredJson = '';

	if (yosysConfig.synthesis_target === e_tools_yosys_synthesis_target.ice40) {
		configuredJson = yosysConfig.ice40_output_json;
	} else if (yosysConfig.synthesis_target === e_tools_yosys_synthesis_target.ecp5) {
		configuredJson = yosysConfig.ecp5_output_json;
	} else {
		throw new Error(`Unsupported Yosys synthesis target: ${yosysConfig.synthesis_target}`);
	}

	if (typeof configuredJson !== 'string' || configuredJson.trim() === '') {
		const field = yosysConfig.synthesis_target === e_tools_yosys_synthesis_target.ice40
			? 'ice40_output_json'
			: 'ecp5_output_json';
		throw new Error(
			`No Yosys JSON output is configured (${field}). Configure it and run Yosys synthesis before nextpnr.`
		);
	}

	const jsonPath = path.isAbsolute(configuredJson)
		? configuredJson
		: path.resolve(projectDefinition.project_disk_path, configuredJson);
	const validation = validateJsonFile(jsonPath);
	if (!validation.valid) {
		throw new Error(
			`${validation.error}. Configure Yosys to generate this JSON netlist and run Yosys synthesis before nextpnr.`
		);
	}

	// A device-specific Yosys netlist must match the nextpnr architecture.
	if (nextpnrConfig.target_family !== e_tools_nextpnr_target_family.generic &&
		String(nextpnrConfig.target_family) !== String(yosysConfig.synthesis_target)) {
		throw new Error(
			`Yosys synthesis target (${yosysConfig.synthesis_target}) does not match ` +
			`nextpnr target family (${nextpnrConfig.target_family}).`
		);
	}

	return jsonPath;
}

function runNextpnr(
	projectDefinition: t_project_definition,
	callback: (result: p_result) => void,
	toolLogger?: LoggerBase,
	options: { gui?: boolean; reportFile?: string } = {},
	taskName = 'nextpnr P&R'
): ChildProcess {
	const config = projectDefinition.config.tools.nextpnr;

	try {
		const jsonFile = resolveJsonInput(projectDefinition);
		const constraintsConfig = {
			...config,
			pcf_file: resolveProjectPath(projectDefinition.project_disk_path, config.pcf_file),
			lpf_file: resolveProjectPath(projectDefinition.project_disk_path, config.lpf_file)
		};
		const constraintsFile = getConstraintsFile(constraintsConfig, config.target_family);
		const outputExtension = config.target_family === e_tools_nextpnr_target_family.ice40
			? 'asc'
			: config.target_family === e_tools_nextpnr_target_family.ecp5
				? 'config'
				: 'json';
		const outputFile = path.join(projectDefinition.project_disk_path, `nextpnr_out.${outputExtension}`);
		const commandConfig = constraintsFile
			? {
				...config,
				pcf_file: config.target_family === e_tools_nextpnr_target_family.ice40 ? constraintsFile : '',
				lpf_file: config.target_family === e_tools_nextpnr_target_family.ecp5 ? constraintsFile : ''
			}
			: config;
		const args = buildNextpnrArgs(commandConfig, jsonFile, outputFile, options);

		return executeCommand(config, args, projectDefinition.project_disk_path, callback, toolLogger);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return reportError(taskName, message, callback, toolLogger);
	}
}

function resolveProjectPath(projectPath: string, filePath: string): string {
	if (typeof filePath !== 'string' || filePath.trim() === '' || path.isAbsolute(filePath)) {
		return filePath;
	}
	return path.resolve(projectPath, filePath);
}

/** Run nextpnr place-and-route from the JSON output configured in Yosys. */
export function runNextpnrPnR(
	projectDefinition: t_project_definition,
	callback: (result: p_result) => void,
	toolLogger?: LoggerBase
): ChildProcess {
	return runNextpnr(projectDefinition, callback, toolLogger, { reportFile: 'nextpnr_report.json' });
}

/** Open the native nextpnr GUI for supported architectures. */
export function runNextpnrGui(
	projectDefinition: t_project_definition,
	toolLogger: LoggerBase | undefined,
	callback: (result: p_result) => void
): ChildProcess {
	const handleGuiResult = (result: p_result): void => {
		const output = `${result.stderr}\n${result.stdout}`;
		const unsupportedGuiPatterns = [
			/(?:gui|qt)[^\n]*(?:not supported|not enabled|disabled|not compiled|unavailable|missing)/i,
			/(?:not supported|not enabled|disabled|not compiled|unavailable|missing)[^\n]*(?:gui|qt)/i
		];
		const missingGuiSupport = unsupportedGuiPatterns.some(pattern => pattern.test(output));
		if (!result.successful && missingGuiSupport) {
			const errorMessage = 'This nextpnr binary has no GUI (Qt) support.';
			toolLogger?.appendLine(`[nextpnr] Error: ${errorMessage}`);
			callback({
				...result,
				stderr: errorMessage
			});
			return;
		}
		callback(result);
	};

	return runNextpnr(
		projectDefinition,
		handleGuiResult,
		toolLogger,
		{ gui: true, reportFile: 'nextpnr_report.json' },
		'nextpnr GUI'
	);
}

/** Load the report produced by the most recent P&R run for display in the frontend. */
export function runNextpnrReport(
	projectDefinition: t_project_definition,
	callback: (result: p_result) => void,
	toolLogger?: LoggerBase
): ChildProcess {
	const reportPath = path.join(projectDefinition.project_disk_path, 'nextpnr_report.json');
	try {
		if (!fs.existsSync(reportPath) || !fs.statSync(reportPath).isFile()) {
			throw new Error('nextpnr report not found. Run Place & Route before opening the report.');
		}
		const report = fs.readFileSync(reportPath, 'utf8');
		const parsed = JSON.parse(report) as { utilization?: unknown; fmax?: unknown };
		if (!parsed || typeof parsed !== 'object' || !parsed.utilization || !parsed.fmax) {
			throw new Error('nextpnr report JSON is missing utilization or fmax data. Run Place & Route again.');
		}
		setTimeout(() => callback({
			command: 'nextpnr report',
			stdout: report,
			stderr: '',
			return_value: 0,
			successful: true
		}), 0);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		toolLogger?.appendLine(`[nextpnr] Error: ${message}`);
		setTimeout(() => callback(createErrorResult('nextpnr report', message)), 0);
	}
	return {} as ChildProcess;
}
