import { detectDevices } from '../../../../src/colibri/project_manager/tool/openfpgaloader/deviceDetector';
import { executeCommandWait } from '../../../../src/colibri/project_manager/tool/openfpgaloader/executor';
import { p_result } from '../../../../src/colibri/process/common';

jest.mock('../../../../src/colibri/project_manager/tool/openfpgaloader/executor', () => ({
    executeCommandWait: jest.fn()
}));

const mockedExecuteCommandWait = executeCommandWait as jest.MockedFunction<typeof executeCommandWait>;

function createResult(
    stdout: string,
    stderr = '',
    successful = true
): p_result {
    return {
        command: 'openFPGALoader',
        stdout,
        stderr,
        return_value: successful ? 0 : -1,
        successful
    };
}

describe('openfpgaloader deviceDetector', () => {
    const config = {
        installation_path: ''
    };

    const cwd = '/tmp';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('detects devices using JSON output first', async () => {
        const jsonOutput = JSON.stringify({
            devices: [
                { family: 'ice40', model: 'LP384-CM49' },
                { family: 'CertusProNX', model: 'LFCPNX-100' }
            ]
        });

        mockedExecuteCommandWait.mockResolvedValueOnce(createResult(jsonOutput));

        const result = await detectDevices(config, cwd);

        expect(mockedExecuteCommandWait).toHaveBeenCalledTimes(1);
        expect(mockedExecuteCommandWait).toHaveBeenCalledWith(
            config,
            ['--detect', '--json'],
            cwd,
            15
        );

        expect(result).toEqual({
            board_list: [
                { family: 'ice40', part_list: ['LP384-CM49'] },
                { family: 'CertusProNX', part_list: ['LFCPNX-100'] }
            ],
            successful: true,
            msg: ''
        });
    });

    it('falls back to text detection when JSON mode fails', async () => {
        const textOutput = [
            'found 1 devices',
            'index 0: idcode 0x10f4043',
            'manufacturer lattice',
            'family ice40',
            'model LP384-CM49',
            'irlength 8'
        ].join('\n');

        mockedExecuteCommandWait
            .mockResolvedValueOnce(createResult('', 'Unknown option: --json', false))
            .mockResolvedValueOnce(createResult(textOutput));

        const result = await detectDevices(config, cwd);

        expect(mockedExecuteCommandWait).toHaveBeenCalledTimes(2);
        expect(mockedExecuteCommandWait).toHaveBeenNthCalledWith(
            1,
            config,
            ['--detect', '--json'],
            cwd,
            15
        );
        expect(mockedExecuteCommandWait).toHaveBeenNthCalledWith(
            2,
            config,
            ['--detect'],
            cwd,
            15
        );
        expect(result).toEqual({
            board_list: [{ family: 'ice40', part_list: ['LP384-CM49'] }],
            successful: true,
            msg: ''
        });
    });

    it('falls back to text detection when JSON output is malformed', async () => {
        const textOutput = [
            'found 1 devices',
            'index 0: idcode 0x10f4043',
            'family ice40',
            'model LP384-CM49'
        ].join('\n');

        mockedExecuteCommandWait
            .mockResolvedValueOnce(createResult('not-a-json'))
            .mockResolvedValueOnce(createResult(textOutput));

        const result = await detectDevices(config, cwd);

        expect(mockedExecuteCommandWait).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
            board_list: [{ family: 'ice40', part_list: ['LP384-CM49'] }],
            successful: true,
            msg: ''
        });
    });

    it('returns an error when detection times out', async () => {
        mockedExecuteCommandWait
            .mockResolvedValueOnce(createResult('', 'Unknown option: --json', false))
            .mockResolvedValueOnce(createResult('', 'Timeout reached', false));

        const result = await detectDevices(config, cwd);

        expect(mockedExecuteCommandWait).toHaveBeenCalledTimes(2);
        expect(result).toEqual({
            board_list: [],
            successful: false,
            msg: 'Timeout while detecting devices. Check the cable and drivers.'
        });
    });

    it('returns an error when the USB/JTAG backend is missing', async () => {
        mockedExecuteCommandWait
            .mockResolvedValueOnce(createResult('', 'Unknown option: --json', false))
            .mockResolvedValueOnce(createResult('', 'libftdi: backend not found', false));

        const result = await detectDevices(config, cwd);

        expect(result.successful).toBe(false);
        expect(result.msg).toContain('USB/JTAG backend or driver');
    });

    it('returns an error when device access is denied', async () => {
        mockedExecuteCommandWait
            .mockResolvedValueOnce(createResult('', 'Unknown option: --json', false))
            .mockResolvedValueOnce(createResult('', 'usb_open() failed: Permission denied', false));

        const result = await detectDevices(config, cwd);

        expect(result).toEqual({
            board_list: [],
            successful: false,
            msg: 'Permission denied. Configure the udev rules for your JTAG cable.'
        });
    });

    it('returns an error when no cable or device is connected', async () => {
        mockedExecuteCommandWait
            .mockResolvedValueOnce(createResult('', 'Unknown option: --json', false))
            .mockResolvedValueOnce(createResult('', 'unable to open ftdi device: -3 (device not found)', false));

        const result = await detectDevices(config, cwd);

        expect(result.successful).toBe(false);
        expect(result.msg).toContain('JTAG device or cable not found');
    });

    it('returns an empty board list when no devices are detected', async () => {
        mockedExecuteCommandWait.mockResolvedValueOnce(createResult(JSON.stringify({ devices: [] })));

        const result = await detectDevices(config, cwd);

        expect(result).toEqual({
            board_list: [],
            successful: true,
            msg: 'No devices found'
        });
    });

    it('ignores invalid entries in JSON output', async () => {
        const jsonOutput = JSON.stringify({
            devices: [
                null,
                42,
                'invalid device',
                [],
                { family: 'ice40', model: 'LP384-CM49' },
                { family: '', model: 'INVALID' },
                { family: 'ice40', model: '' }
            ]
        });

        mockedExecuteCommandWait.mockResolvedValueOnce(createResult(jsonOutput));

        const result = await detectDevices(config, cwd);

        expect(mockedExecuteCommandWait).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            board_list: [
                { family: 'ice40', part_list: ['LP384-CM49'] }
            ],
            successful: true,
            msg: ''
        });
    });
});
