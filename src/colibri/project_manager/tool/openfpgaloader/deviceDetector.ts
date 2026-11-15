import { t_loader_boards_result } from '../common';
import { executeCommandWait } from './executor';
import { parseDetectOutput, parseDetectionError, t_openfpgaloader_config } from './utils';

const DETECTION_TIMEOUT_SECONDS = 15;

function parseDetectJsonOutput(stdout: string): ReturnType<typeof parseDetectOutput> {
    const parsed = JSON.parse(stdout) as unknown;
    const devices = Array.isArray(parsed)
        ? parsed
        : (parsed as { devices?: unknown[] })?.devices;

    if (!Array.isArray(devices)) {
        return [];
    }

    const lines: string[] = [];
    for (const item of devices) {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
            continue;
        }

        const device = item as Record<string, unknown>;
        const family = String(device.family ?? '').trim();
        const model = String(device.model ?? '').trim();

        if (family === '' || model === '') {
            continue;
        }

        lines.push(`family ${family}`);
        lines.push(`model ${model}`);
        lines.push('');
    }

    return parseDetectOutput(lines.join('\n'));
}

export async function detectDevices(
    config: t_openfpgaloader_config,
    cwd: string
): Promise<t_loader_boards_result> {
    const jsonResult = await executeCommandWait(
        config,
        ['--detect', '--json'],
        cwd,
        DETECTION_TIMEOUT_SECONDS
    );

    if (jsonResult.successful) {
        try {
            const boardList = parseDetectJsonOutput(jsonResult.stdout);
            return {
                board_list: boardList,
                successful: true,
                msg: boardList.length > 0 ? '' : 'No devices found'
            };
        }
        catch (_error) {
            // Fallback to text parsing for versions with non-standard JSON output.
        }
    }

    const result = await executeCommandWait(
        config,
        ['--detect'],
        cwd,
        DETECTION_TIMEOUT_SECONDS
    );

    if (!result.successful) {
        return {
            board_list: [],
            successful: false,
            msg: parseDetectionError(result.stderr)
        };
    }

    const boardList = parseDetectOutput(result.stdout);
    return {
        board_list: boardList,
        successful: true,
        msg: boardList.length > 0 ? '' : 'No devices found'
    };
}
