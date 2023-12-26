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
    vsCodeCheckbox
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
    vsCodeCheckbox()
);

declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

////////////////////////////////////////////////////////////////////////////////
// Table
////////////////////////////////////////////////////////////////////////////////
let latestTimingReport: any[] = [];
let selectionList: number[] = [];

function create(timingReportList) {
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
        cellSelection.appendChild(checkSelection);
        row.appendChild(cellSelection);
        // Name
        const cellName = document.createElement('vscode-data-grid-cell');
        cellName.setAttribute('grid-column', "2");
        cellName.classList.add('numberCell');
        cellName.textContent = timingPath.index;
        row.appendChild(cellName);
        // Total Delay
        const cellTotalDelay = document.createElement('vscode-data-grid-cell');
        cellTotalDelay.setAttribute('grid-column', "3");
        cellTotalDelay.textContent = timingPath.total_delay.toFixed(3);;
        row.appendChild(cellTotalDelay);
        // Incremental Delay
        const cellIncrementalDelay = document.createElement('vscode-data-grid-cell');
        cellIncrementalDelay.setAttribute('grid-column', "4");
        cellIncrementalDelay.textContent = timingPath.incremental_delay.toFixed(3);;
        row.appendChild(cellIncrementalDelay);
        // Cell location
        const cellLocation = document.createElement('vscode-data-grid-cell');
        cellLocation.setAttribute('grid-column', "5");
        
        const linkLocation = document.createElement('vscode-link');
        linkLocation.textContent = timingPath.cell_location;
        linkLocation.setAttribute('title', `${timingPath.path}:${timingPath.line}`);
        linkLocation.addEventListener('click', function (e: any) {
            vscode.postMessage({
                command: 'open',
                file: timingPath.path,
                line: timingPath.line
            });
        });

        cellLocation.appendChild(linkLocation);
        row.appendChild(cellLocation);
        // Name
        const cellNameT = document.createElement('vscode-data-grid-cell');
        cellNameT.setAttribute('grid-column', "6");
        cellNameT.textContent = timingPath.name;
        row.appendChild(cellNameT);

        tableBody.appendChild(row);
    });
}

window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.command) {
        case 'update':
            create(message.pathDetails);
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

const selectAllButton = document.getElementById('select-all') as HTMLInputElement;
if (selectAllButton) {
    selectAllButton.addEventListener('change', function () {
        if (selectAllButton.checked) {
            selectAll();
        }
        else {
            deSelectAll();
        }
    });
}

function selectAll() {
    for (const timingPath of latestTimingReport) {
        const checkSelection = document.getElementById(`check-${timingPath.index}`) as HTMLInputElement;
        if (checkSelection) {
            checkSelection.checked = true;
        }
    }

    selectionList = [];
    latestTimingReport.forEach((timingPath) => {
        selectionList.push(timingPath.index);
    });
    updateDecorators();
}

function deSelectAll() {
    for (const timingPath of latestTimingReport) {
        const checkSelection = document.getElementById(`check-${timingPath.index}`) as HTMLInputElement;
        if (checkSelection) {
            checkSelection.checked = false;
        }
    }

    selectionList = [];
    updateDecorators();
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
    create(latestTimingReport);
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