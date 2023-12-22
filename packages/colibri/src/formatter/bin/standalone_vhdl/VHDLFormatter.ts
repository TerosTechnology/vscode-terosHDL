const ILEscape = "@@";
const ILCommentPrefix = ILEscape + "comments";
const ILIndentedReturnPrefix = ILEscape;
const ILQuote = "⨵";
const ILSingleQuote = "⦼";
const ILBackslash = "⨸";
const ILSemicolon = "⨴";

enum FormatMode {
    Default,
    EndsWithSemicolon,
    CaseWhen,
    IfElse,
    PortGeneric,
}

let Mode: FormatMode = FormatMode.Default;

export class NewLineSettings {
    newLineAfter: Array<string>;
    noNewLineAfter: Array<string>;
    constructor() {
        this.newLineAfter = [];
        this.noNewLineAfter = [];
    }

    newLineAfterPush(keyword: string) {
        this.newLineAfter.push(keyword);
    }

    noNewLineAfterPush(keyword: string) {
        this.noNewLineAfter.push(keyword);
    }

    push(keyword: string, addNewLine: string) {
        const str = addNewLine.toLowerCase();
        if (str == "none") {
            return;
        }
        else if (!str.startsWith("no")) {
            this.newLineAfterPush(keyword);
        }
        else {
            this.noNewLineAfterPush(keyword);
        }
    }
}

// function ConstructNewLineSettings(dict): NewLineSettings {
//     let settings: NewLineSettings = new NewLineSettings();
//     for (let key in dict) {
//         settings.push(key, dict[key]);
//     }
//     return settings;
// }

declare global {
    interface String {
        regexIndexOf: (pattern: RegExp, startIndex?: number) => number;
        regexLastIndexOf: (pattern: RegExp, startIndex: number) => number;
        reverse: () => string;
        regexStartsWith: (pattern: RegExp) => boolean;
        count: (text: string) => number;
        regexCount: (pattern: RegExp) => number;
        convertToRegexBlockWords: () => RegExp;
    }
    interface Array<T> {
        convertToRegexBlockWords: () => RegExp;
    }
}

String.prototype.regexCount = function (pattern): number {
    if (pattern.flags.indexOf("g") < 0) {
        pattern = new RegExp(pattern.source, pattern.flags + "g");
    }
    return (this.match(pattern) || []).length;
};

String.prototype.count = function (text): number {
    return this.split(text).length - 1;
};

String.prototype.regexStartsWith = function (pattern): boolean {
    const searchResult = this.search(pattern);
    return searchResult == 0;
};

String.prototype.regexIndexOf = function (pattern, startIndex) {
    startIndex = startIndex || 0;
    const searchResult = this.substr(startIndex).search(pattern);
    return (-1 === searchResult) ? -1 : searchResult + startIndex;
};

String.prototype.regexLastIndexOf = function (pattern, startIndex) {
    startIndex = startIndex === undefined ? this.length : startIndex;
    let searchResult = this.substr(0, startIndex).reverse().regexIndexOf(pattern, 0);
    return (-1 === searchResult) ? -1 : this.length - ++searchResult;
};

String.prototype.reverse = function () {
    return this.split('').reverse().join('');
};

String.prototype.convertToRegexBlockWords = function (): RegExp {
    const result = new RegExp("(" + this + ")([^\\w]|$)");
    return result;
};

Array.prototype.convertToRegexBlockWords = function (): RegExp {
    const wordsStr: string = this.join("|");
    const result = new RegExp("(" + wordsStr + ")([^\\w]|$)");
    return result;
};

function EscapeComments(arr: Array<string>): Array<string> {
    const comments : any[] = [];
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        const line: string = arr[i];
        const commentStartIndex = line.indexOf("--");
        if (commentStartIndex >= 0) {
            comments.push(line.substr(commentStartIndex));
            arr[i] = line.substr(0, commentStartIndex) + ILCommentPrefix + count;
            count++;
        }
    }
    return comments;
}

function ToLowerCases(arr: Array<string>) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toLowerCase();
    }
}

function ToUpperCases(arr: Array<string>) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toUpperCase();
    }
}

function ToCamelCases(arr: Array<string>) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0) + arr[i].slice(1).toLowerCase();
    }
}

function ReplaceKeyWords(text: string, keywords: Array<string>): string {
    for (let k = 0; k < keywords.length; k++) {
        text = text.replace(new RegExp("([^a-zA-Z0-9_@]|^)" + keywords[k] + "([^a-zA-Z0-9_]|$)", 'gi'), "$1" + keywords[k] + "$2");
    }
    return text;
}

function SetKeywordCase(input: string, keywordcase: string, keywords: string[]): string {
    const inputcase: string = keywordcase.toLowerCase();
    switch (inputcase) {
        case "lowercase":
            ToLowerCases(keywords);
            break;
        case "defaultcase":
            ToCamelCases(keywords);
            break;
        case "uppercase":
            ToUpperCases(keywords);
    }

    input = ReplaceKeyWords(input, keywords);
    return input;
}

export function SetNewLinesAfterSymbols(text: string, newLineSettings: NewLineSettings): string {
    if (newLineSettings == null) {
        return text;
    }
    if (newLineSettings.newLineAfter != null) {
        newLineSettings.newLineAfter.forEach(symbol => {
            const upper = symbol.toUpperCase();
            const rexString = "(" + upper + ")[ ]?([^ \r\n@])";
            let regex: any = null;
            if (upper.regexStartsWith(/\w/)) {
                regex = new RegExp("\\b" + rexString, "g");
            }
            else {
                regex = new RegExp(rexString, "g");
            }
            text = text.replace(regex, '$1\r\n$2');
            if (upper == "PORT") {
                text = text.replace(/\bPORT\b\s+MAP/, "PORT MAP");
            }
        });
    }
    if (newLineSettings.noNewLineAfter != null) {
        newLineSettings.noNewLineAfter.forEach(symbol => {
            const rexString = "(" + symbol.toUpperCase() + ")[ \r\n]+([^@])";
            let regex: any = null;
            if (symbol.regexStartsWith(/\w/)) {
                regex = new RegExp("\\b" + rexString, "g");
                text = text.replace(regex, '$1 $2');
            }
            else {
                regex = new RegExp(rexString, "g");
            }
            text = text.replace(regex, '$1 $2');
        });
    }
    return text;
}

export class signAlignSettings {
    isRegional: boolean;
    isAll: boolean;
    mode: string;
    keyWords: Array<string>;
    constructor(isRegional: boolean, isAll: boolean, mode: string, keyWords: Array<string>) {
        this.isRegional = isRegional;
        this.isAll = isAll;
        this.mode = mode;
        this.keyWords = keyWords;
    }
}

export class BeautifierSettings {
    RemoveComments: boolean;
    RemoveAsserts: boolean;
    CheckAlias: boolean;
    AlignComments: boolean;
    SignAlignSettings: signAlignSettings;
    KeywordCase: string;
    TypeNameCase: string;
    Indentation: string;
    NewLineSettings: NewLineSettings;
    EndOfLine: string;
    constructor(removeComments: boolean, removeReport: boolean, checkAlias: boolean, alignComments: boolean,
        signAlignSettings: signAlignSettings, keywordCase: string, typeNameCase: string, indentation: string,
        newLineSettings: NewLineSettings, endOfLine: string) {
        this.RemoveComments = removeComments;
        this.RemoveAsserts = removeReport;
        this.CheckAlias = checkAlias;
        this.AlignComments = alignComments;
        this.SignAlignSettings = signAlignSettings;
        this.KeywordCase = keywordCase;
        this.TypeNameCase = typeNameCase;
        this.Indentation = indentation;
        this.NewLineSettings = newLineSettings;
        this.EndOfLine = endOfLine;
    }
}

const KeyWords: Array<string> = ["ABS", "ACCESS", "AFTER", "ALIAS", "ALL", "AND", "ARCHITECTURE", "ARRAY", "ASSERT", "ATTRIBUTE", "BEGIN", "BLOCK", "BODY", "BUFFER", "BUS", "CASE", "COMPONENT", "CONFIGURATION", "CONSTANT", "CONTEXT", "COVER", "DISCONNECT", "DOWNTO", "DEFAULT", "ELSE", "ELSIF", "END", "ENTITY", "EXIT", "FAIRNESS", "FILE", "FOR", "FORCE", "FUNCTION", "GENERATE", "GENERIC", "GROUP", "GUARDED", "IF", "IMPURE", "IN", "INERTIAL", "INOUT", "IS", "LABEL", "LIBRARY", "LINKAGE", "LITERAL", "LOOP", "MAP", "MOD", "NAND", "NEW", "NEXT", "NOR", "NOT", "NULL", "OF", "ON", "OPEN", "OR", "OTHERS", "OUT", "PACKAGE", "PORT", "POSTPONED", "PROCEDURE", "PROCESS", "PROPERTY", "PROTECTED", "PURE", "RANGE", "RECORD", "REGISTER", "REJECT", "RELEASE", "REM", "REPORT", "RESTRICT", "RESTRICT_GUARANTEE", "RETURN", "ROL", "ROR", "SELECT", "SEQUENCE", "SEVERITY", "SHARED", "SIGNAL", "SLA", "SLL", "SRA", "SRL", "STRONG", "SUBTYPE", "THEN", "TO", "TRANSPORT", "TYPE", "UNAFFECTED", "UNITS", "UNTIL", "USE", "VARIABLE", "VMODE", "VPROP", "VUNIT", "WAIT", "WHEN", "WHILE", "WITH", "XNOR", "XOR"];
const TypeNames: Array<string> = ["BOOLEAN", "BIT", "CHARACTER", "INTEGER", "TIME", "NATURAL", "POSITIVE", "STRING", "STD_LOGIC", "STD_LOGIC_VECTOR"];

export function beautify(input: string, settings: BeautifierSettings) {
    const isEndBreak = input[input.length - 1] === "\n" || input[input.length - 1] === "\r";
    input = input.replace(/\r\n/g, "\n");
    input = input.replace(/\n/g, "\r\n");
    let arr = input.split("\r\n");
    let comments = EscapeComments(arr);
    const backslashes = escapeText(arr, "\\\\[^\\\\]+\\\\", ILBackslash);
    const quotes = escapeText(arr, '"([^"]+)"', ILQuote);
    const singleQuotes = escapeText(arr, "'[^']'", ILSingleQuote);
    RemoveLeadingWhitespaces(arr);

    input = arr.join("\r\n");
    if (settings.RemoveComments) {
        input = input.replace(/\r\n[ \t]*@@comments[0-9]+[ \t]*\r\n/g, '\r\n');
        input = input.replace(/@@comments[0-9]+/g, '');
        comments = [];
    }

    input = SetKeywordCase(input, "uppercase", KeyWords);
    input = SetKeywordCase(input, "uppercase", TypeNames);
    input = RemoveExtraNewLines(input);
    input = input.replace(/[\t ]+/g, ' ');
    input = input.replace(/\([\t ]+/g, '(');
    input = input.replace(/[ ]+;/g, ';');
    input = input.replace(/:[ ]*(PROCESS|ENTITY)/gi, ':$1');

    arr = input.split("\r\n");
    if (settings.RemoveAsserts) {
        RemoveAsserts(arr);//RemoveAsserts must be after EscapeQuotes
    }
    ReserveSemicolonInKeywords(arr);
    input = arr.join("\r\n");
    input = input.replace(/\b(PORT|GENERIC)\b\s+MAP/g, '$1 MAP');
    input = input.replace(/\b(PORT|PROCESS|GENERIC)\b[\s]*\(/g, '$1 (');
    const newLineSettings = settings.NewLineSettings;
    if (newLineSettings != null) {
        input = SetNewLinesAfterSymbols(input, newLineSettings);
        arr = input.split("\r\n");
        input = arr.join("\r\n");
    }

    input = input.replace(/([a-zA-Z0-9); ])\);(@@comments[0-9]+)?@@end/g, '$1\r\n);$2@@end');
    input = input.replace(/[ ]?([&=:\-<>+|*])[ ]?/g, ' $1 ');
    input = input.replace(/(\d+e) +([+-]) +(\d+)/g, '$1$2$3');// fix exponential notation format broken by previous step
    input = input.replace(/[ ]?([,])[ ]?/g, '$1 ');
    input = input.replace(/[ ]?(['"])(THEN)/g, '$1 $2');
    input = input.replace(/[ ]?(\?)?[ ]?(<|:|>|\/)?[ ]+(=)?[ ]?/g, ' $1$2$3 ');
    input = input.replace(/(IF)[ ]?([()])/g, '$1 $2');
    input = input.replace(/([()])[ ]?(THEN)/gi, '$1 $2');
    input = input.replace(/(^|[()])[ ]?(AND|OR|XOR|XNOR)[ ]*([(])/g, '$1 $2 $3');
    input = input.replace(/ ([-*/=+<>])[ ]*([-*/=+<>]) /g, " $1$2 ");
    //input = input.replace(/\r\n[ \t]+--\r\n/g, "\r\n");
    input = input.replace(/[ ]+/g, ' ');
    input = input.replace(/[ \t]+\r\n/g, "\r\n");
    input = input.replace(/\r\n\r\n\r\n/g, '\r\n');
    input = input.replace(/[\r\n\s]+$/g, '');
    input = input.replace(/[ \t]+\)/g, ')');
    input = input.replace(/\s*\)\s+RETURN\s+([\w]+;)/g, '\r\n) RETURN $1');//function(..)\r\nreturn type; -> function(..\r\n)return type;
    input = input.replace(/\)\s*(@@\w+)\r\n\s*RETURN\s+([\w]+;)/g, ') $1\r\n' + ILIndentedReturnPrefix + 'RETURN $2');//function(..)\r\nreturn type; -> function(..\r\n)return type;
    const keywordAndSignRegex = new RegExp("(\\b" + KeyWords.join("\\b|\\b") + "\\b) +([\\-+]) +(\\w)", "g");
    input = input.replace(keywordAndSignRegex, "$1 $2$3");// `WHEN - 2` -> `WHEN -2`
    input = input.replace(/([,|]) +([+-]) +(\w)/g, '$1 $2$3');// `1, - 2)` -> `1, -2)`
    input = input.replace(/(\() +([+-]) +(\w)/g, '$1$2$3');// `( - 2)` -> `(-2)`
    arr = input.split("\r\n");
    const result: (FormattedLine | FormattedLine[])[] = [];
    beautify3(arr, result, settings, 0, 0);
    const alignSettings = settings.SignAlignSettings;
    if (alignSettings != null && alignSettings.isAll) {
        AlignSigns(result, 0, result.length - 1, alignSettings.mode, settings.AlignComments);
    }

    arr = FormattedLineToString(result, settings.Indentation);
    input = arr.join("\r\n");
    input = input.replace(/@@RETURN/g, "RETURN");
    input = SetKeywordCase(input, settings.KeywordCase, KeyWords);
    input = SetKeywordCase(input, settings.TypeNameCase, TypeNames);

    input = replaceEscapedWords(input, quotes, ILQuote);
    input = replaceEscapedWords(input, singleQuotes, ILSingleQuote);
    input = replaceEscapedComments(input, comments, ILCommentPrefix);
    input = replaceEscapedWords(input, backslashes, ILBackslash);
    input = input.replace(new RegExp(ILSemicolon, "g"), ";");
    input = input.replace(/@@[a-z]+/g, "");
    const escapedTexts = new RegExp("[" + ILBackslash + ILQuote + ILSingleQuote + "]", "g");
    input = input.replace(escapedTexts, "");
    input = input.replace(/\r\n/g, settings.EndOfLine);

    if (isEndBreak) {
        input += settings.EndOfLine;
    }

    return input;
}

function replaceEscapedWords(input: string, arr: Array<string>, prefix: string): string {
    for (let i = 0; i < arr.length; i++) {
        const text = arr[i];
        const regex = new RegExp("(" + prefix + "){" + text.length + "}");
        input = input.replace(regex, text);
    }
    return input;
}

function replaceEscapedComments(input: string, arr: Array<string>, prefix: string): string {
    for (let i = 0; i < arr.length; i++) {
        input = input.replace(prefix + i, arr[i]);
    }
    return input;
}

function RemoveLeadingWhitespaces(arr: Array<string>) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace(/^\s+/, "");
    }
}

export class FormattedLine {
    Line: string;
    Indent: number;
    constructor(line: string, indent: number) {
        this.Line = line;
        this.Indent = indent;
    }
}

export function FormattedLineToString(arr: (FormattedLine | FormattedLine[])[], indentation: string): Array<string> {
    let result: Array<string> = [];
    if (arr == null) {
        return result;
    }
    if (indentation == null) {
        indentation = "";
    }
    arr.forEach(i => {
        if (i instanceof FormattedLine) {
            if (i.Line.length > 0) {
                result.push((Array(i.Indent + 1).join(indentation)) + i.Line);
            }
            else {
                result.push("");
            }
        }
        else {
            result = result.concat(FormattedLineToString(i, indentation));
        }
    });
    return result;
}

function GetCloseparentheseEndIndex(inputs: Array<string>, startIndex: number): number {
    let openParentheseCount = 0;
    let closeParentheseCount = 0;
    for (let i = startIndex; i < inputs.length; i++) {
        const input = inputs[i];
        openParentheseCount += input.count("(");
        closeParentheseCount += input.count(")");
        if (openParentheseCount > 0
            && openParentheseCount <= closeParentheseCount) {
            return i;
        }
    }
    return startIndex;
}

export function beautifyPortGenericBlock(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, parentEndIndex: number, indent: number, mode: string): [number, number] {
    const firstLine: string = inputs[startIndex];
    const regex = new RegExp("[\\w\\s:]*(" + mode + ")([\\s]|$)");
    if (!firstLine.regexStartsWith(regex)) {
        return [startIndex, parentEndIndex];
    }
    const firstLineHasParenthese: boolean = firstLine.indexOf("(") >= 0;
    let hasParenthese: boolean = firstLineHasParenthese;
    let blockBodyStartIndex = startIndex;
    const secondLineHasParenthese: boolean = startIndex + 1 < inputs.length && inputs[startIndex + 1].startsWith("(");
    if (secondLineHasParenthese) {
        hasParenthese = true;
        blockBodyStartIndex++;
    }
    let endIndex: number = hasParenthese ? GetCloseparentheseEndIndex(inputs, startIndex) : startIndex;
    if (endIndex != startIndex && firstLineHasParenthese) {
        inputs[startIndex] = inputs[startIndex].replace(/\b(PORT|GENERIC|PROCEDURE)\b([\w ]+)\(([\w() ]+)/, '$1$2(\r\n$3');
        const newInputs = inputs[startIndex].split("\r\n");
        if (newInputs.length == 2) {
            inputs[startIndex] = newInputs[0];
            inputs.splice(startIndex + 1, 0, newInputs[1]);
            endIndex++;
            parentEndIndex++;
        }
    }
    else if (endIndex > startIndex + 1 && secondLineHasParenthese) {
        inputs[startIndex + 1] = inputs[startIndex + 1].replace(/\(([\w() ]+)/, '(\r\n$1');
        const newInputs = inputs[startIndex + 1].split("\r\n");
        if (newInputs.length == 2) {
            inputs[startIndex + 1] = newInputs[0];
            inputs.splice(startIndex + 2, 0, newInputs[1]);
            endIndex++;
            parentEndIndex++;
        }
    }
    if (firstLineHasParenthese && inputs[startIndex].indexOf("MAP") > 0) {
        inputs[startIndex] = inputs[startIndex].replace(/([^\w])(MAP)\s+\(/g, '$1$2(');
    }
    result.push(new FormattedLine(inputs[startIndex], indent));
    if (secondLineHasParenthese) {
        let secondLineIndent = indent;
        if (endIndex == startIndex + 1) {
            secondLineIndent++;
        }
        result.push(new FormattedLine(inputs[startIndex + 1], secondLineIndent));
    }
    let blockBodyEndIndex = endIndex;
    const i = beautify3(inputs, result, settings, blockBodyStartIndex + 1, indent + 1, endIndex);
    if (inputs[i].startsWith(")")) {
        (<FormattedLine>result[i]).Indent--;
        blockBodyEndIndex--;
    }
    const alignSettings = settings.SignAlignSettings;
    if (alignSettings != null) {
        if (alignSettings.isRegional && !alignSettings.isAll
            && alignSettings.keyWords != null
            && alignSettings.keyWords.indexOf(mode) >= 0) {
            blockBodyStartIndex++;
            AlignSigns(result, blockBodyStartIndex, blockBodyEndIndex, alignSettings.mode, settings.AlignComments);
        }
    }
    return [i, parentEndIndex];
}

export function AlignSigns(result: (FormattedLine | FormattedLine[])[], startIndex: number, endIndex: number,
    mode: string, alignComments: boolean) {
    AlignSign_(result, startIndex, endIndex, ":", mode);
    AlignSign_(result, startIndex, endIndex, ":=", mode);
    AlignSign_(result, startIndex, endIndex, "<=", mode);
    AlignSign_(result, startIndex, endIndex, "=>", mode);
    if (alignComments) {
        AlignSign_(result, startIndex, endIndex, "@@comments", mode);
    }
}

function AlignSign_(result: (FormattedLine | FormattedLine[])[], startIndex: number, endIndex: number, symbol: string, mode: string) {
    let maxSymbolIndex = -1;
    let symbolIndices: any = {};
    let startLine = startIndex;
    const labelAndKeywords: Array<string> = [
        "([\\w\\s]*:(\\s)*PROCESS)",
        "([\\w\\s]*:(\\s)*POSTPONED PROCESS)",
        "([\\w\\s]*:\\s*$)",
        "([\\w\\s]*:.*\\s+GENERATE)"
    ];
    const labelAndKeywordsStr: string = labelAndKeywords.join("|");
    const labelAndKeywordsRegex = new RegExp("(" + labelAndKeywordsStr + ")([^\\w]|$)");
    for (let i = startIndex; i <= endIndex; i++) {
        const line = (<FormattedLine>result[i]).Line;
        if (symbol == ":" && line.regexStartsWith(labelAndKeywordsRegex)) {
            continue;
        }

        const regex = new RegExp("([\\s\\w\\\\]|^)" + symbol + "([\\s\\w\\\\]|$)");
        if (line.regexCount(regex) > 1) {
            continue;
        }
        const colonIndex = line.regexIndexOf(regex);
        if (colonIndex > 0) {
            maxSymbolIndex = Math.max(maxSymbolIndex, colonIndex);
            symbolIndices[i] = colonIndex;
        }
        else if ((mode != "local" && !line.startsWith(ILCommentPrefix) && line.length != 0)
            || (mode == "local")) {
            if (startLine < i - 1) // if cannot find the symbol, a block of symbols ends
            {
                AlignSign(result, startLine, i - 1, symbol, maxSymbolIndex, symbolIndices);
            }
            maxSymbolIndex = -1;
            symbolIndices = {};
            startLine = i;
        }
    }
    if (startLine < endIndex) // if cannot find the symbol, a block of symbols ends
    {
        AlignSign(result, startLine, endIndex, symbol, maxSymbolIndex, symbolIndices);
    }
}

export function AlignSign(result: any, _startIndex: number, _endIndex: number,
    _symbol: string, maxSymbolIndex = -1, symbolIndices: any = {}) {
    if (maxSymbolIndex < 0) {
        return;
    }

    for (const lineIndex in symbolIndices) {
        const symbolIndex: any = symbolIndices[lineIndex];
        if (symbolIndex == maxSymbolIndex) {
            continue;
        }
        const line: any = (<FormattedLine>result[lineIndex]).Line;
        (<FormattedLine>result[lineIndex]).Line = line.substring(0, symbolIndex)
            + (Array(maxSymbolIndex - symbolIndex + 1).join(" "))
            + line.substring(symbolIndex);
    }
}

export function beautifyCaseBlock(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, indent: number): number {
    if (!inputs[startIndex].regexStartsWith(/(.+:\s*)?(CASE)([\s]|$)/)) {
        return startIndex;
    }
    result.push(new FormattedLine(inputs[startIndex], indent));

    const i = beautify3(inputs, result, settings, startIndex + 1, indent + 2);
    (<FormattedLine>result[i]).Indent = indent;
    return i;
}

function getSemicolonBlockEndIndex(inputs: Array<string>, settings: BeautifierSettings, startIndex: number, parentEndIndex: number): [number, number] {
    let endIndex = 0;
    let openBracketsCount = 0;
    let closeBracketsCount = 0;
    for (let i = startIndex; i < inputs.length; i++) {
        const input = inputs[i];
        const indexOfSemicolon = input.indexOf(";");
        const splitIndex = indexOfSemicolon < 0 ? input.length : indexOfSemicolon + 1;
        const stringBeforeSemicolon = input.substring(0, splitIndex);
        let stringAfterSemicolon = input.substring(splitIndex);
        stringAfterSemicolon = stringAfterSemicolon.replace(new RegExp(ILCommentPrefix + "[0-9]+"), "");
        openBracketsCount += stringBeforeSemicolon.count("(");
        closeBracketsCount += stringBeforeSemicolon.count(")");
        if (indexOfSemicolon < 0) {
            continue;
        }
        if (openBracketsCount == closeBracketsCount) {
            endIndex = i;
            if (stringAfterSemicolon.trim().length > 0 && settings.NewLineSettings.newLineAfter.indexOf(";") >= 0) {
                inputs[i] = stringBeforeSemicolon;
                inputs.splice(i, 0, stringAfterSemicolon);
                parentEndIndex++;
            }
            break;
        }
    }
    return [endIndex, parentEndIndex];
}

export function beautifyComponentBlock(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, parentEndIndex: number, indent: number): [number, number] {
    let endIndex = startIndex;
    for (let i = startIndex; i < inputs.length; i++) {
        if (inputs[i].regexStartsWith(/END(\s|$)/)) {
            endIndex = i;
            break;
        }
    }
    result.push(new FormattedLine(inputs[startIndex], indent));
    if (endIndex != startIndex) {
        const actualEndIndex = beautify3(inputs, result, settings, startIndex + 1, indent + 1, endIndex);
        const incremental = actualEndIndex - endIndex;
        endIndex += incremental;
        parentEndIndex += incremental;
    }

    return [endIndex, parentEndIndex];
}

export function beautifySemicolonBlock(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, parentEndIndex: number, indent: number): [number, number] {
    let endIndex = startIndex;
    [endIndex, parentEndIndex] = getSemicolonBlockEndIndex(inputs, settings, startIndex, parentEndIndex);
    result.push(new FormattedLine(inputs[startIndex], indent));
    if (endIndex != startIndex) {
        beautify3(inputs, result, settings, startIndex + 1, indent + 1, endIndex);
    }

    return [endIndex, parentEndIndex];
}

export function beautify3(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, indent: number, endIndex?: number): number {
    let i: number;
    const regexOneLineBlockKeyWords = new RegExp(/(PROCEDURE)[^\w](?!.+[^\w]IS([^\w]|$))/);//match PROCEDURE..; but not PROCEDURE .. IS;
    const regexFunctionMultiLineBlockKeyWords = new RegExp(/(FUNCTION|IMPURE FUNCTION)[^\w](?=.+[^\w]IS([^\w]|$))/);//match FUNCTION .. IS; but not FUNCTION
    const blockMidKeyWords: Array<string> = ["BEGIN"];
    const blockStartsKeyWords: Array<string> = [
        "IF",
        "CASE",
        "ARCHITECTURE",
        "PROCEDURE",
        "PACKAGE",
        "(([\\w\\s]*:)?(\\s)*PROCESS)",// with label
        "(([\\w\\s]*:)?(\\s)*POSTPONED PROCESS)",// with label
        "(.*\\s*PROTECTED)",
        "(COMPONENT)",
        "(ENTITY(?!.+;))",
        "FOR",
        "WHILE",
        "LOOP",
        "(.*\\s*GENERATE)",
        "(CONTEXT[\\w\\s\\\\]+IS)",
        "(CONFIGURATION(?!.+;))",
        "BLOCK",
        "UNITS",
        "\\w+\\s+\\w+\\s+IS\\s+RECORD"];
    const blockEndsKeyWords: Array<string> = ["END", ".*\\)\\s*RETURN\\s+[\\w]+;"];
    const indentedEndsKeyWords: Array<string> = [ILIndentedReturnPrefix + "RETURN\\s+\\w+;"];
    const blockEndsWithSemicolon: Array<string> = [
        "(WITH\\s+[\\w\\s\\\\]+SELECT)",
        "([\\w\\\\]+[\\s]*<=)",
        "([\\w\\\\]+[\\s]*:=)",
        "FOR\\s+[\\w\\s,]+:\\s*\\w+\\s+USE",
        "REPORT"
    ];

    const newLineAfterKeyWordsStr: string = blockStartsKeyWords.join("|");
    const regexBlockMidKeyWords: RegExp = blockMidKeyWords.convertToRegexBlockWords();
    const regexBlockStartsKeywords = new RegExp("([\\w]+\\s*:\\s*)?(" + newLineAfterKeyWordsStr + ")([^\\w]|$)");
    const regexBlockEndsKeyWords: RegExp = blockEndsKeyWords.convertToRegexBlockWords();
    const regexBlockIndentedEndsKeyWords: RegExp = indentedEndsKeyWords.convertToRegexBlockWords();
    const regexblockEndsWithSemicolon: RegExp = blockEndsWithSemicolon.convertToRegexBlockWords();
    const regexMidKeyWhen: RegExp = "WHEN".convertToRegexBlockWords();
    const regexMidKeyElse: RegExp = "ELSE|ELSIF".convertToRegexBlockWords();
    if (endIndex == null) {
        endIndex = inputs.length - 1;
    }
    for (i = startIndex; i <= endIndex; i++) {
        if (indent < 0) {
            indent = 0;
        }
        const input: string = inputs[i].trim();
        if (input.regexStartsWith(regexBlockIndentedEndsKeyWords)) {
            result.push(new FormattedLine(input, indent));
            return i;
        }
        if (input.regexStartsWith(/COMPONENT\s/)) {
            const modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            [i, endIndex] = beautifyComponentBlock(inputs, result, settings, i, endIndex, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/\w+\s*:\s*ENTITY/)) {
            const modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            [i, endIndex] = beautifySemicolonBlock(inputs, result, settings, i, endIndex, indent);
            Mode = modeCache;
            continue;
        }
        if (Mode != FormatMode.EndsWithSemicolon && input.regexStartsWith(regexblockEndsWithSemicolon)) {
            const modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            [i, endIndex] = beautifySemicolonBlock(inputs, result, settings, i, endIndex, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/(.+:\s*)?(CASE)([\s]|$)/)) {
            const modeCache = Mode;
            Mode = FormatMode.CaseWhen;
            i = beautifyCaseBlock(inputs, result, settings, i, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*\bPORT\b([\s]|$)/)) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "PORT");
            continue;
        }
        if (input.regexStartsWith(/TYPE\s+\w+\s+IS\s+\(/)) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "IS");
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*GENERIC([\s]|$)/)) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "GENERIC");
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*PROCEDURE[\s\w]+\($/)) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "PROCEDURE");
            if (inputs[i].regexStartsWith(/.*\)[\s]*IS/)) {
                i = beautify3(inputs, result, settings, i + 1, indent + 1);
            }
            continue;
        }
        if (input.regexStartsWith(/FUNCTION[^\w]/)
            && input.regexIndexOf(/[^\w]RETURN[^\w]/) < 0) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "FUNCTION");
            if (!inputs[i].regexStartsWith(regexBlockEndsKeyWords)) {
                i = beautify3(inputs, result, settings, i + 1, indent + 1);
            } else {
                (<FormattedLine>result[i]).Indent++;
            }
            continue;
        }
        if (input.regexStartsWith(/IMPURE FUNCTION[^\w]/)
            && input.regexIndexOf(/[^\w]RETURN[^\w]/) < 0) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "IMPURE FUNCTION");
            if (!inputs[i].regexStartsWith(regexBlockEndsKeyWords)) {
                if (inputs[i].regexStartsWith(regexBlockIndentedEndsKeyWords)) {
                    (<FormattedLine>result[i]).Indent++;
                } else {
                    i = beautify3(inputs, result, settings, i + 1, indent + 1);
                }
            } else {
                (<FormattedLine>result[i]).Indent++;
            }
            continue;
        }
        result.push(new FormattedLine(input, indent));
        if (startIndex != 0
            && (input.regexStartsWith(regexBlockMidKeyWords)
                || (Mode != FormatMode.EndsWithSemicolon && input.regexStartsWith(regexMidKeyElse))
                || (Mode == FormatMode.CaseWhen && input.regexStartsWith(regexMidKeyWhen)))) {
            (<FormattedLine>result[i]).Indent--;
        }
        else if (startIndex != 0
            && (input.regexStartsWith(regexBlockEndsKeyWords))) {
            (<FormattedLine>result[i]).Indent--;
            return i;
        }
        if (input.regexStartsWith(regexOneLineBlockKeyWords)) {
            continue;
        }
        if (input.regexStartsWith(regexFunctionMultiLineBlockKeyWords)
            || input.regexStartsWith(regexBlockStartsKeywords)) {
            i = beautify3(inputs, result, settings, i + 1, indent + 1);
        }
    }
    i--;
    return i;
}

function ReserveSemicolonInKeywords(arr: Array<string>) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].match(/FUNCTION|PROCEDURE/) != null) {
            arr[i] = arr[i].replace(/;/g, ILSemicolon);
        }
    }
}

export function RemoveAsserts(arr: Array<string>) {
    let need_semi = false;
    let inAssert = false;
    let n = 0;
    for (let i = 0; i < arr.length; i++) {
        const has_semi: boolean = arr[i].indexOf(";") >= 0;
        if (need_semi) {
            arr[i] = '';
        }
        n = arr[i].indexOf("ASSERT ");
        if (n >= 0) {
            inAssert = true;
            arr[i] = '';
        }
        if (!has_semi) {
            if (inAssert) {
                need_semi = true;
            }
        }
        else {
            need_semi = false;
        }
    }
}

function escapeText(arr: Array<string>, regex: string, escapedChar: string): Array<string> {
    const quotes: Array<string> = [];
    const regexEpr = new RegExp(regex, "g");
    for (let i = 0; i < arr.length; i++) {
        const matches = arr[i].match(regexEpr);
        if (matches != null) {
            for (let j = 0; j < matches.length; j++) {
                const match = matches[j];
                arr[i] = arr[i].replace(match, escapedChar.repeat(match.length));
                quotes.push(match);
            }
        }
    }
    return quotes;
}

function RemoveExtraNewLines(input: any) {
    input = input.replace(/(?:\r\n|\r|\n)/g, '\r\n');
    input = input.replace(/ \r\n/g, '\r\n');
    input = input.replace(/\r\n\r\n\r\n/g, '\r\n');
    return input;
}