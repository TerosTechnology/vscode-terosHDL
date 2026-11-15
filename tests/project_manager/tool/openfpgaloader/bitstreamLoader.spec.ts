import * as path from 'path';
import * as file_utils from 'colibri/utils/file_utils';
import { executeCommandWait } from 'colibri/project_manager/tool/openfpgaloader/executor';

import { buildLoadArgs, extractProgressPercent, loadBitstream, loadBitstreamStream } 
from 'colibri/project_manager/tool/openfpgaloader/bitstreamLoader';

import { t_openfpgaloader_config } from 'colibri/project_manager/tool/openfpgaloader/utils';
import * as executor from 'colibri/project_manager/tool/openfpgaloader/executor';
import { EventEmitter } from 'events';

jest.mock('child_process', () => ({
	spawn: jest.fn()
}));

jest.mock('colibri/utils/file_utils', () => ({
	check_if_path_exist: jest.fn()
}));

jest.mock('colibri/project_manager/tool/openfpgaloader/executor', () => ({
	getBinary: jest.fn(() => 'openFPGALoader'),
	executeCommandWait: jest.fn()
}));

const childProcess = require('child_process') as { spawn: jest.Mock };

class MockStream extends EventEmitter {
	setEncoding(): void {}
}

class MockChildProcess extends EventEmitter {
	stdout = new MockStream();
	stderr = new MockStream();

	kill = jest.fn(() => true)
}

describe('bitstreamLoader', () => {
	const config: t_openfpgaloader_config = {
		installation_path: ''
	};

	const boardId = 'icebreaker';
	const bitstreamPath = '/project/build/design.bit';
	const absoluteBitstreamPath = path.resolve(bitstreamPath);

	beforeEach(() => {
		jest.clearAllMocks();

		(file_utils.check_if_path_exist as jest.Mock).mockReturnValue(true);
		(executeCommandWait as jest.Mock).mockResolvedValue({
			successful: true,
			stdout: 'Programming completed successfully.',
			stderr: '',
			return_value: 0,
			error_code: null
		});
	});

	it('should return an error when no board is specified', async () => {
		const result = await loadBitstream(
			config,
			'',
			bitstreamPath
		);

		expect(result).toEqual({
			successful: false,
			msg: 'No board or device has been specified.'
		});

		expect(executeCommandWait).not.toHaveBeenCalled();
	});

	it('should return an error when no bitstream path is specified', async () => {
		const result = await loadBitstream(
			config,
			boardId,
			''
		);

		expect(result).toEqual({
			successful: false,
			msg: 'No bitstream file has been specified.'
		});

		expect(executeCommandWait).not.toHaveBeenCalled();
	});

	it('should return an error when the bitstream file does not exist', async () => {
		(file_utils.check_if_path_exist as jest.Mock).mockReturnValue(false);

		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath
		);

		expect(result).toEqual({
			successful: false,
			msg: `Bitstream file not found: ${absoluteBitstreamPath}`
		});

		expect(file_utils.check_if_path_exist).toHaveBeenCalledWith(
			absoluteBitstreamPath
		);
		expect(executeCommandWait).not.toHaveBeenCalled();
	});

	it('should return an error when the JTAG frequency is zero', async () => {
		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath,
			{ freq: 0 }
		);

		expect(result).toEqual({
			successful: false,
			msg: 'JTAG frequency must be a positive number.'
		});

		expect(executeCommandWait).not.toHaveBeenCalled();
	});

	it('should return an error when the JTAG frequency is negative', async () => {
		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath,
			{ freq: -1 }
		);

		expect(result).toEqual({
			successful: false,
			msg: 'JTAG frequency must be a positive number.'
		});

		expect(executeCommandWait).not.toHaveBeenCalled();
	});

	it('should return an error when the JTAG frequency is not finite', async () => {
		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath,
			{ freq: Number.NaN }
		);

		expect(result).toEqual({
			successful: false,
			msg: 'JTAG frequency must be a positive number.'
		});

		expect(executeCommandWait).not.toHaveBeenCalled();
	});

	it('should return an error when the cable identifier is empty', async () => {
		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath,
			{ cable: '   ' }
		);

		expect(result).toEqual({
			successful: false,
			msg: 'JTAG cable identifier cannot be empty.'
		});

		expect(executeCommandWait).not.toHaveBeenCalled();
	});

	it('should execute OpenFPGALoader with the required arguments', async () => {
		const result = await loadBitstream(
			config,
			` ${boardId} `,
			bitstreamPath
		);

		expect(result).toEqual({
			successful: true,
			msg: 'Programming completed successfully.'
		});

		expect(executeCommandWait).toHaveBeenCalledWith(
			config,
			['-b', boardId, absoluteBitstreamPath],
			path.dirname(absoluteBitstreamPath),
			undefined
		);
	});

	it('should execute OpenFPGALoader with all optional arguments', async () => {
		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath,
			{
				cable: '  dirtyJtag  ',
				verify: true,
				reset: true,
				freq: 6000000
			}
		);

		expect(result.successful).toBe(true);

		expect(executeCommandWait).toHaveBeenCalledWith(
			config,
			[
				'-b',
				boardId,
				absoluteBitstreamPath,
				'--cable',
				'dirtyJtag',
				'--verify',
				'--reset',
				'--freq',
				'6000000'
			],
			path.dirname(absoluteBitstreamPath),
			undefined
		);
	});

	it('should pass timeout to command execution when provided', async () => {
		await loadBitstream(
			config,
			boardId,
			bitstreamPath,
			{ timeoutSeconds: 25 }
		);

		expect(executeCommandWait).toHaveBeenCalledWith(
			config,
			['-b', boardId, absoluteBitstreamPath],
			path.dirname(absoluteBitstreamPath),
			25
		);
	});

	it('should return the command output when execution fails', async () => {
		(executeCommandWait as jest.Mock).mockResolvedValue({
			successful: false,
			stdout: 'Programming started.',
			stderr: 'Device not responding.',
			return_value: 1,
			error_code: null
		});

		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath
		);

		expect(result).toEqual({
			successful: false,
			msg: 'Programming started.\nDevice not responding.'
		});
	});

	it('should map busy-device errors to a user friendly message', async () => {
		(executeCommandWait as jest.Mock).mockResolvedValue({
			successful: false,
			stdout: '',
			stderr: 'resource busy',
			return_value: 1
		});

		const result = await loadBitstream(config, boardId, bitstreamPath);

		expect(result).toEqual({
			successful: false,
			msg: 'Device busy. Another process is using the JTAG cable/device.'
		});
	});

	it('should return an empty message when the command succeeds without output', async () => {
		(executeCommandWait as jest.Mock).mockResolvedValue({
			successful: true,
			stdout: '',
			stderr: '',
			return_value: 0,
			error_code: null
		});

		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath
		);

		expect(result).toEqual({
			successful: true,
			msg: ''
		});
	});

	it('should handle an exception during command execution', async () => {
		(executeCommandWait as jest.Mock).mockRejectedValue(
			new Error('Process execution failed.')
		);

		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath
		);

		expect(result).toEqual({
			successful: false,
			msg: 'Process execution failed.'
		});
	});

	it('should handle an unknown exception during command execution', async () => {
		(executeCommandWait as jest.Mock).mockRejectedValue('Unexpected error');

		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath
		);

		expect(result).toEqual({
			successful: false,
			msg: 'Unknown error while executing OpenFPGALoader.'
		});
	});

	it('should return an error when timeout is not a positive number', async () => {
		const result = await loadBitstream(
			config,
			boardId,
			bitstreamPath,
			{ timeoutSeconds: 0 }
		);

		expect(result).toEqual({
			successful: false,
			msg: 'Timeout must be a positive number of seconds.'
		});
	});

	it('buildLoadArgs should include all configured options', () => {
		const args = buildLoadArgs(' board ', '/tmp/a.bit', {
			cable: ' usbjtag ',
			verify: true,
			reset: true,
			freq: 6000
		});

		expect(args).toEqual([
			'-b',
			'board',
			'/tmp/a.bit',
			'--cable',
			'usbjtag',
			'--verify',
			'--reset',
			'--freq',
			'6000'
		]);
	});

	it('extractProgressPercent should parse progress lines', () => {
		expect(extractProgressPercent('[==========] 45%')).toBe(45);
		expect(extractProgressPercent('random output')).toBeUndefined();
	});

	it('loadBitstreamStream should stream output and report progress', (done) => {
		const proc = new MockChildProcess();
		childProcess.spawn.mockReturnValue(proc);
		jest.spyOn(executor, 'getBinary').mockReturnValue('openFPGALoader');

		const outputChunks: string[] = [];
		const progress: number[] = [];

		loadBitstreamStream(
			config,
			boardId,
			bitstreamPath,
			{ verify: true },
			(chunk) => outputChunks.push(chunk),
			(result) => {
				expect(result.successful).toBe(true);
				expect(result.msg).toContain('100%');
				expect(progress).toContain(100);
				expect(outputChunks.join('')).toContain('100%');
				done();
			},
			(percent) => progress.push(percent)
		);

		proc.stdout.emit('data', Buffer.from('[====================] 100%\n'));
		proc.emit('close', 0);
	});

	it('loadBitstreamStream should fail fast on invalid inputs', (done) => {
		const child = loadBitstreamStream(
			config,
			'',
			bitstreamPath,
			{},
			() => undefined,
			(result) => {
				expect(result.successful).toBe(false);
				expect(result.msg).toContain('No board or device has been specified');
				done();
			}
		);

		expect(child).toBeUndefined();
	});

	it('loadBitstreamStream should terminate the process when timeout expires', () => {
    	jest.useFakeTimers();

    	try {
        	const proc = new MockChildProcess();
        	childProcess.spawn.mockReturnValue(proc);

        	const callback = jest.fn();

        	loadBitstreamStream(
            	config,
            	boardId,
            	bitstreamPath,
            	{ timeoutSeconds: 2 },
            	() => undefined,
            	callback
        	);

        	jest.advanceTimersByTime(2000);

        	expect(proc.kill).toHaveBeenCalledTimes(1);

        	expect(callback).toHaveBeenCalledTimes(1);
        	expect(callback).toHaveBeenCalledWith({
            	successful: false,
            	msg: 'Bitstream load timed out.'
        	});

        	proc.emit('close', null);

        	expect(callback).toHaveBeenCalledTimes(1);
    	}
    	finally {
        	jest.useRealTimers();
    	}
	});

	it('loadBitstreamStream should call callback only once after a process error', () => {
    	const proc = new MockChildProcess();
    	childProcess.spawn.mockReturnValue(proc);

    	const callback = jest.fn();

    	loadBitstreamStream(
        	config,
        	boardId,
        	bitstreamPath,
        	{},
        	() => undefined,
        	callback
    	);

    	proc.emit('error', new Error('Process execution failed.'));
    	proc.emit('close', -1);

    	expect(callback).toHaveBeenCalledTimes(1);

    	expect(callback).toHaveBeenCalledWith({
        	successful: false,
        	msg: 'Process execution failed.'
    	});
	});

	it('loadBitstreamStream should detect progress split across chunks', () => {
    	const proc = new MockChildProcess();
    	childProcess.spawn.mockReturnValue(proc);

    	const progress: number[] = [];
    	const callback = jest.fn();

    	loadBitstreamStream(
        	config,
        	boardId,
        	bitstreamPath,
        	{},
        	() => undefined,
        	callback,
        	(percent) => progress.push(percent)
    	);

    	proc.stdout.emit('data', Buffer.from('[=========='));
    	proc.stdout.emit('data', Buffer.from('] 45%\n'));

    	expect(progress).toContain(45);

    	proc.emit('close', 0);

    	expect(callback).toHaveBeenCalledTimes(1);
    	expect(callback).toHaveBeenCalledWith({
        	successful: true,
        	msg: '[==========] 45%'
    	});
     });

	it('loadBitstreamStream should handle a synchronous spawn exception', (done) => {
		const spawnError = new Error('Failed to start OpenFPGALoader.');

		childProcess.spawn.mockImplementation(() => {
			throw spawnError;
		});

		const onOutput = jest.fn();

		const callback = jest.fn((result) => {
			expect(result).toEqual({
				successful: false,
				msg: 'Failed to start OpenFPGALoader.'
			});

		expect(onOutput).not.toHaveBeenCalled();
		expect(callback).toHaveBeenCalledTimes(1);

		done();
	});

	const child = loadBitstreamStream(
		config,
		boardId,
		bitstreamPath,
		{},
		onOutput,
		callback
	);

	expect(child).toBeUndefined();
	});
});