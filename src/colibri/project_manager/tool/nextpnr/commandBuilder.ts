import { e_tools_nextpnr, e_tools_nextpnr_target_family } from 'colibri/config/config_declaration';

/** Command mode requested from the caller. */
export type NextpnrCommandType = 'pnr' | 'gui';

export function buildNextpnrArgs(
    config: e_tools_nextpnr,
    jsonFile: string,
    outputFile: string,
    mode: NextpnrCommandType
): string[] {
    if (mode === 'gui') {
        throw new Error('GUI mode is unavailable: the installed nextpnr CLI does not accept --gui.');
    }

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
    if (family !== e_tools_nextpnr_target_family.ice40 && pcfFile !== '') {
        throw new Error('pcf_file is only valid for the iCE40 target family.');
    }
    if (family !== e_tools_nextpnr_target_family.ecp5 && lpfFile !== '') {
        throw new Error('lpf_file is only valid for the ECP5 target family.');
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
        '--pcf': [e_tools_nextpnr_target_family.ice40],
        '--asc': [e_tools_nextpnr_target_family.ice40],
        '--lpf': [e_tools_nextpnr_target_family.ecp5],
        '--textcfg': [e_tools_nextpnr_target_family.ecp5],
    };
    const managedOptions = new Set([
        '--json', '--asc', '--textcfg', '--write', '--pcf', '--lpf',
        '--freq', '--seed', '--placer', '--router', '--gui'
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
        if (pcfFile !== '') {
            args.push('--pcf', pcfFile);
        }
        args.push('--asc', outputFile);
    } else if (family === e_tools_nextpnr_target_family.ecp5) {
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
    return args;
}

