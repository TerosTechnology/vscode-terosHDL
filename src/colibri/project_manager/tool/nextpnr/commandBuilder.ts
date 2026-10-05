
export type e_nextpnr_target_family = 'ice40' | 'ecp5' | 'generic';

export type e_tools_nextpnr = {
    target_family?: e_nextpnr_target_family;
    pcf_file?: string;
    lpf_file?: string;
    freq?: number;
    seed?: number;
    placer?: string;
    router?: string;
    extra_options?: string[];
};


export function buildNextpnrArgs(
    config: e_tools_nextpnr,
    jsonFile: string,
    outputFile: string,
    mode: 'pnr' | 'gui'
): string[] {
    const args: string[] = [];
    
    args.push('--json', jsonFile);
    
    if (config.target_family === 'ice40') {
        if (config.pcf_file) {
            args.push('--pcf', config.pcf_file);
        }
        args.push('--asc', outputFile);
    } else if (config.target_family === 'ecp5') {
        if (config.lpf_file) {
            args.push('--lpf', config.lpf_file);
        }
        args.push('--config', outputFile);
    }
    
    if (config.freq !== undefined) {
        args.push('--freq', String(config.freq));
    }
    if (config.seed !== undefined) {
        args.push('--seed', String(config.seed));
    }
    if (config.placer) {
        args.push('--placer', config.placer);
    }
    if (config.router) {
        args.push('--router', config.router);
    }
    
    if (mode === 'gui') {
        args.push('--gui');
    }
    
    args.push(...(config.extra_options || []));
    
    return args;
}

