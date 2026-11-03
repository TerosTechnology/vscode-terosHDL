import {
    e_tools_general_select_tool,
    e_tools_nextpnr_target_family,
    get_default_config
} from '../../src/colibri/config/config_declaration';
import { OS } from '../../src/colibri/process/common';
import * as process_utils from '../../src/colibri/process/utils';
import { BinaryCheck, checkBinary } from '../../src/colibri/toolChecker/utils';
import { checkExternalToolManager } from '../../src/teroshdl/features/configChecker/externalTools';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

jest.mock('../../src/colibri/toolChecker/utils', () => ({
    checkBinary: jest.fn()
}));

const mockedCheckBinary = checkBinary as jest.MockedFunction<typeof checkBinary>;

describe('nextpnr Verify Setup', () => {
    const successfulResult: BinaryCheck = {
        displayName: 'nextpnr',
        binaryPath: 'nextpnr-ice40',
        messageList: ['nextpnr found'],
        successfulFind: true,
        successfulConfig: true
    };

    beforeEach(() => {
        mockedCheckBinary.mockReset();
        mockedCheckBinary.mockResolvedValue(successfulResult);
        jest.spyOn(process_utils, 'get_os').mockReturnValue(OS.LINUX);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    async function expectExecutableCheckForFamily(
        targetFamily: e_tools_nextpnr_target_family,
        binaryName: string
    ): Promise<void> {
        const config = get_default_config();
        config.tools.general.select_tool = e_tools_general_select_tool.nextpnr;
        config.tools.nextpnr.target_family = targetFamily;
        config.tools.nextpnr.installation_path = '/tools/nextpnr';

        const report = await checkExternalToolManager(config);

        expect(mockedCheckBinary).toHaveBeenCalledWith(
            'nextpnr',
            '/tools/nextpnr',
            binaryName,
            ['--version']
        );
        if (targetFamily === e_tools_nextpnr_target_family.ice40) {
            expect(mockedCheckBinary).toHaveBeenCalledWith(
                'nextpnr packer',
                '/tools/nextpnr',
                'icepack',
                ['--version']
            );
        }
        if (targetFamily === e_tools_nextpnr_target_family.ecp5) {
            expect(mockedCheckBinary).toHaveBeenCalledWith(
                'nextpnr packer',
                '/tools/nextpnr',
                'ecppack',
                ['--version']
            );
        }
        if (targetFamily === e_tools_nextpnr_target_family.generic) {
            expect(mockedCheckBinary).not.toHaveBeenCalledWith(
                'nextpnr packer',
                expect.any(String),
                expect.any(String),
                expect.any(Array)
            );
        }
        expect(report).toContain('Correctly configured');
    }

    it('checks the executable for target family ice40', async () => {
        await expectExecutableCheckForFamily(e_tools_nextpnr_target_family.ice40, 'nextpnr-ice40');
    });

    it('checks the executable for target family ecp5', async () => {
        await expectExecutableCheckForFamily(e_tools_nextpnr_target_family.ecp5, 'nextpnr-ecp5');
    });

    it('checks the executable for target family generic', async () => {
        await expectExecutableCheckForFamily(e_tools_nextpnr_target_family.generic, 'nextpnr-generic');
    });

    it('reports a missing architecture-specific executable as a Verify Setup failure', async () => {
        const config = get_default_config();
        config.tools.general.select_tool = e_tools_general_select_tool.nextpnr;
        config.tools.nextpnr.target_family = e_tools_nextpnr_target_family.ecp5;
        mockedCheckBinary.mockResolvedValue({
            ...successfulResult,
            successfulFind: false,
            successfulConfig: false,
            messageList: ['nextpnr executable was not found']
        });

        const report = await checkExternalToolManager(config);

        expect(report).toContain('Some checks failed');
        expect(report).toContain('nextpnr executable was not found');
    });

    it('rejects an unsupported target family without checking a generic binary', async () => {
        const config = get_default_config();
        config.tools.general.select_tool = e_tools_general_select_tool.nextpnr;
        config.tools.nextpnr.target_family = 'unsupported' as e_tools_nextpnr_target_family;

        const report = await checkExternalToolManager(config);

        expect(mockedCheckBinary).not.toHaveBeenCalled();
        expect(report).toContain('Unsupported nextpnr target family: unsupported');
        expect(report).toContain('Some checks failed');
    });

    it('accepts packer binaries found in configured directory when version check is unsupported', async () => {
        const config = get_default_config();
        config.tools.general.select_tool = e_tools_general_select_tool.nextpnr;
        config.tools.nextpnr.target_family = e_tools_nextpnr_target_family.ice40;

        const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'teroshdl-packer-check-'));
        try {
            config.tools.nextpnr.installation_path = '/tools/nextpnr';
            config.tools.nextpnr.packer_installation_path = tempDirectory;
            fs.writeFileSync(path.join(tempDirectory, 'icepack'), '');

            mockedCheckBinary.mockImplementation(async (_displayName, _path, binaryName) => {
                if (binaryName === 'nextpnr-ice40') {
                    return successfulResult;
                }
                return {
                    ...successfulResult,
                    successfulFind: false,
                    successfulConfig: false,
                    messageList: ['version check unsupported']
                };
            });

            const report = await checkExternalToolManager(config);

            expect(report).toContain('Correctly configured');
            expect(report).toContain('version query not supported');
        } finally {
            fs.rmSync(tempDirectory, { recursive: true, force: true });
        }
    });
});
