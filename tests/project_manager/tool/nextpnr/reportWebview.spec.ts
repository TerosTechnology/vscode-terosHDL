const createWebviewPanel = jest.fn();
const showErrorMessage = jest.fn();

import * as fs from 'fs';
import * as path from 'path';

jest.mock('vscode', () => ({
    ViewColumn: { One: 1 },
    window: {
        createWebviewPanel,
        showErrorMessage
    }
}), { virtual: true });

import { showNextpnrReportWebview } from '../../../../src/colibri/project_manager/tool/nextpnr/reportWebview';

describe('nextpnr report webview', () => {
    let webview: { html: string };
    const context = { extensionUri: 'extension-uri' } as never;

    beforeEach(() => {
        webview = { html: '' };
        createWebviewPanel.mockReturnValue({ webview });
        createWebviewPanel.mockClear();
        showErrorMessage.mockClear();
    });

    it('renders utilization, timing status and detailed critical path segments', () => {
        const fixturePath = path.resolve(
            __dirname,
            '../../../fixtures/nextpnr/ice40_blinky/nextpnr_report.sample.json'
        );
        const report = fs.readFileSync(fixturePath, 'utf8');

        showNextpnrReportWebview(report, context);

        expect(createWebviewPanel).toHaveBeenCalledWith(
            'nextpnrReport',
            'nextpnr Utilization & Timing',
            1,
            expect.objectContaining({ enableScripts: false, retainContextWhenHidden: true })
        );
        expect(webview.html).toContain('ICESTORM_LC');
        expect(webview.html).toContain('12');
        expect(webview.html).toContain('128');
        expect(webview.html).toContain('62.47 MHz');
        expect(webview.html).toContain('timing-pass');
        expect(webview.html).toContain('Critical paths');
        expect(webview.html).toContain('posedge clk');
        expect(webview.html).toContain('top.counter_SB_DFFR_Q_0.Q');
        expect(webview.html).toContain('top.counter_SB_LUT4_I3.I3');
        expect(webview.html).toContain('logic · top.counter_SB_DFFR_Q_0.Q → top.counter_SB_LUT4_I3.I3 · net counter[0]');
        expect(webview.html).toContain('1.085 ns');
    });

    it('renders present sections, warns for missing utilization and omits absent critical paths', () => {
        showNextpnrReportWebview(JSON.stringify({
            fmax: { clk: { achieved: 60, constraint: 50 } }
        }), context);

        expect(webview.html).toContain('Achieved Fmax');
        expect(webview.html).toContain('Utilization data is not available');
        expect(webview.html).not.toContain('<h2>Critical paths</h2>');
        expect(webview.html).toContain('timing-pass');
    });

    it('renders utilization even when fmax is missing and shows timing warning', () => {
        showNextpnrReportWebview(JSON.stringify({
            utilisation: { LUT4: { used: 22, available: 128 } }
        }), context);

        expect(webview.html).toContain('LUT4');
        expect(webview.html).toContain('22');
        expect(webview.html).toContain('128');
        expect(webview.html).toContain('Timing data is not available in this report.');
    });

    it('shows a controlled error for invalid JSON without creating a panel', () => {
        showNextpnrReportWebview('{bad json', context);

        expect(showErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Unable to display nextpnr report'));
        expect(createWebviewPanel).not.toHaveBeenCalled();
    });

    it('escapes report-provided labels before inserting them into HTML', () => {
        showNextpnrReportWebview(JSON.stringify({
            utilisation: { '<script>alert(1)</script>': { used: 1, available: 2 } },
            fmax: {}
        }), context);

        expect(webview.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
        expect(webview.html).not.toContain('<script>alert(1)</script>');
    });
});
