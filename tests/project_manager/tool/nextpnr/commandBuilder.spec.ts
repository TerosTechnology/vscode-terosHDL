import { get_default_config, e_tools_nextpnr_target_family } from '../../../../src/colibri/config/config_declaration';
import { buildNextpnrArgs } from '../../../../src/colibri/project_manager/tool/nextpnr/commandBuilder';

describe('nextpnr Command Builder', () => {
    const defaultConfig = () => get_default_config().tools.nextpnr;

    describe('buildNextpnrArgs', () => {
        it('builds iCE40 arguments with PCF and omits unset optional arguments', () => {
            const config = {
                ...defaultConfig(),
                target_family: e_tools_nextpnr_target_family.ice40,
                pcf_file: 'board.pcf'
            };

            expect(buildNextpnrArgs(config, 'design.json', 'design.asc', 'pnr')).toEqual([
                '--json', 'design.json',
                '--pcf', 'board.pcf',
                '--asc', 'design.asc',
                '--seed', '1'
            ]);
        });

        it('builds ECP5 arguments with LPF and its architecture-specific output flag', () => {
            const config = {
                ...defaultConfig(),
                target_family: e_tools_nextpnr_target_family.ecp5,
                lpf_file: 'board.lpf',
                freq: 50,
                seed: 7,
                placer: 'heap',
                router: 'router1'
            };

            expect(buildNextpnrArgs(config, 'design.json', 'design.config', 'pnr')).toEqual([
                '--json', 'design.json',
                '--lpf', 'board.lpf',
                '--textcfg', 'design.config',
                '--freq', '50',
                '--seed', '7',
                '--placer', 'heap',
                '--router', 'router1'
            ]);
        });

        it('uses the generic JSON output option and appends extra options', () => {
            const config = {
                ...defaultConfig(),
                target_family: e_tools_nextpnr_target_family.generic,
                extra_options: ['--timing-allow-fail', '--ignore-loops']
            };

            expect(buildNextpnrArgs(config, 'design.json', 'placed.json', 'pnr')).toEqual([
                '--json', 'design.json',
                '--write', 'placed.json',
                '--seed', '1',
                '--timing-allow-fail',
                '--ignore-loops'
            ]);
        });

        it('adds frequency only when it is greater than zero', () => {
            const args = buildNextpnrArgs(defaultConfig(), 'design.json', 'design.asc', 'pnr');
            expect(args).not.toContain('--freq');

            const configured = { ...defaultConfig(), freq: 25.5 };
            expect(buildNextpnrArgs(configured, 'design.json', 'design.asc', 'pnr')).toContain('25.5');
        });

        it('rejects GUI mode because the verified installed CLI does not support --gui', () => {
            expect(() => buildNextpnrArgs(defaultConfig(), 'design.json', 'design.asc', 'gui'))
                .toThrow('GUI mode is unavailable');
        });

        it('requires a valid target family, JSON input and output path', () => {
            const config = defaultConfig();
            expect(() => buildNextpnrArgs({ ...config, target_family: undefined }, 'design.json', 'out.asc', 'pnr'))
                .toThrow('Unsupported nextpnr target family');
            expect(() => buildNextpnrArgs(config, ' ', 'out.asc', 'pnr'))
                .toThrow('JSON input file is required');
            expect(() => buildNextpnrArgs(config, 'design.json', '', 'pnr'))
                .toThrow('output file is required');
        });

        it('rejects constraints belonging to a different architecture', () => {
            const ice40WithLpf = {
                ...defaultConfig(),
                target_family: e_tools_nextpnr_target_family.ice40,
                lpf_file: 'wrong-family.lpf'
            };
            const ecp5WithPcf = {
                ...defaultConfig(),
                target_family: e_tools_nextpnr_target_family.ecp5,
                pcf_file: 'wrong-family.pcf'
            };

            expect(() => buildNextpnrArgs(ice40WithLpf, 'design.json', 'out.asc', 'pnr'))
                .toThrow('lpf_file is only valid for the ECP5');
            expect(() => buildNextpnrArgs(ecp5WithPcf, 'design.json', 'out.config', 'pnr'))
                .toThrow('pcf_file is only valid for the iCE40');
        });

        it('validates numeric options', () => {
            expect(() => buildNextpnrArgs({ ...defaultConfig(), freq: -1 }, 'design.json', 'out.asc', 'pnr'))
                .toThrow('freq must be a finite number');
            expect(() => buildNextpnrArgs({ ...defaultConfig(), seed: 1.5 }, 'design.json', 'out.asc', 'pnr'))
                .toThrow('seed must be a finite integer');
        });

        it('rejects duplicate managed or repeated extra options', () => {
            expect(() => buildNextpnrArgs({ ...defaultConfig(), extra_options: ['--json', 'other.json'] },
                'design.json', 'out.asc', 'pnr')).toThrow('--json is managed');
            expect(() => buildNextpnrArgs({ ...defaultConfig(), extra_options: ['--timing-allow-fail', '--timing-allow-fail'] },
                'design.json', 'out.asc', 'pnr')).toThrow('Duplicate nextpnr option');
        });

        it('rejects empty extra option entries', () => {
            expect(() => buildNextpnrArgs({ ...defaultConfig(), extra_options: [''] }, 'design.json', 'out.asc', 'pnr'))
                .toThrow('extra_options must contain non-empty strings');
        });
    });
});
