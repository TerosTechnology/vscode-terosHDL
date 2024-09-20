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

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'update':
            createLogs(message.logList);
            break;
    }
});

let latestLogs: any[] = [];
function createLogs(logs) {
    const tableBody = document.getElementById('basic-grid');
    if (!tableBody) {
        return;
    }

    latestLogs = logs;

    // Clean table
    while (tableBody.children.length > 1) {
        const lastChild = tableBody.lastChild;
        if (lastChild) {
            tableBody.removeChild(lastChild);
        }
    }

    logs.forEach(log => {
        const row = document.createElement('vscode-data-grid-row');

        let locationText = "";
        if (log.file !== "") {
            console.log(log.file);
            row.setAttribute('title', `${log.file}:${log.line}`);
            locationText = `${reducePath(log.file)}:${log.line}`;
        }

        let levelClass = '';
        let symbol = '';

        switch (log.level) {
            case 'Error':
                levelClass = '#f33e5e';
                symbol = '❌';
                break;
            case 'Warning':
                levelClass = '#f49e0b';
                symbol = '⚠️';
                break;
            case 'Critical Warning':
                levelClass = '#f49e0b';
                symbol = '⚠️';
                break;
            case 'Info':
                levelClass = '#0ba5e8';
                symbol = 'ℹ️';
                break;
            case 'Extra Info':
                levelClass = '#0ba5e8';
                symbol = 'ℹ️';
                break;
        }

        // Level
        const cellLevel = document.createElement('vscode-data-grid-cell');
        cellLevel.setAttribute('grid-column', "1");
        cellLevel.textContent = log.level;
        cellLevel.style.fontWeight = 'bold';
        cellLevel.style.color = levelClass;
        row.appendChild(cellLevel);

        // Time
        const cellTime = document.createElement('vscode-data-grid-cell');
        cellTime.setAttribute('grid-column', "2");
        cellTime.textContent = log.time;
        row.appendChild(cellTime);

        // Description
        const cellDescription = document.createElement('vscode-data-grid-cell');
        cellDescription.setAttribute('grid-column', "3");
        cellDescription.textContent = log.description;
        cellDescription.classList.add('log-description-text');
        row.appendChild(cellDescription);

        // Location
        const cellLocation = document.createElement('vscode-data-grid-cell');
        cellLocation.setAttribute('grid-column', "4");

        const linkLocation = document.createElement('vscode-link');
        linkLocation.textContent = locationText;

        cellLocation.appendChild(linkLocation);
        row.appendChild(cellLocation);

        row.addEventListener('click', () => {
            if (log.file === "") {
                return;
            }
            vscode.postMessage({
                command: 'open',
                file: log.file,
                line: log.line,
            });
        });


        tableBody.appendChild(row);
    });
    filterByText();
}

////////////////////////////////////////////////////////////////////////////////
// Filter
////////////////////////////////////////////////////////////////////////////////
// Checkboxes
const checkList = ["checkbox-error", "checkbox-warning", "checkbox-info"];
for (const check of checkList) {
    const checkbox = document.getElementById(check);
    if (checkbox) {
        checkbox.addEventListener('change', function () {
            filterLogLevel();
        });
    }
}

function filterLogLevel() {
    const logLevelList: string[] = [];

    let checkbox = document.getElementById('checkbox-error') as HTMLInputElement;
    if (checkbox.checked) {
        logLevelList.push('error');
    }

    checkbox = document.getElementById('checkbox-warning') as HTMLInputElement;
    if (checkbox.checked) {
        logLevelList.push('warning');
        logLevelList.push('critical warning');
    }

    checkbox = document.getElementById('checkbox-info') as HTMLInputElement;
    if (checkbox.checked) {
        logLevelList.push('info');
    }

    vscode.postMessage({
        command: 'updateLogLevel',
        logLevelList: logLevelList,
        onlyFileLogs: false,
    });
}

// Input
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', function () {
        filterByText();
    });
}

function filterByText() {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const searchText = searchInput?.value.toLowerCase();

    document.querySelectorAll('vscode-data-grid-row').forEach(function (row) {
        const logElement = row.querySelector('.log-description-text');
        if (logElement) {
            const descriptionText = logElement.textContent?.toLowerCase();

            if (descriptionText?.includes(searchText) || searchText === '') {
                (row as HTMLElement).style.display = '';
            } else {
                (row as HTMLElement).style.display = 'none';
            }
        }
    });
}

////////////////////////////////////////////////////////////////////////////////
// Utils
////////////////////////////////////////////////////////////////////////////////
function reducePath(path) {
    const maxLength = 50;
    if (path.length <= maxLength) {
        return path;
    }

    // Detect the separator (depends on the operating system)
    const separator = path.includes('/') ? '/' : '\\';

    // Separate the file name from the rest of the path
    let parts = path.split(separator);
    let fileName = parts.pop(); // Extracts the file name

    // Join the remaining parts
    let restOfPath = parts.join(separator);

    // Calculate the available length for the rest of the path
    let remainingLength = maxLength - fileName.length - 3; // 3 for the ellipsis

    if (remainingLength < 1) {
        // If there's no space for the path, return only the file name
        return fileName;
    }

    // Shorten the part of the path and add the file name at the end
    let shortenedPath = restOfPath.substring(0, remainingLength / 2) + '...' +
        restOfPath.substring(restOfPath.length - remainingLength / 2) +
        separator + fileName;

    return shortenedPath;
}