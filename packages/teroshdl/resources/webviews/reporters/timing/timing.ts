// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of TerosHDL
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
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import {
    provideVSCodeDesignSystem,
    vsCodeButton,
    DataGrid,
    vsCodeDataGrid,
    vsCodeDataGridCell,
    vsCodeDataGridRow,
    vsCodeDivider,
    vsCodeTextField,
    vsCodeTag,
    vsCodeLink,
    vsCodeCheckbox,
} from "@vscode/webview-ui-toolkit";


provideVSCodeDesignSystem().register(
    vsCodeButton(),
    vsCodeDataGrid(),
    vsCodeDataGridCell(),
    vsCodeDataGridRow(),
    vsCodeDivider(),
    vsCodeTextField(),
    vsCodeTag(),
    vsCodeLink(),
    vsCodeCheckbox(),
);

declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

////////////////////////////////////////////////////////////////////////////////
// Table
////////////////////////////////////////////////////////////////////////////////
let latestTimingReport: any[] = [];
const selectionList: number[] = [];

function createTimingReport(timingReportList) {
    latestTimingReport = timingReportList;

    const tableBody = document.getElementById('basic-grid');
    if (!tableBody) {
        return;
    }

    // Clean table
    while (tableBody.children.length > 1) {
        const lastChild = tableBody.lastChild;
        if (lastChild) {
            tableBody.removeChild(lastChild);
        }
    }

    timingReportList.forEach((timingPath) => {
        const row = document.createElement('vscode-data-grid-row');

        // Selection
        const cellSelection = document.createElement('vscode-data-grid-cell');
        cellSelection.setAttribute('grid-column', "1");

        const checkSelection = document.createElement('vscode-checkbox') as HTMLInputElement;
        checkSelection.setAttribute('id', `check-${timingPath.index}`);
        checkSelection.addEventListener('change', function () {
            const indexNumber = <number>timingPath.index;
            if (checkSelection.checked) {
                selectionList.push(indexNumber);
            }
            else {
                const index = selectionList.findIndex(item => item === indexNumber);
                if (index !== -1) {
                    selectionList.splice(index, 1);
                }
            }
            updateDecorators();
        });
        if (selectionList.includes(timingPath.index)) {
            checkSelection.checked = true;
        }

        cellSelection.appendChild(checkSelection);
        row.appendChild(cellSelection);

        // Name
        const cellName = document.createElement('vscode-data-grid-cell');
        cellName.setAttribute('grid-column', "2");

        const linkName = document.createElement('vscode-link');
        linkName.textContent = "Path #" + timingPath.index;

        linkName.addEventListener('click', function (e: any) {
            vscode.postMessage({
                command: 'showPathDetails',
                pathName: timingPath.name
            });
        });

        cellName.appendChild(linkName);
        row.appendChild(cellName);
        // Levels
        const cellLevels = document.createElement('vscode-data-grid-cell');
        cellLevels.textContent = timingPath.levelsNumber;
        cellLevels.setAttribute('grid-column', "3");
        row.appendChild(cellLevels);
        // Slack
        const cellSlack = document.createElement('vscode-data-grid-cell');
        cellSlack.setAttribute('grid-column', "4");
        cellSlack.textContent = timingPath.slack.toFixed(3);;
        if (timingPath.slack < 0) {
            cellSlack.style.color = '#DC3545';
            cellSlack.style.fontWeight = 'bold';
        }
        row.appendChild(cellSlack);
        // From
        const cellFrom = document.createElement('vscode-data-grid-cell');
        cellFrom.setAttribute('grid-column', "5");
        cellFrom.classList.add('hover-cell');
        cellFrom.addEventListener('click', function () {
            vscode.postMessage({
                command: 'open',
                file: timingPath.fromPath,
                line: timingPath.fromLine
            });
        });
        cellFrom.setAttribute('title', `${timingPath.fromPath}:${timingPath.fromLine}`);

        const linkFrom = document.createElement('vscode-link');
        linkFrom.textContent = timingPath.fromNodeName;

        cellFrom.appendChild(linkFrom);
        row.appendChild(cellFrom);
        // To
        const cellTo = document.createElement('vscode-data-grid-cell');
        cellTo.setAttribute('grid-column', "6");
        cellTo.classList.add('hover-cell');
        cellTo.setAttribute('title', `${timingPath.toPath}:${timingPath.toLine}`);
        cellTo.addEventListener('click', function () {
            vscode.postMessage({
                command: 'open',
                file: timingPath.toPath,
                line: timingPath.toLine
            });
        });

        const linkTo = document.createElement('vscode-link');
        linkTo.textContent = timingPath.toNodeName;

        cellTo.appendChild(linkTo);
        row.appendChild(cellTo);
        tableBody.appendChild(row);
    });
}

window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.command) {
        case 'update':
            createTimingReport(message.timingReport);
            break;
    }
});

////////////////////////////////////////////////////////////////////////////////
// Decorators
////////////////////////////////////////////////////////////////////////////////
function updateDecorators() {
    vscode.postMessage({
        command: 'updateDecorators',
        selectionList: selectionList,
    });
}

////////////////////////////////////////////////////////////////////////////////
// Generate Button
////////////////////////////////////////////////////////////////////////////////
function generate() {
    const nElement = document.getElementById('num-paths') as HTMLInputElement;
    const numPaths = nElement.value;
    if (!numPaths) {
        return;
    }
    vscode.postMessage({
        command: 'generate',
        numPaths: parseInt(numPaths)
    });
}

const genButton = document.getElementById('generate-button');
if (genButton) {
    genButton.addEventListener('click', function () {
        generate();
    });
}

const textArea = document.getElementById("num-paths");
if (textArea) {
    textArea.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            generate();
        }
    });
}

////////////////////////////////////////////////////////////////////////////////
// Sort Table
////////////////////////////////////////////////////////////////////////////////
const idList = ['h0', 'h1', 'h2', 'h3', 'h4'];
var currentDir = {};

for (const id of idList) {
    const headerElement = document.getElementById(id);
    if (headerElement) {
        headerElement.addEventListener('click', function () {
            sortTable(parseInt(id[1]), headerElement);
        });
    }
}

function sortTimingReport(dir: string, key: string, isString: boolean) {
    if (dir === 'asc') {
        if (isString) {
            latestTimingReport.sort((a, b) => a[key].localeCompare(b[key]));
        }
        else {
            latestTimingReport.sort((a, b) => a[key] - b[key]);
        }
    }
    else {
        if (isString) {
            latestTimingReport.sort((a, b) => b[key].localeCompare(a[key]));
        }
        else {
            latestTimingReport.sort((a, b) => b[key] - a[key]);
        }
    }
}

function sortTable(column, headerElement) {
    let dir = currentDir[column] === 'asc' ? 'desc' : 'asc';
    currentDir[column] = dir;

    resetSortingIcons();

    if (column === 0) {
        sortTimingReport(dir, "index", false);
    }
    else if (column === 1) {
        sortTimingReport(dir, "levelsNumber", false);
    }
    else if (column === 2) {
        sortTimingReport(dir, "slack", false);
    }
    else if (column === 3) {
        sortTimingReport(dir, "fromNodeName", true);
    }
    else if (column === 4) {
        sortTimingReport(dir, "toNodeName", true);
    }
    createTimingReport(latestTimingReport);
    updateSortingIcon(headerElement, dir);
}

function resetSortingIcons() {
    var headers = document.querySelectorAll('.sorting');
    headers.forEach(function (header) {
        header.innerHTML = '&#8597;';
    });
}

function updateSortingIcon(headerElement, direction) {
    var icon = headerElement.querySelector('.sorting');
    icon.innerHTML = direction === 'asc' ? '&#8593;' : '&#8595;';
}