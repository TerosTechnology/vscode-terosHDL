import {
    e_tools_nextpnr,
    e_tools_nextpnr_ecp5_device,
    e_tools_nextpnr_ice40_device,
    e_tools_nextpnr_target_family
} from 'colibri/config/config_declaration';

export function buildNextpnrArgs(
    config: e_tools_nextpnr,
    jsonFile: string,
    outputFile: string,
    options?: { gui?: boolean; reportFile?: string }
): string[] {
    if (!Object.values(e_tools_nextpnr_target_family).includes(config.target_family)) {
        throw new Error(`Unsupported nextpnr target family: ${config.target_family}`);
    }
    if (typeof jsonFile !== 'string' || jsonFile.trim() === '') {
        throw new Error('A non-empty JSON input file is required.');
    }
    if (typeof outputFile !== 'string' || outputFile.trim() === '') {
        throw new Error('A non-empty output file is required.');
    }

    const family = config.target_family;
    const pcfFile = config.pcf_file?.trim() ?? '';
    const lpfFile = config.lpf_file?.trim() ?? '';
    const packageName = config.package?.trim() ?? '';
    if (family !== e_tools_nextpnr_target_family.ice40 && pcfFile !== '') {
        throw new Error('pcf_file is only valid for the iCE40 target family.');
    }
    if (family !== e_tools_nextpnr_target_family.ecp5 && lpfFile !== '') {
        throw new Error('lpf_file is only valid for the ECP5 target family.');
    }
    if (!Object.values(e_tools_nextpnr_ice40_device).includes(config.ice40_device)) {
        throw new Error(`Unsupported iCE40 device: ${config.ice40_device}`);
    }
    if (!Object.values(e_tools_nextpnr_ecp5_device).includes(config.ecp5_device)) {
        throw new Error(`Unsupported ECP5 device: ${config.ecp5_device}`);
    }

    if (family !== e_tools_nextpnr_target_family.ice40 && config.ice40_device !== e_tools_nextpnr_ice40_device.up5k) {
        throw new Error('ice40_device is only valid for the iCE40 target family.');
    }
    if (family !== e_tools_nextpnr_target_family.ecp5 && config.ecp5_device !== e_tools_nextpnr_ecp5_device.ecp5_45k) {
        throw new Error('ecp5_device is only valid for the ECP5 target family.');
    }

    if (!Number.isFinite(config.freq) || config.freq < 0) {
        throw new Error('freq must be a finite number greater than or equal to 0.');
    }
    if (!Number.isInteger(config.seed) || !Number.isFinite(config.seed)) {
        throw new Error('seed must be a finite integer.');
    }

    const extraOptions = config.extra_options ?? [];
    if (!Array.isArray(extraOptions)) {
        throw new Error('extra_options must contain non-empty strings.');
    }
    const invalidExtraOption = extraOptions.some(
        option => typeof option !== 'string' || option.trim() === ''
    );
    if (invalidExtraOption) {
        throw new Error('extra_options must contain non-empty strings.');
    }

    const familySpecificOptions: Record<string, e_tools_nextpnr_target_family[]> = {
        '--hx1k': [e_tools_nextpnr_target_family.ice40],
        '--hx4k': [e_tools_nextpnr_target_family.ice40],
        '--hx8k': [e_tools_nextpnr_target_family.ice40],
        '--lp384': [e_tools_nextpnr_target_family.ice40],
        '--lp1k': [e_tools_nextpnr_target_family.ice40],
        '--lp8k': [e_tools_nextpnr_target_family.ice40],
        '--up3k': [e_tools_nextpnr_target_family.ice40],
        '--up5k': [e_tools_nextpnr_target_family.ice40],
        '--u1k': [e_tools_nextpnr_target_family.ice40],
        '--u2k': [e_tools_nextpnr_target_family.ice40],
        '--u4k': [e_tools_nextpnr_target_family.ice40],
        '--12k': [e_tools_nextpnr_target_family.ecp5],
        '--25k': [e_tools_nextpnr_target_family.ecp5],
        '--45k': [e_tools_nextpnr_target_family.ecp5],
        '--85k': [e_tools_nextpnr_target_family.ecp5],
        '--pcf': [e_tools_nextpnr_target_family.ice40],
        '--asc': [e_tools_nextpnr_target_family.ice40],
        '--lpf': [e_tools_nextpnr_target_family.ecp5],
        '--textcfg': [e_tools_nextpnr_target_family.ecp5],
    };
    const managedOptions = new Set([
        '--json', '--asc', '--textcfg', '--write', '--pcf', '--lpf',
        '--freq', '--seed', '--placer', '--router', '--gui', '--report', '--package',
        '--hx1k', '--hx4k', '--hx8k', '--lp384', '--lp1k', '--lp8k', '--up3k', '--up5k', '--u1k', '--u2k', '--u4k',
        '--12k', '--25k', '--45k', '--85k'
    ]);
    const seenOptions = new Set<string>();
    for (const option of extraOptions) {
        const optionName = option.trim().split('=', 1)[0];
        const validFamilies = familySpecificOptions[optionName];
        if (validFamilies && !validFamilies.includes(family)) {
            throw new Error(`${optionName} is not valid for the ${family} target family.`);
        }
        if (managedOptions.has(optionName)) {
            throw new Error(
                `${optionName} is managed by nextpnr configuration and cannot be repeated in extra_options.`
            );
        }
        if (seenOptions.has(optionName)) {
            throw new Error(`Duplicate nextpnr option in extra_options: ${optionName}`);
        }
        seenOptions.add(optionName);
    }

    const args: string[] = ['--json', jsonFile];
    if (family === e_tools_nextpnr_target_family.ice40) {
        args.push(`--${config.ice40_device}`);
        if (packageName !== '') {
            args.push('--package', packageName);
        }
        if (pcfFile !== '') {
            args.push('--pcf', pcfFile);
        }
        args.push('--asc', outputFile);
    } else if (family === e_tools_nextpnr_target_family.ecp5) {
        const ecp5DeviceMap: Record<e_tools_nextpnr_ecp5_device, string> = {
            [e_tools_nextpnr_ecp5_device.ecp5_12k]: '--12k',
            [e_tools_nextpnr_ecp5_device.ecp5_25k]: '--25k',
            [e_tools_nextpnr_ecp5_device.ecp5_45k]: '--45k',
            [e_tools_nextpnr_ecp5_device.ecp5_85k]: '--85k',
        };
        args.push(ecp5DeviceMap[config.ecp5_device]);
        if (packageName !== '') {
            args.push('--package', packageName);
        }
        if (lpfFile !== '') {
            args.push('--lpf', lpfFile);
        }
        args.push('--textcfg', outputFile);
    } else {
        args.push('--write', outputFile);
    }

    if (config.freq > 0) {
        args.push('--freq', String(config.freq));
    }
    args.push('--seed', String(config.seed));

    if (config.placer?.trim()) {
        args.push('--placer', config.placer.trim());
    }
    if (config.router?.trim()) {
        args.push('--router', config.router.trim());
    }

    args.push(...extraOptions.map(option => option.trim()));
    if (options?.reportFile !== undefined) {
        if (options.reportFile.trim() === '') {
            throw new Error('reportFile must be a non-empty path when provided.');
        }
        args.push('--report', options.reportFile);
    }
    if (options?.gui === true) {
        args.push('--gui');
    }
    return args;
}

export function buildPackArgs(
    family: e_tools_nextpnr_target_family,
    inputFile: string,
    outputFile: string
): string[] {
    if (typeof inputFile !== 'string' || inputFile.trim() === '') {
        throw new Error('A non-empty input file is required for bitstream generation.');
    }
    if (typeof outputFile !== 'string' || outputFile.trim() === '') {
        throw new Error('A non-empty output file is required for bitstream generation.');
    }

    if (family === e_tools_nextpnr_target_family.ice40) {
        return [inputFile, outputFile];
    }
    if (family === e_tools_nextpnr_target_family.ecp5) {
        return ['--input', inputFile, '--bit', outputFile];
    }
    throw new Error('Bitstream generation is not supported for the generic target family.');
}

