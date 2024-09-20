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
 * @fileoverview jUnit Reporter
 * @author Jamund Ferguson
 */
"use strict";

const xmlEscape = require("./xml-escape");
const path = require("path");

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

/**
 * Returns a full file path without extension
 * @param {string} filePath input file path
 * @returns {string} file path without extension
 * @private
 */
function pathWithoutExt(filePath) {
  return path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)));
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results, linter_name = "TerosHDL") {

  let output = "";

  output += "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
  output += "<testsuites>\n";

  results.forEach(result => {

    const messages = result.messages;
    const classname = pathWithoutExt(result.filePath);

    if (messages.length > 0) {
      output += `<testsuite package="${linter_name}" time="0" tests="${messages.length}" errors="${messages.length}" name="${result.filePath}">\n`;
      messages.forEach(message => {
        const type = message.fatal ? "error" : "failure";

        output += `<testcase time="0" name="${linter_name}" classname="${classname}">`;
        // output += `<testcase time="0" name="${linter_name}.${message.ruleId || "unknown"}" classname="${classname}">`;
        output += `<${type} message="${xmlEscape(message.message || "")}">`;
        output += "<![CDATA[";
        output += `line ${message.line || 0}, col `;
        output += `${message.column || 0}, ${getMessageType(message)}`;
        output += ` - ${xmlEscape(message.message || "")}`;
        output += (message.ruleId ? ` (${message.ruleId})` : "");
        output += "]]>";
        output += `</${type}>`;
        output += "</testcase>\n";
      });
      output += "</testsuite>\n";
    } else {
      output += `<testsuite package="${linter_name}" time="0" tests="1" errors="0" name="${result.filePath}">\n`;
      output += `<testcase time="0" name="${result.filePath}" classname="${classname}" />\n`;
      output += "</testsuite>\n";
    }

  });

  output += "</testsuites>\n";

  return output;
};