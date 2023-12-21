const vscode = acquireVsCodeApi();

function createTimingReport(timingReportList) {
    const noClickID = 'noClick';
    const tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = '';
    let = index = 1;
    timingReportList.forEach((timingPath) => {
        const row = document.createElement('tr');
        row.classList.add('pointerStyle');
        row.addEventListener('click', function (e) {
            if (e.target.closest(noClickID)) {
                return;
            }
            vscode.postMessage({
                command: 'showPathDetails',
                pathName: timingPath.name
            });
        });

        // Name
        const cellName = document.createElement('td');
        cellName.classList.add('numberCell');
        cellName.textContent = index;
        row.appendChild(cellName);
        // Levels
        const cellLevels = document.createElement('td');
        cellLevels.textContent = timingPath.levelsNumber;
        row.appendChild(cellLevels);
        // Launch clock
        const cellLaunchClock = document.createElement('td');
        row.appendChild(cellLaunchClock);
        // Latch clock
        const cellLatchClock = document.createElement('td');
        row.appendChild(cellLatchClock);
        // SDC Exception
        const cellSDCException = document.createElement('td');
        row.appendChild(cellSDCException);
        // Data Arrival Time
        const cellDataArrival = document.createElement('td');
        row.appendChild(cellDataArrival);
        // Data Required Time
        const cellRequiredArrival = document.createElement('td');
        row.appendChild(cellRequiredArrival);
        // Slack
        const cellSlack = document.createElement('td');
        row.appendChild(cellSlack);
        // Worst-Case Operating Conditions
        const cellWorstCase = document.createElement('td');
        row.appendChild(cellWorstCase);
        // From
        const cellFrom = document.createElement('td');
        cellFrom.id = noClickID;
        cellFrom.textContent = timingPath.fromNodeName;
        cellFrom.classList.add('hover-cell');
        cellFrom.setAttribute('title', `${timingPath.fromPath}:${timingPath.fromLine}`);
        cellFrom.addEventListener('click', function () {
            vscode.postMessage({
                command: 'open',
                file: timingPath.fromPath,
                line: timingPath.fromLine
            });
        });
        row.appendChild(cellFrom);
        // To
        const cellTo = document.createElement('td');
        cellTo.id = noClickID;
        cellTo.textContent = timingPath.toNodeName;
        cellTo.classList.add('hover-cell');
        cellTo.setAttribute('title', `${timingPath.toPath}:${timingPath.toLine}`);
        cellTo.addEventListener('click', function () {
            vscode.postMessage({
                command: 'open',
                file: timingPath.toPath,
                line: timingPath.toLine
            });
        });
        row.appendChild(cellTo);
        tableBody.appendChild(row);
        index++;
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
