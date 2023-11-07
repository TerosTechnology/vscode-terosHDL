// Copyright 2022
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

import r_html from './html_formatter/index';
import r_html_detailed from './html_detailed_formatter/detailed';
import r_junit from './junit_formatter/index';
import r_json from './json_formatter/index';
import r_compact from './compact_formatter/index';

export type i_error = {
    ruleId: string;
    severity: number;
    message: string;
    line: number;
    column: number;
    nodeType: string;
    messageId: string;
    endLine: number;
    endColumn: number;
}

export type i_file_error = {
    filePath: string;
    messages: i_error[];
    errorCount: number;
    fatalErrorCount: number;
    warningCount: number;
    fixableErrorCount: number;
    fixableWarningCount: number;
    source: string
}

export enum TYPE_REPORT {
    HTML = "html",
    HTML_DETAILED = "html_detailed",
    JSON = "json",
    JUNIT = "junit",
    COMPACT = "compact",
}

export function get_report(type: TYPE_REPORT, error_list: i_file_error[], linter_name: string): string {
    const linter_name_up = linter_name.toLocaleUpperCase();
    if (type === TYPE_REPORT.HTML) {
        return r_html(error_list, linter_name_up);
    }
    else if (type === TYPE_REPORT.HTML_DETAILED) {
        return r_html_detailed(error_list, linter_name_up);
    }
    else if (type === TYPE_REPORT.JUNIT) {
        return r_junit(error_list, linter_name_up);
    }
    else if (type === TYPE_REPORT.JSON) {
        return r_json(error_list);
    }
    else if (type === TYPE_REPORT.COMPACT) {
        return r_compact(error_list);
    }
    return '';
}