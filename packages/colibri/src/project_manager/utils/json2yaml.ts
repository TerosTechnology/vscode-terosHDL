// The MIT License (MIT)
// Copyright (c) 2012 Jeff Su

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the 
// Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS 
// OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT 
// OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*
 * TODO, lots of concatenation (slow in js)
 */
const spacing = "  ";

function getType(obj: any) {
    const type = typeof obj;
    if (obj instanceof Array) {
        return 'array';
    } else if (type == 'string') {
        return 'string';
    } else if (type == 'boolean') {
        return 'boolean';
    } else if (type == 'number') {
        return 'number';
    } else if (type == 'undefined' || obj === null) {
        return 'null';
    } else {
        return 'hash';
    }
}

function convert(obj: any, ret: any) {
    const type = getType(obj);

    switch (type) {
        case 'array':
            convertArray(obj, ret);
            break;
        case 'hash':
            convertHash(obj, ret);
            break;
        case 'string':
            convertString(obj, ret);
            break;
        case 'null':
            ret.push('null');
            break;
        case 'number':
            ret.push(obj.toString());
            break;
        case 'boolean':
            ret.push(obj ? 'true' : 'false');
            break;
    }
}

function convertArray(obj: any, ret: any) {
    if (obj.length === 0) {
        ret.push('[]');
    }
    for (let i = 0; i < obj.length; i++) {

        const ele = obj[i];
        const recurse: string | any[] = [];
        convert(ele, recurse);

        for (let j = 0; j < recurse.length; j++) {
            ret.push((j == 0 ? "- " : spacing) + recurse[j]);
        }
    }
}

function convertHash(obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }, ret: string[]) {
    for (const k in obj) {
        const recurse: string | any[] = [];
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(k)) {
            const ele = obj[k];
            convert(ele, recurse);
            const type = getType(ele);
            if (type == 'string' || type == 'null' || type == 'number' || type == 'boolean') {
                ret.push(normalizeString(k) + ': ' + recurse[0]);
            } else {
                ret.push(normalizeString(k) + ': ');
                for (let i = 0; i < recurse.length; i++) {
                    ret.push(spacing + recurse[i]);
                }
            }
        }
    }
}

function normalizeString(str: string) {
    if (str.match(/^[\w]+$/)) {
        return str;
    } else {
        return '"' + str + '"';
        // return '"'+escape(str).replace(/%u/g,'\\u').replace(/%U/g,'\\U').replace(/%/g,'\\x')+'"';
    }
}

function convertString(obj: any, ret: any[]) {
    ret.push(normalizeString(obj));
}

export function convert_to_yaml(obj: any) {
    if (typeof obj == 'string') {
        obj = JSON.parse(obj);
    }

    const ret: any[] = [];
    convert(obj, ret);
    return ret.join("\n");
}
