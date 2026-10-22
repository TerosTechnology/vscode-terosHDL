const createWebviewPanel = jest.fn();
const showErrorMessage = jest.fn();

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
        const report = {
            utilisation: { 'ICESTORM_LC': { used: 12, available: 100 } },
            fmax: { clk: { achieved: 48.5, constraint: 50 } },
            critical_paths: [{
                from: 'counter[0]',
                to: 'led',
                path: [{ type: 'logic', delay: 1.25 }, { type: 'routing', delay: 2.5 }]
            }]
        };

        showNextpnrReportWebview(JSON.stringify(report), context);

        expect(createWebviewPanel).toHaveBeenCalledWith(
            'nextpnrReport',
            'nextpnr Utilization & Timing',
            1,
            expect.objectContaining({ enableScripts: false, retainContextWhenHidden: true })
        );
        expect(webview.html).toContain('ICESTORM_LC');
        expect(webview.html).toContain('12');
        expect(webview.html).toContain('100');
        expect(webview.html).toContain('48.50 MHz');
        expect(webview.html).toContain('timing-fail');
        expect(webview.html).toContain('Critical paths');
        expect(webview.html).toContain('logic');
        expect(webview.html).toContain('1.250 ns');
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
