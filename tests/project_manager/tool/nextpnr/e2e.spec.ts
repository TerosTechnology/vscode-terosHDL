import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
    e_tools_general_select_tool,
    e_tools_nextpnr_ice40_device,
    e_tools_nextpnr_target_family,
    get_default_config
} from '../../../../src/colibri/config/config_declaration';
import { LoggerBase } from '../../../../src/colibri/logger/logger';
import { p_result } from '../../../../src/colibri/process/common';
import { t_project_definition } from '../../../../src/colibri/project_manager/project_definition';
import { runNextpnrPack, runNextpnrPnR } from '../../../../src/colibri/project_manager/tool/nextpnr/tasks';

const runE2E = process.env.NEXTPNR_E2E === '1';
const describeE2E = runE2E ? describe : describe.skip;

function runPnR(project: t_project_definition, logger: LoggerBase): Promise<p_result> {
    return new Promise((resolve) => {
        runNextpnrPnR(project, logger, (result: p_result) => resolve(result));
    });
}

function runPack(project: t_project_definition, logger: LoggerBase): Promise<p_result> {
    return new Promise((resolve) => {
        runNextpnrPack(project, logger, (result: p_result) => resolve(result));
    });
}

describeE2E('nextpnr iCE40 e2e', () => {
    jest.setTimeout(180000);

    let tempDirectory: string;

    beforeEach(() => {
        tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'teroshdl-nextpnr-e2e-'));
    });

    afterEach(() => {
        fs.rmSync(tempDirectory, { recursive: true, force: true });
    });

    it('runs P&R and pack through extension tasks against the fixture netlist', async () => {
        const jsonFromEnv = process.env.NEXTPNR_E2E_JSON;
        expect(typeof jsonFromEnv).toBe('string');
        const jsonPath = String(jsonFromEnv);
        expect(path.isAbsolute(jsonPath)).toBe(true);
        expect(fs.existsSync(jsonPath)).toBe(true);

        const pcfPath = path.resolve(__dirname, '../../../fixtures/nextpnr/ice40_blinky/blinky.pcf');
        expect(fs.existsSync(pcfPath)).toBe(true);

        const config = get_default_config();
        config.tools.general.select_tool = e_tools_general_select_tool.nextpnr;
        config.tools.nextpnr.target_family = e_tools_nextpnr_target_family.ice40;
        config.tools.nextpnr.ice40_device = e_tools_nextpnr_ice40_device.hx1k;
        config.tools.nextpnr.package = 'tq144';
        config.tools.nextpnr.installation_path = '';
        config.tools.nextpnr.packer_installation_path = '';
        config.tools.nextpnr.pcf_file = pcfPath;
        config.tools.nextpnr.json_file = jsonPath;

        const project = {
            project_disk_path: tempDirectory,
            config
        } as t_project_definition;

        const logger = { appendLine: jest.fn() } as unknown as LoggerBase;

        const pnrResult = await runPnR(project, logger);
        expect(pnrResult.successful).toBe(true);

        const ascPath = path.join(tempDirectory, 'nextpnr_out.asc');
        expect(fs.existsSync(ascPath)).toBe(true);
        expect(fs.statSync(ascPath).size).toBeGreaterThan(0);

        const reportPath = path.join(tempDirectory, 'nextpnr_report.json');
        expect(fs.existsSync(reportPath)).toBe(true);
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8')) as Record<string, unknown>;
        const utilization = (report.utilisation ?? report.utilization) as Record<string, unknown> | undefined;
        expect(utilization).toBeDefined();
        expect(Object.keys(utilization || {})).not.toHaveLength(0);

        const packResult = await runPack(project, logger);
        expect(packResult.successful).toBe(true);

        const binPath = path.join(tempDirectory, 'nextpnr_out.bin');
        expect(fs.existsSync(binPath)).toBe(true);
        expect(fs.statSync(binPath).size).toBeGreaterThan(0);
    });
});
