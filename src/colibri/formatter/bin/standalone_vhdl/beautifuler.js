"use strict";
const VHDLFormatter_1 = require("./VHDLFormatter");

class Beautifuler {
    beauty(input, options) {
        let new_line_after_symbols = new VHDLFormatter_1.NewLineSettings();
        new_line_after_symbols.newLineAfter = ["then", ";"];
        new_line_after_symbols.noNewLineAfter = ["port", "generic"];

        const result = this.beautifyIntern(input, options);
        if (result.err !== null) {
            // eslint-disable-next-line no-console
            console.error(`-- [ERROR]: could not beautify`);
        }
        return result.data;
    }
    beautifyIntern(input, settings) {
        try {
            const data = VHDLFormatter_1.beautify(input, settings);
            return {
                data,
                err: null,
            };
        }
        catch (err) {
            return {
                data: null,
                err,
            };
        }
    }

    getDefaultBeautifierSettings(newLineSettings, signAlignSettings = null, indentation = "  ") {
        return new VHDLFormatter_1.BeautifierSettings(false, false, false, true, signAlignSettings,
            "lowercase", "lowercase", indentation, newLineSettings, "\r\n", false);
    }
}

module.exports = {
    Beautifuler: Beautifuler
};
