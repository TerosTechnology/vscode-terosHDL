import { listBoards, parseBoardList } from '../../../../src/colibri/project_manager/tool/openfpgaloader/boardDetector';
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

describe('openfpgaloader boardDetector', () => {
    const config = {
        installation_path: ''
    };

    const cwd = '/tmp';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('parses the board list output', () => {
        const stdout = [
            'board name   cable',
            'arty         digilent',
            'iceblink40  ft2232h',
            '',
            'bad line that should be ignored',
            'ulx3s'
        ].join('\n');

        const result = parseBoardList(stdout);

        expect(result).toEqual([
            { name: 'arty', cable: 'digilent' },
            { name: 'iceblink40', cable: 'ft2232h' },
            { name: 'ulx3s', cable: '' }
        ]);
    });

    it('returns the list of supported boards when the command succeeds', async () => {
        mockedExecuteCommandWait.mockResolvedValueOnce(createResult([
            'board name   cable',
            'arty         digilent',
            'iceblink40  ft2232h'
        ].join('\n')));

        const result = await listBoards(config, cwd);

        expect(mockedExecuteCommandWait).toHaveBeenCalledWith(
            config,
            ['--list-boards'],
            cwd
        );

        expect(result).toEqual({
            board_list: [
                { name: 'arty', cable: 'digilent' },
                { name: 'iceblink40', cable: 'ft2232h' }
            ],
            successful: true,
            msg: ''
        });
    });

    it('returns an error when listing boards fails', async () => {
        mockedExecuteCommandWait.mockResolvedValueOnce(createResult(
            '',
            'OpenFPGALoader not found',
            false
        ));

        const result = await listBoards(config, cwd);

        expect(result).toEqual({
            board_list: [],
            successful: false,
            msg: 'OpenFPGALoader not found'
        });
    });

    it('returns a generic error when the command throws', async () => {
        mockedExecuteCommandWait.mockRejectedValueOnce(new Error('Unexpected failure'));

        const result = await listBoards(config, cwd);

        expect(result).toEqual({
            board_list: [],
            successful: false,
            msg: 'Unexpected failure'
        });
    });
});
