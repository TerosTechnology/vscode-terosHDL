import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {e_tools_nextpnr_target_family, get_default_config} from '../../../../src/colibri/config/config_declaration';
import {getConstraintsFile, validateJsonFile} from '../../../../src/colibri/project_manager/tool/nextpnr/utils';

describe('nextpnr utilities', () => {
    let tempDirectory: string;

    beforeEach(() => {
        tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'teroshdl-nextpnr-utils-'));
    });

    afterEach(() => {
        fs.rmSync(tempDirectory, { recursive: true, force: true });
    });

    function createFile(fileName: string, contents = ''): string {
        const filePath = path.join(tempDirectory, fileName);
        fs.writeFileSync(filePath, contents);
        return filePath;
    }

    describe('validateJsonFile', () => {
        it('rejects an empty or nonexistent path', () => {
            expect(validateJsonFile('')).toMatchObject({ valid: false });
            expect(validateJsonFile(path.join(tempDirectory, 'missing.json')))
                .toMatchObject({ valid: false, error: expect.stringContaining('does not exist') });
        });

        it('accepts an existing JSON file with a case-insensitive extension', () => {
            const filePath = createFile('netlist.JSON', '{"modules":{}}');
            expect(validateJsonFile(filePath)).toEqual({ valid: true });
        });

        it('rejects a path with an incorrect extension', () => {
            const filePath = createFile('netlist.txt', '{"modules":{}}');
            expect(validateJsonFile(filePath))
                .toMatchObject({ valid: false, error: expect.stringContaining('.json') });
        });

        it('rejects malformed JSON content', () => {
            const filePath = createFile('netlist.json', '{invalid json}');
            expect(validateJsonFile(filePath))
                .toMatchObject({ valid: false, error: expect.stringContaining('invalid JSON') });
        });

        it('rejects a directory even if its name ends in .json', () => {
            const directoryPath = path.join(tempDirectory, 'folder.json');
            fs.mkdirSync(directoryPath);
            expect(validateJsonFile(directoryPath)).toMatchObject({ valid: false });
        });
    });

    describe('getConstraintsFile', () => {
        const baseConfig = (targetFamily = e_tools_nextpnr_target_family.ice40) => ({
            ...get_default_config().tools.nextpnr,
            target_family: targetFamily
        });

        it('returns the configured PCF for iCE40 and allows it to be omitted', () => {
            const pcfFile = createFile('board.pcf');
            expect(getConstraintsFile({ ...baseConfig(), pcf_file: pcfFile }, e_tools_nextpnr_target_family.ice40))
                .toBe(pcfFile);
            expect(getConstraintsFile(baseConfig(), e_tools_nextpnr_target_family.ice40)).toBeNull();
        });

        it('returns the configured LPF for ECP5 and allows it to be omitted', () => {
            const lpfFile = createFile('board.lpf');
            expect(getConstraintsFile({
                ...baseConfig(e_tools_nextpnr_target_family.ecp5),
                lpf_file: lpfFile
            }, e_tools_nextpnr_target_family.ecp5))
                .toBe(lpfFile);
            expect(getConstraintsFile(
                baseConfig(e_tools_nextpnr_target_family.ecp5),
                e_tools_nextpnr_target_family.ecp5
            )).toBeNull();
        });

        it('does not require constraints for generic', () => {
            expect(getConstraintsFile(
                baseConfig(e_tools_nextpnr_target_family.generic),
                e_tools_nextpnr_target_family.generic
            )).toBeNull();
        });

        it('detects constraints configured for the wrong family', () => {
            expect(() => getConstraintsFile({ ...baseConfig(), lpf_file: 'board.lpf' },
                e_tools_nextpnr_target_family.ice40)).toThrow('lpf_file is only valid for the ECP5');
            expect(() => getConstraintsFile({
                ...baseConfig(e_tools_nextpnr_target_family.ecp5),
                pcf_file: 'board.pcf'
            },
                e_tools_nextpnr_target_family.ecp5)).toThrow('pcf_file is only valid for the iCE40');
            expect(() => getConstraintsFile({
                ...baseConfig(e_tools_nextpnr_target_family.generic),
                pcf_file: 'board.pcf'
            },
                e_tools_nextpnr_target_family.generic)).toThrow('not supported for the generic');
        });

        it('rejects configured constraints that are missing or have the wrong extension', () => {
            expect(() => getConstraintsFile({ ...baseConfig(), pcf_file: path.join(tempDirectory, 'missing.pcf') },
                e_tools_nextpnr_target_family.ice40)).toThrow('does not exist');
            const wrongExtension = createFile('board.txt');
            expect(() => getConstraintsFile({
                ...baseConfig(e_tools_nextpnr_target_family.ecp5),
                lpf_file: wrongExtension
            },
                e_tools_nextpnr_target_family.ecp5)).toThrow('.lpf extension');
        });

        it('rejects an unsupported target family', () => {
            expect(() => getConstraintsFile(
                baseConfig('unknown' as e_tools_nextpnr_target_family),
                'unknown' as e_tools_nextpnr_target_family
            ))
                .toThrow('Unsupported nextpnr target family');
        });

        it('rejects a requested family that conflicts with config.target_family', () => {
            expect(() => getConstraintsFile({
                ...baseConfig(),
                target_family: e_tools_nextpnr_target_family.ice40
            }, e_tools_nextpnr_target_family.ecp5)).toThrow('does not match requested family');
        });
    });
});