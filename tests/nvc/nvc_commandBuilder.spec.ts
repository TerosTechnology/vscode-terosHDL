import { get_default_config } from '../../src/colibri/config/config_declaration';
import {
    e_tools_nvc_vhdl_standard,
    e_tools_nvc_ieee_library,
    e_tools_nvc_debug_level,
    e_tools_nvc_assert_level,
    e_tools_nvc_waveform_format,
    e_tools_nvc_backtrace_severity,
    e_tools_nvc_ieee_asserts,
    e_tools_nvc_asserts_policy,
    e_tools_nvc_disp_tree,
} from '../../src/colibri/config/config_declaration';
import { buildnvcArgs } from '../../src/colibri/project_manager/tool/nvc/commandBuilder';

function makeConfig(overrides: Partial<ReturnType<typeof get_default_config>['tools']['nvc']> = {}) {
    return { ...get_default_config().tools.nvc, ...overrides };
}

describe('buildnvcArgs – analyze command', () => {
    it('returns std flag for vhdl08 and no runArgs in analyze command', () => {
        const config = makeConfig({ vhdl_standard: e_tools_nvc_vhdl_standard.vhdl08 });
        const { baseArgs, runArgs } = buildnvcArgs(config, 'analyze');
        expect(baseArgs).toContain('--std=2008');
        expect(runArgs).toHaveLength(0);
    });

    it('maps vhdl87 → --std=87', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ vhdl_standard: e_tools_nvc_vhdl_standard.vhdl87 }), 'analyze');
        expect(baseArgs).toContain('--std=87');
    });

    it('maps vhdl93 → --std=93', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ vhdl_standard: e_tools_nvc_vhdl_standard.vhdl93 }), 'analyze');
        expect(baseArgs).toContain('--std=93');
    });

    it('maps vhdl02 → --std=02', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ vhdl_standard: e_tools_nvc_vhdl_standard.vhdl02 }), 'analyze');
        expect(baseArgs).toContain('--std=02');
    });

    it('maps vhdl19 → --std=2019', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ vhdl_standard: e_tools_nvc_vhdl_standard.vhdl19 }), 'analyze');
        expect(baseArgs).toContain('--std=2019');
    });

    it('adds -v when verbose is true', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ verbose: true }), 'analyze');
        expect(baseArgs).toContain('-v');
    });

    it('does not add -v when verbose is false', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ verbose: false }), 'analyze');
        expect(baseArgs).not.toContain('-v');
    });

    it('adds --work=<lib> when work_library is set', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ work_library: 'mylib' }), 'analyze');
        expect(baseArgs).toContain('--work=mylib');
    });

    it('omits --work when work_library is empty', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ work_library: '' }), 'analyze');
        expect(baseArgs.some(a => a.startsWith('--work='))).toBe(false);
    });

    it('adds --work when work_library is whitespace-only', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ work_library: '   ' }), 'analyze');
        expect(baseArgs.some(a => a.startsWith('--work='))).toBe(false);
    });

    it('adds -g for debug_level minimal', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ debug_level: e_tools_nvc_debug_level.minimal }), 'analyze');
        expect(baseArgs).toContain('-g');
        expect(baseArgs).not.toContain('--debug');
    });

    it('adds -g and --debug for debug_level full', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ debug_level: e_tools_nvc_debug_level.full }), 'analyze');
        expect(baseArgs).toContain('-g');
        expect(baseArgs).toContain('--debug');
    });

    it('adds no debug flags for debug_level none', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ debug_level: e_tools_nvc_debug_level.none }), 'analyze');
        expect(baseArgs).not.toContain('-g');
        expect(baseArgs).not.toContain('--debug');
    });

    it('adds --ieee=synopsys when ieee_library is synopsys', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ ieee_library: e_tools_nvc_ieee_library.synopsys }), 'analyze');
        expect(baseArgs).toContain('--ieee=synopsys');
    });

    it('does not add --ieee flag when ieee_library is standard', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ ieee_library: e_tools_nvc_ieee_library.standard }), 'analyze');
        expect(baseArgs.some(a => a.startsWith('--ieee='))).toBe(false);
    });

    it('adds -P<path> for each library path', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ library_paths: ['/lib/one', '/lib/two'] }), 'analyze');
        expect(baseArgs).toContain('-P/lib/one');
        expect(baseArgs).toContain('-P/lib/two');
    });

    it('adds --assert-level=warning when assert_level is warning', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ assert_level: e_tools_nvc_assert_level.warning }), 'analyze');
        expect(baseArgs).toContain('--assert-level=warning');
    });

    it('adds --assert-level=none when assert_level is none', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ assert_level: e_tools_nvc_assert_level.none }), 'analyze');
        expect(baseArgs).toContain('--assert-level=none');
    });

    it('does not add --assert-level when assert_level is error (default)', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ assert_level: e_tools_nvc_assert_level.error }), 'analyze');
        expect(baseArgs.some(a => a.startsWith('--assert-level='))).toBe(false);
    });

    it('adds --relaxed when relaxed_rules is true', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ relaxed_rules: true }), 'analyze');
        expect(baseArgs).toContain('--relaxed');
    });

    it('adds --relaxed when relaxed_parsing is true', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ relaxed_parsing: true }), 'analyze');
        expect(baseArgs).toContain('--relaxed');
    });

    it('adds --psl when psl_enabled is true', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ psl_enabled: true }), 'analyze');
        expect(baseArgs).toContain('--psl');
    });

    it('adds --unicode when unicode_support is true', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ unicode_support: true }), 'analyze');
        expect(baseArgs).toContain('--unicode');
    });

    it('adds --no-bind-checks when bind_checks is false', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ bind_checks: false }), 'analyze');
        expect(baseArgs).toContain('--no-bind-checks');
    });

    it('does not add --no-bind-checks when bind_checks is true', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ bind_checks: true }), 'analyze');
        expect(baseArgs).not.toContain('--no-bind-checks');
    });

    it('adds --vital-checks when vital_checks is true', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ vital_checks: true }), 'analyze');
        expect(baseArgs).toContain('--vital-checks');
    });

    it('adds --time-resolution when resolution_limit is set', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ resolution_limit: '1ps' }), 'analyze');
        expect(baseArgs).toContain('--time-resolution=1ps');
    });

    it('does not add --time-resolution when resolution_limit is empty', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ resolution_limit: '' }), 'analyze');
        expect(baseArgs.some(a => a.startsWith('--time-resolution='))).toBe(false);
    });

    it('appends analyze_options to baseArgs', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ analyze_options: ['--dump-vcode', '--cover'] }), 'analyze');
        expect(baseArgs).toContain('--dump-vcode');
        expect(baseArgs).toContain('--cover');
    });

    it('appends extra_flags to baseArgs', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ extra_flags: ['--my-flag'] }), 'analyze');
        expect(baseArgs).toContain('--my-flag');
    });

    it('appends additionalArgs passed directly to the function', () => {
        const { baseArgs } = buildnvcArgs(makeConfig(), 'analyze', ['--custom-arg']);
        expect(baseArgs).toContain('--custom-arg');
    });
});

describe('buildnvcArgs – elaborate command', () => {
    it('appends elaborate_options to baseArgs', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ elaborate_options: ['--jit'] }), 'elaborate');
        expect(baseArgs).toContain('--jit');
    });

    it('adds -Werror to baseArgs when warnings_as_errors is true', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ warnings_as_errors: true }), 'elaborate');
        expect(baseArgs).toContain('-Werror');
    });

    it('does not add -Werror when warnings_as_errors is false', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ warnings_as_errors: false }), 'elaborate');
        expect(baseArgs).not.toContain('-Werror');
    });

    it('adds -Wno-<w> for each suppressed warning', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ suppress_warnings: ['unused', 'hidden'] }), 'elaborate');
        expect(baseArgs).toContain('-Wno-unused');
        expect(baseArgs).toContain('-Wno-hidden');
    });

    it('does not produce runArgs for elaborate', () => {
        const { runArgs } = buildnvcArgs(makeConfig(), 'elaborate');
        expect(runArgs).toHaveLength(0);
    });
});

describe('buildnvcArgs – run (simulate) command', () => {
    it('adds --wave=<file> for enabled waveform with vcd format', () => {
        const config = makeConfig({
            waveform_enabled: true,
            waveform_format: e_tools_nvc_waveform_format.vcd,
        });
        const { runArgs } = buildnvcArgs(config, 'run');
        expect(runArgs).toContain('--wave=wave_teroshdl_nvc.vcd');
    });

    it('adds --wave=<file> with fst extension when format is fst', () => {
        const config = makeConfig({
            waveform_enabled: true,
            waveform_format: e_tools_nvc_waveform_format.fst,
        });
        const { runArgs } = buildnvcArgs(config, 'run');
        expect(runArgs).toContain('--wave=wave_teroshdl_nvc.fst');
    });

    it('adds --wave=<file> with ghw extension when format is ghw', () => {
        const config = makeConfig({
            waveform_enabled: true,
            waveform_format: e_tools_nvc_waveform_format.ghw,
        });
        const { runArgs } = buildnvcArgs(config, 'run');
        expect(runArgs).toContain('--wave=wave_teroshdl_nvc.ghw');
    });

    it('omits --wave when waveform_enabled is false', () => {
        const config = makeConfig({ waveform_enabled: false });
        const { runArgs } = buildnvcArgs(config, 'run');
        expect(runArgs.some(a => a.startsWith('--wave='))).toBe(false);
    });

    it('adds --stop-time when simulation_time is set', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ simulation_time: '1000ns' }), 'run');
        expect(runArgs).toContain('--stop-time=1000ns');
    });

    it('omits --stop-time when simulation_time is empty', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ simulation_time: '' }), 'run');
        expect(runArgs.some(a => a.startsWith('--stop-time='))).toBe(false);
    });

    it('adds --stack-size when stack_size is set', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ stack_size: '64m' }), 'run');
        expect(runArgs).toContain('--stack-size=64m');
    });

    it('adds --stop-delta when stop_delta_cycles is greater than zero', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ stop_delta_cycles: 1000 }), 'run');
        expect(runArgs).toContain('--stop-delta=1000');
    });

    it('omits --stop-delta when stop_delta_cycles is zero', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ stop_delta_cycles: 0 }), 'run');
        expect(runArgs.some(a => a.startsWith('--stop-delta='))).toBe(false);
    });

    it('adds --disp-time when display_time is true', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ display_time: true }), 'run');
        expect(runArgs).toContain('--disp-time');
    });

    it('adds --unbuffered when unbuffered_output is true', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ unbuffered_output: true }), 'run');
        expect(runArgs).toContain('--unbuffered');
    });

    it('adds --max-stack-alloc when max_stack_alloc is greater than zero', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ max_stack_alloc: 128 }), 'run');
        expect(runArgs).toContain('--max-stack-alloc=128');
    });

    it('adds --backtrace-severity when not error (default)', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ backtrace_severity: e_tools_nvc_backtrace_severity.warning }), 'run');
        expect(runArgs).toContain('--backtrace-severity=warning');
    });

    it('adds --backtrace-severity=none for none value', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ backtrace_severity: e_tools_nvc_backtrace_severity.none }), 'run');
        expect(runArgs).toContain('--backtrace-severity=none');
    });

    it('adds --ieee-asserts when ieee_asserts is not enable', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ ieee_asserts: e_tools_nvc_ieee_asserts.disable }), 'run');
        expect(runArgs).toContain('--ieee-asserts=disable');
    });

    it('does not add --ieee-asserts when ieee_asserts is enable', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ ieee_asserts: e_tools_nvc_ieee_asserts.enable }), 'run');
        expect(runArgs.some(a => a.startsWith('--ieee-asserts='))).toBe(false);
    });

    it('adds --asserts when asserts_policy is not enable', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ asserts_policy: e_tools_nvc_asserts_policy.disable }), 'run');
        expect(runArgs).toContain('--asserts=disable');
    });

    it('adds --sdf when sdf_file is set', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ sdf_file: 'timing.sdf' }), 'run');
        expect(runArgs).toContain('--sdf=timing.sdf');
    });

    it('adds --vpi=<module> for each vpi module', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ vpi_modules: ['libvpi_a.so', 'libvpi_b.so'] }), 'run');
        expect(runArgs).toContain('--vpi=libvpi_a.so');
        expect(runArgs).toContain('--vpi=libvpi_b.so');
    });

    it('adds --vhpi=<module> for each vhpi module', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ vhpi_modules: ['libvhpi.so'] }), 'run');
        expect(runArgs).toContain('--vhpi=libvhpi.so');
    });

    it('adds --vpi-trace when vpi_trace_file is set', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ vpi_trace_file: 'vpi.log' }), 'run');
        expect(runArgs).toContain('--vpi-trace=vpi.log');
    });

    it('adds --vhpi-trace when vhpi_trace_file is set', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ vhpi_trace_file: 'vhpi.log' }), 'run');
        expect(runArgs).toContain('--vhpi-trace=vhpi.log');
    });

    it('adds --psl-report when psl_report_file is set', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ psl_report_file: 'psl.xml' }), 'run');
        expect(runArgs).toContain('--psl-report=psl.xml');
    });

    it('adds --psl-report-uncovered when psl_report_uncovered is true', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ psl_report_uncovered: true }), 'run');
        expect(runArgs).toContain('--psl-report-uncovered');
    });

    it('adds --disp-tree=<mode> when disp_tree is not none', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ disp_tree: e_tools_nvc_disp_tree.inst }), 'run');
        expect(runArgs).toContain('--disp-tree=inst');
    });

    it('omits --disp-tree when disp_tree is none', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ disp_tree: e_tools_nvc_disp_tree.none }), 'run');
        expect(runArgs.some(a => a.startsWith('--disp-tree='))).toBe(false);
    });

    it('adds --wave-start-time when wave_start_time is set', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ wave_start_time: '10ns' }), 'run');
        expect(runArgs).toContain('--wave-start-time=10ns');
    });

    it('adds --vcd-4states when vcd_4states is true and format is vcd', () => {
        const { runArgs } = buildnvcArgs(makeConfig({
            vcd_4states: true,
            waveform_format: e_tools_nvc_waveform_format.vcd,
        }), 'run');
        expect(runArgs).toContain('--vcd-4states');
    });

    it('does not add --vcd-4states when format is not vcd', () => {
        const { runArgs } = buildnvcArgs(makeConfig({
            vcd_4states: true,
            waveform_format: e_tools_nvc_waveform_format.fst,
        }), 'run');
        expect(runArgs).not.toContain('--vcd-4states');
    });

    it('adds --vcd-nodate when vcd_nodate is true and format is vcd', () => {
        const { runArgs } = buildnvcArgs(makeConfig({
            vcd_nodate: true,
            waveform_format: e_tools_nvc_waveform_format.vcd,
        }), 'run');
        expect(runArgs).toContain('--vcd-nodate');
    });

    it('adds --read-wave-opt when read_wave_opt is set', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ read_wave_opt: 'signals.opt' }), 'run');
        expect(runArgs).toContain('--read-wave-opt=signals.opt');
    });

    it('adds --write-wave-opt when write_wave_opt is set', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ write_wave_opt: 'out.opt' }), 'run');
        expect(runArgs).toContain('--write-wave-opt=out.opt');
    });

    it('adds --no-run when no_run is true', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ no_run: true }), 'run');
        expect(runArgs).toContain('--no-run');
    });

    it('appends run_options to runArgs', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ run_options: ['--coverage'] }), 'run');
        expect(runArgs).toContain('--coverage');
    });

    it('adds -Werror to runArgs when warnings_as_errors is true', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ warnings_as_errors: true }), 'run');
        expect(runArgs).toContain('-Werror');
    });

    it('adds waveform_options to runArgs', () => {
        const { runArgs } = buildnvcArgs(makeConfig({ waveform_options: ['--include=clk'] }), 'run');
        expect(runArgs).toContain('--include=clk');
    });

    it('does not place simulation flags in baseArgs', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ simulation_time: '500ns' }), 'run');
        expect(baseArgs.some(a => a.startsWith('--stop-time='))).toBe(false);
    });
});

describe('buildnvcArgs – synth command', () => {
    it('appends synthesis_options to baseArgs', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ synthesis_options: ['--out=netlist.vhd'] }), 'synth');
        expect(baseArgs).toContain('--out=netlist.vhd');
    });

    it('does not produce runArgs for synth', () => {
        const { runArgs } = buildnvcArgs(makeConfig(), 'synth');
        expect(runArgs).toHaveLength(0);
    });

    it('does not include elaborate_options in synth command', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ elaborate_options: ['--jit'] }), 'synth');
        expect(baseArgs).not.toContain('--jit');
    });
});

describe('buildnvcArgs – command isolation', () => {
    it('analyze does not include -Werror (warning flags are elaborate/run only)', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ warnings_as_errors: true }), 'analyze');
        expect(baseArgs).not.toContain('-Werror');
    });

    it('analyze command does not include run_options', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ run_options: ['--coverage'] }), 'analyze');
        expect(baseArgs).not.toContain('--coverage');
    });

    it('synth command does not include elaborate_options', () => {
        const { baseArgs } = buildnvcArgs(makeConfig({ elaborate_options: ['--jit'] }), 'synth');
        expect(baseArgs).not.toContain('--jit');
    });

    it('extra_flags appear in all command types', () => {
        for (const cmd of ['analyze', 'elaborate', 'run', 'synth'] as const) {
            const { baseArgs } = buildnvcArgs(makeConfig({ extra_flags: ['--trace'] }), cmd);
            expect(baseArgs).toContain('--trace');
        }
    });
});