import { Base_linter } from "./base_linter";
import * as common from "./common";

export class Nvc extends Base_linter {
    binary = "nvc";
    extra_cmd = "";
    argumentToCheck = ["--version"];

    constructor() {
        super();
    }

    delete_previus_lint() {
        return true;
    }

    async lint(file: string, options: common.l_options): Promise<common.l_error[]> {
        const result = await this.exec_linter(file, options);
        return this.parse_output(result.stderr, file);
    }

    get_command(file: string, options: common.l_options) {
        const norm_bin = this.getToolPath(options.path);
        const args = [options.argument.trim(), '-a', `"${file}"`].filter((arg) => arg !== '');
        return `${norm_bin} ${args.join(' ')}`;
    }

    parse_output(output: string, file: string): common.l_error[] {
        try {
            const errors: common.l_error[] = [];
            file = file.replace(/\\ /g, ' ');
            const errors_str = output;

            // NVC diagnostic format, for example:
            // ** Error: no visible declaration for STD_LOGICA
            //     > c:\path\file.vhd:11
            //     |
            //  11 |   signal test : std_logica;
            //     |                ^^^^^^^^^^ did you mean STD_LOGIC?
            const nvcRegex = new RegExp(
                [
                    '^\\*\\*\\s+(?<severity>Error|Warning):\\s+(?<error_message>.*?)\\r?\\n',
                    '\\s*>\\s*(?<filename>.*?):(?<line_number>\\d+)\\r?\\n',
                    '(?:\\s*\\|\\r?\\n)?',
                    '(?:\\s*\\d+\\s*\\|(?<source_line>.*?)\\r?\\n)?',
                    '(?:\\s*\\|(?<caret_line>.*?)(?:\\r?\\n|$))?'
                ].join(''),
                'gm'
            );
            let match;
            while ((match = nvcRegex.exec(errors_str)) !== null) {
                if (match.index === nvcRegex.lastIndex) {
                    nvcRegex.lastIndex++;
                }

                const line = parseInt(<string>match.groups?.line_number.trim());
                const caretLine = match.groups?.caret_line ?? '';
                const caretIndex = caretLine.indexOf('^');
                const column = caretIndex >= 0 ? caretIndex : 0;
                const severity = match.groups?.severity === 'Warning'
                    ? common.LINTER_ERROR_SEVERITY.WARNING
                    : common.LINTER_ERROR_SEVERITY.ERROR;

                errors.push({
                    severity: severity,
                    description: <string>match.groups?.error_message.trim(),
                    code: '',
                    location: {
                        file: (match.groups?.filename ?? file).trim(),
                        position: [line - 1, column]
                    }
                });
            }

            // Fallback for one-line formats with explicit line and column.
            const fallbackRegex = new RegExp(
                [
                    '^(?<filename>.*):(?=\\d)(?<line_number>\\d+):(?<column_number>\\d+):',
                    '\\s*(?:(?<is_warning>warning:)\\s*)?(?<error_message>.*)'
                ].join(''),
                'gm'
            );
            let fallbackMatch;
            while ((fallbackMatch = fallbackRegex.exec(errors_str)) !== null) {
                if (fallbackMatch.index === fallbackRegex.lastIndex) {
                    fallbackRegex.lastIndex++;
                }

                const line = parseInt(<string>fallbackMatch.groups?.line_number.trim());
                const column = parseInt(<string>fallbackMatch.groups?.column_number.trim());
                const severity = fallbackMatch.groups?.is_warning !== undefined
                    ? common.LINTER_ERROR_SEVERITY.WARNING
                    : common.LINTER_ERROR_SEVERITY.ERROR;

                const duplicated = errors.some((error) => {
                    return error.location.file === (fallbackMatch.groups?.filename ?? file).trim()
                        && error.location.position[0] === line - 1
                        && error.location.position[1] === column - 1
                        && error.description === <string>fallbackMatch.groups?.error_message.trim();
                });

                if (!duplicated) {
                    errors.push({
                        severity: severity,
                        description: <string>fallbackMatch.groups?.error_message.trim(),
                        code: '',
                        location: {
                            file: (fallbackMatch.groups?.filename ?? file).trim(),
                            position: [line - 1, column - 1]
                        }
                    });
                }
            }

            return errors;
        } catch (error) {
            return [];
        }
    }
}
