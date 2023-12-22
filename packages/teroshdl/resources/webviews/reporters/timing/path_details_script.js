const vscode = acquireVsCodeApi();

function create(pathDetailsList) {
    const tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = '';
    pathDetailsList.forEach((pathDetail) => {
        const row = document.createElement('tr');
        row.setAttribute('title', `${pathDetail.path}:${pathDetail.line}`);
        row.addEventListener('click', function () {
            vscode.postMessage({
                command: 'open',
                file: pathDetail.path,
                line: pathDetail.line
            });
        });
        // Total Delay
        const cellTotalDelay = document.createElement('td');
        cellTotalDelay.textContent = pathDetail.total_delay.toFixed(3);;
        row.appendChild(cellTotalDelay);
        // Incremental Delay
        const cellIncrementalDelay = document.createElement('td');
        cellIncrementalDelay.textContent = pathDetail.incremental_delay.toFixed(3);;
        row.appendChild(cellIncrementalDelay);
        // Cell location
        const cellLocation = document.createElement('td');
        cellLocation.textContent = pathDetail.cell_location;
        row.appendChild(cellLocation);
        // Name
        const cellName = document.createElement('td');
        cellName.textContent = pathDetail.name;
        row.appendChild(cellName);
        // // Path
        // const cellPath = document.createElement('td');
        // cellPath.textContent = `${pathDetail.path}:${pathDetail.line}`;
        // row.appendChild(cellPath);

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