import { e_tools_nvc } from 'colibri/config/config_declaration';

/**
 * Command argument building utilities for nvc
 */

export type nvcCommandType = 'analyze' | 'elaborate' | 'run' | 'synth';

export interface nvcCommandArgs {
    baseArgs: string[];
    runArgs: string[];
}

/**
 * Helper function to build nvc command arguments from configuration
 * @param config nvc configuration
 * @param commandType Type of command (analyze, elaborate, run, synth)
 * @param additionalArgs Additional arguments specific to the command
 * @returns Object with baseArgs (before entity) and runArgs (after entity for simulation)
 */

export function buildnvcArgs(
    config: e_tools_nvc, 
    commandType: nvcCommandType, 
    additionalArgs: string[] = []
): nvcCommandArgs {
    const baseArgs: string[] = [];
    const runArgs: string[] = [];

    // Add verbose flag if enabled
    if (config.verbose) {
        baseArgs.push('-v');
    }

    // Add VHDL standard (map enum values to nvc standard values)
    const standardMap: Record<string, string> = {
        'vhdl87': '87',
        'vhdl93': '93',
        'vhdl02': '02',
        'vhdl08': '2008',
        'vhdl19': '2019'
    };
    // Mapping and adding a default value if the configured standard is not recognized
    baseArgs.push(`--std=${config.vhdl_standard && standardMap[config.vhdl_standard]
        ? standardMap[config.vhdl_standard]
        : '2008'}`); // Default

    // Library / work directory
    if (config.work_library && config.work_library.trim() !== '') {
        baseArgs.push(`--work=${config.work_library}`);
    }

    // Debug flags
    if (config.debug_level) {
        switch (config.debug_level) {
            case 'minimal': baseArgs.push('-g'); break;
            case 'full': baseArgs.push('-g', '--debug'); break;
        }
    }

    // Add IEEE library configuration
    if (config.ieee_library !== 'standard') {
        baseArgs.push(`--ieee=${config.ieee_library}`);
    }

    // Add library paths
    if (config.library_paths && config.library_paths.length > 0) {
        config.library_paths.forEach((path: string) => {
            baseArgs.push(`-P${path}`);
        });
    }

    // Add assertion level
    if (config.assert_level && config.assert_level !== 'error') {
        if (config.assert_level === 'none') {
            baseArgs.push('--assert-level=none');
        } else {
            baseArgs.push(`--assert-level=${config.assert_level}`);
        }
    }

    // Add relaxed rules if enabled
    if (config.relaxed_rules) {
        baseArgs.push('--mb-comments');
    }

    // Add relaxed parsing if enabled
    if (config.relaxed_parsing) {
        baseArgs.push('--relaxed');
    }

    // Add PSL support if enabled
    if (config.psl_enabled) {
        baseArgs.push('--psl');
    }

    // Add Unicode support if enabled
    if (config.unicode_support) {
        baseArgs.push('--unicode');
    }

    // Add binding checks
    if (!config.bind_checks) {
        baseArgs.push('--no-bind-checks');
    }

    // Add VITAL checks if enabled
    if (config.vital_checks) {
        baseArgs.push('--vital-checks');
    }

    const warningFlags: string[] = [];
    if (config.warnings_as_errors) {warningFlags.push('-Werror');}
    if (config.suppress_warnings?.length) {
        config.suppress_warnings.forEach(w => warningFlags.push(`-Wno-${w}`));
    }

    // Time resolution
    if (config.resolution_limit?.trim() !== '') {baseArgs.push(`--time-resolution=${config.resolution_limit}`);}

    // Command-specific options
    switch (commandType) {
        case 'analyze':
            baseArgs.push(...config.analyze_options);
            break;

        case 'elaborate':
            baseArgs.push(...config.elaborate_options);
            baseArgs.push(...warningFlags);
            break;

        case 'run':
            addSimulationArgs(config, runArgs);
            runArgs.push(...config.run_options);
            runArgs.push(...warningFlags);
            break;

        case 'synth':
            baseArgs.push(...config.synthesis_options);
            break;
    }    

    if (config.extra_flags?.length) {baseArgs.push(...config.extra_flags);}

    // Additional custom arguments
    baseArgs.push(...additionalArgs);

    return { baseArgs, runArgs };
}


/**
 * Add simulation-specific arguments that go after the entity name
 * @param config nvc configuration
 * @param runArgs Array to append simulation arguments to
 */
function addSimulationArgs(config: e_tools_nvc, runArgs: string[]): void {
    // Add waveform output configuration
    // NVC uses --wave=FILE, format is inferred from the file extension (.vcd, .fst, .ghw)
    if (config.waveform_enabled && config.waveform_format) {
        const waveformFile = `wave.${config.waveform_format}`;
        runArgs.push(`--wave=${waveformFile}`);
    }
    
    // Add waveform-specific options
    if (config.waveform_options && config.waveform_options.length > 0) {
        runArgs.push(...config.waveform_options);
    }
    
    // Add simulation time limit if specified
    if (config.simulation_time && config.simulation_time.trim() !== '') {
        runArgs.push(`--stop-time=${config.simulation_time}`);
    }
    
    // Add stack size for simulation
    if (config.stack_size && config.stack_size.trim() !== '') {
        runArgs.push(`--stack-size=${config.stack_size}`);
    }

    // Add stop delta cycles for simulation
    if (config.stop_delta_cycles > 0) {
        runArgs.push(`--stop-delta=${config.stop_delta_cycles}`);
    }

    // Add display time option
    if (config.display_time) {
        runArgs.push('--disp-time');
    }

    // Add unbuffered output option
    if (config.unbuffered_output) {
        runArgs.push('--unbuffered');
    }

    // Add max stack allocation size
    if (config.max_stack_alloc > 0) {
        runArgs.push(`--max-stack-alloc=${config.max_stack_alloc}`);
    }

    // Add backtrace severity level
    if (config.backtrace_severity && config.backtrace_severity !== 'error') {
        if (config.backtrace_severity === 'none') {
            runArgs.push('--backtrace-severity=none');
        } else {
            runArgs.push(`--backtrace-severity=${config.backtrace_severity}`);
        }
    }

    // Add IEEE assertions policy
    if (config.ieee_asserts && config.ieee_asserts !== 'enable') {
        runArgs.push(`--ieee-asserts=${config.ieee_asserts}`);
    }

    // Add general assertions policy
    if (config.asserts_policy && config.asserts_policy !== 'enable') {
        runArgs.push(`--asserts=${config.asserts_policy}`);
    }

    // Add SDF file for timing annotation
    if (config.sdf_file && config.sdf_file.trim() !== '') {
        runArgs.push(`--sdf=${config.sdf_file}`);
    }

    // Add VPI modules
    if (config.vpi_modules && config.vpi_modules.length > 0) {
        config.vpi_modules.forEach((module: string) => {
            runArgs.push(`--vpi=${module}`);
        });
    }

    // Add VHPI modules
    if (config.vhpi_modules && config.vhpi_modules.length > 0) {
        config.vhpi_modules.forEach((module: string) => {
            runArgs.push(`--vhpi=${module}`);
        });
    }

    // Add VPI trace file
    if (config.vpi_trace_file && config.vpi_trace_file.trim() !== '') {
        runArgs.push(`--vpi-trace=${config.vpi_trace_file}`);
    }

    // Add VHPI trace file
    if (config.vhpi_trace_file && config.vhpi_trace_file.trim() !== '') {
        runArgs.push(`--vhpi-trace=${config.vhpi_trace_file}`);
    }

    // Add PSL report file
    if (config.psl_report_file && config.psl_report_file.trim() !== '') {
        runArgs.push(`--psl-report=${config.psl_report_file}`);
    }

    // Add PSL uncovered reports
    if (config.psl_report_uncovered) {
        runArgs.push('--psl-report-uncovered');
    }

    // Add design hierarchy display
    if (config.disp_tree && config.disp_tree !== 'none') {
        runArgs.push(`--disp-tree=${config.disp_tree}`);
    }

    // Add waveform generation advanced options
    if (config.wave_start_time && config.wave_start_time.trim() !== '') {
        runArgs.push(`--wave-start-time=${config.wave_start_time}`);
    }
    if (config.vcd_4states && config.waveform_format === 'vcd') {
        runArgs.push('--vcd-4states');
    }
    if (config.vcd_nodate && config.waveform_format === 'vcd') {
        runArgs.push('--vcd-nodate');
    }
    if (config.read_wave_opt && config.read_wave_opt.trim() !== '') {
        runArgs.push(`--read-wave-opt=${config.read_wave_opt}`);
    }
    if (config.write_wave_opt && config.write_wave_opt.trim() !== '') {
        runArgs.push(`--write-wave-opt=${config.write_wave_opt}`);
    }

    // Add execution control options
    if (config.no_run) {
        runArgs.push('--no-run');
    }
}
