// (The MIT License)
//
// Copyright (c) 2014 Titus Wormer <tituswormer@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/* Expressions. */
const EXPRESSION_DOT = /\./;
const EXPRESSION_LAST_DOT = /\.[^.]*$/;

/* Allowed alignment values. */
const LEFT = 'l';
const RIGHT = 'r';
const CENTER = 'c';
const DOT = '.';
const NULL = '';

const ALLIGNMENT = [LEFT, RIGHT, CENTER, DOT, NULL];
const MIN_CELL_SIZE = 3;

/* Characters. */
const COLON = ':';
const DASH = '-';
const PIPE = '|';
const SPACE = ' ';
const NEW_LINE = '\n';

/* Create a table from a matrix of strings. */
export function get_table(table: any, options: any) {
    //Cells clear
    for (let i = 0; i < table.length; i++) {
        const row_i = table[i];
        for (let j = 0; j < row_i.length; j++) {
            const cell_i = row_i[j];
            table[i][j] = cell_i.trim();
        }
    }

    const settings = options || {};
    let delimiter = settings.delimiter;
    let start = settings.start;
    let end = settings.end;
    let alignment = settings.align;
    const calculateStringLength = settings.stringLength || lengthNoop;
    let cellCount = 0;
    let rowIndex = -1;
    const rowLength = table.length;
    let sizes = [];
    let align;
    let rule;
    let rows = [];
    let row;
    let cells: any;
    let index;
    let position;
    let size;
    let value;
    let spacing;
    let before;
    let after;

    alignment = alignment ? alignment.concat() : [];

    if (delimiter === null || delimiter === undefined) {
        delimiter = SPACE + PIPE + SPACE;
    }

    if (start === null || start === undefined) {
        start = PIPE + SPACE;
    }

    if (end === null || end === undefined) {
        end = SPACE + PIPE;
    }

    while (++rowIndex < rowLength) {
        row = table[rowIndex];

        index = -1;

        if (row.length > cellCount) {
            cellCount = row.length;
        }

        while (++index < cellCount) {
            position = row[index] ? dotindex(row[index]) : null;

            if (!sizes[index]) {
                sizes[index] = MIN_CELL_SIZE;
            }

            if (position > sizes[index]) {
                sizes[index] = position;
            }
        }
    }

    if (typeof alignment === 'string') {
        alignment = pad(cellCount, alignment).split('');
    }

    /* Make sure only valid alignments are used. */
    index = -1;

    while (++index < cellCount) {
        align = alignment[index];

        if (typeof align === 'string') {
            align = align.charAt(0).toLowerCase();
        }

        if (ALLIGNMENT.indexOf(align) === -1) {
            align = NULL;
        }

        alignment[index] = align;
    }

    rowIndex = -1;
    rows = [];

    while (++rowIndex < rowLength) {
        row = table[rowIndex];

        index = -1;
        cells = [];

        while (++index < cellCount) {
            value = row[index];

            value = stringify(value);

            if (alignment[index] === DOT) {
                position = dotindex(value);

                size =
                    sizes[index] +
                    (EXPRESSION_DOT.test(value) ? 0 : 1) -
                    (calculateStringLength(value) - position);

                cells[index] = value + pad(size - 1, undefined);
            } else {
                cells[index] = value;
            }
        }

        rows[rowIndex] = cells;
    }

    sizes = [];
    rowIndex = -1;

    while (++rowIndex < rowLength) {
        cells = rows[rowIndex];

        index = -1;

        while (++index < cellCount) {
            value = cells[index];

            if (!sizes[index]) {
                sizes[index] = MIN_CELL_SIZE;
            }

            size = calculateStringLength(value);

            if (size > sizes[index]) {
                sizes[index] = size;
            }
        }
    }

    rowIndex = -1;

    while (++rowIndex < rowLength) {
        cells = rows[rowIndex];

        index = -1;

        if (settings.pad !== false) {
            while (++index < cellCount) {
                value = cells[index];

                position = sizes[index] - (calculateStringLength(value) || 0);
                spacing = pad(position, undefined);

                if (alignment[index] === RIGHT || alignment[index] === DOT) {
                    value = spacing + value;
                } else if (alignment[index] === CENTER) {
                    position /= 2;

                    if (position % 1 === 0) {
                        before = position;
                        after = position;
                    } else {
                        before = position + 0.5;
                        after = position - 0.5;
                    }

                    value = pad(before, undefined) + value + pad(after, undefined);
                } else {
                    value += spacing;
                }

                cells[index] = value;
            }
        }

        rows[rowIndex] = cells.join(delimiter);
    }

    if (settings.rule !== false) {
        index = -1;
        rule = [];

        while (++index < cellCount) {
            /* When `pad` is false, make the rule the same size as the first row. */
            if (settings.pad === false) {
                value = table[0][index];
                spacing = calculateStringLength(stringify(value));
                spacing = spacing > MIN_CELL_SIZE ? spacing : MIN_CELL_SIZE;
            } else {
                spacing = sizes[index];
            }

            align = alignment[index];

            /* When `align` is left, don't add colons. */
            value = align === RIGHT || align === NULL ? DASH : COLON;
            value += pad(spacing - 2, DASH);
            value += align !== LEFT && align !== NULL ? COLON : DASH;

            rule[index] = value;
        }

        rows.splice(1, 0, rule.join(delimiter));
    }

    return start + rows.join(end + NEW_LINE + start) + end;
}

function stringify(value: any) {
    return value === null || value === undefined ? '' : String(value);
}

/* Get the length of `value`. */
function lengthNoop(value: any) {
    return String(value).length;
}

/* Get a string consisting of `length` `character`s. */
function pad(length: any, character: any) {
    return new Array(length + 1).join(character || SPACE);
}

/* Get the position of the last dot in `value`. */
function dotindex(value: any) {
    const match = EXPRESSION_LAST_DOT.exec(value);

    return match ? match.index + 1 : value.length;
}