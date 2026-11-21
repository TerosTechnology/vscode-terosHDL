import { executeCommandWait } from './executor';
import { t_openfpgaloader_config } from './utils';

export type t_openfpgaloader_board = {
    name: string;
    cable: string;
};

export type t_openfpgaloader_board_result = {
    board_list: t_openfpgaloader_board[];
    successful: boolean;
    msg: string;
};

export function parseBoardList(stdout: string): t_openfpgaloader_board[] {
    const boards: t_openfpgaloader_board[] = [];

    for (const line of stdout.split(/\r?\n/)) {
        const trimmedLine = line.trim();

        if (
            trimmedLine === '' ||
            trimmedLine === 'empty' ||
            trimmedLine.startsWith('board name')
        ) {
            continue;
        }

        const columns = trimmedLine.split(/\s+/);
        if (columns.length > 2) {
            continue;
        }

        const name = columns[0];
        const cable = columns[1] ?? '';

        boards.push({ name, cable });
    }

    return boards;
}

export async function listBoards(
    config: t_openfpgaloader_config,
    cwd: string
): Promise<t_openfpgaloader_board_result> {
    try {
        const result = await executeCommandWait(config, ['--list-boards'], cwd);

        if (!result.successful) {
            return {
                board_list: [],
                successful: false,
                msg: result.stderr || result.stdout || 'Unable to list OpenFPGALoader boards.'
            };
        }

        return {
            board_list: parseBoardList(result.stdout),
            successful: true,
            msg: ''
        };
    }
    catch (error) {
        return {
            board_list: [],
            successful: false,
            msg: error instanceof Error ? error.message : String(error)
        };
    }
}
