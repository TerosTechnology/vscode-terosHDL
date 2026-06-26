import { Nvc } from '../../src/colibri/linter/nvc';
import { LINTER_ERROR_SEVERITY } from '../../src/colibri/linter/common';

describe('NVC parser', () => {
    it('parses multiline diagnostics with caret column', () => {
        const parser = new Nvc();
        const output = [
            '** Error: no visible declaration for STD_LOGICA',
            '    > c:\\test_04022026\\test_test.vhd:11',
            '    |',
            ' 11 |   signal test : std_logica;',
            '    |                ^^^^^^^^^^ did you mean STD_LOGIC?'
        ].join('\n');

        const result = parser.parse_output(output, 'c:\\test_04022026\\test_test.vhd');

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            severity: LINTER_ERROR_SEVERITY.ERROR,
            description: 'no visible declaration for STD_LOGICA',
            code: '',
            location: {
                file: 'c:\\test_04022026\\test_test.vhd',
                position: [10, 16]
            }
        });
    });

    it('parses multiline warnings without caret as column zero', () => {
        const parser = new Nvc();
        const output = [
            '** Warning: declaration of FOO hides previous declaration',
            '    > c:\\test_04022026\\test_test.vhd:7',
            '    |',
            '  7 |   signal foo : std_logic;'
        ].join('\n');

        const result = parser.parse_output(output, 'c:\\test_04022026\\test_test.vhd');

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            severity: LINTER_ERROR_SEVERITY.WARNING,
            description: 'declaration of FOO hides previous declaration',
            code: '',
            location: {
                file: 'c:\\test_04022026\\test_test.vhd',
                position: [6, 0]
            }
        });
    });

    it('parses one-line fallback diagnostics with explicit column', () => {
        const parser = new Nvc();
        const output = 'c:\\test_04022026\\test_test.vhd:13:7: warning: identifier expected';

        const result = parser.parse_output(output, 'c:\\test_04022026\\test_test.vhd');

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            severity: LINTER_ERROR_SEVERITY.WARNING,
            description: 'identifier expected',
            code: '',
            location: {
                file: 'c:\\test_04022026\\test_test.vhd',
                position: [12, 6]
            }
        });
    });
});