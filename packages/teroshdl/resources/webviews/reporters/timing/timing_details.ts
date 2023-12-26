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
);

declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

////////////////////////////////////////////////////////////////////////////////
// Table
////////////////////////////////////////////////////////////////////////////////
let latestTimingReport: any[] = [];

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
        // Name
        const cellName = document.createElement('vscode-data-grid-cell');
        cellName.setAttribute('grid-column', "1");
        cellName.classList.add('numberCell');
        cellName.textContent = timingPath.index;
        row.appendChild(cellName);
        // Total Delay
        const cellTotalDelay = document.createElement('vscode-data-grid-cell');
        cellTotalDelay.setAttribute('grid-column', "2");
        cellTotalDelay.textContent = timingPath.total_delay.toFixed(3);;
        row.appendChild(cellTotalDelay);
        // Incremental Delay
        const cellIncrementalDelay = document.createElement('vscode-data-grid-cell');
        cellIncrementalDelay.setAttribute('grid-column', "3");
        cellIncrementalDelay.textContent = timingPath.incremental_delay.toFixed(3);;
        row.appendChild(cellIncrementalDelay);
        // Cell location
        const cellLocation = document.createElement('vscode-data-grid-cell');
        cellLocation.setAttribute('grid-column', "4");
        
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
        cellNameT.setAttribute('grid-column', "5");
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