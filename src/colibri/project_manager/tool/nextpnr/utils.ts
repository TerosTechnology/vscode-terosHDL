import {
	e_tools_nextpnr,
	e_tools_nextpnr_target_family
} from '../../../config/config_declaration';
import * as file_utils from '../../../utils/file_utils';

/** Result of validating a nextpnr input file. */
export type t_nextpnr_file_validation = {
	valid: boolean;
	error?: string;
};

/**
 * Validate the existence, extension and JSON syntax of a Yosys netlist.
 * This function validates the path supplied by its caller; it does not infer
 * an output path from Yosys configuration.
 */
export function validateJsonFile(filePath: string): t_nextpnr_file_validation {
	if (typeof filePath !== 'string' || filePath.trim() === '') {
		return { valid: false, error: 'A JSON netlist path is required.' };
	}
	if (!file_utils.check_if_path_exist(filePath) || !file_utils.check_if_file(filePath)) {
		return { valid: false, error: `JSON netlist file does not exist: ${filePath}` };
	}
	if (!file_utils.check_file_extension(filePath, '.json', false)) {
		return { valid: false, error: `JSON netlist must have a .json extension: ${filePath}` };
	}

	try {
		JSON.parse(file_utils.read_file_sync(filePath));
	} catch {
		return { valid: false, error: `JSON netlist contains invalid JSON: ${filePath}` };
	}

	return { valid: true };
}

/**
 * Return the configured constraints file for the selected architecture.
 * Constraint files are optional: an empty matching setting returns null.
 * A configured but invalid path or a setting for another family is an error.
 */
export function getConstraintsFile(
	config: e_tools_nextpnr,
	targetFamily: e_tools_nextpnr_target_family
): string | null {
	const pcfFile = config.pcf_file?.trim() ?? '';
	const lpfFile = config.lpf_file?.trim() ?? '';

	if (!Object.values(e_tools_nextpnr_target_family).includes(targetFamily)) {
		throw new Error(`Unsupported nextpnr target family: ${targetFamily}`);
	}
	if (config.target_family !== targetFamily) {
		throw new Error(
			`Configured target family (${config.target_family}) does not match requested family (${targetFamily}).`
		);
	}

	let configuredFile = '';
	let expectedExtension = '';
	if (targetFamily === e_tools_nextpnr_target_family.ice40) {
		if (lpfFile !== '') {
			throw new Error('lpf_file is only valid for the ECP5 target family.');
		}
		configuredFile = pcfFile;
		expectedExtension = '.pcf';
	} else if (targetFamily === e_tools_nextpnr_target_family.ecp5) {
		if (pcfFile !== '') {
			throw new Error('pcf_file is only valid for the iCE40 target family.');
		}
		configuredFile = lpfFile;
		expectedExtension = '.lpf';
	} else if (pcfFile !== '' || lpfFile !== '') {
		throw new Error('Constraint files are not supported for the generic target family.');
	} else {
		return null;
	}

	if (configuredFile === '') {
		return null;
	}
	if (!file_utils.check_if_path_exist(configuredFile) || !file_utils.check_if_file(configuredFile)) {
		const extensionName = expectedExtension.slice(1).toUpperCase();
		throw new Error(
			`Configured ${extensionName} constraints file does not exist: ${configuredFile}`
		);
	}
	if (!file_utils.check_file_extension(configuredFile, expectedExtension, false)) {
		throw new Error(`Configured constraints file must have a ${expectedExtension} extension: ${configuredFile}`);
	}

	return configuredFile;
}
