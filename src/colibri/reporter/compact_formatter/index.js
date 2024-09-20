// eslint
// MIT
// Copyright OpenJS Foundation and other contributors, <www.openjsf.org>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * @fileoverview Compact reporter
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns the severity of warning or error
 * @param {Object} message message object to examine
 * @returns {string} severity level
 * @private
 */
function getMessageType(message) {
    if (message.fatal || message.severity === 2) {
        return "Error";
    }
    return "Warning";

}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results) {

    let output = "",
        total = 0;

    results.forEach(result => {

        const messages = result.messages;

        total += messages.length;

        messages.forEach(message => {

            output += `${result.filePath}: `;
            output += `line ${message.line || 0}`;
            output += `, col ${message.column || 0}`;
            output += `, ${getMessageType(message)}`;
            output += ` - ${message.message}`;
            output += message.ruleId ? ` (${message.ruleId})` : "";
            output += "\n";

        });

    });

    if (total > 0) {
        output += `\n${total} problem${total !== 1 ? "s" : ""}`;
    }

    return output;
};