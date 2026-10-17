import {
    e_tools_general_select_tool,
    e_tools_nextpnr_target_family,
    get_default_config
} from '../../src/colibri/config/config_declaration';
import { BinaryCheck, checkBinary } from '../../src/colibri/toolChecker/utils';
import { checkExternalToolManager } from '../../src/teroshdl/features/configChecker/externalTools';

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
    });

    it.each([
        [e_tools_nextpnr_target_family.ice40, 'nextpnr-ice40'],
        [e_tools_nextpnr_target_family.ecp5, 'nextpnr-ecp5'],
        [e_tools_nextpnr_target_family.generic, 'nextpnr-generic']
    ])('checks the executable for target family %s', async (targetFamily, binaryName) => {
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
        expect(report).toContain('Correctly configured');
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
});
