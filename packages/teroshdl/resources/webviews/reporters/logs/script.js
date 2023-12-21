const vscode = acquireVsCodeApi();

function createLogs(logs) {
    const tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = "";
    logs.forEach(log => {
        const row = document.createElement('tr');

        let locationText = "";
        if (log.file !== "") {
            row.setAttribute('title', `${log.file}:${log.line}`);
            locationText = `${reducePath(log.file)}:${log.line}`;
        }

        let levelClass = '';
        let symbol = '';

        switch (log.level) {
            case 'Error':
                levelClass = 'log-error log-level';
                symbol = '❌';
                break;
            case 'Warning':
                levelClass = 'log-warning log-level';
                symbol = '⚠️';
                break;
            case 'Critical Warning':
                levelClass = 'log-warning log-level';
                symbol = '⚠️';
                break;
            case 'Info':
                levelClass = 'log-info log-level';
                symbol = 'ℹ️';
                break;
        }
        symbol = "";

        row.innerHTML = `
  <td class="align-middle text-left ${levelClass}"><span class="log-symbol">${symbol}</span>${log.level}</td>
  <td class="align-middle text-center log-time">${log.time}</td>
  <td class="align-middle text-left log-description-text">${log.description}</td>
  <td class="align-middle text-left log-location log-location-text">${locationText}</td>
`;

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
    filterLogs();
}

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'update':
            createLogs(message.logList);
            break;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn').forEach(function (button) {
        button.addEventListener('click', function (event) {
            var checkbox = this.querySelector('.btn-checkbox');
            if (event.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }

            updateButtonState(button, checkbox.checked);
            filterLogs();
        });
    });

    document.querySelectorAll('.btn-checkbox').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            var button = this.closest('.btn');
            updateButtonState(button, this.checked);
            checkbox.addEventListener('change', filterLogs);
        });
    });

    function updateButtonState(button, isChecked) {
        const logLevelList = [];
        let onlyFileLogs = false;
        if (document.getElementById('checkbox-error').checked) {
            logLevelList.push('error');
        }
        if (document.getElementById('checkbox-warning').checked) {
            logLevelList.push('warning');
            logLevelList.push('critical warning');
        }
        if (document.getElementById('checkbox-info').checked) {
            logLevelList.push('info');
        }
        if (document.getElementById('checkbox-file').checked) {
            onlyFileLogs = true;
        }

        vscode.postMessage({
            command: 'updateLogLevel',
            logLevelList: logLevelList,
            onlyFileLogs: onlyFileLogs,
        });

        if (isChecked) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
        filterLogs();
    });
    filterLogs();
});

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

function filterLogs() {
    const searchInput = document.getElementById('search-input');
    const searchText = searchInput.value.toLowerCase();

    const showError = document.getElementById('checkbox-error').checked;
    const showWarning = document.getElementById('checkbox-warning').checked;
    const showInfo = document.getElementById('checkbox-info').checked;

    document.querySelectorAll('.table tbody tr').forEach(function (row) {
        const levelElement = row.querySelector('.log-level');
        const logElement = row.querySelector('.log-description-text');
        if (levelElement) {


            const level = levelElement.textContent.trim();
            const descriptionText = logElement.textContent.toLowerCase();


            if ((level.includes('Error') && showError) ||
                (level.includes('Warning') && showWarning) ||
                (level.includes('Info') && showInfo)) {
                if (descriptionText.includes(searchText)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            } else {
                row.style.display = 'none';
            }
        }
    });
}

function adjustTableHeight() {
    var windowHeight = window.innerHeight;
    var tableContainer = document.getElementById('scrollableTableContainer');
    var offsetTop = tableContainer.getBoundingClientRect().top;
    var maxTableHeight = windowHeight - offsetTop - 20;

    tableContainer.style.maxHeight = maxTableHeight + 'px';
    tableContainer.style.overflowY = 'auto';
}

window.onload = adjustTableHeight;
window.onresize = adjustTableHeight;