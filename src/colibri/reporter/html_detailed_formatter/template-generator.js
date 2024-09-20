/**
 * @fileoverview Template generator will create the full HTML template for the reporter based on the results and options passed in.
 * The code in this file is based on the code written by Julian Laval for eslint's default reporter
 * and inspired by Sven Piller's eslint-formatter-markdown
 * @author Marcelo S. Portugal <marceloquarion@gmail.com>
 */
'use strict';

const _ = require('lodash'),
	fs = require('fs'),
	path = require('path');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const styles = _.template(fs.readFileSync(path.join(__dirname, 'helpers/styles.html'), 'utf-8')),
	scripts = _.template(fs.readFileSync(path.join(__dirname, 'helpers/scripts.html'), 'utf-8')),
	pageTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/main-page.html'), 'utf-8')),
	resultTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/details/result.html'), 'utf-8')),
	resultDetailsTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/details/details.html'), 'utf-8')),
	resultSummaryTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/details/summary.html'), 'utf-8')),
	codeWrapperTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/details/code/code-wrapper.html'), 'utf-8')),
	codeTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/details/code/code.html'), 'utf-8')),
	issueTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/details/code/issue.html'), 'utf-8')),
	summaryDetailsTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/summary/summary-details.html'), 'utf-8')),
	rulesTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/summary/rules.html'), 'utf-8')),
	mostProblemsTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/summary/most-problems.html'), 'utf-8')),
	filesTemplate = _.template(fs.readFileSync(path.join(__dirname, 'templates/summary/files.html'), 'utf-8'));

/**
 * Given a word and a count, append an s if count is not one.
 * @param {string} word A word in its singular form.
 * @param {int} count A number controlling whether word should be pluralized.
 * @returns {string} The original word with an s on the end if count is not one.
 */
function pluralize(word, count) {
	return (count === 1 ? word : `${word}s`);
}

/**
 * Renders text along the template of x problems (x errors, x warnings)
 * @param {int} totalErrors Total errors
 * @param {int} totalWarnings Total warnings
 * @returns {string} The formatted string, pluralized where necessary
 */
function renderSummary(totalErrors, totalWarnings) {
	const totalProblems = totalErrors + totalWarnings;
	let renderedText = `${totalProblems} ${pluralize('problem', totalProblems)}`;

	if (totalProblems !== 0) {
		renderedText += ` (${totalErrors} ${pluralize('error', totalErrors)}, ${totalWarnings} ${pluralize('warning', totalWarnings)})`;
	}
	return renderedText;
}

/**
 * Takes in a rule Id and returns the correct link for the description
 * @param {string} ruleId A eslint rule Id
 * @return {string} The link to the rules description
 */
function getRuleLink(ruleId) {
	// let ruleLink = `http://eslint.org/docs/rules/${ruleId}`;

	// if (_.startsWith(ruleId, 'angular')) {
	// 	ruleId = ruleId.replace('angular/', '');
	// 	ruleLink = `https://github.com/Gillespie59/eslint-plugin-angular/blob/master/docs/${ruleId}.md`;
	// } else if (_.startsWith(ruleId, 'lodash')) {
	// 	ruleId = ruleId.replace('lodash/', '');
	// 	ruleLink = `https://github.com/wix/eslint-plugin-lodash/blob/master/docs/rules/${ruleId}.md`;
	// }
	// return ruleLink;
	return '';
}

/**
 * Generates the summary details section by only including the necessary tables.
 * @param {object} rules An object with all of the rules sorted by type
 * @param {array} [problemFiles] An optional object with the top 5 worst files being linted
 * @param {String} currDir Current working directory
 * @return {string} HTML string of all the summary detail tables that are needed
 */
function renderSummaryDetails(rules, problemFiles, currDir) {
	let summaryDetails = '<div class="row">';

	// errors exist
	if (rules['2']) {
		summaryDetails += summaryDetailsTemplate({
			ruleType: 'error',
			topRules: renderRules(rules['2'])
		});
	}

	// warnings exist
	if (rules['1']) {
		summaryDetails += summaryDetailsTemplate({
			ruleType: 'warning',
			topRules: renderRules(rules['1'])
		});
	}

	summaryDetails += '</div>';

	// files with problems exist
	if (!_.isEmpty(problemFiles)) {
		summaryDetails += mostProblemsTemplate({
			files: renderProblemFiles(problemFiles, currDir)
		});
	}

	return summaryDetails;
}

/**
 * Get the color based on whether there are errors/warnings...
 * @param {int} totalErrors Total errors
 * @param {int} totalWarnings Total warnings
 * @returns {string} The color code (success = green, warning = yellow, error = red)
 */
function renderColor(totalErrors, totalWarnings) {
	if (totalErrors !== 0) {
		return severityString(2);
	} else if (totalWarnings !== 0) {
		return severityString(1);
	}
	return severityString(0);
}

/**
 * Converts the severity number to a string
 * @param {int} severity severity number
 * @returns {string} The color string based on severity number (0 = success, 1 = warning, 2 = error)
 */
function severityString(severity) {
	const colors = ['success', 'warning', 'error'];

	return colors[severity];
}

/**
 * Renders an issue
 * @param {object} message a message object with an issue
 * @returns {string} HTML string of an issue
 */
function renderIssue(message) {
	return issueTemplate({
		severity: severityString(message.severity),
		severityName: message.severity === 1 ? 'Warning' : 'Error',
		lineNumber: message.line,
		column: message.column,
		message: _.escape(message.message),
		ruleId: '',
		ruleLink: ''
	});
}

/**
 * Renders the source code for the files that have issues and marks the lines that have problems
 * @param {string} sourceCode source code string
 * @param {array} messages array of messages with the problems in a file
 * @param {int} parentIndex file index
 * @returns {string} HTML string of the code file that is being linted
 */
function renderSourceCode(sourceCode, messages, parentIndex) {
	return codeWrapperTemplate({
		parentIndex,
		sourceCode: _.map(sourceCode.split('\n'), function (code, lineNumber) {
			const lineMessages = _.filter(messages, { line: lineNumber + 1 }),
				severity = _.get(lineMessages[0], 'severity') || 0;

			let template = '';

			// checks if there is a problem on the current line and renders it
			if (!_.isEmpty(lineMessages)) {
				template += _.map(lineMessages, renderIssue).join('');
			}

			// adds a line of code to the template (with line number and severity color if appropriate
			template += codeTemplate({
				lineNumber: lineNumber + 1,
				code,
				severity: severityString(severity)
			});

			return template;
		}).join('\n')
	});
}

/**
 * Renders the result details with tabs for source code and a summary
 * @param {string} sourceCode source code string
 * @param {array} messages array of messages with the problems in a file
 * @param {int} parentIndex file index
 * @returns {string} HTML string of result details
 */
function renderResultDetails(sourceCode, messages, parentIndex) {
	const topIssues = messages.length < 10 ? '' : _.groupBy(messages, 'severity');

	return resultDetailsTemplate({
		parentIndex,
		sourceCode: renderSourceCode(sourceCode, messages, parentIndex),
		detailSummary: resultSummaryTemplate({
			topIssues: renderSummaryDetails(topIssues),
			issues: _.map(messages, renderIssue).join('')
		})
	});
}

/**
 * Creates the test results HTML
 * @param {Array} results Test results.
 * @param {String} currDir Current working directory
 * @returns {string} HTML string describing the results.
 */
function renderResults(results, currDir) {
	return _.map(results, function (result, index) {
		let template = resultTemplate({
			index,
			fileId: _.camelCase(result.filePath),
			filePath: result.filePath.replace(currDir, ''),
			color: renderColor(result.errorCount, result.warningCount),
			summary: renderSummary(result.errorCount, result.warningCount),
			problemCount: result.errorCount + result.warningCount
		});

		// only renders the source code if there are issues present in the file
		if (!_.isEmpty(result.messages)) {
			// reads the file to get the source code if the source is not provided
			const sourceCode = _.escape(result.source || fs.readFileSync(result.filePath, 'utf8'));

			template += renderResultDetails(sourceCode, result.messages, index);
		}

		return template;
	}).join('\n');
}

/**
 * @param {Array} rules Test rules.
 * @returns {string} HTML string describing the rules.
 */
function renderRules(rules) {
	return _(rules).groupBy('ruleId').map(function (ruleMessages, ruleId) {
		return {
			ruleId,
			ruleCount: _.size(ruleMessages),
			ruleLink: getRuleLink(ruleId)
		};
	}).orderBy(['ruleCount'], ['desc']).take(5).map(rulesTemplate).value().join('\n');
}

/**
 * Renders list of problem files
 * @param {array} files
 * @param {String} currDir Current working directory
 * @return {string} HTML string describing the files.
 */
function renderProblemFiles(files, currDir) {
	return _.map(files, function (fileDetails) {
		return filesTemplate({
			fileId: _.camelCase(fileDetails.filePath),
			filePath: fileDetails.filePath.replace(currDir, ''),
			errorCount: fileDetails.errorCount,
			warningCount: fileDetails.warningCount
		});
	}).join('\n');
}

/**
 * Writes a file at the specified location and removes the specified strings
 * @param {string} filePath The path of the new file
 * @param {string} fileContent The contents of the new file
 * @param {RegExp} regex A regex with strings to be removed from the fileContent
 * @return {void} n/a
 */
function writeFile(filePath, fileContent, regex) {
	fs.writeFileSync(filePath, fileContent.replace(regex, ''));
}

/**
 * Returns the output directory for the report
 * @return {String} the output directory for the report
 */
function getOutputDir() {
	const outputOptionIdx = process.argv.indexOf('-o') !== -1 ? process.argv.indexOf('-o') : process.argv.indexOf('--output-file'),
		argsLength = process.argv.length,
		outputDirOption = '--outputDirectory=';

	if (process.argv[1].includes('grunt')) {
		for (var i = 2; i < argsLength; i++) {
			if (process.argv[i].includes(outputDirOption)) {
				return `/${process.argv[i].replace(outputDirOption, '')}`;
			}
		}
		return '/reports/'; // defaults to a reports folder if nothing else is found
	} else if (outputOptionIdx !== -1) {
		return `/${process.argv[outputOptionIdx + 1].split('/')[0]}/`;
	}

	return '';
}

/**
 * Returns the full path to the report
 * @param currWorkingDir
 * @return {string} the full path to the report
 */
function getOutputPath(currWorkingDir) {
	return currWorkingDir + getOutputDir();
}

/**
 * Creates a styles.css and a main.js file for the report
 * @param {string} currWorkingDir The current working directory
 */
function buildScriptsAndStyleFiles(outputPath) {
	const stylesRegex = /<style>|<\/style>/gi,
		scriptsRegex = /<script type="text\/javascript">|<\/script>/gi;

	// creates the report directory if it doesn't exist
	if (!fs.existsSync(outputPath)) {
		fs.mkdirSync(outputPath);
	}

	// create the styles.css and main.js files
	writeFile(`${outputPath}styles.css`, styles(), stylesRegex);
	writeFile(`${outputPath}main.js`, scripts(), scriptsRegex);
}

/**
 * Returns whether or not the output directory is known
 * @return {boolean} Whether or not the output directory is known
 */
function isOutputDirKnown() {
	return process.argv.length > 0 && getOutputDir() !== '';
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports.generateTemplate = function generateTemplate(results, isMultiOn, linter_name) {
	const currWorkingDir = process.cwd() || '',
		rules = _(results).map('messages').flatten().groupBy('severity').value(), // rule messages grouped by severity
		problemFiles = _(results).reject({
			errorCount: 0,
			warningCount: 0
		}).orderBy(['errorCount', 'warningCount'], ['desc', 'desc']).take(5).value(); // top five files with most problems

	let totalErrors = 0,
		totalWarnings = 0;

	if (isMultiOn && isOutputDirKnown()) {
		const outputPath = getOutputPath(currWorkingDir);

		buildScriptsAndStyleFiles(outputPath);
	}

	// Iterate over results to get totals
	results.forEach(function (result) {
		totalErrors += result.errorCount;
		totalWarnings += result.warningCount;
	});

	return pageTemplate({
		linter_name: linter_name,
		reportColor: renderColor(totalErrors, totalWarnings),
		reportSummary: renderSummary(totalErrors, totalWarnings),
		summaryDetails: renderSummaryDetails(rules, problemFiles, currWorkingDir),
		results: renderResults(results, currWorkingDir),
		styles: isMultiOn && isOutputDirKnown() ? '<link rel="stylesheet" href="./styles.css">' : styles(),
		scripts: isMultiOn && isOutputDirKnown() ? '<script type="text/javascript" src="./main.js"></script>' : scripts()
	});
};
